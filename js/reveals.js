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
      
      // Styling traditional words like 'finest beauty artists' or 'Lucknow' in gold
      if (word.includes('finest') || word.includes('beauty') || word.includes('artists') || word.includes('Lucknow') || word.includes('look,')) {
        span.classList.add('royal-word');
      }
      
      span.textContent = word + ' ';
      introParagraph.appendChild(span);
    });

    // Animate words lighting up one by one tied to vertical scroll scrub
    gsap.fromTo('.intro-word', 
      { opacity: 0.15 },
      {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.intro-section',
          start: 'top 40%',
          end: 'bottom 80%',
          scrub: true
        }
      }
    );
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

    // Dynamically split salon name into word clip spans
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
    revealTimeline
      .to(tag, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.8')
      .from(name.querySelectorAll('.word-wrap span'), {
        y: '110%',
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out'
      }, '-=0.7')
      .to(meta, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.6')
      .to(desc, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .to(btn, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
  });

  // 3. BOOK AT HOME PARALLAX & TEXT SCRUB (Section 5)
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

    // Content reveals
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
        
        // Give 'beauty artist' or 'Lucknow' special rose italic royal accents
        if (word.includes('beauty') || word.includes('artist') || word.includes('Lucknow') || word.includes('anywhere')) {
          inner.style.color = 'var(--rose)';
          inner.style.fontFamily = 'var(--font-display)';
          inner.style.fontStyle = 'italic';
        }
        
        wrap.appendChild(inner);
        homeTitle.appendChild(wrap);
        homeTitle.appendChild(document.createTextNode(' '));
      });
    }

    gsap.timeline({
      scrollTrigger: {
        trigger: '.home-feature-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })
    .to('.home-label', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    .from('.home-title .word-wrap span', {
      y: '110%',
      duration: 1.0,
      stagger: 0.05,
      ease: 'power3.out'
    }, '-=0.4')
    .to('.home-btn-wrap', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.6');
  }

  // 4. PRODUCTS SHOP 3D FLIP-IN AND CARD STAGGERS (Section 6)
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

    // 3D Flip entrance timeline
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
    })
    .to('.shop-subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .to('.product-card', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.4');
  }

  // 5. TESTIMONIALS TITLE REVEAL (Section 7)
  const testTitle = document.querySelector('.testimonials-title');
  if (testTitle) {
    gsap.timeline({
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top 75%',
        toggleActions: 'play none none reverse'
      }
    })
    .from(testTitle, {
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out'
    });
  }
}
