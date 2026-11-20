(() => {
  const hero = document.querySelector('.hero');
  const planets = document.querySelectorAll('.planet');
  const skillName = document.getElementById('skill-name');
  const skillStatus = document.getElementById('skill-status');
  planets.forEach((planet) => {
    planet.addEventListener('click', () => {
      planets.forEach((item) => item.setAttribute('aria-pressed', String(item === planet)));
      skillName.textContent = planet.dataset.skill;
      skillStatus.textContent = planet.dataset.skill === 'Swift' ? 'Currently learning.' : 'Part of my toolkit.';
    });
  });
  const object = document.querySelector('.hero-object');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (hero && object) {
    hero.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches || event.pointerType === 'touch') return;
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      object.style.translate = `${x * 25}px ${y * 20}px`;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { object.style.translate = ''; });
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) object.style.translate = ''; });
  }
})();
