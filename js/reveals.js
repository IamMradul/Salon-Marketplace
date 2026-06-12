/* reveals.js - Apple-style Word Lighting, Image Masks, Parallax, & 3D Shop Flips */

export function initScrollReveals() {
  // 1. APPLE-STYLE WORD OPACITY LIGHTING (Section 2)
  const introParagraph = document.querySelector('.intro-paragraph');
  if (introParagraph) {
    const text = introParagraph.textContent.trim();
    introParagraph.innerHTML = '';

    const words = text.split(/\s+/);
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'intro-word';

      // Styling traditional words like 'finest beauty artists', 'Lucknow', 'Nawabi' or 'Glam' in gold
      if (word.includes('finest') || word.includes('beauty') || word.includes('artists') || word.includes('Lucknow') || word.includes('Nawabi') || word.includes('Glam') || word.includes('look,')) {
        span.classList.add('royal-word');
      }

      span.textContent = word;
      introParagraph.appendChild(span);

      // Append standard space node between inline-block spans to prevent spacing collapse
      if (index < words.length - 1) {
        introParagraph.appendChild(document.createTextNode(' '));
      }
    });

    // Create unified ScrollTrigger timeline for Section 2
    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.intro-section',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });

    // 1. Draw double scalloped dome arches on scroll
    const outerArch = document.querySelector('.intro-arch-outer');
    const innerArch = document.querySelector('.intro-arch-inner');
    if (outerArch && innerArch) {
      const outerLen = outerArch.getTotalLength();
      const innerLen = innerArch.getTotalLength();

      gsap.set(outerArch, { strokeDasharray: outerLen, strokeDashoffset: outerLen });
      gsap.set(innerArch, { strokeDasharray: innerLen, strokeDashoffset: innerLen });

      introTl.to(outerArch, { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut' }, 0)
        .to(innerArch, { strokeDashoffset: 0, duration: 1.5, ease: 'power1.inOut' }, 0.3);
    }

    // 1.5. Fade in the Jali geometric screen pattern
    const jaliScreen = document.querySelector('.intro-jali-svg');
    if (jaliScreen) {
      introTl.to(jaliScreen, {
        opacity: 1,
        duration: 2.0,
        ease: 'power1.inOut'
      }, 0);
    }

    // 2. Rotate, scale, and brighten royal crest
    const crest = document.querySelector('.intro-royal-crest');
    if (crest) {
      introTl.to(crest, {
        rotation: 180,
        scale: 1.2,
        opacity: 0.7,
        duration: 2.0,
        ease: 'power1.out'
      }, 0);
    }

    // 3. Staggered word-rise animation with translation and blur focus transitions
    introTl.fromTo('.intro-word',
      { opacity: 0.15, y: 15, rotateX: 10, filter: 'blur(4px)' },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: 'blur(0px)',
        stagger: 0.1,
        duration: 2.5,
        ease: 'none'
      },
      0.4
    );
  }

  // 1.5. ROYAL MARKETPLACE PANELS 3D TILT (Section 3)
  const discoverSection = document.querySelector('#discover');
  if (discoverSection) {
    const discoverCards = discoverSection.querySelectorAll('.discover-card');

    // 3D Tilt Hover effect on desktop devices (coordinated with -6px lift and 1.04 image zoom)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice && window.innerWidth >= 768) {
      discoverCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const xc = rect.width / 2;
          const yc = rect.height / 2;

          const dx = x - xc;
          const dy = y - yc;

          // Calculate rotation angles (max 6 degrees)
          const rotX = -(dy / yc) * 6;
          const rotY = (dx / xc) * 6;

          gsap.to(card, {
            rotateX: rotX,
            rotateY: rotY,
            scale: 1.025,
            y: -6,          // Tasteful hover lift
            duration: 0.45,
            ease: 'power3.out',
            overwrite: 'auto'
          });

          // Background image counter-parallax shift and subtle zoom for depth
          const bgImg = card.querySelector('.card-bg-img');
          if (bgImg) {
            gsap.to(bgImg, {
              x: -(dx / xc) * 8,
              y: -(dy / yc) * 8,
              scale: 1.04,  // Zoom image slightly on hover
              duration: 0.45,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          }
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            y: 0,           // Reset lift
            duration: 0.75,
            ease: 'power3.out',
            overwrite: 'auto'
          });

          const bgImg = card.querySelector('.card-bg-img');
          if (bgImg) {
            gsap.to(bgImg, {
              x: 0,
              y: 0,
              scale: 1,     // Reset zoom
              duration: 0.75,
              ease: 'power3.out',
              overwrite: 'auto'
            });
          }
        });
      });
    }
  }

  // 2. FEATURED SALONS IMAGE & TEXT REVEALS (Section 4)
  const salonRows = document.querySelectorAll('.salon-row');
  salonRows.forEach((row) => {
    const imgMask = row.querySelector('.img-mask');
    const img = row.querySelector('.img-mask img');
    const tag = row.querySelector('.salon-tag');
    const name = row.querySelector('.salon-name');
    const meta = row.querySelector('.salon-meta');
    const desc = row.querySelector('.salon-desc');
    const btn = row.querySelector('.salon-btn-wrap');

    // Dynamically split salon name into word clip spans (retained for premium styling)
    if (name) {
      const txt = name.textContent.trim();
      name.innerHTML = '';
      const words = txt.split(/\s+/);
      words.forEach((word) => {
        const wrap = document.createElement('span');
        wrap.className = 'word-wrap';
        const inner = document.createElement('span');
        inner.textContent = word;
        wrap.appendChild(inner);
        name.appendChild(wrap);
        name.appendChild(document.createTextNode(' '));
      });
    }

    const revealTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: row,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    // Reveal image mask height (0 -> 100%) and counter-shift the image scale/translate
    if (imgMask && img) {
      revealTimeline.from(imgMask, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.4,
        ease: 'power4.inOut'
      })
        .from(img, {
          y: '15%',
          scale: 1.1,
          duration: 1.4,
          ease: 'power4.inOut'
        }, '<');
    }

    // Fade and translate text items
    if (tag) {
      revealTimeline.to(tag, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.8');
    }

    const nameSpans = name ? name.querySelectorAll('.word-wrap span') : [];
    if (nameSpans.length > 0) {
      revealTimeline.fromTo(nameSpans,
        { y: '110%' },
        {
          y: '0%',
          duration: 0.8,
          stagger: 0.05,
          ease: 'power3.out'
        },
        '-=0.7'
      );
    }

    if (meta) {
      revealTimeline.to(meta, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.6');
    }

    if (desc) {
      revealTimeline.to(desc, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
    }

    if (btn) {
      revealTimeline.to(btn, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
    }
  });

  // 3. BOOK AT HOME PARALLAX & TEXT REVEALS (Section 5)
  const homeBg = document.querySelector('.home-bg');
  if (homeBg) {
    // Parallax: Background shifts slowly compared to scroll velocity
    gsap.to(homeBg, {
      y: '22%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.home-feature-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // Splitting text for layout
    const homeTitle = document.querySelector('.home-title');
    if (homeTitle) {
      const text = homeTitle.textContent.trim();
      homeTitle.innerHTML = '';
      const words = text.split(/\s+/);
      words.forEach((word) => {
        const wrap = document.createElement('span');
        wrap.className = 'word-wrap';
        const inner = document.createElement('span');
        inner.textContent = word;

        if (word.includes('beauty') || word.includes('artist') || word.includes('Lucknow') || word.includes('Nawabi') || word.includes('Glam') || word.includes('anywhere')) {
          inner.style.color = 'var(--rose)';
          inner.style.fontFamily = 'var(--font-display)';
          inner.style.fontStyle = 'italic';
        }

        wrap.appendChild(inner);
        homeTitle.appendChild(wrap);
        homeTitle.appendChild(document.createTextNode(' '));
      });
    }

    const homeTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.home-feature-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    });

    const homeLabel = document.querySelector('.home-label');
    const homeBtnWrap = document.querySelector('.home-btn-wrap');

    if (homeLabel) {
      homeTl.to(homeLabel, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    }

    const homeTitleSpans = homeTitle ? homeTitle.querySelectorAll('.word-wrap span') : [];
    if (homeTitleSpans.length > 0) {
      homeTl.fromTo(homeTitleSpans,
        { y: '110%' },
        {
          y: '0%',
          duration: 1.0,
          stagger: 0.05,
          ease: 'power3.out'
        },
        '-=0.4'
      );
    }

    if (homeBtnWrap) {
      homeTl.to(homeBtnWrap, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.6');
    }
  }

  // 4. PRODUCTS SHOP 3D TITLE (Section 6)
  const shopTitle = document.querySelector('.shop-title');
  if (shopTitle) {
    const text = shopTitle.textContent.trim();
    shopTitle.innerHTML = '';

    // Split into characters for 3D flip-in rotation
    const chars = text.split('');
    chars.forEach((char) => {
      const wrap = document.createElement('span');
      wrap.className = 'char-3d-wrap';
      if (char === ' ') {
        wrap.innerHTML = '&nbsp;';
      } else {
        const span = document.createElement('span');
        span.className = 'char-3d';
        span.textContent = char;

        // Royal highlights
        if (char === 'b' || char === 'e' || char === 'a' || char === 'u' || char === 't' || char === 'y') {
          span.style.color = 'var(--gold)';
          span.style.fontStyle = 'italic';
        }

        wrap.appendChild(span);
      }
      shopTitle.appendChild(wrap);
    });

    // 3D Flip entrance timeline for header
    gsap.timeline({
      scrollTrigger: {
        trigger: '.shop-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })
      .from('.char-3d', {
        rotateX: 90,
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'power3.out'
      });
  }

  // Initialize Intersection Observer Reveals
  initIntersectionObserverReveals();
}

/* 
   5. INTERSECTION OBSERVER FOR PREMIUM SCROLL ENTRANCES
   Fades up every card, section heading, and image as it enters the viewport.
   Includes a 150ms stagger delay for cards or rows entering together.
*/
export function initIntersectionObserverReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    // Collect all intersecting elements to stagger them if they are in the same viewport batch
    const intersecting = entries.filter(e => e.isIntersecting);

    intersecting.forEach((entry, idx) => {
      const el = entry.target;

      // Determine if it is a card or list item that should be staggered
      let delay = 0;
      if (el.classList.contains('discover-card') ||
        el.classList.contains('product-card') ||
        el.classList.contains('salon-row')) {
        delay = idx * 150; // 150ms stagger delay
      }

      setTimeout(() => {
        el.classList.add('revealed');
      }, delay);

      observer.unobserve(el);
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}

