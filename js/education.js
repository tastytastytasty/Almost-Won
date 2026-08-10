/**
 * ================================================================
 * ALMOST WON — Educational System
 * js/education.js
 * Generates contextual educational tips during gameplay,
 * milestone alerts, and the full session summary report.
 * ================================================================
 */
'use strict';

/* ----------------------------------------------------------------
  SPIN-BASED EDUCATIONAL TIPS
  Triggered after each spin based on result + session context.
   ---------------------------------------------------------------- */

/**
 * Return a contextual educational tip after a spin.
 * @param {string} resultType - 'jackpot'|'big_win'|'win'|'partial'|'near_miss'|'loss'
 * @param {Object} s          - appState snapshot
 * @returns {Object} { icon, title, body, type }
 */
function getSpinEducationalTip(resultType, s) {
  const winRate    = s.spins > 0 ? (s.winCount / s.spins) * 100 : 0;
  const lossStreak = s.currentLossStreak;
  const winStreak  = s.currentWinStreak;
  const netLoss    = s.netProfit < 0;
  const spins      = s.spins;

  // --- Loss streak warnings ---
  if (lossStreak >= 5) {
    return {
      icon: '🧠', type: 'warning',
      title: tr('eduTipSunkCostTitle'),
      body:  tr('eduTipSunkCostBody').replace('{n}', lossStreak),
    };
  }

  // --- Near miss psychology ---
  if (resultType === 'near_miss' && spins > 3) {
    return {
      icon: '😬', type: 'info',
      title: tr('eduTipNearMissTitle'),
      body:  tr('eduTipNearMissBody'),
    };
  }

  // --- Jackpot / big win overconfidence ---
  if (resultType === 'jackpot' || resultType === 'mega_win') {
    return {
      icon: '⚠️', type: 'warning',
      title: tr('eduTipBigWinTitle'),
      body:  tr('eduTipBigWinBody'),
    };
  }

  // --- Win streak + gamblers fallacy ---
  if (winStreak >= 3) {
    return {
      icon: '🎲', type: 'info',
      title: tr('eduTipWinStreakTitle'),
      body:  tr('eduTipWinStreakBody').replace('{n}', winStreak),
    };
  }

  // --- After 10 spins, show house edge reality ---
  if (spins === 10) {
    return {
      icon: '🏛️', type: 'danger',
      title: tr('eduTipHouseEdgeTitle'),
      body:  tr('eduTipHouseEdgeBody').replace('{rate}', Math.round(100 - winRate)),
    };
  }

  // --- After 25 spins, show variance lesson ---
  if (spins === 25) {
    return {
      icon: '📊', type: 'info',
      title: tr('eduTipVarianceTitle'),
      body:  tr('eduTipVarianceBody'),
    };
  }

  // --- Net loss getting significant ---
  if (netLoss && Math.abs(s.netProfit) > s.initialBalance * 0.3 && spins > 5) {
    const pct = Math.round((Math.abs(s.netProfit) / s.initialBalance) * 100);
    return {
      icon: '📉', type: 'danger',
      title: tr('eduTipNetLossTitle'),
      body:  tr('eduTipNetLossBody').replace('{pct}', pct),
    };
  }

  // --- Low balance warning ---
  if (s.balance < s.initialBalance * 0.25 && spins > 3) {
    return {
      icon: '💸', type: 'danger',
      title: tr('eduTipLowBalanceTitle'),
      body:  tr('eduTipLowBalanceBody'),
    };
  }

  // --- Random rotational tips ---
  const randomTips = [
    { icon: '🎲', type: 'info',    title: tr('eduTipRandomTitle'),    body: tr('eduTipRandomBody') },
    { icon: '🏛️', type: 'info',    title: tr('eduTipRTPTitle'),       body: tr('eduTipRTPBody') },
    { icon: '🧠', type: 'info',    title: tr('eduTipPatternTitle'),   body: tr('eduTipPatternBody') },
    { icon: '💡', type: 'success', title: tr('eduTipSmartTitle'),     body: tr('eduTipSmartBody') },
  ];
  return randomTips[spins % randomTips.length];
}

/* ----------------------------------------------------------------
  MILESTONE ALERTS
  Shown as toasts or notification banners at key moments.
   ---------------------------------------------------------------- */

/**
 * Check if any milestone has just been hit and return it.
 * @param {Object} s - appState
 * @returns {Object|null} { message, type } or null
 */
function checkMilestone(s) {
  const spins    = s.spins;
  const netLoss  = s.netProfit;

  // Spin count milestones
  if (spins === 5)   return { message: tr('milestoneSpins5'),   type: 'info'    };
  if (spins === 20)  return { message: tr('milestoneSpins20'),  type: 'warning' };
  if (spins === 50)  return { message: tr('milestoneSpins50'),  type: 'warning' };
  if (spins === 100) return { message: tr('milestoneSpins100'), type: 'error'   };

  // Balance milestones
  if (netLoss <= -s.initialBalance * 0.5 && spins > 5) {
    return { message: tr('milestoneHalfLost'), type: 'error' };
  }

  return null;
}

/* ----------------------------------------------------------------
  SESSION SUMMARY REPORT
  Generates a full HTML report shown at end of session.
   ---------------------------------------------------------------- */

/**
 * Build the session summary report HTML.
 * @param {Object} s - appState snapshot
 * @returns {string} HTML string
 */
function buildSessionReport(s) {
  const duration  = getSessionDuration();
  const winRate   = getWinRate();
  const avgBet    = getAverageBet();
  const netClass  = s.netProfit >= 0 ? 'primary-text' : 'danger-text';
  const netSign   = s.netProfit >= 0 ? '+' : '';
  const rtpActual = s.totalBet > 0
    ? Math.round((s.totalWins / s.totalBet) * 100)
    : 0;

  // Narrative conclusion
  let narrative = '';
  if (s.netProfit < -s.initialBalance * 0.5) {
    narrative = tr('reportNarrativeBad');
  } else if (s.netProfit < 0) {
    narrative = tr('reportNarrativeNeutral');
  } else {
    narrative = tr('reportNarrativeGood');
  }

  return `
    <div class="session-report">
      <div class="report-grid">
        <div class="report-item">
          <span class="report-label">${tr('reportInitialBalance')}</span>
          <span class="report-value">${formatCurrency(s.initialBalance)}</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportFinalBalance')}</span>
          <span class="report-value ${netClass}">${formatCurrency(s.balance)}</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportTotalTopUp')}</span>
          <span class="report-value">${formatCurrency(s.totalTopUp)}</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportTotalBet')}</span>
          <span class="report-value">${formatCurrency(s.totalBet)}</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportTotalWins')}</span>
          <span class="report-value primary-text">${formatCurrency(s.totalWins)}</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportTotalLosses')}</span>
          <span class="report-value danger-text">${formatCurrency(s.totalLosses)}</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportBiggestWin')}</span>
          <span class="report-value primary-text">${formatCurrency(s.biggestWin)}</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportBiggestLoss')}</span>
          <span class="report-value danger-text">${formatCurrency(s.biggestLoss)}</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportTotalSpins')}</span>
          <span class="report-value">${s.spins}</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportWinRate')}</span>
          <span class="report-value">${winRate}%</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportAvgBet')}</span>
          <span class="report-value">${formatCurrency(avgBet)}</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportActualRTP')}</span>
          <span class="report-value">${rtpActual}%</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportWinStreak')}</span>
          <span class="report-value">${s.highestWinStreak}</span>
        </div>
        <div class="report-item">
          <span class="report-label">${tr('reportDuration')}</span>
          <span class="report-value">${duration}</span>
        </div>
        <div class="report-item full-width">
          <span class="report-label">${tr('reportNetProfit')}</span>
          <span class="report-value ${netClass}" style="font-size:1.4rem;font-weight:800">
            ${netSign}${formatCurrency(Math.abs(s.netProfit))}
          </span>
        </div>
      </div>
      <div class="report-narrative">
        <i class="bx bx-bulb" aria-hidden="true"></i>
        <p>${narrative}</p>
      </div>
    </div>`;
}

/* ----------------------------------------------------------------
  PASSIVE EDUCATION CARDS (shown on Learn page dynamically)
   ---------------------------------------------------------------- */

/**
 * Returns an array of extra contextual education cards based on
 * current session stats.
 * @param {Object} s - appState
 * @returns {Array<{icon, title, tag, body, stat, statVal}>}
 */
function getContextualLearnCards(s) {
  const cards = [];
  const winRate = getWinRate();

  if (s.spins > 0) {
    cards.push({
      icon:    '<i class="bx bx-bar-chart-square edu-card-icon" aria-hidden="true"></i>',
      title:   tr('ctxCardYourRTPTitle'),
      tag:     tr('edu1Tag'),
      body:    tr('ctxCardYourRTPBody')
        .replace('{winRate}', winRate)
        .replace('{spins}', s.spins),
      stat:    tr('ctxCardYourRTPStat'),
      statVal: winRate + '%',
      valClass: winRate < 50 ? 'danger-text' : 'primary-text',
    });
  }

  if (s.currentLossStreak > 0) {
    cards.push({
      icon:    '<i class="bx bx-refresh edu-card-icon" aria-hidden="true"></i>',
      title:   tr('ctxCardStreakTitle'),
      tag:     tr('edu2Tag'),
      body:    tr('ctxCardStreakBody').replace('{n}', s.currentLossStreak),
      stat:    tr('ctxCardStreakStat'),
      statVal: tr('ctxCardStreakStatVal'),
      valClass: 'accent-text',
    });
  }

  if (s.totalTopUp > 0) {
    const costRate = Math.round((s.totalTopUp / (s.initialBalance + s.totalTopUp)) * 100);
    cards.push({
      icon:    '<i class="bx bx-credit-card edu-card-icon" aria-hidden="true"></i>',
      title:   tr('ctxCardTopUpTitle'),
      tag:     tr('edu3Tag'),
      body:    tr('ctxCardTopUpBody').replace('{topup}', formatCurrency(s.totalTopUp)),
      stat:    tr('ctxCardTopUpStat'),
      statVal: formatCurrency(s.totalTopUp),
      valClass: 'danger-text',
    });
  }

  return cards;
}
