/* Escena 6 · El momento final
   Pequeña coreografía: frase previa → "Me gustas." → mensaje → botón.
   Tocar la pantalla adelanta al siguiente paso. Sin presionar para responder. */
(function () {
  'use strict';

  const App = window.App;
  const seq = App.createSequence();
  const timers = App.createTimers();

  let scene, pre, big, text, action, btn, after, replayWrap, replay;

  const show = (el) => () => {
    el.classList.add('is-in');
  };

  function reveal(wrapper) {
    wrapper.hidden = false;
    App.reflow(wrapper);
    wrapper.classList.add('is-in');
  }

  function reset() {
    seq.stop();
    timers.clear();
    [pre, big, text, action, after, replayWrap].forEach((el) => el.classList.remove('is-in'));
    pre.classList.remove('is-dim');
    action.hidden = true;
    after.hidden = true;
    replayWrap.hidden = true;
    btn.disabled = false;
    btn.classList.remove('is-gone');
  }

  function centerBurst(n) {
    const r = big.getBoundingClientRect();
    App.Sky.burst(r.left + r.width / 2, r.top + r.height / 2, n);
  }

  function enter() {
    reset();
    const steps = [
      { wait: 700, run: show(pre) },
      { wait: 3800, run: () => pre.classList.add('is-dim') },
      { wait: 900, run: () => { show(big)(); centerBurst(22); } },
      { wait: 2800, run: show(text) },
      { wait: 4600, run: () => reveal(action) }
    ];
    if (App.reducedMotion()) { steps.forEach((s) => s.run()); return; }
    seq.start(steps);
  }

  function onYes() {
    const r = btn.getBoundingClientRect();
    btn.disabled = true;
    btn.classList.add('is-gone');
    App.Sky.burst(r.left + r.width / 2, r.top + r.height / 2, 70);
    App.Sky.setHeartRate(4);
    timers.after(6500, () => App.Sky.setHeartRate(1));
    timers.after(750, () => {
      action.hidden = true;
      after.hidden = false;
      App.reflow(after);
      after.classList.add('is-in');
      after.focus({ preventScroll: true });
    });
    timers.after(2600, () => reveal(replayWrap));
  }

  function init() {
    scene = document.getElementById('scene-final');
    pre = document.getElementById('finalPre');
    big = document.getElementById('finalBig');
    text = document.getElementById('finalText');
    action = document.getElementById('finalAction');
    btn = document.getElementById('btnFinal');
    after = document.getElementById('finalAfter');
    replayWrap = document.getElementById('replayWrap');
    replay = document.getElementById('btnReplay');

    btn.addEventListener('click', onYes);
    replay.addEventListener('click', () => App.Scenes.go('intro'));
    scene.addEventListener('click', (e) => {
      if (e.target.closest('button')) return;
      seq.skip();
    });

    App.Scenes.on('final', enter, () => { seq.stop(); timers.clear(); });
  }

  App.modules.push(init);
})();
