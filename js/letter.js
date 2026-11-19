/* Escena 3 · Sobre interactivo + carta que se escribe sola.
   El texto de la carta vive en content.js (letter.greeting / paragraphs / signature). */
(function () {
  'use strict';

  const App = window.App;
  const C = window.CONTENT.letter;
  const timers = App.createTimers();

  let wrap, env, title, hint, sheet, scroll, textBox, sr, btnSkip, btnNext;
  let blocks = [];
  let typeId = null;
  let typing = false;

  function reset() {
    timers.clear();
    clearTimeout(typeId);
    typing = false;
    blocks = [];
    env.classList.remove('is-open', 'is-gone');
    env.disabled = false;
    wrap.hidden = false;
    hint.hidden = false;
    title.classList.remove('is-faded');
    hint.classList.remove('is-faded');
    sheet.hidden = true;
    sheet.classList.remove('is-in');
    textBox.innerHTML = '';
    scroll.scrollTop = 0;
    btnNext.hidden = true;
    btnNext.classList.remove('is-in');
    btnSkip.hidden = false;
  }

  function buildBlocks() {
    textBox.innerHTML = '';
    blocks = [];
    const add = (text, cls) => {
      const p = document.createElement('p');
      p.className = cls;
      textBox.appendChild(p);
      blocks.push({ el: p, text });
    };
    add(C.greeting, 'sheet__greeting');
    C.paragraphs.forEach((t) => add(t, 'sheet__p'));
    add(C.signature, 'sheet__sign');
  }

  function nearBottom() {
    return scroll.scrollHeight - scroll.scrollTop - scroll.clientHeight < 90;
  }

  function startTyping() {
    let bi = 0;
    let ci = 0;
    typing = true;

    function tick() {
      if (!typing) return;
      const b = blocks[bi];
      if (!b) { done(); return; }

      if (ci === 0) {
        textBox.querySelectorAll('.caret').forEach((n) => n.classList.remove('caret'));
        b.el.classList.add('caret');
      }
      const stick = nearBottom();
      ci++;
      b.el.textContent = b.text.slice(0, ci);
      if (stick) scroll.scrollTop = scroll.scrollHeight;

      const ch = b.text[ci - 1];
      let delay = 24 + Math.random() * 22;
      if ('.!?…'.indexOf(ch) > -1) delay += 380;
      else if (',;:'.indexOf(ch) > -1) delay += 170;
      else if (ch === '\n') delay += 320;

      if (ci >= b.text.length) { bi++; ci = 0; delay += 520; }
      typeId = setTimeout(tick, delay);
    }
    tick();
  }

  function done() {
    typing = false;
    clearTimeout(typeId);
    textBox.querySelectorAll('.caret').forEach((n) => n.classList.remove('caret'));
    btnSkip.hidden = true;
    btnNext.hidden = false;
    App.reflow(btnNext);
    btnNext.classList.add('is-in');
    scroll.scrollTop = scroll.scrollHeight;
    btnNext.focus({ preventScroll: true });
  }

  function finish() {
    if (!blocks.length) return;
    typing = false;
    clearTimeout(typeId);
    blocks.forEach((b) => { b.el.textContent = b.text; });
    done();
  }

  function showSheet() {
    wrap.hidden = true;
    hint.hidden = true;
    title.classList.remove('is-faded');
    buildBlocks();
    sheet.hidden = false;
    App.reflow(sheet);
    sheet.classList.add('is-in');
    sheet.focus({ preventScroll: true });
    startTyping();
  }

  function open() {
    if (env.classList.contains('is-open')) return;
    env.classList.add('is-open');
    env.disabled = true;
    // el título se desvanece para que la solapa no pase por encima de él
    title.classList.add('is-faded');
    hint.classList.add('is-faded');
    if (App.reducedMotion()) { showSheet(); finish(); return; }
    timers.after(1250, () => env.classList.add('is-gone'));
    timers.after(1950, showSheet);
  }

  function init() {
    wrap = document.getElementById('envelopeWrap');
    env = document.getElementById('envelope');
    title = document.getElementById('letterTitle');
    hint =document.getElementById('letterHint');
    sheet = document.getElementById('sheet');
    scroll = document.getElementById('sheetScroll');
    textBox = document.getElementById('sheetText');
    sr = document.getElementById('sheetSr');
    btnSkip = document.getElementById('btnSkipType');
    btnNext = document.getElementById('btnLetterNext');

    sr.textContent = [C.greeting].concat(C.paragraphs, [C.signature]).join('\n\n');

    env.addEventListener('click', open);
    btnSkip.addEventListener('click', finish);
    btnNext.addEventListener('click', () => App.Scenes.next());

    App.Scenes.on('letter', reset, () => { timers.clear(); clearTimeout(typeId); typing = false; });
  }

  App.modules.push(init);
})();
