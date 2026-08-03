/**
 * ================================================================
 * ALMOST WON — Page-Specific Logic
 * js/script.js  v2.0
 *
 * Pages: home, wallet, simulation, statistics, learn, withdraw, settings
 * Each page calls its own initXxx() function.
 * All game logic lives in engine.js, state in state.js,
 * education in education.js, charts in charts.js.
 * ================================================================
 */
'use strict';

/* ================================================================
  HOME PAGE
  ================================================================ */
function initHome() {
  injectLayout('home');
  sharedInit();

  const ctaBtn = document.getElementById('ctaButton');
  if (ctaBtn) ctaBtn.addEventListener('click', () => {
    window.location.href = 'simulation.html';
  });
}

/* ================================================================
  WALLET PAGE
  ================================================================ */
function renderTransactionList() {
  const list = document.getElementById('transactionList');
  if (!list) return;

  if (!appState.transactions || appState.transactions.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="bx bx-clipboard" aria-hidden="true"></i>
        <p>${tr('emptyTx')}</p>
      </div>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  [...appState.transactions].reverse().forEach(txn => {
    const isCredit  = txn.amount > 0;
    const absAmount = Math.abs(txn.amount);
    const amountStr = (isCredit ? '+' : '-') + formatCurrency(absAmount);
    const typeClass = isCredit ? 'income' : 'expense';
    const item      = document.createElement('div');
    item.className  = 'transaction-item';
    item.setAttribute('role', 'listitem');
    item.innerHTML  = `
      <div class="transaction-left">
        <div class="transaction-icon ${typeClass}" aria-hidden="true">
          <i class="bx ${isCredit ? 'bx-plus-circle' : 'bx-minus-circle'}"></i>
        </div>
        <div>
          <div class="transaction-desc">${escapeHtml(txn.description)}</div>
          <div class="transaction-date">${formatDate(txn.date)}</div>
        </div>
      </div>
      <div class="transaction-amount ${typeClass}">${amountStr}</div>`;
    fragment.appendChild(item);
  });

  list.innerHTML = '';
  list.appendChild(fragment);
}

function updateWalletStats() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const net = appState.netProfit;
  const netEl = document.getElementById('wNetProfit');
  if (netEl) {
    netEl.textContent = (net >= 0 ? '+' : '') + formatCurrency(Math.abs(net));
    netEl.className   = 'wallet-mini-val ' + (net >= 0 ? 'primary-text' : 'danger-text');
  }
  set('wTotalBet',   formatCurrency(appState.totalBet));
  set('wTotalTopUp', formatCurrency(appState.totalTopUp));
}

function doTopUp(amount) {
  if (!amount || amount <= 0) return;
  appState.balance    += amount;
  appState.totalTopUp += amount;
  recordTransaction('topup', `Top-up ${formatCurrency(amount)}`, amount, true);
  persistSession();
  updateBalanceDisplay(true);
  updateWalletStats();
  renderTransactionList();
  showToast(tr('toastTopUp').replace('{amount}', formatCurrency(amount)), 'success');
}

function initWallet() {
  injectLayout('wallet');
  sharedInit();
  renderTransactionList();
  updateWalletStats();

  // Preset top-up buttons
  document.querySelectorAll('.topup-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.topup-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const input = document.getElementById('customTopUpInput');
      if (input) input.value = btn.dataset.amount;
      doTopUp(parseInt(btn.dataset.amount, 10));
    });
  });

  // Custom amount top-up
  const customBtn = document.getElementById('customTopUpBtn');
  if (customBtn) customBtn.addEventListener('click', () => {
    const input  = document.getElementById('customTopUpInput');
    const amount = parseInt(input?.value || '0', 10);
    if (!amount || amount < 1) { showToast(tr('errInvalidAmt'), 'error'); return; }
    doTopUp(amount);
    if (input) input.value = '';
  });

  // Reset Wallet
  const resetBtn = document.getElementById('resetWalletBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    showConfirmModal(
      tr('confirmResetWalletTitle'),
      tr('confirmResetWalletBody'),
      () => {
        appState.balance      = 10000;
        appState.totalTopUp   = 0;
        appState.transactions = [];
        persistSession();
        persistTransactions();
        updateBalanceDisplay(true);
        updateWalletStats();
        renderTransactionList();
        showToast(tr('toastWalletReset'), 'info');
      }
    );
  });

  // Reset Session
  const resetSessBtn = document.getElementById('resetSessionBtn');
  if (resetSessBtn) resetSessBtn.addEventListener('click', () => {
    showConfirmModal(
      tr('resetSessionConfirmTitle'),
      tr('resetSessionConfirmBody'),
      () => {
        resetSessionOnly();
        updateBalanceDisplay(false);
        updateWalletStats();
        renderTransactionList();
        showToast(tr('toastSessionReset'), 'info');
      }
    );
  });
}

/* ================================================================
  SIMULATION PAGE — SLOT MACHINE
  ================================================================ */

/** Current bet amount (local to sim page) */
let currentBet = 250;
let sessionTimerInterval = null;

/* -- Bet Management -- */
function setCurrentBet(amount) {
  currentBet = clamp(amount, 1, appState.balance || 1);
  const betInput = document.getElementById('betInput');
  if (betInput) betInput.value = currentBet;
  validateBet();
}

function validateBet() {
  const spinBtn  = document.getElementById('spinBtn');
  const warning  = document.getElementById('betWarning');
  const hasBalance = appState.balance >= currentBet && currentBet > 0;

  if (spinBtn) spinBtn.disabled = !hasBalance || appState.isSpinning;
  if (warning) warning.classList.toggle('hidden', hasBalance);
}

/* -- Payout Table -- */
function renderPayoutTable() {
  const container = document.getElementById('payoutTable');
  if (!container) return;

  const rows = [
    { symbols: '💎 💎 💎', label: 'Diamond Jackpot', mult: '×50' },
    { symbols: '⭐ ⭐ ⭐', label: 'Star Mega Win',   mult: '×25' },
    { symbols: '7️⃣  7️⃣  7️⃣',  label: 'Triple Seven',   mult: '×15' },
    { symbols: '📊 📊 📊', label: 'Triple Bar',      mult: '×8'  },
    { symbols: '🔔 🔔 🔔', label: 'Triple Bell',     mult: '×5'  },
    { symbols: '🍇 🍇 🍇', label: 'Triple Plum',     mult: '×3'  },
    { symbols: '🍊 🍊 🍊', label: 'Triple Orange',   mult: '×3'  },
    { symbols: '🍋 🍋 🍋', label: 'Triple Lemon',    mult: '×2'  },
    { symbols: '🍒 🍒 🍒', label: 'Triple Cherry',   mult: '×2'  },
    { symbols: '🍒 🍒 ?',  label: 'Two Cherries',    mult: '×0.5'},
    { symbols: 'Any 2x 🍒', label: 'Any Two Cherries', mult: '×0.3'},
  ];

  container.innerHTML = rows.map(r => `
    <div class="payout-row">
      <span class="payout-symbols">${r.symbols}</span>
      <span class="payout-label">${r.label}</span>
      <span class="payout-mult">${r.mult}</span>
    </div>`).join('');
}

/* -- Live Stats Update -- */
function updateLiveStats() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const net = appState.netProfit;
  const netEl = document.getElementById('lsNetProfit');
  if (netEl) {
    netEl.textContent = (net >= 0 ? '+' : '') + formatCurrency(Math.abs(net));
    netEl.className   = 'live-stat-val ' + (net >= 0 ? 'primary-text' : 'danger-text');
  }
  set('lsBalance',   formatCurrency(appState.balance));
  set('lsSpins',     appState.spins);
  set('lsWinRate',   getWinRate() + '%');
  set('lsWinStreak', appState.currentWinStreak);
  set('lsSessionTime', getSessionDuration());
}

/* -- Spin History -- */
function renderSpinHistory() {
  const container = document.getElementById('spinHistoryList');
  if (!container) return;

  const history = appState.spinHistory.slice(-10).reverse();
  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="bx bx-time-five" aria-hidden="true"></i>
        <p>${tr('noSpinsYet')}</p>
      </div>`;
    return;
  }

  container.innerHTML = history.map(s => {
    const isWin    = s.payout > s.bet;
    const netSign  = s.net >= 0 ? '+' : '';
    const netClass = s.net >= 0 ? 'spin-hist-win' : 'spin-hist-loss';
    const symbols  = s.reels.map(id => {
      const sym = SYMBOLS.find(sym => sym.id === id);
      return sym ? sym.label : '❓';
    }).join(' ');
    return `
      <div class="spin-history-item ${isWin ? 'spin-win' : 'spin-loss'}">
        <span class="spin-hist-symbols">${symbols}</span>
        <span class="spin-hist-label">${escapeHtml(s.label)}</span>
        <span class="spin-hist-net ${netClass}">${netSign}${formatCurrency(Math.abs(s.net))}</span>
      </div>`;
  }).join('');
}

/* -- Educational Feed -- */
function pushEduTip(tip) {
  const feed = document.getElementById('eduFeedContent');
  if (!feed || !tip) return;

  const typeMap = { warning: 'edu-tip-warning', danger: 'edu-tip-danger', success: 'edu-tip-success', info: 'edu-tip-info' };
  const card = document.createElement('div');
  card.className = `edu-tip-card ${typeMap[tip.type] || 'edu-tip-info'} edu-tip-new`;
  card.innerHTML = `
    <span class="edu-tip-icon">${tip.icon}</span>
    <div>
      <strong>${escapeHtml(tip.title)}</strong>
      <p>${escapeHtml(tip.body)}</p>
    </div>`;

  // Insert at top, keep max 5 cards
  feed.insertBefore(card, feed.firstChild);
  while (feed.children.length > 5) feed.removeChild(feed.lastChild);

  // Remove animation class after transition
  requestAnimationFrame(() => card.classList.remove('edu-tip-new'));
}

/* -- Reel Animation -- */
function animateReels(finalReels, callback) {
  const trackIds   = ['track0', 'track1', 'track2'];
  const SPIN_ROWS  = 14;   // symbols to scroll through
  const SYMBOL_H   = 80;   // px — must match CSS
  const DURATIONS  = [600, 800, 1000]; // staggered stop times per reel

  trackIds.forEach((trackId, reelIdx) => {
    const track  = document.getElementById(trackId);
    if (!track) return;

    const strip  = generateReelStrip(finalReels[reelIdx], SPIN_ROWS);
    const totalH = SYMBOL_H * (SPIN_ROWS - 1);

    // Build DOM
    track.style.transition = 'none';
    track.style.transform  = 'translateY(0)';
    track.innerHTML        = strip.map(s =>
      `<div class="reel-symbol" data-id="${s.id}">${s.label}</div>`
    ).join('');

    // Trigger animation after brief paint delay
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track.style.transition = `transform ${DURATIONS[reelIdx]}ms cubic-bezier(0.17, 0.67, 0.35, 1.0)`;
        track.style.transform  = `translateY(-${totalH}px)`;
      });
    });

    // After this reel stops, bounce effect
    setTimeout(() => {
      track.style.transition = 'transform 0.15s ease-out';
      track.style.transform  = `translateY(-${totalH - 6}px)`;
      setTimeout(() => {
        track.style.transition = 'transform 0.1s ease-in';
        track.style.transform  = `translateY(-${totalH}px)`;
      }, 150);
    }, DURATIONS[reelIdx]);
  });

  // All reels stopped — fire callback
  setTimeout(callback, DURATIONS[2] + 300);
}

/* -- Win/Loss visual feedback -- */
function showResultFeedback(resultType, label) {
  const display  = document.getElementById('resultDisplay');
  const textEl   = document.getElementById('resultText');
  if (!display || !textEl) return;

  textEl.textContent = label;

  // Class mapping
  const classMap = {
    jackpot:   'result-jackpot',
    mega_win:  'result-bigwin',
    big_win:   'result-bigwin',
    win:       'result-win',
    small_win: 'result-win',
    partial:   'result-partial',
    near_miss: 'result-near',
    loss:      'result-loss',
  };
  display.className = `result-display ${classMap[resultType] || 'result-loss'}`;
}

/* -- Main Spin Handler -- */
function handleSpin() {
  if (appState.isSpinning) return;
  if (currentBet > appState.balance || currentBet <= 0) return;

  appState.isSpinning = true;

  const spinBtn  = document.getElementById('spinBtn');
  const spinLabel = document.getElementById('spinBtnLabel');
  if (spinBtn)  spinBtn.disabled = true;
  if (spinLabel) spinLabel.textContent = tr('spinningBtn');

  // Show spinning state
  const resultText = document.getElementById('resultText');
  if (resultText) resultText.textContent = '🎰 Spinning...';

  // Process spin logic (deducts bet, calculates result)
  const result = processSpin(currentBet);
  if (!result) {
    appState.isSpinning = false;
    if (spinBtn) spinBtn.disabled = false;
    if (spinLabel) spinLabel.textContent = tr('spinBtn');
    return;
  }

  // Animate reels, then show result
  animateReels(result.reels, () => {
    appState.isSpinning = false;

    // Update UI
    showResultFeedback(result.resultType, result.label);
    updateBalanceDisplay(true);
    updateLiveStats();
    renderSpinHistory();
    validateBet();

    // Push educational tip
    if (result.eduTip) pushEduTip(result.eduTip);

    // Check milestones
    const milestone = checkMilestone(appState);
    if (milestone) showToast(milestone.message, milestone.type);

    // Re-enable spin button
    if (spinBtn)  spinBtn.disabled = false;
    if (spinLabel) spinLabel.textContent = tr('spinBtn');

    // Session timer
    if (!sessionTimerInterval) {
      sessionTimerInterval = setInterval(() => {
        const timeEl = document.getElementById('lsSessionTime');
        if (timeEl) timeEl.textContent = getSessionDuration();
      }, 1000);
    }
  });
}

function initSimulation() {
  injectLayout('simulation');
  sharedInit();

  // Set initial bet
  currentBet = appState.currentBet || 250;
  const betInput = document.getElementById('betInput');
  if (betInput) {
    betInput.value = currentBet;
    betInput.addEventListener('input', () => {
      const val = parseInt(betInput.value, 10) || 0;
      currentBet = clamp(val, 0, appState.balance);
      validateBet();
    });
    betInput.addEventListener('blur', () => setCurrentBet(parseInt(betInput.value, 10) || 1));
  }

  // Preset bet buttons
  document.querySelectorAll('.bet-preset-btn[data-bet]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bet-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setCurrentBet(parseInt(btn.dataset.bet, 10));
    });
  });

  // Max bet
  const maxBtn = document.getElementById('betMaxBtn');
  if (maxBtn) maxBtn.addEventListener('click', () => setCurrentBet(appState.balance));

  // Half / Double
  const halfBtn   = document.getElementById('betHalfBtn');
  const doubleBtn = document.getElementById('betDoubleBtn');
  if (halfBtn)   halfBtn.addEventListener('click', () => setCurrentBet(Math.max(1, Math.floor(currentBet / 2))));
  if (doubleBtn) doubleBtn.addEventListener('click', () => setCurrentBet(currentBet * 2));

  // Spin button
  const spinBtn = document.getElementById('spinBtn');
  if (spinBtn) spinBtn.addEventListener('click', handleSpin);

  // Keyboard shortcut: Space = spin
  document.addEventListener('keydown', e => {
    if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
      handleSpin();
    }
  });

  // Reset session
  const resetSessBtn = document.getElementById('resetSessionBtn');
  if (resetSessBtn) resetSessBtn.addEventListener('click', () => {
    showConfirmModal(
      tr('resetSessionConfirmTitle'),
      tr('resetSessionConfirmBody'),
      () => {
        resetSessionOnly();
        updateBalanceDisplay(false);
        updateLiveStats();
        renderSpinHistory();
        // Clear edu feed
        const feed = document.getElementById('eduFeedContent');
        if (feed) feed.innerHTML = `
          <div class="edu-tip-card edu-tip-info">
            <span class="edu-tip-icon">💡</span>
            <div><strong>${tr('eduTipWelcomeTitle')}</strong>
            <p>${tr('eduTipWelcomeBody')}</p></div>
          </div>`;
        showToast(tr('toastSessionReset'), 'info');
      }
    );
  });

  // Session report modal
  const closeSessionBtn = document.getElementById('closeSessionModal');
  if (closeSessionBtn) closeSessionBtn.addEventListener('click', () => closeModal('sessionModal'));

  const sessionOkBtn = document.getElementById('sessionModalOkBtn');
  if (sessionOkBtn) sessionOkBtn.addEventListener('click', () => closeModal('sessionModal'));

  const sessionModalEl = document.getElementById('sessionModal');
  if (sessionModalEl) sessionModalEl.addEventListener('click', handleOverlayClick);

  // Render payout table
  renderPayoutTable();

  // Initial UI state
  updateLiveStats();
  renderSpinHistory();
  validateBet();

  // Start session timer
  sessionTimerInterval = setInterval(() => {
    const timeEl = document.getElementById('lsSessionTime');
    if (timeEl) timeEl.textContent = getSessionDuration();
  }, 1000);
}

/* ================================================================
  STATISTICS PAGE
  ================================================================ */
function updateStatsDisplay() {
  const s       = appState;
  const winRate = getWinRate();
  const avgBet  = getAverageBet();
  const rtp     = s.totalBet > 0 ? Math.round((s.totalWins / s.totalBet) * 100) : 0;
  const net     = s.netProfit;

  const set = (id, val, cls) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = val;
    if (cls) el.className = `stat-card-value ${cls}`;
  };

  set('statTotalWagered', formatCurrency(s.totalBet));
  set('statTotalLost',    formatCurrency(s.totalLosses));
  set('statWinRate',      winRate + '%');
  set('statSpins',        s.spins.toLocaleString());
  set('statBiggestWin',   formatCurrency(s.biggestWin));
  set('statBiggestLoss',  formatCurrency(s.biggestLoss));
  set('statNetProfit',    (net >= 0 ? '+' : '') + formatCurrency(Math.abs(net)),
      net >= 0 ? '' : 'danger-text');
  set('statSessionTime',  getSessionDuration());
  set('statAvgBet',       formatCurrency(avgBet));
  set('statRTP',          rtp + '%');
  set('statWinStreak',    s.highestWinStreak.toLocaleString());
  set('statLossStreak',   s.currentLossStreak.toLocaleString());
}

function initStatistics() {
  injectLayout('statistics');
  sharedInit();
  updateStatsDisplay();

  // Render charts after a brief paint delay for canvas sizing
  requestAnimationFrame(() => {
    setTimeout(renderAllCharts, 50);
  });

  // Live session timer
  setInterval(() => {
    const el = document.getElementById('statSessionTime');
    if (el) el.textContent = getSessionDuration();
  }, 1000);
}

/* ================================================================
  LEARN PAGE
  ================================================================ */
function renderContextualLearnCards() {
  const container = document.getElementById('contextualLearnCards');
  if (!container) return;

  const cards = getContextualLearnCards(appState);
  if (cards.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="section-label" data-i18n="yourSessionLabel">Your Session Insights</div>
    <div class="cards-grid three-col">
      ${cards.map(c => `
        <article class="edu-card">
          <span class="edu-card-icon" style="font-size:2.5rem">${c.icon}</span>
          <h3 class="edu-card-title">${escapeHtml(c.title)}</h3>
          <div class="edu-card-tag">${escapeHtml(c.tag)}</div>
          <p class="edu-card-body">${escapeHtml(c.body)}</p>
          <div class="edu-card-stat">
            <span>${escapeHtml(c.stat)}</span>
            <span class="edu-stat-value ${c.valClass || 'primary-text'}">${escapeHtml(c.statVal)}</span>
          </div>
        </article>`).join('')}
    </div>`;
}

function initLearn() {
  injectLayout('learn');
  sharedInit();
  renderContextualLearnCards();
}

/* ================================================================
  WITHDRAW PAGE
  ================================================================ */
function updateWithdrawStats() {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('wdAttempts',  appState.withdrawAttempts);
  set('wdTotal',     formatCurrency(appState.withdrawTotal));
  set('wdSuccess',   appState.withdrawSuccess);
  set('wdCancelled', appState.withdrawCancelled);
}

/**
 * Animate the withdrawal timeline steps sequentially.
 */
function animateWithdrawalTimeline(callback) {
  const items  = document.querySelectorAll('#withdrawModal .timeline-item');
  const delays = [0, 1200, 2800, 4600];

  items.forEach((item, i) => {
    item.classList.remove('active');
    setTimeout(() => {
      item.classList.add('active');
      if (i === items.length - 1 && callback) {
        setTimeout(callback, 800);
      }
    }, delays[i]);
  });
}

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
    showFieldError(errorEl, input, tr('errInvalidAmt')); return;
  }
  if (amount <= 0) {
    showFieldError(errorEl, input, tr('errNegativeAmt')); return;
  }
  if (amount > appState.balance) {
    showFieldError(errorEl, input, `${tr('errInsufficientBal')} ${formatCurrency(appState.balance)}.`); return;
  }

  // Record attempt
  appState.withdrawAttempts += 1;
  appState.withdrawTotal    += amount;
  persistWithdrawStats();
  updateWithdrawStats();

  // Set modal amount
  const amountEl = document.getElementById('withdrawModalAmount');
  if (amountEl) amountEl.textContent = formatCurrency(amount);

  // Show modal and animate timeline
  openModal('withdrawModal', '#withdrawModalOkBtn');
  // Reset all steps first
  document.querySelectorAll('#withdrawModal .timeline-item').forEach(el => el.classList.remove('active'));
  animateWithdrawalTimeline(() => {
    appState.withdrawSuccess += 1;
    persistWithdrawStats();
    updateWithdrawStats();
  });

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
  updateWithdrawStats();

  const form = document.getElementById('withdrawForm');
  if (form) form.addEventListener('submit', handleWithdrawSubmit);

  const closeBtn = document.getElementById('closeWithdrawModal');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    appState.withdrawCancelled += 1;
    persistWithdrawStats();
    updateWithdrawStats();
    closeModal('withdrawModal');
  });

  const okBtn = document.getElementById('withdrawModalOkBtn');
  if (okBtn) okBtn.addEventListener('click', () => closeModal('withdrawModal'));

  const modalEl = document.getElementById('withdrawModal');
  if (modalEl) modalEl.addEventListener('click', handleOverlayClick);
}

/* ================================================================
  SETTINGS PAGE
  ================================================================ */
function initSettings() {
  injectLayout('settings');
  sharedInit();

  const soundEl = document.getElementById('soundToggle');
  if (soundEl) soundEl.addEventListener('change', () => {
    appState.settings.sound = soundEl.checked;
    soundEl.setAttribute('aria-checked', String(soundEl.checked));
    persistSettings();
    showToast(tr(soundEl.checked ? 'toastSoundOn' : 'toastSoundOff'), 'info');
  });

  const animEl = document.getElementById('animationsToggle');
  if (animEl) animEl.addEventListener('change', () => {
    appState.settings.animations = animEl.checked;
    animEl.setAttribute('aria-checked', String(animEl.checked));
    persistSettings();
    applySettings();
    showToast(tr(animEl.checked ? 'toastAnimOn' : 'toastAnimOff'), 'info');
  });

  const resetBtn = document.getElementById('resetAllDataBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    showConfirmModal(
      tr('confirmResetDataTitle'),
      tr('confirmResetDataBody'),
      () => {
        resetAllAppState();
        applySettings();
        updateBalanceDisplay(false);
        showToast(tr('toastDataReset'), 'warning');
      }
    );
  });
}
