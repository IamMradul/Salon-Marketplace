/* cursor.js - Custom Luxury Dual Cursor Controller */

export function initCustomCursor() {
  // Disable custom cursor on touch devices for accessibility and performance
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  if (isTouchDevice) {
    return;
  }

  // Create cursor elements dynamically if not already in HTML
  let dot = document.querySelector('.cursor-dot');
  let ring = document.querySelector('.cursor-ring');

  if (!dot) {
    dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);
  }

  if (!ring) {
    ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(ring);
  }

  // Coordinates
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let dotPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let ringPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Lerp factor
  const ringLerp = 0.12;

  // Animation Loop (uses requestAnimationFrame for high performance 60fps)
  function updateCursor() {
    // Dot follows mouse directly
    dotPos.x = mouse.x;
    dotPos.y = mouse.y;
    dot.style.left = `${dotPos.x}px`;
    dot.style.top = `${dotPos.y}px`;

    // Ring follows mouse with lerp lag (feels luxurious and heavy)
    ringPos.x += (mouse.x - ringPos.x) * ringLerp;
    ringPos.y += (mouse.y - ringPos.y) * ringLerp;
    ring.style.left = `${ringPos.x}px`;
    ring.style.top = `${ringPos.y}px`;

    requestAnimationFrame(updateCursor);
  }
  
  requestAnimationFrame(updateCursor);

  // Mouse Down / Up States (shrinks and expands cursor)
  window.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-active');
  });

  window.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-active');
  });

  // Event delegation for various hover elements
  document.body.addEventListener('mouseover', (e) => {
    // 1. Standard Hover: Links and ordinary buttons
    const targetLink = e.target.closest('a, button, [role="button"], .interactive-element');
    
    // 2. Royal Hover: Specific royal elements like submit buttons and CTA pills
    const targetRoyal = e.target.closest('.nav-cta, .btn-form-submit, .logo, .svg-btn');
    
    // 3. Image Hover: Images under masks
    const targetImage = e.target.closest('.img-mask, .product-img-wrap, .panel-bg-wrap');
    
    // 4. Drag Hover: Horizontal scroll tracks
    const targetDrag = e.target.closest('.h-section, .testimonial-card');

    if (targetRoyal) {
      document.body.classList.add('cursor-royal-hovered');
    } else if (targetLink) {
      document.body.classList.add('cursor-hovered');
    } else if (targetImage) {
      document.body.classList.add('cursor-image-hovered');
    } else if (targetDrag && !isTouchDevice && window.innerWidth >= 768) {
      // Drag hover only applicable to active horizontal sections on desktop
      document.body.classList.add('cursor-drag-hovered');
    }
  });

  document.body.addEventListener('mouseout', (e) => {
    const targetLink = e.target.closest('a, button, [role="button"], .interactive-element');
    const targetRoyal = e.target.closest('.nav-cta, .btn-form-submit, .logo, .svg-btn');
    const targetImage = e.target.closest('.img-mask, .product-img-wrap, .panel-bg-wrap');
    const targetDrag = e.target.closest('.h-section, .testimonial-card');

    if (targetRoyal) {
      document.body.classList.remove('cursor-royal-hovered');
    } else if (targetLink) {
      document.body.classList.remove('cursor-hovered');
    } else if (targetImage) {
      document.body.classList.remove('cursor-image-hovered');
    } else if (targetDrag) {
      document.body.classList.remove('cursor-drag-hovered');
    }
  });
}
