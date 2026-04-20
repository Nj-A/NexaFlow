/**
 * home.js — Home page interactivity
 * Features:
 *  1. Animated counter for stat numbers (DOM manipulation + event listener)
 *  2. Testimonial carousel with localStorage persistence
 *  3. Local storage: saves last-viewed testimonial index
 */

// ── 1. ANIMATED COUNTERS ─────────────────────────────────────
const counters = document.querySelectorAll('.stat__num[data-target]');

if (counters.length > 0) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start  = performance.now();

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out expo
        const eased = 1 - Math.pow(2, -10 * progress);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };

      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

// ── 2. TESTIMONIAL CAROUSEL ───────────────────────────────────
const testimonials = [
  {
    quote: '"NexaFlow didn\'t just deliver a website — they delivered a strategic asset that directly contributed to a 40% increase in qualified leads within three months."',
    name:  'Sarah Chen',
    role:  'CMO, Aether Wellness'
  },
  {
    quote: '"The team\'s ability to translate a complex technical product into a clean, approachable design experience was remarkable. Our conversion rate doubled post-launch."',
    name:  'Marcus Reid',
    role:  'Co-founder, Forma SaaS'
  },
  {
    quote: '"Working with NexaFlow felt less like briefing an agency and more like gaining a genuinely invested creative partner. They challenged our thinking at every stage."',
    name:  'Priya Nair',
    role:  'Brand Director, Orbit Finance'
  }
];

const quoteEl  = document.getElementById('testimonialQuote');
const prevBtn  = document.getElementById('tPrev');
const nextBtn  = document.getElementById('tNext');

// LocalStorage: remember last viewed testimonial
const STORAGE_KEY = 'nf_testimonial_index';
let currentIndex = 0;

const saved = localStorage.getItem(STORAGE_KEY);
if (saved !== null) {
  const idx = parseInt(saved, 10);
  if (!isNaN(idx) && idx < testimonials.length) currentIndex = idx;
}

function renderTestimonial(index, direction = 1) {
  if (!quoteEl) return;
  const t = testimonials[index];

  // Fade out
  quoteEl.style.opacity = '0';
  quoteEl.style.transform = `translateX(${direction * 20}px)`;
  quoteEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

  setTimeout(() => {
    quoteEl.querySelector('p').textContent = t.quote;
    quoteEl.querySelector('strong').textContent = t.name;
    quoteEl.querySelector('.mono').textContent = `— ${t.role}`;
    quoteEl.style.transform = `translateX(${-direction * 20}px)`;

    // Fade in
    requestAnimationFrame(() => {
      quoteEl.style.opacity = '1';
      quoteEl.style.transform = 'translateX(0)';
    });

    // Persist to localStorage
    localStorage.setItem(STORAGE_KEY, String(index));
  }, 260);
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % testimonials.length;
    renderTestimonial(currentIndex, 1);
  });
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(currentIndex, -1);
  });
}

// Keyboard support for testimonial buttons
[prevBtn, nextBtn].forEach(btn => {
  btn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// Init: render saved index without animation
if (quoteEl && currentIndex !== 0) {
  const t = testimonials[currentIndex];
  quoteEl.querySelector('p').textContent = t.quote;
  quoteEl.querySelector('strong').textContent = t.name;
  quoteEl.querySelector('.mono').textContent = `— ${t.role}`;
}

// Auto-advance every 8 seconds
let autoTimer = setInterval(() => {
  currentIndex = (currentIndex + 1) % testimonials.length;
  renderTestimonial(currentIndex, 1);
}, 8000);

// Pause auto-advance on user interaction
[prevBtn, nextBtn].forEach(btn => {
  btn?.addEventListener('click', () => {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      renderTestimonial(currentIndex, 1);
    }, 8000);
  });
});
