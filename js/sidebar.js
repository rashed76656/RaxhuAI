/* ============================================
   RaxhuAI — Sidebar Controller
   ============================================ */

const Sidebar = {
  isOpen: false,
  recentChats: [],

  init() {
    // Sidebar toggle (mobile)
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const overlay = document.getElementById('sidebar-overlay');

    if (menuBtn) menuBtn.addEventListener('click', () => this.toggle());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (toggleBtn) toggleBtn.addEventListener('click', () => this.collapseToggle());
    if (overlay) overlay.addEventListener('click', () => this.close());

    // Load collapsed state
    const isCollapsed = localStorage.getItem('raxhu_sidebar_collapsed') === 'true';
    if (isCollapsed && window.innerWidth > 768) {
      document.getElementById('sidebar')?.classList.add('collapsed');
    }

    // Sidebar items
    document.querySelectorAll('.sidebar-item[data-command]').forEach(item => {
      item.addEventListener('click', () => {
        const cmd = item.dataset.command;
        // Set input and send
        const input = document.getElementById('chat-input');
        if (input) {
          input.value = cmd;
          ChatEngine.sendMessage();
        }
        // Set active
        this.setActive(item);
        // Close on mobile
        if (window.innerWidth <= 768) this.close();
      });
    });

    // New chat button
    const newChatBtn = document.getElementById('new-chat-btn');
    if (newChatBtn) {
      newChatBtn.addEventListener('click', () => this.newChat());
    }

    // Dark mode toggle
    const darkToggle = document.getElementById('dark-mode-toggle');
    if (darkToggle) {
      darkToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const switchEl = darkToggle.querySelector('.toggle-switch');
        if (switchEl) switchEl.classList.toggle('active');
        localStorage.setItem('raxhu_dark_mode', document.body.classList.contains('dark-mode'));
      });
    }
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    this.isOpen = true;
  },

  close() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    this.isOpen = false;
  },

  collapseToggle() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    localStorage.setItem('raxhu_sidebar_collapsed', isCollapsed);
    
    // Dispatch window resize event to trigger layout adjustments (like character positioning)
    window.dispatchEvent(new Event('resize'));
  },

  setActive(item) {
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  },

  // Add to recent chats
  addToRecent(text) {
    const truncated = text.length > 30 ? text.substring(0, 30) + '...' : text;
    // Avoid duplicates
    if (this.recentChats.includes(truncated)) return;
    this.recentChats.unshift(truncated);
    if (this.recentChats.length > 5) this.recentChats.pop();
    this.renderRecent();
  },

  renderRecent() {
    const container = document.getElementById('recent-chats');
    if (!container) return;
    container.innerHTML = '';
    this.recentChats.forEach(text => {
      const item = document.createElement('div');
      item.className = 'sidebar-item';
      item.innerHTML = `
        <span class="sidebar-item-icon"><i data-lucide="message-circle" style="width:16px;height:16px"></i></span>
        <span class="sidebar-item-text">${Utils.sanitize(text)}</span>
      `;
      item.addEventListener('click', () => {
        const input = document.getElementById('chat-input');
        if (input) {
          input.value = text.replace('...', '');
          ChatEngine.sendMessage();
        }
      });
      container.appendChild(item);
    });
    // Re-init icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
  },

  // New chat — reset
  newChat() {
    const messagesContainer = document.getElementById('messages-container');
    const welcomeState = document.getElementById('welcome-state');
    const characterFloating = document.getElementById('character-floating');
    const commandChips = document.getElementById('command-chips');

    if (messagesContainer) {
      messagesContainer.innerHTML = '';
      messagesContainer.classList.remove('active');
    }
    if (welcomeState) welcomeState.classList.remove('hidden');
    if (characterFloating) characterFloating.classList.remove('active');
    if (commandChips) commandChips.classList.remove('visible');

    // Also re-add typing indicator
    if (messagesContainer) {
      const ti = document.createElement('div');
      ti.id = 'typing-indicator';
      ti.className = 'typing-indicator message message-bot';
      ti.innerHTML = `
        <div class="message-avatar">R</div>
        <div class="message-content">
          <div class="message-bubble">
            <div class="typing-dots">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
            <span class="typing-text">Rashed is thinking...</span>
          </div>
        </div>
      `;
      messagesContainer.appendChild(ti);
      ChatEngine.els.typingIndicator = ti;
    }

    AnimationController.setState('waving');
    ChatEngine.messages = [];
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));

    if (window.innerWidth <= 768) this.close();
  }
};
