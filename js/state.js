/**
 * ================================================================
 * ALMOST WON — Centralized Application State
 * js/state.js
 * Single source of truth for all session data and persistence.
 * ================================================================
 */
'use strict';

/* ----------------------------------------------------------------
  STORAGE KEYS
   ---------------------------------------------------------------- */
const SK = {
  BALANCE:        'aw_balance',
  TRANSACTIONS:   'aw_transactions',
  SESSION:        'aw_session',
  SETTINGS:       'aw_settings',
  LANG:           'aw_lang',
  BEST_SESSION:   'aw_best_session',
  HIGHEST_BALANCE:'aw_highest_balance',
  LARGEST_WIN:    'aw_largest_win',
  SPIN_HISTORY:   'aw_spin_history',
  WITHDRAW_STATS: 'aw_withdraw_stats',
};

/* ----------------------------------------------------------------
  DEFAULT VALUES
   ---------------------------------------------------------------- */
const STATE_DEFAULTS = {
  balance:           10000,
  initialBalance:    10000,
  totalTopUp:        0,
  totalBet:          0,
  totalWins:         0,
  totalLosses:       0,
  biggestWin:        0,
  biggestLoss:       0,
  netProfit:         0,
  spins:             0,
  winCount:          0,
  lossCount:         0,
  currentWinStreak:  0,
  currentLossStreak: 0,
  highestWinStreak:  0,
  sessionStartTime:  null,
  withdrawAttempts:  0,
  withdrawTotal:     0,
  withdrawSuccess:   0,
  withdrawCancelled: 0,
};

const SETTINGS_DEFAULTS = {
  sound:           false,
  animations:      true,
  soundEffects:    true,   // Spin result sound — ON by default
  backgroundMusic: true,   // Background music   — ON by default
};

/* ----------------------------------------------------------------
  LIVE APP STATE (not persisted — computed at runtime)
   ---------------------------------------------------------------- */
const appState = {
  // --- Wallet / Session ---
  balance:           STATE_DEFAULTS.balance,
  initialBalance:    STATE_DEFAULTS.initialBalance,
  totalTopUp:        STATE_DEFAULTS.totalTopUp,
  totalBet:          STATE_DEFAULTS.totalBet,
  totalWins:         STATE_DEFAULTS.totalWins,
  totalLosses:       STATE_DEFAULTS.totalLosses,
  biggestWin:        STATE_DEFAULTS.biggestWin,
  biggestLoss:       STATE_DEFAULTS.biggestLoss,
  netProfit:         STATE_DEFAULTS.netProfit,
  spins:             STATE_DEFAULTS.spins,
  winCount:          STATE_DEFAULTS.winCount,
  lossCount:         STATE_DEFAULTS.lossCount,
  currentWinStreak:  STATE_DEFAULTS.currentWinStreak,
  currentLossStreak: STATE_DEFAULTS.currentLossStreak,
  highestWinStreak:  STATE_DEFAULTS.highestWinStreak,
  sessionStartTime:  STATE_DEFAULTS.sessionStartTime,

  // --- Withdraw ---
  withdrawAttempts:  STATE_DEFAULTS.withdrawAttempts,
  withdrawTotal:     STATE_DEFAULTS.withdrawTotal,
  withdrawSuccess:   STATE_DEFAULTS.withdrawSuccess,
  withdrawCancelled: STATE_DEFAULTS.withdrawCancelled,

  // --- Collections ---
  transactions:  [],   // { id, date, type, description, amount, balanceAfter }
  spinHistory:   [],   // { id, date, bet, result, payout, balanceAfter, reels }
  balanceHistory:[],   // [{ time, balance }] — for charts (kept in memory, max 200)

  // --- UI / Shared ---
  settings:      { ...SETTINGS_DEFAULTS },
  confirmCallback: null,
  isSpinning:    false,
  currentBet:    100,
};

/* ----------------------------------------------------------------
  PERSISTENCE — SAVE
   ---------------------------------------------------------------- */
function persistSession() {
  try {
    const s = appState;
    const payload = {
      balance:           s.balance,
      initialBalance:    s.initialBalance,
      totalTopUp:        s.totalTopUp,
      totalBet:          s.totalBet,
      totalWins:         s.totalWins,
      totalLosses:       s.totalLosses,
      biggestWin:        s.biggestWin,
      biggestLoss:       s.biggestLoss,
      netProfit:         s.netProfit,
      spins:             s.spins,
      winCount:          s.winCount,
      lossCount:         s.lossCount,
      currentWinStreak:  s.currentWinStreak,
      currentLossStreak: s.currentLossStreak,
      highestWinStreak:  s.highestWinStreak,
      sessionStartTime:  s.sessionStartTime,
      withdrawAttempts:  s.withdrawAttempts,
      withdrawTotal:     s.withdrawTotal,
      withdrawSuccess:   s.withdrawSuccess,
      withdrawCancelled: s.withdrawCancelled,
    };
    localStorage.setItem(SK.SESSION, JSON.stringify(payload));
    localStorage.setItem(SK.BALANCE, String(s.balance));
  } catch (e) { /* ignore */ }
}

function persistTransactions() {
  try {
    const trimmed = appState.transactions.slice(-100);
    appState.transactions = trimmed;
    localStorage.setItem(SK.TRANSACTIONS, JSON.stringify(trimmed));
  } catch (e) { /* ignore */ }
}

function persistSpinHistory() {
  try {
    const trimmed = appState.spinHistory.slice(-200);
    appState.spinHistory = trimmed;
    localStorage.setItem(SK.SPIN_HISTORY, JSON.stringify(trimmed));
  } catch (e) { /* ignore */ }
}

function persistSettings() {
  try {
    localStorage.setItem(SK.SETTINGS, JSON.stringify(appState.settings));
  } catch (e) { /* ignore */ }
}

function persistWithdrawStats() {
  try {
    localStorage.setItem(SK.WITHDRAW_STATS, JSON.stringify({
      attempts:   appState.withdrawAttempts,
      total:      appState.withdrawTotal,
      success:    appState.withdrawSuccess,
      cancelled:  appState.withdrawCancelled,
    }));
  } catch (e) { /* ignore */ }
}

function updateRecords() {
  try {
    // Highest ever balance
    const prevHigh = parseFloat(localStorage.getItem(SK.HIGHEST_BALANCE) || '0');
    if (appState.balance > prevHigh) {
      localStorage.setItem(SK.HIGHEST_BALANCE, String(appState.balance));
    }
    // Largest ever win
    const prevWin = parseFloat(localStorage.getItem(SK.LARGEST_WIN) || '0');
    if (appState.biggestWin > prevWin) {
      localStorage.setItem(SK.LARGEST_WIN, String(appState.biggestWin));
    }
  } catch (e) { /* ignore */ }
}

/* ----------------------------------------------------------------
  PERSISTENCE — LOAD
   ---------------------------------------------------------------- */
function loadPersistedState() {
  try {
    // Session stats
    const raw = localStorage.getItem(SK.SESSION);
    if (raw) {
      const saved = JSON.parse(raw);
      Object.assign(appState, saved);
    }

    // Transactions
    const tx = localStorage.getItem(SK.TRANSACTIONS);
    if (tx) appState.transactions = JSON.parse(tx) || [];

    // Spin history
    const sh = localStorage.getItem(SK.SPIN_HISTORY);
    if (sh) {
      appState.spinHistory = JSON.parse(sh) || [];
      // Rebuild balance history from spin history for charts
      appState.balanceHistory = appState.spinHistory.map(s => ({
        time:    s.date,
        balance: s.balanceAfter,
      }));
    }

    // Settings
    const se = localStorage.getItem(SK.SETTINGS);
    if (se) appState.settings = { ...SETTINGS_DEFAULTS, ...JSON.parse(se) };

    // Withdraw stats
    const wd = localStorage.getItem(SK.WITHDRAW_STATS);
    if (wd) {
      const w = JSON.parse(wd);
      appState.withdrawAttempts  = w.attempts  || 0;
      appState.withdrawTotal     = w.total     || 0;
      appState.withdrawSuccess   = w.success   || 0;
      appState.withdrawCancelled = w.cancelled || 0;
    }

    // Seed balance history start point if empty
    if (appState.balanceHistory.length === 0 && appState.sessionStartTime) {
      appState.balanceHistory.push({
        time: appState.sessionStartTime,
        balance: appState.initialBalance,
      });
    }

  } catch (e) { console.warn('[AlmostWin] State load error:', e); }
}

/* ----------------------------------------------------------------
  FULL RESET
   ---------------------------------------------------------------- */
function resetAllAppState() {
  // Save best session before clearing
  saveBestSession();

  // Clear storage
  Object.values(SK).forEach(k => {
    if (k !== SK.LANG) localStorage.removeItem(k); // preserve language
  });

  // Reset live state
  Object.assign(appState, {
    ...STATE_DEFAULTS,
    balance:        STATE_DEFAULTS.balance,
    settings:       { ...SETTINGS_DEFAULTS },
    confirmCallback: null,
    isSpinning:     false,
    currentBet:     100,
    transactions:   [],
    spinHistory:    [],
    balanceHistory: [],
    sessionStartTime: new Date().toISOString(),
  });
}

function resetSessionOnly() {
  saveBestSession();
  Object.assign(appState, {
    initialBalance:    appState.balance,
    totalBet:          0,
    totalWins:         0,
    totalLosses:       0,
    biggestWin:        0,
    biggestLoss:       0,
    netProfit:         0,
    spins:             0,
    winCount:          0,
    lossCount:         0,
    currentWinStreak:  0,
    currentLossStreak: 0,
    highestWinStreak:  0,
    sessionStartTime:  new Date().toISOString(),
  });
  appState.spinHistory   = [];
  appState.balanceHistory = [{ time: new Date().toISOString(), balance: appState.balance }];
  persistSession();
  persistSpinHistory();
}

function saveBestSession() {
  try {
    const current = {
      date:       new Date().toISOString(),
      spins:      appState.spins,
      netProfit:  appState.netProfit,
      biggestWin: appState.biggestWin,
      winCount:   appState.winCount,
      lossCount:  appState.lossCount,
    };
    const prevRaw = localStorage.getItem(SK.BEST_SESSION);
    const prev    = prevRaw ? JSON.parse(prevRaw) : null;
    // Best = most net profit
    if (!prev || current.netProfit > prev.netProfit) {
      localStorage.setItem(SK.BEST_SESSION, JSON.stringify(current));
    }
  } catch (e) { /* ignore */ }
}

/* ----------------------------------------------------------------
  TRANSACTION HELPER
   ---------------------------------------------------------------- */
/**
 * Record a transaction and persist.
 * @param {string} type        'topup'|'spin_win'|'spin_loss'|'reset'
 * @param {string} description
 * @param {number} amount      positive number
 * @param {boolean} isCredit   true = adds to balance, false = deducts
 */
function recordTransaction(type, description, amount, isCredit) {
  appState.transactions.push({
    id:           Date.now() + Math.random(),
    date:         new Date().toISOString(),
    type:         type,
    description:  description,
    amount:       isCredit ? amount : -amount,
    balanceAfter: appState.balance,
  });
  persistTransactions();
}
