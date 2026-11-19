/* Escena 4 · Galería de recuerdos (polaroids con scroll-snap).
   Si una foto no tiene "src" o falla al cargar, se muestra un marco elegante. */
(function () {
  'use strict';

  const App = window.App;
  const C = window.CONTENT.gallery;
  const timers = App.createTimers();

  let strip, track, prev, next;
  let items = [];
  let ticking = false;

  function placeholder() {
    const d = document.createElement('div');
    d.className = 'ph';
    d.setAttribute('role', 'img');
    d.setAttribute('aria-label', C.placeholderLabel || C.placeholder);
    d.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-camera"/></svg><span></span>';
    d.querySelector('span').textContent = C.placeholder;
    return d;
  }

  function makeItem(photo) {
    const li = document.createElement('li');
    li.className = 'gallery__item reveal';

    const fig = document.createElement('figure');
    fig.className = 'polaroid';

    const frame = document.createElement('div');
    frame.className = 'polaroid__frame';

    if (photo.src) {
      const img = new Image();
      img.alt = photo.caption || '';
      img.decoding = 'async';
      img.loading = 'lazy';
      img.addEventListener('error', () => frame.replaceChildren(placeholder()));
      img.src = photo.src;
      frame.appendChild(img);
    } else {
      frame.appendChild(placeholder());
    }

    const cap = document.createElement('figcaption');
    cap.textContent = photo.caption || '';

    fig.append(frame, cap);
    li.appendChild(fig);
    return li;
  }

  function updateNav() {
    ticking = false;
    const max = strip.scrollWidth - strip.clientWidth;
    prev.disabled = strip.scrollLeft <= 4;
    next.disabled = strip.scrollLeft >= max - 4;
  }

  function step(dir) {
    const w = items[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 22;
    strip.scrollBy({ left: dir * (w + gap), behavior: App.reducedMotion() ? 'auto' : 'smooth' });
  }

  function enter() {
    timers.clear();
    strip.scrollLeft = 0;
    updateNav();
    items.forEach((li) => li.classList.remove('is-in'));
    items.forEach((li, i) => {
      if (App.reducedMotion()) li.classList.add('is-in');
      else timers.after(250 + i * 220, () => li.classList.add('is-in'));
    });
  }

  function init() {
    strip = document.getElementById('gallery');
    track = document.getElementById('galleryTrack');
    prev = document.getElementById('galPrev');
    next = document.getElementById('galNext');

    C.photos.forEach((p) => track.appendChild(makeItem(p)));
    items = Array.from(track.children);

    if (items.length < 2) document.querySelector('.gallery__nav').hidden = true;

    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    strip.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updateNav); }
    }, { passive: true });
    window.addEventListener('resize', updateNav);
    document.getElementById('btnGalleryNext').addEventListener('click', () => App.Scenes.next());

    App.Scenes.on('gallery', enter, () => timers.clear());
  }

  App.modules.push(init);
})();
