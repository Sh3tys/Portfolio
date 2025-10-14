// ========================================
// INITIALISATION AU CHARGEMENT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initAboutButton();
  initMobileMenu();
  initProjectSliders();
  initContactCards();
});

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
    this.style.display = "none";
    aboutMe.style.display = "block";
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

    prevBtn.addEventListener('click', () => {
      index = (index - 1 + slides.length) % slides.length;
      updateSlider();
    });

    nextBtn.addEventListener('click', () => {
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
    window.addEventListener('resize', updateSlider);
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
      window.open(link, "_blank");
    });

    // Clic sur toute la carte
    card.addEventListener("click", () => {
      window.open(link, "_blank");
    });
  });
}