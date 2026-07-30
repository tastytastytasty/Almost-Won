/**
 * ================================================================
 * ALMOST WON — Educational Gambling Simulator
 * script.js — Main Application Script
 * Version: 1.0.0-edu
 * ================================================================
 *
 * This file manages:
 *   - SPA navigation (show/hide sections)
 *   - localStorage persistence (wallet, settings, stats, transactions)
 *   - Toast notification system
 *   - Modal open/close
 *   - Wallet add/reset logic
 *   - Withdraw form validation
 *   - Settings toggles
 *   - Animated number counter
 *   - Responsive sidebar toggle
 *   - Mobile bottom tab bar sync
 */

'use strict';

/* ----------------------------------------------------------------
  1. CONSTANTS & CONFIGURATION
   ---------------------------------------------------------------- */

/** localStorage keys used by the app */
const STORAGE_KEYS = {
  BALANCE:      'almostwin_balance',
  TRANSACTIONS: 'almostwin_transactions',
  STATS:        'almostwin_stats',
  SETTINGS:     'almostwin_settings',
};

/** Default values for a fresh app state */
const DEFAULTS = {
  BALANCE: 10000,
  STATS: {
    totalWagered:  0,
    totalLost:     0,
    totalWon:      0,
    wins:          0,
    losses:        0,
    sessions:      0,
    biggestWin:    0,
    biggestLoss:   0,
  },
  SETTINGS: {
    sound:      false,
    animations: true,
  },
};

/** Game display names for modals */
const GAME_NAMES = {
  slots:    'Slot Machine',
  coinflip: 'Coin Flip',
  dice:     'Dice Roll',
};

/** Toast auto-dismiss duration in milliseconds */
const TOAST_DURATION = 3000;

/** Maximum transactions to store (performance) */
const MAX_TRANSACTIONS = 50;

/* ----------------------------------------------------------------
  2. APPLICATION STATE
   ---------------------------------------------------------------- */

/**
 * Central app state object.
 * All persistence goes through the save* helpers below.
 */
const state = {
  balance:      DEFAULTS.BALANCE,
  transactions: [],
  stats:        { ...DEFAULTS.STATS },
  settings:     { ...DEFAULTS.SETTINGS },
  currentSection: 'home',
  confirmCallback: null, // stores pending confirm action
};

/* ----------------------------------------------------------------
  3. UTILITY HELPERS
   ---------------------------------------------------------------- */

/**
 * Format a number as a US dollar currency string.
 * e.g. formatCurrency(10000) → "$10,000"
 * @param {number} amount
 * @returns {string}
 */
function formatCurrency(amount) {
  return '$' + Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/**
 * Format a Date object to a readable short string.
 * e.g. "Jan 5, 2025 14:32"
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  }) + ' ' + d.toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
  });
}

/**
 * Clamp a number between min and max (inclusive).
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/* ----------------------------------------------------------------
  4. LOCALSTORAGE — PERSISTENCE HELPERS
   ---------------------------------------------------------------- */

/** Load all persisted data from localStorage into state. */
function loadFromStorage() {
  try {
    const savedBalance = localStorage.getItem(STORAGE_KEYS.BALANCE);
    if (savedBalance !== null) {
      state.balance = parseFloat(savedBalance) || DEFAULTS.BALANCE;
    }

    const savedTxns = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (savedTxns !== null) {
      state.transactions = JSON.parse(savedTxns) || [];
    }

    const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);
    if (savedStats !== null) {
      state.stats = { ...DEFAULTS.STATS, ...JSON.parse(savedStats) };
    }

    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings !== null) {
      state.settings = { ...DEFAULTS.SETTINGS, ...JSON.parse(savedSettings) };
    }
  } catch (err) {
    console.warn('[AlmostWin] Failed to load from localStorage:', err);
  }
}

/** Persist the current balance to localStorage. */
function saveBalance() {
  try {
    localStorage.setItem(STORAGE_KEYS.BALANCE, state.balance.toString());
  } catch (err) {
    console.warn('[AlmostWin] Failed to save balance:', err);
  }
}

/** Persist the transaction list to localStorage. */
function saveTransactions() {
  try {
    // Keep only the most recent MAX_TRANSACTIONS
    const trimmed = state.transactions.slice(-MAX_TRANSACTIONS);
    state.transactions = trimmed;
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(trimmed));
  } catch (err) {
    console.warn('[AlmostWin] Failed to save transactions:', err);
  }
}

/** Persist statistics to localStorage. */
function saveStats() {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(state.stats));
  } catch (err) {
    console.warn('[AlmostWin] Failed to save stats:', err);
  }
}

/** Persist settings to localStorage. */
function saveSettings() {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(state.settings));
  } catch (err) {
    console.warn('[AlmostWin] Failed to save settings:', err);
  }
}

/** Clear ALL app data from localStorage and reset state. */
function clearAllData() {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  state.balance      = DEFAULTS.BALANCE;
  state.transactions = [];
  state.stats        = { ...DEFAULTS.STATS };
  state.settings     = { ...DEFAULTS.SETTINGS };
}

/* ----------------------------------------------------------------
  5. TOAST NOTIFICATION SYSTEM
   ---------------------------------------------------------------- */

/**
 * Display a toast notification that auto-dismisses.
 *
 * @param {string} message  - The message text to display.
 * @param {'success'|'error'|'warning'|'info'} [type='info']
 *                          - Visual style variant.
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  // Map type to icon emoji
  const icons = {
    success: '✅',
    error:   '❌',
    warning: '⚠️',
    info:    'ℹ️',
  };
  const icon = icons[type] || icons.info;

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <span class="toast-icon" aria-hidden="true">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto-remove after TOAST_DURATION + CSS animation (400ms fade-out)
  setTimeout(() => {
    if (toast.parentNode === container) {
      container.removeChild(toast);
    }
  }, TOAST_DURATION + 400);
}

/* ----------------------------------------------------------------
  6. MODAL COMPONENT
   ---------------------------------------------------------------- */

/**
 * Open a modal overlay by its ID, and optionally set
 * an initial focus element inside it.
 *
 * @param {string} modalId       - The id of the .modal-overlay element.
 * @param {string} [focusTarget] - Optional CSS selector for focus.
 */
function openModal(modalId, focusTarget) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // prevent background scroll

  // Set focus for accessibility
  requestAnimationFrame(() => {
    const target = focusTarget
      ? modal.querySelector(focusTarget)
      : modal.querySelector('.modal-close-btn, .btn');
    if (target) target.focus();
  });
}

/**
 * Close a modal overlay by its ID.
 * @param {string} modalId
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.add('hidden');
  document.body.style.overflow = ''; // restore scroll
}

/** Close any open modal when the overlay background is clicked. */
function handleOverlayClick(event) {
  // Only close if the click is directly on the overlay, not the box
  if (event.target === event.currentTarget) {
    closeModal(event.currentTarget.id);
  }
}

/* ----------------------------------------------------------------
  7. ANIMATED NUMBER COUNTER
   ---------------------------------------------------------------- */

/**
 * Animate a numeric display from its current displayed value
 * to a new target value over a set duration.
 *
 * @param {HTMLElement} element   - The DOM element to update.
 * @param {number}      target    - The target value to animate to.
 * @param {number}      [duration=600] - Animation duration in ms.
 * @param {string}      [prefix='$']  - Prefix string (e.g. '$').
 */
function animateCounter(element, target, duration = 600, prefix = '$') {
  if (!element) return;

  // If animations are disabled, jump immediately
  if (!state.settings.animations) {
    element.textContent = prefix + target.toLocaleString('en-US');
    return;
  }

  const start     = parseFloat(element.dataset.rawValue) || 0;
  const startTime = performance.now();
  const diff      = target - start;

  // Store raw value for next animation start
  element.dataset.rawValue = target;

  /**
   * Easing function: ease-out cubic
   * @param {number} t - Progress 0..1
   * @returns {number}
   */
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function step(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = clamp(elapsed / duration, 0, 1);
    const eased    = easeOut(progress);
    const current  = Math.round(start + diff * eased);

    element.textContent = prefix + current.toLocaleString('en-US');

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      // Ensure exact final value
      element.textContent = prefix + target.toLocaleString('en-US');
    }
  }

  requestAnimationFrame(step);
}

/* ----------------------------------------------------------------
  8. BALANCE & WALLET MANAGEMENT
   ---------------------------------------------------------------- */

/**
 * Update all balance display elements in the UI.
 * Animates the counter if animations are enabled.
 *
 * @param {boolean} [animate=true] - Whether to use the counter animation.
 */
function updateBalanceDisplay(animate = true) {
  const headerEl  = document.getElementById('headerBalance');
  const walletEl  = document.getElementById('walletBalance');
  const withdrawEl = document.getElementById('withdrawAvailable');

  const formatted = formatCurrency(state.balance);

  if (animate) {
    animateCounter(headerEl,  state.balance, 500);
    animateCounter(walletEl,  state.balance, 600);
  } else {
    if (headerEl)   headerEl.textContent   = formatted;
    if (walletEl)   walletEl.textContent   = formatted;
  }

  // Withdraw available — no animation, just update text
  if (withdrawEl) withdrawEl.textContent = formatted;
}

/**
 * Add a transaction record to state and re-render the list.
 *
 * @param {string} description  - Human-readable label.
 * @param {number} amount       - Positive for income, negative for expense.
 * @param {'income'|'expense'} type
 */
function addTransaction(description, amount, type) {
  const transaction = {
    id:          Date.now(),
    description: description,
    amount:      amount,
    type:        type,
    date:        new Date().toISOString(),
    balance:     state.balance, // snapshot after this transaction
  };

  state.transactions.push(transaction);
  saveTransactions();
  renderTransactionList();
}

/**
 * Render the transaction history list from state.
 * Newest transactions appear at the top.
 */
function renderTransactionList() {
  const list = document.getElementById('transactionList');
  if (!list) return;

  const emptyState = document.getElementById('emptyTransactions');

  if (state.transactions.length === 0) {
    // Show empty state
    list.innerHTML = '';
    if (emptyState) {
      const clone = emptyState.cloneNode(true);
      clone.id = '';
      clone.classList.remove('hidden');
      list.appendChild(clone);
    } else {
      list.innerHTML = `
        <div class="empty-state">
          <span aria-hidden="true">📋</span>
          <p>No transactions yet. Add funds or play a game to see history.</p>
        </div>`;
    }
    return;
  }

  // Build transaction items — newest first
  const items = [...state.transactions].reverse();
  const fragment = document.createDocumentFragment();

  items.forEach(txn => {
    const item = document.createElement('div');
    item.className = 'transaction-item';
    item.setAttribute('role', 'listitem');

    const isIncome = txn.type === 'income';
    const amountStr = (isIncome ? '+' : '-') + formatCurrency(Math.abs(txn.amount));

    item.innerHTML = `
      <div class="transaction-left">
        <div class="transaction-icon ${txn.type}" aria-hidden="true">
          ${isIncome ? '💵' : '💸'}
        </div>
        <div>
          <div class="transaction-desc">${escapeHtml(txn.description)}</div>
          <div class="transaction-date">${formatDate(txn.date)}</div>
        </div>
      </div>
      <div class="transaction-amount ${txn.type}">${amountStr}</div>
    `;

    fragment.appendChild(item);
  });

  list.innerHTML = '';
  list.appendChild(fragment);
}

/**
 * Escape HTML special characters to prevent XSS in user-provided data.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ----------------------------------------------------------------
  9. STATISTICS DISPLAY
   ---------------------------------------------------------------- */

/**
 * Update all statistics cards in the dashboard from state.stats.
 */
function updateStatsDisplay() {
  const stats = state.stats;

  // Calculate win rate percentage safely
  const totalGames = stats.wins + stats.losses;
  const winRate = totalGames > 0
    ? Math.round((stats.wins / totalGames) * 100)
    : 0;

  setStatText('statTotalWagered', formatCurrency(stats.totalWagered));
  setStatText('statTotalLost',    formatCurrency(stats.totalLost));
  setStatText('statWinRate',      winRate + '%');
  setStatText('statSessions',     stats.sessions.toLocaleString());
  setStatText('statBiggestWin',   formatCurrency(stats.biggestWin));
  setStatText('statBiggestLoss',  formatCurrency(stats.biggestLoss));
}

/**
 * Helper to safely update a stat element's text.
 * @param {string} id
 * @param {string} text
 */
function setStatText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ----------------------------------------------------------------
  10. SPA NAVIGATION
   ---------------------------------------------------------------- */

/**
 * Navigate to a named section, hiding all others.
 * Also updates the active state on both sidebar and bottom tab bar.
 *
 * @param {string} sectionName - Matches data-section attributes and id="section-{name}"
 */
function navigateTo(sectionName) {
  // Hide all sections
  const allSections = document.querySelectorAll('.page-section');
  allSections.forEach(section => section.classList.remove('active'));

  // Show target section
  const target = document.getElementById('section-' + sectionName);
  if (target) {
    target.classList.add('active');
  } else {
    console.warn('[AlmostWin] Section not found:', sectionName);
    return;
  }

  // Update sidebar nav active state
  const navBtns = document.querySelectorAll('.nav-btn');
  navBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionName);
  });

  // Update bottom tab bar active state
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.section === sectionName);
  });

  // Update state
  state.currentSection = sectionName;

  // If navigating to a data-heavy section, refresh its display
  if (sectionName === 'statistics') updateStatsDisplay();
  if (sectionName === 'wallet')     renderTransactionList();

  // Close mobile sidebar after navigation
  closeMobileSidebar();

  // Scroll to top of main content
  const mainContent = document.getElementById('mainContent');
  if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ----------------------------------------------------------------
  11. SIDEBAR TOGGLE (MOBILE & DESKTOP)
   ---------------------------------------------------------------- */

/**
 * Toggle the sidebar collapsed/expanded state.
 * On desktop: toggles the collapsed narrow mode.
 * On mobile: toggles the overlay slide-in mode.
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const main    = document.getElementById('mainContent');

  if (!sidebar) return;

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    // Mobile: slide sidebar in from left
    sidebar.classList.toggle('mobile-open');
    toggleSidebarOverlay(sidebar.classList.contains('mobile-open'));
  } else {
    // Desktop: collapse/expand sidebar width
    sidebar.classList.toggle('collapsed');
    if (main) main.classList.toggle('sidebar-collapsed');
  }
}

/**
 * Programmatically close mobile sidebar.
 */
function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('mobile-open')) {
    sidebar.classList.remove('mobile-open');
    toggleSidebarOverlay(false);
  }
}

/**
 * Show or hide the mobile sidebar backdrop overlay.
 * @param {boolean} show
 */
function toggleSidebarOverlay(show) {
  let overlay = document.querySelector('.sidebar-overlay');

  if (show) {
    // Create overlay if it doesn't exist
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
  12. SETTINGS MANAGEMENT
   ---------------------------------------------------------------- */

/**
 * Apply the current settings state to the UI:
 *   - Sync toggle checkboxes
 *   - Apply animations class to body
 */
function applySettings() {
  // Sound toggle
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.checked = state.settings.sound;
    soundToggle.setAttribute('aria-checked', state.settings.sound.toString());
  }

  // Animations toggle
  const animToggle = document.getElementById('animationsToggle');
  if (animToggle) {
    animToggle.checked = state.settings.animations;
    animToggle.setAttribute('aria-checked', state.settings.animations.toString());
  }

  // Apply/remove animations class on body
  if (state.settings.animations) {
    document.body.classList.remove('no-animations');
  } else {
    document.body.classList.add('no-animations');
  }
}

/* ----------------------------------------------------------------
  13. WITHDRAW FORM
   ---------------------------------------------------------------- */

/**
 * Validate the withdraw form and show the friction modal on success.
 * @param {Event} event - The form submit event.
 */
function handleWithdrawSubmit(event) {
  event.preventDefault();

  const input    = document.getElementById('withdrawAmount');
  const errorEl  = document.getElementById('withdrawError');

  if (!input || !errorEl) return;

  const raw    = input.value.trim();
  const amount = parseFloat(raw);

  // Clear previous error
  errorEl.textContent = '';
  errorEl.classList.add('hidden');
  input.setAttribute('aria-invalid', 'false');

  // Validation rules
  if (!raw || isNaN(amount)) {
    showFieldError(errorEl, input, 'Please enter a valid amount.');
    return;
  }

  if (amount <= 0) {
    showFieldError(errorEl, input, 'Withdrawal amount must be greater than $0.');
    return;
  }

  if (amount > state.balance) {
    showFieldError(
      errorEl,
      input,
      `Insufficient balance. You only have ${formatCurrency(state.balance)}.`
    );
    return;
  }

  // Valid — show the friction modal
  const amountEl = document.getElementById('withdrawModalAmount');
  if (amountEl) amountEl.textContent = formatCurrency(amount);

  openModal('withdrawModal', '#withdrawModalOkBtn');

  // Clear the input for next use
  input.value = '';
}

/**
 * Display a validation error on a form field.
 * @param {HTMLElement} errorEl
 * @param {HTMLElement} inputEl
 * @param {string}      message
 */
function showFieldError(errorEl, inputEl, message) {
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
  inputEl.setAttribute('aria-invalid', 'true');
  inputEl.focus();
}

/* ----------------------------------------------------------------
  14. CONFIRMATION MODAL
   ---------------------------------------------------------------- */

/**
 * Show the generic confirmation modal with a custom message.
 * The callback is called if the user confirms.
 *
 * @param {string}   title    - Modal heading text.
 * @param {string}   body     - Modal body message.
 * @param {Function} callback - Called when user clicks "Confirm".
 */
function showConfirmModal(title, body, callback) {
  const titleEl = document.getElementById('confirmModalTitle');
  const bodyEl  = document.getElementById('confirmModalBody');

  if (titleEl) titleEl.textContent = title;
  if (bodyEl)  bodyEl.textContent  = body;

  // Store callback in state
  state.confirmCallback = callback;

  openModal('confirmModal', '#confirmModalConfirm');
}

/* ----------------------------------------------------------------
  15. KEYBOARD ACCESSIBILITY (Escape key closes modals)
   ---------------------------------------------------------------- */

/**
 * Close any open modal when the Escape key is pressed.
 * @param {KeyboardEvent} event
 */
function handleEscapeKey(event) {
  if (event.key !== 'Escape') return;

  const modals = ['gameModal', 'withdrawModal', 'confirmModal'];
  modals.forEach(id => {
    const modal = document.getElementById(id);
    if (modal && !modal.classList.contains('hidden')) {
      closeModal(id);
    }
  });

  // Also close mobile sidebar
  closeMobileSidebar();
}

/* ----------------------------------------------------------------
  16. EVENT BINDING
   ---------------------------------------------------------------- */

/**
 * Attach all event listeners to the DOM.
 * Called once after DOMContentLoaded.
 */
function bindEvents() {

  /* --- Sidebar Toggle Button --- */
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }

  /* --- Sidebar Navigation Buttons --- */
  document.querySelectorAll('.nav-btn[data-section]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.section));
  });

  /* --- Bottom Tab Bar Buttons --- */
  document.querySelectorAll('.tab-btn[data-section]').forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.section));
  });

  /* --- Home CTA Button ("Start Simulating") --- */
  const ctaButton = document.getElementById('ctaButton');
  if (ctaButton) {
    ctaButton.addEventListener('click', () => navigateTo('simulation'));
  }

  /* --- Wallet: Add Funds Button --- */
  const addFundsBtn = document.getElementById('addFundsBtn');
  if (addFundsBtn) {
    addFundsBtn.addEventListener('click', () => {
      const amount = 1000;
      state.balance += amount;
      saveBalance();
      updateBalanceDisplay(true);
      addTransaction('Added virtual funds', amount, 'income');
      showToast('Added $1,000 to your wallet!', 'success');
    });
  }

  /* --- Wallet: Reset Wallet Button --- */
  const resetWalletBtn = document.getElementById('resetWalletBtn');
  if (resetWalletBtn) {
    resetWalletBtn.addEventListener('click', () => {
      showConfirmModal(
        'Reset Wallet?',
        'This will reset your balance to $10,000 and clear your transaction history. Are you sure?',
        () => {
          state.balance      = DEFAULTS.BALANCE;
          state.transactions = [];
          saveBalance();
          saveTransactions();
          updateBalanceDisplay(true);
          renderTransactionList();
          showToast('Wallet reset to $10,000.', 'info');
        }
      );
    });
  }

  /* --- Simulation: Play Buttons --- */
  document.querySelectorAll('.game-card .btn[data-game]').forEach(btn => {
    btn.addEventListener('click', () => {
      const gameKey  = btn.dataset.game;
      const gameName = GAME_NAMES[gameKey] || 'Unknown Game';

      const nameEl = document.getElementById('gameModalGameName');
      if (nameEl) nameEl.textContent = gameName;

      openModal('gameModal', '#gameModalOkBtn');
    });
  });

  /* --- Game Modal: Close Button & OK Button --- */
  const closeGameModal = document.getElementById('closeGameModal');
  if (closeGameModal) {
    closeGameModal.addEventListener('click', () => closeModal('gameModal'));
  }

  const gameModalOkBtn = document.getElementById('gameModalOkBtn');
  if (gameModalOkBtn) {
    gameModalOkBtn.addEventListener('click', () => closeModal('gameModal'));
  }

  const gameModalEl = document.getElementById('gameModal');
  if (gameModalEl) {
    gameModalEl.addEventListener('click', handleOverlayClick);
  }

  /* --- Withdraw Form --- */
  const withdrawForm = document.getElementById('withdrawForm');
  if (withdrawForm) {
    withdrawForm.addEventListener('submit', handleWithdrawSubmit);
  }

  /* --- Withdraw Modal: Close & OK Buttons --- */
  const closeWithdrawModal = document.getElementById('closeWithdrawModal');
  if (closeWithdrawModal) {
    closeWithdrawModal.addEventListener('click', () => closeModal('withdrawModal'));
  }

  const withdrawModalOkBtn = document.getElementById('withdrawModalOkBtn');
  if (withdrawModalOkBtn) {
    withdrawModalOkBtn.addEventListener('click', () => closeModal('withdrawModal'));
  }

  const withdrawModalEl = document.getElementById('withdrawModal');
  if (withdrawModalEl) {
    withdrawModalEl.addEventListener('click', handleOverlayClick);
  }

  /* --- Confirm Modal: Cancel & Confirm Buttons --- */
  const confirmModalCancel = document.getElementById('confirmModalCancel');
  if (confirmModalCancel) {
    confirmModalCancel.addEventListener('click', () => {
      closeModal('confirmModal');
      state.confirmCallback = null;
    });
  }

  const confirmModalConfirm = document.getElementById('confirmModalConfirm');
  if (confirmModalConfirm) {
    confirmModalConfirm.addEventListener('click', () => {
      closeModal('confirmModal');
      if (typeof state.confirmCallback === 'function') {
        state.confirmCallback();
        state.confirmCallback = null;
      }
    });
  }

  const confirmModalEl = document.getElementById('confirmModal');
  if (confirmModalEl) {
    // Confirm modal should not close on overlay click (safety UX)
    // but we add it for completeness — treat as cancel
    confirmModalEl.addEventListener('click', (e) => {
      if (e.target === confirmModalEl) {
        closeModal('confirmModal');
        state.confirmCallback = null;
      }
    });
  }

  /* --- Settings: Sound Toggle --- */
  const soundToggle = document.getElementById('soundToggle');
  if (soundToggle) {
    soundToggle.addEventListener('change', () => {
      state.settings.sound = soundToggle.checked;
      soundToggle.setAttribute('aria-checked', soundToggle.checked.toString());
      saveSettings();
      showToast(
        soundToggle.checked ? 'Sound effects enabled.' : 'Sound effects disabled.',
        'info'
      );
    });
  }

  /* --- Settings: Animations Toggle --- */
  const animToggle = document.getElementById('animationsToggle');
  if (animToggle) {
    animToggle.addEventListener('change', () => {
      state.settings.animations = animToggle.checked;
      animToggle.setAttribute('aria-checked', animToggle.checked.toString());
      saveSettings();
      applySettings();
      showToast(
        animToggle.checked ? 'Animations enabled.' : 'Animations disabled.',
        'info'
      );
    });
  }

  /* --- Settings: Reset All Data Button --- */
  const resetAllDataBtn = document.getElementById('resetAllDataBtn');
  if (resetAllDataBtn) {
    resetAllDataBtn.addEventListener('click', () => {
      showConfirmModal(
        'Reset All Data?',
        'This will permanently delete ALL data including your balance, transaction history, and statistics. This cannot be undone.',
        () => {
          clearAllData();
          updateBalanceDisplay(false);
          renderTransactionList();
          updateStatsDisplay();
          applySettings();
          showToast('All data has been reset.', 'warning');
        }
      );
    });
  }

  /* --- Keyboard: Escape closes modals --- */
  document.addEventListener('keydown', handleEscapeKey);

  /* --- Window resize: handle sidebar state changes --- */
  window.addEventListener('resize', handleWindowResize);
}

/**
 * Handle window resize events:
 * - If resizing from mobile to desktop, remove mobile-open class
 * - Ensure sidebar state is consistent
 */
function handleWindowResize() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  if (window.innerWidth > 768) {
    // Switching to desktop view — clean up mobile state
    sidebar.classList.remove('mobile-open');
    toggleSidebarOverlay(false);
  }
}

/* ----------------------------------------------------------------
  17. INITIALIZATION
   ---------------------------------------------------------------- */

/**
 * Main initialization function.
 * Called once when the DOM is ready.
 */
function init() {
  // 1. Load all persisted data from localStorage
  loadFromStorage();

  // 2. Apply settings to the DOM (animations, toggles)
  applySettings();

  // 3. Initialize balance displays (no animation on first load)
  updateBalanceDisplay(false);

  // 4. Set raw values for counter animation reference
  const headerEl = document.getElementById('headerBalance');
  const walletEl = document.getElementById('walletBalance');
  if (headerEl) headerEl.dataset.rawValue = state.balance;
  if (walletEl) walletEl.dataset.rawValue = state.balance;

  // 5. Render transaction history
  renderTransactionList();

  // 6. Update stats display
  updateStatsDisplay();

  // 7. Navigate to home section (default)
  navigateTo('home');

  // 8. Attach all event listeners
  bindEvents();

  console.log('[AlmostWin] Application initialized successfully. v1.0.0-edu');
}

/* ----------------------------------------------------------------
  18. ENTRY POINT
   ---------------------------------------------------------------- */

/**
 * Wait for the DOM to be fully loaded before initializing.
 * Using 'DOMContentLoaded' ensures all HTML is parsed and accessible.
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already ready (e.g., script deferred)
  init();
}
