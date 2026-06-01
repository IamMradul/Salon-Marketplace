/* main.js - Core Orchestration, Lenis Engine, Dynamic Listings, and Interactive Modals */

import { initCustomCursor } from './cursor.js';
import { initLoader } from './loader.js';
import { animateHeroSection } from './hero.js';
import { initHorizontalScroll } from './horizontal.js';
import { initScrollReveals } from './reveals.js';
import { initTestimonialMarquees } from './marquee.js';
import { salons } from '../data/salons.js';
import { products } from '../data/products.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Custom Cursor (Disabled on touch screens)
  initCustomCursor();

  // 2. Populate Dynamic Salon Listings
  populateSalons();

  // 3. Populate Dynamic Product Listings
  populateProducts();

  // 4. Register ScrollTrigger & Initialize Lenis Scroll Engine
  gsap.registerPlugin(ScrollTrigger);
  
  const lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
    wheelMultiplier: 1.0,
    gestureOrientation: 'vertical'
  });

  // Connect Lenis smooth scrolling frame loop to the GSAP Ticker
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);

  // 5. Setup Navbar glassmorphism scroll transition
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 6. Bind Modal & Button Interactive Events
  bindInteractiveEvents(lenis);

  // 7. Page Preloader Triggers
  initLoader(() => {
    // This callback runs immediately after the preloader split slide-out finishes
    // A. Start hero typography entrances
    animateHeroSection();
    
    // B. Setup Apple Scroll Opacities, Venetian mask reveals and Parallax
    initScrollReveals();
    
    // C. Setup Horizontal Services Slider
    initHorizontalScroll();
    
    // D. Build reviews marquee content and initiate run loops
    initTestimonialMarquees();

    // E. Give ScrollTrigger a refresh after full layout paint
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
  });
});

/* Dynamically paint Featured Salons inside Section 4 */
function populateSalons() {
  const container = document.querySelector('.salon-grid');
  if (!container) return;

  container.innerHTML = salons.map((salon) => `
    <div class="salon-row" id="${salon.id}">
      <div class="salon-img-side">
        <div class="img-mask">
          <img data-src="${salon.image}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3C/svg%3E" class="lazy-image" alt="${salon.name}" loading="lazy">
        </div>
        <div class="salon-img-arch-overlay"></div>
      </div>
      <div class="salon-text-side">
        <span class="salon-tag">${salon.area}</span>
        <div class="salon-name-wrap">
          <h3 class="salon-name">${salon.name}</h3>
        </div>
        <div class="salon-meta">
          <span class="salon-rating">★ ${salon.rating} <span>(${salon.reviews} reviews)</span></span>
          <span class="salon-price-tag">From ${salon.price}</span>
        </div>
        <p class="salon-desc">${salon.desc}</p>
        <div class="salon-btn-wrap">
          <button class="btn-panel-book animated-underline-center book-trigger-btn" data-type="salon" data-target="${salon.name}">
            Book Salon →
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Setup simple lazy loading for images below the fold
  const lazyImages = document.querySelectorAll('.lazy-image');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy-image');
          observer.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => observer.observe(img));
  } else {
    lazyImages.forEach(img => img.src = img.dataset.src);
  }
}

/* Dynamically paint Products in Section 6 */
function populateProducts() {
  const container = document.querySelector('.products-grid');
  if (!container) return;

  container.innerHTML = products.map((prod) => `
    <div class="product-card">
      <span class="product-badge">${prod.badge}</span>
      <div class="product-img-wrap">
        <img src="${prod.image}" class="product-img" alt="${prod.name}" loading="lazy">
      </div>
      <div class="product-content">
        <h4 class="product-name">${prod.name}</h4>
        <p class="product-desc">${prod.desc}</p>
        <div class="product-footer">
          <div class="product-price">
            <span>${prod.originalPrice}</span>${prod.price}
          </div>
          <button class="btn-add-cart cart-trigger-btn" data-name="${prod.name}" aria-label="Add to cart">
            <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/* Modal management, sweeps, ripples, and booking actions */
function bindInteractiveEvents(lenis) {
  const modal = document.getElementById('booking-modal');
  const modalContainer = modal.querySelector('.modal-container');
  const closeModalBtn = modal.querySelector('.modal-close');
  const modalSelect = document.getElementById('modal-service-select');
  const modalForm = document.getElementById('booking-form');
  const successScreen = document.getElementById('booking-success-screen');
  const sweepOverlay = document.querySelector('.page-transition-overlay');
  const sweepOverlayGold = document.querySelector('.page-transition-overlay-gold');

  // Helper to open booking modal with elegant sweep
  function openModal(defaultSelection = '') {
    // 1. Play sweep overlay sweep-in animation
    const sweepTl = gsap.timeline({
      onComplete: () => {
        // Stop scroll
        lenis.stop();
        // Activate modal
        modal.classList.add('active');
        // Reset form views
        modalForm.style.display = 'flex';
        successScreen.style.display = 'none';
        
        // Auto-select option if provided
        if (defaultSelection && modalSelect) {
          modalSelect.value = defaultSelection;
        }

        // Animate modal container entrance
        gsap.to(modalContainer, { opacity: 1, scale: 1, duration: 0.4 });
      }
    });

    sweepTl.to(sweepOverlayGold, { y: '0%', duration: 0.45, ease: 'power3.in' })
           .to(sweepOverlay, { y: '0%', duration: 0.45, ease: 'power3.in' }, '-=0.35')
           .to(sweepOverlay, { y: '-100%', duration: 0.45, ease: 'power3.out', delay: 0.25 })
           .to(sweepOverlayGold, { y: '-100%', duration: 0.45, ease: 'power3.out' }, '-=0.35')
           .set([sweepOverlay, sweepOverlayGold], { y: '100%' }); // reset positions
  }

  // Close modal
  function closeModal() {
    gsap.to(modalContainer, {
      opacity: 0,
      scale: 0.95,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        modal.classList.remove('active');
        lenis.start(); // restore scroll
      }
    });
  }

  // Bind to any trigger button
  document.body.addEventListener('click', (e) => {
    const trigger = e.target.closest('.book-trigger-btn');
    if (trigger) {
      const targetSelection = trigger.dataset.target || '';
      openModal(targetSelection);
    }
  });

  // Close bindings
  closeModalBtn.addEventListener('click', closeModal);
  modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);

  // Form submit Mock interactive flow
  modalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fade out form and slide in success card
    gsap.to(modalForm, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      onComplete: () => {
        modalForm.style.display = 'none';
        modalForm.style.opacity = 1;
        modalForm.style.transform = 'translateY(0)';
        modalForm.reset();

        successScreen.style.display = 'flex';
        gsap.fromTo(successScreen,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );
      }
    });
  });

  // Ripple effect on click (buttons)
  document.body.addEventListener('mousedown', (e) => {
    const btn = e.target.closest('.ripple-btn, .btn-pill-rose, .nav-cta, .btn-form-submit, .svg-btn');
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.className = btn.classList.contains('nav-cta') || btn.classList.contains('btn-form-submit') ? 'ripple-gold' : 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      btn.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 700);

      // Micro-scale click reaction
      gsap.to(btn, { scale: 0.96, duration: 0.12 });
    }
  });

  document.body.addEventListener('mouseup', (e) => {
    const btn = e.target.closest('.ripple-btn, .btn-pill-rose, .nav-cta, .btn-form-submit, .svg-btn');
    if (btn) {
      gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power3.out' });
    }
  });

  // Toast setup for Cart clicks
  const toastContainer = document.createElement('div');
  toastContainer.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 100001;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    pointer-events: none;
  `;
  document.body.appendChild(toastContainer);

  document.body.addEventListener('click', (e) => {
    const cartBtn = e.target.closest('.cart-trigger-btn');
    if (cartBtn) {
      const prodName = cartBtn.dataset.name || 'Premium product';
      
      const toast = document.createElement('div');
      toast.style.cssText = `
        background-color: var(--surface);
        border: 1px solid var(--border-gold);
        border-radius: 4px;
        padding: 1rem 1.75rem;
        color: var(--cream);
        font-family: var(--font-body);
        font-size: 12px;
        letter-spacing: 0.05em;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateX(110%);
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      `;
      toast.innerHTML = `
        <span style="color: var(--gold); font-weight: bold;">✦</span>
        <span>Royal Mist added: <strong>${prodName}</strong></span>
      `;
      toastContainer.appendChild(toast);

      // Slide in
      setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
      }, 50);

      // Slide out and remove
      setTimeout(() => {
        toast.style.transform = 'translateX(110%)';
        toast.style.opacity = '0';
        setTimeout(() => {
          toast.remove();
        }, 500);
      }, 3500);
    }
  });
}
