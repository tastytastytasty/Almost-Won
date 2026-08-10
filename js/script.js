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

/* ----------------------------------------------------------------
  REEL ANIMATION ENGINE
  Uses requestAnimationFrame + scrollTop on .reel-window so the
  browser always has a real scrollable element — no CSS transition
  timing race conditions, works in every browser.

  Each reel:
    1. Fills its window with a long strip of random symbols ending
       with the final result symbol.
    2. Scrolls downward at a speed that decelerates (ease-out).
    3. Stops one-by-one (reel 0 first, reel 2 last).
    4. Shows the final symbol centered in the window after stopping.
  ---------------------------------------------------------------- */

/** Pixel height of one symbol cell — must match .reel-symbol CSS */
const REEL_SYMBOL_H = 100; // harus selalu sama persis dengan height .reel-window / .reel-symbol di CSS

/** How many random symbols to prepend before the final symbol */
const REEL_STRIP_SIZE = 24;

/** Stop times in ms for each reel — sequential stagger */
const REEL_STOP_TIMES = [1200, 1500, 1800];

/**
 * Build a DOM strip string for one reel.
 * The LAST symbol in the strip is always the final result.
 * @param {Object} finalSym   - result symbol object
 * @param {number} count      - total symbols in strip
 * @returns {string} innerHTML
 */
function buildReelStrip(finalSym, count) {
  let html = '';
  for (let i = 0; i < count - 1; i++) {
    const s = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    html += `<div class="reel-symbol" aria-hidden="true">${s.label}</div>`;
  }
  // Final symbol — visible result
  html += `<div class="reel-symbol reel-result" data-id="${finalSym.id}">${finalSym.label}</div>`;
  return html;
}

/**
 * Animate all three reels, then fire callback when all have stopped.
 *
 * Strategy per reel:
 *   - Set .reel-window overflow-y: scroll (temporarily).
 *   - Fill .reel-track with REEL_STRIP_SIZE symbols.
 *   - Instantly jump scrollTop to 0 (top = start).
 *   - Use rAF loop to advance scrollTop with easing, simulating
 *     a fast-then-slowing spin.
 *   - Stop at the row that shows the final symbol.
 *   - After all three reels complete, fire callback.
 *
 * @param {Array<Object>} finalReels  - [sym, sym, sym]
 * @param {Function}      callback    - called after last reel stops
 */
function animateReels(finalReels, callback) {
  let reelsFinished = 0;

  finalReels.forEach((finalSym, reelIdx) => {
    const window_el = document.getElementById(`reel${reelIdx}`);
    const track     = document.getElementById(`track${reelIdx}`);
    if (!window_el || !track) { reelsFinished++; return; }

    // ---- 1. Build the symbol strip ----
    track.innerHTML = buildReelStrip(finalSym, REEL_STRIP_SIZE);

    // The final symbol sits at index (REEL_STRIP_SIZE - 1).
    // The scrollTop that centers it = (REEL_STRIP_SIZE - 1) * REEL_SYMBOL_H
    const finalScrollTop = (REEL_STRIP_SIZE - 1) * REEL_SYMBOL_H;

    // ---- 2. Enable scrolling on the window, reset to top ----
    window_el.style.overflowY = 'scroll';
    window_el.style.scrollBehavior = 'auto';
    window_el.scrollTop = 0;

    // ---- 3. rAF-driven scroll with deceleration easing ----
    const startTime   = performance.now();
    const stopTime    = REEL_STOP_TIMES[reelIdx]; // ms until this reel stops

    // Ease-out cubic: fast start, slow finish
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function scrollStep(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / stopTime, 1);
      const eased    = easeOutCubic(progress);

      window_el.scrollTop = Math.round(eased * finalScrollTop);

      if (progress < 1) {
        requestAnimationFrame(scrollStep);
      } else {
        // ---- 4. Snap exactly to final position ----
        window_el.scrollTop = finalScrollTop;

        // ---- 5. Bounce effect: overshoot then snap back ----
        const BOUNCE_OVERSHOOT = 10; // px
        const BOUNCE_IN_MS     = 120;
        const BOUNCE_OUT_MS    = 90;

        window_el.style.scrollBehavior = 'smooth';

        setTimeout(() => {
          window_el.scrollTop = finalScrollTop + BOUNCE_OVERSHOOT;
          setTimeout(() => {
            window_el.scrollTop = finalScrollTop;

            // Disable scrolling again so user can't scroll the reel
            window_el.style.overflowY = 'hidden';
            window_el.style.scrollBehavior = 'auto';

            // ---- 6. Signal completion ----
            reelsFinished++;
            if (reelsFinished === 3 && typeof callback === 'function') {
              callback();
            }
          }, BOUNCE_OUT_MS);
        }, BOUNCE_IN_MS);
      }
    }

    requestAnimationFrame(scrollStep);
  });
}

/* -- Win/Loss visual feedback -- */
function showResultFeedback(resultType, label) {
  const display = document.getElementById('resultDisplay');
  const textEl  = document.getElementById('resultText');
  if (!display || !textEl) return;

  textEl.textContent = label;

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

  // Flash reel windows on a win
  const isWin = ['jackpot','mega_win','big_win','win','small_win'].includes(resultType);
  if (isWin) {
    [0, 1, 2].forEach(i => {
      const w = document.getElementById(`reel${i}`);
      if (!w) return;
      w.classList.remove('reel-win-flash');
      void w.offsetWidth; // force reflow to restart animation
      w.classList.add('reel-win-flash');
      setTimeout(() => w.classList.remove('reel-win-flash'), 1100);
    });
  }
}

/* -- Main Spin Handler -- */
function handleSpin() {
  if (appState.isSpinning) return;
  if (currentBet > appState.balance || currentBet <= 0) return;

  appState.isSpinning = true;

  const spinBtn       = document.getElementById('spinBtn');
  const spinLabel     = document.getElementById('spinBtnLabel');
  const resultText    = document.getElementById('resultText');
  const resultDisplay = document.getElementById('resultDisplay');

  // --- Disable button immediately ---
  if (spinBtn)       spinBtn.disabled = true;
  if (spinLabel)     spinLabel.textContent = tr('spinningBtn');
  if (resultText)    resultText.textContent = '🎰 Spinning...';
  if (resultDisplay) resultDisplay.className = 'result-display';

  // --- Mark reel windows as spinning ---
  [0, 1, 2].forEach(i => {
    const w = document.getElementById(`reel${i}`);
    if (w) w.classList.add('spinning');
  });

  // --- Calculate result NOW (deducts bet, updates state) ---
  let result;
  try {
    result = processSpin(currentBet);
  } catch (err) {
    console.error('processSpin failed:', err);
    result = null;
  }

  if (!result) {
    appState.isSpinning = false;
    [0, 1, 2].forEach(i => {
      const w = document.getElementById(`reel${i}`);
      if (w) w.classList.remove('spinning');
    });
    if (spinBtn)   spinBtn.disabled = false;
    if (spinLabel) spinLabel.textContent = tr('spinBtn');
    if (resultText) resultText.textContent = tr('resultReady') || 'Ready to spin!';
    return;
  }

  // --- Remove spinning highlight as each reel stops ---
  REEL_STOP_TIMES.forEach((ms, i) => {
    setTimeout(() => {
      const w = document.getElementById(`reel${i}`);
      if (w) w.classList.remove('spinning');
    }, ms + 220);
  });

  // --- Run reel animation, then update all UI ---
  animateReels(result.reels, () => {
    appState.isSpinning = false;

    try {
      // Show result then update everything in sequence
      showResultFeedback(result.resultType, result.label);
      if (typeof AudioSystem !== 'undefined') AudioSystem.playSpinResult(result.resultType);
      updateBalanceDisplay(true);
      updateLiveStats();
      renderSpinHistory();
      validateBet();

      // Educational tip for this spin
      if (result.eduTip) pushEduTip(result.eduTip);

      // Milestone check
      const milestone = checkMilestone(appState);
      if (milestone) showToast(milestone.message, milestone.type);
    } catch (err) {
      console.error('Post-spin UI update failed:', err);
    } finally {
      // Re-enable spin button — ALWAYS runs, even if something above threw
      if (spinBtn)   spinBtn.disabled = false;
      if (spinLabel) spinLabel.textContent = tr('spinBtn');
    }

    // Start session timer on first real spin
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