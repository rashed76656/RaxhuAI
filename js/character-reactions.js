/* ============================================
   RaxhuAI — Character Click Reactions System
   ============================================ */

const CharacterReactions = {
  clickCount: 0,
  escalationCount: 0,
  clickTimer: null,
  resetTimer: null,
  bufferTimer: null,
  clicksInBuffer: 0,
  bubbleTimers: new Map(),

  reactions: {
    funny: [
      { char: "laughing", speech: "Hey! That tickles! 😂" },
      { char: "laughing", speech: "Stop poking me! 😄" },
      { char: "surprised", speech: "I'm not a button! ...okay maybe I am 😅" },
      { char: "laughing", speech: "Again?! Really?! 😂" },
      { char: "laughing", speech: "I saw that! 👀" },
      { char: "surprised", speech: "Click me one more time, I dare you! 😏" },
      { char: "laughing", speech: "What do you want from me?! 😂" },
      { char: "surprised", speech: "Okay okay, I'm awake! 😳" },
      { char: "laughing", speech: "Do you click everyone you meet? 😂" },
      { char: "laughing", speech: "Ei! Hath soro! 😂" },
      { char: "laughing", speech: "Click korle ki paoa jay?! 😂" },
      { char: "laughing", speech: "Bhai, please! 😅" },
    ],
    annoyed: [
      { char: "angry", speech: "FOCUS! My portfolio is right there! 👉" },
      { char: "angry", speech: "Click my PROJECTS, not me! 😤" },
      { char: "angry", speech: "Do you do this to ChatGPT too?! 😠" },
      { char: "angry", speech: "Okay I'm lodging a complaint! 😤" },
      { char: "angry", speech: "HR department-e report korbo! 😤" },
      { char: "angry", speech: "This is workplace harassment! 😂" },
      { char: "angry", speech: "I have rights, you know! 😠" },
    ],
    shy: [
      { char: "blushing", speech: "H-hey, personal space! 😳" },
      { char: "blushing", speech: "You clicked me... 🥺 that's kinda sweet" },
      { char: "blushing", speech: "Stop, you're making me blush! 😊" },
      { char: "blushing", speech: "I wasn't ready for that! 😳" },
      { char: "blushing", speech: "Nobody ever clicks me like that... 🥺" },
      { char: "blushing", speech: "My circuits are overheating! 😳💜" },
    ],
    boss: [
      { char: "boss-mood", speech: "You clicked the right person! 😎" },
      { char: "boss-mood", speech: "Smart move! Now hire me! 😎" },
      { char: "boss-mood", speech: "Click detected. Impressive taste! 💼" },
      { char: "boss-mood", speech: "I know I'm clickable. Can't help it 😎" },
      { char: "boss-mood", speech: "Every click = +1 confidence stat! 💪" },
    ],
    mysterious: [
      { char: "mysterious", speech: "Why did you click me... what do you know? 🌚" },
      { char: "mysterious", speech: "I've been expecting you... 🔮" },
      { char: "mysterious", speech: "That click just unlocked something... maybe 👀" },
      { char: "mysterious", speech: "Some say clicking 3 times reveals a secret... 👀" },
      { char: "mysterious", speech: "Interesting choice... very interesting 🌚" },
    ],
    love: [
      { char: "love", speech: "Clicked me because you like me? 🥰" },
      { char: "love", speech: "Aww, you just want attention! So do I! 💜" },
      { char: "love", speech: "That click felt warm somehow... 🥺💜" },
    ]
  },

  escalationSequence: [
    { char: "laughing", speech: "Hey! That tickles! 😂" },
    { char: "laughing", speech: "Hehe okay that was funny 😄" },
    { char: "confused", speech: "Okay okay I see what you're doing... 😅" },
    { char: "talking", speech: "Seriously, the projects are RIGHT THERE 👉" },
    { char: "angry", speech: "STOP. CLICKING. ME! 😠", effect: "shake" },
    { char: "mysterious", speech: "...you know what. Fine. 🌚" },
    { char: "sleeping", speech: "*passes out* zzz... 😴" },
  ],

  init() {
    this.attachListeners('.character-img');
    this.setupShakeStyle();
  },

  attachListeners(selector) {
    const images = document.querySelectorAll(selector);
    
    images.forEach(img => {
      if (img.dataset.reactionBound === 'true') return;
      img.dataset.reactionBound = 'true';

      // Set cursor
      img.style.cursor = 'pointer';
      img.title = 'Click me!';

      // Hover
      img.addEventListener('mouseenter', () => {
        if (AnimationController.getState() === 'idle') {
          this.showSpeech("Click me! 👆", true);
        }
      });

      // Unified Click Handling (Buffering clicks)
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        this.handleClickBuffer();
      });

      // Right Click
      img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.handleRightClick();
      });
    });
  },

  handleClickBuffer() {
    this.clicksInBuffer++;
    clearTimeout(this.bufferTimer);
    
    // Wait 250ms to see if more clicks are coming
    this.bufferTimer = setTimeout(() => {
      const totalClicks = this.clicksInBuffer;
      this.clicksInBuffer = 0; // Reset buffer

      if (totalClicks === 1) {
        this.handleSingleClick();
      } else if (totalClicks === 2) {
        this.handleDoubleClick();
      } else if (totalClicks >= 3) {
        this.handleTripleClick();
      }
    }, 250);
  },

  getRandomReaction() {
    const rand = Math.random() * 100;
    if (rand < 40) return this.getRandom(this.reactions.funny);
    else if (rand < 65) return this.getRandom(this.reactions.annoyed);
    else if (rand < 80) return this.getRandom(this.reactions.shy);
    else if (rand < 90) return this.getRandom(this.reactions.boss);
    else if (rand < 97) return this.getRandom(this.reactions.mysterious);
    else return this.getRandom(this.reactions.love);
  },

  getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  handleSingleClick() {
    this.escalationCount++;
    clearTimeout(this.resetTimer);

    if (this.escalationCount >= this.escalationSequence.length) {
      // Stay at sleeping
      const last = this.escalationSequence[this.escalationSequence.length - 1];
      AnimationController.setState(last.char, { duration: 5000, lockDuration: 3000, force: true, specialClass: last.char === 'sleeping' ? 'sleeping-mode' : null });
      this.showSpeech(last.speech);
    } else {
      const step = this.escalationSequence[this.escalationCount - 1];
      AnimationController.setState(step.char, { duration: 4000, lockDuration: 3000, force: true });
      this.showSpeech(step.speech);
      if (step.effect === 'shake') this.shakeScreen();
    }

    // Reset escalation counter after 5s of no clicks
    this.resetTimer = setTimeout(() => {
      this.escalationCount = 0;
      AnimationController.setState('idle');
    }, 5000);
  },

  handleDoubleClick() {
    const reactions = [
      "DOUBLE CLICK?! What are you trying to open?! 😂",
      "Bro thinks I'm a folder! 😂",
      "Double the click, double the trouble! 😤",
      "Okay okay okay! I get it! 😅",
      "I'm not a file you can open! 😂",
    ];
    AnimationController.setState('surprised', { duration: 3000, lockDuration: 3000, force: true });
    this.showSpeech(this.getRandom(reactions));
  },

  handleTripleClick() {
    // Secret triple click easter egg!
    AnimationController.setState('excited', { duration: 5000, lockDuration: 3000, specialClass: 'supersaiyan-mode', force: true });
    this.showSpeech("Triple click secret unlocked! 🏆");
    
    if (typeof EasterEggs !== 'undefined' && typeof EasterEggs.spawnConfetti === 'function') {
      EasterEggs.spawnConfetti();
    }

    if (typeof EasterEggs !== 'undefined' && typeof EasterEggs.showOverlay === 'function') {
       EasterEggs.showOverlay(
         "⭐ Secret Click Combo Found!",
         "NOT MANY PEOPLE KNOW THIS EXISTS! You triple-clicked the character and unlocked a secret! You're officially a Rashed AI legend!",
         AnimationController.getGifPath('excited')
       );
    }
  },

  handleRightClick() {
    const reactions = [
      { char: "angry", speech: "No right-clicking! I'm not open source! 😤" },
      { char: "boss-mood", speech: "Context menu? My context is: hire me! 😎" },
      { char: "mysterious", speech: "Right-click won't reveal my secrets! 🌚" },
      { char: "laughing", speech: "Inspect element korar chesta? 👀 Rashed jane! 😂" },
    ];
    const r = this.getRandom(reactions);
    AnimationController.setState(r.char, { duration: 3000, lockDuration: 3000, force: true });
    this.showSpeech(r.speech);
  },

  showSpeech(text, isHover = false) {
    const bubbles = document.querySelectorAll('.reaction-bubble');
    
    bubbles.forEach(bubble => {
       bubble.textContent = text;
       bubble.classList.add('show');
       
       // Clear previous timer if exists
       if (this.bubbleTimers.has(bubble)) {
         clearTimeout(this.bubbleTimers.get(bubble));
       }
       
       // Hide bubble after 3.5 seconds
       const timer = setTimeout(() => {
         bubble.classList.remove('show');
       }, 3500);
       
       this.bubbleTimers.set(bubble, timer);
    });
    
    // Only log clicks to console if it's not a hover
    if (!isHover) {
       console.log(`%c[Rashed AI]: %c${text}`, 'color: #6C63FF; font-weight: bold;', 'color: inherit;');
    }
  },

  shakeScreen() {
    document.body.classList.add('shake');
    setTimeout(() => { document.body.classList.remove('shake'); }, 300);
  },

  setupShakeStyle() {
    if (!document.getElementById('shake-style')) {
      const shakeStyle = document.createElement('style');
      shakeStyle.id = 'shake-style';
      shakeStyle.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
        .shake { animation: shake 0.3s ease; }
      `;
      document.head.appendChild(shakeStyle);
    }
  }
};
