/**
 * ================================================================
 * ALMOST WIN — Page-Specific Logic
 * js/script.js
 * Version: 1.0.0-edu
 *
 * Each page calls its own init function at the bottom.
 * Shared logic lives in shared.js. Translations in i18n.js.
 * Layout injection in layout.js.
 * ================================================================
 */

'use strict';

/* ================================================================
  PAGE: HOME (index.html)
  ================================================================ */
function initHome() {
  injectLayout('home');
  sharedInit();

  // CTA button → navigate to simulation page
  const ctaBtn = document.getElementById('ctaButton');
  if (ctaBtn) ctaBtn.addEventListener('click', () => {
    window.location.href = 'simulation.html';
  });
}

/* ================================================================
  PAGE: WALLET (wallet.html)
  ================================================================ */

/** Render the full transaction list from state */
function renderTransactionList() {
  const list = document.getElementById('transactionList');
  if (!list) return;

  if (state.transactions.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="bx bx-clipboard" aria-hidden="true"></i>
        <p data-i18n="emptyTx">${tr('emptyTx')}</p>
      </div>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  [...state.transactions].reverse().forEach(txn => {
    const isIncome  = txn.type === 'income';
    const amountStr = (isIncome ? '+' : '-') + formatCurrency(Math.abs(txn.amount));
    const item      = document.createElement('div');
    item.className  = 'transaction-item';
    item.setAttribute('role', 'listitem');
    item.innerHTML  = `
      <div class="transaction-left">
        <div class="transaction-icon ${txn.type}" aria-hidden="true">
          <i class="bx ${isIncome ? 'bx-plus-circle' : 'bx-minus-circle'}"></i>
        </div>
        <div>
          <div class="transaction-desc">${escapeHtml(txn.description)}</div>
          <div class="transaction-date">${formatDate(txn.date)}</div>
        </div>
      </div>
      <div class="transaction-amount ${txn.type}">${amountStr}</div>`;
    fragment.appendChild(item);
  });

  list.innerHTML = '';
  list.appendChild(fragment);
}

function initWallet() {
  injectLayout('wallet');
  sharedInit();
  renderTransactionList();

  // Add Funds
  const addBtn = document.getElementById('addFundsBtn');
  if (addBtn) addBtn.addEventListener('click', () => {
    state.balance += 1000;
    saveBalance();
    updateBalanceDisplay(true);
    state.transactions.push({
      id: Date.now(), description: tr('txAdded'),
      amount: 1000, type: 'income',
      date: new Date().toISOString(), balance: state.balance,
    });
    saveTransactions();
    renderTransactionList();
    showToast(tr('toastAdded'), 'success');
  });

  // Reset Wallet
  const resetBtn = document.getElementById('resetWalletBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    showConfirmModal(
      tr('confirmResetWalletTitle'),
      tr('confirmResetWalletBody'),
      () => {
        state.balance      = DEFAULTS.BALANCE;
        state.transactions = [];
        saveBalance();
        saveTransactions();
        updateBalanceDisplay(true);
        renderTransactionList();
        showToast(tr('toastWalletReset'), 'info');
      }
    );
  });
}

/* ================================================================
  PAGE: SIMULATION (simulation.html)
  ================================================================ */
function initSimulation() {
  injectLayout('simulation');
  sharedInit();

  // Game modal close buttons
  const closeBtn = document.getElementById('closeGameModal');
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal('gameModal'));

  const okBtn = document.getElementById('gameModalOkBtn');
  if (okBtn) okBtn.addEventListener('click', () => closeModal('gameModal'));

  const gameModalEl = document.getElementById('gameModal');
  if (gameModalEl) gameModalEl.addEventListener('click', handleOverlayClick);

  // Play buttons
  document.querySelectorAll('.btn[data-game]').forEach(btn => {
    btn.addEventListener('click', () => {
      const gameKeys = {
        slots:    tr('slotsTitle'),
        coinflip: tr('coinTitle'),
        dice:     tr('diceTitle'),
      };
      const gameName = gameKeys[btn.dataset.game] || btn.dataset.game;
      const nameEl   = document.getElementById('gameModalGameName');
      if (nameEl) nameEl.textContent = gameName;
      openModal('gameModal', '#gameModalOkBtn');
    });
  });
}

/* ================================================================
  PAGE: STATISTICS (statistics.html)
  ================================================================ */

/** Refresh all stat card values from state.stats */
function updateStatsDisplay() {
  const s        = state.stats;
  const total    = s.wins + s.losses;
  const winRate  = total > 0 ? Math.round((s.wins / total) * 100) : 0;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('statTotalWagered', formatCurrency(s.totalWagered));
  set('statTotalLost',    formatCurrency(s.totalLost));
  set('statWinRate',      winRate + '%');
  set('statSessions',     s.sessions.toLocaleString());
  set('statBiggestWin',   formatCurrency(s.biggestWin));
  set('statBiggestLoss',  formatCurrency(s.biggestLoss));
}

function initStatistics() {
  injectLayout('statistics');
  sharedInit();
  updateStatsDisplay();
}

/* ================================================================
  PAGE: LEARN (learn.html)
  ================================================================ */
function initLearn() {
  injectLayout('learn');
  sharedInit();
}

/* ================================================================
  PAGE: WITHDRAW (withdraw.html)
  ================================================================ */
function handleWithdrawSubmit(event) {
  event.preventDefault();
  const input   = document.getElementById('withdrawAmount');
  const errorEl = document.getElementById('withdrawError');
  if (!input || !errorEl) return;

  const raw    = input.value.trim();
  const amount = parseFloat(raw);

  errorEl.textContent = '';
  errorEl.classList.add('hidden');
  input.setAttribute('aria-invalid', 'false');

  if (!raw || isNaN(amount)) {
    showFieldError(errorEl, input, tr('errInvalidAmt'));
    return;
  }
  if (amount <= 0) {
    showFieldError(errorEl, input, tr('errNegativeAmt'));
    return;
  }
  if (amount > state.balance) {
    showFieldError(errorEl, input, `${tr('errInsufficientBal')} ${formatCurrency(state.balance)}.`);
    return;
  }

  const amountEl = document.getElementById('withdrawModalAmount');
  if (amountEl) amountEl.textContent = formatCurrency(amount);
  openModal('withdrawModal', '#withdrawModalOkBtn');
  input.value = '';
}

function showFieldError(errorEl, inputEl, message) {
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
  inputEl.setAttribute('aria-invalid', 'true');
  inputEl.focus();
}

function initWithdraw() {
  injectLayout('withdraw');
  sharedInit();

  const form = document.getElementById('withdrawForm');
  if (form) form.addEventListener('submit', handleWithdrawSubmit);

  const closeBtn = document.getElementById('closeWithdrawModal');
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal('withdrawModal'));

  const okBtn = document.getElementById('withdrawModalOkBtn');
  if (okBtn) okBtn.addEventListener('click', () => closeModal('withdrawModal'));

  const modalEl = document.getElementById('withdrawModal');
  if (modalEl) modalEl.addEventListener('click', handleOverlayClick);
}

/* ================================================================
  PAGE: SETTINGS (settings.html)
  ================================================================ */
function initSettings() {
  injectLayout('settings');
  sharedInit();

  // Sound toggle
  const soundEl = document.getElementById('soundToggle');
  if (soundEl) soundEl.addEventListener('change', () => {
    state.settings.sound = soundEl.checked;
    soundEl.setAttribute('aria-checked', String(soundEl.checked));
    saveSettings();
    showToast(tr(soundEl.checked ? 'toastSoundOn' : 'toastSoundOff'), 'info');
  });

  // Animations toggle
  const animEl = document.getElementById('animationsToggle');
  if (animEl) animEl.addEventListener('change', () => {
    state.settings.animations = animEl.checked;
    animEl.setAttribute('aria-checked', String(animEl.checked));
    saveSettings();
    applySettings();
    showToast(tr(animEl.checked ? 'toastAnimOn' : 'toastAnimOff'), 'info');
  });

  // Reset all data
  const resetBtn = document.getElementById('resetAllDataBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    showConfirmModal(
      tr('confirmResetDataTitle'),
      tr('confirmResetDataBody'),
      () => {
        clearAllData();
        applySettings();
        updateBalanceDisplay(false);
        showToast(tr('toastDataReset'), 'warning');
      }
    );
  });
}
