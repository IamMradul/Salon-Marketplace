/* main.js - Core Orchestration, Lenis Engine, Dynamic Listings, and Interactive Modals */

import { initCustomCursor } from './cursor.js';
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

  // Sync Lenis scroll velocity triggers with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

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

  // 7. Premium Routing Page Preloader Triggers & Immediate Script Initialization
  const isNavigating = sessionStorage.getItem('navigating') === 'true';
  const preloader = document.getElementById('preloader');
  const sweepOverlay = document.querySelector('.page-transition-overlay');
  const sweepOverlayGold = document.querySelector('.page-transition-overlay-gold');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    gsap.globalTimeline.timeScale(9999);
  }

  // Initialize all ScrollTriggers, horizontal tracks, and reveals immediately on DOM load.
  // This sets up pin-spacers and layout bounds on frame 1, completely preventing any layout shifts/jumps.
  const heroEntrance = animateHeroSection(); // Set up and return the paused hero entrance timeline
  initScrollReveals();
  initHorizontalScroll();
  initTestimonialMarquees();
  setTimeout(() => { ScrollTrigger.refresh(); }, 500);

  if (isNavigating) {
    // Bypass heavy preloader on internal subpage navigations for instant loading
    if (preloader) preloader.style.display = 'none';
    sessionStorage.removeItem('navigating');

    // Sweep transition panels out (using yPercent to completely bypass CSS conflicts)
    if (sweepOverlayGold && sweepOverlay) {
      gsap.set(sweepOverlayGold, { yPercent: -100 });
      gsap.set(sweepOverlay, { yPercent: -100 });

      gsap.timeline()
        .to(sweepOverlay, { yPercent: -200, duration: 0.55, ease: 'power3.out', delay: 0.05 })
        .to(sweepOverlayGold, { yPercent: -200, duration: 0.55, ease: 'power3.out' }, '-=0.45')
        .set([sweepOverlay, sweepOverlayGold], { yPercent: 0 }); // reset below fold
    }

    // Play hero entrance immediately on sweep-out
    if (heroEntrance) heroEntrance.play();
  } else {
    // First visit/hard reload: Play entrance immediately
    if (preloader) preloader.style.display = 'none';
    if (heroEntrance) heroEntrance.play();
  }

  // 8. Initialize Mobile Navigation Menu Drawer
  initMobileMenu();
});

/* Dynamically paint Featured Salons inside Section 4 */
function populateSalons() {
  const container = document.querySelector('.salon-grid');
  if (!container) return;

  container.innerHTML = salons.map((salon) => `
    <div class="salon-row reveal-on-scroll" id="${salon.id}">
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
    <div class="product-card reveal-on-scroll">
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

    if (sweepOverlay && sweepOverlayGold) {
      // Play sweep overlay sweep-in animation in parallel
      const sweepTl = gsap.timeline();
      sweepTl.to(sweepOverlayGold, { yPercent: -100, duration: 0.45, ease: 'power3.in' })
        .to(sweepOverlay, { yPercent: -100, duration: 0.45, ease: 'power3.in' }, '-=0.35')
        .to(sweepOverlay, { yPercent: -200, duration: 0.45, ease: 'power3.out', delay: 0.25 })
        .to(sweepOverlayGold, { yPercent: -200, duration: 0.45, ease: 'power3.out' }, '-=0.35')
        .set([sweepOverlay, sweepOverlayGold], { yPercent: 0 }); // reset positions
    }
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

  // Toast setup for Cart clicks (using CSS classes for responsiveness)
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  document.body.addEventListener('click', (e) => {
    const cartBtn = e.target.closest('.cart-trigger-btn');
    if (cartBtn) {
      const prodName = cartBtn.dataset.name || 'Premium product';

      const toast = document.createElement('div');
      toast.className = 'toast-item';
      toast.innerHTML = `
        <span style="color: var(--gold); font-weight: bold;">✦</span>
        <span>Royal Mist added: <strong>${prodName}</strong></span>
      `;
      toastContainer.appendChild(toast);

      // Slide in (using CSS transition but triggering browser layout refresh)
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

  // Intercept all local links for a premium route sweep transition
  document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link) {
      const href = link.getAttribute('href');

      // Only intercept local relative page links and clean URL paths
      const isLocalPage = href && (
        href === '/' ||
        href === './' ||
        href === 'index.html' ||
        href === 'services' ||
        href === '/services' ||
        href === 'services.html' ||
        href === 'salons' ||
        href === '/salons' ||
        href === 'salons.html' ||
        href === 'shop' ||
        href === '/shop' ||
        href === 'shop.html'
      );

      if (isLocalPage) {
        // Don't transition if clicking active link or normal anchor links on same page
        if (link.classList.contains('active') || href.startsWith('#')) return;

        e.preventDefault();

        // Set navigating state so new page skips heavy loading counter
        sessionStorage.setItem('navigating', 'true');

        if (sweepOverlay && sweepOverlayGold) {
          // Sweep panels up
          const transitionTl = gsap.timeline({
            onComplete: () => {
              window.location.href = href;
            }
          });

          gsap.set([sweepOverlay, sweepOverlayGold], { yPercent: 0 }); // ensure default below fold first
          transitionTl.to(sweepOverlayGold, { yPercent: -100, duration: 0.4, ease: 'power3.in' })
            .to(sweepOverlay, { yPercent: -100, duration: 0.4, ease: 'power3.in' }, '-=0.3');
        } else {
          // Direct navigation if overlays are missing
          window.location.href = href;
        }
      }
    }
  });
}

/* Dynamically inject mobile hamburger menu and drawer */
function initMobileMenu() {
  const header = document.querySelector('.header');
  if (!header) return;

  // 1. Create hamburger toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'mobile-nav-toggle';
  toggleBtn.setAttribute('aria-label', 'Toggle Navigation');
  toggleBtn.innerHTML = `
    <span class="hamburger-line line-top"></span>
    <span class="hamburger-line line-middle"></span>
    <span class="hamburger-line line-bottom"></span>
  `;
  header.appendChild(toggleBtn);

  // 2. Create mobile drawer overlay
  const drawer = document.createElement('div');
  drawer.className = 'mobile-nav-drawer';

  // Get active path matching
  const currentPath = window.location.pathname;
  const isHomeActive = currentPath.endsWith('/') || currentPath.endsWith('index.html') || currentPath === '';
  const isServicesActive = currentPath.includes('services');
  const isSalonsActive = currentPath.includes('salons');
  const isShopActive = currentPath.includes('shop');

  drawer.innerHTML = `
    <div class="mobile-drawer-content">
      <nav class="mobile-drawer-links">
        <a href="index.html" class="mobile-drawer-link ${isHomeActive ? 'active' : ''}">Home</a>
        <a href="services.html" class="mobile-drawer-link ${isServicesActive ? 'active' : ''}">Services</a>
        <a href="salons.html" class="mobile-drawer-link ${isSalonsActive ? 'active' : ''}">Salons</a>
        <a href="shop.html" class="mobile-drawer-link ${isShopActive ? 'active' : ''}">Shop</a>
      </nav>
      <div class="mobile-drawer-footer">
        <button class="nav-cta book-trigger-btn" data-target="General Appointment">Book Appointment</button>
        <span class="footer-hospitality">Pehle Aap Hospitality</span>
      </div>
    </div>
  `;
  document.body.appendChild(drawer);

  // 3. Toggle listener
  toggleBtn.addEventListener('click', () => {
    header.classList.toggle('mobile-menu-open');
    drawer.classList.toggle('active');

    const active = drawer.classList.contains('active');
    if (active) {
      document.body.style.overflow = 'hidden'; // prevent underlying body scroll

      // Animate hamburger to X
      gsap.to('.line-top', { y: 6.5, rotate: 45, duration: 0.3, ease: 'power2.out' });
      gsap.to('.line-middle', { scaleX: 0, opacity: 0, duration: 0.2 });
      gsap.to('.line-bottom', { y: -6.5, rotate: -45, duration: 0.3, ease: 'power2.out' });

      // Stagger animate links entrance
      gsap.fromTo('.mobile-drawer-link',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.35, ease: 'power2.out', delay: 0.15 }
      );
    } else {
      document.body.style.overflow = '';

      // Animate hamburger back
      gsap.to('.line-top', { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
      gsap.to('.line-middle', { scaleX: 1, opacity: 1, duration: 0.2 });
      gsap.to('.line-bottom', { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
    }
  });

  // Close drawer overlay when any link is clicked (e.g. for smooth scroll navigation)
  const links = drawer.querySelectorAll('.mobile-drawer-link, .book-trigger-btn');
  links.forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('mobile-menu-open');
      drawer.classList.remove('active');
      document.body.style.overflow = '';

      gsap.to('.line-top', { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
      gsap.to('.line-middle', { scaleX: 1, opacity: 1, duration: 0.2 });
      gsap.to('.line-bottom', { y: 0, rotate: 0, duration: 0.3, ease: 'power2.out' });
    });
  });
}
