/**
 * nav.js — Navigation module
 * Handles: scroll-based header styling, mobile menu toggle,
 * scroll progress bar, footer year
 */

// ── Scroll progress bar ──────────────────────────────────────
const progressBar = document.createElement('div');
progressBar.id = 'scrollProgress';
progressBar.setAttribute('role', 'progressbar');
progressBar.setAttribute('aria-label', 'Page scroll progress');
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}, { passive: true });

// ── Sticky header ────────────────────────────────────────────
const header = document.getElementById('site-header');
if (header) {
  const observer = new IntersectionObserver(
    ([entry]) => header.classList.toggle('scrolled', !entry.isIntersecting),
    { rootMargin: '-80px 0px 0px 0px' }
  );
  // Observe a sentinel just below the header
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:80px;height:1px;width:1px;pointer-events:none;';
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}

// ── Mobile nav toggle ────────────────────────────────────────
const toggle = document.getElementById('navToggle');
const menu   = document.getElementById('navMenu');

if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('open', !isOpen);
    // Prevent body scroll when menu open
    document.body.style.overflow = isOpen ? '' : 'hidden';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('open');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });
}

// ── Footer year ──────────────────────────────────────────────
document.querySelectorAll('#footerYear').forEach(el => {
  el.textContent = new Date().getFullYear();
});
