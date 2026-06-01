/* loader.js - Premium Page Loader & Panel Slide Reveals */

export function initLoader(onCompleteCallback) {
  const isMobile = window.innerWidth < 768;
  const preloader = document.getElementById('preloader');
  const counterElement = document.querySelector('.loader-counter');
  const tagline = document.querySelector('.loader-tagline');
  const topPanel = document.getElementById('loader-top');
  const bottomPanel = document.getElementById('loader-bottom');

  if (!preloader) {
    if (onCompleteCallback) onCompleteCallback();
    return;
  }

  // Split brand name into letter spans dynamically for elegant clip reveal
  const brandTitle = document.querySelector('.loader-brand');
  if (brandTitle) {
    const text = brandTitle.textContent.trim();
    brandTitle.innerHTML = '';
    
    // Split into words, then letters to avoid losing spaces
    const words = text.split(' ');
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';
      
      const chars = word.split('');
      chars.forEach((char) => {
        const charWrap = document.createElement('span');
        charWrap.className = 'char-wrap';
        
        const charSpan = document.createElement('span');
        charSpan.className = 'char';
        charSpan.textContent = char;
        
        // Royal thematic italicizing for the word "SALON"
        if (wordIndex === 1) {
          charSpan.classList.add('royal-char');
        }
        
        charWrap.appendChild(charSpan);
        wordSpan.appendChild(charWrap);
      });
      
      brandTitle.appendChild(wordSpan);
      
      // Add space between words
      if (wordIndex < words.length - 1) {
        const space = document.createElement('span');
        space.innerHTML = '&nbsp;';
        brandTitle.appendChild(space);
      }
    });
  }

  const loaderTimeline = gsap.timeline({
    onComplete: () => {
      // Remove preloader from document flow entirely once finished
      preloader.style.display = 'none';
      if (onCompleteCallback) onCompleteCallback();
    }
  });

  // 1. Initial State Settings
  gsap.set('.loader-brand span.char', { y: '110%' });

  // 2. Animate counter 0 -> 100
  const counterObj = { value: 0 };
  
  if (isMobile) {
    // Simplified Mobile Animation
    loaderTimeline.to(counterObj, {
      value: 100,
      duration: 1.8,
      ease: "power2.out",
      onUpdate: () => {
        counterElement.textContent = Math.floor(counterObj.value) + "%";
      }
    })
    .to(preloader, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut"
    });
  } else {
    // High-fidelity cinematic Desktop Animation
    loaderTimeline
      // Phase A: Split letters reveal upwards
      .to('.loader-brand span.char', {
        y: '0%',
        duration: 1.0,
        stagger: 0.04,
        ease: 'power4.out',
        delay: 0.2
      })
      // Phase B: Tagline fade-in
      .to(tagline, {
        opacity: 0.85,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.5')
      // Phase C: Numeric counter counts up synchronously
      .to(counterObj, {
        value: 100,
        duration: 2.2,
        ease: 'power3.inOut',
        onUpdate: () => {
          counterElement.textContent = Math.floor(counterObj.value) + "%";
        }
      }, '-=1.2')
      // Phase D: Brand and counter slide out gracefully
      .to(['.loader-brand', '.loader-counter', tagline], {
        opacity: 0,
        y: -30,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.in'
      })
      // Phase E: Royal Panels split open (Top slides UP, Bottom slides DOWN)
      .to(topPanel, {
        y: '-100%',
        duration: 1.1,
        ease: 'power4.inOut'
      })
      .to(bottomPanel, {
        y: '100%',
        duration: 1.1,
        ease: 'power4.inOut'
      }, '<');
  }
}
