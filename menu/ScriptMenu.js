document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const links = mobileMenu.querySelectorAll('a');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');

    if (!mobileMenu.classList.contains('show')) {
      mobileMenu.classList.add('show');
      links.forEach((link, index) => {
        link.style.transitionDelay = `${index * 0.15}s`;
      });
    } else {
      links.forEach((link, index) => {
        link.style.transitionDelay = `${(links.length - index) * 0.15}s`;
        link.style.opacity = '0';
        link.style.transform = 'translateX(-30px)';
      });

      setTimeout(() => {
        mobileMenu.classList.remove('show');
        links.forEach((link) => {
          link.style.transitionDelay = '0s';
          link.style.opacity = '';
          link.style.transform = '';
        });
      }, (links.length * 150) + 400);
    }
  });
});
