/* ============================================
   RaxhuAI — Main App Initialization
   ============================================ */

const App = {
  async init() {
    // Initialize all modules
    AnimationController.init();
    ChatEngine.init();
    Sidebar.init();
    EasterEggs.init();
    CharacterReactions.init();

    // Restore dark mode preference
    if (localStorage.getItem('raxhu_dark_mode') === 'true') {
      document.body.classList.add('dark-mode');
      const sw = document.querySelector('.toggle-switch');
      if (sw) sw.classList.add('active');
    }

    // Auto dark mode at night
    if (Utils.isNightTime() && !localStorage.getItem('raxhu_dark_mode')) {
      document.body.classList.add('dark-mode');
      const sw = document.querySelector('.toggle-switch');
      if (sw) sw.classList.add('active');
    }

    // Restore visitor name
    const savedName = localStorage.getItem('raxhu_visitor_name');
    if (savedName) ChatEngine.visitorName = savedName;

    // Time-Based Initial Greeting
    const hour = new Date().getHours();
    let initialAnim = 'idle';
    let welcomeSpeech = '';

    if (hour >= 6 && hour < 12) {
      initialAnim = 'waving';
      welcomeSpeech = "Good morning! ☀️ Ready to explore?";
    } else if (hour >= 12 && hour < 17) {
      initialAnim = 'talking';
      welcomeSpeech = "Good afternoon! 🌤️ What's on your mind?";
    } else if (hour >= 17 && hour < 21) {
      initialAnim = 'excited';
      welcomeSpeech = "Good evening! 🌆 Let's check out my portfolio!";
    } else if (hour >= 21 && hour <= 23) {
      initialAnim = 'mysterious';
      welcomeSpeech = "Good night owl! 🌙 Burning the midnight oil?";
    } else { // 12AM - 6AM
      initialAnim = 'sleeping';
      welcomeSpeech = "It's late... 😴 Even I need sleep sometimes!";
    }

    if (Utils.isFirstVisit()) {
      AnimationController.setState(initialAnim, { 
        duration: 5000, 
        specialClass: initialAnim === 'sleeping' ? 'sleeping-mode' : null 
      });
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        if (typeof CharacterReactions !== 'undefined') {
          CharacterReactions.showSpeech(welcomeSpeech);
        }
      }, 500);
    } else {
      AnimationController.setState('idle');
    }

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Focus input on desktop
    if (window.innerWidth > 768) {
      document.getElementById('chat-input')?.focus();
    }

    console.log('%c🚀 RaxhuAI Portfolio loaded!', 'color: #6C63FF; font-size: 14px; font-weight: bold;');
    console.log('%c💡 Try secret commands: sudo hire rashed, hack, konami, power up', 'color: #FF6B9D; font-size: 11px;');
  }
};

// Launch
document.addEventListener('DOMContentLoaded', () => App.init());
