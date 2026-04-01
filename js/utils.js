/* ============================================
   RaxhuAI — Utility Functions
   ============================================ */

const Utils = {
  // Detect first visit
  isFirstVisit() {
    if (!localStorage.getItem('raxhu_visited')) {
      localStorage.setItem('raxhu_visited', 'true');
      return true;
    }
    return false;
  },

  // Check if night time (7PM - 6AM)
  isNightTime() {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 6;
  },

  // Get random item from array
  randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  // Debounce
  debounce(fn, ms = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  },

  // Sanitize HTML to prevent XSS
  sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  // Generate unique ID
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Check if input contains any keyword from list
  matchKeywords(input, keywords) {
    const lower = input.toLowerCase().trim();
    return keywords.some(kw => lower.includes(kw.toLowerCase()));
  },

  // Exact match
  matchExact(input, commands) {
    const lower = input.toLowerCase().trim();
    return commands.find(cmd => lower === cmd.toLowerCase());
  },

  // Format time
  formatTime() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  },

  // Scroll element to bottom
  scrollToBottom(el) {
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  },

  // Detect spam (rapid repeated inputs)
  spamDetector: {
    history: [],
    check(input) {
      const now = Date.now();
      this.history.push({ text: input, time: now });
      // Keep last 10
      if (this.history.length > 10) this.history.shift();
      // Check if 5+ messages in 5 seconds
      const recent = this.history.filter(h => now - h.time < 5000);
      return recent.length >= 5;
    }
  },

  // Detect angry/rude input
  isAngryInput(input) {
    const angryWords = ['stupid', 'dumb', 'hate', 'worst', 'trash', 'garbage', 'sucks', 'idiot', 'useless'];
    return this.matchKeywords(input, angryWords);
  },

  // Detect joke/funny input
  isFunnyInput(input) {
    const funnyWords = ['joke', 'funny', 'lol', 'haha', 'lmao', 'rofl', 'comedy', 'meme', 'tell me a joke'];
    return this.matchKeywords(input, funnyWords);
  },

  // Detect compliment
  isCompliment(input) {
    const compliments = ['amazing', 'awesome', 'great', 'beautiful', 'fantastic', 'wonderful', 'excellent',
      'impressive', 'brilliant', 'talented', 'cool site', 'nice work', 'good job', 'well done', 'love your'];
    return this.matchKeywords(input, compliments);
  },

  // Detect thanks
  isThanks(input) {
    const thanks = ['thank', 'thanks', 'thx', 'appreciate', 'grateful', 'tnx', 'tysm'];
    return this.matchKeywords(input, thanks);
  },

  // Check if user typed a name
  isNameInput(input) {
    const lower = input.toLowerCase().trim();
    return lower.startsWith('my name is') || lower.startsWith('i am ') || lower.startsWith("i'm ");
  }
};
