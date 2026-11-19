/* Escena 5 · Reproductor discreto.
   Nunca reproduce solo: la música empieza únicamente cuando se pulsa play.
   Si music.src está vacío, muestra un espacio reservado. */
(function () {
  'use strict';

  const App = window.App;
  const C = window.CONTENT.music;
  const timers = App.createTimers();

  let audio, player, btn, seek, tCur, tDur, note, mini;
  let started = false;
  let fadeId = null;

  function setProgress() {
    const d = audio.duration;
    const c = audio.currentTime || 0;
    const ratio = isFinite(d) && d > 0 ? c / d : 0;
    seek.value = Math.round(ratio * 1000);
    seek.style.setProperty('--p', ratio * 100 + '%');
    tCur.textContent = App.fmtTime(c);
    tDur.textContent = App.fmtTime(d);
    seek.setAttribute('aria-valuetext', App.fmtTime(c) + ' de ' + App.fmtTime(d));
  }

  function setPlaying(on) {
    player.classList.toggle('is-playing', on);
    mini.classList.toggle('is-playing', on);
    const label = window.CONTENT.ui[on ? 'pause' : 'play'];
    btn.setAttribute('aria-label', label);
    mini.setAttribute('aria-label', label);
  }

  function updateMini() {
    mini.hidden = !(started && App.Scenes.current() !== 'music');
  }

  function showError() {
    note.textContent = C.error;
    note.classList.add('is-error');
    btn.disabled = true;
    seek.disabled = true;
  }

  function fadeIn() {
    clearInterval(fadeId);
    try { audio.volume = 0; } catch (e) { return; }
    fadeId = setInterval(() => {
      const v = Math.min(0.9, audio.volume + 0.05);
      try { audio.volume = v; } catch (e) { clearInterval(fadeId); }
      if (v >= 0.9) clearInterval(fadeId);
    }, 70);
  }

  function toggle() {
    if (!audio.paused) { audio.pause(); return; }
    const p = audio.play();
    if (p && p.catch) p.catch(showError);
    fadeIn();
  }

  function enter() {
    timers.clear();
    player.classList.remove('is-in');
    if (App.reducedMotion()) player.classList.add('is-in');
    else timers.after(250, () => player.classList.add('is-in'));
    updateMini();
  }

  function init() {
    audio = document.getElementById('audio');
    player = document.getElementById('player');
    btn = document.getElementById('btnPlay');
    seek = document.getElementById('seek');
    tCur = document.getElementById('tCur');
    tDur = document.getElementById('tDur');
    note = document.getElementById('musicNote');
    mini = document.getElementById('mini');

    document.getElementById('btnMusicNext').addEventListener('click', () => App.Scenes.next());
    App.Scenes.on('music', enter, () => timers.clear());
    document.addEventListener('scene:enter', updateMini);

    if (!C.src) {
      player.classList.add('is-empty');
      note.textContent = C.placeholder;
      btn.disabled = true;
      seek.disabled = true;
      return;
    }

    audio.preload = 'metadata';
    audio.src = C.src;

    btn.addEventListener('click', toggle);
    mini.addEventListener('click', toggle);
    seek.addEventListener('input', () => {
      if (isFinite(audio.duration)) audio.currentTime = (seek.value / 1000) * audio.duration;
      setProgress();
    });

    audio.addEventListener('play', () => { started = true; setPlaying(true); updateMini(); });
    audio.addEventListener('pause', () => { clearInterval(fadeId); setPlaying(false); });
    audio.addEventListener('ended', () => { audio.currentTime = 0; setPlaying(false); setProgress(); });
    audio.addEventListener('timeupdate', setProgress);
    audio.addEventListener('loadedmetadata', setProgress);
    audio.addEventListener('durationchange', setProgress);
    audio.addEventListener('error', showError);
  }

  App.modules.push(init);
})();
