/**
 * ================================================================
 * ALMOST WON — Slot Machine Game Engine
 * js/engine.js
 * Pure game logic: symbol definitions, probability engine,
 * payout calculator, spin processor.
 * RTP target: ~92% (house edge ~8%)
 * ================================================================
 */
'use strict';

/* ----------------------------------------------------------------
  SYMBOL DEFINITIONS
  Each symbol has:
    id       - unique key
    label    - display character
    weight   - probability weight (higher = more frequent)
    color    - CSS color class for visual styling
   ---------------------------------------------------------------- */
const SYMBOLS = [
  { id: 'cherry',  label: '🍒', weight: 30, color: 'sym-cherry'  },
  { id: 'lemon',   label: '🍋', weight: 28, color: 'sym-lemon'   },
  { id: 'orange',  label: '🍊', weight: 24, color: 'sym-orange'  },
  { id: 'plum',    label: '🍇', weight: 20, color: 'sym-plum'    },
  { id: 'bell',    label: '🔔', weight: 15, color: 'sym-bell'    },
  { id: 'bar',     label: '📊', weight: 10, color: 'sym-bar'     },
  { id: 'seven',   label: '7️⃣',  weight: 5,  color: 'sym-seven'  },
  { id: 'star',    label: '⭐',  weight: 3,  color: 'sym-star'    },
  { id: 'diamond', label: '💎', weight: 1,  color: 'sym-diamond' },
];

/* Total weight sum for probability calculation */
const TOTAL_WEIGHT = SYMBOLS.reduce((s, sym) => s + sym.weight, 0);

/**
 * PAYOUT TABLE
 * Key format: 'id,id,id' (sorted or exact left-to-right)
 * Value: multiplier applied to bet amount
 * Near-miss patterns (two matching) give 0 payout but feel close.
 */
const PAYOUTS = {
  // Three of a kind — low value symbols
  'cherry,cherry,cherry':   2,
  'lemon,lemon,lemon':      2,
  'orange,orange,orange':   3,
  'plum,plum,plum':         3,
  // Three of a kind — medium
  'bell,bell,bell':         5,
  'bar,bar,bar':            8,
  // Three of a kind — high value
  'seven,seven,seven':      15,
  'star,star,star':         25,
  'diamond,diamond,diamond':50,
  // Any two cherries (leftmost) — partial pay
  'cherry,cherry,_':        0.5,  // key handled separately
  // Mixed fruit partial
  'cherry,lemon,orange':    0.2,
};

/* ----------------------------------------------------------------
  RANDOM ENGINE
   ---------------------------------------------------------------- */

/**
 * Pick a random symbol based on weighted probability.
 * @returns {Object} symbol object
 */
function pickSymbol() {
  let roll = Math.random() * TOTAL_WEIGHT;
  for (const sym of SYMBOLS) {
    roll -= sym.weight;
    if (roll <= 0) return sym;
  }
  return SYMBOLS[SYMBOLS.length - 1];
}

/**
 * Generate three independent reel results.
 * Near-miss bias: small chance to force two matching + one off by one
 * in the symbol array to create psychological near-miss effect.
 * @returns {Array<Object>} [reel0, reel1, reel2]
 */
function generateReels() {
  // ~12% near-miss bias: force first two reels to match high-value symbol
  if (Math.random() < 0.12) {
    const highSyms = SYMBOLS.filter(s => s.weight <= 10);
    const base     = highSyms[Math.floor(Math.random() * highSyms.length)];
    // Third reel: pick adjacent symbol index (not the same)
    const idx      = SYMBOLS.indexOf(base);
    const nearIdx  = idx > 0 ? idx - 1 : idx + 1;
    return [base, base, SYMBOLS[nearIdx]];
  }
  return [pickSymbol(), pickSymbol(), pickSymbol()];
}

/* ----------------------------------------------------------------
  PAYOUT CALCULATOR
   ---------------------------------------------------------------- */

/**
 * Calculate payout for a given set of reels and bet.
 * @param {Array<Object>} reels  - [sym, sym, sym]
 * @param {number}        bet    - bet amount
 * @returns {{ multiplier: number, payout: number, resultType: string, label: string }}
 */
function calculatePayout(reels, bet) {
  const [r0, r1, r2] = reels;
  const key = `${r0.id},${r1.id},${r2.id}`;

  // Exact three-of-a-kind lookup
  if (PAYOUTS[key] !== undefined) {
    const mult = PAYOUTS[key];
    const payout = Math.round(bet * mult);
    let resultType, label;

    if (mult >= 50)      { resultType = 'jackpot';  label = '💎 JACKPOT!'; }
    else if (mult >= 25) { resultType = 'mega_win'; label = '⭐ MEGA WIN!'; }
    else if (mult >= 10) { resultType = 'big_win';  label = '🎉 BIG WIN!'; }
    else if (mult >= 5)  { resultType = 'win';      label = '✅ WIN!'; }
    else                 { resultType = 'small_win';label = '👍 Small Win'; }

    return { multiplier: mult, payout, resultType, label };
  }

  // Two cherries on left (partial pay)
  if (r0.id === 'cherry' && r1.id === 'cherry') {
    const payout = Math.round(bet * 0.5);
    return { multiplier: 0.5, payout, resultType: 'partial', label: '🍒 Near Miss +' };
  }

  // Mixed fruit (any two cherries regardless of position)
  const ids = [r0.id, r1.id, r2.id];
  if (ids.filter(id => id === 'cherry').length === 2) {
    const payout = Math.round(bet * 0.3);
    return { multiplier: 0.3, payout, resultType: 'partial', label: '🍒 Partial' };
  }

  // Near miss (two of same high-value)
  if (r0.id === r1.id || r1.id === r2.id) {
    return { multiplier: 0, payout: 0, resultType: 'near_miss', label: '😬 So Close!' };
  }

  // Loss
  return { multiplier: 0, payout: 0, resultType: 'loss', label: '❌ No Win' };
}

/* ----------------------------------------------------------------
  SPIN PROCESSOR
  The main function called by the UI.
  Updates appState, records history, returns result object.
   ---------------------------------------------------------------- */

/**
 * Process one complete spin.
 * @param {number} bet - the bet amount
 * @returns {{
 *   reels:      Array<Object>,
 *   payout:     number,
 *   multiplier: number,
 *   resultType: string,
 *   label:      string,
 *   net:        number,
 *   balance:    number,
 *   eduTip:     string,
 * }}
 */
function processSpin(bet) {
  if (appState.isSpinning) return null;
  if (bet <= 0 || bet > appState.balance) return null;

  // Start session timer on first spin
  if (!appState.sessionStartTime) {
    appState.sessionStartTime = new Date().toISOString();
  }

  // Deduct bet immediately
  appState.balance  -= bet;
  appState.totalBet += bet;
  appState.spins    += 1;

  // Generate result
  const reels  = generateReels();
  const result = calculatePayout(reels, bet);
  const payout = result.payout;
  const net    = payout - bet; // net change (negative = loss, positive = win)

  // Apply payout
  appState.balance += payout;

  // Update win/loss counters
  if (payout > bet) {
    // Net win
    appState.winCount         += 1;
    appState.totalWins        += payout;
    appState.currentWinStreak += 1;
    appState.currentLossStreak = 0;
    const winAmount = payout - bet;
    if (winAmount > appState.biggestWin) appState.biggestWin = winAmount;
    if (appState.currentWinStreak > appState.highestWinStreak) {
      appState.highestWinStreak = appState.currentWinStreak;
    }
  } else if (payout === 0) {
    // Full loss
    appState.lossCount         += 1;
    appState.totalLosses       += bet;
    appState.currentLossStreak += 1;
    appState.currentWinStreak   = 0;
    if (bet > appState.biggestLoss) appState.biggestLoss = bet;
  } else {
    // Partial — treat as loss (lost some)
    appState.lossCount         += 1;
    const lossAmount = bet - payout;
    appState.totalLosses       += lossAmount;
    appState.currentLossStreak += 1;
    appState.currentWinStreak   = 0;
    if (lossAmount > appState.biggestLoss) appState.biggestLoss = lossAmount;
  }

  // Net profit (from initial balance)
  appState.netProfit = appState.balance - appState.initialBalance;

  // Balance history for charts
  appState.balanceHistory.push({
    time:    new Date().toISOString(),
    balance: appState.balance,
  });
  if (appState.balanceHistory.length > 200) {
    appState.balanceHistory = appState.balanceHistory.slice(-200);
  }

  // Spin history entry
  const spinEntry = {
    id:          Date.now(),
    date:        new Date().toISOString(),
    bet:         bet,
    reels:       reels.map(r => r.id),
    payout:      payout,
    net:         net,
    resultType:  result.resultType,
    label:       result.label,
    balanceAfter: appState.balance,
  };
  appState.spinHistory.push(spinEntry);

  // Transaction record
  if (payout > 0) {
    recordTransaction('spin_win', `Spin: ${result.label}`, payout, true);
  } else {
    recordTransaction('spin_loss', `Spin: ${result.label}`, bet, false);
  }

  // Persist all
  persistSession();
  persistSpinHistory();
  persistTransactions();
  updateRecords();

  // Educational tip for this spin
  const eduTip = getSpinEducationalTip(result.resultType, appState);

  return {
    reels,
    payout,
    multiplier: result.multiplier,
    resultType: result.resultType,
    label:      result.label,
    net,
    balance:    appState.balance,
    eduTip,
  };
}

/* ----------------------------------------------------------------
  REEL ANIMATION HELPER
  Returns a strip of random symbols for visual spinning effect.
   ---------------------------------------------------------------- */

/**
 * Generate a strip of N random symbols for the reel spin animation.
 * The last symbol will be the actual result.
 * @param {Object} finalSymbol - the actual result symbol
 * @param {number} count       - how many symbols in the strip
 * @returns {Array<Object>}
 */
function generateReelStrip(finalSymbol, count = 12) {
  const strip = [];
  for (let i = 0; i < count - 1; i++) {
    strip.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }
  strip.push(finalSymbol); // final position is the real result
  return strip;
}

/* ----------------------------------------------------------------
  SESSION DURATION
   ---------------------------------------------------------------- */
function getSessionDuration() {
  if (!appState.sessionStartTime) return '0m 0s';
  const ms      = Date.now() - new Date(appState.sessionStartTime).getTime();
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

function getAverageBet() {
  return appState.spins > 0
    ? Math.round(appState.totalBet / appState.spins)
    : 0;
}

function getWinRate() {
  return appState.spins > 0
    ? Math.round((appState.winCount / appState.spins) * 100)
    : 0;
}
