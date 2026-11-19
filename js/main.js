/* Punto de entrada: rellena los textos desde content.js, arranca el cielo,
   las escenas y los módulos. */
(function () {
  'use strict';

  const App = window.App;
  const C = window.CONTENT;

  // Textos editables → HTML
  document.querySelectorAll('[data-c]').forEach((el) => {
    const v = App.get(C, el.dataset.c);
    if (typeof v === 'string') el.textContent = v;
  });
  document.querySelectorAll('[data-c-label]').forEach((el) => {
    const v = App.get(C, el.dataset.cLabel);
    if (typeof v === 'string') el.setAttribute('aria-label', v);
  });
  if (C.meta && C.meta.title) document.title = C.meta.title;

  App.Sky.init(document.getElementById('sky'));
  App.Scenes.init();

  App.modules.forEach((init) => {
    try { init(); } catch (err) { console.error('Error iniciando módulo:', err); }
  });

  // Bienvenida → historia
  document.getElementById('btnDiscover').addEventListener('click', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    App.Sky.burst(r.left + r.width / 2, r.top + r.height / 2, 24);
    App.Scenes.next();
  });

  App.Scenes.go('intro');
})();
