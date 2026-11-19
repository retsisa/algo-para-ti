/* Gestor de escenas: transiciones, progreso, foco y estado de ánimo del fondo.
   Emite los eventos  scene:leave  y  scene:enter  para que cada módulo
   arranque o limpie su propia animación. */
(function () {
  'use strict';

  const App = window.App;
  const order = ['intro', 'story', 'letter', 'gallery', 'music', 'final'];
  const moods = { intro: 'rose', story: 'rose', letter: 'dusk', gallery: 'dusk', music: 'dusk', final: 'night' };
  const Scenes = (App.Scenes = {});
  const els = {};
  let current = null;
  let bar;

  function emit(type, name) {
    document.dispatchEvent(new CustomEvent(type, { detail: { name } }));
  }

  Scenes.init = function () {
    bar = document.getElementById('progressBar');
    order.forEach((n) => {
      const el = document.getElementById('scene-' + n);
      el.setAttribute('aria-hidden', 'true');
      el.inert = true;
      els[n] = el;
    });
  };

  Scenes.current = () => current;

  Scenes.go = function (name) {
    const el = els[name];
    if (!el || name === current) return;

    const prev = current;
    current = name;

    if (prev) {
      const p = els[prev];
      p.classList.remove('is-active');
      p.setAttribute('aria-hidden', 'true');
      p.inert = true;
      emit('scene:leave', prev);
    }

    el.removeAttribute('aria-hidden');
    el.inert = false;
    el.scrollTop = 0;
    el.classList.add('is-active');

    document.body.dataset.mood = moods[name];
    App.Sky.setMood(moods[name]);
    bar.style.width = (order.indexOf(name) / (order.length - 1)) * 100 + '%';

    setTimeout(() => {
      if (current !== name) return;
      if (prev) {
        const h = el.querySelector('[data-focus]');
        if (h) h.focus({ preventScroll: true });
      }
      emit('scene:enter', name);
    }, prev ? 700 : 300);
  };

  Scenes.next = function () {
    const i = order.indexOf(current);
    if (i > -1 && i < order.length - 1) Scenes.go(order[i + 1]);
  };

  /* Atajo para que los módulos escuchen su propia escena */
  Scenes.on = function (name, onEnter, onLeave) {
    document.addEventListener('scene:enter', (e) => { if (e.detail.name === name && onEnter) onEnter(); });
    document.addEventListener('scene:leave', (e) => { if (e.detail.name === name && onLeave) onLeave(); });
  };
})();
