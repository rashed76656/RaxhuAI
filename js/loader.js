/* ============================================
   RaxhuAI — Cinematic Loader Manager
   ============================================ */

const LoaderManager = (() => {
  let started = false;
  let tipTimer = null;

  const tips = [
    'Tip: "help" likhe shob command ek sathe dekho.',
    'Tip: "hack", "konami", "power up" diye secret effect unlock koro.',
    'Tip: Floating character ke drag kore jekhane ichcha niye jao.',
    'Tip: "download cv" diye premium CV open koro.'
  ];

  const checkpoints = [
    { value: 18, delay: 260, label: 'Character assets load hocche...' },
    { value: 35, delay: 360, label: 'Vibe code compile hocche...' },
    { value: 52, delay: 340, label: 'Cyber shields calibrate hocche...' },
    { value: 68, delay: 320, label: 'Portfolio data import hocche...' },
    { value: 82, delay: 300, label: 'Animations polish hocche...' },
    { value: 94, delay: 260, label: 'Almost ready...' },
    { value: 100, delay: 280, label: 'RaxhuAI te shagotom! ✨' }
  ];

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  function createSoundController(button) {
    const ctx = window.AudioContext || window.webkitAudioContext;
    const stateKey = 'raxhu_loader_sound';
    let enabled = localStorage.getItem(stateKey) !== 'false';
    let audioCtx = null;

    const updateButton = () => {
      if (!button) return;
      button.textContent = enabled ? 'Sound: On' : 'Sound: Off';
      button.classList.toggle('active', enabled);
      button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    };

    const ensureCtx = async () => {
      if (!ctx) return null;
      if (!audioCtx) audioCtx = new ctx();
      if (audioCtx.state === 'suspended') {
        try { await audioCtx.resume(); } catch (_) {}
      }
      return audioCtx;
    };

    const play = async (frequency = 460, duration = 0.07, volume = 0.02, type = 'sine') => {
      if (!enabled) return;
      const currentCtx = await ensureCtx();
      if (!currentCtx) return;

      const osc = currentCtx.createOscillator();
      const gain = currentCtx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, currentCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, currentCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(currentCtx.destination);
      osc.start();
      osc.stop(currentCtx.currentTime + duration);
    };

    if (button) {
      button.addEventListener('click', async () => {
        enabled = !enabled;
        localStorage.setItem(stateKey, enabled ? 'true' : 'false');
        updateButton();
        if (enabled) {
          await play(640, 0.09, 0.03, 'triangle');
        }
      });
    }

    updateButton();

    return {
      play,
      sequence: async () => {
        await play(560, 0.08, 0.02, 'triangle');
        await delay(70);
        await play(720, 0.1, 0.022, 'triangle');
      }
    };
  }

  function setupParticles(canvas) {
    if (!canvas) return { stop: () => {} };

    const ctx = canvas.getContext('2d');
    let rafId = 0;
    let running = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const palette = ['#7d95ff', '#c690ff', '#ff8ac7', '#6ce2ff'];
    const particles = Array.from({ length: 60 }, () => createParticle());

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.7,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        alpha: Math.random() * 0.75 + 0.15,
        life: Math.random() * 250 + 120,
        color: palette[Math.floor(Math.random() * palette.length)]
      };
    }

    function drawBurst() {
      const burst = Array.from({ length: 85 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.2 + 1;
        return {
          x: canvas.width * 0.78,
          y: canvas.height * 0.72,
          r: Math.random() * 2.6 + 0.9,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: Math.random() * 46 + 30,
          alpha: 1,
          color: palette[Math.floor(Math.random() * palette.length)]
        };
      });

      let burstFrames = 0;
      const burstAnim = () => {
        if (!running || burstFrames > 70) return;
        burst.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.008;
          p.alpha *= 0.97;
          ctx.beginPath();
          ctx.fillStyle = `${hexToRgba(p.color, p.alpha)}`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
        burstFrames++;
        requestAnimationFrame(burstAnim);
      };

      burstAnim();
    }

    function hexToRgba(hex, alpha) {
      const stripped = hex.replace('#', '');
      const bigint = parseInt(stripped, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    const loop = () => {
      if (!running) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (p.x < -12 || p.x > canvas.width + 12 || p.y < -12 || p.y > canvas.height + 12 || p.life <= 0) {
          particles[i] = createParticle();
          return;
        }

        ctx.beginPath();
        ctx.fillStyle = hexToRgba(p.color, p.alpha);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      rafId = requestAnimationFrame(loop);
    };

    loop();

    return {
      burst: drawBurst,
      stop: () => {
        running = false;
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
      }
    };
  }

  async function start() {
    if (started) return;
    started = true;

    const loader = document.getElementById('loader');
    if (!loader) return;

    const skipBtn = document.getElementById('loader-skip-btn');
    const soundBtn = document.getElementById('loader-sound-btn');
    const letters = [...document.querySelectorAll('.loader-letter')];
    const tagline = document.getElementById('loader-tagline');
    const tipEl = document.getElementById('loader-tip');
    const progressWrap = document.getElementById('loader-progress-wrap');
    const progressFill = document.getElementById('loader-progress-fill');
    const statusEl = document.getElementById('loader-status');
    const percentEl = document.getElementById('loader-percent');
    const avatar = document.getElementById('loader-avatar');
    const particleCtl = setupParticles(document.getElementById('loader-particles'));

    let skipped = false;
    let tipIndex = 0;
    const seenKey = 'raxhu_loader_seen';
    const hasSeen = localStorage.getItem(seenKey) === 'true';
    const sound = createSoundController(soundBtn);

    if (hasSeen) {
      loader.classList.add('fast-mode');
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        skipped = true;
      });
    }

    const setTip = () => {
      if (!tipEl) return;
      tipEl.classList.remove('show');
      setTimeout(() => {
        tipEl.textContent = tips[tipIndex % tips.length];
        tipEl.classList.add('show');
        tipIndex++;
      }, 120);
    };

    setTip();
    tipTimer = window.setInterval(setTip, 1600);

    // Letter reveal
    const letterStart = hasSeen ? 170 : 560;
    const letterStep = hasSeen ? 42 : 78;
    letters.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('show');
      }, letterStart + i * letterStep);
    });

    await delay(hasSeen ? 70 : 820);
    if (tagline) tagline.classList.add('show');

    await delay(hasSeen ? 60 : 340);
    if (progressWrap) progressWrap.classList.add('show');

    const fastTrack = hasSeen
      ? [
          { value: 45, delay: 65, label: 'Experience ready hocche...' },
          { value: 75, delay: 70, label: 'Modules sync hocche...' },
          { value: 100, delay: 80, label: 'Welcome back, boss! ✨' }
        ]
      : checkpoints;

    for (const step of fastTrack) {
      if (skipped) break;
      if (progressFill) progressFill.style.width = `${step.value}%`;
      if (statusEl) statusEl.textContent = step.label;
      if (percentEl) percentEl.textContent = `${step.value}%`;
      sound.play(400 + step.value * 2, 0.06, 0.018, step.value > 80 ? 'triangle' : 'sine');
      await delay(step.delay);
    }

    if (progressFill) progressFill.style.width = '100%';
    if (statusEl) statusEl.textContent = hasSeen ? 'Welcome back, boss! ✨' : 'RaxhuAI te shagotom! ✨';
    if (percentEl) percentEl.textContent = '100%';

    await delay(hasSeen ? 40 : 160);
    loader.classList.add('split-open');
    if (avatar) avatar.classList.add('show');
    sound.sequence();
    particleCtl.burst?.();

    await delay(hasSeen ? 420 : 860);
    loader.classList.add('done');
    localStorage.setItem(seenKey, 'true');

    await delay(hasSeen ? 250 : 520);
    particleCtl.stop();
    if (tipTimer) {
      clearInterval(tipTimer);
      tipTimer = null;
    }
    loader.remove();
  }

  return { start };
})();

window.LoaderManager = LoaderManager;
