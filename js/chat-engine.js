/* ============================================
   RaxhuAI — Chat Engine
   ============================================ */

const ChatEngine = {
  messages: [],
  isProcessing: false,
  visitorName: null,
  repeatToleranceByCommand: {
    hello: 5,
    help: 4,
    about: 3,
    skills: 3,
    projects: 3,
    contact: 3,
    education: 3,
    achievements: 3,
    downloadCv: 4,
    game: 4,
    hackTalk: 3,
    secret: 2,
    default: 3
  },
  repeatCommandTracker: {
    lastCommandKey: '',
    count: 0
  },

  // DOM elements (cached)
  els: {},

  init() {
    this.els = {
      chatArea: document.getElementById('chat-area'),
      messagesContainer: document.getElementById('messages-container'),
      welcomeState: document.getElementById('welcome-state'),
      chatInput: document.getElementById('chat-input'),
      sendBtn: document.getElementById('send-btn'),
      typingIndicator: document.getElementById('typing-indicator'),
      commandChips: document.getElementById('command-chips'),
      characterFloating: document.getElementById('character-floating'),
    };

    // Input events
    this.els.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.els.chatInput.addEventListener('input', () => {
      this.autoResize();
      AnimationController.wakeUp();

      // Typing reaction (if not locked by other animations)
      if (this.els.chatInput.value.length > 0 && !AnimationController.isLocked()) {
        AnimationController.setState('typing', { duration: 2000 });
        if (typeof CharacterReactions !== 'undefined' && Math.random() < 0.05) { // 5% chance per keystroke to say this, so it's not spammy
          const typings = ["I see you typing... 👀", "Taking notes! 📝", "Go on... I'm listening 👂"];
          CharacterReactions.showSpeech(Utils.randomFrom(typings));
        }
      }
    });

    this.els.sendBtn.addEventListener('click', () => this.sendMessage());

    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.dataset.command;
        if (text) {
          this.els.chatInput.value = text;
          this.sendMessage();
        }
      });
    });

    // Command chips
    document.querySelectorAll('.command-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.dataset.command;
        if (text) {
          this.els.chatInput.value = text;
          this.sendMessage();
        }
      });
    });
  },

  autoResize() {
    const input = this.els.chatInput;
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  },

  detectCommandKey(inputRaw, lowerInput) {
    if (!lowerInput) return null;

    if (typeof SecretCommands !== 'undefined' && SecretCommands[lowerInput]) {
      return 'secret';
    }

    if (typeof CommandScorer !== 'undefined') {
      const ranked = CommandScorer.rankCommands(inputRaw, Commands);
      const best = ranked[0];
      if (best && best.score >= CommandScorer.threshold) {
        return best.key;
      }
    } else {
      for (const [key, cmd] of Object.entries(Commands || {})) {
        if (key === 'unknown') continue;
        if (cmd.keywords && Utils.matchKeywords(inputRaw, cmd.keywords)) {
          return key;
        }
      }
    }

    return null;
  },

  getRepeatTolerance(commandKey) {
    if (!commandKey) return this.repeatToleranceByCommand.default;
    return this.repeatToleranceByCommand[commandKey] || this.repeatToleranceByCommand.default;
  },

  isKnownCommandInput(lowerInput) {
    if (!lowerInput) return false;

    if (typeof SecretCommands !== 'undefined' && SecretCommands[lowerInput]) {
      return true;
    }

    if (typeof CommandScorer !== 'undefined') {
      const ranked = CommandScorer.rankCommands(lowerInput, Commands);
      const best = ranked[0];
      return !!(best && best.score >= CommandScorer.threshold);
    }

    for (const [key, cmd] of Object.entries(Commands || {})) {
      if (key === 'unknown') continue;
      if (cmd.keywords && Utils.matchKeywords(lowerInput, cmd.keywords)) {
        return true;
      }
    }

    return false;
  },

  updateRepeatCommandTracker(commandKey) {
    if (!commandKey) {
      this.repeatCommandTracker.lastCommandKey = '';
      this.repeatCommandTracker.count = 0;
      return 0;
    }

    if (this.repeatCommandTracker.lastCommandKey === commandKey) {
      this.repeatCommandTracker.count += 1;
    } else {
      this.repeatCommandTracker.lastCommandKey = commandKey;
      this.repeatCommandTracker.count = 1;
    }

    return this.repeatCommandTracker.count;
  },

  // Send message
  async sendMessage() {
    const text = this.els.chatInput.value.trim();
    if (!text || this.isProcessing) return;

    this.isProcessing = true;
    this.els.chatInput.value = '';
    this.els.chatInput.style.height = 'auto';
    this.els.sendBtn.classList.add('disabled');

    // Switch to chat mode
    this.enterChatMode();

    // Add user message
    this.addMessage(text, 'user');

    // Process and respond
    await this.processInput(text);

    this.isProcessing = false;
    this.els.sendBtn.classList.remove('disabled');
    this.els.chatInput.focus();
  },

  // Enter chat mode (hide welcome, show messages)
  enterChatMode() {
    if (this.els.welcomeState) {
      this.els.welcomeState.classList.add('hidden');
    }
    this.els.messagesContainer.classList.add('active');
    if (this.els.characterFloating) {
      this.els.characterFloating.classList.add('active');
    }
    if (this.els.commandChips) {
      this.els.commandChips.classList.add('visible');
    }
  },

  // Add message to DOM
  addMessage(text, type, html = false) {
    const msg = document.createElement('div');
    msg.className = `message message-${type}`;
    msg.id = `msg-${Utils.uid()}`;

    const avatarImg = type === 'bot' ? 'components/logo.png' : 'components/you.png';
    const senderName = type === 'bot' ? 'Rashed AI' : 'You';

    msg.innerHTML = `
      <div class="message-avatar">
        <img src="${avatarImg}" alt="${type}" class="avatar-img">
      </div>
      <div class="message-content">
        <div class="message-sender">${senderName}</div>
        <div class="message-bubble">${html ? text : Utils.sanitize(text)}</div>
      </div>
    `;

    this.els.messagesContainer.appendChild(msg);
    this.messages.push({ type, text, time: Date.now() });
    Utils.scrollToBottom(this.els.chatArea);

    // Add to sidebar history
    if (type === 'user') {
      Sidebar.addToRecent(text);
    }

    return msg;
  },

  // Add bot message with typewriter effect
  async addBotMessage(htmlContent, extraContent = '') {
    const msg = document.createElement('div');
    msg.className = 'message message-bot';
    msg.id = `msg-${Utils.uid()}`;

    msg.innerHTML = `
      <div class="message-avatar">
        <img src="components/logo.png" alt="bot" class="avatar-img">
      </div>
      <div class="message-content">
        <div class="message-sender">Rashed AI</div>
        <div class="message-bubble"><span class="typewriter-text"></span><span class="typing-cursor"></span></div>
      </div>
    `;

    this.els.messagesContainer.appendChild(msg);
    Utils.scrollToBottom(this.els.chatArea);

    // Typewriter effect
    const textEl = msg.querySelector('.typewriter-text');
    const cursorEl = msg.querySelector('.typing-cursor');

    await this.typewriterEffect(textEl, htmlContent);

    // Remove cursor
    if (cursorEl) cursorEl.remove();

    // Add extra content (cards, skill bars, etc.)
    if (extraContent) {
      const bubble = msg.querySelector('.message-bubble');
      const extraDiv = document.createElement('div');
      extraDiv.innerHTML = extraContent;
      extraDiv.style.animation = 'fadeIn 0.5s ease';
      bubble.appendChild(extraDiv);

      // Animate skill bars if present
      await Utils.delay(300);
      msg.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.level + '%';
      });
    }

    this.messages.push({ type: 'bot', text: htmlContent, time: Date.now() });
    Utils.scrollToBottom(this.els.chatArea);

    return msg;
  },

  // Typewriter effect (renders HTML properly)
  async typewriterEffect(element, html) {
    // Only switch to talking if animation is not locked (command expression still playing)
    if (!AnimationController.isLocked()) {
      AnimationController.setState('talking');
    }

    const plainText = html.replace(/<[^>]*>/g, '');
    const speed = Math.max(10, Math.min(30, 1500 / plainText.length));

    const chars = this.htmlToChunks(html);
    let switchedToTalking = false;

    for (const chunk of chars) {
      element.innerHTML += chunk;
      Utils.scrollToBottom(this.els.chatArea);
      if (!chunk.startsWith('<')) {
        await Utils.delay(speed);
      }
      // Once lock expires mid-typing, switch to talking
      if (!switchedToTalking && !AnimationController.isLocked()) {
        AnimationController.setState('talking');
        switchedToTalking = true;
      }
    }

    // Return to idle after talking
    await Utils.delay(200);
    AnimationController.setState('idle');
  },

  // Split HTML into typeable chunks
  htmlToChunks(html) {
    const chunks = [];
    let i = 0;
    while (i < html.length) {
      if (html[i] === '<') {
        let end = html.indexOf('>', i);
        if (end !== -1) {
          chunks.push(html.substring(i, end + 1));
          i = end + 1;
        } else {
          chunks.push(html[i]);
          i++;
        }
      } else if (html[i] === '\n') {
        chunks.push('<br>');
        i++;
      } else {
        chunks.push(html[i]);
        i++;
      }
    }
    return chunks;
  },

  // Show typing indicator
  showTyping() {
    if (this.els.typingIndicator) {
      // Move the typing indicator to the very bottom, after the latest user message
      this.els.messagesContainer.appendChild(this.els.typingIndicator);
      this.els.typingIndicator.classList.add('active');
      Utils.scrollToBottom(this.els.chatArea);
    }
  },

  hideTyping() {
    if (this.els.typingIndicator) {
      this.els.typingIndicator.classList.remove('active');
    }
  },

  // Process user input
  async processInput(input) {
    const lower = input.toLowerCase().trim();

    // Check secret commands first
    for (const [cmd, data] of Object.entries(SecretCommands)) {
      if (lower === cmd) {
        AnimationController.setState(data.animation, { force: true });
        AnimationController.lockState(3500);  // Let expression play for 3.5s
        if (data.speech && typeof CharacterReactions !== 'undefined') {
          CharacterReactions.showSpeech(data.speech);
        }
        this.showTyping();
        await Utils.delay(3000);  // Wait for full expression
        this.hideTyping();
        if (data.effect !== "none") {
          EasterEggs.triggerEffect(data.effect);
        }
        await this.addBotMessage(data.response);
        return;
      }
    }

    // Process Hidden Keywords (instant visual reactions)
    if (typeof HiddenKeywords !== 'undefined') {
      for (const [key, action] of Object.entries(HiddenKeywords)) {
        // Find standalone words (e.g., matching "wow" but not "wowzers", though includes is fine for simple bots.
        // Let's use simple includes, but maybe regex \b for word boundaries.
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(input)) {
           action(); // trigger visual reaction
           break; // only trigger first matched visual reaction to avoid conflict
        }
      }
    }

    // Check for game guess
    if (GameState.active) {
      const num = parseInt(lower);
      if (!isNaN(num) && num >= 1 && num <= 10) {
        const result = GameState.guess(num);
        AnimationController.setState(result.correct ? 'excited' : 'thinking');
        this.showTyping();
        await Utils.delay(800);
        this.hideTyping();
        await this.addBotMessage(result.msg);
        return;
      }
    }

    // Repeated same command protection (fun angry reaction)
    const repeatCommandKey = this.detectCommandKey(input, lower);
    const repeatCount = this.updateRepeatCommandTracker(repeatCommandKey);
    const repeatLimit = this.getRepeatTolerance(repeatCommandKey);
    if (repeatCommandKey && repeatCount > repeatLimit) {
      AnimationController.setState('angry');
      this.showTyping();
      await Utils.delay(850);
      this.hideTyping();
      await this.addBotMessage(`😤 Oi oi! Same command again and again?\n\nYou used <strong>"${Utils.sanitize(lower)}"</strong> <strong>${repeatCount}</strong> times! (limit: ${repeatLimit})\nTry something new — maybe <strong>skills</strong>, <strong>projects</strong>, or <strong>secret</strong> 😄`);
      AnimationController.setState('idle', { duration: 2500 });
      return;
    }

    // Check for spam
    if (Utils.spamDetector.check(input)) {
      AnimationController.setState('angry');
      this.showTyping();
      await Utils.delay(800);
      this.hideTyping();
      await this.addBotMessage(`😒 Hey, slow down! You're sending messages too fast.\nTake a breath and try again in a moment!`);
      return;
    }

    // Check angry input
    if (Utils.isAngryInput(input)) {
      AnimationController.setState('angry');
      this.showTyping();
      await Utils.delay(1000);
      this.hideTyping();
      await this.addBotMessage(`😠 Hey now, let's keep it friendly!\nI'm here to help. Try asking about my <strong>skills</strong> or <strong>projects</strong>! 😊`);
      AnimationController.setState('idle', { duration: 3000 });
      return;
    }

    // Check compliment
    if (Utils.isCompliment(input)) {
      AnimationController.setState('blushing');
      this.showTyping();
      await Utils.delay(1000);
      this.hideTyping();
      await this.addBotMessage(`😊 Aww, thank you so much! That really means a lot!\nRashed puts a lot of love into his work. ❤️\n\nWant to see his <strong>projects</strong>? Just type it!`);
      AnimationController.setState('idle', { duration: 3000 });
      return;
    }

    // Check thanks
    if (Utils.isThanks(input)) {
      AnimationController.setState('waving');
      this.showTyping();
      await Utils.delay(800);
      this.hideTyping();
      await this.addBotMessage(`🙏 You're welcome! Glad I could help!\nFeel free to ask anything else anytime! 😊`);
      return;
    }

    // Check funny/joke
    if (Utils.isFunnyInput(input)) {
      AnimationController.setState('laughing');
      this.showTyping();
      await Utils.delay(1200);
      this.hideTyping();
      const jokes = [
        `😂 Here's one:\n\n<em>Why do programmers prefer dark mode?\nBecause light attracts bugs!</em> 🪲💡`,
        `😂 Okay okay:\n\n<em>A SQL query walks into a bar, sees two tables and asks...\n"Can I JOIN you?"</em> 🍺`,
        `😂 Classic:\n\n<em>There are only 10 types of people in the world:\nThose who understand binary, and those who don't!</em> 🤓`
      ];
      await this.addBotMessage(Utils.randomFrom(jokes));
      AnimationController.setState('idle', { duration: 3000 });
      return;
    }

    // Check name input
    if (Utils.isNameInput(input)) {
      const name = input.replace(/^(my name is|i am|i'm)\s+/i, '').trim();
      if (name) {
        this.visitorName = name;
        localStorage.setItem('raxhu_visitor_name', name);
        AnimationController.setState('surprised');
        this.showTyping();
        await Utils.delay(1000);
        this.hideTyping();
        await this.addBotMessage(`😲 Oh wow, nice to meet you, <strong>${Utils.sanitize(name)}</strong>! 🎉\nWelcome to Rashed's portfolio! How can I help you today?`);
        AnimationController.setState('excited', { duration: 2000 });
        return;
      }
    }

    // Match normal commands using intent ranking (secrets/utility checks already handled above)
    if (typeof CommandScorer !== 'undefined') {
      const ranked = CommandScorer.rankCommands(input, Commands);
      const best = ranked[0];

      if (CommandScorer.shouldDebug() && ranked.length) {
        const top = ranked.slice(0, 3).map(r => `${r.key}:${r.score.toFixed(1)}(${r.matchedKeyword || '-'})`).join(' | ');
        console.log('%c[IntentRank]%c ' + top, 'color:#6C63FF;font-weight:700;', 'color:inherit;');
      }

      if (best && best.score >= CommandScorer.threshold) {
        await this.handleCommand(best.key, best.cmd, input);
        return;
      }
    } else {
      // Fallback if scorer script is unavailable
      for (const [key, cmd] of Object.entries(Commands)) {
        if (key === 'unknown') continue;
        if (cmd.keywords && Utils.matchKeywords(input, cmd.keywords)) {
          await this.handleCommand(key, cmd, input);
          return;
        }
      }
    }

    // Unknown command → Try OpenAI or fallback to predefined
    await this.handleUnknownInput(input);
  },

  // Handle a known command
  async handleCommand(key, cmd, userInput = '') {
    const anim = cmd.animation || 'talking';
    AnimationController.setState(anim, { force: true });
    AnimationController.lockState(3000);  // Let the expression animation play for 3s
    this.showTyping();
    await Utils.delay(2800);  // Wait while expression plays
    this.hideTyping();

    const resp = cmd.response;
    let mainText = resp.text;

    // Special case: greeting
    if (key === 'hello') {
      mainText = getGreeting(this.visitorName, userInput);
    }

    // Special case: game
    if (key === 'game') {
      GameState.start();
    }

    // Build extra content
    let extra = '';

    // Cards
    if (resp.cards) {
      extra += '<div class="response-cards">';
      resp.cards.forEach(card => {
        const tagsHtml = card.tags ? card.tags.map(t => `<span class="response-card-tag">${t}</span>`).join('') : '';
        const linkHtml = card.link ? `<a href="${card.link}" target="_blank" class="response-card-link">View Project <i data-lucide="arrow-right" style="width:12px;height:12px;display:inline"></i></a>` : '';
        extra += `
          <div class="response-card glass-card">
            <div class="response-card-icon">${card.icon}</div>
            <div class="response-card-title">${card.title}</div>
            <div class="response-card-desc">${card.desc}</div>
            ${tagsHtml ? `<div class="response-card-tags">${tagsHtml}</div>` : ''}
            ${linkHtml}
          </div>`;
      });
      extra += '</div>';
    }

    // Skill bars
    if (resp.skillBars) {
      extra += '<div class="skill-bar-container">';
      resp.skillBars.forEach(skill => {
        extra += `
          <div class="skill-bar-item">
            <div class="skill-bar-header">
              <span>${skill.name}</span>
              <span>${skill.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-bar-fill" data-level="${skill.level}"></div>
            </div>
          </div>`;
      });
      extra += '</div>';
    }

    // Contact info
    if (resp.contactInfo) {
      extra += '<div style="margin-top:var(--space-4)">';
      resp.contactInfo.forEach(c => {
        extra += `
          <a href="${c.link}" target="_blank" class="contact-item">
            <div class="contact-icon">${c.icon}</div>
            <div class="contact-info">
              <div class="contact-label">${c.label}</div>
              <div class="contact-value">${c.value}</div>
            </div>
          </a>`;
      });
      extra += '</div>';
    }

    // Achievements
    if (resp.achievements) {
      resp.achievements.forEach(a => {
        extra += `
          <div class="achievement-card">
            <div class="achievement-icon">${a.icon}</div>
            <div class="achievement-info">
              <div class="achievement-title">${a.title}</div>
              <div class="achievement-desc">${a.desc}</div>
            </div>
          </div>`;
      });
    }

    // Download button
    if (resp.showDownload) {
      extra += `<a class="download-btn" href="components/cv/index.html" target="_blank" rel="noopener noreferrer"><i data-lucide="download" style="width:16px;height:16px"></i> Open CV</a>`;
    }

    await this.addBotMessage(mainText, extra);

    // Re-init lucide icons for new elements
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Return to idle after some delay for non-idle states
    if (cmd.animation !== 'idle') {
      await Utils.delay(2000);
      if (AnimationController.getState() === cmd.animation) {
        AnimationController.setState('idle');
      }
    }
  },

  // Handle unknown input with OpenAI API fallback to predefined responses
  async handleUnknownInput(input) {
    AnimationController.setState('confused');
    this.showTyping();
    await Utils.delay(1000);
    this.hideTyping();

    try {
      // Try OpenAI API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input,
          conversationHistory: this.messages.slice(-6).map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        // Success: Show AI-generated response with talking animation
        AnimationController.setState('talking');
        await this.addBotMessage(data.reply);
      } else {
        // API returned error or no reply, use fallback
        throw new Error('API unavailable');
      }
    } catch (error) {
      // Fallback: Use predefined unknown responses when API fails
      console.warn('OpenAI API unavailable, using predefined fallback:', error.message);
      AnimationController.setState('confused');
      await this.addBotMessage(Utils.randomFrom(Commands.unknown.responses));
    }

    AnimationController.setState('idle', { duration: 2000 });
  }
};
