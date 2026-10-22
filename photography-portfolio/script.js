'use strict';
const photos = window.PORTFOLIO || [];
const labels = {portrait:'PORTRAIT',event:'EVENT',sakura:'SAKURA',night:'NIGHT'};
const collectionData = [
 {category:'portrait',id:'p05-01',title:'幸野ゆりあ撮影会',subtitle:'IKEBUKURO / 2026.05.05'},
 {category:'event',id:'p10-01',title:'グランブルーフェス2025',subtitle:'TOKYO BIG SIGHT / 2025.12.28'},
 {category:'sakura',id:'p15-01',title:'桜 — 上野公園',subtitle:'UENO PARK / 2026.03.28'},
 {category:'night',id:'p18-01',title:'お台場の夜',subtitle:'ODAIBA / 2026.08.30'}
];
const gallery = document.querySelector('#gallery');
const dialog = document.querySelector('#lightbox');
let currentPhotos = photos.filter(p=>p.category!=='other');
let currentIndex=0, opener=null, savedScroll=0;
function make(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text)el.textContent=text;return el;}
collectionData.forEach(c=>{
 const p=photos.find(p=>p.id===c.id);if(!p)return;
 const button=make('button','collection');button.type='button';button.setAttribute('aria-label',c.title+'の写真を表示');
 const frame=make('div','collection-image');const img=make('img');img.src=p.thumb;img.alt=c.title;img.loading='lazy';img.width=p.width;img.height=p.height;
 frame.append(img,make('span','',labels[c.category]));button.append(frame,make('h3','',c.title),make('p','',c.subtitle));
 button.addEventListener('click',()=>{filter(c.category);document.querySelector('.gallery-top').scrollIntoView({block:'start'});});document.querySelector('#collections').append(button);
});
function filter(category){
 currentPhotos=photos.filter(p=>p.category!=='other'&&(category==='all'||p.category===category));
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===category;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 gallery.replaceChildren();document.querySelector('#count').textContent=String(currentPhotos.length).padStart(2,'0')+' PHOTOGRAPHS';
 currentPhotos.forEach((p,i)=>{
  const b=make('button','photo');b.type='button';b.setAttribute('aria-label',p.title+'・'+(i+1)+'枚目を拡大表示');
  const frame=make('div','photo-frame');const img=make('img');img.src=p.thumb;img.alt=p.title+' / '+p.location;img.width=p.width;img.height=p.height;img.loading='lazy';img.decoding='async';frame.append(img);
  const cap=make('div','photo-caption');cap.append(make('span','',p.title),make('span','','↗'));b.append(frame,cap);b.addEventListener('click',()=>openPhoto(i,b));gallery.append(b);
 });
}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>filter(b.dataset.filter)));
function showPhoto(){
 const p=currentPhotos[currentIndex];const image=document.querySelector('#full-image');image.src=p.src;image.alt=p.title+' / '+p.location;
 document.querySelector('#position').textContent=String(currentIndex+1).padStart(2,'0')+' / '+String(currentPhotos.length).padStart(2,'0');
 document.querySelector('#photo-title').textContent=p.title;document.querySelector('#photo-category').textContent=labels[p.category];document.querySelector('#photo-location').textContent=p.location+' / '+p.date;
 const meta=document.querySelector('#photo-meta');meta.replaceChildren();
 [['CAMERA',p.camera],['LENS',p.lens],['SETTINGS',p.settings]].forEach(([key,value])=>{if(!value)return;const row=make('div');row.append(make('dt','',key),make('dd','',value));meta.append(row);});
 if(!p.settings)meta.append(make('p','settings-note','この写真の個別撮影設定はPDFに記載されていません。'));
}
function openPhoto(index,button){currentIndex=index;opener=button;savedScroll=window.scrollY;showPhoto();dialog.showModal();document.body.classList.add('modal-open');}
function move(step){currentIndex=(currentIndex+step+currentPhotos.length)%currentPhotos.length;showPhoto();}
document.querySelector('#close').addEventListener('click',()=>dialog.close());
document.querySelector('#prev').addEventListener('click',()=>move(-1));document.querySelector('#next').addEventListener('click',()=>move(1));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}if(e.key==='ArrowRight'){e.preventDefault();move(1);}});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');window.scrollTo({top:savedScroll,behavior:'instant'});opener?.focus({preventScroll:true});});
let touchStart=null;document.querySelector('#full-image').addEventListener('touchstart',e=>{touchStart=e.changedTouches[0].clientX;},{passive:true});document.querySelector('#full-image').addEventListener('touchend',e=>{if(touchStart!==null){const dx=e.changedTouches[0].clientX-touchStart;if(Math.abs(dx)>60)move(dx<0?1:-1);}touchStart=null;},{passive:true});
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#nav');menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(expanded));nav.classList.toggle('open',expanded);});
function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
filter('all');
if('IntersectionObserver' in window){
 document.documentElement.classList.add('js-motion');const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');reveal.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));
 const activeNav=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)nav.querySelectorAll('a').forEach(a=>{const active=a.hash==='#'+e.target.id;a.classList.toggle('current',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}),{rootMargin:'-15% 0px -60% 0px'});document.querySelectorAll('main section[id]').forEach(s=>activeNav.observe(s));
}
