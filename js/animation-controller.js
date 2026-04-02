/* ============================================
   RaxhuAI — Animation Controller
   ============================================ */

const AnimationController = {
  currentState: 'idle',
  previousState: 'idle',
  idleTimer: null,
  isTransitioning: false,
  preloaded: new Set(),
  lockedUntil: 0,  // timestamp until which state changes are blocked
  useWebm: false,

  // Shared animation state names
  stateMap: {
    'idle': 'idle',
    'thinking': 'thinking',
    'talking': 'talking',
    'explaining': 'explaining',
    'excited': 'excited',
    'waving': 'waving',
    'confused': 'confused',
    'sad': 'sad',
    'surprised': 'surprised',
    'typing': 'typing',
    'laughing': 'laughing',
    'blushing': 'blushing',
    'sleeping': 'sleeping',
    'angry': 'angry',
    'boss-mood': 'boss-mood',
    'dance': 'dance',
    'mysterious': 'mysterious',
    'hacker': 'hacker',
    'love': 'love',
    'love-kiss': 'love-kiss'
  },

  // Expression labels for display
  expressionLabels: {
    'idle': '😌 Chilling...',
    'thinking': '🤔 Thinking...',
    'talking': '💬 Talking...',
    'explaining': '📖 Explaining...',
    'excited': '😄 Excited!',
    'waving': '👋 Hello!',
    'confused': '😕 Confused...',
    'sad': '😢 Sad...',
    'surprised': '😲 Surprised!',
    'typing': '💻 Working...',
    'laughing': '😂 Hahaha!',
    'blushing': '😊 Blushing...',
    'sleeping': '😴 Zzz...',
    'angry': '😠 Hmph!',
    'boss-mood': '😎 Boss Mode!',
    'dance': '🕺 Dancing!',
    'mysterious': '🌚 Mysterious...',
    'hacker': '💻 Hacking...',
    'love': '🥰 Loved!',
    'love-kiss': '😘 Mwah!'
  },

  // CSS classes for special states
  specialClasses: {
    'boss-mood': 'boss-mode',
    'hacker': 'hacker-mode',
    'love': 'love-mode',
    'love-kiss': 'love-mode',
    'dance': 'dance-mode',
    'sleeping': 'sleeping-mode',
    'excited': 'supersaiyan-mode' // only for power up
  },

  // Keep this function for compatibility with existing callers expecting an image path
  getGifPath(state) {
    const baseName = this.stateMap[state] || 'idle';
    return `components/animation/${baseName}.gif`;
  },

  getWebmPath(state) {
    const baseName = this.stateMap[state] || 'idle';
    return `components/webm/${baseName}.webm`;
  },

  supportsWebm() {
    const video = document.createElement('video');
    return !!video.canPlayType && video.canPlayType('video/webm; codecs="vp9"') !== '';
  },

  getCharacterMediaElements() {
    return [
      document.getElementById('character-welcome-img'),
      document.getElementById('character-floating-img')
    ].filter(Boolean);
  },

  replaceWithGifImage(el, state) {
    if (!el || el.tagName !== 'VIDEO') return el;
    const img = document.createElement('img');
    img.id = el.id;
    img.className = el.className;
    img.alt = "Rashed's AI Character";
    img.src = this.getGifPath(state);
    el.replaceWith(img);

    // Character click reactions are bound to media elements; rebind after replacing nodes.
    if (typeof CharacterReactions !== 'undefined' && typeof CharacterReactions.attachListeners === 'function') {
      CharacterReactions.attachListeners('.character-img');
    }

    return img;
  },

  setMediaSource(el, state) {
    if (!el) return;

    if (el.tagName === 'VIDEO') {
      if (!this.useWebm) {
        this.replaceWithGifImage(el, state);
        return;
      }

      const videoSrc = this.getWebmPath(state);
      if (el.getAttribute('src') !== videoSrc) {
        el.setAttribute('src', videoSrc);
        el.load();
      }
      const playPromise = el.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {
          this.replaceWithGifImage(el, state);
        });
      }
      return;
    }

    el.src = this.getGifPath(state);
  },

  // Initialize
  init() {
    this.useWebm = this.supportsWebm();

    if (!this.useWebm) {
      this.getCharacterMediaElements().forEach(el => {
        const initialState = el.id === 'character-welcome-img' ? 'waving' : 'idle';
        this.replaceWithGifImage(el, initialState);
      });
    }

    // Preload high-frequency states immediately
    this.preloadStates(['idle', 'waving', 'thinking', 'talking', 'typing']);
    // Preload the rest shortly after initial paint
    setTimeout(() => {
      this.preloadStates(Object.keys(this.stateMap));
    }, 200);

    this.startIdleTimer();
  },

  // Preload animation assets for snappy state switching
  preloadStates(states) {
    states.forEach(state => {
      if (!this.preloaded.has(state)) {
        if (this.useWebm) {
          const v = document.createElement('video');
          v.preload = 'auto';
          v.muted = true;
          v.src = this.getWebmPath(state);
          v.load();
        } else {
          const img = new Image();
          img.src = this.getGifPath(state);
        }
        this.preloaded.add(state);
      }
    });
  },

  // Lock state for a duration (blocks non-forced transitions)
  lockState(ms) {
    this.lockedUntil = Date.now() + ms;
  },

  // Check if state is locked
  isLocked() {
    return Date.now() < this.lockedUntil;
  },

  // Set character state with crossfade
  async setState(newState, options = {}) {
    // If locked and not forced, skip
    if (this.isLocked() && !options.force) return;
    if (this.isTransitioning && !options.force) return;
    if (newState === this.currentState && !options.force) return;

    const validState = this.stateMap[newState] ? newState : 'idle';
    this.isTransitioning = true;
    
    // Default to at least 3 seconds lock for new interactive animations (if duration provided)
    // Or if options.lockDuration is explicitly provided.
    const lockTime = options.lockDuration || (options.duration ? Math.max(options.duration, 3000) : 0);
    if (lockTime > 0) {
       this.lockState(lockTime);
    }

    // Preload the new state
    this.preloadStates([validState]);

    // Get all character media elements (welcome + floating)
    const mediaEls = this.getCharacterMediaElements();
    const containers = document.querySelectorAll('.character-container');
    const expressionEls = document.querySelectorAll('.character-expression');

    // Remove old special classes
    containers.forEach(c => {
      c.className = 'character-container';
    });

    // Crossfade out
    mediaEls.forEach(el => {
      el.classList.add('switching');
    });

    await Utils.delay(300);

    // Update source (webm primary, gif fallback)
    mediaEls.forEach(el => {
      this.setMediaSource(el, validState);
      el.classList.remove('switching');
    });

    // Add special CSS class if applicable
    if (options.specialClass) {
      containers.forEach(c => c.classList.add(options.specialClass));
    } else if (this.specialClasses[validState] && !options.noSpecialClass) {
      // Only add dance-mode for dance, sleeping-mode for sleeping etc
      if (['dance', 'sleeping'].includes(validState)) {
        containers.forEach(c => c.classList.add(this.specialClasses[validState]));
      }
    }

    // Update expression label
    expressionEls.forEach(el => {
      el.textContent = this.expressionLabels[validState] || '😌 Chilling...';
    });

    // Handle Zzz for sleeping
    this.handleSleepingZzz(validState === 'sleeping');

    this.previousState = this.currentState;
    this.currentState = validState;
    this.isTransitioning = false;

    // Reset idle timer
    if (validState !== 'sleeping' && validState !== 'idle') {
      this.resetIdleTimer();
    }

    // Auto-return to idle after some states
    if (options.duration) {
      await Utils.delay(options.duration);
      this.setState('idle');
    }
  },

  // Handle sleeping Zzz display
  handleSleepingZzz(show) {
    const zzzContainers = document.querySelectorAll('.zzz-container');
    zzzContainers.forEach(el => {
      el.style.display = show ? 'block' : 'none';
    });
  },

  // Idle timer — go to sleep after 30s of no activity
  startIdleTimer() {
    this.resetIdleTimer();
  },

  resetIdleTimer() {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      if (this.currentState === 'idle') {
        this.setState('sleeping');
      }
    }, 30000);
  },

  // Wake up from sleeping
  wakeUp() {
    if (this.currentState === 'sleeping') {
      this.setState('waving', { duration: 4000, lockDuration: 3000, force: true });
      if (typeof CharacterReactions !== 'undefined') {
        CharacterReactions.showSpeech("Oh! You're back! 😄 I may have dozed off for a sec! What can I help you with?");
      }
    }
    this.resetIdleTimer();
  },

  // Get current state
  getState() {
    return this.currentState;
  }
};
