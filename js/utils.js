/* Utilidades compartidas · todo cuelga del objeto global App */
(function () {
  'use strict';

  const App = (window.App = window.App || {});
  App.modules = []; // cada módulo registra aquí su función init

  App.$ = (sel, root) => (root || document).querySelector(sel);
  App.reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  App.get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  App.clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  App.rand = (a, b) => a + Math.random() * (b - a);
  App.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  App.reflow = (el) => void el.offsetWidth;

  App.fmtTime = (s) => {
    if (!isFinite(s) || s < 0) return '0:00';
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return m + ':' + String(r).padStart(2, '0');
  };

  /* Grupo de temporizadores que se cancelan de una vez */
  App.createTimers = function () {
    const ids = new Set();
    return {
      after(ms, fn) {
        const id = setTimeout(() => { ids.delete(id); fn(); }, ms);
        ids.add(id);
        return id;
      },
      clear() { ids.forEach(clearTimeout); ids.clear(); }
    };
  };

  /* Secuencia de pasos: cada paso espera `wait` ms antes de ejecutarse.
     skip() ejecuta el siguiente paso al instante (toque para avanzar). */
  App.createSequence = function () {
    let steps = [];
    let i = 0;
    let id = null;

    function schedule() {
      if (i >= steps.length) { id = null; return; }
      id = setTimeout(run, steps[i].wait);
    }
    function run() {
      id = null;
      const step = steps[i++];
      if (step) step.run();
      schedule();
    }

    return {
      start(list) { this.stop(); steps = list.slice(); i = 0; schedule(); },
      skip() {
        if (i >= steps.length) return false;
        clearTimeout(id);
        run();
        return true;
      },
      stop() { clearTimeout(id); id = null; steps = []; i = 0; }
    };
  };
})();
