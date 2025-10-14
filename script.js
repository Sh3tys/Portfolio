/* ========================================
   LOADER
   ======================================== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.style.opacity = 0;
    setTimeout(() => loader.style.display = 'none', 500);
  }
});

/* ========================================
   INITIALISATION AU CHARGEMENT
   ======================================== */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDecorativeElements();
  initScrollReveal();
  initAboutButton();
  initMobileMenu();
  initProjectSliders();
  initContactCards();
  initSmoothAnchors();
});

/* ========================================
   THEME TOGGLE (Dark/Light)
   ======================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  const savedTheme = window.currentTheme || 'dark';
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    window.currentTheme = newTheme;
    updateThemeIcons(newTheme);
    generateDecorativeElements();
  });

  function updateThemeIcons(theme) {
    sunIcon?.classList.toggle('active', theme === 'light');
    moonIcon?.classList.toggle('active', theme === 'dark');
  }
}

/* ========================================
   ELEMENTS DECORATIFS (Étoiles/Nuages)
   ======================================== */
function initDecorativeElements() {
  generateDecorativeElements();
}

function generateDecorativeElements() {
  const container = document.getElementById('decorative-elements');
  if (!container) return;

  container.innerHTML = '';
  const theme = document.body.getAttribute('data-theme');
  const elementCount = 20;

  for (let i = 0; i < elementCount; i++) {
    const el = document.createElement('div');
    el.className = 'floating-element';
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
    el.style.animationDelay = `${Math.random() * 10}s`;
    el.style.animationDuration = `${15 + Math.random() * 15}s`;

    if (theme === 'light') {
      el.textContent = '☁️';
      el.style.fontSize = `${1 + Math.random() * 2}rem`;
    } else {
      const size = 2 + Math.random() * 3;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
    }

    container.appendChild(el);
  }
}

/* ========================================
   SCROLL REVEAL
   ======================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-item');

  const reveal = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;
    elements.forEach(el => {
      const { top, bottom } = el.getBoundingClientRect();
      if (top < windowHeight - revealPoint && bottom > 0) {
        el.classList.add('revealed');
      }
    });
  };

  window.addEventListener('scroll', reveal);
  window.addEventListener('resize', reveal);
  reveal();
}

/* ========================================
   ABOUT BUTTON
   ======================================== */
function initAboutButton() {
  const btn = document.getElementById('aboutBtn');
  const about = document.getElementById('aboutMe');
  if (!btn || !about) return;

  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    about.style.display = 'block';
    setTimeout(() => {
      about.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  });
}

/* ========================================
   MOBILE MENU
   ======================================== */
/* ========================================
   MOBILE MENU AVEC ANIMATION FERMETURE
   ======================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!menuToggle || !mobileMenu) return;

  const links = mobileMenu.querySelectorAll('a');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');

    if (mobileMenu.classList.contains('show')) {
      // === Animation de fermeture ===
      links.forEach((link, i) => {
        link.style.transitionDelay = `${(links.length - i) * 0.1}s`;
        link.style.opacity = '0';
        link.style.transform = 'translateX(-30px)';
      });

      // Attente que les transitions des liens se terminent avant de retirer la classe
      const totalDuration = 300 + links.length * 100; // correspond à transition + delay
      setTimeout(() => {
        mobileMenu.classList.remove('show');
        // reset styles inline pour réutilisation à l'ouverture suivante
        links.forEach(link => {
          link.style.transitionDelay = '';
          link.style.opacity = '';
          link.style.transform = '';
        });
      }, totalDuration);
    } else {
      // === Animation d'ouverture ===
      mobileMenu.classList.add('show');
      links.forEach((link, i) => {
        link.style.opacity = '0';
        link.style.transform = 'translateX(-30px)';
        link.style.transitionDelay = `${i * 0.1}s`;
        setTimeout(() => {
          link.style.opacity = '1';
          link.style.transform = 'translateX(0)';
        }, 50); // petit délai pour que la transition se déclenche
      });
    }
  });

  // Ferme le menu quand on clique sur un lien
  links.forEach(link => link.addEventListener('click', () => {
    if (mobileMenu.classList.contains('show')) menuToggle.click();
  }));
}


/* ========================================
   PROJECT SLIDERS
   ======================================== */
function initProjectSliders() {
  document.querySelectorAll('#personal-projects .pp-card').forEach(card => {
    const container = card.querySelector('.pp-images');
    const slides = container.querySelectorAll('img');
    const prev = card.querySelector('.pp-prev');
    const next = card.querySelector('.pp-next');
    let index = 0;

    container.style.display = 'flex';
    container.style.transition = 'transform 0.5s ease';
    slides.forEach(img => {
      img.style.flexShrink = '0';
      img.style.objectFit = 'contain';
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.margin = '0 auto';
    });

    function updateSlider() {
      const offset = slides[index].offsetLeft;
      container.style.transform = `translateX(-${offset}px)`;
    }

    prev.addEventListener('click', e => { e.stopPropagation(); index = (index - 1 + slides.length) % slides.length; updateSlider(); });
    next.addEventListener('click', e => { e.stopPropagation(); index = (index + 1) % slides.length; updateSlider(); });

    card.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') prev.click(); else if (e.key === 'ArrowRight') next.click(); });

    window.addEventListener('resize', () => setTimeout(updateSlider, 250));
    updateSlider();
  });
}

/* ========================================
   CONTACT CARDS
   ======================================== */
function initContactCards() {
  document.querySelectorAll('#contact-section-portfolio .contact-card-portfolio').forEach(card => {
    const btn = card.querySelector('.contact-card-btn');
    const link = card.dataset.link;
    if (!btn || !link) return;

    const open = () => link.startsWith('mailto:') || link.startsWith('tel:') ? window.location.href = link : window.open(link, '_blank');

    btn.addEventListener('click', e => { e.stopPropagation(); open(); });
    card.addEventListener('click', open);
  });
}

/* ========================================
   SMOOTH ANCHORS
   ======================================== */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
