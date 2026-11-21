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
  const handle = object?.querySelector('.object-handle');
  const modeButtons = object?.querySelectorAll('.object-mode');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (hero && object && handle && modeButtons) {
    let drag = null;
    let mode = 'g';

    const place = (left, top) => {
      const maxX = Math.max(0, document.documentElement.clientWidth - object.offsetWidth);
      const maxY = Math.max(0, (mode === 'k' ? window.innerHeight : document.documentElement.scrollHeight) - object.offsetHeight);
      object.style.left = `${Math.min(maxX, Math.max(0, left))}px`;
      object.style.top = `${Math.min(maxY, Math.max(0, top))}px`;
    };

    const detach = () => {
      if (object.classList.contains('is-placed')) return;
      const bounds = object.getBoundingClientRect();
      object.style.translate = '';
      object.classList.add('is-placed');
      document.body.appendChild(object);
      place(bounds.left + window.scrollX, bounds.top + window.scrollY);
    };

    const setMode = (nextMode) => {
      const targetMode = nextMode === 'k' ? 'k' : 'g';
      if (targetMode !== mode) {
        const bounds = object.getBoundingClientRect();
        detach();
        object.style.translate = '';
        mode = targetMode;
        object.classList.toggle('is-fixed', mode === 'k');
        place(bounds.left + (mode === 'g' ? window.scrollX : 0), bounds.top + (mode === 'g' ? window.scrollY : 0));
      }
      modeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.mode === mode)));
      if (mode === 'k') object.style.translate = '';
    };

    modeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setMode(button.dataset.mode);
        button.focus({ preventScroll: true });
      });
    });

    document.addEventListener('pointermove', (event) => {
      if (mode !== 'g' || drag || reducedMotion.matches || event.pointerType === 'touch' || object.contains(event.target)) return;
      const placed = object.classList.contains('is-placed');
      if (!placed && !hero.contains(event.target)) {
        object.style.translate = '';
        return;
      }
      const bounds = placed ? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight } : hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      object.style.translate = `${x * 25}px ${y * 20}px`;
    }, { passive: true });
    reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) object.style.translate = ''; });

    handle.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      event.preventDefault();
      detach();
      const bounds = object.getBoundingClientRect();
      drag = { pointerId: event.pointerId, x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      object.classList.add('is-dragging');
      handle.focus({ preventScroll: true });
      handle.setPointerCapture(event.pointerId);
    });

    handle.addEventListener('pointermove', (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      place(event.clientX + (mode === 'g' ? window.scrollX : 0) - drag.x, event.clientY + (mode === 'g' ? window.scrollY : 0) - drag.y);
    });

    const finishDrag = (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      drag = null;
      object.classList.remove('is-dragging');
    };
    handle.addEventListener('pointerup', finishDrag);
    handle.addEventListener('pointercancel', finishDrag);
    handle.addEventListener('lostpointercapture', finishDrag);

    handle.addEventListener('keydown', (event) => {
      const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      const direction = directions[event.key];
      if (!direction) return;
      event.preventDefault();
      detach();
      handle.focus({ preventScroll: true });
      const step = event.shiftKey ? 40 : 10;
      place(parseFloat(object.style.left) + direction[0] * step, parseFloat(object.style.top) + direction[1] * step);
    });

    window.addEventListener('resize', () => {
      if (!object.classList.contains('is-placed') || drag) return;
      place(parseFloat(object.style.left), parseFloat(object.style.top));
    });
  }
})();
