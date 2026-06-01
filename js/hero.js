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

  // Create primary GSAP Timeline for Hero entrance
  const heroTimeline = gsap.timeline();

  // Reset opacity states first to prevent layout flashes
  gsap.set('.hero-subtext', { opacity: 0, y: 20 });
  gsap.set('.hero-cta-row', { opacity: 0, y: 20 });
  gsap.set('.hero-marquee-bar', { opacity: 0 });

  // Play animations in sequence
  heroTimeline
    // 1. Text clip reveal with elegant skew transformation
    .from('.hero-word span', {
      y: '110%',
      skewY: 4,
      duration: 1.2,
      stagger: 0.06,
      ease: 'power4.out',
      delay: 0.15
    })
    // 2. Subtext fade-in
    .to('.hero-subtext', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    // 3. CTA pills fade-up
    .to('.hero-cta-row', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.5')
    // 4. Subtle marquee fade-in at the bottom
    .to('.hero-marquee-bar', {
      opacity: 1,
      duration: 1.0,
      ease: 'power2.out'
    }, '-=0.8');
}
