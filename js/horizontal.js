/* horizontal.js - Services Horizontal Scroll Engine (GSAP ScrollTrigger) */

export function initHorizontalScroll() {
  const hSection = document.querySelector('.h-section');
  const hTrack = document.querySelector('.h-track');
  const panels = document.querySelectorAll('.h-panel');

  if (!hSection || !hTrack || panels.length === 0) return;

  // Set up horizontal translate scroll sync pinned to vertical page scroll (Universal for all screens)
  const horizontalTween = gsap.to(hTrack, {
    x: () => -(hTrack.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: hSection,
      start: "top top",
      end: () => "+=" + (hTrack.scrollWidth - window.innerWidth),
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true
    }
  });

  // Animate panels dynamically as they enter the screen horizontally
  panels.forEach((panel) => {
    const title = panel.querySelector('.panel-title');
    const price = panel.querySelector('.panel-price');
    const cta = panel.querySelector('.panel-cta');

    // Setup initial clip and fade offsets
    if (title) {
      // Wrap title text in spans for elegant clip up while preserving original styling tags
      const originalHTML = title.innerHTML.trim();
      if (!originalHTML.includes('inner-title')) {
        title.innerHTML = `<span class="word-wrap"><span class="inner-title" style="transform: translateY(110%); display: inline-block;">${originalHTML}</span></span>`;
      }
    }
    
    // Relative trigger bounds for panels inside container animation
    gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: "left 85%",
        containerAnimation: horizontalTween,
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
}
