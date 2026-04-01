/* ============================================
   RaxhuAI — Draggable Character
   Handles mouse and touch dragging for the anime character
   ============================================ */

const DraggableCharacter = {
  element: null,
  isDragging: false,
  startX: 0,
  startY: 0,
  initialX: 0,
  initialY: 0,

  init() {
    this.element = document.getElementById('character-floating');
    if (!this.element) return;

    this.loadPosition();
    this.setupEvents();
  },

  setupEvents() {
    // Mouse events
    this.element.addEventListener('mousedown', this.dragStart.bind(this));
    window.addEventListener('mousemove', this.drag.bind(this));
    window.addEventListener('mouseup', this.dragEnd.bind(this));

    // Touch events
    this.element.addEventListener('touchstart', this.dragStart.bind(this), { passive: false });
    window.addEventListener('touchmove', this.drag.bind(this), { passive: false });
    window.addEventListener('touchend', this.dragEnd.bind(this));
  },

  dragStart(e) {
    if (e.type === 'touchstart') {
      this.startX = e.touches[0].clientX;
      this.startY = e.touches[0].clientY;
    } else {
      this.startX = e.clientX;
      this.startY = e.clientY;
    }

    const rect = this.element.getBoundingClientRect();
    this.initialX = rect.left;
    this.initialY = rect.top;

    this.isDragging = true;
    this.element.classList.add('dragging');
    
    // Prevent default to avoid scrolling while dragging
    if (e.type === 'touchstart') {
      // Don't prevent default on touchstart if we want clicks to work, 
      // but we need it for smooth drag. Let's see how it feels.
    }
  },

  drag(e) {
    if (!this.isDragging) return;

    let clientX, clientY;
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling while dragging
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const dx = clientX - this.startX;
    const dy = clientY - this.startY;

    let newX = this.initialX + dx;
    let newY = this.initialY + dy;

    // Boundaries check
    const rect = this.element.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    // Apply styles to override current positioning
    this.element.style.left = newX + 'px';
    this.element.style.top = newY + 'px';
    this.element.style.bottom = 'auto';
    this.element.style.right = 'auto';
    this.element.style.transform = 'none';
  },

  dragEnd() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.element.classList.remove('dragging');
    this.savePosition();
  },

  savePosition() {
    const rect = this.element.getBoundingClientRect();
    const pos = {
      left: rect.left,
      top: rect.top,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
    localStorage.setItem('raxhu_character_pos', JSON.stringify(pos));
  },

  loadPosition() {
    const saved = localStorage.getItem('raxhu_character_pos');
    if (saved) {
      const pos = JSON.parse(saved);
      
      // Basic check if window size is drastically different (e.g. mobile/desktop switch)
      // If window changed too much, don't restore old pos to avoid character going out of view
      if (Math.abs(pos.windowWidth - window.innerWidth) < 100) {
        this.element.style.left = pos.left + 'px';
        this.element.style.top = pos.top + 'px';
        this.element.style.bottom = 'auto';
        this.element.style.right = 'auto';
        this.element.style.transform = 'none';
      }
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  DraggableCharacter.init();
});
