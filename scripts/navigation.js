const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
  const toggleNav = () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true' || false;
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    navLinks.classList.toggle('open');
  };

  menuBtn.addEventListener('click', toggleNav);
  menuBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleNav();
    }
    if (e.key === 'Escape') {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // close nav with Escape when focus is inside
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      navLinks.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}