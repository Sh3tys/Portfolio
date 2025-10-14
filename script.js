// ========================================
// INITIALISATION AU CHARGEMENT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initDecorativeElements();
  initScrollReveal();
  initTypewriter();
  initAboutButton();
  initMobileMenu();
  initProjectSliders();
  initContactCards();
});

// ========================================
// THEME TOGGLE (Mode Clair/Sombre)
// ========================================
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  
  // Récupère le thème sauvegardé ou utilise 'dark' par défaut
  const savedTheme = window.currentTheme || 'dark';
  body.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    window.currentTheme = newTheme;
    updateThemeIcons(newTheme);
    
    // Régénère les éléments décoratifs avec le nouveau thème
    generateDecorativeElements();
  });
  
  function updateThemeIcons(theme) {
    if (theme === 'dark') {
      moonIcon.classList.add('active');
      sunIcon.classList.remove('active');
    } else {
      sunIcon.classList.add('active');
      moonIcon.classList.remove('active');
    }
  }
}

// ========================================
// ÉLÉMENTS DÉCORATIFS (Étoiles/Nuages)
// ========================================
function initDecorativeElements() {
  generateDecorativeElements();
}

function generateDecorativeElements() {
  const container = document.getElementById('decorative-elements');
  const theme = document.body.getAttribute('data-theme');
  
  // Nettoie les éléments existants
  container.innerHTML = '';
  
  const elementCount = 20;
  
  for (let i = 0; i < elementCount; i++) {
    const element = document.createElement('div');
    element.className = 'floating-element';
    
    // Position aléatoire
    element.style.left = `${Math.random() * 100}%`;
    element.style.top = `${Math.random() * 100}%`;
    
    // Délai d'animation aléatoire
    element.style.animationDelay = `${Math.random() * 10}s`;
    element.style.animationDuration = `${15 + Math.random() * 15}s`;
    
    if (theme === 'light') {
      // Nuages pour le mode clair
      element.textContent = '☁️';
      element.style.fontSize = `${1 + Math.random() * 2}rem`;
    } else {
      // Étoiles pour le mode sombre
      const size = 2 + Math.random() * 3;
      element.style.width = `${size}px`;
      element.style.height = `${size}px`;
    }
    
    container.appendChild(element);
  }
}

// ========================================
// SCROLL REVEAL (Animations au scroll)
// ========================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-item'
  );
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;
    
    revealElements.forEach(element => {
      const elementTop = element.getBoundingClientRect().top;
      const elementBottom = element.getBoundingClientRect().bottom;
      
      // Révèle si l'élément est visible
      if (elementTop < windowHeight - revealPoint && elementBottom > 0) {
        element.classList.add('revealed');
      } else {
        // Optionnel : retire la classe pour réanimer au scroll retour
        // element.classList.remove('revealed');
      }
    });
  };
  
  // Lance au chargement et au scroll
  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll);
  
  // Lance aussi au resize
  window.addEventListener('resize', revealOnScroll);
}

// ========================================
// EFFET TYPEWRITER (Présentation)
// ========================================
function initTypewriter() {
  const elmt = document.getElementById("dynamic");
  if (!elmt) return;

  const words = ["Web", "Application", "Front-end", "Mobile", "Back-end"];
  const typeSpeed = 80;
  const deleteSpeed = 50;
  const pause = 1200;

  let wordIndex = 0;
  let charIndex = 0;
  let typing = true;

  function tick() {
    const current = words[wordIndex % words.length];

    if (typing) {
      charIndex++;
      elmt.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        typing = false;
        setTimeout(tick, pause);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      charIndex--;
      elmt.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        typing = true;
        wordIndex++;
        setTimeout(tick, pause / 3);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  tick();
}

// ========================================
// BOUTON "ABOUT ME" (Présentation)
// ========================================
function initAboutButton() {
  const aboutBtn = document.getElementById("aboutBtn");
  const aboutMe = document.getElementById("aboutMe");
  
  if (!aboutBtn || !aboutMe) return;

  aboutBtn.addEventListener("click", function () {
    if (aboutMe.style.display === "none" || !aboutMe.style.display) {
      this.style.display = "none";
      aboutMe.style.display = "block";
      
      // Scroll smooth vers le texte
      setTimeout(() => {
        aboutMe.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  });
}

// ========================================
// MENU MOBILE (Navigation)
// ========================================
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!menuToggle || !mobileMenu) return;

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

  // Ferme le menu quand on clique sur un lien
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu.classList.contains('show')) {
        menuToggle.click();
      }
    });
  });
}

// ========================================
// SLIDERS DE PROJETS
// ========================================
function initProjectSliders() {
  const cards = document.querySelectorAll('#personal-projects .pp-card');

  cards.forEach(card => {
    const imagesContainer = card.querySelector('.pp-images');
    const slides = imagesContainer.querySelectorAll('img');
    const prevBtn = card.querySelector('.pp-prev');
    const nextBtn = card.querySelector('.pp-next');
    let index = 0;

    // Configuration du slider
    imagesContainer.style.display = 'flex';
    imagesContainer.style.transition = 'transform 0.5s ease';

    slides.forEach(img => {
      img.style.flexShrink = '0';
      img.style.objectFit = 'contain';
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.margin = '0 auto';
    });

    function updateSlider() {
      const offset = slides[index].offsetLeft;
      imagesContainer.style.transform = `translateX(-${offset}px)`;
    }

    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      index = (index - 1 + slides.length) % slides.length;
      updateSlider();
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      index = (index + 1) % slides.length;
      updateSlider();
    });

    // Navigation au clavier
    card.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevBtn.click();
      } else if (e.key === 'ArrowRight') {
        nextBtn.click();
      }
    });

    // Initial
    updateSlider();

    // Recalcule au resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSlider, 250);
    });
  });
}

// ========================================
// CARTES DE CONTACT
// ========================================
function initContactCards() {
  const cards = document.querySelectorAll("#contact-section-portfolio .contact-card-portfolio");
  
  cards.forEach((card) => {
    const btn = card.querySelector(".contact-card-btn");
    const link = card.dataset.link;
    
    if (!btn || !link) return;

    // Clic sur le bouton
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openLink(link);
    });

    // Clic sur toute la carte
    card.addEventListener("click", () => {
      openLink(link);
    });
  });

  function openLink(link) {
    if (link.startsWith('mailto:') || link.startsWith('tel:')) {
      window.location.href = link;
    } else {
      window.open(link, "_blank");
    }
  }
}

// ========================================
// SMOOTH SCROLL POUR LES ANCRES
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ========================================
// PERFORMANCE : Throttle pour le scroll
// ========================================
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Optimise les événements de scroll
const optimizedScroll = throttle(() => {
  // Les fonctions de scroll sont déjà gérées dans initScrollReveal
}, 100);

window.addEventListener('scroll', optimizedScroll);