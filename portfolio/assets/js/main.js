const button = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  button.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
}
button.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    button.focus();
  }
});
matchMedia('(min-width: 601px)').addEventListener('change', closeMenu);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        navigation.querySelectorAll('a').forEach((link) => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }
  }, {rootMargin: '-15% 0px -55% 0px'});
  document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
}
