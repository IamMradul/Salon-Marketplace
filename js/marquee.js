/* marquee.js - Double-row Testimonials Populator & Interactive marquee loop control */

export function initTestimonialMarquees() {
  const row1 = document.querySelector('.marquee-row-1');
  const row2 = document.querySelector('.marquee-row-2');

  if (!row1 || !row2) return;

  // Curated premium reviews reflecting Lucknow culture and locations
  const reviewsRow1 = [
    {
      stars: 5,
      quote: "The bridal styling was absolute perfection. They combined royal Nawabi elegance with modern lightness. I felt like a princess at my Hazratganj reception!",
      name: "Saba Khan",
      area: "Hazratganj"
    },
    {
      stars: 5,
      quote: "Exceptional 'Pehle Aap' hospitality. The pure saffron facial detox left my skin with a beautiful natural glow. Strongly recommend the At-Home service!",
      name: "Ananya Mishra",
      area: "Gomti Nagar"
    },
    {
      stars: 5,
      quote: "I've visited top salons in Delhi and Mumbai, but the Oud hair spa here is unmatched. It feels deeply therapeutic and smells like heaven.",
      name: "Rohan Kapoor",
      area: "Indira Nagar"
    },
    {
      stars: 5,
      quote: "Beautiful, majestic styling! The traditional Chikankari hairdo was the highlight of my wedding look. Meticulous and highly professional.",
      name: "Zainab Kidwai",
      area: "Chowk"
    }
  ];

  const reviewsRow2 = [
    {
      stars: 5,
      quote: "Superb product quality. The Royal Rose and Saffron face mist has become my daily essential. It smells like pure luxury in a bottle.",
      name: "Priyanka Verma",
      area: "Aliganj"
    },
    {
      stars: 5,
      quote: "Booked a date-night glow up at my home. The artist was punctual, extremely polite, and did a brilliant high-definition look. 10 stars!",
      name: "Mehak Rastogi",
      area: "Hazratganj"
    },
    {
      stars: 5,
      quote: "The golden glow facial is magical. True Nawabi beauty therapy. My face has never looked so clear and radiant. A pristine premium experience.",
      name: "Kiran Johar",
      area: "Mahanagar"
    },
    {
      stars: 5,
      quote: "Fantastic marketplace structure! Booking was effortless, and the service was world-class. Lucknow has finally got the beauty portal it deserves.",
      name: "Aditya Shah",
      area: "Gomti Nagar"
    }
  ];

  // Helper to construct card markup
  function createCardMarkup(review) {
    let starsHtml = '';
    for (let i = 0; i < review.stars; i++) {
      starsHtml += `<svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>`;
    }

    return `
      <div class="testimonial-card">
        <div class="test-stars">${starsHtml}</div>
        <p class="test-quote">"${review.quote}"</p>
        <div class="test-author-info">
          <span class="test-name">${review.name}</span>
          <span class="test-area">${review.area}</span>
        </div>
      </div>
    `;
  }

  // Double and render row contents to guarantee seamless continuous looping
  function populateRow(container, reviews) {
    const cardsMarkup = reviews.map(review => createCardMarkup(review)).join('');
    // Double it for smooth scroll wrapping
    container.innerHTML = cardsMarkup + cardsMarkup;
  }

  populateRow(row1, reviewsRow1);
  populateRow(row2, reviewsRow2);
}
