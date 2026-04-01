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

  // GIF mapping
  stateMap: {
    'idle': 'idle.gif',
    'thinking': 'thinking.gif',
    'talking': 'talking.gif',
    'explaining': 'explaining.gif',
    'excited': 'excited.gif',
    'waving': 'waving.gif',
    'confused': 'confused.gif',
    'sad': 'sad.gif',
    'surprised': 'surprised.gif',
    'typing': 'typing.gif',
    'laughing': 'laughing.gif',
    'blushing': 'blushing.gif',
    'sleeping': 'sleeping.gif',
    'angry': 'angry.gif',
    'boss-mood': 'boss-mood.gif',
    'dance': 'dance.gif',
    'mysterious': 'mysterious.gif',
    'hacker': 'hacker.gif',
    'love': 'love.gif',
    'love-kiss': 'love-kiss.gif'
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

  // Get GIF path
  getGifPath(state) {
    const gif = this.stateMap[state] || 'idle.gif';
    return `components/animation/${gif}`;
  },

  // Initialize
  init() {
    this.preloadStates(['idle', 'thinking', 'talking', 'waving']);
    this.startIdleTimer();
  },

  // Preload GIF
  preloadStates(states) {
    states.forEach(state => {
      if (!this.preloaded.has(state)) {
        const img = new Image();
        img.src = this.getGifPath(state);
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

    // Get all character images (welcome + floating)
    const welImg = document.getElementById('character-welcome-img');
    const floatImg = document.getElementById('character-floating-img');
    const containers = document.querySelectorAll('.character-container');
    const expressionEls = document.querySelectorAll('.character-expression');

    // Remove old special classes
    containers.forEach(c => {
      c.className = 'character-container';
    });

    // Crossfade out
    [welImg, floatImg].forEach(img => {
      if (img) img.classList.add('switching');
    });

    await Utils.delay(300);

    // Update source
    const newSrc = this.getGifPath(validState);
    [welImg, floatImg].forEach(img => {
      if (img) {
        img.src = newSrc;
        img.classList.remove('switching');
      }
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
