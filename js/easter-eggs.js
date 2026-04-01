/* ============================================
   RaxhuAI — Easter Eggs & Special Effects
   ============================================ */

const EasterEggs = {
  konamiSequence: ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'],
  konamiIndex: 0,

  init() {
    // Konami code listener
    document.addEventListener('keydown', (e) => {
      if (e.key === this.konamiSequence[this.konamiIndex]) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiSequence.length) {
          this.konamiIndex = 0;
          const input = document.getElementById('chat-input');
          if (input) { input.value = 'konami'; ChatEngine.sendMessage(); }
        }
      } else {
        this.konamiIndex = 0;
      }
    });
  },

  // Trigger visual effect
  triggerEffect(effect) {
    switch (effect) {
      case 'confetti': this.confetti(); break;
      case 'matrix': this.matrixRain(); break;
      case 'hearts': this.hearts(); break;
      case 'fireworks': this.fireworks(); break;
      case 'dark': this.darkOverlay(); break;
      case 'boss': this.bossGlow(); break;
      case 'sparkle': this.sparkles(); break;
      case 'glitch': this.glitchEffect(); break;
      case 'energy': this.energyBurst(); break;
      case 'whisper': this.whisperEffect(); break;
    }
  },

  // === CONFETTI ===
  confetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#6C63FF','#FF6B9D','#00D2FF','#00E897','#FF9F43','#FFD700'];
    const particles = [];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.2,
        drift: (Math.random() - 0.5) * 2
      });
    }

    let frame = 0;
    const maxFrames = 180;
    const animate = () => {
      if (frame > maxFrames) { ctx.clearRect(0,0,canvas.width,canvas.height); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speed;
        p.x += p.drift;
        p.angle += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / maxFrames);
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      requestAnimationFrame(animate);
    };
    animate();
  },

  // === MATRIX RAIN ===
  matrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.opacity = '0.4';

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*ラシェド';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);

    let frame = 0;
    const maxFrames = 200;
    const draw = () => {
      if (frame > maxFrames) { ctx.clearRect(0,0,canvas.width,canvas.height); canvas.style.opacity = '0'; return; }
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0f0';
      ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      frame++;
      requestAnimationFrame(draw);
    };
    draw();
  },

  // === FLOATING HEARTS ===
  hearts() {
    const container = document.getElementById('hearts-container');
    if (!container) return;
    const heartSymbols = ['❤️','💕','💖','💗','💝','🥰','💘'];

    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.bottom = '-20px';
        heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
        heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 4000);
      }, i * 150);
    }
  },

  // === FIREWORKS ===
  fireworks() {
    const container = document.getElementById('fireworks-container');
    if (!container) return;
    const colors = ['#FF6B9D','#6C63FF','#00D2FF','#FFD700','#00E897','#FF9F43'];

    for (let f = 0; f < 5; f++) {
      setTimeout(() => {
        const cx = Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2;
        const cy = Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 30; i++) {
          const particle = document.createElement('div');
          particle.className = 'firework-particle';
          const angle = (Math.PI * 2 / 30) * i;
          const dist = Math.random() * 120 + 60;
          particle.style.left = cx + 'px';
          particle.style.top = cy + 'px';
          particle.style.background = color;
          particle.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
          particle.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
          container.appendChild(particle);
          setTimeout(() => particle.remove(), 1500);
        }
      }, f * 500);
    }
  },

  // === DARK OVERLAY ===
  darkOverlay() {
    const overlay = document.getElementById('effect-overlay');
    if (!overlay) return;
    overlay.classList.add('dark-overlay', 'active');
    setTimeout(() => overlay.classList.remove('active', 'dark-overlay'), 5000);
  },

  // === BOSS GLOW ===
  bossGlow() {
    const containers = document.querySelectorAll('.character-container');
    containers.forEach(c => c.classList.add('boss-mode'));
    setTimeout(() => containers.forEach(c => c.classList.remove('boss-mode')), 8000);
  },

  // === SPARKLES ===
  sparkles() {
    const container = document.getElementById('fireworks-container');
    if (!container) return;
    const sparkColors = ['#FFD700','#FFA500','#FF69B4','#00FFFF','#ADFF2F'];
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const spark = document.createElement('div');
        spark.className = 'spark-particle';
        spark.style.left = Math.random() * window.innerWidth + 'px';
        spark.style.top = Math.random() * window.innerHeight + 'px';
        spark.style.background = sparkColors[Math.floor(Math.random() * sparkColors.length)];
        spark.style.setProperty('--sx', (Math.random()-0.5) * 100 + 'px');
        spark.style.setProperty('--sy', (Math.random()-0.5) * 100 + 'px');
        container.appendChild(spark);
        setTimeout(() => spark.remove(), 2000);
      }, i * 80);
    }

    // Add magic-mode to character
    const containers = document.querySelectorAll('.character-container');
    containers.forEach(c => c.classList.add('magic-mode'));
    setTimeout(() => containers.forEach(c => c.classList.remove('magic-mode')), 6000);
  },

  // === GLITCH ===
  glitchEffect() {
    const main = document.querySelector('.main-content');
    if (main) {
      main.classList.add('glitch-active');
      setTimeout(() => main.classList.remove('glitch-active'), 3000);
    }
  },

  // === ENERGY BURST ===
  energyBurst() {
    const containers = document.querySelectorAll('.character-container');
    containers.forEach(c => {
      c.classList.add('supersaiyan-mode');
      c.classList.add('energy-aura');
    });
    // Also add some spark particles
    this.sparkles();
    setTimeout(() => {
      containers.forEach(c => {
        c.classList.remove('supersaiyan-mode');
        c.classList.remove('energy-aura');
      });
    }, 8000);
  },

  // === WHISPER ===
  whisperEffect() {
    const overlay = document.getElementById('effect-overlay');
    if (overlay) {
      overlay.style.background = 'rgba(0,0,0,0.3)';
      overlay.classList.add('active');
      setTimeout(() => { overlay.classList.remove('active'); overlay.style.background = ''; }, 4000);
    }
  }
};
