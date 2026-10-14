(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const tokyo = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'});
  function dateParts(now = new Date()) {
    return Object.fromEntries(tokyo.formatToParts(now).filter(p => p.type !== 'literal').map(p => [p.type,Number(p.value)]));
  }
  function selectFlower(now = new Date()) {
    const {year,month,day} = dateParts(now);
    // 絶対日数で循環。年をまたいでも、うるう日でも前日と別のエントリー。
    const days = Math.floor(Date.UTC(year,month-1,day)/86400000);
    const anchor = Math.floor(Date.UTC(2026,9,14)/86400000);
    const flowers = window.FLEURIA_FLOWERS;
    const index = ((days-anchor)%flowers.length+flowers.length)%flowers.length;
    return {flower:flowers[index],year,month,day,key:`${year}-${month}-${day}`};
  }
  let previousDate = '';
  function updateDaily(now = new Date()) {
    const {flower,year,month,day,key} = selectFlower(now);
    if (key === previousDate) return;
    previousDate = key;
    const weekday = new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',weekday:'short'}).format(now);
    $('#daily-date').textContent = `${year}.${String(month).padStart(2,'0')}.${String(day).padStart(2,'0')}（${weekday}） / TODAY'S FLOWER`;
    $('#daily-name').textContent = flower.name;
    $('#daily-en').textContent = flower.en;
    $('#daily-meaning').textContent = `「${flower.meaning}」`;
    $('#daily-description').textContent = flower.description;
    $('#daily-image').src = flower.image;
    $('#daily-image').alt = flower.name;
    $('#daily-link').dataset.flower = flower.name;
    $('#year').textContent = year;
  }
  updateDaily();
  // 非アクティブのタブでタイマーが遅延した場合も、復帰時に即更新。
  setInterval(updateDaily,15000);
  document.addEventListener('visibilitychange',() => { if(!document.hidden) updateDaily(); });
  window.addEventListener('pageshow',() => updateDaily());
  window.FleuriaDaily = {dateParts,selectFlower};

  const menu = $('.menu-toggle'), nav = $('#navigation');
  function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}
  menu.addEventListener('click',() => { const open = nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open)); });
  nav.addEventListener('click',e => {if(e.target.closest('a')) closeMenu();});
  document.addEventListener('keydown',e => {if(e.key==='Escape' && nav.classList.contains('open')) {closeMenu();menu.focus();}});
  window.addEventListener('resize',() => {if(window.innerWidth>760) closeMenu();});

  function filterProducts(category) {
    let count = 0;
    $$('.product').forEach(card => {const show = category==='all'||card.dataset.category.split(' ').includes(category);card.hidden=!show;if(show)count++;});
    $$('[data-filter]').forEach(button => {const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    $('#collection-status').textContent=`${count}件のプランを表示`;
  }
  $$('[data-filter]').forEach(b=>b.addEventListener('click',()=>filterProducts(b.dataset.filter)));
  $$('[data-select-category]').forEach(a=>a.addEventListener('click',()=>filterProducts(a.dataset.selectCategory)));

  const productInfo = {
    '季節のブーケ':['個人向けギフト','季節の花をやさしい色合いで束ねます。ご希望の色、贈る相手、ご予算をお聞かせください。'],
    'ガーベラの花束':['個人向けギフト','明るいガーベラを中心に束ねるギフト。誕生日やありがとうの贈り物に。'],
    '受付の季節装花':['企業・法人向け','受付やオフィスに合わせた花器と季節の花をご提案。設置場所やご希望の頻度もご相談ください。'],
    '祝賀ローズアレンジ':['祝賀・お祝い','開店や就任などのお祝いに。名札の有無、お届け日、ご予算をお知らせください。'],
    'イベント・テーブル装花':['イベント・空間装花','会場やテーブルの雰囲気に合わせて装花をプランニング。会場、卓数、設営時間をご相談ください。'],
    '法人ギフトアレンジ':['企業・法人向け','取引先へのご挨拶やお祝いに。お届け先、名札、色味のご希望をお聞かせください。']
  };
  let selectedProduct='';
  const dialog=$('#product-dialog');
  $$('[data-product]').forEach(b=>b.addEventListener('click',()=>{selectedProduct=b.dataset.product;$('#dialog-title').textContent=selectedProduct;$('#dialog-description').textContent=productInfo[selectedProduct][1];dialog.showModal();}));
  $('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
  function prepareInquiry(category,text){$('#inquiry-category').value=category;$('[name="message"]').value=text;$('#inquiry-result').hidden=true;}
  $('#dialog-contact').addEventListener('click',()=>{prepareInquiry(productInfo[selectedProduct][0],`${selectedProduct}について相談したいです。\n`);dialog.close();});
  $$('[data-inquiry]').forEach(a=>a.addEventListener('click',()=>prepareInquiry(a.dataset.inquiry,'')));
  $('#daily-link').addEventListener('click',()=>prepareInquiry('個人向けギフト',`${$('#daily-link').dataset.flower}を使ったお花について相談したいです。\n`));
  $('#inquiry-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);$('#inquiry-summary').textContent=`FLEURIA お花のご相談\n\n用途：${data.get('category')}\n希望日：${data.get('date')||'未定'}\n\n${String(data.get('message')).trim()}`;$('#inquiry-result').hidden=false;$('#copy-status').textContent='';$('#inquiry-result').scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});
  $('#copy-inquiry').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#inquiry-summary').textContent);$('#copy-status').textContent='コピーしました。';}catch{const range=document.createRange();range.selectNodeContents($('#inquiry-summary'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);$('#copy-status').textContent='内容を選択しました。コピー操作で保存してください。';}});
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});$$('.reveal').forEach(el=>observer.observe(el));document.documentElement.classList.add('motion');}
})();
