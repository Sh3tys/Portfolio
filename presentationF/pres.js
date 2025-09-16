document.addEventListener("DOMContentLoaded", () => {
  const elmt = document.getElementById("dynamic");
  if (!elmt) return;

  const words = ["Web", "Application", "Frontend", "Mobile", "Backend"];
  const typeSpeed = 80;
  const deleteSpeed = 50;
  const pause = 1200;

  let wordIndex = 0;
  let charIndex = 0;
  let typing = true; // true = écrire, false = effacer

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
        setTimeout(tick, pause / 3); // petite pause avant le prochain mot
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }

  tick();



  // ✅ JS pour le bouton
  document.getElementById("aboutBtn").addEventListener("click", function () {
    this.style.display = "none"; // le bouton disparaît
    document.getElementById("aboutMe").style.display = "block"; // affiche le texte
  });

});
