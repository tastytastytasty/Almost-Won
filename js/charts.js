/**
 * ================================================================
 * ALMOST WON — Canvas Charts (No External Dependencies)
 * js/charts.js
 * Pure canvas-based charts: balance history, win/loss ratio,
 * profit/loss trend, bet distribution.
 * ================================================================
 */
'use strict';

/* ----------------------------------------------------------------
  SHARED DRAWING UTILITIES
   ---------------------------------------------------------------- */
const CHART_COLORS = {
  primary:    '#FBBF24',
  secondary:  '#10B981',
  danger:     '#EF4444',
  accent:     '#F97316',
  surface:    '#1E293B',
  border:     '#334155',
  textMuted:  '#94A3B8',
  textDim:    '#64748B',
  bg:         '#0F172A',
};

/**
 * Clear a canvas and set background.
 */
function clearCanvas(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = CHART_COLORS.surface;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, 12);
  ctx.fill();
}

/**
 * Draw a simple grid on the canvas.
 */
function drawGrid(ctx, w, h, padding, rows = 5) {
  ctx.strokeStyle = CHART_COLORS.border;
  ctx.lineWidth   = 1;
  const innerH    = h - padding.top - padding.bottom;
  for (let i = 0; i <= rows; i++) {
    const y = padding.top + (innerH / rows) * i;
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

/**
 * Draw axis labels (Y axis).
 */
function drawYLabels(ctx, w, h, padding, minVal, maxVal, rows = 5, prefix = '$') {
  ctx.fillStyle  = CHART_COLORS.textDim;
  ctx.font       = '11px Inter, sans-serif';
  ctx.textAlign  = 'right';
  const innerH   = h - padding.top - padding.bottom;
  for (let i = 0; i <= rows; i++) {
    const val = maxVal - ((maxVal - minVal) / rows) * i;
    const y   = padding.top + (innerH / rows) * i;
    ctx.fillText(prefix + Math.round(val).toLocaleString(), padding.left - 6, y + 4);
  }
}

/* ----------------------------------------------------------------
  1. BALANCE HISTORY LINE CHART
   ---------------------------------------------------------------- */

/**
 * Draw the balance-over-time line chart on a canvas element.
 * @param {string} canvasId
 * @param {Array<{time:string, balance:number}>} history
 * @param {number} initialBalance
 */
function drawBalanceChart(canvasId, history, initialBalance) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const w   = canvas.clientWidth  || canvas.width;
  const h   = canvas.clientHeight || canvas.height;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const pad = { top: 20, right: 20, bottom: 40, left: 70 };

  clearCanvas(ctx, w, h);

  if (!history || history.length < 2) {
    // Empty state
    ctx.fillStyle = CHART_COLORS.textDim;
    ctx.font      = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(tr('chartNoData'), w / 2, h / 2);
    return;
  }

  const balances = history.map(p => p.balance);
  const minVal   = Math.min(...balances, 0);
  const maxVal   = Math.max(...balances, initialBalance);
  const range    = maxVal - minVal || 1;

  const innerW   = w - pad.left - pad.right;
  const innerH   = h - pad.top  - pad.bottom;

  const xScale   = innerW / (history.length - 1);
  const yScale   = innerH / range;

  const toX = (i) => pad.left + i * xScale;
  const toY = (v) => pad.top + innerH - (v - minVal) * yScale;

  drawGrid(ctx, w, h, pad);
  drawYLabels(ctx, w, h, pad, minVal, maxVal);

  // Initial balance reference line
  const initY = toY(initialBalance);
  ctx.strokeStyle = CHART_COLORS.textDim;
  ctx.lineWidth   = 1;
  ctx.setLineDash([6, 3]);
  ctx.beginPath();
  ctx.moveTo(pad.left, initY);
  ctx.lineTo(w - pad.right, initY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Label for starting line
  ctx.fillStyle  = CHART_COLORS.textDim;
  ctx.font       = '10px Inter, sans-serif';
  ctx.textAlign  = 'left';
  ctx.fillText('Start', w - pad.right - 28, initY - 4);

  // Gradient fill under line
  const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
  grad.addColorStop(0, 'rgba(251,191,36,0.25)');
  grad.addColorStop(1, 'rgba(251,191,36,0.01)');

  ctx.beginPath();
  ctx.moveTo(toX(0), toY(history[0].balance));
  for (let i = 1; i < history.length; i++) {
    ctx.lineTo(toX(i), toY(history[i].balance));
  }
  ctx.lineTo(toX(history.length - 1), h - pad.bottom);
  ctx.lineTo(toX(0), h - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(toX(0), toY(history[0].balance));
  for (let i = 1; i < history.length; i++) {
    const x = toX(i);
    const y = toY(history[i].balance);
    // Color below initial = danger, above = primary
    ctx.strokeStyle = history[i].balance >= initialBalance
      ? CHART_COLORS.primary
      : CHART_COLORS.danger;
    ctx.lineWidth   = 2.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - xScale, toY(history[i - 1].balance));
    ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Last point dot
  const lastX = toX(history.length - 1);
  const lastY = toY(history[history.length - 1].balance);
  const lastColor = history[history.length - 1].balance >= initialBalance
    ? CHART_COLORS.primary
    : CHART_COLORS.danger;
  ctx.beginPath();
  ctx.arc(lastX, lastY, 5, 0, Math.PI * 2);
  ctx.fillStyle = lastColor;
  ctx.fill();

  // X axis label
  ctx.fillStyle = CHART_COLORS.textDim;
  ctx.font      = '11px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(tr('chartSpins'), w / 2, h - 8);
}

/* ----------------------------------------------------------------
  2. WIN / LOSS DOUGHNUT CHART
   ---------------------------------------------------------------- */

/**
 * Draw a doughnut chart for win vs loss ratio.
 * @param {string} canvasId
 * @param {number} wins
 * @param {number} losses
 */
function drawWinLossChart(canvasId, wins, losses) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const w   = canvas.clientWidth  || canvas.width;
  const h   = canvas.clientHeight || canvas.height;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  clearCanvas(ctx, w, h);

  const total = wins + losses;
  if (total === 0) {
    ctx.fillStyle = CHART_COLORS.textDim;
    ctx.font      = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(tr('chartNoData'), w / 2, h / 2);
    return;
  }

  const cx       = w / 2;
  const cy       = h / 2;
  const radius   = Math.min(cx, cy) - 20;
  const innerR   = radius * 0.55;

  const winAngle  = (wins  / total) * Math.PI * 2;
  const lossAngle = (losses / total) * Math.PI * 2;

  // Win arc
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + winAngle);
  ctx.closePath();
  ctx.fillStyle = CHART_COLORS.secondary;
  ctx.fill();

  // Loss arc
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radius, -Math.PI / 2 + winAngle, -Math.PI / 2 + winAngle + lossAngle);
  ctx.closePath();
  ctx.fillStyle = CHART_COLORS.danger;
  ctx.fill();

  // Inner hole
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = CHART_COLORS.surface;
  ctx.fill();

  // Center text
  const winPct = Math.round((wins / total) * 100);
  ctx.fillStyle  = CHART_COLORS.primary;
  ctx.font       = `bold 20px Inter, sans-serif`;
  ctx.textAlign  = 'center';
  ctx.fillText(`${winPct}%`, cx, cy - 2);
  ctx.fillStyle  = CHART_COLORS.textMuted;
  ctx.font       = `11px Inter, sans-serif`;
  ctx.fillText(tr('chartWinRate'), cx, cy + 14);

  // Legend
  const legY = h - 12;
  ctx.font      = '11px Inter, sans-serif';
  ctx.textAlign = 'center';

  ctx.fillStyle = CHART_COLORS.secondary;
  ctx.fillRect(cx - 60, legY - 8, 10, 10);
  ctx.fillStyle = CHART_COLORS.textMuted;
  ctx.fillText(`${tr('chartWins')} (${wins})`, cx - 30, legY);

  ctx.fillStyle = CHART_COLORS.danger;
  ctx.fillRect(cx + 10, legY - 8, 10, 10);
  ctx.fillStyle = CHART_COLORS.textMuted;
  ctx.fillText(`${tr('chartLosses')} (${losses})`, cx + 48, legY);
}

/* ----------------------------------------------------------------
  3. BET DISTRIBUTION BAR CHART
   ---------------------------------------------------------------- */

/**
 * Draw a bar chart showing bet amount distribution.
 * @param {string} canvasId
 * @param {Array<{bet:number}>} spinHistory
 */
function drawBetDistributionChart(canvasId, spinHistory) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const w   = canvas.clientWidth  || canvas.width;
  const h   = canvas.clientHeight || canvas.height;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  clearCanvas(ctx, w, h);

  if (!spinHistory || spinHistory.length === 0) {
    ctx.fillStyle = CHART_COLORS.textDim;
    ctx.font      = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(tr('chartNoData'), w / 2, h / 2);
    return;
  }

  // Bucket bets into ranges
  const buckets = {};
  spinHistory.forEach(s => {
    let key;
    if      (s.bet <= 100)  key = '$1–100';
    else if (s.bet <= 250)  key = '$101–250';
    else if (s.bet <= 500)  key = '$251–500';
    else if (s.bet <= 1000) key = '$501–1K';
    else                    key = '$1K+';
    buckets[key] = (buckets[key] || 0) + 1;
  });

  const keys   = Object.keys(buckets);
  const vals   = Object.values(buckets);
  const maxVal = Math.max(...vals, 1);
  const pad    = { top: 20, right: 20, bottom: 40, left: 50 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top  - pad.bottom;
  const barW   = innerW / keys.length - 8;

  keys.forEach((key, i) => {
    const barH = (vals[i] / maxVal) * innerH;
    const x    = pad.left + i * (innerW / keys.length) + 4;
    const y    = pad.top  + innerH - barH;

    // Gradient bar
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, CHART_COLORS.primary);
    grad.addColorStop(1, CHART_COLORS.accent);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 4);
    ctx.fill();

    // X label
    ctx.fillStyle  = CHART_COLORS.textDim;
    ctx.font       = '9px Inter, sans-serif';
    ctx.textAlign  = 'center';
    ctx.fillText(key, x + barW / 2, h - pad.bottom + 14);

    // Count label
    ctx.fillStyle  = CHART_COLORS.textMuted;
    ctx.font       = '10px Inter, sans-serif';
    ctx.fillText(vals[i], x + barW / 2, y - 4);
  });

  // Y axis label
  ctx.fillStyle  = CHART_COLORS.textDim;
  ctx.font       = '11px Inter, sans-serif';
  ctx.textAlign  = 'center';
  ctx.save();
  ctx.translate(12, h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(tr('chartSpinsCount'), 0, 0);
  ctx.restore();
}

/* ----------------------------------------------------------------
  4. PROFIT/LOSS TREND BAR CHART
   ---------------------------------------------------------------- */

/**
 * Draw a profit/loss bar chart (green above 0, red below).
 * @param {string} canvasId
 * @param {Array<{net:number}>} spinHistory - last N spins
 */
function drawProfitLossChart(canvasId, spinHistory) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const w   = canvas.clientWidth  || canvas.width;
  const h   = canvas.clientHeight || canvas.height;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  clearCanvas(ctx, w, h);

  const data = (spinHistory || []).slice(-40); // last 40 spins
  if (data.length === 0) {
    ctx.fillStyle = CHART_COLORS.textDim;
    ctx.font      = '13px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(tr('chartNoData'), w / 2, h / 2);
    return;
  }

  const nets   = data.map(s => s.net);
  const maxAbs = Math.max(Math.abs(Math.min(...nets)), Math.abs(Math.max(...nets)), 1);
  const pad    = { top: 20, right: 20, bottom: 30, left: 60 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top  - pad.bottom;
  const midY   = pad.top + innerH / 2;
  const barW   = innerW / data.length - 2;

  // Zero line
  ctx.strokeStyle = CHART_COLORS.border;
  ctx.lineWidth   = 1;
  ctx.beginPath();
  ctx.moveTo(pad.left, midY);
  ctx.lineTo(w - pad.right, midY);
  ctx.stroke();

  data.forEach((s, i) => {
    const x     = pad.left + i * (innerW / data.length);
    const barH  = (Math.abs(s.net) / maxAbs) * (innerH / 2);
    let y;
    if (s.net > 0) {
      y = midY - barH;
      ctx.fillStyle = CHART_COLORS.secondary;
    } else if (s.net < 0) {
      y = midY;
      ctx.fillStyle = CHART_COLORS.danger;
    } else {
      return;
    }
    ctx.beginPath();
    ctx.roundRect(x + 1, y, Math.max(barW, 2), barH, 2);
    ctx.fill();
  });

  // Labels
  ctx.fillStyle  = CHART_COLORS.textDim;
  ctx.font       = '10px Inter, sans-serif';
  ctx.textAlign  = 'left';
  ctx.fillText(tr('chartWin'),  pad.left - 45, pad.top + 14);
  ctx.fillStyle = CHART_COLORS.danger;
  ctx.fillText(tr('chartLoss'), pad.left - 45, h - pad.bottom - 4);
}

/* ----------------------------------------------------------------
  MASTER RENDER — Renders all charts at once
   ---------------------------------------------------------------- */
function renderAllCharts() {
  const s = appState;
  drawBalanceChart(    'chartBalance',      s.balanceHistory, s.initialBalance);
  drawWinLossChart(    'chartWinLoss',      s.winCount, s.lossCount);
  drawBetDistributionChart('chartBetDist',  s.spinHistory);
  drawProfitLossChart( 'chartProfitLoss',   s.spinHistory);
}
