/* horizontal.js - Services Horizontal Scroll Engine (GSAP ScrollTrigger) */

export function initHorizontalScroll() {
  const hSection = document.querySelector('.h-section');
  const hTrack = document.querySelector('.h-track');
  const panels = document.querySelectorAll('.h-panel');

  if (!hSection || !hTrack || panels.length === 0) return;

  const mm = gsap.matchMedia();

  // Desktop configuration (Width >= 768px)
  mm.add("(min-width: 768px)", () => {
    const trackWidth = hTrack.offsetWidth;
    
    // Set up horizontal translate scroll sync pinned to vertical page scroll
    gsap.to(hTrack, {
      x: () => -(hTrack.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: hSection,
        start: "top top",
        end: () => "+=" + (hTrack.scrollWidth - window.innerWidth),
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        // Refresh ScrollTrigger after all bindings complete
        onUpdate: (self) => {
          // Can hook into progress loops here if needed
        }
      }
    });

    // Animate panels dynamically as they enter the screen horizontally
    panels.forEach((panel) => {
      const title = panel.querySelector('.panel-title');
      const price = panel.querySelector('.panel-price');
      const cta = panel.querySelector('.panel-cta');

      // Setup initial clip and fade offsets
      if (title) {
        // Wrap title text in spans for elegant clip up
        const txt = title.textContent.trim();
        title.innerHTML = `<span class="word-wrap"><span class="inner-title" style="transform: translateY(110%); display: inline-block;">${txt}</span></span>`;
      }
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          containerAnimation: gsap.getById("h-track") || null, // Bound to horizontal motion if possible, or trigger contextually
          // Using trigger viewport bounds relative to track scroll
          start: "left 80%",
          // ScrollTrigger binds based on global trigger offset inside horizontal scrolling track
          // Since containerAnimation exists, we map it, or let ScrollTrigger auto-calculate
          start: () => `left center+=${panel.offsetLeft - window.innerWidth * 0.2}`,
          toggleActions: "play none none reverse"
        }
      });

      // Simple relative trigger bounds for panels inside container animation
      gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "left 75%",
          // Using containerAnimation maps the horizontal progress
          containerAnimation: gsap.globalTimeline.getChildren().find(t => t.vars.x !== undefined) || null,
          toggleActions: "play none none reverse"
        }
      })
      .to(panel.querySelector('.inner-title'), {
        y: '0%',
        duration: 0.8,
        ease: 'power3.out'
      })
      .to(price, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.4')
      .to(cta, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.3');
    });

    return () => {
      // Cleanups when leaving desktop state
    };
  });

  // Mobile fallback (Width < 768px) - Converts to standard vertical stack
  mm.add("(max-width: 767px)", () => {
    // Reset track position
    gsap.set(hTrack, { x: 0 });

    // Stagger reveal panels in vertical list layout on scroll
    panels.forEach((panel) => {
      const innerTitle = panel.querySelector('.panel-title');
      const price = panel.querySelector('.panel-price');
      const cta = panel.querySelector('.panel-cta');

      if (innerTitle) {
        const txt = innerTitle.textContent.trim();
        innerTitle.innerHTML = `<span class="word-wrap"><span class="inner-title" style="transform: translateY(110%); display: inline-block;">${txt}</span></span>`;
      }

      gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      })
      .to(panel.querySelector('.inner-title'), {
        y: '0%',
        duration: 0.8,
        ease: 'power3.out'
      })
      .to(price, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.4')
      .to(cta, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '-=0.3');
    });
  });
}
