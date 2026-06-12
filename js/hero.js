/* hero.js - Hero Section Skew-Reveal Word Animations & Intros */

export function animateHeroSection() {
  const heroContent = document.querySelector('.hero-content');
  if (!heroContent) return;

  // Let's dynamically wrap words of our main headlines in clip wraps to keep index.html clean!
  const headline = document.querySelector('.hero-headline');
  if (headline) {
    const lines = headline.querySelectorAll('.hero-word');
    lines.forEach((line) => {
      // Split line into words
      const words = line.textContent.trim().split(/\s+/);
      line.innerHTML = '';
      
      words.forEach((word) => {
        const wrapSpan = document.createElement('span');
        wrapSpan.className = 'word-wrap';
        
        const innerSpan = document.createElement('span');
        innerSpan.textContent = word;
        
        wrapSpan.appendChild(innerSpan);
        line.appendChild(wrapSpan);
        
        // Add a space after the word wrapper
        line.appendChild(document.createTextNode(' '));
      });
    });
  }

  // Create primary GSAP Timeline for Hero entrance (paused by default to prevent early playback before loader ends)
  const heroTimeline = gsap.timeline({ paused: true });

  // Reset opacity states first to prevent layout flashes
  gsap.set('.hero-word span', { opacity: 0, y: 30 });
  gsap.set('.hero-subtext', { opacity: 0, y: 20 });
  gsap.set('.hero-cta-row', { opacity: 0, y: 20 });
  gsap.set('.hero-marquee-bar', { opacity: 0 });

  // Play animations in sequence
  heroTimeline
    // 1. Text clip reveal with staggered fade-up (translateY 30px -> 0, opacity 0 -> 1)
    .to('.hero-word span', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.1
    })
    // 2. Subtext fade-in following with a delay
    .to('.hero-subtext', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '+=0.15')
    // 3. CTA pills fade-up following subtext
    .to('.hero-cta-row', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4')
    // 4. Subtle marquee fade-in at the bottom
    .to('.hero-marquee-bar', {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        // Trigger ScrollTrigger initialization for Hero Morph once entrance is done!
        initHeroMorph();
        initHeroParallax();
      }
    }, '-=0.4');

  return heroTimeline;
}

/* Scroll-driven Hero background shrink & salon interior morph (Awwwards staple) */
function initHeroMorph() {
  const morphTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '+=100%',
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const bgContainer = document.querySelector('.hero-bg-container');
        if (bgContainer) {
          // Add traditional gold arch classes when progress scrolls down
          if (self.progress > 0.1) {
            bgContainer.classList.add('scaled-arch');
          } else {
            bgContainer.classList.remove('scaled-arch');
          }
        }
      }
    }
  });

  // Morph animations
  morphTimeline
    .to('.hero-bg-container', {
      scale: 0.75,
      width: '75vw',
      height: '75vh',
      ease: 'none'
    })
    .to('.hero-bg', {
      opacity: 0,
      ease: 'none'
    }, '<')
    .to('.hero-bg-salon', {
      opacity: 0.75,
      ease: 'none'
    }, '<')
    .to('.hero-content', {
      opacity: 0,
      y: -100,
      ease: 'none'
    }, '<')
    .to('.hero-marquee-bar', {
      opacity: 0,
      y: 60,
      ease: 'none'
    }, '<');
}

/* Subtle parallax: background image moves at 40% scroll speed using a scroll event listener with transform: translateY */
export function initHeroParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroBg.style.transform = 'translateY(0)';
      return;
    }

    const scrolled = window.scrollY;
    // moves at 40% scroll speed
    heroBg.style.transform = `translateY(${scrolled * 0.4}px)`;
  });
}

