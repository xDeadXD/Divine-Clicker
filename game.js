/* ==========================================================================
   DIVINE CLICKER — POE 2 & FILTERBLADE LOOT ENGINE (game.js)
   Standalone HTML5 / Canvas 60FPS / Custom S-Tier Audio / Fast Reflex Mode
   ========================================================================== */

(() => {
  'use strict';

  const MAX_CLUTTER_STRIKES = 3;

  // ---------------------------------------------------------------------------
  // 1. BALANCED POE 2 CURRENCY LOOT TABLE (21 Official PoE2DB Currencies — Total Weight = 100.00)
  //    40% Valuable Drops (high-tempo dopamine + streak building) / 60% Clutter Hazards
  // ---------------------------------------------------------------------------
  const CURRENCY_TABLE = [
    // Low-Tier Bait / Clutter (60.0% total — Negative Points, 3 Clicks = Integrity Depleted)
    {
      id: 'scroll_wisdom',
      name: 'Scroll of Wisdom',
      tier: 'F',
      cssClass: 'tier-f',
      points: -20,
      weight: 19.0,
      beam: null,
      color: '#8c8270'
    },
    {
      id: 'orb_transmutation',
      name: 'Orb of Transmutation',
      tier: 'F',
      cssClass: 'tier-f',
      points: -10,
      weight: 15.0,
      beam: null,
      color: '#5b8dd9'
    },
    {
      id: 'orb_augmentation',
      name: 'Orb of Augmentation',
      tier: 'D',
      cssClass: 'tier-d',
      points: -15,
      weight: 12.0,
      beam: null,
      color: '#7aa690'
    },
    {
      id: 'armourers_scrap',
      name: "Armourer's Scrap",
      tier: 'D',
      cssClass: 'tier-d',
      points: -20,
      weight: 7.5,
      beam: null,
      color: '#9e978e'
    },
    {
      id: 'regal_shard',
      name: 'Regal Shard',
      tier: 'D',
      cssClass: 'tier-d',
      points: -20,
      weight: 6.5,
      beam: null,
      color: '#b89658'
    },

    // B-Tier Valuable Drops (18.0% total — White Beam)
    {
      id: 'orb_alchemy',
      name: 'Orb of Alchemy',
      tier: 'B',
      cssClass: 'tier-b',
      points: 20,
      weight: 5.0,
      beam: 'white',
      color: '#f0b464'
    },
    {
      id: 'vaal_orb',
      name: 'Vaal Orb',
      tier: 'B',
      cssClass: 'tier-b',
      points: 25,
      weight: 4.5,
      beam: 'white',
      color: '#f0b464'
    },
    {
      id: 'exalted_orb',
      name: 'Exalted Orb',
      tier: 'B',
      cssClass: 'tier-b',
      points: 30,
      weight: 8.5,
      beam: 'white',
      color: '#f0b464'
    },

    // A-Tier Valuable Drops (13.5% total — Yellow Beam)
    {
      id: 'gemcutters_prism',
      name: "Gemcutter's Prism",
      tier: 'A',
      cssClass: 'tier-a',
      points: 45,
      weight: 3.5,
      beam: 'yellow',
      color: '#f58b57'
    },
    {
      id: 'chaos_orb',
      name: 'Chaos Orb',
      tier: 'A',
      cssClass: 'tier-a',
      points: 50,
      weight: 4.4,
      beam: 'yellow',
      color: '#f58b57'
    },
    {
      id: 'orb_chance',
      name: 'Orb of Chance',
      tier: 'A',
      cssClass: 'tier-a',
      points: 65,
      weight: 3.0,
      beam: 'yellow',
      color: '#f58b57'
    },
    {
      id: 'greater_jewellers_orb',
      name: "Greater Jeweller's Orb",
      tier: 'A',
      cssClass: 'tier-a',
      points: 90,
      weight: 2.6,
      beam: 'yellow',
      color: '#f58b57'
    },

    // A+ Tier High-Value Drops (5.8% total — Red Beam)
    {
      id: 'greater_exalted_orb',
      name: 'Greater Exalted Orb',
      tier: 'A+',
      cssClass: 'tier-ap',
      points: 140,
      weight: 2.1,
      beam: 'red-a',
      color: '#f5695a'
    },
    {
      id: 'greater_chaos_orb',
      name: 'Greater Chaos Orb',
      tier: 'A+',
      cssClass: 'tier-ap',
      points: 140,
      weight: 2.1,
      beam: 'red-a',
      color: '#f5695a'
    },
    {
      id: 'orb_annulment',
      name: 'Orb of Annulment',
      tier: 'A+',
      cssClass: 'tier-ap',
      points: 180,
      weight: 1.6,
      beam: 'red-a',
      color: '#f5695a'
    },

    // S-Tier Flagship Drops (2.54% total — Towering Red Beam + S-Tier Sound)
    {
      id: 'divine_orb',
      name: 'Divine Orb',
      tier: 'S',
      cssClass: 'tier-s',
      points: 500,
      weight: 1.1,
      beam: 'red',
      color: '#ff1e1e'
    },
    {
      id: 'perfect_jewellers_orb',
      name: "Perfect Jeweller's Orb",
      tier: 'S',
      cssClass: 'tier-s',
      points: 550,
      weight: 0.76,
      beam: 'red',
      color: '#ff1e1e'
    },
    {
      id: 'perfect_exalted_orb',
      name: 'Perfect Exalted Orb',
      tier: 'S',
      cssClass: 'tier-s',
      points: 900,
      weight: 0.34,
      beam: 'red',
      color: '#ff1e1e'
    },
    {
      id: 'perfect_chaos_orb',
      name: 'Perfect Chaos Orb',
      tier: 'S',
      cssClass: 'tier-s',
      points: 900,
      weight: 0.34,
      beam: 'red',
      color: '#ff1e1e'
    },

    // S+ Tier Jackpot (0.12%)
    {
      id: 'hinekoras_lock',
      name: "Hinekora's Lock",
      tier: 'S+',
      cssClass: 'tier-sp',
      points: 2200,
      weight: 0.12,
      beam: 'red-mythic',
      color: '#ff0000'
    },

    // S++ Tier Mythic Jackpot (0.04%)
    {
      id: 'mirror_kalandra',
      name: 'Mirror of Kalandra',
      tier: 'S++',
      cssClass: 'tier-spp',
      points: 5000,
      weight: 0.04,
      beam: 'red-mythic',
      color: '#ff0000'
    }
  ];

  const TOTAL_WEIGHT = CURRENCY_TABLE.reduce((acc, item) => acc + item.weight, 0);

  function isSTierCurrency(c) {
    return Boolean(
      c && (c.cssClass === 'tier-s' || c.cssClass === 'tier-sp' || c.cssClass === 'tier-spp')
    );
  }

  // ---------------------------------------------------------------------------
  // 2. AUDIO & MECHANIC ICON LOADER (S-S++, A+, A-B custom MP3s, breach.webp, abyss.webp)
  // ---------------------------------------------------------------------------
  const customAudioCache = new Map();
  const mechanicIconCache = new Map();
  const currencyCanvasCache = new Map();

  function initAssetHotSwap() {
    // Load the 3 tier-specific drop sounds uploaded by user (all played at 100% volume)
    const tierSoundPaths = {
      s_tier: '/assets/aistudio/S-S___57e3b2ee.mp3',
      a_plus_tier: '/assets/aistudio/A__b835de96.mp3',
      a_b_tier: '/assets/aistudio/A-B_7c0c8a02.mp3'
    };

    Object.entries(tierSoundPaths).forEach(([key, src]) => {
      const clip = new Audio(src);
      clip.preload = 'auto';
      customAudioCache.set(key, clip);
    });

    // Load official PoE2DB Breach & Abyss Atlas icons
    const breachImg = new Image();
    breachImg.src = './assets/icons/breach.webp?v=27';
    mechanicIconCache.set('breach', breachImg);

    const abyssImg = new Image();
    abyssImg.src = './assets/icons/abyss.webp?v=27';
    mechanicIconCache.set('abyss', abyssImg);

    if (window.POE2_ASSET_MANIFEST && typeof window.POE2_ASSET_MANIFEST === 'object') {
      const { sounds = {} } = window.POE2_ASSET_MANIFEST;
      Object.entries(sounds).forEach(([key, src]) => {
        const audio = new Audio(src);
        audio.preload = 'auto';
        customAudioCache.set(key, audio);
      });
    }
  }

  class FilterBladeAudio {
    constructor() {
      this.ctx = null;
      this.muted = false;
      this.volume = 0.8;
      this.lastAPlusDropTime = 0;
      this.lastABDropTime = 0;
    }

    playClipAtFullVolume(key) {
      if (this.muted || this.volume <= 0) return false;
      if (!customAudioCache.has(key)) return false;
      try {
        const clip = customAudioCache.get(key).cloneNode();
        clip.volume = Math.min(1, this.volume);
        clip.play().catch(() => {});
        return true;
      } catch (_) {
        return false;
      }
    }

    // Plays S-S++ custom drop sound at 100% volume (never attenuated)
    playSTierDrop() {
      return this.playClipAtFullVolume('s_tier');
    }

    // Plays A+ custom drop sound at 100% volume
    playAPlusDrop() {
      if (this.muted || this.volume <= 0) return false;
      const now = performance.now();
      if (now - this.lastAPlusDropTime < 25) return false;
      this.lastAPlusDropTime = now;
      return this.playClipAtFullVolume('a_plus_tier');
    }

    // Plays A-B custom drop sound at 100% volume
    playBelowSTierDrop() {
      if (this.muted || this.volume <= 0) return false;
      const now = performance.now();
      // Slight 35ms debounce so simultaneous multi-orb drops in the same burst frame don't clip
      if (now - this.lastABDropTime < 35) return false;
      this.lastABDropTime = now;
      return this.playClipAtFullVolume('a_b_tier');
    }

    // Routes any currency drop to its exact tier MP3 (S-S++, A+, A-B) at 100% volume
    playDropForCurrency(currencyDef) {
      const fb = window.FilterBladeSpec;
      const key = fb && typeof fb.getDropSoundKey === 'function'
        ? fb.getDropSoundKey(currencyDef)
        : isSTierCurrency(currencyDef)
        ? 's_tier'
        : currencyDef && currencyDef.cssClass === 'tier-ap'
        ? 'a_plus_tier'
        : currencyDef && currencyDef.points > 0
        ? 'a_b_tier'
        : null;

      if (key === 's_tier') return this.playSTierDrop();
      if (key === 'a_plus_tier') return this.playAPlusDrop();
      if (key === 'a_b_tier') return this.playBelowSTierDrop();
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // 3. DOM REFERENCES & GAME STATE
  // ---------------------------------------------------------------------------
  const canvas = document.getElementById('vfx-canvas');
  const ctx = canvas.getContext('2d');
  const lootLayer = document.getElementById('loot-layer');
  const damageFlash = document.getElementById('damage-flash');

  // Asset-backed Top HUD
  const tabTimed = document.getElementById('tab-timed');
  const tabEndless = document.getElementById('tab-endless');
  const btnStartMap = document.getElementById('btn-start-map');
  const btnSummary = document.getElementById('btn-summary');
  const btnHelp = document.getElementById('btn-help');

  // Sliced Image Targets
  const imgBrandDivineOrb = document.getElementById('img-brand-divine-orb');
  const imgBrandEmblem = document.getElementById('img-brand-emblem');
  const imgTabTimed = document.getElementById('img-tab-timed');
  const imgTabEndless = document.getElementById('img-tab-endless');
  const imgBtnActivate = document.getElementById('img-btn-activate');
  const imgPlaque = document.getElementById('img-plaque');
  const imgStatBar = document.getElementById('img-stat-bar');
  const imgIconSpeaker = document.getElementById('img-icon-speaker');
  const imgIconList = document.getElementById('img-icon-list');
  const imgIconHelp = document.getElementById('img-icon-help');
  const imgScrollBanner = document.getElementById('img-scroll-banner');
  const imgBottomDock = document.getElementById('img-bottom-dock');
  const dockBreachSlot = document.getElementById('dock-breach-slot');
  const dockBreachLabel = document.getElementById('dock-breach-label');
  const imgDockBreach = document.getElementById('img-dock-breach');
  const dockAbyssSlot = document.getElementById('dock-abyss-slot');
  const dockAbyssLabel = document.getElementById('dock-abyss-label');
  const imgDockAbyss = document.getElementById('img-dock-abyss');
  const imgGauntlet = document.getElementById('img-gauntlet');

  // Central Astrolabe
  const astrolabeStage = document.getElementById('astrolabe-stage');
  const imgAstrolabeOuter = document.getElementById('img-astrolabe-outer');
  const imgAstrolabeMid = document.getElementById('img-astrolabe-mid');
  const imgAstrolabeCore = document.getElementById('img-astrolabe-core');

  // Plaque Dynamic Overlays & Gem Sockets
  const plaqueNameplate = document.getElementById('plaque-nameplate');
  const hudPlaqueTimer = document.getElementById('hud-plaque-timer');
  const plaqueIntegrityLabel = document.getElementById('plaque-integrity-label');
  const hudIntegrityCount = document.getElementById('hud-integrity-count');
  const socketSlots = [
    document.getElementById('socket-1'),
    document.getElementById('socket-2'),
    document.getElementById('socket-3')
  ];

  // Stat Bar Dynamic Cells
  const statCellScore = document.getElementById('stat-cell-score');
  const statCellBest = document.getElementById('stat-cell-best');
  const statCellStreak = document.getElementById('stat-cell-streak');
  const statCellAccuracy = document.getElementById('stat-cell-accuracy');

  const hudScore = document.getElementById('hud-score');
  const hudHighScore = document.getElementById('hud-highscore');
  const hudStreak = document.getElementById('hud-streak');
  const hudAccuracy = document.getElementById('hud-accuracy');
  const hudActiveCount = document.getElementById('hud-active-count');
  const liveFeed = document.getElementById('live-feed');

  // Dock Label Toggle & Audio Controls
  const btnToggleLabels = document.getElementById('btn-toggle-labels');
  const dockLabelsText = document.getElementById('dock-labels-text');
  const dockLabelsLed = document.getElementById('dock-labels-led');
  const btnMute = document.getElementById('btn-mute');
  const muteSlash = document.getElementById('mute-slash');
  const sliderVolume = document.getElementById('slider-volume');

  // Post-Map Summary Modal & Help Modal
  const summaryModal = document.getElementById('summary-modal');
  const summaryModalFrame = document.getElementById('summary-modal-frame');
  const imgModalFrame = document.getElementById('img-modal-frame');
  const modalTitlePlaque = document.getElementById('modal-title-plaque');
  const summaryModalContent = document.getElementById('summary-modal-content');
  const imgModalClose = document.getElementById('img-modal-close');
  const imgModalStatBar = document.getElementById('img-modal-stat-bar');
  const modalStatCells = [
    document.getElementById('modal-stat-cell-0'),
    document.getElementById('modal-stat-cell-1'),
    document.getElementById('modal-stat-cell-2'),
    document.getElementById('modal-stat-cell-3'),
    document.getElementById('modal-stat-cell-4')
  ];
  const imgLedgerHeader = document.getElementById('img-ledger-header');
  const modalLedgerHeaderCols = document.getElementById('modal-ledger-header-cols');
  const imgBtnReplay = document.getElementById('img-btn-replay');
  const imgBtnDismiss = document.getElementById('img-btn-dismiss');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalScore = document.getElementById('modal-score');
  const modalHighScore = document.getElementById('modal-highscore');
  const modalMaxStreak = document.getElementById('modal-max-streak');
  const modalStrikes = document.getElementById('modal-strikes');
  const modalAccuracy = document.getElementById('modal-accuracy');
  const breakdownTbody = document.getElementById('breakdown-tbody');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnModalReplay = document.getElementById('btn-modal-replay');
  const btnModalDismiss = document.getElementById('btn-modal-dismiss');

  const CURRENCY_ICON_PATHS = {
    mirror_kalandra: './assets/icons/currency/mirror_kalandra.webp',
    hinekoras_lock: './assets/icons/currency/hinekoras_lock.webp',
    perfect_chaos_orb: './assets/icons/currency/chaos_orb.webp',
    perfect_exalted_orb: './assets/icons/currency/exalted_orb.webp',
    perfect_jewellers_orb: './assets/icons/currency/perfect_jewellers_orb.webp',
    divine_orb: './assets/icons/currency/divine_orb.webp',
    orb_annulment: './assets/icons/currency/orb_annulment.webp',
    greater_chaos_orb: './assets/icons/currency/chaos_orb.webp',
    greater_exalted_orb: './assets/icons/currency/exalted_orb.webp',
    greater_jewellers_orb: './assets/icons/currency/greater_jewellers_orb.webp',
    orb_chance: './assets/icons/currency/orb_chance.webp',
    chaos_orb: './assets/icons/currency/chaos_orb.webp',
    gemcutters_prism: './assets/icons/currency/gemcutters_prism.webp',
    exalted_orb: './assets/icons/currency/exalted_orb.webp',
    vaal_orb: './assets/icons/currency/vaal_orb.webp',
    orb_alchemy: './assets/icons/currency/orb_alchemy.webp',
    armourers_scrap: './assets/icons/currency/armourers_scrap.webp',
    regal_shard: './assets/icons/currency/regal_shard.webp',
    orb_augmentation: './assets/icons/currency/orb_augmentation.webp',
    orb_transmutation: './assets/icons/currency/orb_transmutation.webp',
    scroll_wisdom: './assets/icons/currency/scroll_wisdom.webp'
  };

  const modalAssets = {
    backdropParts: null,
    rowBgUrl: '',
    rowLayout: null,
    tierBadges: new Map(),
    currencyIcons: new Map()
  };

  const helpModal = document.getElementById('help-modal');
  const btnCloseHelp = document.getElementById('btn-close-help');
  const btnHelpDismiss = document.getElementById('btn-help-dismiss');

  const STORAGE_KEY_HIGHSCORE = 'divine_clicker_poe2_highscore_v1';
  const audio = new FilterBladeAudio();

  const state = {
    running: false,
    mode: 'timed', // 'timed' (60s T16 Deli Map) or 'endless'
    mapDurationMs: 60000,
    elapsedMs: 0,
    labelsHidden: false,

    score: 0,
    highScore: Number(localStorage.getItem(STORAGE_KEY_HIGHSCORE) || 0),
    streak: 1.0,
    maxStreak: 1.0,
    validClicks: 0,
    clutterClicks: 0,
    breachHandsClasped: 0,

    nextItemId: 1,
    items: [], // Active ground/arcing currency drops
    particles: [],
    floatingTexts: [],
    groundRifts: [],
    breachHands: [],
    fogWisps: [],

    shakeTimeMs: 0,
    shakeMagnitude: 0,
    nextBurstInMs: 250,
    nextBreachHandInMs: 3600,

    // Per-currency statistics for Post-Map Loot Breakdown
    statsByCurrency: {}
  };

  function resetStatsByCurrency() {
    state.statsByCurrency = {};
    CURRENCY_TABLE.forEach((c) => {
      state.statsByCurrency[c.id] = {
        clicked: 0,
        missed: 0,
        netPoints: 0
      };
    });
  }
  resetStatsByCurrency();

  // ---------------------------------------------------------------------------
  // 4. CANVAS SIZING & WRAECLAST ENVIRONMENT INITIALIZATION
  // ---------------------------------------------------------------------------
  let viewWidth = 1280;
  let viewHeight = 720;

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    viewWidth = Math.max(320, Math.floor(rect.width));
    viewHeight = Math.max(240, Math.floor(rect.height));
    canvas.width = viewWidth;
    canvas.height = viewHeight;
  }

  function initFogWisps() {
    state.fogWisps = [];
    for (let i = 0; i < 18; i++) {
      state.fogWisps.push({
        x: Math.random() * viewWidth,
        y: Math.random() * viewHeight,
        radius: 90 + Math.random() * 140,
        vx: (Math.random() - 0.5) * 18,
        vy: -6 - Math.random() * 14,
        alpha: 0.03 + Math.random() * 0.05
      });
    }
  }

  window.addEventListener('resize', resizeCanvas);

  // ---------------------------------------------------------------------------
  // 5. [Z] LABEL TOGGLE CONTROL
  // ---------------------------------------------------------------------------
  function toggleLabelsHidden() {
    state.labelsHidden = !state.labelsHidden;
    document.body.classList.toggle('labels-hidden', state.labelsHidden);
    if (dockLabelsText) {
      dockLabelsText.textContent = state.labelsHidden ? 'LABELS: OFF' : 'LABELS: ON';
    }
    if (dockLabelsLed) {
      dockLabelsLed.classList.toggle('is-on', !state.labelsHidden);
      dockLabelsLed.classList.toggle('is-off', state.labelsHidden);
    }
    if (btnToggleLabels) {
      btnToggleLabels.classList.toggle('is-off', state.labelsHidden);
      btnToggleLabels.setAttribute('aria-pressed', String(!state.labelsHidden));
    }
    setFeed(
      state.labelsHidden
        ? 'Ground labels hidden ([Z]). Click loot beams or toggle LABELS: OFF to show labels.'
        : 'FilterBlade ground labels enabled (LABELS: ON).'
    );
  }

  // ---------------------------------------------------------------------------
  // 6. CURRENCY ROLLER, FAST BURST SPAWNER & ANTI-OVERLAP VERTICAL STACKING
  // ---------------------------------------------------------------------------
  function syncViewportSize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = Math.max(320, Math.floor(rect.width));
    const h = Math.max(240, Math.floor(rect.height));
    if (w !== viewWidth || h !== viewHeight || canvas.width !== w || canvas.height !== h) {
      viewWidth = w;
      viewHeight = h;
      canvas.width = w;
      canvas.height = h;
    }
  }

  function getPlayfieldSafeBounds() {
    syncViewportSize();
    const safeTop = Math.max(132, Math.round(viewHeight * 0.195));
    const safeBottom = Math.max(
      safeTop + 120,
      viewHeight - Math.max(150, Math.round(viewHeight * 0.22))
    );
    return {
      left: 115,
      right: Math.max(240, viewWidth - 115),
      top: safeTop,
      bottom: safeBottom
    };
  }

  function rollCurrency(bonusHighTier = false) {
    // Breach & Abyss encounters grant exciting elevated high-tier roll odds while preserving balance
    if (bonusHighTier && Math.random() < 0.68) {
      const highPool = CURRENCY_TABLE.filter((c) => c.points > 0);
      const getBoostedWeight = (c) =>
        isSTierCurrency(c) ? c.weight * 1.65 : c.tier === 'A+' ? c.weight * 1.35 : c.weight;
      const highWeight = highPool.reduce((sum, c) => sum + getBoostedWeight(c), 0);
      let r = Math.random() * highWeight;
      for (const item of highPool) {
        const w = getBoostedWeight(item);
        if (r < w) return item;
        r -= w;
      }
      return highPool[0];
    }

    let r = Math.random() * TOTAL_WEIGHT;
    for (const item of CURRENCY_TABLE) {
      if (r < item.weight) return item;
      r -= item.weight;
    }
    return CURRENCY_TABLE[0];
  }

  // Computes a guaranteed non-overlapping slot inside the safe playfield around (anchorX, anchorY)
  function resolveNonOverlappingLabelPosition(item) {
    const labelW = (item.el && item.el.offsetWidth) || item.width || 150;
    const labelH = (item.el && item.el.offsetHeight) || item.height || 30;
    item.width = labelW;
    item.height = labelH;

    const screenPadX = 18;
    const gapX = 10;
    const gapY = 6;
    const safe = getPlayfieldSafeBounds();
    const minX = Math.min(viewWidth * 0.5, screenPadX + labelW * 0.5);
    const maxX = Math.max(minX, viewWidth - screenPadX - labelW * 0.5);
    const minY = Math.max(labelH * 0.5 + 10, safe.top);
    const maxY = Math.max(minY, safe.bottom - labelH * 0.5);

    const clampX = (x) => Math.max(minX, Math.min(maxX, x));
    const clampY = (y) => Math.max(minY, Math.min(maxY, y));

    const baseX = clampX(item.anchorX);
    const baseY = clampY(item.anchorY - (labelH * 0.5 + 6));

    const activeOthers = state.items.filter(
      (other) => other.id !== item.id && !other.collected && other.slotReserved
    );

    const findCollider = (cx, cy) => {
      for (const other of activeOthers) {
        const ow = other.width || 150;
        const oh = other.height || 30;
        if (
          Math.abs(cx - other.labelX) < (labelW + ow) * 0.5 + gapX &&
          Math.abs(cy - other.labelY) < (labelH + oh) * 0.5 + gapY
        ) {
          return other;
        }
      }
      return null;
    };

    if (!findCollider(baseX, baseY)) {
      item.labelX = baseX;
      item.labelY = baseY;
      item.slotReserved = true;
      return;
    }

    const stepY = Math.max(24, Math.round(labelH + gapY));
    const stepX = Math.max(88, Math.round(labelW * 0.56 + gapX));
    const maxRings = Math.ceil(viewWidth / stepX) + 1;

    let bestX = baseX;
    let bestY = baseY;
    let bestDistSq = Infinity;
    let found = false;

    const seenX = new Set();
    const tryColumn = (cx) => {
      const rx = Math.round(cx);
      if (seenX.has(rx)) return;
      seenX.add(rx);

      const directHit = findCollider(cx, baseY);
      const ySeeds = directHit
        ? [
            directHit.labelY - (labelH + (directHit.height || 30)) * 0.5 - gapY,
            directHit.labelY + (labelH + (directHit.height || 30)) * 0.5 + gapY
          ]
        : [baseY];

      for (const seedY of ySeeds) {
        let hitSeed = false;
        for (let k = 0; k <= 16 && !hitSeed; k++) {
          const offsets = k === 0 ? [0] : [-k * stepY, k * stepY];
          for (const dy of offsets) {
            const cy = seedY + dy;
            if (cy < minY || cy > maxY) continue;
            if (!findCollider(cx, cy)) {
              const dSq = (cx - baseX) * (cx - baseX) + (cy - baseY) * (cy - baseY) * 1.1;
              if (dSq < bestDistSq) {
                bestDistSq = dSq;
                bestX = cx;
                bestY = cy;
                found = true;
              }
              hitSeed = true;
              break;
            }
          }
        }
      }
    };

    for (let ring = 0; ring <= maxRings; ring++) {
      if (ring === 0) {
        tryColumn(baseX);
        // Tight vertical stack directly above/below anchor is preferred without spreading sideways
        if (found && bestDistSq <= (stepY * 2.5) * (stepY * 2.5)) {
          item.labelX = bestX;
          item.labelY = bestY;
          item.slotReserved = true;
          return;
        }
      } else {
        tryColumn(clampX(baseX + ring * stepX));
        tryColumn(clampX(baseX - ring * stepX));
        if (found) break;
      }
    }

    // Fallback: full playfield grid sweep nearest to base coordinates
    if (!found) {
      const gxStep = Math.max(46, Math.round(labelW * 0.42));
      const gyStep = Math.max(22, Math.round(labelH * 0.72 + gapY));
      for (let y = minY; y <= maxY; y += gyStep) {
        for (let x = minX; x <= maxX; x += gxStep) {
          if (!findCollider(x, y)) {
            const dSq = (x - baseX) * (x - baseX) + (y - baseY) * (y - baseY);
            if (dSq < bestDistSq) {
              bestDistSq = dSq;
              bestX = x;
              bestY = y;
              found = true;
            }
          }
        }
      }
    }

    item.labelX = bestX;
    item.labelY = bestY;
    item.slotReserved = true;
  }

  function spawnCurrencyItem(originX, originY, currencyDef) {
    const id = state.nextItemId++;
    const angle = Math.random() * Math.PI * 2;
    const dist = 28 + Math.random() * 110;
    const safe = getPlayfieldSafeBounds();

    const anchorX = Math.max(
      safe.left,
      Math.min(safe.right, originX + Math.cos(angle) * dist)
    );
    const anchorY = Math.max(
      safe.top,
      Math.min(safe.bottom, originY + Math.sin(angle) * (dist * 0.72))
    );

    // Fast disappear lifetime: 1.4s to 1.8s on the ground
    const lifetimeMs = 1400 + Math.random() * 400;

    // Create FilterBlade DOM Label — ONLY ITEM NAME APPEARS (zero icons)
    const el = document.createElement('div');
    el.className = `loot-label ${currencyDef.cssClass}`;
    el.dataset.id = String(id);
    el.dataset.currency = currencyDef.id;
    el.dataset.tier = currencyDef.tier;
    el.textContent = currencyDef.name;

    const item = {
      id,
      currency: currencyDef,
      originX,
      originY,
      anchorX,
      anchorY,
      curX: originX,
      curY: originY,
      arcHeight: 38 + Math.random() * 28,
      arcDurationMs: 120, // Fast 120ms parabolic pop-up animation
      ageMs: 0,
      lifetimeMs,
      locked: false,
      slotReserved: false,
      hovered: false,
      collected: false,
      labelX: anchorX,
      labelY: anchorY - 22,
      width: 150,
      height: 30,
      el
    };

    // Pointer listeners on DOM label
    el.addEventListener('pointerdown', (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      handleItemClick(item);
    });
    el.addEventListener('pointerenter', () => {
      item.hovered = true;
    });
    el.addEventListener('pointerleave', () => {
      item.hovered = false;
    });

    lootLayer.appendChild(el);

    // Measure unscaled natural label dimensions & immediately reserve a guaranteed non-overlapping slot
    const naturalW = el.offsetWidth;
    const naturalH = el.offsetHeight;
    if (naturalW > 0 && naturalH > 0) {
      item.width = naturalW;
      item.height = naturalH;
    } else {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        item.width = rect.width;
        item.height = rect.height;
      }
    }

    state.items.push(item);
    resolveNonOverlappingLabelPosition(item);

    const tx = Math.round(item.labelX - item.width / 2);
    const ty = Math.round(item.labelY - item.height / 2);
    el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(0.84)`;

    // Play tier-specific custom drop sound (S-S++, A+, A-B) at 100% volume
    audio.playDropForCurrency(currencyDef);

    return item;
  }

  function spawnMonsterBurst(options = {}) {
    const safe = getPlayfieldSafeBounds();
    const centerX =
      options.x !== undefined
        ? Math.max(safe.left, Math.min(safe.right, options.x))
        : safe.left + Math.random() * Math.max(120, safe.right - safe.left);
    const centerY =
      options.y !== undefined
        ? Math.max(safe.top, Math.min(safe.bottom, options.y))
        : safe.top + Math.random() * Math.max(100, safe.bottom - safe.top);

    const isDeliriumFinale =
      state.mode === 'timed' && state.mapDurationMs - state.elapsedMs <= 20000;
    const count =
      options.count ||
      (isDeliriumFinale
        ? 5 + Math.floor(Math.random() * 4)
        : 4 + Math.floor(Math.random() * 4));

    const mechanic = options.mechanic || (options.breach ? 'breach' : Math.random() < 0.5 ? 'breach' : 'abyss');

    // Visual Breach / Abyss rift on the canvas ground
    state.groundRifts.push({
      x: centerX,
      y: centerY,
      radius: 12,
      maxRadius: 65 + count * 5,
      ageMs: 0,
      durationMs: 750,
      mechanic,
      color: mechanic === 'breach' ? '#c84bff' : '#4dc47d'
    });

    let guaranteedHigh = options.guaranteeHigh || false;
    if (!guaranteedHigh && Math.random() < 0.55) {
      guaranteedHigh = true;
    }

    for (let i = 0; i < count; i++) {
      let def;
      if (i === 0 && guaranteedHigh) {
        const highTierOnly = CURRENCY_TABLE.filter((c) => c.points > 0);
        const wTotal = highTierOnly.reduce((s, c) => s + c.weight, 0);
        let r = Math.random() * wTotal;
        def = highTierOnly[0];
        for (const cand of highTierOnly) {
          if (r < cand.weight) {
            def = cand;
            break;
          }
          r -= cand.weight;
        }
      } else {
        def = rollCurrency(options.breach);
      }
      spawnCurrencyItem(centerX, centerY, def);
    }

    updateHUD();
  }

  function spawnBreachHand(forcedType) {
    const safe = getPlayfieldSafeBounds();
    const x = safe.left + 30 + Math.random() * Math.max(100, safe.right - safe.left - 60);
    const y = safe.top + 20 + Math.random() * Math.max(90, safe.bottom - safe.top - 40);
    const mechanic = forcedType || (Math.random() < 0.5 ? 'breach' : 'abyss');
    state.breachHands.push({
      id: state.nextItemId++,
      x,
      y,
      radius: 28,
      mechanic,
      ageMs: 0,
      durationMs: 4200
    });
  }

  // ---------------------------------------------------------------------------
  // 7. ITEM CLICK, SCORING & 3-STRIKE GAME OVER LOOP (NO PICK-UP SOUNDS)
  // ---------------------------------------------------------------------------
  function handleItemClick(item) {
    if (!item || item.collected) return;

    item.collected = true;
    if (item.el && item.el.parentNode) {
      item.el.parentNode.removeChild(item.el);
    }
    const itemIdx = state.items.indexOf(item);
    if (itemIdx !== -1) {
      state.items.splice(itemIdx, 1);
    }

    const basePts = item.currency.points;
    const stats = state.statsByCurrency[item.currency.id];

    if (basePts > 0) {
      // High-Tier Valuable Currency Click!
      const awarded = Math.round(basePts * state.streak);
      state.score += awarded;
      state.validClicks++;

      // Advance streak (+0.1x per consecutive valid click, up to 5.0x)
      state.streak = Math.min(5.0, Math.round((state.streak + 0.1) * 10) / 10);
      if (state.streak > state.maxStreak) {
        state.maxStreak = state.streak;
      }

      if (stats) {
        stats.clicked++;
        stats.netPoints += awarded;
      }

      if (state.score > state.highScore) {
        state.highScore = Math.floor(state.score);
        localStorage.setItem(STORAGE_KEY_HIGHSCORE, String(state.highScore));
      }

      // VFX only on pickup (no pick-up sound)
      const isHighTier = isSTierCurrency(item.currency);
      if (isHighTier) {
        triggerScreenShake(220, 6);
      }

      spawnParticles(
        item.anchorX,
        item.anchorY,
        item.currency.color,
        isHighTier ? 28 : 16
      );
      spawnFloatingText(
        item.labelX,
        item.labelY,
        `+${awarded.toLocaleString()} (${state.streak.toFixed(1)}x)`,
        isHighTier ? '#ff3b3b' : '#ffd700',
        isHighTier ? 22 : 17
      );

      setFeed(`Collected ${item.currency.name} for +${awarded} pts! Streak: ${state.streak.toFixed(1)}x`);
      updateHUD();
    } else {
      // Low-Tier Clutter Misclick -> Deduct points, reset streak to 1.0x, add Strike (3 = Game Over!)
      state.score += basePts; // basePts is negative (-10, -15, -20)
      state.clutterClicks++;
      state.streak = 1.0;

      if (stats) {
        stats.clicked++;
        stats.netPoints += basePts;
      }

      triggerDamageFlash();
      triggerScreenShake(210, 6);
      spawnParticles(item.anchorX, item.anchorY, '#ff2e2e', 15);
      spawnFloatingText(
        item.labelX,
        item.labelY,
        `${basePts} STRIKE ${state.clutterClicks}/${MAX_CLUTTER_STRIKES}!`,
        '#ff4444',
        17
      );

      updateHUD();

      if (state.clutterClicks >= MAX_CLUTTER_STRIKES) {
        finishMapRun(
          `Game Over! Collected ${MAX_CLUTTER_STRIKES} Minus-Value Clutter Drops (${item.currency.name}).`
        );
        return;
      }

      setFeed(
        `Misclicked ${item.currency.name} (${basePts} pts)! Clutter Strike ${state.clutterClicks}/${MAX_CLUTTER_STRIKES} — Streak reset to 1.0x.`
      );
    }
  }

  function triggerDamageFlash() {
    damageFlash.classList.add('active');
    clearTimeout(triggerDamageFlash._timer);
    triggerDamageFlash._timer = setTimeout(() => {
      damageFlash.classList.remove('active');
    }, 190);
  }

  function triggerScreenShake(durationMs, magnitude) {
    state.shakeTimeMs = Math.max(state.shakeTimeMs, durationMs);
    state.shakeMagnitude = Math.max(state.shakeMagnitude, magnitude);
  }

  function spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 45 + Math.random() * 190;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 35,
        size: 2.5 + Math.random() * 3.5,
        color,
        ageMs: 0,
        durationMs: 360 + Math.random() * 220
      });
    }
  }

  function spawnFloatingText(x, y, text, color, fontSize = 17) {
    state.floatingTexts.push({
      x,
      y,
      text,
      color,
      fontSize,
      ageMs: 0,
      durationMs: 750
    });
  }

  // ---------------------------------------------------------------------------
  // 8. DIRECT CANVAS & ASTROLABE INTERACTION (BREACH/ABYSS, ASTROLABE, [Z] ORBS)
  // ---------------------------------------------------------------------------
  function getAstrolabeCenterAndRadius() {
    if (!astrolabeStage) {
      return { cx: viewWidth * 0.5, cy: viewHeight * 0.46, r: 160 };
    }
    const cRect = canvas.getBoundingClientRect();
    const aRect = astrolabeStage.getBoundingClientRect();
    return {
      cx: aRect.left - cRect.left + aRect.width * 0.5,
      cy: aRect.top - cRect.top + aRect.height * 0.5,
      r: Math.min(aRect.width, aRect.height) * 0.44
    };
  }

  function isPointInsideAstrolabe(x, y) {
    const { cx, cy, r } = getAstrolabeCenterAndRadius();
    const dx = x - cx;
    const dy = y - cy;
    return dx * dx + dy * dy <= r * r;
  }

  function triggerAstrolabePulse() {
    if (!astrolabeStage) return;
    astrolabeStage.classList.remove('astrolabe-pulse');
    void astrolabeStage.offsetWidth;
    astrolabeStage.classList.add('astrolabe-pulse');
    clearTimeout(triggerAstrolabePulse._timer);
    triggerAstrolabePulse._timer = setTimeout(() => {
      astrolabeStage.classList.remove('astrolabe-pulse');
    }, 220);

    const { cx, cy } = getAstrolabeCenterAndRadius();
    spawnParticles(cx, cy, '#f5d27b', 14);
  }

  function handleAstrolabeClick() {
    // Astrolabe is ONLY clickable while the Map Device is idle (not during an active map run)
    if (state.running) {
      return;
    }
    triggerAstrolabePulse();
    startMapRun();
  }

  canvas.addEventListener('pointermove', (ev) => {
    const rect = canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    let interactive = false;
    for (let i = state.breachHands.length - 1; i >= 0; i--) {
      const hand = state.breachHands[i];
      const dx = x - hand.x;
      const dy = y - hand.y;
      if (dx * dx + dy * dy <= (hand.radius + 14) * (hand.radius + 14)) {
        interactive = true;
        break;
      }
    }

    if (!interactive && state.labelsHidden) {
      for (let i = state.items.length - 1; i >= 0; i--) {
        const item = state.items[i];
        if (item.collected) continue;
        const dx = x - item.anchorX;
        const dy = y - item.anchorY;
        const hitBeam =
          item.currency.beam &&
          Math.abs(dx) <= 16 &&
          y <= item.anchorY + 12 &&
          y >= item.anchorY - 140;
        if (dx * dx + dy * dy <= 24 * 24 || hitBeam) {
          interactive = true;
          break;
        }
      }
    }

    if (!interactive && !state.running && isPointInsideAstrolabe(x, y)) {
      interactive = true;
    }

    canvas.style.cursor = interactive ? 'pointer' : 'crosshair';
  });

  canvas.addEventListener('pointerdown', (ev) => {
    const rect = canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;

    // 1. Check clickable Breach & Abyss nodes first
    for (let i = state.breachHands.length - 1; i >= 0; i--) {
      const hand = state.breachHands[i];
      const dx = x - hand.x;
      const dy = y - hand.y;
      if (dx * dx + dy * dy <= (hand.radius + 14) * (hand.radius + 14)) {
        const isAbyss = hand.mechanic === 'abyss';
        state.breachHands.splice(i, 1);
        state.breachHandsClasped++;
        triggerScreenShake(200, 5);
        spawnParticles(hand.x, hand.y, isAbyss ? '#4dc47d' : '#d946ef', 24);
        spawnFloatingText(
          hand.x,
          hand.y - 16,
          isAbyss ? 'ABYSS UNSEALED!' : 'BREACH OPENED!',
          isAbyss ? '#86efac' : '#e879f9',
          18
        );
        spawnMonsterBurst({
          x: hand.x,
          y: hand.y,
          count: 8,
          breach: true,
          mechanic: hand.mechanic,
          guaranteeHigh: true
        });
        setFeed(
          isAbyss
            ? 'Triggered an Abyss Trove! High-tier monster pack erupted!'
            : 'Clasped a Breach Hand! Massive high-tier monster pack erupted!'
        );
        return;
      }
    }

    // 2. When [Z] hides DOM labels, allow direct clicking on ground orbs / loot beams on <canvas>
    if (state.labelsHidden) {
      for (let i = state.items.length - 1; i >= 0; i--) {
        const item = state.items[i];
        if (item.collected) continue;
        const dx = x - item.anchorX;
        const dy = y - item.anchorY;
        const hitHorizontal = Math.abs(dx) <= 22;
        const hitVerticalBeam =
          item.currency.beam &&
          Math.abs(dx) <= 16 &&
          y <= item.anchorY + 12 &&
          y >= item.anchorY - 140;
        if (dx * dx + dy * dy <= 24 * 24 || (hitHorizontal && hitVerticalBeam)) {
          handleItemClick(item);
          return;
        }
      }
    }

    // 3. Central Astrolabe click: start map ONLY when idle (non-clickable while playing)
    if (!state.running && isPointInsideAstrolabe(x, y)) {
      handleAstrolabeClick();
    }
  });

  // ---------------------------------------------------------------------------
  // 9. MAP LIFECYCLE & HUD UPDATES
  // ---------------------------------------------------------------------------
  function setMapMode(nextMode) {
    if (nextMode !== 'timed' && nextMode !== 'endless') return;
    state.mode = nextMode;
    if (tabTimed) {
      const isTimed = nextMode === 'timed';
      tabTimed.classList.toggle('active', isTimed);
      tabTimed.setAttribute('aria-selected', String(isTimed));
    }
    if (tabEndless) {
      const isEndless = nextMode === 'endless';
      tabEndless.classList.toggle('active', isEndless);
      tabEndless.setAttribute('aria-selected', String(isEndless));
    }
    if (!state.running) {
      setFeed(
        nextMode === 'timed'
          ? 'T16 Delirium (60s) selected. Click ACTIVATE or the Astrolabe to begin.'
          : 'Endless Mapping selected. Click ACTIVATE or the Astrolabe to begin.'
      );
      updateHUD();
    } else {
      startMapRun();
    }
  }

  function startMapRun() {
    clearAllGroundItems();
    resetStatsByCurrency();

    state.running = true;
    state.elapsedMs = 0;
    state.score = 0;
    state.streak = 1.0;
    state.maxStreak = 1.0;
    state.validClicks = 0;
    state.clutterClicks = 0;
    state.breachHandsClasped = 0;
    state.nextBurstInMs = 120;
    state.nextBreachHandInMs = 2800;

    summaryModal.classList.add('hidden');
    if (helpModal) helpModal.classList.add('hidden');
    if (astrolabeStage) {
      astrolabeStage.classList.add('is-active-map');
      astrolabeStage.setAttribute('aria-disabled', 'true');
      astrolabeStage.tabIndex = -1;
    }
    if (btnStartMap) btnStartMap.classList.add('is-running');
    triggerAstrolabePulse();

    // Spawn an immediate opening pack around the Astrolabe
    const { cx, cy } = getAstrolabeCenterAndRadius();
    spawnMonsterBurst({
      x: cx,
      y: cy,
      count: 6,
      guaranteeHigh: true
    });

    setFeed(
      state.mode === 'timed'
        ? 'T16 Delirium Map opened! Fast drops — 3 minus-value clicks ends the run!'
        : 'Endless Mapping active! Fast drops — 3 minus-value clicks ends the run!'
    );
    updateHUD();
  }

  function finishMapRun(reasonText) {
    state.running = false;
    clearAllGroundItems();
    if (astrolabeStage) {
      astrolabeStage.classList.remove('is-active-map');
      astrolabeStage.setAttribute('aria-disabled', 'false');
      astrolabeStage.tabIndex = 0;
    }
    if (btnStartMap) btnStartMap.classList.remove('is-running');
    setFeed(reasonText || 'T16 Delirium Map Complete! All 60 seconds survived.');
    openSummaryModal(reasonText || 'T16 Delirium Map Complete');
    updateHUD();
  }

  function clearAllGroundItems() {
    state.items.forEach((item) => {
      if (item.el && item.el.parentNode) {
        item.el.parentNode.removeChild(item.el);
      }
    });
    state.items = [];
    state.breachHands = [];
    state.groundRifts = [];
  }

  function updateHUD() {
    const displayScore = Math.round(state.score);
    hudScore.textContent = displayScore.toLocaleString();
    hudScore.classList.toggle('stat-num-negative', displayScore < 0);
    hudHighScore.textContent = state.highScore.toLocaleString();
    hudStreak.textContent = `${state.streak.toFixed(1)}x`;

    const totalClicks = state.validClicks + state.clutterClicks;
    const acc = totalClicks > 0 ? Math.round((state.validClicks / totalClicks) * 100) : 100;
    hudAccuracy.textContent = `${acc}%`;
    hudActiveCount.textContent = String(state.items.length);

    // Update Winged Plaque Integrity Count & 3 Ruby Gem Sockets
    const remainingIntegrity = Math.max(0, MAX_CLUTTER_STRIKES - state.clutterClicks);
    if (hudIntegrityCount) {
      hudIntegrityCount.textContent = `${remainingIntegrity}/${MAX_CLUTTER_STRIKES}`;
    }
    socketSlots.forEach((slot, idx) => {
      if (slot) {
        slot.classList.toggle('empty', idx >= remainingIntegrity);
      }
    });

    // Update Winged Plaque Gold Nameplate Timer
    if (hudPlaqueTimer) {
      if (state.mode === 'timed') {
        const remMs = Math.max(0, state.mapDurationMs - state.elapsedMs);
        hudPlaqueTimer.textContent = `T16 DELIRIUM ${(remMs / 1000).toFixed(1)}S`;
        hudPlaqueTimer.classList.toggle('timer-urgent', state.running && remMs <= 15000);
      } else {
        hudPlaqueTimer.textContent = `ENDLESS ${(state.elapsedMs / 1000).toFixed(1)}S`;
        hudPlaqueTimer.classList.remove('timer-urgent');
      }
    }
  }

  function setFeed(msg) {
    if (liveFeed) {
      liveFeed.textContent = msg;
    }
  }

  function openSummaryModal(subtitleText) {
    const totalClicks = state.validClicks + state.clutterClicks;
    const acc = totalClicks > 0 ? Math.round((state.validClicks / totalClicks) * 100) : 100;
    const remainingIntegrity = Math.max(0, MAX_CLUTTER_STRIKES - state.clutterClicks);

    modalSubtitle.textContent = subtitleText || 'Post-Map Loot Breakdown';
    modalScore.textContent = Math.round(state.score).toLocaleString();
    modalHighScore.textContent = state.highScore.toLocaleString();
    modalMaxStreak.textContent = `${state.maxStreak.toFixed(1)}x`;
    modalStrikes.textContent = `${remainingIntegrity} / ${MAX_CLUTTER_STRIKES}`;
    modalAccuracy.textContent = `${acc}%`;

    const layout = modalAssets.rowLayout || [
      { left: 0.7, width: 4.5 },
      { left: 6.0, width: 26.4 },
      { left: 32.4, width: 9.8 },
      { left: 42.2, width: 13.4 },
      { left: 55.6, width: 13.4 },
      { left: 69.0, width: 13.4 },
      { left: 82.4, width: 16.2 }
    ];
    const rowBgStyle = modalAssets.rowBgUrl
      ? `background-image:url('${modalAssets.rowBgUrl}')`
      : '';

    // Populate all currencies ordered from S++ / S+ / S-Tier down to F-Tier
    const ordered = [...CURRENCY_TABLE].sort((a, b) => b.points - a.points);
    breakdownTbody.innerHTML = ordered
      .map((c) => {
        const st = state.statsByCurrency[c.id] || { clicked: 0, missed: 0, netPoints: 0 };
        const baseStr = c.points > 0 ? `+${c.points.toLocaleString()}` : String(c.points);
        const baseClass = c.points > 0 ? 'num-base-pos' : 'num-base-neg';
        const clickedClass = st.clicked > 0 ? 'num-count-active' : 'num-count-zero';
        const missedClass = st.missed > 0 ? 'num-count-active' : 'num-count-zero';
        const netClass =
          st.netPoints > 0 ? 'num-net-pos' : st.netPoints < 0 ? 'num-net-neg' : 'num-net-zero';
        const netStr =
          st.netPoints > 0
            ? `+${st.netPoints.toLocaleString()}`
            : st.netPoints.toLocaleString();

        const orbUrl = modalAssets.currencyIcons.get(c.id) || CURRENCY_ICON_PATHS[c.id] || '';
        const tierBadgeUrl = modalAssets.tierBadges.get(c.tier) || '';
        const tierTxtClass =
          c.tier === 'S++'
            ? 'tier-txt-spp'
            : c.tier === 'D' || c.tier === 'F'
            ? 'tier-txt-iron'
            : '';

        const c0 = layout[0];
        const c1 = layout[1];
        const c2 = layout[2];
        const c3 = layout[3];
        const c4 = layout[4];
        const c5 = layout[5];
        const c6 = layout[6];

        return `
          <div class="modal-ledger-row" role="row" data-currency-id="${c.id}" style="${rowBgStyle}">
            <div class="ledger-cell ledger-cell-socket" role="cell" style="left:${c0.left}%;width:${c0.width}%;">
              ${orbUrl ? `<img class="ledger-orb-img" src="${orbUrl}" alt="${c.name}" />` : ''}
            </div>
            <div class="ledger-cell ledger-cell-name" role="cell" style="left:${c1.left}%;width:${c1.width}%;">
              <span class="ledger-currency-name">${c.name}</span>
            </div>
            <div class="ledger-cell" role="cell" style="left:${c2.left}%;width:${c2.width}%;">
              <div class="ledger-tier-shield-wrap" aria-label="Tier ${c.tier}">
                ${tierBadgeUrl ? `<img class="ledger-tier-shield-img" src="${tierBadgeUrl}" alt="" aria-hidden="true" />` : ''}
                <span class="ledger-tier-shield-text ${tierTxtClass}">${c.tier}</span>
              </div>
            </div>
            <div class="ledger-cell ledger-num-cell ${baseClass}" role="cell" style="left:${c3.left}%;width:${c3.width}%;">${baseStr}</div>
            <div class="ledger-cell ledger-num-cell ${clickedClass}" role="cell" style="left:${c4.left}%;width:${c4.width}%;">${st.clicked}</div>
            <div class="ledger-cell ledger-num-cell ${missedClass}" role="cell" style="left:${c5.left}%;width:${c5.width}%;">${st.missed}</div>
            <div class="ledger-cell ledger-num-cell ${netClass}" role="cell" style="left:${c6.left}%;width:${c6.width}%;">${netStr}</div>
          </div>
        `;
      })
      .join('');

    summaryModal.classList.remove('hidden');
  }

  // ---------------------------------------------------------------------------
  // 10. 60 FPS GAME LOOP & HYBRID CANVAS + DOM RENDERER
  // ---------------------------------------------------------------------------
  let lastFrameTime = performance.now();

  function frameLoop(now) {
    syncViewportSize();
    const dtMs = Math.min(64, Math.max(1, now - lastFrameTime));
    lastFrameTime = now;

    updateSimulation(dtMs);
    renderCanvas(dtMs, now);

    requestAnimationFrame(frameLoop);
  }

  function updateSimulation(dtMs) {
    // 1. Active Map Timer & Rapid Wave Spawner
    if (state.running) {
      state.elapsedMs += dtMs;

      // Check 60s Timed Mode completion
      if (state.mode === 'timed' && state.elapsedMs >= state.mapDurationMs) {
        state.elapsedMs = state.mapDurationMs;
        finishMapRun('T16 Delirium Map Complete! All 60 seconds survived.');
        return;
      }

      // Fast Automatic Breach/Abyss Burst Waves (every 550–850ms; 400–620ms in final 20s)
      state.nextBurstInMs -= dtMs;
      if (state.nextBurstInMs <= 0) {
        const isFinale =
          state.mode === 'timed' && state.mapDurationMs - state.elapsedMs <= 20000;
        spawnMonsterBurst();
        state.nextBurstInMs = isFinale
          ? 400 + Math.random() * 220
          : 550 + Math.random() * 300;
      }

      // Spawn clickable Breach Hands occasionally
      state.nextBreachHandInMs -= dtMs;
      if (state.nextBreachHandInMs <= 0) {
        if (state.breachHands.length < 2) {
          spawnBreachHand();
        }
        state.nextBreachHandInMs = 4200 + Math.random() * 2000;
      }
    }

    // 2. Update Currency Drop Items (Fast 120ms Parabolic Arc -> Locked Stack Slot -> Fast 1.4-1.8s Despawn)
    for (let i = state.items.length - 1; i >= 0; i--) {
      const item = state.items[i];
      if (item.collected) {
        state.items.splice(i, 1);
        continue;
      }
      item.ageMs += dtMs;

      if (!item.locked) {
        const t = Math.min(1, item.ageMs / item.arcDurationMs);
        const arcZ = 4 * item.arcHeight * t * (1 - t); // Parabolic pop-up curve for canvas orb
        item.curX = item.originX + (item.anchorX - item.originX) * t;
        item.curY = item.originY + (item.anchorY - item.originY) * t - arcZ;

        if (t >= 1) {
          item.locked = true;
          item.curX = item.anchorX;
          item.curY = item.anchorY;
        }
      }

      // Check Despawn
      const totalAllowedMs = item.arcDurationMs + item.lifetimeMs;
      const remMs = totalAllowedMs - item.ageMs;

      if (remMs <= 300 && item.el) {
        item.el.classList.add('expiring-soon');
      }

      if (remMs <= 0) {
        // Item expired unclicked
        if (item.el && item.el.parentNode) {
          item.el.parentNode.removeChild(item.el);
        }
        if (state.running && !item.collected) {
          const st = state.statsByCurrency[item.currency.id];
          if (st) {
            st.missed++;
          }

          // Letting a High-Tier orb despawn resets streak to 1.0x and logs it as Missed
          if (item.currency.points > 0 && state.streak > 1.0) {
            state.streak = 1.0;
            spawnFloatingText(
              item.anchorX,
              item.anchorY - 14,
              `MISSED ${item.currency.name.toUpperCase()}! (1.0x)`,
              '#ff884d',
              14
            );
            setFeed(`Missed ${item.currency.name}! Streak reset to 1.0x.`);
          }
        }
        state.items.splice(i, 1);
        continue;
      }

      // Position hardware-accelerated DOM label at its reserved non-overlapping slot
      if (item.el) {
        const popScale =
          item.ageMs < item.arcDurationMs
            ? 0.84 + 0.16 * (item.ageMs / item.arcDurationMs)
            : 1;
        const tx = Math.round(item.labelX - item.width / 2);
        const ty = Math.round(item.labelY - item.height / 2);
        item.el.style.transform =
          popScale < 0.999
            ? `translate3d(${tx}px, ${ty}px, 0) scale(${popScale.toFixed(3)})`
            : `translate3d(${tx}px, ${ty}px, 0)`;
      }
    }

    // 3. Update Clickable Breach Hands
    for (let i = state.breachHands.length - 1; i >= 0; i--) {
      const hand = state.breachHands[i];
      hand.ageMs += dtMs;
      if (hand.ageMs >= hand.durationMs) {
        state.breachHands.splice(i, 1);
      }
    }

    // 4. Update Ground Rifts, Particles & Floating Combat Text
    for (let i = state.groundRifts.length - 1; i >= 0; i--) {
      const r = state.groundRifts[i];
      r.ageMs += dtMs;
      if (r.ageMs >= r.durationMs) state.groundRifts.splice(i, 1);
    }

    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.ageMs += dtMs;
      if (p.ageMs >= p.durationMs) {
        state.particles.splice(i, 1);
        continue;
      }
      p.x += (p.vx * dtMs) / 1000;
      p.y += (p.vy * dtMs) / 1000;
      p.vy += (280 * dtMs) / 1000;
    }

    for (let i = state.floatingTexts.length - 1; i >= 0; i--) {
      const ft = state.floatingTexts[i];
      ft.ageMs += dtMs;
      if (ft.ageMs >= ft.durationMs) {
        state.floatingTexts.splice(i, 1);
        continue;
      }
      ft.y -= (38 * dtMs) / 1000;
    }

    // 5. Update Screen Shake
    if (state.shakeTimeMs > 0) {
      state.shakeTimeMs = Math.max(0, state.shakeTimeMs - dtMs);
    }

    updateHUD();
  }

  function renderCanvas(dtMs, now) {
    ctx.save();
    ctx.clearRect(0, 0, viewWidth, viewHeight);

    // Apply screen shake if active
    if (state.shakeTimeMs > 0) {
      const sx = (Math.random() - 0.5) * state.shakeMagnitude * 2;
      const sy = (Math.random() - 0.5) * state.shakeMagnitude * 2;
      ctx.translate(sx, sy);
    }

    // Atlas map background and mix-blend-mode Astrolabe render seamlessly behind this transparent canvas.
    // 1. Subtle Drifting Delirium Wisps
    for (const wisp of state.fogWisps) {
      wisp.x += (wisp.vx * dtMs) / 1000;
      wisp.y += (wisp.vy * dtMs) / 1000;
      if (wisp.y + wisp.radius < 0) wisp.y = viewHeight + wisp.radius;
      if (wisp.x + wisp.radius < 0) wisp.x = viewWidth + wisp.radius;
      if (wisp.x - wisp.radius > viewWidth) wisp.x = -wisp.radius;

      const fg = ctx.createRadialGradient(wisp.x, wisp.y, 4, wisp.x, wisp.y, wisp.radius);
      fg.addColorStop(0, `rgba(148, 163, 184, ${wisp.alpha})`);
      fg.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.arc(wisp.x, wisp.y, wisp.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Breach / Abyss Monster Pop Rifts (with uploaded Breach & Abyss icons)
    for (const r of state.groundRifts) {
      const p = r.ageMs / r.durationMs;
      const rad = r.radius + (r.maxRadius - r.radius) * Math.sqrt(p);
      ctx.save();
      ctx.globalAlpha = Math.max(0, (1 - p) * 0.65);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, rad, rad * 0.58, 0, 0, Math.PI * 2);
      ctx.stroke();

      const iconImg = mechanicIconCache.get(r.mechanic || 'breach');
      const iconReady =
        iconImg &&
        (iconImg instanceof HTMLCanvasElement
          ? iconImg.width > 0
          : iconImg.complete && iconImg.naturalWidth > 0);
      if (iconReady) {
        const iconSize = 34;
        ctx.drawImage(iconImg, r.x - iconSize / 2, r.y - iconSize / 2, iconSize, iconSize);
      }
      ctx.restore();
    }

    // 4. Clickable Breach & Abyss Encounters on Ground (using uploaded breach.webp & abyss.webp)
    for (const hand of state.breachHands) {
      const isAbyss = hand.mechanic === 'abyss';
      const pulse = 0.88 + 0.16 * Math.sin(now * 0.008);
      ctx.save();
      const hg = ctx.createRadialGradient(
        hand.x,
        hand.y,
        3,
        hand.x,
        hand.y,
        hand.radius * 1.7 * pulse
      );
      if (isAbyss) {
        hg.addColorStop(0, 'rgba(134, 239, 172, 0.9)');
        hg.addColorStop(0.5, 'rgba(34, 197, 94, 0.45)');
        hg.addColorStop(1, 'rgba(20, 83, 45, 0)');
      } else {
        hg.addColorStop(0, 'rgba(240, 171, 252, 0.9)');
        hg.addColorStop(0.5, 'rgba(168, 85, 247, 0.45)');
        hg.addColorStop(1, 'rgba(88, 28, 135, 0)');
      }
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.arc(hand.x, hand.y, hand.radius * 1.7 * pulse, 0, Math.PI * 2);
      ctx.fill();

      const iconImg = mechanicIconCache.get(isAbyss ? 'abyss' : 'breach');
      const iconReady =
        iconImg &&
        (iconImg instanceof HTMLCanvasElement
          ? iconImg.width > 0
          : iconImg.complete && iconImg.naturalWidth > 0);
      if (iconReady) {
        const size = hand.radius * 1.85;
        ctx.drawImage(iconImg, hand.x - size / 2, hand.y - size / 2, size, size);
      }

      ctx.fillStyle = isAbyss ? '#dcfce7' : '#fae8ff';
      ctx.font = '700 11px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.fillText(isAbyss ? 'ABYSS' : 'BREACH', hand.x, hand.y + hand.radius + 14);
      ctx.restore();
    }

    // 5. NeverSink / FilterBlade PlayEffect Light Beams & Minimap Markers (Text + Beams ONLY — no ground orb icons)
    const fbSpec = window.FilterBladeSpec;

    const drawMinimapStar = (cx, cy, outerR, innerR, color) => {
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.stroke();
      ctx.restore();
    };

    for (const item of state.items) {
      const ax = item.anchorX;
      const ay = item.anchorY;
      const tierStyle = fbSpec ? fbSpec.getTierStyle(item.currency.cssClass) : null;
      const beamSpec = fbSpec ? fbSpec.getBeamSpec(item.currency.beam) : null;
      const isHoverBoost = item.hovered ? 1.25 : 1.0;

      // 5a. Volumetric ground light pool & PlayEffect vertical light beam
      if (beamSpec) {
        const [or, og, ob] = beamSpec.outerRgb;
        const [ir, ig, ib] = beamSpec.innerRgb;
        const shimmer = (0.86 + 0.14 * Math.sin(now * 0.011 + item.id * 1.7)) * isHoverBoost;
        const h = beamSpec.height * (item.hovered ? 1.08 : 1);

        // Elliptical ground light pool on the Atlas floor
        const poolGrad = ctx.createRadialGradient(
          ax,
          ay + 2,
          2,
          ax,
          ay + 2,
          beamSpec.groundRadiusX * (item.hovered ? 1.18 : 1)
        );
        poolGrad.addColorStop(0, `rgba(${or}, ${og}, ${ob}, ${Math.min(0.95, 0.72 * shimmer)})`);
        poolGrad.addColorStop(0.55, `rgba(${or}, ${og}, ${ob}, ${Math.min(0.68, 0.28 * shimmer)})`);
        poolGrad.addColorStop(1, `rgba(${or}, ${og}, ${ob}, 0)`);
        ctx.save();
        ctx.translate(ax, ay + 2);
        ctx.scale(1, beamSpec.groundRadiusY / beamSpec.groundRadiusX);
        ctx.fillStyle = poolGrad;
        ctx.beginPath();
        ctx.arc(0, 0, beamSpec.groundRadiusX * (item.hovered ? 1.18 : 1), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        // Outer soft tapered atmospheric shaft
        const outerGrad = ctx.createLinearGradient(ax, ay + 2, ax, ay - h);
        outerGrad.addColorStop(0, `rgba(${or}, ${og}, ${ob}, ${Math.min(0.95, 0.52 * shimmer)})`);
        outerGrad.addColorStop(0.35, `rgba(${or}, ${og}, ${ob}, ${Math.min(0.75, 0.28 * shimmer)})`);
        outerGrad.addColorStop(0.78, `rgba(${or}, ${og}, ${ob}, ${Math.min(0.35, 0.08 * shimmer)})`);
        outerGrad.addColorStop(1, `rgba(${or}, ${og}, ${ob}, 0)`);
        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.moveTo(ax - beamSpec.outerWidth * 0.54, ay + 2);
        ctx.lineTo(ax - beamSpec.outerWidth * 0.16, ay - h);
        ctx.lineTo(ax + beamSpec.outerWidth * 0.16, ay - h);
        ctx.lineTo(ax + beamSpec.outerWidth * 0.54, ay + 2);
        ctx.closePath();
        ctx.fill();

        // Crisp inner beam pillar
        const innerGrad = ctx.createLinearGradient(ax, ay + 2, ax, ay - h * 0.94);
        innerGrad.addColorStop(0, `rgba(${ir}, ${ig}, ${ib}, ${Math.min(1, 0.92 * shimmer)})`);
        innerGrad.addColorStop(0.45, `rgba(${ir}, ${ig}, ${ib}, ${Math.min(0.88, 0.52 * shimmer)})`);
        innerGrad.addColorStop(1, `rgba(${ir}, ${ig}, ${ib}, 0)`);
        ctx.fillStyle = innerGrad;
        ctx.beginPath();
        ctx.moveTo(ax - beamSpec.innerWidth * 0.5, ay + 2);
        ctx.lineTo(ax - beamSpec.innerWidth * 0.2, ay - h * 0.94);
        ctx.lineTo(ax + beamSpec.innerWidth * 0.2, ay - h * 0.94);
        ctx.lineTo(ax + beamSpec.innerWidth * 0.5, ay + 2);
        ctx.closePath();
        ctx.fill();

        // White-hot central core ray
        const coreGrad = ctx.createLinearGradient(ax, ay + 2, ax, ay - h * 0.86);
        coreGrad.addColorStop(0, beamSpec.coreHex);
        coreGrad.addColorStop(0.4, `rgba(${ir}, ${ig}, ${ib}, ${Math.min(0.95, 0.78 * shimmer)})`);
        coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = coreGrad;
        ctx.fillRect(ax - beamSpec.coreWidth / 2, ay - h * 0.86, beamSpec.coreWidth, h * 0.86 + 2);

        // Rising luminous light motes inside S-tier / A+ / A / B beams
        if (beamSpec.moteCount > 0) {
          for (let m = 0; m < beamSpec.moteCount; m++) {
            const phase = (now * 0.00055 + item.id * 0.37 + m / beamSpec.moteCount) % 1;
            const my = ay - phase * h * 0.86;
            const mx = ax + Math.sin(phase * 9 + item.id + m * 2.1) * (beamSpec.innerWidth * 0.52);
            const ma = Math.sin(phase * Math.PI) * 0.88;
            ctx.fillStyle = `rgba(255, 245, 230, ${ma.toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(mx, my, 1.3 + (1 - phase) * 1.15, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // 5b. Subtle tether if anti-overlap pushed the label away from its beam anchor
      if (item.locked && !state.labelsHidden && beamSpec) {
        const dx = item.labelX - ax;
        const dy = item.labelY + (item.height || 28) * 0.5 - ay;
        if (Math.hypot(dx, dy) > 36) {
          const [or, og, ob] = beamSpec.outerRgb;
          ctx.save();
          ctx.strokeStyle = `rgba(${or}, ${og}, ${ob}, 0.36)`;
          ctx.lineWidth = 1.15;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(item.labelX, item.labelY + (item.height || 28) * 0.45);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 5c. NeverSink Minimap Icon indicator anchored cleanly at the beam base
      if (beamSpec && tierStyle && tierStyle.minimapIcon && item.locked) {
        const icon = tierStyle.minimapIcon;
        const markerY = ay + 6;
        if (icon.shape === 'star') {
          drawMinimapStar(ax, markerY, 6.0, 2.6, icon.color);
        } else {
          const r = icon.size === 0 ? 4.2 : icon.size === 1 ? 3.6 : 3.0;
          ctx.save();
          ctx.fillStyle = icon.color;
          ctx.shadowColor = icon.color;
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(ax, markerY, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    // 6. Particle Bursts
    for (const p of state.particles) {
      const alpha = Math.max(0, 1 - p.ageMs / p.durationMs);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 7. Floating "+Pts" Combat Text
    for (const ft of state.floatingTexts) {
      const alpha = Math.max(0, 1 - ft.ageMs / ft.durationMs);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.font = `800 ${ft.fontSize}px Cinzel, Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.92)';
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }

    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // 11. KEYBOARD SHORTCUTS & UI EVENT LISTENERS
  // ---------------------------------------------------------------------------
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'z' || ev.key === 'Z') {
      toggleLabelsHidden();
    } else if (ev.key === 'm' || ev.key === 'M') {
      toggleMute();
    } else if (ev.key === 'Escape') {
      summaryModal.classList.add('hidden');
      if (helpModal) helpModal.classList.add('hidden');
    } else if (ev.code === 'Space' && document.activeElement === document.body) {
      ev.preventDefault();
      if (!state.running) {
        startMapRun();
      } else {
        spawnMonsterBurst({ guaranteeHigh: true });
      }
    }
  });

  if (tabTimed) {
    tabTimed.addEventListener('click', () => setMapMode('timed'));
  }
  if (tabEndless) {
    tabEndless.addEventListener('click', () => setMapMode('endless'));
  }

  btnStartMap.addEventListener('click', startMapRun);

  if (btnToggleLabels) {
    btnToggleLabels.addEventListener('click', toggleLabelsHidden);
  }

  if (astrolabeStage) {
    astrolabeStage.addEventListener('click', () => {
      handleAstrolabeClick();
    });
    astrolabeStage.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.code === 'Space') {
        ev.preventDefault();
        handleAstrolabeClick();
      }
    });
  }

  btnSummary.addEventListener('click', () => {
    openSummaryModal('Map Loot Breakdown');
  });

  btnCloseModal.addEventListener('click', () => {
    summaryModal.classList.add('hidden');
  });

  btnModalDismiss.addEventListener('click', () => {
    summaryModal.classList.add('hidden');
  });

  btnModalReplay.addEventListener('click', () => {
    summaryModal.classList.add('hidden');
    startMapRun();
  });

  summaryModal.addEventListener('click', (ev) => {
    if (ev.target === summaryModal) {
      summaryModal.classList.add('hidden');
    }
  });

  if (btnHelp && helpModal) {
    btnHelp.addEventListener('click', () => {
      helpModal.classList.remove('hidden');
    });
    if (btnCloseHelp) {
      btnCloseHelp.addEventListener('click', () => helpModal.classList.add('hidden'));
    }
    if (btnHelpDismiss) {
      btnHelpDismiss.addEventListener('click', () => helpModal.classList.add('hidden'));
    }
    helpModal.addEventListener('click', (ev) => {
      if (ev.target === helpModal) {
        helpModal.classList.add('hidden');
      }
    });
  }

  function syncMuteUI() {
    if (muteSlash) {
      muteSlash.classList.toggle('hidden', !audio.muted);
    }
  }

  function toggleMute() {
    audio.muted = !audio.muted;
    syncMuteUI();
  }

  btnMute.addEventListener('click', toggleMute);

  sliderVolume.addEventListener('input', () => {
    audio.volume = Number(sliderVolume.value) / 100;
    if (audio.volume > 0 && audio.muted) {
      audio.muted = false;
    } else if (audio.volume === 0) {
      audio.muted = true;
    }
    syncMuteUI();
  });

  // ---------------------------------------------------------------------------
  // 12. OFFSCREEN CANVAS SPRITE SHEET SLICER & TRANSPARENCY PROCESSOR
  // ---------------------------------------------------------------------------
  function loadImageAsset(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load UI asset: ${src}`));
      img.src = src;
    });
  }

  function imageToCanvas(img) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || img.width;
    c.height = img.naturalHeight || img.height;
    const cctx = c.getContext('2d', { willReadFrequently: true });
    cctx.drawImage(img, 0, 0);
    return { canvas: c, ctx: cctx, width: c.width, height: c.height };
  }

  function cropCanvasRegion(srcCanvas, rect) {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(rect.w));
    c.height = Math.max(1, Math.round(rect.h));
    const cctx = c.getContext('2d', { willReadFrequently: true });
    cctx.drawImage(
      srcCanvas,
      Math.round(rect.x),
      Math.round(rect.y),
      c.width,
      c.height,
      0,
      0,
      c.width,
      c.height
    );
    return c;
  }

  function findBandsY(imgData, maxY, isFgFn, minHeight = 8, mergeGap = 6) {
    const { width, height, data } = imgData;
    const limitY = Math.min(height, maxY);
    const activeRows = new Uint8Array(limitY);

    for (let y = 0; y < limitY; y++) {
      let rowActive = false;
      const rowOff = y * width * 4;
      for (let x = 0; x < width; x++) {
        const idx = rowOff + x * 4;
        if (isFgFn(data[idx], data[idx + 1], data[idx + 2], data[idx + 3])) {
          rowActive = true;
          break;
        }
      }
      activeRows[y] = rowActive ? 1 : 0;
    }

    const raw = [];
    let inRun = false;
    let start = 0;
    for (let y = 0; y < limitY; y++) {
      if (activeRows[y] && !inRun) {
        inRun = true;
        start = y;
      } else if (!activeRows[y] && inRun) {
        inRun = false;
        raw.push({ y0: start, y1: y - 1 });
      }
    }
    if (inRun) raw.push({ y0: start, y1: limitY - 1 });

    const merged = [];
    for (const seg of raw) {
      if (merged.length > 0 && seg.y0 - merged[merged.length - 1].y1 <= mergeGap) {
        merged[merged.length - 1].y1 = seg.y1;
      } else {
        merged.push({ ...seg });
      }
    }
    return merged.filter((b) => b.y1 - b.y0 + 1 >= minHeight);
  }

  function findIslandsX(imgData, y0, y1, isFgFn, minWidth = 6, mergeGap = 3) {
    const { width, height, data } = imgData;
    const top = Math.max(0, y0);
    const bot = Math.min(height - 1, y1);
    const activeCols = new Uint8Array(width);

    for (let x = 0; x < width; x++) {
      for (let y = top; y <= bot; y++) {
        const idx = (y * width + x) * 4;
        if (isFgFn(data[idx], data[idx + 1], data[idx + 2], data[idx + 3])) {
          activeCols[x] = 1;
          break;
        }
      }
    }

    const raw = [];
    let inRun = false;
    let start = 0;
    for (let x = 0; x < width; x++) {
      if (activeCols[x] && !inRun) {
        inRun = true;
        start = x;
      } else if (!activeCols[x] && inRun) {
        inRun = false;
        raw.push({ x0: start, x1: x - 1 });
      }
    }
    if (inRun) raw.push({ x0: start, x1: width - 1 });

    const merged = [];
    for (const seg of raw) {
      if (merged.length > 0 && seg.x0 - merged[merged.length - 1].x1 <= mergeGap) {
        merged[merged.length - 1].x1 = seg.x1;
      } else {
        merged.push({ ...seg });
      }
    }

    const boxes = [];
    for (const seg of merged) {
      if (seg.x1 - seg.x0 + 1 < minWidth) continue;
      const tight = tightTrimBox(imgData, seg.x0, top, seg.x1, bot, isFgFn);
      if (tight) boxes.push(tight);
    }
    return boxes;
  }

  function tightTrimBox(imgData, x0, y0, x1, y1, isFgFn) {
    const { width, data } = imgData;
    let minX = x1;
    let maxX = x0;
    let minY = y1;
    let maxY = y0;
    let found = false;

    for (let y = y0; y <= y1; y++) {
      const rowOff = y * width * 4;
      for (let x = x0; x <= x1; x++) {
        const idx = rowOff + x * 4;
        if (isFgFn(data[idx], data[idx + 1], data[idx + 2], data[idx + 3])) {
          found = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (!found) return null;
    return {
      x: minX,
      y: minY,
      w: maxX - minX + 1,
      h: maxY - minY + 1
    };
  }

  // Outer-connected BFS for removing #000000 backgrounds while protecting dark interior sockets
  function clearBlackBackgroundBFS(sliceCanvas, opts = {}) {
    const threshold = opts.threshold ?? 12;
    const featherThreshold = opts.featherHaloThreshold ?? 0;
    const unpremultiply = Boolean(opts.unpremultiply);
    const pad = opts.pad ?? 1;

    // Work on a 1px black-padded copy so touching outer edges always flood around
    const w = sliceCanvas.width + pad * 2;
    const h = sliceCanvas.height + pad * 2;
    const tmp = document.createElement('canvas');
    tmp.width = w;
    tmp.height = h;
    const tctx = tmp.getContext('2d', { willReadFrequently: true });
    tctx.fillStyle = '#000000';
    tctx.fillRect(0, 0, w, h);
    tctx.drawImage(sliceCanvas, pad, pad);

    const imgData = tctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const total = w * h;
    const visited = new Uint8Array(total);
    const queue = new Int32Array(total);
    let head = 0;
    let tail = 0;

    function pushIfBlack(px) {
      if (visited[px]) return;
      const off = px * 4;
      const maxC = Math.max(data[off], data[off + 1], data[off + 2]);
      if (maxC <= threshold) {
        visited[px] = 1;
        queue[tail++] = px;
      }
    }

    for (let x = 0; x < w; x++) {
      pushIfBlack(x);
      pushIfBlack((h - 1) * w + x);
    }
    for (let y = 1; y < h - 1; y++) {
      pushIfBlack(y * w);
      pushIfBlack(y * w + (w - 1));
    }

    while (head < tail) {
      const p = queue[head++];
      data[p * 4 + 3] = 0;
      const px = p % w;
      const py = (p - px) / w;
      if (px > 0) pushIfBlack(p - 1);
      if (px < w - 1) pushIfBlack(p + 1);
      if (py > 0) pushIfBlack(p - w);
      if (py < h - 1) pushIfBlack(p + w);
    }

    // Soften outer crimson/glow edge halo on buttons like ACTIVATE without leaving a dark box
    if (featherThreshold > threshold) {
      for (let i = 0; i < total; i++) {
        const off = i * 4;
        if (data[off + 3] === 0) continue;
        const maxC = Math.max(data[off], data[off + 1], data[off + 2]);
        if (maxC <= featherThreshold) {
          const px = i % w;
          const py = (i - px) / w;
          let touchesCleared = false;
          for (let dy = -1; dy <= 1 && !touchesCleared; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const nx = px + dx;
              const ny = py + dy;
              if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                if (data[(ny * w + nx) * 4 + 3] === 0) {
                  touchesCleared = true;
                  break;
                }
              }
            }
          }
          if (touchesCleared) {
            const alphaNorm = Math.max(0, Math.min(1, (maxC - threshold) / (featherThreshold - threshold)));
            data[off + 3] = Math.round(alphaNorm * 255);
            if (unpremultiply && alphaNorm > 0.06) {
              data[off] = Math.min(255, Math.round(data[off] / alphaNorm));
              data[off + 1] = Math.min(255, Math.round(data[off + 1] / alphaNorm));
              data[off + 2] = Math.min(255, Math.round(data[off + 2] / alphaNorm));
            }
          }
        }
      }
    }

    tctx.putImageData(imgData, 0, 0);
    const outCtx = sliceCanvas.getContext('2d');
    outCtx.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    outCtx.drawImage(tmp, pad, pad, sliceCanvas.width, sliceCanvas.height, 0, 0, sliceCanvas.width, sliceCanvas.height);
    return sliceCanvas;
  }

  function clearEnclosedBlackPockets(sliceCanvas, opts = {}) {
    const threshold = opts.threshold ?? 11;
    const xMin = Math.floor(sliceCanvas.width * (opts.xMinRatio ?? 0));
    const xMax = Math.ceil(sliceCanvas.width * (opts.xMaxRatio ?? 1));
    const sctx = sliceCanvas.getContext('2d', { willReadFrequently: true });
    const imgData = sctx.getImageData(0, 0, sliceCanvas.width, sliceCanvas.height);
    const data = imgData.data;

    for (let y = 0; y < sliceCanvas.height; y++) {
      for (let x = xMin; x < xMax; x++) {
        const off = (y * sliceCanvas.width + x) * 4;
        if (data[off + 3] === 0) continue;
        if (Math.max(data[off], data[off + 1], data[off + 2]) <= threshold) {
          data[off + 3] = 0;
        }
      }
    }
    sctx.putImageData(imgData, 0, 0);
    return sliceCanvas;
  }

  // Outer-connected BFS + anti-aliased fringe color decontamination for #FFFFFF sprite sheets
  function clearWhiteBackgroundBFS(sliceCanvas) {
    const pad = 1;
    const w = sliceCanvas.width + pad * 2;
    const h = sliceCanvas.height + pad * 2;
    const tmp = document.createElement('canvas');
    tmp.width = w;
    tmp.height = h;
    const tctx = tmp.getContext('2d', { willReadFrequently: true });
    tctx.fillStyle = '#ffffff';
    tctx.fillRect(0, 0, w, h);
    tctx.drawImage(sliceCanvas, pad, pad);

    const imgData = tctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const total = w * h;
    const visited = new Uint8Array(total);
    const queue = new Int32Array(total);
    let head = 0;
    let tail = 0;

    function isWhiteBg(off) {
      const r = data[off];
      const g = data[off + 1];
      const b = data[off + 2];
      const minC = Math.min(r, g, b);
      const maxC = Math.max(r, g, b);
      return minC >= 224 && maxC - minC <= 26;
    }

    function pushIfWhite(px) {
      if (visited[px]) return;
      if (isWhiteBg(px * 4)) {
        visited[px] = 1;
        queue[tail++] = px;
      }
    }

    for (let x = 0; x < w; x++) {
      pushIfWhite(x);
      pushIfWhite((h - 1) * w + x);
    }
    for (let y = 1; y < h - 1; y++) {
      pushIfWhite(y * w);
      pushIfWhite(y * w + (w - 1));
    }

    while (head < tail) {
      const p = queue[head++];
      data[p * 4 + 3] = 0;
      const px = p % w;
      const py = (p - px) / w;
      if (px > 0) pushIfWhite(p - 1);
      if (px < w - 1) pushIfWhite(p + 1);
      if (py > 0) pushIfWhite(p - w);
      if (py < h - 1) pushIfWhite(p + w);
    }

    // 2-pass anti-aliased white-fringe decontamination on border pixels
    for (let pass = 0; pass < 2; pass++) {
      const borderIndices = [];
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          const off = i * 4;
          if (data[off + 3] === 0) continue;
          let adjTransparent = false;
          for (let dy = -1; dy <= 1 && !adjTransparent; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              if (data[((y + dy) * w + (x + dx)) * 4 + 3] === 0) {
                adjTransparent = true;
                break;
              }
            }
          }
          if (!adjTransparent) continue;
          const r = data[off];
          const g = data[off + 1];
          const b = data[off + 2];
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const sat = Math.max(r, g, b) - Math.min(r, g, b);
          if (lum >= 148 && sat <= 38) {
            borderIndices.push(i);
          }
        }
      }

      for (const i of borderIndices) {
        const off = i * 4;
        const r = data[off];
        const g = data[off + 1];
        const b = data[off + 2];
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const alpha = Math.max(0, Math.min(1, (245 - lum) / 108));
        if (alpha <= 0.04) {
          data[off + 3] = 0;
        } else {
          data[off + 3] = Math.round(alpha * 255);
          data[off] = Math.max(0, Math.min(255, Math.round((r - 255 * (1 - alpha)) / alpha)));
          data[off + 1] = Math.max(0, Math.min(255, Math.round((g - 255 * (1 - alpha)) / alpha)));
          data[off + 2] = Math.max(0, Math.min(255, Math.round((b - 255 * (1 - alpha)) / alpha)));
        }
      }
    }

    tctx.putImageData(imgData, 0, 0);
    const outCtx = sliceCanvas.getContext('2d');
    outCtx.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    outCtx.drawImage(tmp, pad, pad, sliceCanvas.width, sliceCanvas.height, 0, 0, sliceCanvas.width, sliceCanvas.height);
    return sliceCanvas;
  }

  function applyPlaqueLayoutFromPixels(plaqueCanvas) {
    const w = plaqueCanvas.width;
    const h = plaqueCanvas.height;
    const pctx = plaqueCanvas.getContext('2d', { willReadFrequently: true });
    const data = pctx.getImageData(0, 0, w, h).data;

    // 1. Detect gold rectangular nameplate in upper-middle plaque area
    let npMinX = w;
    let npMaxX = 0;
    let npMinY = h;
    let npMaxY = 0;
    let npFound = false;
    const yNpLim = Math.floor(h * 0.43);
    const xNpStart = Math.floor(w * 0.18);
    const xNpEnd = Math.ceil(w * 0.82);

    for (let y = 0; y < yNpLim; y++) {
      for (let x = xNpStart; x < xNpEnd; x++) {
        const off = (y * w + x) * 4;
        if (data[off + 3] < 128) continue;
        const r = data[off];
        const g = data[off + 1];
        const b = data[off + 2];
        if (r >= 132 && g >= 102 && r - b >= 34 && b <= 125) {
          npFound = true;
          if (x < npMinX) npMinX = x;
          if (x > npMaxX) npMaxX = x;
          if (y < npMinY) npMinY = y;
          if (y > npMaxY) npMaxY = y;
        }
      }
    }

    if (npFound && npMaxX - npMinX > w * 0.25 && npMaxY - npMinY > 10) {
      const insetX = (npMaxX - npMinX) * 0.032;
      const insetY = (npMaxY - npMinY) * 0.15;
      plaqueNameplate.style.left = `${((npMinX + insetX) / w) * 100}%`;
      plaqueNameplate.style.top = `${((npMinY + insetY) / h) * 100}%`;
      plaqueNameplate.style.width = `${(((npMaxX - npMinX) - insetX * 2) / w) * 100}%`;
      plaqueNameplate.style.height = `${(((npMaxY - npMinY) - insetY * 2) / h) * 100}%`;
    }

    // 2. Locate exact dark charcoal lower cavity inside the metal borders first
    const xCenterStart = Math.floor(w * 0.42);
    const xCenterEnd = Math.ceil(w * 0.58);
    const rowAvgLum = (y, x0, x1) => {
      let sum = 0;
      let cnt = 0;
      for (let x = x0; x <= x1; x++) {
        const off = (y * w + x) * 4;
        if (data[off + 3] < 128) continue;
        sum += 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
        cnt++;
      }
      return cnt > 0 ? sum / cnt : 0;
    };

    const npBotY = npFound ? npMaxY : Math.round(h * 0.31);
    let innerTopY = Math.round(h * 0.42);
    let sawTopBar = false;
    for (let y = npBotY + 3; y < Math.floor(h * 0.56); y++) {
      const avg = rowAvgLum(y, xCenterStart, xCenterEnd);
      if (avg >= 50) {
        sawTopBar = true;
      } else if (sawTopBar && avg < 40) {
        innerTopY = y;
        break;
      }
    }

    // Locate actual bottom frame rim peak below the socket rings (y = 0.78h..0.90h)
    let botFramePeakY = Math.round(h * 0.83);
    let botFramePeakLum = -1;
    for (let y = Math.floor(h * 0.78); y <= Math.floor(h * 0.90); y++) {
      const avg = rowAvgLum(y, xCenterStart, xCenterEnd);
      if (avg > botFramePeakLum) {
        botFramePeakLum = avg;
        botFramePeakY = y;
      }
    }
    let innerBotY = botFramePeakY - 2;
    for (let y = botFramePeakY - 1; y >= innerTopY + Math.round(h * 0.25); y--) {
      if (rowAvgLum(y, xCenterStart, xCenterEnd) < 46) {
        innerBotY = y;
        break;
      }
    }

    // Scan left/right along open charcoal corridor just below top bar to find inner side walls
    const corrY0 = innerTopY + 2;
    const corrY1 = Math.min(innerBotY, innerTopY + Math.max(6, Math.round((innerBotY - innerTopY) * 0.16)));
    const colCorrLum = (x) => {
      let sum = 0;
      let cnt = 0;
      for (let y = corrY0; y <= corrY1; y++) {
        const off = (y * w + x) * 4;
        if (data[off + 3] < 128) continue;
        sum += 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
        cnt++;
      }
      return cnt > 0 ? sum / cnt : 0;
    };

    let innerLeftX = Math.round(w * 0.30);
    for (let x = Math.floor(w * 0.5); x >= Math.floor(w * 0.2); x--) {
      if (colCorrLum(x) >= 46) {
        innerLeftX = x + 1;
        break;
      }
    }
    let innerRightX = Math.round(w * 0.70);
    for (let x = Math.ceil(w * 0.5); x <= Math.ceil(w * 0.8); x++) {
      if (colCorrLum(x) >= 46) {
        innerRightX = x - 1;
        break;
      }
    }

    // Detect top & bottom metallic bezels of center socket (Circle 2) along plaque vertical centerline
    const symCenterX = npFound ? (npMinX + npMaxX) * 0.5 : w * 0.5;
    const cxInt = Math.round(symCenterX);
    const stripX0 = Math.max(0, cxInt - 2);
    const stripX1 = Math.min(w - 1, cxInt + 2);
    const boxH = innerBotY - innerTopY;
    const yStripStart = innerTopY + Math.max(6, Math.round(boxH * 0.12));
    const yStripEnd = innerBotY - 2;

    let topRimStart = -1;
    let topRimEnd = -1;
    for (let y = yStripStart; y <= yStripEnd; y++) {
      if (rowAvgLum(y, stripX0, stripX1) >= 52) {
        if (topRimStart === -1) topRimStart = y;
        topRimEnd = y;
      } else if (topRimStart !== -1) {
        break;
      }
    }

    let botRimStart = -1;
    let botRimEnd = -1;
    let sawWell = false;
    if (topRimEnd !== -1) {
      for (let y = topRimEnd + 1; y <= yStripEnd; y++) {
        const lum = rowAvgLum(y, stripX0, stripX1);
        if (!sawWell) {
          if (lum < 34) sawWell = true;
        } else if (lum >= 52) {
          if (botRimStart === -1) botRimStart = y;
          botRimEnd = y;
        } else if (botRimStart !== -1) {
          break;
        }
      }
    }

    if (topRimStart !== -1 && botRimEnd > topRimStart + 12) {
      const cy = (topRimStart + botRimEnd) * 0.5;
      const vertOuterDiam = botRimEnd - topRimStart + 1;
      const slotSize = vertOuterDiam + 2;

      // Scan horizontally through socket centers (yMid) to locate the 3 dark circular wells
      const yMid = Math.round(cy);
      const yMid0 = Math.max(0, yMid - 2);
      const yMid1 = Math.min(h - 1, yMid + 2);
      const scanX0 = innerLeftX + 4;
      const scanX1 = innerRightX - 4;
      const minWellW = Math.max(12, Math.round(vertOuterDiam * 0.45));

      const wells = [];
      let wStart = -1;
      for (let x = scanX0; x <= scanX1; x++) {
        let sum = 0;
        let cnt = 0;
        for (let y = yMid0; y <= yMid1; y++) {
          const off = (y * w + x) * 4;
          if (data[off + 3] < 128) continue;
          sum += 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
          cnt++;
        }
        const lum = cnt > 0 ? sum / cnt : 999;
        if (lum < 29) {
          if (wStart === -1) wStart = x;
        } else if (wStart !== -1) {
          if (x - wStart >= minWellW) wells.push({ l: wStart, r: x - 1 });
          wStart = -1;
        }
      }
      if (wStart !== -1 && (scanX1 + 1 - wStart) >= minWellW) {
        wells.push({ l: wStart, r: scanX1 });
      }

      const fallbackPitch = vertOuterDiam * 1.18;
      let centersX = [symCenterX - fallbackPitch, symCenterX, symCenterX + fallbackPitch];
      if (wells.length === 3) {
        const wc0 = (wells[0].l + wells[0].r) * 0.5;
        const wc1 = (wells[1].l + wells[1].r) * 0.5;
        const wc2 = (wells[2].l + wells[2].r) * 0.5;
        const cxMid = (symCenterX + wc1) * 0.5;
        const pitch = (wc2 - wc0) * 0.5;
        centersX = [cxMid - pitch, cxMid, cxMid + pitch];
      }

      centersX.forEach((cx, idx) => {
        const slot = socketSlots[idx];
        if (!slot) return;
        slot.style.left = `${((cx - slotSize * 0.5) / w) * 100}%`;
        slot.style.top = `${((cy - slotSize * 0.5) / h) * 100}%`;
        slot.style.width = `${(slotSize / w) * 100}%`;
        slot.style.height = `${(slotSize / h) * 100}%`;
      });

      // Center INTEGRITY X/3 cleanly inside the dark charcoal cavity between top steel border & socket rings
      if (plaqueIntegrityLabel) {
        const slotTopY = cy - slotSize * 0.5;
        const integCenterY = (innerTopY + slotTopY) * 0.5;
        plaqueIntegrityLabel.style.top = `${(integCenterY / h) * 100}%`;
        plaqueIntegrityLabel.style.transform = 'translateY(-50%)';
      }
    }
  }

  function applyStatBarCellsFromPixels(statCanvas) {
    const w = statCanvas.width;
    const h = statCanvas.height;
    const sctx = statCanvas.getContext('2d', { willReadFrequently: true });
    const data = sctx.getImageData(0, 0, w, h).data;

    // 1. Detect the 4 individual recessed cell X intervals separated by silver vertical divider walls
    const yBand0 = Math.floor(h * 0.46);
    const yBand1 = Math.ceil(h * 0.68);
    const isCellInteriorCol = new Uint8Array(w);
    for (let x = 0; x < w; x++) {
      let sumLum = 0;
      let maxLum = 0;
      let cnt = 0;
      for (let y = yBand0; y <= yBand1; y++) {
        const off = (y * w + x) * 4;
        if (data[off + 3] < 128) continue;
        const lum = 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
        sumLum += lum;
        if (lum > maxLum) maxLum = lum;
        cnt++;
      }
      if (cnt > 0 && sumLum / cnt < 40 && maxLum < 48) {
        isCellInteriorCol[x] = 1;
      }
    }

    const cellBoxes = [];
    let inRun = false;
    let runStart = 0;
    for (let x = 0; x < w; x++) {
      if (isCellInteriorCol[x] && !inRun) {
        inRun = true;
        runStart = x;
      } else if (!isCellInteriorCol[x] && inRun) {
        inRun = false;
        if (x - runStart >= w * 0.12) {
          cellBoxes.push({ x0: runStart, x1: x - 1 });
        }
      }
    }
    if (inRun && w - runStart >= w * 0.12) {
      cellBoxes.push({ x0: runStart, x1: w - 1 });
    }

    // 2. Measure exact vertical interior floor [headerEndY .. boxBotY] so numerals sit neatly below headers and above bottom border
    let topPct = 42;
    let heightPct = 34;
    if (cellBoxes.length === 4) {
      const sampleBox = cellBoxes[0];
      const sx0 = Math.floor(sampleBox.x0 + (sampleBox.x1 - sampleBox.x0) * 0.18);
      const sx1 = Math.ceil(sampleBox.x1 - (sampleBox.x1 - sampleBox.x0) * 0.18);

      let lastHeaderRow = Math.round(h * 0.42);
      for (let y = Math.floor(h * 0.22); y <= Math.floor(h * 0.48); y++) {
        for (let x = sx0; x <= sx1; x++) {
          const off = (y * w + x) * 4;
          const lum = 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
          if (lum >= 70) {
            lastHeaderRow = y;
            break;
          }
        }
      }

      let boxBotY = Math.round(h * 0.77);
      for (let y = Math.floor(h * 0.55); y <= Math.floor(h * 0.88); y++) {
        let sum = 0;
        let cnt = 0;
        for (let x = sx0; x <= sx1; x++) {
          const off = (y * w + x) * 4;
          sum += 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
          cnt++;
        }
        if (cnt > 0 && sum / cnt >= 42) {
          boxBotY = y - 1;
          break;
        }
      }

      const startY = Math.min(boxBotY - 8, lastHeaderRow + 2);
      topPct = (startY / h) * 100;
      heightPct = ((boxBotY - startY) / h) * 100;
    }

    const cells = [statCellScore, statCellBest, statCellStreak, statCellAccuracy];
    if (cellBoxes.length === 4) {
      cells.forEach((cell, idx) => {
        if (!cell) return;
        const b = cellBoxes[idx];
        cell.style.left = `${(b.x0 / w) * 100}%`;
        cell.style.width = `${((b.x1 - b.x0 + 1) / w) * 100}%`;
        cell.style.top = `${topPct}%`;
        cell.style.height = `${heightPct}%`;
      });
    } else {
      const intLeft = Math.round(w * 0.045);
      const cellW = (w * 0.905) / 4;
      cells.forEach((cell, idx) => {
        if (!cell) return;
        cell.style.left = `${((intLeft + idx * cellW) / w) * 100}%`;
        cell.style.width = `${(cellW / w) * 100}%`;
        cell.style.top = '43%';
        cell.style.height = '33%';
      });
    }
  }

  function applyDockLayoutFromPixels(dockCanvas) {
    const w = dockCanvas.width;
    const h = dockCanvas.height;
    const dctx = dockCanvas.getContext('2d', { willReadFrequently: true });
    const data = dctx.getImageData(0, 0, w, h).data;

    const yScan0 = Math.floor(h * 0.36);
    const yScan1 = Math.ceil(h * 0.64);
    const colFrac = (x, pred) => {
      let hits = 0;
      let total = 0;
      for (let y = yScan0; y <= yScan1; y++) {
        const off = (y * w + x) * 4;
        if (data[off + 3] < 128) continue;
        total++;
        if (pred(data[off], data[off + 1], data[off + 2])) hits++;
      }
      return total > 0 ? hits / total : 0;
    };

    // 1. Detect purple BREACH box and green ABYSS box directly by pill tint
    let breachLeft = -1;
    let breachRight = -1;
    for (let x = Math.floor(w * 0.14); x <= Math.ceil(w * 0.36); x++) {
      const f = colFrac(x, (r, g, b) => b >= g + 5 && r >= g + 2 && Math.max(r, b) >= 38);
      if (f >= 0.38) {
        if (breachLeft === -1) breachLeft = x;
        breachRight = x;
      }
    }

    let abyssLeft = -1;
    let abyssRight = -1;
    for (let x = Math.floor(w * 0.36); x <= Math.ceil(w * 0.60); x++) {
      const f = colFrac(x, (r, g, b) => g >= r + 14 && g >= b + 6 && g >= 55);
      if (f >= 0.35) {
        if (abyssLeft === -1) abyssLeft = x;
        abyssRight = x;
      }
    }

    const colSpanLum = (y, x0, x1) => {
      let sum = 0;
      let cnt = 0;
      for (let x = x0; x <= x1; x++) {
        const off = (y * w + x) * 4;
        if (data[off + 3] < 128) continue;
        sum += 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
        cnt++;
      }
      return cnt > 0 ? sum / cnt : 0;
    };

    const findSocketDarkWell = (xStart, xEnd) => {
      let bestStart = -1;
      let bestEnd = -1;
      let curStart = -1;
      const xLo = Math.max(0, Math.round(xStart));
      const xHi = Math.min(w - 1, Math.round(xEnd));
      for (let x = xLo; x <= xHi; x++) {
        let sum = 0;
        let cnt = 0;
        for (let y = yScan0; y <= yScan1; y++) {
          const off = (y * w + x) * 4;
          if (data[off + 3] < 128) continue;
          sum += 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
          cnt++;
        }
        const colLum = cnt > 0 ? sum / cnt : 999;
        if (colLum <= 27) {
          if (curStart === -1) curStart = x;
          if (x - curStart > bestEnd - bestStart) {
            bestStart = curStart;
            bestEnd = x;
          }
        } else {
          curStart = -1;
        }
      }
      if (bestStart !== -1 && bestEnd - bestStart >= Math.round(w * 0.035)) {
        return { cx: (bestStart + bestEnd) * 0.5, openW: bestEnd - bestStart + 1 };
      }
      return null;
    };

    const placeSlotInSocket = (slotEl, well) => {
      if (!slotEl || !well) return;
      const cxPx = well.cx;
      const midX0 = Math.max(0, Math.round(cxPx - 8));
      const midX1 = Math.min(w - 1, Math.round(cxPx + 8));
      let topOpenY = Math.round(h * 0.27);
      let botOpenY = Math.round(h * 0.74);
      for (let y = Math.floor(h * 0.5); y >= Math.floor(h * 0.16); y--) {
        if (colSpanLum(y, midX0, midX1) >= 28) {
          topOpenY = y + 1;
          break;
        }
      }
      for (let y = Math.ceil(h * 0.5); y <= Math.ceil(h * 0.84); y++) {
        if (colSpanLum(y, midX0, midX1) >= 28) {
          botOpenY = y - 1;
          break;
        }
      }
      const openH = Math.max(h * 0.36, Math.min(h * 0.52, botOpenY - topOpenY + 1));
      const innerSize = well.openW ? Math.min(well.openW, openH) : openH;
      const iconH = Math.min(h * 0.43, innerSize * 0.87);
      const cy = (topOpenY + botOpenY) * 0.5;
      slotEl.style.left = `${(cxPx / w) * 100}%`;
      slotEl.style.top = `${((cy - iconH * 0.5) / h) * 100}%`;
      slotEl.style.height = `${(iconH / h) * 100}%`;
    };

    const breachWell =
      breachLeft !== -1
        ? findSocketDarkWell(w * 0.04, breachLeft - 5) || { cx: w * 0.1196, openW: 0 }
        : { cx: w * 0.1196, openW: 0 };
    const abyssWell =
      breachRight !== -1 && abyssLeft > breachRight + w * 0.04
        ? findSocketDarkWell(breachRight + 5, abyssLeft - 5) || {
            cx: (breachRight + abyssLeft) * 0.5,
            openW: 0
          }
        : { cx: w * 0.3563, openW: 0 };

    placeSlotInSocket(dockBreachSlot, breachWell);
    placeSlotInSocket(dockAbyssSlot, abyssWell);

    if (!btnToggleLabels) return;

    // 2. Find leftmost blue frame/fill column of the PORTAL button ([0.68*w .. 0.80*w])
    let portalLeft = Math.round(w * 0.72);
    const yMid0 = Math.floor(h * 0.30);
    const yMid1 = Math.ceil(h * 0.70);
    for (let x = Math.floor(w * 0.68); x < Math.ceil(w * 0.80); x++) {
      let blueHits = 0;
      for (let y = yMid0; y <= yMid1; y++) {
        const off = (y * w + x) * 4;
        if (data[off + 3] > 128 && data[off + 2] - data[off] >= 8 && data[off + 2] >= 45) {
          blueHits++;
        }
      }
      if (blueHits >= 12) {
        portalLeft = x;
        break;
      }
    }

    // 3. Detect the horizontal top & bottom metallic bezel rows of the LABELS: ON plate
    const scanX0 = abyssRight !== -1 ? Math.max(Math.floor(w * 0.555), abyssRight + 3) : Math.floor(w * 0.555);
    const scanX1 = Math.max(scanX0 + 10, portalLeft - 3);
    const isBezelPixel = (off) => {
      if (data[off + 3] < 128) return false;
      const lum = 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
      return lum >= 54;
    };

    let topBorderY = Math.round(h * 0.33);
    let topMaxCount = 0;
    for (let y = Math.floor(h * 0.26); y <= Math.floor(h * 0.44); y++) {
      let cnt = 0;
      for (let x = scanX0; x <= scanX1; x++) {
        if (isBezelPixel((y * w + x) * 4)) cnt++;
      }
      if (cnt > topMaxCount) {
        topMaxCount = cnt;
        topBorderY = y;
      }
    }

    let botBorderY = Math.round(h * 0.69);
    let botMaxCount = 0;
    for (let y = Math.floor(h * 0.56); y <= Math.floor(h * 0.75); y++) {
      let cnt = 0;
      for (let x = scanX0; x <= scanX1; x++) {
        if (isBezelPixel((y * w + x) * 4)) cnt++;
      }
      if (cnt > botMaxCount) {
        botMaxCount = cnt;
        botBorderY = y;
      }
    }

    let lMinX = scanX1;
    let lMaxX = scanX0;
    for (let x = scanX0; x <= scanX1; x++) {
      let onBorder = false;
      for (let dy = -2; dy <= 2; dy++) {
        const yt = Math.max(0, Math.min(h - 1, topBorderY + dy));
        const yb = Math.max(0, Math.min(h - 1, botBorderY + dy));
        if (isBezelPixel((yt * w + x) * 4) || isBezelPixel((yb * w + x) * 4)) {
          onBorder = true;
          break;
        }
      }
      if (onBorder) {
        if (x < lMinX) lMinX = x;
        if (x > lMaxX) lMaxX = x;
      }
    }

    const detectedW = lMaxX - lMinX + 1;
    const detectedH = botBorderY - topBorderY + 1;
    if (topMaxCount >= 20 && botMaxCount >= 20 && detectedW >= w * 0.11 && detectedW <= w * 0.18 && detectedH >= h * 0.24) {
      btnToggleLabels.style.left = `${(lMinX / w) * 100}%`;
      btnToggleLabels.style.top = `${(topBorderY / h) * 100}%`;
      btnToggleLabels.style.width = `${(detectedW / w) * 100}%`;
      btnToggleLabels.style.height = `${(detectedH / h) * 100}%`;
    } else {
      btnToggleLabels.style.left = '56.1%';
      btnToggleLabels.style.top = '34.5%';
      btnToggleLabels.style.width = '15.4%';
      btnToggleLabels.style.height = '34.5%';
    }
  }

  function buildAstrolabeLayers(astrolabeImg) {
    const w = astrolabeImg.naturalWidth || astrolabeImg.width;
    const h = astrolabeImg.naturalHeight || astrolabeImg.height;
    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = w;
    srcCanvas.height = h;
    const sctx = srcCanvas.getContext('2d', { willReadFrequently: true });
    sctx.drawImage(astrolabeImg, 0, 0);
    const srcData = sctx.getImageData(0, 0, w, h).data;

    const makeLayer = (maskFn) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const cctx = c.getContext('2d');
      const out = cctx.createImageData(w, h);
      const od = out.data;
      const cx = w * 0.5;
      const cy = h * 0.5;

      for (let y = 0; y < h; y++) {
        const dy = y - cy;
        for (let x = 0; x < w; x++) {
          const dx = x - cx;
          const rn = Math.sqrt(dx * dx + dy * dy) / w;
          const weight = maskFn(rn);
          if (weight <= 0) continue;
          const off = (y * w + x) * 4;
          const r = srcData[off];
          const g = srcData[off + 1];
          const b = srcData[off + 2];
          // Suppress faint JPEG black floor noise so mix-blend-mode: screen is 100% seamless
          if (Math.max(r, g, b) <= 10) continue;
          const clean = (v) => Math.max(0, Math.round(((v - 6) / 249) * 255 * weight));
          od[off] = clean(r);
          od[off + 1] = clean(g);
          od[off + 2] = clean(b);
          od[off + 3] = 255;
        }
      }
      cctx.putImageData(out, 0, 0);
      return c.toDataURL('image/png');
    };

    const smoothStep = (edge0, edge1, x) => {
      const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
      return t * t * (3 - 2 * t);
    };

    const f = 0.006;
    if (imgAstrolabeOuter) {
      imgAstrolabeOuter.src = makeLayer((rn) => smoothStep(0.312 - f, 0.312 + f, rn));
    }
    if (imgAstrolabeMid) {
      imgAstrolabeMid.src = makeLayer(
        (rn) =>
          smoothStep(0.146 - f, 0.146 + f, rn) *
          (1 - smoothStep(0.318 - f, 0.318 + f, rn))
      );
    }
    if (imgAstrolabeCore) {
      imgAstrolabeCore.src = makeLayer((rn) => 1 - smoothStep(0.152 - f, 0.152 + f, rn));
    }
  }

  function trimCanvasByAlpha(srcCanvas, minAlpha = 22) {
    const ctxTmp = srcCanvas.getContext('2d', { willReadFrequently: true });
    const imgData = ctxTmp.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
    const tight = tightTrimBox(imgData, 0, 0, srcCanvas.width - 1, srcCanvas.height - 1, (_r, _g, _b, a) => a >= minAlpha);
    return tight ? cropCanvasRegion(srcCanvas, tight) : srcCanvas;
  }

  function processCurrencyIconCanvas(img) {
    const raw = imageToCanvas(img);
    const w = raw.width;
    const h = raw.height;
    const data = raw.ctx.getImageData(0, 0, w, h).data;
    const corners = [
      0,
      (w - 1) * 4,
      ((h - 1) * w) * 4,
      ((h - 1) * w + (w - 1)) * 4
    ];
    let transparentCorners = 0;
    let darkCorners = 0;
    let whiteCorners = 0;
    for (const off of corners) {
      const r = data[off];
      const g = data[off + 1];
      const b = data[off + 2];
      const a = data[off + 3];
      if (a <= 24) transparentCorners++;
      else if (Math.max(r, g, b) <= 18) darkCorners++;
      else if (Math.min(r, g, b) >= 220) whiteCorners++;
    }
    if (transparentCorners < 2) {
      if (darkCorners >= 2) {
        clearBlackBackgroundBFS(raw.canvas, {
          threshold: 14,
          featherHaloThreshold: 26,
          unpremultiply: true
        });
      } else if (whiteCorners >= 2) {
        clearWhiteBackgroundBFS(raw.canvas);
      }
    }
    return trimCanvasByAlpha(raw.canvas, 18);
  }

  function buildTieredCurrencyCanvas(baseCanvas, variantTier) {
    // Only tiered Exalted/Chaos variants share a base sprite in PoE 2; Perfect/Greater Jeweller's Orbs
    // have their own distinct official PoE2DB icons and return 'base' (never receive a synthetic numeral).
    if (variantTier !== 'greater' && variantTier !== 'perfect') {
      return baseCanvas;
    }
    const size = Math.max(baseCanvas.width, baseCanvas.height, 96);
    const out = document.createElement('canvas');
    out.width = size;
    out.height = size;
    const octx = out.getContext('2d');
    const isPerfect = variantTier === 'perfect';

    // Draw pure, unmodified official PoE2DB orb art cleanly centered
    const pad = Math.round(size * 0.04);
    const drawSize = size - pad * 2;
    octx.drawImage(baseCanvas, pad, pad, drawSize, drawSize);

    // Subtle in-game PoE 2 carved Roman numeral (II = Greater, III = Perfect) without artificial circle badges
    const glyph = isPerfect ? 'III' : 'II';
    octx.save();
    octx.font = `700 ${Math.round(size * 0.25)}px "Fontin SmallCaps", Cinzel, Georgia, serif`;
    octx.textAlign = 'right';
    octx.textBaseline = 'bottom';
    octx.lineWidth = Math.max(3, size * 0.045);
    octx.strokeStyle = 'rgba(8, 6, 5, 0.96)';
    octx.lineJoin = 'round';
    const gx = size - Math.round(size * 0.05);
    const gy = size - Math.round(size * 0.03);
    octx.strokeText(glyph, gx, gy);
    octx.fillStyle = isPerfect ? '#f7d886' : '#e6d6b5';
    octx.fillText(glyph, gx, gy);
    octx.restore();

    return out;
  }

  // 3-slice horizontal parchment scroll keeping sculpted bronze & iron rollers unstretched
  // while mirror-tiling crisp aged Wraeclast parchment across a sleek ~8.3:1 wide banner
  function buildWideScrollBannerCanvas(scrollImg) {
    const isFgBlack = (r, g, b) => Math.max(r, g, b) > 14;
    const sheet = imageToCanvas(scrollImg);
    const imgData = sheet.ctx.getImageData(0, 0, sheet.width, sheet.height);
    const box = tightTrimBox(imgData, 0, 0, sheet.width - 1, sheet.height - 1, isFgBlack);
    if (!box) return null;

    const trimmed = cropCanvasRegion(sheet.canvas, box);
    clearBlackBackgroundBFS(trimmed, {
      threshold: 14,
      featherHaloThreshold: 24,
      unpremultiply: true
    });

    const sw = trimmed.width;
    const sh = trimmed.height;
    const dstH = 140;
    const dstW = 1160;
    const scaleY = dstH / sh;

    // Keep each hammered-bronze & iron gothic roller cap unstretched (1:1 aspect ratio)
    const capSrcW = Math.round(sw * 0.148);
    const capDstW = Math.max(36, Math.round(capSrcW * scaleY));

    const out = document.createElement('canvas');
    out.width = dstW;
    out.height = dstH;
    const octx = out.getContext('2d');

    // Seamlessly tile middle weathered parchment at crisp ~1.28x natural scale with alternating horizontal mirrors
    const innerPadSrc = Math.round(sw * 0.035);
    const tileSrcX = capSrcW + innerPadSrc;
    const tileSrcW = Math.max(120, sw - 2 * (capSrcW + innerPadSrc));
    const tileDstW = Math.max(160, Math.round(tileSrcW * scaleY * 1.28));

    const midStart = capDstW - 4;
    const midEnd = dstW - capDstW + 4;
    const midSpan = midEnd - midStart;

    // Offscreen middle parchment strip so rollers layer crisply over both parchment ends
    const midCanvas = document.createElement('canvas');
    midCanvas.width = midSpan;
    midCanvas.height = dstH;
    const mctx = midCanvas.getContext('2d');

    const tileCount = Math.ceil(midSpan / (tileDstW - 28)) + 1;
    const stepX = tileDstW - 28;
    for (let i = 0; i < tileCount; i++) {
      const dx = i * stepX;
      const tileC = document.createElement('canvas');
      tileC.width = tileDstW;
      tileC.height = dstH;
      const tctx = tileC.getContext('2d');
      tctx.save();
      if (i % 2 === 1) {
        tctx.translate(tileDstW, 0);
        tctx.scale(-1, 1);
      }
      tctx.drawImage(trimmed, tileSrcX, 0, tileSrcW, sh, 0, 0, tileDstW, dstH);
      tctx.restore();

      // Feather left 28px of subsequent tiles in a single destination-in pass so the entire tile stays visible
      if (i > 0) {
        const stopFrac = Math.min(0.45, 28 / tileDstW);
        const fade = tctx.createLinearGradient(0, 0, tileDstW, 0);
        fade.addColorStop(0, 'rgba(0,0,0,0)');
        fade.addColorStop(stopFrac, 'rgba(0,0,0,1)');
        fade.addColorStop(1, 'rgba(0,0,0,1)');
        tctx.globalCompositeOperation = 'destination-in';
        tctx.fillStyle = fade;
        tctx.fillRect(0, 0, tileDstW, dstH);
        tctx.globalCompositeOperation = 'source-over';
      }
      mctx.drawImage(tileC, dx, 0);
    }

    // Subtle warm edge shadow cast by both scroll rollers onto the inner parchment margins
    const leftGrad = mctx.createLinearGradient(0, 0, 42, 0);
    leftGrad.addColorStop(0, 'rgba(20, 12, 6, 0.56)');
    leftGrad.addColorStop(1, 'rgba(20, 12, 6, 0)');
    mctx.globalCompositeOperation = 'source-atop';
    mctx.fillStyle = leftGrad;
    mctx.fillRect(0, 0, 42, dstH);

    const rightGrad = mctx.createLinearGradient(midSpan - 42, 0, midSpan, 0);
    rightGrad.addColorStop(0, 'rgba(20, 12, 6, 0)');
    rightGrad.addColorStop(1, 'rgba(20, 12, 6, 0.56)');
    mctx.fillStyle = rightGrad;
    mctx.fillRect(midSpan - 42, 0, 42, dstH);
    mctx.globalCompositeOperation = 'source-over';

    octx.drawImage(midCanvas, midStart, 0);

    // Draw crisp unstretched left & right bronze-and-iron gothic scroll rollers
    octx.drawImage(trimmed, 0, 0, capSrcW, sh, 0, 0, capDstW, dstH);
    octx.drawImage(trimmed, sw - capSrcW, 0, capSrcW, sh, dstW - capDstW, 0, capDstW, dstH);

    // Subtle Path of Exile currency scroll crimson details (Scroll of Wisdom nod):
    // 1. Tiny weathered dark-crimson wax seal with miniature notched ribbon tails on the outer right parchment margin
    // 2. Tiny braided dark-crimson cord wrap & petite tassel tucked onto the right bronze scroll collar
    // Both stay strictly outside the centered text safe zone (left 8% .. right 8%) so feed copy never overlaps.
    octx.save();

    // --- 1. Tiny Crimson Wax Seal (outer right parchment corner, x ≈ 1094, y ≈ 90) ---
    const sealX = dstW - capDstW - 26;
    const sealY = Math.round(dstH * 0.64);
    const sealR = 14.5;

    // Soft cast shadow on weathered parchment
    octx.save();
    octx.fillStyle = 'rgba(22, 10, 6, 0.42)';
    octx.beginPath();
    octx.ellipse(sealX + 2.5, sealY + 3.5, sealR * 1.06, sealR * 0.94, 0.12, 0, Math.PI * 2);
    octx.fill();
    octx.restore();

    // Two miniature notched crimson silk ribbon tails tucked under the wax seal
    const drawRibbonTail = (angle, len, halfW) => {
      octx.save();
      octx.translate(sealX, sealY);
      octx.rotate(angle);
      const rGrad = octx.createLinearGradient(0, -halfW, len, halfW);
      rGrad.addColorStop(0, '#5a0e12');
      rGrad.addColorStop(0.45, '#8f1b20');
      rGrad.addColorStop(1, '#631015');
      octx.fillStyle = rGrad;
      octx.beginPath();
      octx.moveTo(0, -halfW * 0.72);
      octx.lineTo(len, -halfW);
      octx.lineTo(len - 5.5, 0);
      octx.lineTo(len, halfW);
      octx.lineTo(0, halfW * 0.72);
      octx.closePath();
      octx.fill();
      octx.strokeStyle = 'rgba(34, 6, 8, 0.65)';
      octx.lineWidth = 0.9;
      octx.stroke();
      // Faint antique gold thread edge
      octx.strokeStyle = 'rgba(196, 146, 78, 0.28)';
      octx.lineWidth = 0.6;
      octx.beginPath();
      octx.moveTo(4, -halfW * 0.58);
      octx.lineTo(len - 2, -halfW * 0.75);
      octx.stroke();
      octx.restore();
    };
    drawRibbonTail(1.18, 25, 4.4);
    drawRibbonTail(0.68, 22, 3.9);

    // Organic irregular melted wax body
    const drawOrganicWaxPath = (ctx, cx, cy, r) => {
      const lobes = 12;
      ctx.beginPath();
      for (let i = 0; i <= lobes; i++) {
        const a = (i / lobes) * Math.PI * 2;
        const wobble = 1 + 0.065 * Math.sin(a * 3 + 0.7) + 0.045 * Math.cos(a * 5 - 0.4);
        const px = cx + Math.cos(a) * r * wobble;
        const py = cy + Math.sin(a) * r * 0.95 * wobble;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const waxGrad = octx.createRadialGradient(
      sealX - sealR * 0.34,
      sealY - sealR * 0.36,
      1.5,
      sealX,
      sealY,
      sealR * 1.12
    );
    waxGrad.addColorStop(0, '#c6363b');
    waxGrad.addColorStop(0.42, '#921b20');
    waxGrad.addColorStop(0.82, '#620f13');
    waxGrad.addColorStop(1, '#3b070a');
    drawOrganicWaxPath(octx, sealX, sealY, sealR);
    octx.fillStyle = waxGrad;
    octx.fill();
    octx.strokeStyle = 'rgba(34, 5, 7, 0.78)';
    octx.lineWidth = 1.1;
    octx.stroke();

    // Recessed inner stamped ring + subtle Wraeclast diamond-cross sigil
    octx.beginPath();
    octx.arc(sealX, sealY, sealR * 0.68, 0, Math.PI * 2);
    octx.fillStyle = 'rgba(56, 8, 11, 0.46)';
    octx.fill();
    octx.strokeStyle = 'rgba(218, 92, 88, 0.42)';
    octx.lineWidth = 1.1;
    octx.stroke();

    octx.strokeStyle = 'rgba(222, 138, 114, 0.52)';
    octx.lineWidth = 1.15;
    octx.lineCap = 'round';
    octx.beginPath();
    octx.moveTo(sealX, sealY - 5.2);
    octx.lineTo(sealX + 4.2, sealY);
    octx.lineTo(sealX, sealY + 5.2);
    octx.lineTo(sealX - 4.2, sealY);
    octx.closePath();
    octx.moveTo(sealX, sealY - 6.6);
    octx.lineTo(sealX, sealY + 6.6);
    octx.stroke();

    // Tiny upper-left specular wax highlight
    octx.fillStyle = 'rgba(255, 198, 186, 0.32)';
    octx.beginPath();
    octx.ellipse(sealX - 4.6, sealY - 4.8, 3.2, 1.8, -0.6, 0, Math.PI * 2);
    octx.fill();

    // --- 2. Tiny Braided Crimson Cord Tie on Right Bronze Roller Neck (Scroll of Wisdom motif) ---
    const cordX = dstW - capDstW + Math.round(capDstW * 0.5);
    const cordY = Math.round(dstH * 0.225);
    const cordHalfW = Math.max(9, Math.round(capDstW * 0.36));

    // Crimson cord band wrapped neatly around the upper bronze collar groove
    const cordGrad = octx.createLinearGradient(cordX - cordHalfW, cordY, cordX + cordHalfW, cordY);
    cordGrad.addColorStop(0, '#460a0d');
    cordGrad.addColorStop(0.32, '#9e2126');
    cordGrad.addColorStop(0.55, '#b82c31');
    cordGrad.addColorStop(0.82, '#79151a');
    cordGrad.addColorStop(1, '#3b0709');
    octx.fillStyle = cordGrad;
    octx.beginPath();
    octx.roundRect(cordX - cordHalfW, cordY - 3.2, cordHalfW * 2, 6.4, 3);
    octx.fill();
    octx.strokeStyle = 'rgba(28, 5, 7, 0.72)';
    octx.lineWidth = 0.9;
    octx.stroke();

    // Subtle diagonal braid ridges along the crimson cord
    octx.strokeStyle = 'rgba(42, 6, 9, 0.45)';
    octx.lineWidth = 0.85;
    for (let bx = -cordHalfW + 3; bx <= cordHalfW - 3; bx += 4.2) {
      octx.beginPath();
      octx.moveTo(cordX + bx - 1.5, cordY - 2.6);
      octx.lineTo(cordX + bx + 1.5, cordY + 2.6);
      octx.stroke();
    }

    // Petite crimson cord loop & miniature tassel draping gently onto upper-right parchment edge
    const knotX = cordX - cordHalfW + 1;
    const knotY = cordY + 1.5;
    octx.strokeStyle = '#8b1b20';
    octx.lineWidth = 2.4;
    octx.lineCap = 'round';
    octx.beginPath();
    octx.moveTo(knotX, knotY);
    octx.quadraticCurveTo(knotX - 11, knotY + 7, knotX - 9, knotY + 18);
    octx.stroke();
    octx.strokeStyle = 'rgba(222, 102, 98, 0.35)';
    octx.lineWidth = 0.8;
    octx.stroke();

    // Tiny tassel knot & frayed dark-crimson threads
    const tx = knotX - 9;
    const ty = knotY + 18;
    octx.fillStyle = '#a32328';
    octx.beginPath();
    octx.arc(tx, ty, 3.1, 0, Math.PI * 2);
    octx.fill();
    octx.strokeStyle = '#3d080a';
    octx.lineWidth = 0.8;
    octx.stroke();

    const strands = [
      [-4.2, 11.5, '#761419'],
      [-2.1, 13.5, '#9d2228'],
      [0.2, 14.2, '#b42b31'],
      [2.4, 13.0, '#85181d'],
      [4.2, 11.0, '#620f13']
    ];
    for (const [dx, dy, col] of strands) {
      octx.strokeStyle = col;
      octx.lineWidth = 1.45;
      octx.beginPath();
      octx.moveTo(tx + dx * 0.25, ty + 2);
      octx.quadraticCurveTo(tx + dx * 0.65, ty + dy * 0.55, tx + dx, ty + dy);
      octx.stroke();
    }

    octx.restore();

    return out;
  }

  // High-detail original PoE 2 Post-Map Loot Breakdown Modal slicer
  function slicePoE2ModalAssets(frameImg, panelsImg, controlsImg) {
    const isFgBlack = (r, g, b) => Math.max(r, g, b) > 12;
    const isFgWhite = (r, g, b) => Math.min(r, g, b) < 236 || Math.max(r, g, b) - Math.min(r, g, b) > 16;

    // 1. Winged Forged-Iron Modal Frame (#000000 top exterior above wings)
    if (frameImg && imgModalFrame) {
      const sheet = imageToCanvas(frameImg);
      const sw = sheet.width;
      const sh = sheet.height;

      // Clear pure black corners above iron wings cleanly (clamped to top 16% so dark interior never leaks)
      const topStripH = Math.round(sh * 0.16);
      const topStrip = cropCanvasRegion(sheet.canvas, { x: 0, y: 0, w: sw, h: topStripH });
      clearBlackBackgroundBFS(topStrip, { threshold: 10, featherHaloThreshold: 18, unpremultiply: true });
      sheet.ctx.clearRect(0, 0, sw, topStripH);
      sheet.ctx.drawImage(topStrip, 0, 0);

      // Vertically 3-slice 1376x768 -> 1376x940 keeping winged crest, runes & filigree corners 1:1 unstretched
      const dstW = sw;
      const dstH = 940;
      const topCapH = Math.round(sh * 0.34); // 0..261px (wings, runes, title plaque, top corners)
      const botCapH = Math.round(sh * 0.17); // bottom filigree corners & riveted rail
      const midSrcH = sh - topCapH - botCapH;
      const midDstH = dstH - topCapH - botCapH;

      const composed = document.createElement('canvas');
      composed.width = dstW;
      composed.height = dstH;
      const cctx = composed.getContext('2d', { willReadFrequently: true });
      cctx.drawImage(sheet.canvas, 0, 0, sw, topCapH, 0, 0, dstW, topCapH);
      cctx.drawImage(sheet.canvas, 0, topCapH, sw, midSrcH, 0, topCapH, dstW, midDstH);
      cctx.drawImage(sheet.canvas, 0, sh - botCapH, sw, botCapH, 0, dstH - botCapH, dstW, botCapH);

      // Scan exact dark interior of the sculpted title plaque inside topCapH so heading sits dead-center
      const fdata = cctx.getImageData(0, 0, dstW, topCapH).data;
      const xCenter = Math.round(dstW * 0.5);
      const lumAt = (x, y) => {
        const off = (y * dstW + x) * 4;
        return 0.299 * fdata[off] + 0.587 * fdata[off + 1] + 0.114 * fdata[off + 2];
      };

      // Locate top & bottom metallic bezels of the blank title plaque along centerline (y = 90..180)
      let pTop = -1;
      let pBot = -1;
      for (let y = Math.round(sh * 0.115); y <= Math.round(sh * 0.17); y++) {
        if (lumAt(xCenter, y) >= 56) {
          pTop = y + 3;
          break;
        }
      }
      if (pTop !== -1) {
        for (let y = pTop + 26; y <= Math.round(sh * 0.245); y++) {
          if (lumAt(xCenter, y) >= 54) {
            pBot = y - 3;
            break;
          }
        }
      }
      if (pTop !== -1 && pBot > pTop + 24 && modalTitlePlaque) {
        const pMidY = Math.round((pTop + pBot) * 0.5);
        let pLeft = Math.round(dstW * 0.368);
        let pRight = Math.round(dstW * 0.632);
        for (let x = xCenter; x >= Math.round(dstW * 0.30); x--) {
          if (lumAt(x, pMidY) >= 54) {
            pLeft = x + 4;
            break;
          }
        }
        for (let x = xCenter; x <= Math.round(dstW * 0.70); x++) {
          if (lumAt(x, pMidY) >= 54) {
            pRight = x - 4;
            break;
          }
        }
        modalTitlePlaque.style.left = `${(pLeft / dstW) * 100}%`;
        modalTitlePlaque.style.width = `${((pRight - pLeft) / dstW) * 100}%`;
        modalTitlePlaque.style.top = `${(pTop / dstH) * 100}%`;
        modalTitlePlaque.style.height = `${((pBot - pTop) / dstH) * 100}%`;
      }

      imgModalFrame.src = composed.toDataURL('image/png');
    }

    // 2. Riveted 5-Slot Stat Bar + Hammered-Iron Ledger Header + Repeatable Row Plate (#FFFFFF bg!)
    if (panelsImg) {
      const sheet = imageToCanvas(panelsImg);
      const imgData = sheet.ctx.getImageData(0, 0, sheet.width, sheet.height);
      const bands = findBandsY(imgData, sheet.height, isFgWhite, 24, 12);

      // Band 0: 5-Slot Riveted Forged-Iron Stat Bar
      if (bands.length >= 1) {
        const statBox = tightTrimBox(imgData, 0, bands[0].y0, sheet.width - 1, bands[0].y1, isFgWhite);
        if (statBox) {
          const rawStat = cropCanvasRegion(sheet.canvas, statBox);
          clearWhiteBackgroundBFS(rawStat);

          // Compose sleek 1320x164 stat bar keeping top & bottom riveted borders crisp
          const sw = rawStat.width;
          const sh = rawStat.height;
          const statCanvas = document.createElement('canvas');
          statCanvas.width = 1320;
          statCanvas.height = 164;
          const sctx = statCanvas.getContext('2d', { willReadFrequently: true });
          const rimH = Math.round(sh * 0.24);
          const dstRimH = Math.round(rimH * (1320 / sw));
          sctx.drawImage(rawStat, 0, 0, sw, rimH, 0, 0, 1320, dstRimH);
          sctx.drawImage(
            rawStat,
            0,
            rimH,
            sw,
            sh - rimH * 2,
            0,
            dstRimH,
            1320,
            164 - dstRimH * 2
          );
          sctx.drawImage(rawStat, 0, sh - rimH, sw, rimH, 0, 164 - dstRimH, 1320, dstRimH);

          // Pixel-scan exact 5 recessed dark obsidian chambers inside statCanvas
          const cw = statCanvas.width;
          const ch = statCanvas.height;
          const sdata = sctx.getImageData(0, 0, cw, ch).data;
          const yBand0 = Math.floor(ch * 0.32);
          const yBand1 = Math.ceil(ch * 0.68);
          const isChamberCol = new Uint8Array(cw);

          for (let x = 0; x < cw; x++) {
            let sum = 0;
            let maxL = 0;
            let cnt = 0;
            for (let y = yBand0; y <= yBand1; y++) {
              const off = (y * cw + x) * 4;
              if (sdata[off + 3] < 128) continue;
              const lum = 0.299 * sdata[off] + 0.587 * sdata[off + 1] + 0.114 * sdata[off + 2];
              sum += lum;
              if (lum > maxL) maxL = lum;
              cnt++;
            }
            if (cnt > 0 && sum / cnt < 30 && maxL < 42) {
              isChamberCol[x] = 1;
            }
          }

          const chambers = [];
          let inRun = false;
          let runStart = 0;
          for (let x = 0; x < cw; x++) {
            if (isChamberCol[x] && !inRun) {
              inRun = true;
              runStart = x;
            } else if (!isChamberCol[x] && inRun) {
              inRun = false;
              if (x - runStart >= cw * 0.11) chambers.push({ x0: runStart, x1: x - 1 });
            }
          }
          if (inRun && cw - runStart >= cw * 0.11) chambers.push({ x0: runStart, x1: cw - 1 });

          // Scan exact vertical top/bottom dark cavity bounds of chamber 0
          let chamberTop = Math.round(ch * 0.22);
          let chamberBot = Math.round(ch * 0.78);
          if (chambers.length === 5) {
            const sample = chambers[0];
            const sx0 = Math.round(sample.x0 + (sample.x1 - sample.x0) * 0.25);
            const sx1 = Math.round(sample.x1 - (sample.x1 - sample.x0) * 0.25);
            let bestStart = -1;
            let bestEnd = -1;
            let curStart = -1;
            for (let y = 0; y < ch; y++) {
              let sum = 0;
              let cnt = 0;
              for (let x = sx0; x <= sx1; x++) {
                const off = (y * cw + x) * 4;
                sum += 0.299 * sdata[off] + 0.587 * sdata[off + 1] + 0.114 * sdata[off + 2];
                cnt++;
              }
              const dark = cnt > 0 && sum / cnt < 32;
              if (dark && curStart === -1) curStart = y;
              else if (!dark && curStart !== -1) {
                if (y - curStart > bestEnd - bestStart) {
                  bestStart = curStart;
                  bestEnd = y - 1;
                }
                curStart = -1;
              }
            }
            if (curStart !== -1 && ch - curStart > bestEnd - bestStart) {
              bestStart = curStart;
              bestEnd = ch - 1;
            }
            if (bestEnd - bestStart >= ch * 0.35) {
              chamberTop = bestStart;
              chamberBot = bestEnd;
            }
          }

          const topPct = (chamberTop / ch) * 100;
          const heightPct = ((chamberBot - chamberTop + 1) / ch) * 100;
          if (chambers.length === 5) {
            modalStatCells.forEach((cell, idx) => {
              if (!cell) return;
              const b = chambers[idx];
              cell.style.left = `${(b.x0 / cw) * 100}%`;
              cell.style.width = `${((b.x1 - b.x0 + 1) / cw) * 100}%`;
              cell.style.top = `${topPct}%`;
              cell.style.height = `${heightPct}%`;
            });
          } else {
            const intL = 3.2;
            const slotW = (100 - intL * 2) / 5;
            modalStatCells.forEach((cell, idx) => {
              if (!cell) return;
              cell.style.left = `${intL + idx * slotW}%`;
              cell.style.width = `${slotW}%`;
              cell.style.top = '22%';
              cell.style.height = '56%';
            });
          }

          if (imgModalStatBar) imgModalStatBar.src = statCanvas.toDataURL('image/png');
        }
      }

      // Band 1: Hammered-Iron Ledger Header Bar
      if (bands.length >= 2) {
        const hdrBox = tightTrimBox(imgData, 0, bands[1].y0, sheet.width - 1, bands[1].y1, isFgWhite);
        if (hdrBox && imgLedgerHeader) {
          const rawHdr = cropCanvasRegion(sheet.canvas, hdrBox);
          clearWhiteBackgroundBFS(rawHdr);

          // Compose sleek 1320x66 header bar preserving crisp riveted bronze top/bottom rims
          const hw = rawHdr.width;
          const hh = rawHdr.height;
          const hdrCanvas = document.createElement('canvas');
          hdrCanvas.width = 1320;
          hdrCanvas.height = 66;
          const hctx = hdrCanvas.getContext('2d');
          const rimSrc = Math.round(hh * 0.25);
          const rimDst = 16;
          hctx.drawImage(rawHdr, 0, 0, hw, rimSrc, 0, 0, 1320, rimDst);
          hctx.drawImage(rawHdr, 0, rimSrc, hw, hh - rimSrc * 2, 0, rimDst, 1320, 66 - rimDst * 2);
          hctx.drawImage(rawHdr, 0, hh - rimSrc, hw, rimSrc, 0, 66 - rimDst, 1320, rimDst);
          imgLedgerHeader.src = hdrCanvas.toDataURL('image/png');
        }
      }

      // Band 2: Repeatable Ledger Row Plate (keeps left antique-bronze square socket 1:1 square!)
      if (bands.length >= 3) {
        const rowBox = tightTrimBox(imgData, 0, bands[2].y0, sheet.width - 1, bands[2].y1, isFgWhite);
        if (rowBox) {
          const rawRow = cropCanvasRegion(sheet.canvas, rowBox);
          clearWhiteBackgroundBFS(rawRow);
          const rw = rawRow.width;
          const rh = rawRow.height;
          const rdata = rawRow.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, rw, rh).data;

          // Detect right edge of the left square bronze socket frame (around x = 8%..13% of rawRow)
          const midY0 = Math.floor(rh * 0.3);
          const midY1 = Math.ceil(rh * 0.7);
          let socketSrcEnd = Math.round(rh * 1.02);
          for (let x = Math.round(rh * 0.85); x <= Math.min(rw - 20, Math.round(rh * 1.35)); x++) {
            let sum = 0;
            let cnt = 0;
            for (let y = midY0; y <= midY1; y++) {
              const off = (y * rw + x) * 4;
              sum += 0.299 * rdata[off] + 0.587 * rdata[off + 1] + 0.114 * rdata[off + 2];
              cnt++;
            }
            if (cnt > 0 && sum / cnt < 22) {
              socketSrcEnd = x;
              break;
            }
          }

          // Compose sleek 1320x72 row canvas: left bronze socket scaled 1:1 square (72x72),
          // right obsidian slate + top/bottom forged-iron borders stretched cleanly across 72..1320
          const outW = 1320;
          const outH = 72;
          const socketDstW = Math.max(66, Math.round(socketSrcEnd * (outH / rh)));
          const rowCanvas = document.createElement('canvas');
          rowCanvas.width = outW;
          rowCanvas.height = outH;
          const rctx = rowCanvas.getContext('2d');

          // Left 1:1 square carved bronze socket
          rctx.drawImage(rawRow, 0, 0, socketSrcEnd, rh, 0, 0, socketDstW, outH);

          // Right cracked obsidian plate with unstretched crisp top/bottom metal borders
          const rightSrcX = socketSrcEnd;
          const rightSrcW = rw - rightSrcX;
          const rightDstW = outW - socketDstW;
          const borderSrcH = Math.max(8, Math.round(rh * 0.12));
          const borderDstH = 8;
          rctx.drawImage(rawRow, rightSrcX, 0, rightSrcW, borderSrcH, socketDstW, 0, rightDstW, borderDstH);
          rctx.drawImage(
            rawRow,
            rightSrcX,
            borderSrcH,
            rightSrcW,
            rh - borderSrcH * 2,
            socketDstW,
            borderDstH,
            rightDstW,
            outH - borderDstH * 2
          );
          rctx.drawImage(
            rawRow,
            rightSrcX,
            rh - borderSrcH,
            rightSrcW,
            borderSrcH,
            socketDstW,
            outH - borderDstH,
            rightDstW,
            borderDstH
          );

          modalAssets.rowBgUrl = rowCanvas.toDataURL('image/png');

          // Compute exact 7 column layout percentages shared identically by header & every ledger row
          const sockPct = (socketDstW / outW) * 100;
          const contentStart = sockPct + 0.4;
          const contentEnd = 98.8;
          const span = contentEnd - contentStart;
          const ratios = [0.285, 0.105, 0.145, 0.145, 0.145, 0.175];

          const layout = [{ left: 0.35, width: Math.max(4.4, sockPct - 0.7) }];
          let curLeft = contentStart;
          for (const ratio of ratios) {
            const wPct = span * ratio;
            layout.push({ left: curLeft, width: wPct });
            curLeft += wPct;
          }
          modalAssets.rowLayout = layout;

          // Apply IDENTICAL 7 column coordinates to the hammered-iron header overlay
          if (modalLedgerHeaderCols) {
            const hdrCells = modalLedgerHeaderCols.querySelectorAll('.ledger-hdr-cell');
            hdrCells.forEach((cell, idx) => {
              const col = layout[idx];
              if (!col) return;
              cell.style.left = `${col.left}%`;
              cell.style.width = `${col.width}%`;
            });
          }
        }
      }
    }

    // 3. Sculpted Gothic Heraldic Shields (4) + Action Buttons & [X] Close Button (#000000 bg)
    if (controlsImg) {
      const sheet = imageToCanvas(controlsImg);
      const imgData = sheet.ctx.getImageData(0, 0, sheet.width, sheet.height);
      const bands = findBandsY(imgData, sheet.height, isFgBlack, 24, 12);

      // Row 0: 4 sculpted gothic heraldic heater shields
      if (bands.length >= 1) {
        const shields = findIslandsX(imgData, bands[0].y0, bands[0].y1, isFgBlack, 80, 12);
        const shieldUrls = shields.map((box) => {
          const c = cropCanvasRegion(sheet.canvas, box);
          clearBlackBackgroundBFS(c, {
            threshold: 10,
            featherHaloThreshold: 22,
            unpremultiply: true
          });
          return trimCanvasByAlpha(c, 12).toDataURL('image/png');
        });
        if (shieldUrls.length >= 4) {
          modalAssets.tierBadges.set('S++', shieldUrls[0]);
          modalAssets.tierBadges.set('S+', shieldUrls[0]);
          modalAssets.tierBadges.set('S', shieldUrls[1]);
          modalAssets.tierBadges.set('A+', shieldUrls[1]);
          modalAssets.tierBadges.set('A', shieldUrls[2]);
          modalAssets.tierBadges.set('B', shieldUrls[2]);
          modalAssets.tierBadges.set('D', shieldUrls[3]);
          modalAssets.tierBadges.set('F', shieldUrls[3]);
        }
      }

      // Row 1: Crimson-gold Replay Button, Forged-iron Dismiss Button, and [X] Close Button
      if (bands.length >= 2) {
        const btns = findIslandsX(imgData, bands[1].y0, bands[1].y1, isFgBlack, 60, 12);
        if (btns.length >= 3) {
          const makeBtnUrl = (box) => {
            const c = cropCanvasRegion(sheet.canvas, box);
            clearBlackBackgroundBFS(c, {
              threshold: 10,
              featherHaloThreshold: 20,
              unpremultiply: true
            });
            return trimCanvasByAlpha(c, 12).toDataURL('image/png');
          };
          if (imgBtnReplay) imgBtnReplay.src = makeBtnUrl(btns[0]);
          if (imgBtnDismiss) imgBtnDismiss.src = makeBtnUrl(btns[1]);
          if (imgModalClose) imgModalClose.src = makeBtnUrl(btns[2]);
        }
      }
    }
  }

  function processMechanicIconCanvas(img) {
    const raw = imageToCanvas(img);
    const data = raw.ctx.getImageData(0, 0, raw.width, raw.height).data;
    // Strip white matte only if corner is opaque white; preserve existing WebP alpha otherwise
    const topLeftA = data[3];
    const minC = Math.min(data[0], data[1], data[2]);
    if (topLeftA >= 200 && minC >= 220) {
      clearWhiteBackgroundBFS(raw.canvas);
    }
    return trimCanvasByAlpha(raw.canvas, 24);
  }

  function applyPoE2BottomDockLayout(dockCanvas) {
    const w = dockCanvas.width;
    const h = dockCanvas.height;
    const data = dockCanvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;

    const avgLumXY = (x0, x1, y0, y1) => {
      let sum = 0;
      let cnt = 0;
      for (let y = Math.max(0, y0); y <= Math.min(h - 1, y1); y++) {
        for (let x = Math.max(0, x0); x <= Math.min(w - 1, x1); x++) {
          const off = (y * w + x) * 4;
          if (data[off + 3] < 128) continue;
          sum += 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
          cnt++;
        }
      }
      return cnt > 0 ? sum / cnt : 999;
    };

    // 1. Locate purple Breach plate, green Abyss plate, and circular gold LED bezel by chromatic signature
    const scanBox = (pred, xMinRatio, xMaxRatio) => {
      let minX = w;
      let maxX = -1;
      let minY = h;
      let maxY = -1;
      const xStart = Math.floor(w * xMinRatio);
      const xEnd = Math.ceil(w * xMaxRatio);
      for (let y = Math.floor(h * 0.14); y <= Math.ceil(h * 0.86); y++) {
        for (let x = xStart; x <= xEnd; x++) {
          const off = (y * w + x) * 4;
          if (data[off + 3] < 128) continue;
          if (pred(data[off], data[off + 1], data[off + 2])) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX - minX < 18 || maxY - minY < 14) return null;
      return { x0: minX, x1: maxX, y0: minY, y1: maxY };
    };

    const breachBox = scanBox((r, g, b) => r > g + 10 && b > g + 8 && r > 48 && b > 48, 0.14, 0.42);
    const abyssBox = scanBox((r, g, b) => g > r + 14 && g > b + 8 && g > 48, 0.42, 0.70);
    const bezelBox = scanBox((r, g, b) => r - b > 28 && r > 90 && g > 65, 0.80, 0.94);

    if (breachBox && dockBreachLabel) {
      dockBreachLabel.style.left = `${(breachBox.x0 / w) * 100}%`;
      dockBreachLabel.style.width = `${((breachBox.x1 - breachBox.x0 + 1) / w) * 100}%`;
      dockBreachLabel.style.top = `${(breachBox.y0 / h) * 100}%`;
      dockBreachLabel.style.height = `${((breachBox.y1 - breachBox.y0 + 1) / h) * 100}%`;
    }

    if (abyssBox && dockAbyssLabel) {
      dockAbyssLabel.style.left = `${(abyssBox.x0 / w) * 100}%`;
      dockAbyssLabel.style.width = `${((abyssBox.x1 - abyssBox.x0 + 1) / w) * 100}%`;
      dockAbyssLabel.style.top = `${(abyssBox.y0 / h) * 100}%`;
      dockAbyssLabel.style.height = `${((abyssBox.y1 - abyssBox.y0 + 1) / h) * 100}%`;
    }

    // 2. Pixel-scan the exact recessed dark interior cavity of each filigree square socket
    //    so both Breach & Abyss icons sit 100% dead-center inside their carved filigree squares
    const placeSquareSocket = (el, plateBox, fallbackLeftPct) => {
      if (!el) return;
      if (!plateBox) {
        el.style.left = `${fallbackLeftPct}%`;
        return;
      }

      const plateH = plateBox.y1 - plateBox.y0 + 1;
      const midY = Math.round((plateBox.y0 + plateBox.y1) * 0.5);
      const bandHalfY = Math.max(4, Math.round(plateH * 0.12));
      const scanLeft = Math.max(0, plateBox.x0 - Math.round(plateH * 1.48));
      const scanRight = Math.max(scanLeft + 10, plateBox.x0 - 4);

      // Find longest contiguous dark cavity run [wellX0 .. wellX1] to the left of plateBox
      let bestX0 = -1;
      let bestX1 = -1;
      let runX0 = -1;
      for (let x = scanLeft; x <= scanRight; x++) {
        const lum = avgLumXY(x, x, midY - bandHalfY, midY + bandHalfY);
        if (lum < 44) {
          if (runX0 === -1) runX0 = x;
        } else if (runX0 !== -1) {
          if (x - 1 - runX0 > bestX1 - bestX0) {
            bestX0 = runX0;
            bestX1 = x - 1;
          }
          runX0 = -1;
        }
      }
      if (runX0 !== -1 && scanRight - runX0 > bestX1 - bestX0) {
        bestX0 = runX0;
        bestX1 = scanRight;
      }

      if (bestX1 - bestX0 >= plateH * 0.36) {
        const cx = (bestX0 + bestX1) * 0.5;
        const cxInt = Math.round(cx);
        const bandHalfX = Math.max(4, Math.round((bestX1 - bestX0) * 0.16));

        // Find exact vertical dark cavity run [wellY0 .. wellY1] along socket vertical centerline
        let bestY0 = plateBox.y0;
        let bestY1 = plateBox.y1;
        let runY0 = -1;
        let maxRunY = 0;
        for (let y = Math.max(0, plateBox.y0 - 8); y <= Math.min(h - 1, plateBox.y1 + 8); y++) {
          const lum = avgLumXY(cxInt - bandHalfX, cxInt + bandHalfX, y, y);
          if (lum < 44) {
            if (runY0 === -1) runY0 = y;
          } else if (runY0 !== -1) {
            if (y - runY0 > maxRunY) {
              maxRunY = y - runY0;
              bestY0 = runY0;
              bestY1 = y - 1;
            }
            runY0 = -1;
          }
        }
        if (runY0 !== -1 && Math.min(h - 1, plateBox.y1 + 8) - runY0 + 1 > maxRunY) {
          bestY0 = runY0;
          bestY1 = Math.min(h - 1, plateBox.y1 + 8);
        }

        const cy = (bestY0 + bestY1) * 0.5;
        const wellSize = Math.min(bestX1 - bestX0 + 1, bestY1 - bestY0 + 1);
        const slotSize = Math.round(wellSize * 1.04);
        el.style.left = `${((cx - slotSize * 0.5) / w) * 100}%`;
        el.style.width = `${(slotSize / w) * 100}%`;
        el.style.top = `${((cy - slotSize * 0.5) / h) * 100}%`;
        el.style.height = `${(slotSize / h) * 100}%`;
      } else {
        const socketSize = Math.round(plateH * 0.9);
        const socketRight = plateBox.x0 - Math.round(w * 0.015);
        const socketLeft = Math.max(0, socketRight - socketSize);
        const socketTop = Math.round((plateBox.y0 + plateBox.y1 - socketSize) * 0.5);
        el.style.left = `${(socketLeft / w) * 100}%`;
        el.style.width = `${(socketSize / w) * 100}%`;
        el.style.top = `${(socketTop / h) * 100}%`;
        el.style.height = `${(socketSize / h) * 100}%`;
      }
    };

    placeSquareSocket(dockBreachSlot, breachBox, 9.2);
    placeSquareSocket(dockAbyssSlot, abyssBox, 38.2);

    // 3. Scan BACKWARD (leftward) from inside the smooth dark charcoal interior just left of the gold LED bezel
    //    until hitting the crisp dark inner groove (lum < 28) or bright raised bevel (lum > 74).
    //    Scanning outward from the known interior avoids any false triggers on Abyss's right bronze border.
    if (btnToggleLabels && abyssBox && bezelBox) {
      const bezelCx = (bezelBox.x0 + bezelBox.x1) * 0.5;
      const bezelCy = (bezelBox.y0 + bezelBox.y1) * 0.5;
      const bezelDiam = Math.max(12, bezelBox.x1 - bezelBox.x0 + 1);
      const bandHalfY = Math.max(5, Math.round((abyssBox.y1 - abyssBox.y0) * 0.14));
      const midY = Math.round(bezelCy);

      // Start safely inside the flat charcoal surface to the left of the gold ring's outer shadow
      const scanStartX = Math.max(abyssBox.x1 + 16, bezelBox.x0 - Math.max(10, Math.round(bezelDiam * 0.28)));
      const scanMinX = abyssBox.x1 + Math.round(w * 0.014);

      let innerRecessLeft = abyssBox.x1 + Math.round(w * 0.044);
      for (let x = scanStartX; x >= scanMinX; x--) {
        const lum = avgLumXY(x, x, midY - bandHalfY, midY + bandHalfY);
        if (lum < 28 || lum > 74) {
          innerRecessLeft = x + 2;
          break;
        }
      }

      // Scan upward & downward from bezelCy at the horizontal center of the charcoal text area
      const textMidX = Math.round((innerRecessLeft + bezelBox.x0) * 0.5);
      const bandHalfX = Math.max(6, Math.round((bezelBox.x0 - innerRecessLeft) * 0.14));
      let innerRecessTop = abyssBox.y0;
      let innerRecessBottom = abyssBox.y1;
      for (let y = midY; y >= Math.max(0, abyssBox.y0 - 12); y--) {
        const lum = avgLumXY(textMidX - bandHalfX, textMidX + bandHalfX, y, y);
        if (lum < 28 || lum > 74) {
          innerRecessTop = y + 2;
          break;
        }
      }
      for (let y = midY; y <= Math.min(h - 1, abyssBox.y1 + 12); y++) {
        const lum = avgLumXY(textMidX - bandHalfX, textMidX + bandHalfX, y, y);
        if (lum < 28 || lum > 74) {
          innerRecessBottom = y - 2;
          break;
        }
      }

      const toggleLeft = Math.max(abyssBox.x1 + 8, innerRecessLeft - 6);
      const toggleRight = Math.min(w - 1, bezelBox.x1 + Math.round(w * 0.015));
      const toggleTop = Math.max(0, innerRecessTop - 4);
      const toggleBottom = Math.min(h - 1, innerRecessBottom + 4);
      const toggleH = Math.max(24, toggleBottom - toggleTop + 1);
      const toggleW = Math.max(40, toggleRight - toggleLeft);

      btnToggleLabels.style.left = `${(toggleLeft / w) * 100}%`;
      btnToggleLabels.style.width = `${(toggleW / w) * 100}%`;
      btnToggleLabels.style.top = `${(toggleTop / h) * 100}%`;
      btnToggleLabels.style.height = `${(toggleH / h) * 100}%`;

      if (dockLabelsText) {
        const recessCenterY = (innerRecessTop + innerRecessBottom) * 0.5;
        const interiorSpan = Math.max(24, bezelBox.x0 - innerRecessLeft);
        const sidePad = Math.max(4, Math.round(interiorSpan * 0.06));
        const textLeft = innerRecessLeft + sidePad;
        const textRight = bezelBox.x0 - sidePad;
        dockLabelsText.style.left = `${((textLeft - toggleLeft) / toggleW) * 100}%`;
        dockLabelsText.style.width = `${(Math.max(20, textRight - textLeft) / toggleW) * 100}%`;
        dockLabelsText.style.top = `${((recessCenterY - toggleTop) / toggleH) * 100}%`;
        dockLabelsText.style.right = 'auto';
        dockLabelsText.style.bottom = 'auto';
      }

      if (dockLabelsLed) {
        const bezelInnerDiam = Math.max(
          8,
          Math.min(bezelBox.x1 - bezelBox.x0, bezelBox.y1 - bezelBox.y0) * 0.54
        );
        dockLabelsLed.style.left = `${((bezelCx - toggleLeft) / toggleW) * 100}%`;
        dockLabelsLed.style.top = `${((bezelCy - toggleTop) / toggleH) * 100}%`;
        dockLabelsLed.style.width = `${(bezelInnerDiam / toggleW) * 100}%`;
        dockLabelsLed.style.height = `${(bezelInnerDiam / toggleH) * 100}%`;
      }
    }
  }

  async function loadAndSliceUIAssets() {
    const isFgBlack = (r, g, b) => Math.max(r, g, b) > 12;
    const isFgWhite = (r, g, b) => Math.min(r, g, b) < 236 || Math.max(r, g, b) - Math.min(r, g, b) > 16;

    try {
      const fontReady =
        document.fonts && document.fonts.load
          ? document.fonts.load('20px "Fontin SmallCaps"').catch(() => {})
          : Promise.resolve();

      const [
        plaqueImg,
        topbarImg,
        scrollDockImg,
        scrollBannerPoE2Img,
        bottomDockPoE2Img,
        astrolabeImg,
        divineOrbImg,
        breachIconImg,
        abyssIconImg,
        modalFramePoE2Img,
        modalPanelsPoE2Img,
        modalControlsPoE2Img
      ] = await Promise.all([
        loadImageAsset('./assets/ui/plaque_gem_sheet.webp'),
        loadImageAsset('./assets/ui/topbar_stats_sheet.webp'),
        loadImageAsset('./assets/ui/scroll_dock_sheet.jpg?v=13'),
        loadImageAsset('./assets/ui/scroll_banner_poe2.jpg?v=29'),
        loadImageAsset('./assets/ui/bottom_dock_poe2.jpg?v=28'),
        loadImageAsset('./assets/ui/astrolabe_poe2.jpg?v=25'),
        loadImageAsset('./assets/icons/currency/divine_orb.webp?v=27'),
        loadImageAsset('./assets/icons/breach.webp?v=27'),
        loadImageAsset('./assets/icons/abyss.webp?v=27'),
        loadImageAsset('./assets/ui/modal_frame_poe2.jpg?v=29'),
        loadImageAsset('./assets/ui/modal_panels_poe2.jpg?v=29'),
        loadImageAsset('./assets/ui/modal_controls_poe2.jpg?v=29'),
        fontReady
      ]);

      // Load & process all official PoE2DB currency orb icons cleanly
      const uniqueOrbPaths = [...new Set(Object.values(CURRENCY_ICON_PATHS))];
      const loadedOrbCanvases = new Map();
      await Promise.all(
        uniqueOrbPaths.map(async (path) => {
          try {
            const img = await loadImageAsset(`${path}?v=27`);
            const processed = processCurrencyIconCanvas(img);
            loadedOrbCanvases.set(path, processed);
          } catch (e) {
            console.warn('Could not load currency orb icon:', path, e);
          }
        })
      );
      const fbSpecLoader = window.FilterBladeSpec;
      for (const [id, path] of Object.entries(CURRENCY_ICON_PATHS)) {
        const baseCanvas = loadedOrbCanvases.get(path);
        if (baseCanvas) {
          const variant = fbSpecLoader ? fbSpecLoader.getCurrencyVariantTier(id) : 'base';
          const finalCanvas = buildTieredCurrencyCanvas(baseCanvas, variant);
          currencyCanvasCache.set(id, finalCanvas);
          modalAssets.currencyIcons.set(id, finalCanvas.toDataURL('image/png'));
        }
      }

      // Use real official PoE2DB Divine Orb asset next to DIVINE CLICKER brand title
      if (divineOrbImg && imgBrandDivineOrb) {
        const orbTrimmed = processCurrencyIconCanvas(divineOrbImg);
        imgBrandDivineOrb.src = orbTrimmed.toDataURL('image/png');
      }

      // Process official PoE2DB Breach & Abyss icons (dock sockets + map canvas rifts)
      if (breachIconImg) {
        const breachTrimmed = processMechanicIconCanvas(breachIconImg);
        mechanicIconCache.set('breach', breachTrimmed);
        if (imgDockBreach) imgDockBreach.src = breachTrimmed.toDataURL('image/png');
      }
      if (abyssIconImg) {
        const abyssTrimmed = processMechanicIconCanvas(abyssIconImg);
        mechanicIconCache.set('abyss', abyssTrimmed);
        if (imgDockAbyss) imgDockAbyss.src = abyssTrimmed.toDataURL('image/png');
      }

      // 1. Slice Central Astrolabe into 3 concentric feathered rings
      buildAstrolabeLayers(astrolabeImg);

      // 2. Slice Top-Center Winged Plaque + Crimson Ruby Gem
      {
        const sheet = imageToCanvas(plaqueImg);
        const maxY = Math.floor(sheet.height * 0.84); // Excludes bottom-right watermark
        const imgData = sheet.ctx.getImageData(0, 0, sheet.width, sheet.height);
        const islands = findIslandsX(imgData, 0, maxY, isFgBlack, 40, 18);

        if (islands.length >= 2) {
          const plaqueCanvas = cropCanvasRegion(sheet.canvas, islands[0]);
          clearBlackBackgroundBFS(plaqueCanvas, { threshold: 12, featherHaloThreshold: 20 });
          clearEnclosedBlackPockets(plaqueCanvas, { threshold: 10, xMaxRatio: 0.23 });
          clearEnclosedBlackPockets(plaqueCanvas, { threshold: 10, xMinRatio: 0.77 });
          applyPlaqueLayoutFromPixels(plaqueCanvas);
          if (imgPlaque) imgPlaque.src = plaqueCanvas.toDataURL('image/png');

          const gemCanvas = cropCanvasRegion(sheet.canvas, islands[1]);
          clearBlackBackgroundBFS(gemCanvas, { threshold: 12, featherHaloThreshold: 22 });
          const gemUrl = gemCanvas.toDataURL('image/png');
          socketSlots.forEach((slot) => {
            const img = slot && slot.querySelector('.socket-gem-img');
            if (img) img.src = gemUrl;
          });
        }
      }

      // 3. Slice Top-Left Divine Clicker Text, Tabs, Activate + Top-Right Stat Bar & Utility Icons
      {
        const sheet = imageToCanvas(topbarImg);
        const maxY = Math.floor(sheet.height * 0.82); // Excludes bottom-right watermark
        const imgData = sheet.ctx.getImageData(0, 0, sheet.width, sheet.height);
        const bands = findBandsY(imgData, maxY, isFgBlack, 16, 8);

        if (bands.length >= 2) {
          // Row 0: Wheel Icon (skipped) + "DIVINE CLICKER" text + T16 Delirium + Endless + Activate
          const topIslands = findIslandsX(imgData, bands[0].y0, bands[0].y1, isFgBlack, 6, 3);
          const framedButtons = topIslands.filter((b) => b.w >= 85);
          if (framedButtons.length >= 3) {
            const tabTimedBox = framedButtons[framedButtons.length - 3];
            const tabEndlessBox = framedButtons[framedButtons.length - 2];
            const activateBox = framedButtons[framedButtons.length - 1];

            // Split out only the "DIVINE CLICKER" lettering after the original circular wheel icon
            const wheelPart = topIslands.find(
              (b) => b.x + b.w <= tabTimedBox.x - 2 && b.w >= 30 && b.h >= 36
            );
            const brandTextX0 = wheelPart ? wheelPart.x + wheelPart.w + 2 : 0;
            const brandBox = tightTrimBox(
              imgData,
              brandTextX0,
              bands[0].y0,
              tabTimedBox.x - 4,
              bands[0].y1,
              isFgBlack
            );
            if (brandBox && imgBrandEmblem) {
              const c = cropCanvasRegion(sheet.canvas, brandBox);
              clearBlackBackgroundBFS(c, { threshold: 13 });
              clearEnclosedBlackPockets(c, { threshold: 12 });
              imgBrandEmblem.src = c.toDataURL('image/png');
            }
            if (imgTabTimed) {
              const c = cropCanvasRegion(sheet.canvas, tabTimedBox);
              clearBlackBackgroundBFS(c, { threshold: 12 });
              imgTabTimed.src = c.toDataURL('image/png');
            }
            if (imgTabEndless) {
              const c = cropCanvasRegion(sheet.canvas, tabEndlessBox);
              clearBlackBackgroundBFS(c, { threshold: 12 });
              imgTabEndless.src = c.toDataURL('image/png');
            }
            if (imgBtnActivate) {
              const c = cropCanvasRegion(sheet.canvas, activateBox);
              clearBlackBackgroundBFS(c, {
                threshold: 10,
                featherHaloThreshold: 38,
                unpremultiply: true
              });
              imgBtnActivate.src = c.toDataURL('image/png');
            }
          }

          // Row 1: Segmented Stat Bar + Speaker + List + Help
          const botIslands = findIslandsX(imgData, bands[1].y0, bands[1].y1, isFgBlack, 5, 3);
          const wideBar = botIslands.find((b) => b.w >= 260);
          const rightButtons = botIslands.filter(
            (b) => (!wideBar || b.x > wideBar.x + wideBar.w) && b.w >= 38 && b.h >= 38
          );
          if (wideBar && rightButtons.length >= 2) {
            const statCanvas = cropCanvasRegion(sheet.canvas, wideBar);
            clearBlackBackgroundBFS(statCanvas, { threshold: 12 });
            applyStatBarCellsFromPixels(statCanvas);
            if (imgStatBar) imgStatBar.src = statCanvas.toDataURL('image/png');

            const listBox = rightButtons[rightButtons.length - 2];
            const helpBox = rightButtons[rightButtons.length - 1];
            const speakerBox = tightTrimBox(
              imgData,
              wideBar.x + wideBar.w + 2,
              bands[1].y0,
              listBox.x - 2,
              bands[1].y1,
              isFgBlack
            );
            if (speakerBox && imgIconSpeaker) {
              const c = cropCanvasRegion(sheet.canvas, speakerBox);
              clearBlackBackgroundBFS(c, { threshold: 12 });
              imgIconSpeaker.src = c.toDataURL('image/png');
            }
            if (imgIconList) {
              const c = cropCanvasRegion(sheet.canvas, listBox);
              clearBlackBackgroundBFS(c, { threshold: 12 });
              imgIconList.src = c.toDataURL('image/png');
            }
            if (imgIconHelp) {
              const c = cropCanvasRegion(sheet.canvas, helpBox);
              clearBlackBackgroundBFS(c, { threshold: 12 });
              imgIconHelp.src = c.toDataURL('image/png');
            }
          }
        }
      }

      // 4. Build Weathered PoE 2 Parchment Scroll Banner + 3-Compartment Forged-Iron Dock (#000000 bg)
      if (scrollBannerPoE2Img && imgScrollBanner) {
        const scrollCanvas = buildWideScrollBannerCanvas(scrollBannerPoE2Img);
        if (scrollCanvas) {
          imgScrollBanner.src = scrollCanvas.toDataURL('image/png');
        }
      }

      if (bottomDockPoE2Img) {
        const sheet = imageToCanvas(bottomDockPoE2Img);
        const imgData = sheet.ctx.getImageData(0, 0, sheet.width, sheet.height);
        const bands = findBandsY(imgData, sheet.height, isFgBlack, 24, 10);

        if (bands.length >= 2) {
          const dockBox = tightTrimBox(imgData, 0, bands[1].y0, sheet.width - 1, bands[1].y1, isFgBlack);
          if (dockBox && imgBottomDock) {
            const dockCanvas = cropCanvasRegion(sheet.canvas, dockBox);
            clearBlackBackgroundBFS(dockCanvas, { threshold: 14, featherHaloThreshold: 22 });
            applyPoE2BottomDockLayout(dockCanvas);
            imgBottomDock.src = dockCanvas.toDataURL('image/png');
          }
        }
      }

      // 5. Slice Golden Gauntlet for Bottom-Left Ground Loot Counter (#FFFFFF bg)
      {
        const sheet = imageToCanvas(scrollDockImg);
        const maxY = Math.floor(sheet.height * 0.91); // Excludes bottom-right watermark
        const imgData = sheet.ctx.getImageData(0, 0, sheet.width, sheet.height);
        const bands = findBandsY(imgData, maxY, isFgWhite, 16, 12);

        if (bands.length >= 3) {
          const gauntletBox = tightTrimBox(imgData, 0, bands[2].y0, sheet.width - 1, bands[2].y1, isFgWhite);
          if (gauntletBox && imgGauntlet) {
            const c = cropCanvasRegion(sheet.canvas, gauntletBox);
            clearWhiteBackgroundBFS(c);
            imgGauntlet.src = c.toDataURL('image/png');
          }
        }
      }

      // 6. Slice High-Detail Original PoE 2 Winged-Crest Post-Map Loot Breakdown Modal Sheets
      slicePoE2ModalAssets(modalFramePoE2Img, modalPanelsPoE2Img, modalControlsPoE2Img);
    } catch (err) {
      console.error('Failed to process UI sprite sheets:', err);
    } finally {
      document.body.classList.remove('assets-loading');
    }
  }

  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      if (helpModal && !helpModal.classList.contains('hidden')) {
        helpModal.classList.add('hidden');
      } else if (summaryModal && !summaryModal.classList.contains('hidden')) {
        summaryModal.classList.add('hidden');
      }
    }
  });

  // Expose helper API on window for debugging & automated verification
  window.DivineClicker = {
    state,
    audio,
    startMapRun,
    setMapMode,
    handleAstrolabeClick,
    spawnMonsterBurst,
    spawnCurrencyItem,
    toggleLabelsHidden,
    openSummaryModal,
    CURRENCY_TABLE,
    customAudioCache,
    modalAssets
  };

  // Initialize
  initAssetHotSwap();
  loadAndSliceUIAssets().then(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1' && !state.running) {
      startMapRun();
    }
  });
  resizeCanvas();
  initFogWisps();
  syncMuteUI();
  updateHUD();
  requestAnimationFrame(frameLoop);
})();
