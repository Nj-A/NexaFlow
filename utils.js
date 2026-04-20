/**
 * utils.js — Shared utilities
 * Handles: IntersectionObserver scroll reveals
 */

// ── Reveal on scroll (IntersectionObserver) ──────────────────
// Elements with .reveal-up are animated in global.css via CSS
// animation, but we re-trigger them when they enter the viewport
// for elements below the fold.

const scrollRevealElements = document.querySelectorAll(
  '.process-step, .work-card, .service-card, .pricing-card, .faq-item, .info-block'
);

if (scrollRevealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  scrollRevealElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s`;
    revealObserver.observe(el);
  });
}
