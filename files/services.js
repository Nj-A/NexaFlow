/**
 * services.js — Services page interactivity
 * Features:
 *  1. Filter buttons — DOM manipulation to show/hide cards
 *  2. localStorage: remembers last selected filter
 */

const FILTER_KEY = 'nf_service_filter';

const filterBtns = document.querySelectorAll('.filter-btn');
const serviceCards = document.querySelectorAll('.service-card[data-category]');

function applyFilter(filter) {
  filterBtns.forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });

  serviceCards.forEach((card, i) => {
    const match = filter === 'all' || card.dataset.category === filter;

    if (match) {
      card.removeAttribute('hidden');
      // Staggered reveal
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = `opacity 0.35s ease ${i * 0.04}s, transform 0.35s cubic-bezier(0.16,1,0.3,1) ${i * 0.04}s`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      });
    } else {
      card.setAttribute('hidden', '');
    }
  });

  // Persist selection
  localStorage.setItem(FILTER_KEY, filter);
}

// Restore last filter
const savedFilter = localStorage.getItem(FILTER_KEY) || 'all';
applyFilter(savedFilter);

// Bind filter buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    applyFilter(btn.dataset.filter);
  });
});
