/* Cielo mágico: estrellas, luces suaves, corazones flotantes y destellos dorados.
   Un solo <canvas>, sprites pre-renderizados y límites de partículas para
   que vaya fluido incluso en móviles modestos. */
(function () {
  'use strict';

  const App = window.App;
  const TAU = Math.PI * 2;
  const Sky = (App.Sky = {});

  let canvas, ctx;
  let W = 0, H = 0, dpr = 1;
  let stars = [], orbs = [], hearts = [], bits = [];
  let raf = 0, last = 0, running = false, reduced = false;
  let baseRate = 0.9, mult = 1, heartTimer = 0, lastSpark = 0;
  let mood = 'rose';
  const S = {}; // sprites

  /* ---------- Sprites ---------- */
  function sprite(size, draw) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    draw(c.getContext('2d'), size);
    return c;
  }
  function glow(rgb) {
    return sprite(64, (g, s) => {
      const gr = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      gr.addColorStop(0, 'rgba(' + rgb + ',1)');
      gr.addColorStop(0.3, 'rgba(' + rgb + ',.45)');
      gr.addColorStop(1, 'rgba(' + rgb + ',0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, s, s);
    });
  }
  function heart(fill, shadow) {
    return sprite(64, (g, s) => {
      g.shadowColor = shadow;
      g.shadowBlur = 8;
      g.fillStyle = fill;
      const x = s / 2, y = 14, k = 36;
      g.beginPath();
      g.moveTo(x, y + k * 0.3);
      g.bezierCurveTo(x, y, x - k * 0.55, y, x - k * 0.55, y + k * 0.32);
      g.bezierCurveTo(x - k * 0.55, y + k * 0.62, x, y + k * 0.76, x, y + k);
      g.bezierCurveTo(x, y + k * 0.76, x + k * 0.55, y + k * 0.62, x + k * 0.55, y + k * 0.32);
      g.bezierCurveTo(x + k * 0.55, y, x, y, x, y + k * 0.3);
      g.closePath();
      g.fill();
    });
  }
  function buildSprites() {
    S.glowWhite = glow('255,255,255');
    S.glowGold = glow('255,223,140');
    S.glowPink = glow('255,170,210');
    S.hearts = [
      heart('#ffc2dc', 'rgba(255,170,210,.9)'),
      heart('#ffffff', 'rgba(255,255,255,.8)'),
      heart('#f6e3a8', 'rgba(255,223,140,.9)'),
      heart('#ff9fc6', 'rgba(255,120,180,.8)')
    ];
  }

  /* ---------- Siembra ---------- */
  function seed() {
    const n = App.clamp(Math.round((W * H) / 6500), 50, 170);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: App.rand(0.4, 1.6), a: App.rand(0.35, 1),
      p: Math.random() * TAU, s: App.rand(0.6, 2.2),
      gold: Math.random() < 0.18
    }));
    const m = W < 600 ? 7 : 12;
    const sprites = [S.glowPink, S.glowWhite, S.glowGold];
    orbs = Array.from({ length: m }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      r: App.rand(70, 180), a: App.rand(0.05, 0.13),
      vx: App.rand(-6, 6), vy: App.rand(-5, 5), spr: sprites[i % 3]
    }));
  }

  function spawnHeart(anywhere) {
    hearts.push({
      x: App.rand(0, W),
      y: anywhere ? App.rand(H * 0.25, H) : H + 30,
      vy: -App.rand(30, 60), s: App.rand(14, 30), a: App.rand(0.4, 0.9),
      ph: App.rand(0, TAU), sw: App.rand(0.6, 1.4), amp: App.rand(8, 26),
      spr: App.pick(S.hearts)
    });
  }

  function addBit(b) {
    bits.push(b);
    if (bits.length > 260) bits.splice(0, bits.length - 260);
  }
  function sparkle(x, y) {
    const max = App.rand(0.6, 1.1);
    addBit({
      x, y, vx: App.rand(-25, 25), vy: App.rand(-35, -5), g: 40,
      life: max, max, s: App.rand(10, 22),
      spr: Math.random() < 0.7 ? S.glowGold : S.glowWhite, rot: 0, vr: 0, heart: false
    });
  }

  /* ---------- Dibujo ---------- */
  function draw(dt, t) {
    ctx.clearRect(0, 0, W, H);
    const night = mood === 'night';

    // luces suaves
    for (const o of orbs) {
      if (!reduced) {
        o.x += o.vx * dt; o.y += o.vy * dt;
        if (o.x < -o.r) o.x = W + o.r; else if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r; else if (o.y > H + o.r) o.y = -o.r;
      }
      ctx.globalAlpha = o.a * (night ? 0.8 : 1);
      ctx.drawImage(o.spr, o.x - o.r, o.y - o.r, o.r * 2, o.r * 2);
    }

    // estrellas
    const boost = night ? 1 : 0.82;
    for (const s of stars) {
      const tw = reduced ? 0.8 : 0.55 + 0.45 * Math.sin(t * s.s + s.p);
      ctx.globalAlpha = s.a * tw * boost;
      ctx.fillStyle = s.gold ? '#ffe9a8' : '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, TAU);
      ctx.fill();
      if (s.r > 1.3) {
        ctx.globalAlpha = s.a * tw * boost * 0.7;
        ctx.drawImage(s.gold ? S.glowGold : S.glowWhite, s.x - 7, s.y - 7, 14, 14);
      }
    }

    if (!reduced) {
      // corazones flotantes
      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.y += h.vy * dt;
        h.ph += dt * h.sw;
        if (h.y < -40) { hearts.splice(i, 1); continue; }
        const life = h.y / H; // 1 abajo → 0 arriba
        const fade = App.clamp(life * 4, 0, 1) * App.clamp((1 - life) * 8, 0, 1);
        ctx.globalAlpha = h.a * fade;
        ctx.save();
        ctx.translate(h.x + Math.sin(h.ph) * h.amp, h.y);
        ctx.rotate(Math.sin(h.ph) * 0.3);
        ctx.drawImage(h.spr, -h.s / 2, -h.s / 2, h.s, h.s);
        ctx.restore();
      }

      // destellos y estallidos
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        b.life -= dt;
        if (b.life <= 0) { bits.splice(i, 1); continue; }
        b.vy += b.g * dt;
        b.vx *= 1 - 0.6 * dt;
        b.x += b.vx * dt; b.y += b.vy * dt;
        b.rot += b.vr * dt;
        const k = b.life / b.max;
        const sz = b.s * (b.heart ? 1 : 0.4 + k * 0.6);
        ctx.globalAlpha = Math.min(1, k * 1.6);
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.drawImage(b.spr, -sz / 2, -sz / 2, sz, sz);
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;

    heartTimer += dt;
    const maxHearts = (W < 600 ? 16 : 28) * Math.max(1, mult);
    if (heartTimer > 0.9 / (baseRate * mult) && hearts.length < maxHearts) {
      spawnHeart(false);
      heartTimer = 0;
    }
    draw(dt, now / 1000);
  }

  function start() {
    if (running || reduced || !canvas) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function resize() {
    const nw = window.innerWidth, nh = window.innerHeight;
    const big = Math.abs(nw - W) > 2 || Math.abs(nh - H) > 120;
    W = nw; H = nh;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (big || !stars.length) seed();
    if (reduced) draw(0, 0);
  }

  /* ---------- API ---------- */
  Sky.init = function (el) {
    canvas = el;
    ctx = canvas.getContext('2d');
    reduced = App.reducedMotion();
    buildSprites();
    resize();
    if (!reduced) {
      const n = W < 600 ? 5 : 9;
      for (let i = 0; i < n; i++) spawnHeart(true);
    }

    let pending = 0;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(resize);
    });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      reduced = e.matches;
      if (reduced) { stop(); hearts = []; bits = []; draw(0, 0); } else start();
    });

    // Destellos dorados que siguen el dedo o el cursor
    window.addEventListener('pointermove', (e) => {
      if (reduced) return;
      const n = performance.now();
      if (n - lastSpark < 55) return;
      lastSpark = n;
      sparkle(e.clientX, e.clientY);
    }, { passive: true });
    window.addEventListener('pointerdown', (e) => {
      if (reduced) return;
      for (let i = 0; i < 5; i++) sparkle(e.clientX + App.rand(-8, 8), e.clientY + App.rand(-8, 8));
    }, { passive: true });

    if (reduced) draw(0, 0); else start();
  };

  Sky.setMood = function (m) {
    mood = m;
    mult = 1;
    baseRate = m === 'night' ? 0.6 : m === 'dusk' ? 1 : 0.9;
  };

  Sky.setHeartRate = function (k) { mult = k; };

  Sky.burst = function (x, y, n) {
    if (reduced || !canvas) return;
    n = n || 40;
    for (let i = 0; i < n; i++) {
      const a = App.rand(0, TAU), sp = App.rand(60, 300);
      const isHeart = Math.random() < 0.45;
      const max = App.rand(1.2, 2.4);
      addBit({
        x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, g: 160,
        life: max, max, s: isHeart ? App.rand(14, 28) : App.rand(14, 30),
        spr: isHeart ? App.pick(S.hearts) : App.pick([S.glowGold, S.glowWhite]),
        rot: App.rand(-1, 1), vr: App.rand(-2, 2), heart: isHeart
      });
    }
  };
})();
