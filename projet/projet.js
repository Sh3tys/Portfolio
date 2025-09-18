document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('#personal-projects .pp-card');

  cards.forEach(card => {
    const imagesContainer = card.querySelector('.pp-images');
    const slides = imagesContainer.querySelectorAll('img');
    const prevBtn = card.querySelector('.pp-prev');
    const nextBtn = card.querySelector('.pp-next');
    let index = 0;

    // Met les images en ligne, mais ne force pas leur largeur
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

    // Initial
    updateSlider();

    // Recalcule la position au resize
    window.addEventListener('resize', updateSlider);
  });
});
