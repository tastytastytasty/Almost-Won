/**
 * ================================================================
 * ALMOST WON — i18n Translations
 * js/i18n.js
 * Supported languages: en (English), id (Bahasa Indonesia)
 * ================================================================
 */

'use strict';

const TRANSLATIONS = {
  en: {
    /* ---- App-wide ---- */
    appName:          'Almost Won',
    eduBadge:         'EDUCATIONAL ONLY',
    balanceLabel:     'Balance',
    version:          'v1.0.0-edu',

    /* ---- Navigation ---- */
    navHome:          'Home',
    navWallet:        'Wallet',
    navSimulate:      'Simulate',
    navStats:         'Stats',
    navLearn:         'Learn',
    navWithdraw:      'Withdraw',
    navSettings:      'Settings',

    /* ---- Language switcher ---- */
    language:         'Language',

    /* ---- Home page ---- */
    heroBadge:        '🎰 Virtual Simulation',
    heroTitle:        'Almost Won',
    heroTagline:      'Experience the illusion. Learn the reality.',
    heroDesc:         'Explore the world of gambling through a safe, educational simulation. Understand why the house always wins — before it costs you real money.',
    ctaButton:        'Start Simulating',
    whyLabel:         'Why Use Almost Won?',
    feat1Title:       'Realistic Games',
    feat1Desc:        'Simulate slot machines, coin flips, and dice rolls with realistic probability models — no rigging, just real odds.',
    feat2Title:       'Track Your Losses',
    feat2Desc:        'Watch your virtual balance drain over time. See the stats that real gambling platforms hide from you.',
    feat3Title:       'Learn Psychology',
    feat3Desc:        'Understand the cognitive biases and psychological traps that keep people gambling long after they should stop.',
    disclaimerStrong: 'Educational Disclaimer:',
    disclaimerText:   'This application uses virtual money only. No real money is involved. This simulator is designed to demonstrate the psychological and financial risks of gambling. Please gamble responsibly in real life.',

    /* ---- Wallet page ---- */
    walletTitle:      'Virtual Wallet',
    walletSubtitle:   'Your virtual funds — no real money involved.',
    currentBalance:   'Current Balance',
    addFunds:         'Add $1,000',
    resetWallet:      'Reset Wallet',
    txHistoryLabel:   'Transaction History',
    emptyTx:          'No transactions yet. Add funds or play a game to see history.',
    txAdded:          'Added virtual funds',
    toastAdded:       'Added $1,000 to your wallet!',
    toastWalletReset: 'Wallet reset to $10,000.',
    confirmResetWalletTitle: 'Reset Wallet?',
    confirmResetWalletBody:  'This will reset your balance to $10,000 and clear your transaction history. Are you sure?',

    /* ---- Simulation page ---- */
    simTitle:         'Game Simulations',
    simSubtitle:      'Choose a game to simulate. All outcomes use real probability.',
    simBanner:        'These games simulate real gambling odds. The house edge is built in — just like real casinos.',
    slotsTitle:       'Slot Machine',
    slotsDesc:        'Spin the reels and try your luck. With a typical RTP of 85–95%, the house keeps 5–15% of every spin.',
    coinTitle:        'Coin Flip',
    coinDesc:         'Seems like 50/50 odds — but the house takes a cut on every bet, making it mathematically impossible to win long-term.',
    diceTitle:        'Dice Roll',
    diceDesc:         'Roll the dice and beat the dealer. Even with correct odds, the house always tilts the math in their favor.',
    playBtn:          'Play',

    /* ---- Statistics page ---- */
    statsTitle:       'Statistics Dashboard',
    statsSubtitle:    'Your gambling simulation performance at a glance.',
    statWagered:      'Total Wagered',
    statLost:         'Total Lost',
    statWinRate:      'Win Rate',
    statSessions:     'Sessions Played',
    statBigWin:       'Biggest Win',
    statBigLoss:      'Biggest Loss',
    lossChartLabel:   'Loss Over Time',
    chartComingSoon:  'Loss Chart — Coming Soon',
    chartSubLabel:    'This chart will visualize your cumulative losses over each session, demonstrating the inevitable downward trend.',

    /* ---- Learn page ---- */
    learnTitle:       'Educational Summary',
    learnSubtitle:    'Understanding these concepts could save you thousands of real dollars.',
    edu1Title:        'The House Always Wins',
    edu1Tag:          'House Edge',
    edu1Body:         'Every casino game is mathematically designed so the house keeps a percentage of every bet — this is called the "house edge." Over thousands of bets, this edge guarantees the casino makes money, even if individual players occasionally win. No strategy can overcome a negative expected value.',
    edu1Stat:         'Average House Edge:',
    edu1StatVal:      '2% – 15%',
    edu2Title:        "Gambler's Fallacy",
    edu2Tag:          'Psychology',
    edu2Body:         "The Gambler's Fallacy is the mistaken belief that past random events influence future ones. If a coin lands heads 10 times in a row, people believe tails is \"due\" — but each flip is completely independent. Casinos exploit this thinking to keep players betting on \"hot streaks\" and \"cold streaks\" that don't actually exist.",
    edu2Stat:         'Reality:',
    edu2StatVal:      'Each event is independent',
    edu3Title:        'Sunk Cost Trap',
    edu3Tag:          'Behavioral Economics',
    edu3Body:         'The Sunk Cost Fallacy makes people continue a losing behavior because they\'ve already invested money or time. "I\'ve lost $500, I need to win it back" — this thinking leads to chasing losses and spiraling deeper into debt. In gambling, money already lost is gone; continuing to play only increases expected losses.',
    edu3Stat:         'Outcome:',
    edu3StatVal:      'Deeper losses guaranteed',
    infoBoxStrong:    'Remember:',
    infoBoxText:      'The best gambling strategy is not to gamble. If you or someone you know has a gambling problem, contact the National Problem Gambling Helpline:',

    /* ---- Withdraw page ---- */
    withdrawTitle:    'Withdraw Simulation',
    withdrawSubtitle: 'Experience the frustrating reality of casino withdrawals.',
    requestWithdraw:  'Request Withdrawal',
    availBalance:     'Available balance:',
    withdrawLabel:    'Withdrawal Amount (USD)',
    withdrawPlaceholder: 'Enter amount...',
    withdrawHint:     'Minimum withdrawal: $1. Maximum: your current balance.',
    withdrawBtn:      'Request Withdrawal',
    realityTitle:     'Reality Check',
    realityIntro:     "In real online gambling platforms, withdrawals are rarely this simple. Here's what actually happens:",
    reality1Strong:   'Identity Verification:',
    reality1Text:     'You must submit government ID, proof of address, and sometimes a selfie — a process that can take days or weeks.',
    reality2Strong:   'Wagering Requirements:',
    reality2Text:     'Most bonuses come with 30–50× wagering requirements. You must bet that amount before withdrawing any bonus money.',
    reality3Strong:   'Withdrawal Limits:',
    reality3Text:     'Many casinos cap daily or weekly withdrawals at $500–$2,000, trapping large winnings in your account.',
    reality4Strong:   'Account Closure Risk:',
    reality4Text:     'Consistently winning players often find their accounts suspended or closed without explanation.',
    realityFooter:    'The house controls your money. Getting it back is harder than losing it.',
    errInvalidAmt:    'Please enter a valid amount.',
    errNegativeAmt:   'Withdrawal amount must be greater than $0.',
    errInsufficientBal: 'Insufficient balance. You only have',

    /* ---- Settings page ---- */
    settingsTitle:    'Settings',
    settingsSubtitle: 'Customize your Almost Won experience.',
    soundTitle:       'Sound Effects',
    soundDesc:        'Enable or disable audio feedback for game events and interactions.',
    animTitle:        'Animations',
    animDesc:         'Enable or disable UI animations and transitions. Disable for better performance.',
    langTitle:        'Language',
    langDesc:         'Switch the application language.',
    appVersionTitle:  'App Version',
    appVersionDesc:   'Current release of Almost Won.',
    dangerZoneLabel:  'Danger Zone',
    resetDataTitle:   'Reset All Data',
    resetDataDesc:    'This will permanently clear all wallet data, transaction history, statistics, and settings from your browser. This action cannot be undone.',
    resetDataBtn:     'Reset All Data',
    toastSoundOn:     'Sound effects enabled.',
    toastSoundOff:    'Sound effects disabled.',
    toastAnimOn:      'Animations enabled.',
    toastAnimOff:     'Animations disabled.',
    toastDataReset:   'All data has been reset.',
    toastLangChanged: 'Language changed to English.',
    confirmResetDataTitle: 'Reset All Data?',
    confirmResetDataBody:  'This will permanently delete ALL data including your balance, transaction history, and statistics. This cannot be undone.',

    /* ---- Modals ---- */
    gameModalTitle:   'Game Coming Soon',
    gameModalBody:    'The game logic for',
    gameModalBodyEnd: 'is not yet implemented. This is a UI prototype demonstrating the structure of the application.',
    gameModalInfo:    'In a full implementation, this game would use real probability models with a built-in house edge — demonstrating why gambling is mathematically designed for you to lose over time.',
    gameModalOk:      'Got it',
    withdrawModalTitle:  'Withdrawal Under Review',
    withdrawModalBody:   'Your withdrawal of',
    withdrawModalBodyEnd: 'has been submitted and is now "under review."',
    tlSubmitted:      'Submitted',
    tlSubmittedSub:   '— Request received',
    tlIdentity:       'Identity Verification',
    tlIdentitySub:    '— Awaiting documents (2–5 days)',
    tlCompliance:     'Compliance Review',
    tlComplianceSub:  '— Anti-fraud check (1–3 days)',
    tlPayment:        'Payment Processing',
    tlPaymentSub:     '— Bank transfer (3–7 days)',
    withdrawModalDisclaimer: 'This is a simulation. In real gambling platforms, this process can take up to 2 weeks — and your request may be denied entirely.',
    withdrawModalOk:  'Understood',
    confirmTitle:     'Are you sure?',
    confirmBody:      'This action cannot be undone.',
    confirmCancel:    'Cancel',
    confirmConfirm:   'Confirm',

    /* ---- Toast icons kept as boxicons in JS ---- */
    /* ---- Game Engine & Simulation ---- */
    houseEdgeLabel:       'House Edge: ~8%',
    betLabel:             'Bet Amount',
    betMax:               'MAX',
    betHalf:              '½',
    betDouble:            '×2',
    betPlaceholder:       'Custom bet...',
    spinBtn:              'SPIN',
    spinningBtn:          'Spinning...',
    insufficientBalance:  'Insufficient balance. Top up your wallet to continue.',
    resultReady:          'Ready to spin!',
    topUpWallet:          'Top Up',
    resetSession:         'Reset Session',
    viewStats:            'Stats',
    liveStatsTitle:       'Live Session',
    eduFeedTitle:         'Educational Insights',
    spinHistoryTitle:     'Last Spins',
    noSpinsYet:           'No spins yet.',
    payoutTableTitle:     'Payout Table',
    sessionReportTitle:   'Session Report',
    sessionReportOk:      'Continue Playing',
    /* ---- Wallet enhanced ---- */
    netProfit:            'Net P/L',
    totalSpins:           'Spins',
    winRate:              'Win Rate',
    winStreak:            'Win Streak',
    sessionTime:          'Time',
    totalTopUp:           'Total Top-Up',
    topUpPresets:         'Quick Top-Up',
    customAmountPlaceholder: 'Custom amount...',
    addCustom:            'Add',
    resetSessionConfirmTitle: 'Reset Session?',
    resetSessionConfirmBody:  'This resets all session stats (spins, streaks, profit/loss). Your balance is kept. Continue?',
    toastSessionReset:    'Session stats reset.',
    toastTopUp:           'Added {amount} to your wallet!',
    /* ---- Statistics enhanced ---- */
    actualRTP:            'Actual RTP',
    avgBet:               'Avg Bet',
    bestWinStreak:        'Best Win Streak',
    currentLossStreak:    'Loss Streak',
    chartsLabel:          'Visual Analytics',
    chartBalanceTitle:    'Balance Over Time',
    chartBalanceSub:      'Tracks every spin result',
    chartWinLossTitle:    'Win vs Loss',
    chartWinLossSub:      'Spin count breakdown',
    chartProfitTitle:     'Profit / Loss per Spin',
    chartProfitSub:       'Last 40 spins',
    chartBetDistTitle:    'Bet Distribution',
    chartBetDistSub:      'How much you bet each spin',
    statsEduTitle:        'Understanding These Numbers',
    statsEduBody:         'A win rate below 50% is normal in gambling. The house edge ensures that over many spins, the casino always comes out ahead — regardless of short-term results.',
    chartNoData:          'No data yet — play some spins!',
    chartSpins:           'Spins',
    chartWinRate:         'Win Rate',
    chartWins:            'Wins',
    chartLosses:          'Losses',
    chartSpinsCount:      'Spins',
    chartWin:             'Win',
    chartLoss:            'Loss',
    /* ---- Withdraw stats ---- */
    withdrawStatsLabel:   'Your Withdrawal History',
    wdAttempts:           'Attempts',
    wdTotal:              'Total Requested',
    wdSuccess:            'Simulated',
    wdCancelled:          'Cancelled',
    /* ---- Educational tips (in-game) ---- */
    eduTipWelcomeTitle:   'Welcome to the Simulator',
    eduTipWelcomeBody:    'Each spin is completely independent. Past results have zero effect on future outcomes. This is called statistical independence.',
    eduTipSunkCostTitle:  'Sunk Cost Warning',
    eduTipSunkCostBody:   "You've lost {n} spins in a row. The urge to 'win it back' is the Sunk Cost Fallacy — money already lost is gone. Continuing increases expected losses.",
    eduTipNearMissTitle:  "Near Miss — It's Designed",
    eduTipNearMissBody:   "Near misses are intentionally programmed. Two matching symbols with a third one off feel like 'almost winning' — but they're actually just a loss. This tricks your brain into thinking you're close to a win.",
    eduTipBigWinTitle:    'The Illusion of a Big Win',
    eduTipBigWinBody:     "A jackpot feels amazing — but it rarely covers all previous losses. Casinos use rare big wins to create memorable moments that mask the steady draining of your balance.",
    eduTipWinStreakTitle: "Winning Streak — Don't Be Fooled",
    eduTipWinStreakBody:  "You've won {n} times in a row. Each spin is independent — your streak has no predictive power. This is the Gambler's Fallacy in action.",
    eduTipHouseEdgeTitle: 'The House Edge Is Real',
    eduTipHouseEdgeBody:  'After 10 spins, you have lost {rate}% of your spins. This matches the expected loss rate. Over hundreds of spins, this gap only grows.',
    eduTipVarianceTitle:  'Variance vs. Expected Value',
    eduTipVarianceBody:   'Short-term, anything can happen. Long-term, the math always wins. After 25 spins your results are starting to converge toward the expected loss curve.',
    eduTipNetLossTitle:   'Financial Reality Check',
    eduTipNetLossBody:    "You've lost {pct}% of your starting balance. In real gambling, this would be real money gone. The brain rarely treats virtual and real losses the same way.",
    eduTipLowBalanceTitle:'Critical Balance Warning',
    eduTipLowBalanceBody: "Your balance is below 25% of your starting amount. Real problem gamblers often top up at this point, deepening their losses. Recognize this pattern.",
    eduTipRandomTitle:    'True Randomness',
    eduTipRandomBody:     'Each spin uses a random number generator with no memory. There are no hot machines, cold machines, or patterns — only probability.',
    eduTipRTPTitle:       'Return to Player (RTP)',
    eduTipRTPBody:        'This machine has 92% RTP. For every $100 wagered, you get back $92 on average. The missing $8 is the house profit — compounded over every spin.',
    eduTipPatternTitle:   'Pattern Recognition Trap',
    eduTipPatternBody:    'Humans are wired to find patterns. When you see 3 losses, you predict a win. When you see 2 symbols match, you feel excitement. None of it is real.',
    eduTipSmartTitle:     'The Smart Play',
    eduTipSmartBody:      "The only winning strategy in gambling is not to gamble. Every spin moves your expected outcome further from your starting balance.",
    /* ---- Milestone messages ---- */
    milestoneSpins5:      "5 spins in! Remember: each spin is independent. Your results so far are just variance.",
    milestoneSpins20:     "20 spins. Notice how your balance is trending? This is the house edge at work.",
    milestoneSpins50:     "50 spins. Real gambling sessions often last hundreds or thousands of spins — the pattern only gets worse.",
    milestoneSpins100:    "100 spins! In a real casino, you've been sitting here for hours. How does your balance compare to when you started?",
    milestoneHalfLost:    "You've lost 50% of your starting balance. This is where most real gamblers say 'I just need one big win to recover.'",
    /* ---- Session Report ---- */
    reportInitialBalance: 'Starting Balance',
    reportFinalBalance:   'Final Balance',
    reportTotalTopUp:     'Total Top-Up',
    reportTotalBet:       'Total Wagered',
    reportTotalWins:      'Total Returned',
    reportTotalLosses:    'Total Lost',
    reportBiggestWin:     'Biggest Win',
    reportBiggestLoss:    'Biggest Loss',
    reportTotalSpins:     'Total Spins',
    reportWinRate:        'Win Rate',
    reportAvgBet:         'Average Bet',
    reportActualRTP:      'Actual RTP',
    reportWinStreak:      'Best Win Streak',
    reportDuration:       'Duration',
    reportNetProfit:      'Net Profit / Loss',
    reportNarrativeBad:   "You lost over half your balance. This is the most common outcome in real gambling. The house edge is not a rumor — it is a mathematical certainty. No system, strategy, or hot streak can overcome it over time.",
    reportNarrativeNeutral: "You ended below your starting balance. This is typical. Short-term variance can make gambling feel exciting, but the long-term trend always slopes downward. The casino is designed this way.",
    reportNarrativeGood:  "You ended in profit this session. This happens — it's called variance. Real gamblers who quit while ahead are rare. Most continue until the math catches up. Today you were lucky. Tomorrow, the house edge returns.",
    /* ---- Contextual Learn Cards ---- */
    ctxCardYourRTPTitle:  'Your Real Return Rate',
    ctxCardYourRTPBody:   'After {spins} spins, your win rate is {winRate}%. This is your actual return compared to the advertised 92% RTP.',
    ctxCardYourRTPStat:   'Your Win Rate:',
    ctxCardStreakTitle:    'Current Loss Streak',
    ctxCardStreakBody:     "You're on a {n}-spin losing streak. The urge to continue is the Sunk Cost Fallacy — each new spin is independent of all previous ones.",
    ctxCardStreakStat:     'Independence:',
    ctxCardStreakStatVal:  '100% — each spin is new',
    ctxCardTopUpTitle:     'You Topped Up',
    ctxCardTopUpBody:     "You've added {topup} in top-ups to keep playing. In real gambling, this would be real money withdrawn from your bank account.",
    ctxCardTopUpStat:     'Real-world equivalent:',
  },

  id: {
    /* ---- App-wide ---- */
    appName:          'Almost Won',
    eduBadge:         'HANYA UNTUK EDUKASI',
    balanceLabel:     'Saldo',
    version:          'v1.0.0-edu',

    /* ---- Navigation ---- */
    navHome:          'Beranda',
    navWallet:        'Dompet',
    navSimulate:      'Simulasi',
    navStats:         'Statistik',
    navLearn:         'Pelajari',
    navWithdraw:      'Tarik Dana',
    navSettings:      'Pengaturan',

    /* ---- Language switcher ---- */
    language:         'Bahasa',

    /* ---- Home page ---- */
    heroBadge:        '🎰 Simulasi Virtual',
    heroTitle:        'Almost Won',
    heroTagline:      'Rasakan ilusinya. Pelajari kenyataannya.',
    heroDesc:         'Jelajahi dunia perjudian melalui simulasi yang aman dan edukatif. Pahami mengapa bandar selalu menang — sebelum itu merugikan uang sungguhan Anda.',
    ctaButton:        'Mulai Simulasi',
    whyLabel:         'Mengapa Menggunakan Almost Won?',
    feat1Title:       'Permainan Realistis',
    feat1Desc:        'Simulasikan mesin slot, lempar koin, dan dadu dengan model probabilitas realistis — tanpa kecurangan, hanya peluang nyata.',
    feat2Title:       'Lacak Kerugian Anda',
    feat2Desc:        'Saksikan saldo virtual Anda berkurang dari waktu ke waktu. Lihat statistik yang disembunyikan platform judi nyata dari Anda.',
    feat3Title:       'Pelajari Psikologi',
    feat3Desc:        'Pahami bias kognitif dan jebakan psikologis yang membuat orang terus berjudi jauh melampaui batas mereka.',
    disclaimerStrong: 'Penafian Edukatif:',
    disclaimerText:   'Aplikasi ini hanya menggunakan uang virtual. Tidak ada uang nyata yang terlibat. Simulator ini dirancang untuk menunjukkan risiko psikologis dan finansial dari perjudian. Harap berjudi secara bertanggung jawab di kehidupan nyata.',

    /* ---- Wallet page ---- */
    walletTitle:      'Dompet Virtual',
    walletSubtitle:   'Dana virtual Anda — tidak ada uang nyata yang terlibat.',
    currentBalance:   'Saldo Saat Ini',
    addFunds:         'Tambah Rp10.000',
    resetWallet:      'Reset Dompet',
    txHistoryLabel:   'Riwayat Transaksi',
    emptyTx:          'Belum ada transaksi. Tambah dana atau mainkan permainan untuk melihat riwayat.',
    txAdded:          'Dana virtual ditambahkan',
    toastAdded:       'Rp10.000 berhasil ditambahkan ke dompet Anda!',
    toastWalletReset: 'Dompet direset ke Rp100.000.',
    confirmResetWalletTitle: 'Reset Dompet?',
    confirmResetWalletBody:  'Ini akan mereset saldo Anda ke Rp100.000 dan menghapus riwayat transaksi. Apakah Anda yakin?',

    /* ---- Simulation page ---- */
    simTitle:         'Simulasi Permainan',
    simSubtitle:      'Pilih permainan untuk disimulasikan. Semua hasil menggunakan probabilitas nyata.',
    simBanner:        'Permainan ini mensimulasikan peluang judi nyata. Keunggulan bandar sudah tertanam — sama seperti kasino sungguhan.',
    slotsTitle:       'Mesin Slot',
    slotsDesc:        'Putar gulungan dan coba keberuntungan Anda. Dengan RTP tipikal 85–95%, bandar mengambil 5–15% dari setiap putaran.',
    coinTitle:        'Lempar Koin',
    coinDesc:         'Tampak seperti peluang 50/50 — tetapi bandar mengambil bagian dari setiap taruhan, sehingga secara matematis mustahil menang jangka panjang.',
    diceTitle:        'Lempar Dadu',
    diceDesc:         'Lempar dadu dan kalahkan dealer. Bahkan dengan peluang yang benar, bandar selalu memiringkan matematika untuk keuntungan mereka.',
    playBtn:          'Main',

    /* ---- Statistics page ---- */
    statsTitle:       'Dasbor Statistik',
    statsSubtitle:    'Performa simulasi judi Anda sekilas pandang.',
    statWagered:      'Total Taruhan',
    statLost:         'Total Kerugian',
    statWinRate:      'Tingkat Menang',
    statSessions:     'Sesi Dimainkan',
    statBigWin:       'Kemenangan Terbesar',
    statBigLoss:      'Kerugian Terbesar',
    lossChartLabel:   'Kerugian Dari Waktu ke Waktu',
    chartComingSoon:  'Grafik Kerugian — Segera Hadir',
    chartSubLabel:    'Grafik ini akan memvisualisasikan kerugian kumulatif Anda di setiap sesi, menunjukkan tren penurunan yang tak terhindarkan.',

    /* ---- Learn page ---- */
    learnTitle:       'Ringkasan Edukasi',
    learnSubtitle:    'Memahami konsep-konsep ini dapat menghemat jutaan uang sungguhan Anda.',
    edu1Title:        'Bandar Selalu Menang',
    edu1Tag:          'Keunggulan Bandar',
    edu1Body:         'Setiap permainan kasino dirancang secara matematis agar bandar mengambil persentase dari setiap taruhan — ini disebut "house edge." Selama ribuan taruhan, keunggulan ini menjamin kasino menghasilkan uang, meskipun pemain individu kadang menang. Tidak ada strategi yang dapat mengatasi nilai ekspektasi negatif.',
    edu1Stat:         'Rata-rata Keunggulan Bandar:',
    edu1StatVal:      '2% – 15%',
    edu2Title:        'Kekeliruan Penjudi',
    edu2Tag:          'Psikologi',
    edu2Body:         'Kekeliruan Penjudi adalah keyakinan keliru bahwa peristiwa acak masa lalu mempengaruhi masa depan. Jika koin mendarat sisi kepala 10 kali berturut-turut, orang percaya sisi ekor "sudah waktunya" — padahal setiap lemparan benar-benar independen. Kasino mengeksploitasi pemikiran ini untuk mempertahankan pemain bertaruh pada "streak panas" dan "streak dingin" yang sebenarnya tidak ada.',
    edu2Stat:         'Kenyataan:',
    edu2StatVal:      'Setiap peristiwa bersifat independen',
    edu3Title:        'Jebakan Biaya Terlanjur',
    edu3Tag:          'Ekonomi Perilaku',
    edu3Body:         'Kekeliruan Biaya Terlanjur membuat orang melanjutkan perilaku yang merugikan karena mereka sudah menginvestasikan uang atau waktu. "Saya sudah rugi Rp5 juta, saya harus mendapatkannya kembali" — pemikiran ini mengarah pada mengejar kerugian dan terjerumus lebih dalam ke utang. Dalam judi, uang yang sudah hilang tidak dapat dikembalikan; terus bermain hanya meningkatkan kerugian yang diharapkan.',
    edu3Stat:         'Hasil:',
    edu3StatVal:      'Kerugian yang lebih dalam sudah pasti',
    infoBoxStrong:    'Ingat:',
    infoBoxText:      'Strategi judi terbaik adalah tidak berjudi. Jika Anda atau seseorang yang Anda kenal mengalami masalah judi, hubungi Into The Light Indonesia:',

    /* ---- Withdraw page ---- */
    withdrawTitle:    'Simulasi Penarikan Dana',
    withdrawSubtitle: 'Rasakan betapa frustrasinya proses penarikan di kasino nyata.',
    requestWithdraw:  'Ajukan Penarikan',
    availBalance:     'Saldo tersedia:',
    withdrawLabel:    'Jumlah Penarikan (IDR)',
    withdrawPlaceholder: 'Masukkan jumlah...',
    withdrawHint:     'Minimum penarikan: Rp1. Maksimum: saldo Anda saat ini.',
    withdrawBtn:      'Ajukan Penarikan',
    realityTitle:     'Cek Realita',
    realityIntro:     'Di platform judi online nyata, penarikan jarang sesederhana ini. Inilah yang sebenarnya terjadi:',
    reality1Strong:   'Verifikasi Identitas:',
    reality1Text:     'Anda harus menyerahkan KTP, bukti alamat, dan terkadang selfie — proses yang bisa memakan waktu berhari-hari atau berminggu-minggu.',
    reality2Strong:   'Persyaratan Taruhan:',
    reality2Text:     'Sebagian besar bonus hadir dengan persyaratan taruhan 30–50×. Anda harus bertaruh sejumlah itu sebelum menarik uang bonus.',
    reality3Strong:   'Batas Penarikan:',
    reality3Text:     'Banyak kasino membatasi penarikan harian atau mingguan di Rp5–20 juta, menjebak kemenangan besar di akun Anda.',
    reality4Strong:   'Risiko Penutupan Akun:',
    reality4Text:     'Pemain yang konsisten menang sering mendapati akun mereka ditangguhkan atau ditutup tanpa penjelasan.',
    realityFooter:    'Bandar mengendalikan uang Anda. Mendapatkannya kembali lebih sulit daripada kehilangannya.',
    errInvalidAmt:    'Silakan masukkan jumlah yang valid.',
    errNegativeAmt:   'Jumlah penarikan harus lebih dari Rp0.',
    errInsufficientBal: 'Saldo tidak mencukupi. Anda hanya memiliki',

    /* ---- Settings page ---- */
    settingsTitle:    'Pengaturan',
    settingsSubtitle: 'Sesuaikan pengalaman Almost Won Anda.',
    soundTitle:       'Efek Suara',
    soundDesc:        'Aktifkan atau nonaktifkan umpan balik audio untuk peristiwa permainan dan interaksi.',
    animTitle:        'Animasi',
    animDesc:         'Aktifkan atau nonaktifkan animasi dan transisi UI. Nonaktifkan untuk performa lebih baik.',
    langTitle:        'Bahasa',
    langDesc:         'Ganti bahasa aplikasi.',
    appVersionTitle:  'Versi Aplikasi',
    appVersionDesc:   'Rilis terkini Almost Won.',
    dangerZoneLabel:  'Zona Berbahaya',
    resetDataTitle:   'Reset Semua Data',
    resetDataDesc:    'Ini akan menghapus secara permanen semua data dompet, riwayat transaksi, statistik, dan pengaturan dari browser Anda. Tindakan ini tidak dapat dibatalkan.',
    resetDataBtn:     'Reset Semua Data',
    toastSoundOn:     'Efek suara diaktifkan.',
    toastSoundOff:    'Efek suara dinonaktifkan.',
    toastAnimOn:      'Animasi diaktifkan.',
    toastAnimOff:     'Animasi dinonaktifkan.',
    toastDataReset:   'Semua data telah direset.',
    toastLangChanged: 'Bahasa diubah ke Bahasa Indonesia.',
    confirmResetDataTitle: 'Reset Semua Data?',
    confirmResetDataBody:  'Ini akan menghapus secara permanen SEMUA data termasuk saldo, riwayat transaksi, dan statistik Anda. Tindakan ini tidak dapat dibatalkan.',

    /* ---- Modals ---- */
    gameModalTitle:   'Permainan Segera Hadir',
    gameModalBody:    'Logika permainan untuk',
    gameModalBodyEnd: 'belum diimplementasikan. Ini adalah prototipe UI yang menunjukkan struktur aplikasi.',
    gameModalInfo:    'Dalam implementasi penuh, permainan ini akan menggunakan model probabilitas nyata dengan keunggulan bandar bawaan — menunjukkan mengapa perjudian secara matematis dirancang agar Anda kalah dari waktu ke waktu.',
    gameModalOk:      'Mengerti',
    withdrawModalTitle:  'Penarikan Sedang Ditinjau',
    withdrawModalBody:   'Penarikan Anda sebesar',
    withdrawModalBodyEnd: 'telah diajukan dan sedang dalam tahap "peninjauan."',
    tlSubmitted:      'Diajukan',
    tlSubmittedSub:   '— Permintaan diterima',
    tlIdentity:       'Verifikasi Identitas',
    tlIdentitySub:    '— Menunggu dokumen (2–5 hari)',
    tlCompliance:     'Tinjauan Kepatuhan',
    tlComplianceSub:  '— Pemeriksaan anti-penipuan (1–3 hari)',
    tlPayment:        'Pemrosesan Pembayaran',
    tlPaymentSub:     '— Transfer bank (3–7 hari)',
    withdrawModalDisclaimer: 'Ini adalah simulasi. Di platform judi nyata, proses ini bisa memakan waktu hingga 2 minggu — dan permintaan Anda mungkin ditolak sepenuhnya.',
    withdrawModalOk:  'Saya Mengerti',
    confirmTitle:     'Apakah Anda yakin?',
    confirmBody:      'Tindakan ini tidak dapat dibatalkan.',
    confirmCancel:    'Batal',
    confirmConfirm:   'Konfirmasi',
    /* ---- Game Engine & Simulation ---- */
    houseEdgeLabel:       'Keunggulan Bandar: ~8%',
    betLabel:             'Jumlah Taruhan',
    betMax:               'MAKS',
    betHalf:              '½',
    betDouble:            '×2',
    betPlaceholder:       'Taruhan kustom...',
    spinBtn:              'PUTAR',
    spinningBtn:          'Berputar...',
    insufficientBalance:  'Saldo tidak mencukupi. Isi ulang dompet Anda untuk melanjutkan.',
    resultReady:          'Siap diputar!',
    topUpWallet:          'Isi Ulang',
    resetSession:         'Reset Sesi',
    viewStats:            'Statistik',
    liveStatsTitle:       'Sesi Langsung',
    eduFeedTitle:         'Wawasan Edukatif',
    spinHistoryTitle:     'Putaran Terakhir',
    noSpinsYet:           'Belum ada putaran.',
    payoutTableTitle:     'Tabel Pembayaran',
    sessionReportTitle:   'Laporan Sesi',
    sessionReportOk:      'Lanjutkan Bermain',
    /* ---- Wallet enhanced ---- */
    netProfit:            'Untung/Rugi',
    totalSpins:           'Putaran',
    winRate:              'Tingkat Menang',
    winStreak:            'Streak Menang',
    sessionTime:          'Waktu',
    totalTopUp:           'Total Isi Ulang',
    topUpPresets:         'Isi Ulang Cepat',
    customAmountPlaceholder: 'Jumlah kustom...',
    addCustom:            'Tambah',
    resetSessionConfirmTitle: 'Reset Sesi?',
    resetSessionConfirmBody:  'Ini akan mereset semua statistik sesi (putaran, streak, untung/rugi). Saldo Anda tetap. Lanjutkan?',
    toastSessionReset:    'Statistik sesi direset.',
    toastTopUp:           '{amount} berhasil ditambahkan ke dompet Anda!',
    /* ---- Statistics enhanced ---- */
    actualRTP:            'RTP Aktual',
    avgBet:               'Rata-rata Taruhan',
    bestWinStreak:        'Streak Menang Terbaik',
    currentLossStreak:    'Streak Kalah',
    chartsLabel:          'Analitik Visual',
    chartBalanceTitle:    'Saldo Dari Waktu ke Waktu',
    chartBalanceSub:      'Melacak setiap hasil putaran',
    chartWinLossTitle:    'Menang vs Kalah',
    chartWinLossSub:      'Rincian jumlah putaran',
    chartProfitTitle:     'Untung / Rugi per Putaran',
    chartProfitSub:       '40 putaran terakhir',
    chartBetDistTitle:    'Distribusi Taruhan',
    chartBetDistSub:      'Berapa banyak yang Anda pertaruhkan tiap putaran',
    statsEduTitle:        'Memahami Angka-Angka Ini',
    statsEduBody:         'Tingkat menang di bawah 50% adalah normal dalam perjudian. Keunggulan bandar memastikan bahwa dalam jangka panjang, kasino selalu unggul — terlepas dari hasil jangka pendek.',
    chartNoData:          'Belum ada data — mainkan beberapa putaran!',
    chartSpins:           'Putaran',
    chartWinRate:         'Tingkat Menang',
    chartWins:            'Menang',
    chartLosses:          'Kalah',
    chartSpinsCount:      'Putaran',
    chartWin:             'Menang',
    chartLoss:            'Kalah',
    /* ---- Withdraw stats ---- */
    withdrawStatsLabel:   'Riwayat Penarikan Anda',
    wdAttempts:           'Percobaan',
    wdTotal:              'Total Diminta',
    wdSuccess:            'Disimulasikan',
    wdCancelled:          'Dibatalkan',
    /* ---- Educational tips (in-game) ---- */
    eduTipWelcomeTitle:   'Selamat Datang di Simulator',
    eduTipWelcomeBody:    'Setiap putaran benar-benar independen. Hasil sebelumnya tidak berpengaruh pada hasil berikutnya. Ini disebut independensi statistik.',
    eduTipSunkCostTitle:  'Peringatan Biaya Terlanjur',
    eduTipSunkCostBody:   'Anda kalah {n} putaran berturut-turut. Dorongan untuk "mendapatkannya kembali" adalah Kekeliruan Biaya Terlanjur — uang yang sudah hilang tidak dapat dikembalikan.',
    eduTipNearMissTitle:  'Hampir Menang — Itu Dirancang',
    eduTipNearMissBody:   'Hampir menang dirancang secara sengaja. Dua simbol yang cocok terasa seperti hampir menang — tapi sebenarnya hanya kekalahan. Ini mengelabui otak Anda.',
    eduTipBigWinTitle:    'Ilusi Kemenangan Besar',
    eduTipBigWinBody:     'Jackpot terasa luar biasa — tapi jarang menutupi semua kerugian sebelumnya. Kasino menggunakan kemenangan besar yang jarang untuk menciptakan momen berkesan.',
    eduTipWinStreakTitle: 'Streak Menang — Jangan Tertipu',
    eduTipWinStreakBody:  'Anda menang {n} kali berturut-turut. Setiap putaran independen — streak Anda tidak memiliki kekuatan prediktif.',
    eduTipHouseEdgeTitle: 'Keunggulan Bandar Nyata',
    eduTipHouseEdgeBody:  'Setelah 10 putaran, Anda kalah di {rate}% putaran. Ini sesuai dengan tingkat kerugian yang diharapkan.',
    eduTipVarianceTitle:  'Varians vs Nilai Ekspektasi',
    eduTipVarianceBody:   'Jangka pendek, apa pun bisa terjadi. Jangka panjang, matematika selalu menang. Setelah 25 putaran, hasil Anda mulai mendekati kurva kerugian yang diharapkan.',
    eduTipNetLossTitle:   'Pemeriksaan Realita Finansial',
    eduTipNetLossBody:    'Anda telah kehilangan {pct}% dari saldo awal. Dalam perjudian nyata, ini adalah uang sungguhan yang hilang.',
    eduTipLowBalanceTitle:'Peringatan Saldo Kritis',
    eduTipLowBalanceBody: 'Saldo Anda di bawah 25% dari jumlah awal. Penjudi bermasalah nyata sering mengisi ulang pada titik ini, memperburuk kerugian mereka.',
    eduTipRandomTitle:    'Keacakan Sejati',
    eduTipRandomBody:     'Setiap putaran menggunakan generator angka acak tanpa memori. Tidak ada mesin panas, mesin dingin, atau pola — hanya probabilitas.',
    eduTipRTPTitle:       'Return to Player (RTP)',
    eduTipRTPBody:        'Mesin ini memiliki RTP 92%. Untuk setiap Rp100 yang dipertaruhkan, Anda mendapatkan kembali Rp92 rata-rata.',
    eduTipPatternTitle:   'Jebakan Pengenalan Pola',
    eduTipPatternBody:    'Manusia terprogram untuk menemukan pola. Tapi tidak ada pola dalam putaran slot yang acak.',
    eduTipSmartTitle:     'Permainan Cerdas',
    eduTipSmartBody:      'Satu-satunya strategi menang dalam perjudian adalah tidak berjudi.',
    /* ---- Milestone messages ---- */
    milestoneSpins5:      '5 putaran! Ingat: setiap putaran independen. Hasil Anda sejauh ini hanya varians.',
    milestoneSpins20:     '20 putaran. Perhatikan tren saldo Anda? Inilah keunggulan bandar bekerja.',
    milestoneSpins50:     '50 putaran. Sesi judi nyata sering berlangsung ratusan atau ribuan putaran.',
    milestoneSpins100:    '100 putaran! Bagaimana saldo Anda dibandingkan saat Anda mulai?',
    milestoneHalfLost:    'Anda telah kehilangan 50% dari saldo awal. Di sinilah kebanyakan penjudi nyata berkata "saya hanya butuh satu kemenangan besar."',
    /* ---- Session Report ---- */
    reportInitialBalance: 'Saldo Awal',
    reportFinalBalance:   'Saldo Akhir',
    reportTotalTopUp:     'Total Isi Ulang',
    reportTotalBet:       'Total Taruhan',
    reportTotalWins:      'Total Dikembalikan',
    reportTotalLosses:    'Total Kerugian',
    reportBiggestWin:     'Kemenangan Terbesar',
    reportBiggestLoss:    'Kerugian Terbesar',
    reportTotalSpins:     'Total Putaran',
    reportWinRate:        'Tingkat Menang',
    reportAvgBet:         'Rata-rata Taruhan',
    reportActualRTP:      'RTP Aktual',
    reportWinStreak:      'Streak Menang Terbaik',
    reportDuration:       'Durasi',
    reportNetProfit:      'Untung / Rugi Bersih',
    reportNarrativeBad:   'Anda kehilangan lebih dari setengah saldo. Ini adalah hasil paling umum dalam perjudian nyata. Keunggulan bandar bukan rumor — ini kepastian matematis.',
    reportNarrativeNeutral: 'Anda mengakhiri di bawah saldo awal. Ini tipikal. Varians jangka pendek membuat judi terasa mengasyikkan, tapi tren jangka panjang selalu menurun.',
    reportNarrativeGood:  'Anda mengakhiri dengan untung sesi ini. Ini terjadi — disebut varians. Penjudi nyata yang berhenti saat untung jarang. Kebanyakan melanjutkan hingga matematika mengejar.',
    /* ---- Contextual Learn Cards ---- */
    ctxCardYourRTPTitle:  'Tingkat Pengembalian Nyata Anda',
    ctxCardYourRTPBody:   'Setelah {spins} putaran, tingkat menang Anda adalah {winRate}%.',
    ctxCardYourRTPStat:   'Tingkat Menang Anda:',
    ctxCardStreakTitle:    'Streak Kalah Saat Ini',
    ctxCardStreakBody:     'Anda sedang dalam streak kalah {n} putaran. Dorongan untuk melanjutkan adalah Kekeliruan Biaya Terlanjur.',
    ctxCardStreakStat:     'Independensi:',
    ctxCardStreakStatVal:  '100% — setiap putaran baru',
    ctxCardTopUpTitle:     'Anda Mengisi Ulang',
    ctxCardTopUpBody:     'Anda telah menambahkan {topup} dalam isi ulang untuk terus bermain. Dalam perjudian nyata, ini adalah uang nyata.',
    ctxCardTopUpStat:     'Setara dunia nyata:',
  },
};

/** Currently active language key */
let currentLang = 'en';

/**
 * Get the translation object for the active language.
 * Falls back to English if a key is missing.
 * @returns {Object}
 */
function t() {
  return TRANSLATIONS[currentLang] || TRANSLATIONS.en;
}

/**
 * Get a single translated string by key.
 * @param {string} key
 * @returns {string}
 */
function tr(key) {
  const lang = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  return lang[key] !== undefined ? lang[key] : (TRANSLATIONS.en[key] || key);
}

/**
 * Set the active language and persist to localStorage.
 * @param {'en'|'id'} lang
 */
function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  try {
    localStorage.setItem('almostwin_lang', lang);
  } catch (e) { /* ignore */ }
}

/**
 * Load the persisted language from localStorage on startup.
 */
function loadLanguage() {
  try {
    const saved = localStorage.getItem('almostwin_lang');
    if (saved && TRANSLATIONS[saved]) {
      currentLang = saved;
    }
  } catch (e) { /* ignore */ }
}

/**
 * Apply translations to every element that has a [data-i18n] attribute.
 * The attribute value is the translation key.
 * Also updates [data-i18n-placeholder] for inputs.
 * Also updates [data-i18n-aria] for aria-label attributes.
 */
function applyTranslations() {
  // Text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = tr(key);
    if (val) el.textContent = val;
  });

  // Placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = tr(key);
    if (val) el.placeholder = val;
  });

  // Aria-label attributes
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    const val = tr(key);
    if (val) el.setAttribute('aria-label', val);
  });

  // Update <html lang> attribute
  document.documentElement.lang = currentLang;

  // Sync all language switcher selects on the page
  document.querySelectorAll('.lang-select').forEach(sel => {
    sel.value = currentLang;
  });
}
