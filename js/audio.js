/**
 * ================================================================
 * ALMOST WON — Audio System
 * js/audio.js
 *
 * Handles:
 *   - Background music (Backsound.mp3) — looping, independent toggle
 *   - Spin result sound — plays once after complete spin result
 *
 * Both settings are stored in localStorage and read from appState.settings:
 *   appState.settings.soundEffects    (boolean) — controls result sound
 *   appState.settings.backgroundMusic (boolean) — controls BGM
 *
 * Browser autoplay policy: music starts on first user interaction
 * if autoplay is blocked.
 * ================================================================
 */
'use strict';

/* ----------------------------------------------------------------
  AUDIO ASSET PATHS
   ---------------------------------------------------------------- */
const AUDIO_FILES = {
  bgm: 'assets/sounds/Backsound.mp3',

  // One sound file per spin resultType (from engine.js calculatePayout()).
  // Filename convention: PascalCase version of the resultType.
  // Rename/replace these paths if your actual files in assets/sounds
  // use different names — this object is the single source of truth.
  spinResult: {
    jackpot:   'assets/sounds/Jackpot.mp3',
    mega_win:  'assets/sounds/Mega_Win.mp3',
    big_win:   'assets/sounds/Big_Win.mp3',
    win:       'assets/sounds/Win.mp3',
    small_win: 'assets/sounds/Small_Win.mp3',
    partial:   'assets/sounds/Near_Miss_&_Partial.mp3',
    near_miss: 'assets/sounds/So_Close_&_No_Win.mp3', // existing file, kept as-is
    loss:      'assets/sounds/So_Close_&_No_Win.mp3',
  },
  // Used if a resultType has no entry above, or the entry fails to load.
  spinResultDefault: 'assets/sounds/So_Close_&_No_Win.mp3',
};

/* ----------------------------------------------------------------
  AUDIO STATE
   ---------------------------------------------------------------- */
const AudioSystem = (() => {
  let bgmAudio       = null;   // HTMLAudioElement for background music
  let bgmReady       = false;  // true once bgmAudio element is created
  let bgmBlocked     = false;  // true if browser blocked autoplay
  let interactionBound = false; // prevents duplicate listener binding

  // Cache of result-sound HTMLAudioElements, keyed by file path.
  // Lazily created so we only load the files that actually get used.
  const resultAudioCache = {};

  /* ---- Internal helpers ---- */

  function isBgmEnabled() {
    return !!(appState && appState.settings && appState.settings.backgroundMusic);
  }

  function isSoundEffectsEnabled() {
    return !!(appState && appState.settings && appState.settings.soundEffects);
  }

  /**
   * Create and configure the BGM audio element (once).
   */
  function ensureBgm() {
    if (bgmReady) return;
    try {
      bgmAudio = new Audio(AUDIO_FILES.bgm);
      bgmAudio.loop   = true;
      bgmAudio.volume = 0.4;
      bgmAudio.preload = 'auto';
      bgmReady = true;
    } catch (e) {
      console.warn('[Audio] Could not create BGM audio element:', e);
    }
  }

  /**
   * Get (or lazily create) the cached HTMLAudioElement for a given
   * result-sound file path.
   * @param {string} src
   * @returns {HTMLAudioElement|null}
   */
  function getResultAudio(src) {
    if (resultAudioCache[src]) return resultAudioCache[src];
    try {
      const el = new Audio(src);
      el.loop    = false;
      el.volume  = 0.8;
      el.preload = 'auto';
      resultAudioCache[src] = el;
      return el;
    } catch (e) {
      console.warn('[Audio] Could not create result audio element for', src, e);
      return null;
    }
  }

  /**
   * Preload every result sound so the first spin of each type doesn't
   * have extra latency waiting for the file to fetch.
   */
  function ensureAllResultSounds() {
    Object.values(AUDIO_FILES.spinResult).forEach(getResultAudio);
    getResultAudio(AUDIO_FILES.spinResultDefault);
  }

  /**
   * Attempt to play BGM. If browser blocks autoplay, register a
   * one-time interaction listener to start it later.
   */
  function tryPlayBgm() {
    ensureBgm();
    if (!bgmAudio || !isBgmEnabled()) return;

    const playPromise = bgmAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked — wait for first user interaction
        bgmBlocked = true;
        bindInteractionStart();
      });
    }
  }

  /**
   * Bind a one-time interaction listener so BGM starts after user
   * interaction when autoplay was blocked.
   */
  function bindInteractionStart() {
    if (interactionBound) return;
    interactionBound = true;

    const start = () => {
      if (bgmBlocked && isBgmEnabled() && bgmAudio && bgmAudio.paused) {
        bgmAudio.play().catch(() => {});
        bgmBlocked = false;
      }
      // Clean up all event types
      ['click', 'keydown', 'touchstart', 'pointerdown'].forEach(evt => {
        document.removeEventListener(evt, start, { capture: true });
      });
      interactionBound = false;
    };

    ['click', 'keydown', 'touchstart', 'pointerdown'].forEach(evt => {
      document.addEventListener(evt, start, { capture: true, once: true });
    });
  }

  /* ----------------------------------------------------------------
    PUBLIC API
     ---------------------------------------------------------------- */
  return {

    /**
     * Initialize the audio system.
     * Called once per page load (from sharedInit via applyAudioSettings).
     * Creates audio elements and starts BGM if enabled.
     */
    init() {
      ensureBgm();
      ensureAllResultSounds();
      this.applyBgm();
    },

    /**
     * Apply the current backgroundMusic setting:
     *   ON  → start/resume BGM
     *   OFF → pause BGM
     */
    applyBgm() {
      ensureBgm();
      if (!bgmAudio) return;

      if (isBgmEnabled()) {
        if (bgmAudio.paused) {
          tryPlayBgm();
        }
      } else {
        if (!bgmAudio.paused) {
          bgmAudio.pause();
        }
      }
    },

    /**
     * Play the spin result sound that matches the given resultType
     * (from engine.js's calculatePayout: 'jackpot' | 'mega_win' |
     * 'big_win' | 'win' | 'small_win' | 'partial' | 'near_miss' | 'loss').
     * Falls back to spinResultDefault if resultType is unknown.
     * Only plays if soundEffects setting is ON.
     * Safe to call multiple times — resets the audio before playing
     * so rapid calls don't stack or duplicate.
     * @param {string} resultType
     */
    playSpinResult(resultType) {
      if (!isSoundEffectsEnabled()) return;

      const src = AUDIO_FILES.spinResult[resultType] || AUDIO_FILES.spinResultDefault;
      const resultAudio = getResultAudio(src);
      if (!resultAudio) return;

      try {
        resultAudio.currentTime = 0;
        resultAudio.play().catch(() => {
          // Silently ignore — autoplay may still be restricted
        });
      } catch (e) {
        // Ignore playback errors gracefully
      }
    },

    /**
     * Toggle background music on/off.
     * Updates appState, persists, and applies immediately.
     * Called from the settings page toggle.
     * @param {boolean} enabled
     */
    setBgm(enabled) {
      appState.settings.backgroundMusic = enabled;
      persistSettings();
      this.applyBgm();
    },

    /**
     * Toggle sound effects on/off.
     * Updates appState and persists.
     * Called from the settings page toggle.
     * @param {boolean} enabled
     */
    setSoundEffects(enabled) {
      appState.settings.soundEffects = enabled;
      persistSettings();
    },
  };
})();