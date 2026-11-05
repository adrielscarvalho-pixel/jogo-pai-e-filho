/* =========================================================
   SONS (sintetizados, sem arquivos) + CONFETES
   ========================================================= */
window.SFX = (() => {
  let ctx = null;
  let on = true;

  function ac() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type = 'sine', vol = 0.15, when = 0, slideTo = null) {
    if (!on) return;
    const c = ac();
    if (!c) return;
    const t = c.currentTime + when;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  function vib(p) { try { if (on && navigator.vibrate) navigator.vibrate(p); } catch (e) { /* ok */ } }

  return {
    get on() { return on; },
    set on(v) { on = !!v; },
    click() { tone(520, 0.05, 'square', 0.05); },
    tick() { tone(1400, 0.025, 'square', 0.035); },
    pop() { tone(380, 0.1, 'sine', 0.2, 0, 900); },
    coin() { tone(988, 0.08, 'square', 0.1); tone(1319, 0.3, 'square', 0.1, 0.08); },
    yes() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'triangle', 0.18, i * 0.07)); },
    no() { tone(200, 0.4, 'sawtooth', 0.12, 0, 90); vib(180); },
    whistle() { tone(2600, 0.12, 'sine', 0.12); tone(2600, 0.4, 'sine', 0.12, 0.16, 2400); },
    fanfare() {
      const n = [523, 659, 784, 1047, 784, 1047];
      n.forEach((f, i) => tone(f, i === n.length - 1 ? 0.7 : 0.14, 'square', 0.09, i * 0.13));
      n.forEach((f, i) => tone(f / 2, i === n.length - 1 ? 0.7 : 0.14, 'triangle', 0.08, i * 0.13));
    },
    sad() { [392, 370, 349, 330].forEach((f, i) => tone(f, i === 3 ? 0.6 : 0.25, 'triangle', 0.14, i * 0.25)); },
    stamp() { tone(140, 0.12, 'square', 0.15, 0, 60); }
  };
})();

window.Confetti = (() => {
  let cv, cx, parts = [], raf = null, W = 0, H = 0;
  const CORES = ['#FFD23F', '#FF5D73', '#2BD67B', '#4D96FF', '#7B5CFF', '#FF9F1C', '#ffffff'];

  function setup() {
    if (cv) return;
    cv = document.createElement('canvas');
    cv.className = 'confetti';
    document.body.appendChild(cv);
    cx = cv.getContext('2d');
    window.addEventListener('resize', resize);
    resize();
  }
  function resize() {
    if (!cv) return;
    const d = window.devicePixelRatio || 1;
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * d; cv.height = H * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
  }

  function burst(opts = {}) {
    setup();
    const n = opts.n || 140;
    const emojis = opts.emojis || null;
    for (let i = 0; i < n; i++) {
      const fromTop = opts.rain;
      parts.push({
        x: fromTop ? Math.random() * W : W / 2 + (Math.random() - 0.5) * 80,
        y: fromTop ? -20 - Math.random() * H * 0.5 : H * 0.4,
        vx: fromTop ? (Math.random() - 0.5) * 2 : (Math.random() - 0.5) * 16,
        vy: fromTop ? 2 + Math.random() * 3 : -6 - Math.random() * 12,
        rot: Math.random() * 6.28,
        vr: (Math.random() - 0.5) * 0.3,
        w: 6 + Math.random() * 8,
        h: 8 + Math.random() * 10,
        c: CORES[(Math.random() * CORES.length) | 0],
        emoji: emojis && Math.random() < 0.6 ? emojis[(Math.random() * emojis.length) | 0] : null,
        size: 22 + Math.random() * 18,
        life: 0
      });
    }
    if (!raf) raf = requestAnimationFrame(loop);
  }

  function loop() {
    cx.clearRect(0, 0, W, H);
    parts.forEach(p => {
      p.vy += 0.25; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
      cx.save();
      cx.translate(p.x, p.y);
      cx.rotate(p.rot);
      if (p.emoji) {
        cx.font = `${p.size}px serif`;
        cx.textAlign = 'center';
        cx.fillText(p.emoji, 0, 0);
      } else {
        cx.fillStyle = p.c;
        cx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.life * 0.1)));
      }
      cx.restore();
    });
    parts = parts.filter(p => p.y < H + 60 && p.life < 600);
    if (parts.length) raf = requestAnimationFrame(loop);
    else { raf = null; cx.clearRect(0, 0, W, H); }
  }

  return { burst };
})();
