document.addEventListener("DOMContentLoaded", function () {
  const cards = document.querySelectorAll(
    "#contact-section-portfolio .contact-card-portfolio"
  );
  cards.forEach((card) => {
    const btn = card.querySelector(".contact-card-btn");
    const link = card.dataset.link;
    btn.addEventListener("click", () => {
      window.open(link, "_blank");
    });
  });
});
