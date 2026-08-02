/**
 * ================================================================
 * ALMOST WIN — i18n Translations
 * js/i18n.js
 * Supported languages: en (English), id (Bahasa Indonesia)
 * ================================================================
 */

'use strict';

const TRANSLATIONS = {
  en: {
    /* ---- App-wide ---- */
    appName:          'Almost Win',
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
    heroTitle:        'Almost Win',
    heroTagline:      'Experience the illusion. Learn the reality.',
    heroDesc:         'Explore the world of gambling through a safe, educational simulation. Understand why the house always wins — before it costs you real money.',
    ctaButton:        'Start Simulating',
    whyLabel:         'Why Use Almost Win?',
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
    settingsSubtitle: 'Customize your Almost Win experience.',
    soundTitle:       'Sound Effects',
    soundDesc:        'Enable or disable audio feedback for game events and interactions.',
    animTitle:        'Animations',
    animDesc:         'Enable or disable UI animations and transitions. Disable for better performance.',
    langTitle:        'Language',
    langDesc:         'Switch the application language.',
    appVersionTitle:  'App Version',
    appVersionDesc:   'Current release of Almost Win.',
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
  },

  id: {
    /* ---- App-wide ---- */
    appName:          'Almost Win',
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
    heroTitle:        'Almost Win',
    heroTagline:      'Rasakan ilusinya. Pelajari kenyataannya.',
    heroDesc:         'Jelajahi dunia perjudian melalui simulasi yang aman dan edukatif. Pahami mengapa bandar selalu menang — sebelum itu merugikan uang sungguhan Anda.',
    ctaButton:        'Mulai Simulasi',
    whyLabel:         'Mengapa Menggunakan Almost Win?',
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
    settingsSubtitle: 'Sesuaikan pengalaman Almost Win Anda.',
    soundTitle:       'Efek Suara',
    soundDesc:        'Aktifkan atau nonaktifkan umpan balik audio untuk peristiwa permainan dan interaksi.',
    animTitle:        'Animasi',
    animDesc:         'Aktifkan atau nonaktifkan animasi dan transisi UI. Nonaktifkan untuk performa lebih baik.',
    langTitle:        'Bahasa',
    langDesc:         'Ganti bahasa aplikasi.',
    appVersionTitle:  'Versi Aplikasi',
    appVersionDesc:   'Rilis terkini Almost Win.',
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
