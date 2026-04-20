/**
 * contact.js — Contact page interactivity
 * Features:
 *  1. Dynamic real-time form validation (DOM manipulation + event listeners)
 *  2. LocalStorage draft saving (saves form values between visits)
 *  3. Character counter for textarea
 *  4. FAQ accordion (DOM manipulation + event listeners)
 *  5. Form submission simulation with loading state
 */

// ── FORM FIELDS ───────────────────────────────────────────────
const form        = document.getElementById('contactForm');
const successEl   = document.getElementById('formSuccess');
const sendAgainBtn = document.getElementById('sendAnother');
const draftNotice = document.getElementById('draftNotice');
const submitBtn   = document.getElementById('submitBtn');

const DRAFT_KEY   = 'nf_contact_draft';

// Validation rules
const rules = {
  firstName: {
    validate: v => v.trim().length >= 2,
    message: 'Please enter your first name (at least 2 characters).'
  },
  lastName: {
    validate: v => v.trim().length >= 2,
    message: 'Please enter your last name (at least 2 characters).'
  },
  email: {
    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: 'Please enter a valid email address.'
  },
  service: {
    validate: v => v !== '',
    message: 'Please select a service.'
  },
  message: {
    validate: v => v.trim().length >= 20,
    message: 'Please tell us a bit more (at least 20 characters).'
  },
  consent: {
    validate: (_, el) => el.checked,
    message: 'You must agree to the privacy policy to continue.'
  }
};

// ── VALIDATION HELPERS ────────────────────────────────────────
function getErrorEl(field) {
  return document.getElementById(`${field.id}-error`);
}

function setError(field, message) {
  field.classList.add('is-error');
  field.classList.remove('is-valid');
  field.setAttribute('aria-invalid', 'true');
  const errEl = getErrorEl(field);
  if (errEl) errEl.textContent = message;
}

function setValid(field) {
  field.classList.remove('is-error');
  field.classList.add('is-valid');
  field.setAttribute('aria-invalid', 'false');
  const errEl = getErrorEl(field);
  if (errEl) errEl.textContent = '';
}

function clearState(field) {
  field.classList.remove('is-error', 'is-valid');
  field.removeAttribute('aria-invalid');
  const errEl = getErrorEl(field);
  if (errEl) errEl.textContent = '';
}

function validateField(fieldId) {
  if (!form) return true;
  const rule = rules[fieldId];
  if (!rule) return true;

  const field = form.elements[fieldId];
  if (!field) return true;

  const value = field.value;
  const valid = rule.validate(value, field);

  if (!valid) {
    setError(field, rule.message);
    return false;
  } else {
    setValid(field);
    return true;
  }
}

function validateAll() {
  return Object.keys(rules).map(id => validateField(id)).every(Boolean);
}

// ── REAL-TIME VALIDATION ──────────────────────────────────────
if (form) {
  Object.keys(rules).forEach(fieldId => {
    const field = form.elements[fieldId];
    if (!field) return;

    const eventType = field.type === 'checkbox' ? 'change' : 'input';

    // Validate on blur (first time)
    field.addEventListener('blur', () => validateField(fieldId), { once: false });

    // Validate on input after first blur
    let hasBlurred = false;
    field.addEventListener('blur', () => { hasBlurred = true; });
    field.addEventListener(eventType, () => {
      if (hasBlurred) validateField(fieldId);
      saveDraft();
    });
  });
}

// ── CHARACTER COUNTER ─────────────────────────────────────────
const messageField = document.getElementById('message');
const charCount    = document.getElementById('message-count');

if (messageField && charCount) {
  messageField.addEventListener('input', () => {
    const len = messageField.value.length;
    const max = parseInt(messageField.getAttribute('maxlength'), 10) || 2000;
    charCount.textContent = `${len} / ${max}`;
    charCount.style.color = len > max * 0.9 ? '#e74c3c' : '';
  });
}

// ── LOCAL STORAGE: DRAFT SAVING ───────────────────────────────
const draftFields = ['firstName', 'lastName', 'email', 'company', 'service', 'budget', 'message'];

function saveDraft() {
  if (!form) return;
  const draft = {};
  draftFields.forEach(id => {
    const el = form.elements[id];
    if (el) draft[id] = el.value;
  });
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function loadDraft() {
  if (!form) return;
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return;

  try {
    const draft = JSON.parse(raw);
    let hasDraft = false;

    draftFields.forEach(id => {
      const el = form.elements[id];
      if (el && draft[id]) {
        el.value = draft[id];
        hasDraft = true;
      }
    });

    // Update char counter after loading
    if (messageField && charCount && draft.message) {
      charCount.textContent = `${draft.message.length} / 2000`;
    }

    // Show draft notice
    if (hasDraft && draftNotice) {
      draftNotice.hidden = false;
      setTimeout(() => { draftNotice.hidden = true; }, 4000);
    }
  } catch (e) {
    // Silently ignore malformed draft
    localStorage.removeItem(DRAFT_KEY);
  }
}

// Load draft on page load
if (form) loadDraft();

// ── FORM SUBMISSION ───────────────────────────────────────────
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate all fields
    const valid = validateAll();
    if (!valid) {
      // Focus first error
      const firstError = form.querySelector('.is-error');
      if (firstError) firstError.focus();
      return;
    }

    // Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate network request (replace with real fetch in production)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Clear draft from storage
    localStorage.removeItem(DRAFT_KEY);

    // Show success
    form.hidden = true;
    successEl.hidden = false;
    successEl.focus();

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
  });
}

// Send another message
if (sendAgainBtn) {
  sendAgainBtn.addEventListener('click', () => {
    form.hidden = false;
    successEl.hidden = true;
    form.reset();
    // Clear validation states
    form.querySelectorAll('input, select, textarea').forEach(el => clearState(el));
    if (charCount) charCount.textContent = '0 / 2000';
    const firstInput = form.querySelector('input');
    if (firstInput) firstInput.focus();
  });
}

// ── FAQ ACCORDION ─────────────────────────────────────────────
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn    = item.querySelector('.faq-item__q');
  const answer = item.querySelector('.faq-item__a');
  if (!btn || !answer) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    // Close all others (accordion behaviour)
    faqItems.forEach(other => {
      if (other === item) return;
      const otherBtn    = other.querySelector('.faq-item__q');
      const otherAnswer = other.querySelector('.faq-item__a');
      if (otherBtn && otherAnswer) {
        otherBtn.setAttribute('aria-expanded', 'false');
        otherAnswer.hidden = true;
      }
    });

    // Toggle current
    btn.setAttribute('aria-expanded', String(!isOpen));
    answer.hidden = isOpen;
  });
});
