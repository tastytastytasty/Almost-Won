/**
 * ================================================================
 * ALMOST WON — Shared Utilities
 * js/shared.js
 * Loaded on every page. Relies on appState from state.js.
 * Handles: toast, modal, counter, sidebar, balance display,
 * settings, language switcher, shared events.
 * ================================================================
 */
'use strict';

const TOAST_DURATION = 3000;

/* ----------------------------------------------------------------
  UTILITY HELPERS
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
  div.appendChild(document.createTextNode(String(str)));
  return div.innerHTML;
}

/* ----------------------------------------------------------------
  TOAST NOTIFICATION
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

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `<i class="bx ${iconMap[type] || 'bx-info-circle'} toast-icon" aria-hidden="true"></i><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode === container) container.removeChild(toast);
  }, TOAST_DURATION + 400);
}

/* ----------------------------------------------------------------
  MODAL HELPERS
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
  ANIMATED COUNTER
   ---------------------------------------------------------------- */
function animateCounter(element, target, duration = 600, prefix = '$') {
  if (!element) return;
  if (!appState.settings.animations) {
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
    element.textContent = prefix + Math.round(start + diff * easeOut(progress)).toLocaleString('en-US');
    if (progress < 1) requestAnimationFrame(step);
    else element.textContent = prefix + target.toLocaleString('en-US');
  }
  requestAnimationFrame(step);
}

/* ----------------------------------------------------------------
  BALANCE DISPLAY (syncs header, wallet page, withdraw page)
   ---------------------------------------------------------------- */
function updateBalanceDisplay(animate = true) {
  const headerEl   = document.getElementById('headerBalance');
  const walletEl   = document.getElementById('walletBalance');
  const withdrawEl = document.getElementById('withdrawAvailable');
  const simEl      = document.getElementById('simBalance');
  const lsEl       = document.getElementById('lsBalance');
  const formatted  = formatCurrency(appState.balance);

  if (animate) {
    animateCounter(headerEl, appState.balance, 500);
    animateCounter(walletEl, appState.balance, 600);
    animateCounter(simEl,    appState.balance, 400);
  } else {
    if (headerEl) headerEl.textContent = formatted;
    if (walletEl) walletEl.textContent = formatted;
    if (simEl)    simEl.textContent    = formatted;
  }
  if (withdrawEl) withdrawEl.textContent = formatted;
  if (lsEl)       lsEl.textContent      = formatted;
}

/* ----------------------------------------------------------------
  SETTINGS APPLICATION
   ---------------------------------------------------------------- */
function applySettings() {
  const soundEl = document.getElementById('soundToggle');
  if (soundEl) {
    soundEl.checked = appState.settings.sound;
    soundEl.setAttribute('aria-checked', String(appState.settings.sound));
  }
  const animEl = document.getElementById('animationsToggle');
  if (animEl) {
    animEl.checked = appState.settings.animations;
    animEl.setAttribute('aria-checked', String(appState.settings.animations));
  }
  document.body.classList.toggle('no-animations', !appState.settings.animations);
}

/* ----------------------------------------------------------------
  CONFIRMATION MODAL
   ---------------------------------------------------------------- */
function showConfirmModal(title, body, callback) {
  const titleEl = document.getElementById('confirmModalTitle');
  const bodyEl  = document.getElementById('confirmModalBody');
  if (titleEl) titleEl.textContent = title;
  if (bodyEl)  bodyEl.textContent  = body;
  appState.confirmCallback = callback;
  openModal('confirmModal', '#confirmModalConfirm');
}

/* ----------------------------------------------------------------
  SIDEBAR TOGGLE
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
  LANGUAGE SWITCHER
   ---------------------------------------------------------------- */
function initLanguageSwitcher() {
  document.querySelectorAll('.lang-select').forEach(select => {
    select.value = currentLang;
    select.addEventListener('change', () => {
      setLanguage(select.value);
      applyTranslations();
      if (typeof renderTransactionList === 'function') renderTransactionList();
      if (typeof updateStatsDisplay    === 'function') updateStatsDisplay();
      if (typeof renderSpinHistory     === 'function') renderSpinHistory();
      showToast(tr('toastLangChanged'), 'info');
    });
  });
}

/* ----------------------------------------------------------------
  SHARED EVENT BINDINGS (present on every page)
   ---------------------------------------------------------------- */
function bindSharedEvents() {
  // Sidebar toggle
  const toggleBtn = document.getElementById('sidebarToggle');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);

  // Escape → close modals
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    ['gameModal', 'withdrawModal', 'confirmModal', 'sessionModal'].forEach(id => {
      const m = document.getElementById(id);
      if (m && !m.classList.contains('hidden')) closeModal(id);
    });
    closeMobileSidebar();
  });

  // Resize → clean up mobile sidebar
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      const s = document.getElementById('sidebar');
      if (s) s.classList.remove('mobile-open');
      toggleSidebarOverlay(false);
    }
  });

  // Confirm modal buttons
  const cancelBtn = document.getElementById('confirmModalCancel');
  if (cancelBtn) cancelBtn.addEventListener('click', () => {
    closeModal('confirmModal');
    appState.confirmCallback = null;
  });

  const confirmBtn = document.getElementById('confirmModalConfirm');
  if (confirmBtn) confirmBtn.addEventListener('click', () => {
    closeModal('confirmModal');
    if (typeof appState.confirmCallback === 'function') {
      appState.confirmCallback();
      appState.confirmCallback = null;
    }
  });

  const confirmModalEl = document.getElementById('confirmModal');
  if (confirmModalEl) {
    confirmModalEl.addEventListener('click', e => {
      if (e.target === confirmModalEl) {
        closeModal('confirmModal');
        appState.confirmCallback = null;
      }
    });
  }

  // Language switcher
  initLanguageSwitcher();
}

/* ----------------------------------------------------------------
  SHARED INIT — called by every page's initXxx() function
   ---------------------------------------------------------------- */
function sharedInit() {
  loadLanguage();
  loadPersistedState();
  applySettings();
  updateBalanceDisplay(false);
  const h = document.getElementById('headerBalance');
  if (h) h.dataset.rawValue = appState.balance;
  bindSharedEvents();
  applyTranslations();
  if (typeof AudioSystem !== 'undefined') AudioSystem.init();
}