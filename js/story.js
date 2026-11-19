/* Escena 2 · Una pequeña historia
   Los mensajes aparecen uno a uno, a un ritmo de lectura cómodo.
   Tocar la pantalla adelanta al siguiente mensaje. */
(function () {
  'use strict';

  const App = window.App;
  const C = window.CONTENT.story;
  const seq = App.createSequence();
  let scene, lead, lines, hint, action, btn;

  const readTime = (text) => App.clamp(1500 + text.length * 42, 2300, 6500);

  function reset() {
    seq.stop();
    lines.innerHTML = '';
    lead.classList.remove('is-in');
    action.hidden = true;
    action.classList.remove('is-in');
    hint.hidden = false;
  }

  function addLine(text) {
    lines.querySelectorAll('.is-latest').forEach((n) => n.classList.remove('is-latest'));
    const p = document.createElement('p');
    p.className = 'story__line reveal';
    p.textContent = text;
    lines.appendChild(p);
    App.reflow(p);
    p.classList.add('is-in', 'is-latest');
    p.scrollIntoView({ behavior: App.reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
  }

  function showButton() {
    hint.hidden = true;
    action.hidden = false;
    App.reflow(action);
    action.classList.add('is-in');
    action.scrollIntoView({ behavior: App.reducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
  }

  function enter() {
    reset();
    const steps = [{ wait: 500, run: () => lead.classList.add('is-in') }];
    let prev = C.lead;
    C.lines.forEach((t) => {
      steps.push({ wait: readTime(prev), run: () => addLine(t) });
      prev = t;
    });
    steps.push({ wait: Math.max(1500, readTime(prev) - 500), run: showButton });

    if (App.reducedMotion()) { steps.forEach((s) => s.run()); return; }
    seq.start(steps);
  }

  function init() {
    scene = document.getElementById('scene-story');
    lead = document.getElementById('storyLead');
    lines = document.getElementById('storyLines');
    hint = document.getElementById('storyHint');
    action = document.getElementById('storyAction');
    btn = document.getElementById('btnStoryNext');

    btn.addEventListener('click', () => App.Scenes.next());
    scene.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      seq.skip();
    });
    App.Scenes.on('story', enter, () => seq.stop());
  }

  App.modules.push(init);
})();
