/**
 * ================================================================
 * ALMOST WIN — Shared Utilities
 * js/shared.js
 * Loaded on every page. Handles: storage, toast, modal,
 * counter animation, sidebar toggle, i18n init, shared events.
 * ================================================================
 */

'use strict';

/* ----------------------------------------------------------------
  1. STORAGE KEYS & DEFAULTS
   ---------------------------------------------------------------- */
const STORAGE_KEYS = {
  BALANCE:      'almostwin_balance',
  TRANSACTIONS: 'almostwin_transactions',
  STATS:        'almostwin_stats',
  SETTINGS:     'almostwin_settings',
};

const DEFAULTS = {
  BALANCE: 10000,
  STATS: {
    totalWagered: 0, totalLost: 0, totalWon: 0,
    wins: 0, losses: 0, sessions: 0,
    biggestWin: 0, biggestLoss: 0,
  },
  SETTINGS: { sound: false, animations: true },
};

const TOAST_DURATION = 3000;

/* ----------------------------------------------------------------
  2. SHARED APP STATE
   ---------------------------------------------------------------- */
const state = {
  balance:         DEFAULTS.BALANCE,
  transactions:    [],
  stats:           { ...DEFAULTS.STATS },
  settings:        { ...DEFAULTS.SETTINGS },
  confirmCallback: null,
};

/* ----------------------------------------------------------------
  3. STORAGE HELPERS
   ---------------------------------------------------------------- */
function loadFromStorage() {
  try {
    const b = localStorage.getItem(STORAGE_KEYS.BALANCE);
    if (b !== null) state.balance = parseFloat(b) || DEFAULTS.BALANCE;

    const tx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (tx !== null) state.transactions = JSON.parse(tx) || [];

    const st = localStorage.getItem(STORAGE_KEYS.STATS);
    if (st !== null) state.stats = { ...DEFAULTS.STATS, ...JSON.parse(st) };

    const se = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (se !== null) state.settings = { ...DEFAULTS.SETTINGS, ...JSON.parse(se) };
  } catch (e) { console.warn('[AlmostWin] Storage load error:', e); }
}

function saveBalance() {
  try { localStorage.setItem(STORAGE_KEYS.BALANCE, state.balance.toString()); }
  catch (e) { /* ignore */ }
}

function saveTransactions() {
  try {
    const trimmed = state.transactions.slice(-50);
    state.transactions = trimmed;
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(trimmed));
  } catch (e) { /* ignore */ }
}

function saveStats() {
  try { localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(state.stats)); }
  catch (e) { /* ignore */ }
}

function saveSettings() {
  try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings)); }
  catch (e) { /* ignore */ }
}

function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  state.balance      = DEFAULTS.BALANCE;
  state.transactions = [];
  state.stats        = { ...DEFAULTS.STATS };
  state.settings     = { ...DEFAULTS.SETTINGS };
}

/* ----------------------------------------------------------------
  4. UTILITY HELPERS
   ---------------------------------------------------------------- */
function formatCurrency(amount) {
  return '$' + Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ----------------------------------------------------------------
  5. TOAST NOTIFICATION
   ---------------------------------------------------------------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const iconMap = {
    success: 'bx-check-circle',
    error:   'bx-x-circle',
    warning: 'bx-error',
    info:    'bx-info-circle',
  };
  const iconClass = iconMap[type] || iconMap.info;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `<i class="bx ${iconClass} toast-icon" aria-hidden="true"></i><span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode === container) container.removeChild(toast);
  }, TOAST_DURATION + 400);
}

/* ----------------------------------------------------------------
  6. MODAL HELPERS
   ---------------------------------------------------------------- */
function openModal(modalId, focusSelector) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => {
    const target = focusSelector
      ? modal.querySelector(focusSelector)
      : modal.querySelector('.modal-close-btn, .btn');
    if (target) target.focus();
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function handleOverlayClick(event) {
  if (event.target === event.currentTarget) closeModal(event.currentTarget.id);
}

/* ----------------------------------------------------------------
  7. ANIMATED COUNTER
   ---------------------------------------------------------------- */
function animateCounter(element, target, duration = 600, prefix = '$') {
  if (!element) return;
  if (!state.settings.animations) {
    element.textContent = prefix + target.toLocaleString('en-US');
    return;
  }
  const start     = parseFloat(element.dataset.rawValue) || 0;
  const startTime = performance.now();
  const diff      = target - start;
  element.dataset.rawValue = target;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function step(now) {
    const progress = clamp((now - startTime) / duration, 0, 1);
    const current  = Math.round(start + diff * easeOut(progress));
    element.textContent = prefix + current.toLocaleString('en-US');
    if (progress < 1) requestAnimationFrame(step);
    else element.textContent = prefix + target.toLocaleString('en-US');
  }
  requestAnimationFrame(step);
}

/* ----------------------------------------------------------------
  8. BALANCE DISPLAY
   ---------------------------------------------------------------- */
function updateBalanceDisplay(animate = true) {
  const headerEl   = document.getElementById('headerBalance');
  const walletEl   = document.getElementById('walletBalance');
  const withdrawEl = document.getElementById('withdrawAvailable');
  const formatted  = formatCurrency(state.balance);

  if (animate) {
    animateCounter(headerEl, state.balance, 500);
    animateCounter(walletEl, state.balance, 600);
  } else {
    if (headerEl) headerEl.textContent = formatted;
    if (walletEl) walletEl.textContent = formatted;
  }
  if (withdrawEl) withdrawEl.textContent = formatted;
}

/* ----------------------------------------------------------------
  9. SETTINGS APPLICATION
   ---------------------------------------------------------------- */
function applySettings() {
  const soundEl = document.getElementById('soundToggle');
  if (soundEl) {
    soundEl.checked = state.settings.sound;
    soundEl.setAttribute('aria-checked', String(state.settings.sound));
  }
  const animEl = document.getElementById('animationsToggle');
  if (animEl) {
    animEl.checked = state.settings.animations;
    animEl.setAttribute('aria-checked', String(state.settings.animations));
  }
  document.body.classList.toggle('no-animations', !state.settings.animations);
}

/* ----------------------------------------------------------------
  10. SIDEBAR TOGGLE
   ---------------------------------------------------------------- */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main    = document.getElementById('mainContent');
  if (!sidebar) return;

  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('mobile-open');
    toggleSidebarOverlay(sidebar.classList.contains('mobile-open'));
  } else {
    sidebar.classList.toggle('collapsed');
    if (main) main.classList.toggle('sidebar-collapsed');
  }
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('mobile-open')) {
    sidebar.classList.remove('mobile-open');
    toggleSidebarOverlay(false);
  }
}

function toggleSidebarOverlay(show) {
  let overlay = document.querySelector('.sidebar-overlay');
  if (show) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'sidebar-overlay';
      overlay.addEventListener('click', closeMobileSidebar);
      document.body.appendChild(overlay);
    }
    overlay.classList.add('active');
  } else {
    if (overlay) overlay.classList.remove('active');
  }
}

/* ----------------------------------------------------------------
  11. LANGUAGE SWITCHER
   ---------------------------------------------------------------- */
function initLanguageSwitcher() {
  document.querySelectorAll('.lang-select').forEach(select => {
    select.value = currentLang;
    select.addEventListener('change', () => {
      setLanguage(select.value);
      applyTranslations();
      // Re-render dynamic content after language switch
      if (typeof renderTransactionList === 'function') renderTransactionList();
      if (typeof updateStatsDisplay    === 'function') updateStatsDisplay();
      showToast(tr('toastLangChanged'), 'info');
    });
  });
}

/* ----------------------------------------------------------------
  12. CONFIRMATION MODAL
   ---------------------------------------------------------------- */
function showConfirmModal(title, body, callback) {
  const titleEl = document.getElementById('confirmModalTitle');
  const bodyEl  = document.getElementById('confirmModalBody');
  if (titleEl) titleEl.textContent = title;
  if (bodyEl)  bodyEl.textContent  = body;
  state.confirmCallback = callback;
  openModal('confirmModal', '#confirmModalConfirm');
}

/* ----------------------------------------------------------------
  13. SHARED EVENT BINDINGS (present on every page)
   ---------------------------------------------------------------- */
function bindSharedEvents() {
  // Sidebar toggle button
  const toggleBtn = document.getElementById('sidebarToggle');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);

  // Escape key — close any open modal
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    ['gameModal', 'withdrawModal', 'confirmModal'].forEach(id => {
      const m = document.getElementById(id);
      if (m && !m.classList.contains('hidden')) closeModal(id);
    });
    closeMobileSidebar();
  });

  // Window resize — clean up mobile sidebar state
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      const s = document.getElementById('sidebar');
      if (s) s.classList.remove('mobile-open');
      toggleSidebarOverlay(false);
    }
  });

  // Confirm modal buttons
  const cancelBtn = document.getElementById('confirmModalCancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      closeModal('confirmModal');
      state.confirmCallback = null;
    });
  }
  const confirmBtn = document.getElementById('confirmModalConfirm');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      closeModal('confirmModal');
      if (typeof state.confirmCallback === 'function') {
        state.confirmCallback();
        state.confirmCallback = null;
      }
    });
  }
  const confirmModalEl = document.getElementById('confirmModal');
  if (confirmModalEl) {
    confirmModalEl.addEventListener('click', e => {
      if (e.target === confirmModalEl) {
        closeModal('confirmModal');
        state.confirmCallback = null;
      }
    });
  }

  // Language switcher
  initLanguageSwitcher();
}

/* ----------------------------------------------------------------
  14. SHARED INIT (called on every page before page-specific init)
   ---------------------------------------------------------------- */
function sharedInit() {
  loadLanguage();        // from i18n.js
  loadFromStorage();
  applySettings();
  updateBalanceDisplay(false);
  // Seed rawValue for counter
  const h = document.getElementById('headerBalance');
  if (h) h.dataset.rawValue = state.balance;
  bindSharedEvents();
  applyTranslations();   // from i18n.js
}
