/* ========================================
   LOADER
   ======================================== */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;
  loader.style.opacity = 0;
  setTimeout(() => (loader.style.display = "none"), 500);
});

/* ========================================
   INITIALISATION AU CHARGEMENT
   ======================================== */
document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initScrollReveal();
  initAboutButton();
  initMobileMenu();
  initProjectSliders();
  initContactCards();
  initSmoothAnchors();

  const cvBtn = document.getElementById("CVBtn");
  if (cvBtn) {
    cvBtn.addEventListener("click", () => {
      const link = document.createElement("a");
      link.href = "./asset/CV_Titouan_CONQUÉRÉ_DE_MONBRISON.pdf";
      link.download = "CV_Titouan_CONQUÉRÉ_DE_MONBRISON.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }
});

/* ========================================
   THEME TOGGLE (Dark/Light)
   ======================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const sunIcon = document.querySelector(".sun-icon");
  const moonIcon = document.querySelector(".moon-icon");

  const savedTheme = window.currentTheme || "dark";
  body.setAttribute("data-theme", savedTheme);
  updateThemeIcons(savedTheme);

  themeToggle?.addEventListener("click", () => {
    const newTheme =
      body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    body.setAttribute("data-theme", newTheme);
    window.currentTheme = newTheme;
    updateThemeIcons(newTheme);
  });

  function updateThemeIcons(theme) {
    sunIcon?.classList.toggle("active", theme === "light");
    moonIcon?.classList.toggle("active", theme === "dark");
  }
}

/* ========================================
   SCROLL REVEAL
   ======================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .scroll-reveal-item"
  );
  if (!elements.length) return;

  let ticking = false;

  const reveal = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - revealPoint && rect.bottom > 0) {
        el.classList.add("revealed");
      }
    });

    ticking = false;
  };

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(reveal);
      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleScroll, { passive: true });
  reveal();
}

/* ========================================
   ABOUT BUTTON
   ======================================== */
function initAboutButton() {
  const btn = document.getElementById("aboutBtn");
  const about = document.getElementById("aboutMe");
  if (!btn || !about) return;

  btn.addEventListener("click", () => {
    btn.style.display = "none";
    about.style.display = "block";
    setTimeout(
      () => about.scrollIntoView({ behavior: "smooth", block: "nearest" }),
      100
    );
  });
}

/* ========================================
   MOBILE MENU
   ======================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (!menuToggle || !mobileMenu) return;

  const links = mobileMenu.querySelectorAll("a");

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("show");
    menuToggle.classList.toggle("active");

    if (isOpen) {
      links.forEach((link, i) => {
        link.style.transitionDelay = `${(links.length - i) * 0.1}s`;
        link.style.opacity = "0";
        link.style.transform = "translateX(-30px)";
      });

      const totalDuration = 300 + links.length * 100;
      setTimeout(() => {
        mobileMenu.classList.remove("show");
        links.forEach((link) => {
          link.style.transitionDelay = "";
          link.style.opacity = "";
          link.style.transform = "";
        });
      }, totalDuration);
    } else {
      mobileMenu.classList.add("show");
      links.forEach((link, i) => {
        link.style.opacity = "0";
        link.style.transform = "translateX(-30px)";
        link.style.transitionDelay = `${i * 0.1}s`;
        setTimeout(() => {
          link.style.opacity = "1";
          link.style.transform = "translateX(0)";
        }, 50);
      });
    }
  });

  links.forEach((link) =>
    link.addEventListener("click", () => {
      if (mobileMenu.classList.contains("show")) menuToggle.click();
    })
  );
}

/* ========================================
   PROJECT SLIDERS
   ======================================== */
function initProjectSliders() {
  document.querySelectorAll("#personal-projects .pp-card").forEach((card) => {
    const container = card.querySelector(".pp-images");
    const slides = container?.querySelectorAll("img");
    const prev = card.querySelector(".pp-prev");
    const next = card.querySelector(".pp-next");
    if (!container || !slides.length) return;

    let index = 0;

    Object.assign(container.style, {
      display: "flex",
      transition: "transform 0.5s ease",
    });

    slides.forEach((img) => {
      Object.assign(img.style, {
        flexShrink: "0",
        objectFit: "contain",
        maxWidth: "100%",
        height: "auto",
        margin: "0 auto",
      });
    });

    const updateSlider = () => {
      const offset = slides[index].offsetLeft;
      container.style.transform = `translateX(-${offset}px)`;
    };

    prev?.addEventListener("click", (e) => {
      e.stopPropagation();
      index = (index - 1 + slides.length) % slides.length;
      updateSlider();
    });

    next?.addEventListener("click", (e) => {
      e.stopPropagation();
      index = (index + 1) % slides.length;
      updateSlider();
    });

    card.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prev?.click();
      else if (e.key === "ArrowRight") next?.click();
    });

    window.addEventListener("resize", () =>
      requestAnimationFrame(updateSlider)
    );
    updateSlider();
  });
}

/* ========================================
   CONTACT CARDS
   ======================================== */
function initContactCards() {
  document
    .querySelectorAll("#contact-section-portfolio .contact-card-portfolio")
    .forEach((card) => {
      const btn = card.querySelector(".contact-card-btn");
      const link = card.dataset.link;
      if (!btn || !link) return;

      const open = () => {
        if (link.startsWith("mailto:") || link.startsWith("tel:"))
          window.location.href = link;
        else window.open(link, "_blank");
      };

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        open();
      });
      card.addEventListener("click", open);
    });
}

/* ========================================
   SMOOTH ANCHORS
   ======================================== */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute("href"));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}
