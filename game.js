/* ==========================================================================
   DIVINE CLICKER — POE 2 & FILTERBLADE LOOT ENGINE (game.js)
   Standalone HTML5 / Canvas 60FPS / Custom S-Tier Audio / Fast Reflex Mode
   ========================================================================== */

(() => {
  'use strict';

  const MAX_CLUTTER_STRIKES = 3;

  // ---------------------------------------------------------------------------
  // 1. CURRENCY DEFINITIONS (16 PoE 2 Currencies — Total Weight = 100.0)
  // ---------------------------------------------------------------------------
  const CURRENCY_TABLE = [
    // Low-Tier Bait / Clutter (Negative Points — 3 Clicks = Game Over!)
    {
      id: 'scroll_wisdom',
      name: 'Scroll of Wisdom',
      tier: 'F',
      cssClass: 'tier-f',
      points: -20,
      weight: 31.4,
      beam: null,
      color: '#8c8270'
    },
    {
      id: 'orb_transmutation',
      name: 'Orb of Transmutation',
      tier: 'F',
      cssClass: 'tier-f',
      points: -10,
      weight: 20.0,
      beam: null,
      color: '#5b8dd9'
    },
    {
      id: 'orb_augmentation',
      name: 'Orb of Augmentation',
      tier: 'D',
      cssClass: 'tier-d',
      points: -15,
      weight: 15.0,
      beam: null,
      color: '#7aa690'
    },
    // Paired D-Tier (10% total -> 5% each)
    {
      id: 'armourers_scrap',
      name: "Armourer's Scrap",
      tier: 'D',
      cssClass: 'tier-d',
      points: -20,
      weight: 5.0,
      beam: null,
      color: '#9e978e'
    },
    {
      id: 'regal_shard',
      name: 'Regal Shard',
      tier: 'D',
      cssClass: 'tier-d',
      points: -20,
      weight: 5.0,
      beam: null,
      color: '#b89658'
    },

    // High-Tier Valuable Drops (Positive Points)
    {
      id: 'exalted_orb',
      name: 'Exalted Orb',
      tier: 'B',
      cssClass: 'tier-b',
      points: 25,
      weight: 10.0,
      beam: 'gold',
      color: '#ffd700'
    },
    // Paired A-Tier (7% total -> 3.5% each)
    {
      id: 'chaos_orb',
      name: 'Chaos Orb',
      tier: 'A',
      cssClass: 'tier-a',
      points: 35,
      weight: 3.5,
      beam: 'gold',
      color: '#e5a000'
    },
    {
      id: 'gemcutters_prism',
      name: "Gemcutter's Prism",
      tier: 'A',
      cssClass: 'tier-a',
      points: 35,
      weight: 3.5,
      beam: 'gold',
      color: '#2dd4bf'
    },
    // Paired A+ Tier (4% total -> 2.0% each)
    {
      id: 'greater_exalted_orb',
      name: 'Greater Exalted Orb',
      tier: 'A+',
      cssClass: 'tier-ap',
      points: 120,
      weight: 2.0,
      beam: 'gold-tall',
      color: '#ffae00'
    },
    {
      id: 'greater_chaos_orb',
      name: 'Greater Chaos Orb',
      tier: 'A+',
      cssClass: 'tier-ap',
      points: 120,
      weight: 2.0,
      beam: 'gold-tall',
      color: '#ff9900'
    },
    // Paired S-Tier Flagship (1.3% total -> 0.65% each)
    {
      id: 'divine_orb',
      name: 'Divine Orb',
      tier: 'S',
      cssClass: 'tier-s',
      points: 500,
      weight: 0.65,
      beam: 'divine',
      color: '#ff2222'
    },
    {
      id: 'perfect_jewellers_orb',
      name: "Perfect Jeweller's Orb",
      tier: 'S',
      cssClass: 'tier-s',
      points: 500,
      weight: 0.65,
      beam: 'divine',
      color: '#ff3838'
    },
    // Paired S-Tier Perfect Orbs (0.9% total -> 0.45% each)
    {
      id: 'perfect_exalted_orb',
      name: 'Perfect Exalted Orb',
      tier: 'S',
      cssClass: 'tier-s',
      points: 900,
      weight: 0.45,
      beam: 'divine',
      color: '#ff1111'
    },
    {
      id: 'perfect_chaos_orb',
      name: 'Perfect Chaos Orb',
      tier: 'S',
      cssClass: 'tier-s',
      points: 900,
      weight: 0.45,
      beam: 'divine',
      color: '#ff1111'
    },
    // S+ Tier Jackpot (0.3%)
    {
      id: 'hinekoras_lock',
      name: "Hinekora's Lock",
      tier: 'S+',
      cssClass: 'tier-sp',
      points: 1800,
      weight: 0.3,
      beam: 'mythic',
      color: '#ff1e1e'
    },
    // S++ Tier Mythic Jackpot (0.1%)
    {
      id: 'mirror_kalandra',
      name: 'Mirror of Kalandra',
      tier: 'S++',
      cssClass: 'tier-spp',
      points: 4000,
      weight: 0.1,
      beam: 'mythic',
      color: '#ff2222'
    }
  ];

  const TOTAL_WEIGHT = CURRENCY_TABLE.reduce((acc, item) => acc + item.weight, 0);

  function isSTierCurrency(c) {
    return Boolean(
      c && (c.cssClass === 'tier-s' || c.cssClass === 'tier-sp' || c.cssClass === 'tier-spp')
    );
  }

  // ---------------------------------------------------------------------------
  // 2. AUDIO & MECHANIC ICON LOADER (s_tier.mp3, below_s_tier.mp3, breach.webp, abyss.webp)
  // ---------------------------------------------------------------------------
  const customAudioCache = new Map();
  const mechanicIconCache = new Map();

  function initAssetHotSwap() {
    // Load the S-tier and below-S-tier drop sounds
    const sTierAudio = new Audio('./assets/sounds/s_tier.mp3?v=4');
    sTierAudio.preload = 'auto';
    customAudioCache.set('s_tier', sTierAudio);

    const belowSTierAudio = new Audio('./assets/sounds/below_s_tier.mp3?v=4');
    belowSTierAudio.preload = 'auto';
    customAudioCache.set('below_s_tier', belowSTierAudio);

    // Load Breach & Abyss icons
    const breachImg = new Image();
    breachImg.src = './assets/icons/breach.webp?v=4';
    mechanicIconCache.set('breach', breachImg);

    const abyssImg = new Image();
    abyssImg.src = './assets/icons/abyss.webp?v=4';
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
      this.lastBelowSDropTime = 0;
    }

    // Plays custom ./assets/sounds/s_tier.mp3 when S-Tier or higher (S / S+) drops
    playSTierDrop() {
      if (this.muted || this.volume <= 0) return;
      if (customAudioCache.has('s_tier')) {
        try {
          const clip = customAudioCache.get('s_tier').cloneNode();
          clip.volume = Math.min(1, this.volume * 0.75);
          clip.play().catch(() => {});
        } catch (_) {}
      }
    }

    // Plays custom ./assets/sounds/below_s_tier.mp3 when below S-Tier currency drops
    playBelowSTierDrop() {
      if (this.muted || this.volume <= 0) return;
      const now = performance.now();
      // Slight 35ms debounce so simultaneous multi-orb drops in the same burst frame don't clip
      if (now - this.lastBelowSDropTime < 35) return;
      this.lastBelowSDropTime = now;

      if (customAudioCache.has('below_s_tier')) {
        try {
          const clip = customAudioCache.get('below_s_tier').cloneNode();
          clip.volume = Math.min(1, this.volume * 0.85);
          clip.play().catch(() => {});
        } catch (_) {}
      }
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
  const imgDockBreach = document.getElementById('img-dock-breach');
  const dockAbyssSlot = document.getElementById('dock-abyss-slot');
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
  const dockLabelsOffBadge = document.getElementById('dock-labels-off-badge');
  const btnMute = document.getElementById('btn-mute');
  const muteSlash = document.getElementById('mute-slash');
  const sliderVolume = document.getElementById('slider-volume');

  // Post-Map Summary Modal & Help Modal
  const summaryModal = document.getElementById('summary-modal');
  const summaryModalFrame = document.getElementById('summary-modal-frame');
  const modalFrameCanvas = document.getElementById('modal-frame-canvas');
  const summaryModalContent = document.getElementById('summary-modal-content');
  const imgModalClose = document.getElementById('img-modal-close');
  const imgModalStatBar = document.getElementById('img-modal-stat-bar');
  const modalStatCells = [
    document.getElementById('modal-kpi-final'),
    document.getElementById('modal-kpi-best'),
    document.getElementById('modal-kpi-streak'),
    document.getElementById('modal-kpi-integrity'),
    document.getElementById('modal-kpi-accuracy')
  ];
  const imgLedgerHeader = document.getElementById('img-ledger-header');
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
    greater_chaos_orb: './assets/icons/currency/chaos_orb.webp',
    greater_exalted_orb: './assets/icons/currency/exalted_orb.webp',
    chaos_orb: './assets/icons/currency/chaos_orb.webp',
    gemcutters_prism: './assets/icons/currency/gemcutters_prism.webp',
    exalted_orb: './assets/icons/currency/exalted_orb.webp',
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
    if (dockLabelsOffBadge) {
      dockLabelsOffBadge.classList.toggle('hidden', !state.labelsHidden);
    }
    if (btnToggleLabels) {
      btnToggleLabels.setAttribute('aria-pressed', String(!state.labelsHidden));
    }
    setFeed(
      state.labelsHidden
        ? 'Ground labels hidden ([Z]). Click directly on loot beams/orbs or toggle LABELS: OFF.'
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
    if (bonusHighTier && Math.random() < 0.5) {
      const highPool = CURRENCY_TABLE.filter((c) => c.points > 0);
      const highWeight = highPool.reduce((sum, c) => sum + c.weight, 0);
      let r = Math.random() * highWeight;
      for (const item of highPool) {
        if (r < item.weight) return item;
        r -= item.weight;
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
    const baseY = clampY(item.anchorY - 18);

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
      labelY: anchorY - 18,
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

    // Play drop sounds when items drop on the ground (S-tier vs below S-tier currency)
    if (isSTierCurrency(currencyDef)) {
      audio.playSTierDrop();
    } else if (currencyDef.points > 0) {
      audio.playBelowSTierDrop();
    }

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
    triggerAstrolabePulse();
    if (!state.running) {
      startMapRun();
      return;
    }
    const { cx, cy } = getAstrolabeCenterAndRadius();
    spawnMonsterBurst({
      x: cx,
      y: cy,
      count: 4,
      guaranteeHigh: true
    });
    setFeed('Astrolabe pulsed — currency dropped around the Atlas!');
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

    if (!interactive && isPointInsideAstrolabe(x, y)) {
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

    // 3. Central Astrolabe click: start idle map or pulse currency burst during active run
    if (isPointInsideAstrolabe(x, y)) {
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
    if (astrolabeStage) astrolabeStage.classList.add('is-active-map');
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
    if (astrolabeStage) astrolabeStage.classList.remove('is-active-map');
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

    const cols = modalAssets.rowLayout || [
      { left: 0.9, width: 6.1 },   // Socket
      { left: 7.4, width: 24.4 },  // Currency Item
      { left: 32.2, width: 8.7 },  // Tier
      { left: 41.3, width: 11.7 }, // Base Pts
      { left: 53.5, width: 12.1 }, // Clicked
      { left: 66.0, width: 12.1 }, // Missed
      { left: 78.6, width: 20.6 }  // Net Points
    ];

    const cellStyle = (idx) => {
      const c = cols[idx] || cols[0];
      return `left:${c.left.toFixed(3)}%;width:${c.width.toFixed(3)}%;`;
    };

    // Populate all 16 currencies ordered from S++ / S+ / S-Tier down to F-Tier
    const ordered = [...CURRENCY_TABLE].sort((a, b) => b.points - a.points);
    breakdownTbody.innerHTML = ordered
      .map((c) => {
        const st = state.statsByCurrency[c.id] || { clicked: 0, missed: 0, netPoints: 0 };
        const baseStr = c.points > 0 ? `+${c.points}` : String(c.points);
        const baseClass = c.points > 0 ? 'num-base-pos' : 'num-base-neg';
        const clickedClass = st.clicked > 0 ? 'num-count-active' : 'num-count-zero';
        const missedClass = st.missed > 0 ? 'num-count-active' : 'num-count-zero';
        const netClass =
          st.netPoints > 0 ? 'num-net-pos' : st.netPoints < 0 ? 'num-net-neg' : 'num-net-zero';
        const netStr =
          st.netPoints > 0
            ? `+${st.netPoints.toLocaleString()}`
            : st.netPoints.toLocaleString();

        const orbUrl = modalAssets.currencyIcons.get(c.id) || '';
        const orbVariantClass = c.id.startsWith('perfect_')
          ? 'orb-perfect'
          : c.id.startsWith('greater_')
          ? 'orb-greater'
          : '';
        const badgeUrl = modalAssets.tierBadges.get(c.tier) || '';
        const rowBg = modalAssets.rowBgUrl || '';

        return `
          <div class="ledger-row" role="row" data-currency-id="${c.id}">
            ${rowBg ? `<img class="ui-slice ledger-row-bg" src="${rowBg}" alt="" aria-hidden="true" />` : '<div class="ledger-row-fallback"></div>'}
            <div class="ledger-cell row-socket-cell" role="cell" style="${cellStyle(0)}">
              ${orbUrl ? `<img class="row-orb-icon ${orbVariantClass}" src="${orbUrl}" alt="" />` : ''}
            </div>
            <div class="ledger-cell row-col-name" role="cell" style="${cellStyle(1)}">
              <span class="ledger-currency-name">${c.name}</span>
            </div>
            <div class="ledger-cell row-col-tier" role="cell" style="${cellStyle(2)}">
              ${badgeUrl ? `<img class="row-tier-badge" src="${badgeUrl}" alt="${c.tier}" />` : `<span>${c.tier}</span>`}
            </div>
            <div class="ledger-cell row-col-num ${baseClass}" role="cell" style="${cellStyle(3)}">
              <span>${baseStr}</span>
            </div>
            <div class="ledger-cell row-col-num ${clickedClass}" role="cell" style="${cellStyle(4)}">
              <span>${st.clicked}</span>
            </div>
            <div class="ledger-cell row-col-num ${missedClass}" role="cell" style="${cellStyle(5)}">
              <span>${st.missed}</span>
            </div>
            <div class="ledger-cell row-col-num ${netClass}" role="cell" style="${cellStyle(6)}">
              <span>${netStr}</span>
            </div>
          </div>
        `;
      })
      .join('');

    summaryModal.classList.remove('hidden');
    requestAnimationFrame(() => {
      renderModalFrameCanvas();
    });
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

    // 5. Persistent Vertical FilterBlade Loot Beams (NO icons or orb circles on dropped items)
    for (const item of state.items) {
      const ax = item.anchorX;
      const ay = item.anchorY;

      if (item.currency.beam) {
        const isDivine = item.currency.beam === 'divine' || item.currency.beam === 'mythic';
        const beamHeight =
          item.currency.beam === 'mythic' ? 245 : isDivine ? 225 : item.currency.beam === 'gold-tall' ? 160 : 120;
        const beamWidth = item.currency.beam === 'mythic' ? 20 : isDivine ? 16 : 10;
        const shimmer = 0.84 + 0.16 * Math.sin(now * 0.012 + item.id);

        ctx.save();
        const beamGrad = ctx.createLinearGradient(ax, ay, ax, ay - beamHeight);
        if (item.currency.beam === 'mythic') {
          beamGrad.addColorStop(0, `rgba(255, 32, 32, ${0.98 * shimmer})`);
          beamGrad.addColorStop(0.5, `rgba(255, 68, 68, ${0.62 * shimmer})`);
          beamGrad.addColorStop(1, 'rgba(255, 20, 20, 0)');
        } else if (isDivine) {
          beamGrad.addColorStop(0, `rgba(255, 28, 28, ${0.95 * shimmer})`);
          beamGrad.addColorStop(0.55, `rgba(235, 35, 35, ${0.52 * shimmer})`);
          beamGrad.addColorStop(1, 'rgba(220, 15, 15, 0)');
        } else if (item.currency.beam === 'gold-tall') {
          beamGrad.addColorStop(0, `rgba(255, 118, 55, ${0.88 * shimmer})`);
          beamGrad.addColorStop(0.55, `rgba(244, 96, 74, ${0.44 * shimmer})`);
          beamGrad.addColorStop(1, 'rgba(244, 96, 74, 0)');
        } else {
          beamGrad.addColorStop(0, `rgba(255, 206, 115, ${0.82 * shimmer})`);
          beamGrad.addColorStop(0.55, `rgba(223, 167, 80, ${0.38 * shimmer})`);
          beamGrad.addColorStop(1, 'rgba(223, 167, 80, 0)');
        }

        ctx.fillStyle = beamGrad;
        ctx.fillRect(ax - beamWidth / 2, ay - beamHeight, beamWidth, beamHeight);

        const coreGrad = ctx.createLinearGradient(ax, ay, ax, ay - beamHeight * 0.92);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.45, isDivine ? '#ff7a7a' : '#fff0c4');
        coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = coreGrad;
        ctx.fillRect(ax - 1.5, ay - beamHeight * 0.92, 3, beamHeight * 0.92);
        ctx.restore();
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
          od[off] = Math.round(srcData[off] * weight);
          od[off + 1] = Math.round(srcData[off + 1] * weight);
          od[off + 2] = Math.round(srcData[off + 2] * weight);
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
      imgAstrolabeOuter.src = makeLayer((rn) => smoothStep(0.293 - f, 0.293 + f, rn));
    }
    if (imgAstrolabeMid) {
      imgAstrolabeMid.src = makeLayer(
        (rn) =>
          smoothStep(0.155 - f, 0.155 + f, rn) *
          (1 - smoothStep(0.298 - f, 0.298 + f, rn))
      );
    }
    if (imgAstrolabeCore) {
      imgAstrolabeCore.src = makeLayer((rn) => 1 - smoothStep(0.16 - f, 0.16 + f, rn));
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

  function sliceModalStatBar(statBarImg) {
    const isFgBlack = (r, g, b) => Math.max(r, g, b) > 12;
    const sheet = imageToCanvas(statBarImg);
    const imgData = sheet.ctx.getImageData(0, 0, sheet.width, sheet.height);
    const box = tightTrimBox(imgData, 0, 0, sheet.width - 1, sheet.height - 1, isFgBlack);
    if (!box) return;

    const c = cropCanvasRegion(sheet.canvas, box);
    clearBlackBackgroundBFS(c, { threshold: 12 });
    const w = c.width;
    const h = c.height;
    const data = c.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;

    // Detect the 5 recessed dark interior cell wells below the baked uppercase labels
    const yBand0 = Math.floor(h * 0.48);
    const yBand1 = Math.ceil(h * 0.76);
    const isCellCol = new Uint8Array(w);
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
      if (cnt > 0 && sumLum / cnt < 39 && maxLum < 50) {
        isCellCol[x] = 1;
      }
    }

    const cellBoxes = [];
    let inRun = false;
    let runStart = 0;
    for (let x = 0; x < w; x++) {
      if (isCellCol[x] && !inRun) {
        inRun = true;
        runStart = x;
      } else if (!isCellCol[x] && inRun) {
        inRun = false;
        if (x - runStart >= w * 0.10) {
          cellBoxes.push({ x0: runStart, x1: x - 1 });
        }
      }
    }
    if (inRun && w - runStart >= w * 0.10) {
      cellBoxes.push({ x0: runStart, x1: w - 1 });
    }

    let topPct = 42;
    let heightPct = 36;
    if (cellBoxes.length === 5) {
      const sample = cellBoxes[0];
      const sx0 = Math.floor(sample.x0 + (sample.x1 - sample.x0) * 0.18);
      const sx1 = Math.ceil(sample.x1 - (sample.x1 - sample.x0) * 0.18);

      let lastHeaderRow = Math.round(h * 0.40);
      for (let y = Math.floor(h * 0.18); y <= Math.floor(h * 0.48); y++) {
        for (let x = sx0; x <= sx1; x++) {
          const off = (y * w + x) * 4;
          const lum = 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
          if (lum >= 68) {
            lastHeaderRow = y;
            break;
          }
        }
      }

      let boxBotY = Math.round(h * 0.80);
      for (let y = Math.floor(h * 0.56); y <= Math.floor(h * 0.90); y++) {
        let sum = 0;
        let cnt = 0;
        for (let x = sx0; x <= sx1; x++) {
          const off = (y * w + x) * 4;
          sum += 0.299 * data[off] + 0.587 * data[off + 1] + 0.114 * data[off + 2];
          cnt++;
        }
        if (cnt > 0 && sum / cnt >= 40) {
          boxBotY = y - 1;
          break;
        }
      }

      const startY = Math.min(boxBotY - 10, lastHeaderRow + 2);
      topPct = (startY / h) * 100;
      heightPct = ((boxBotY - startY) / h) * 100;
    }

    if (cellBoxes.length === 5) {
      modalStatCells.forEach((cell, idx) => {
        if (!cell) return;
        const b = cellBoxes[idx];
        cell.style.left = `${(b.x0 / w) * 100}%`;
        cell.style.width = `${((b.x1 - b.x0 + 1) / w) * 100}%`;
        cell.style.top = `${topPct}%`;
        cell.style.height = `${heightPct}%`;
      });
    } else {
      const intLeft = Math.round(w * 0.036);
      const cellW = (w * 0.928) / 5;
      modalStatCells.forEach((cell, idx) => {
        if (!cell) return;
        cell.style.left = `${((intLeft + cellW * idx) / w) * 100}%`;
        cell.style.width = `${(cellW / w) * 100}%`;
        cell.style.top = '42%';
        cell.style.height = '36%';
      });
    }

    if (imgModalStatBar) {
      imgModalStatBar.src = c.toDataURL('image/png');
    }
  }

  function sliceModalLedger(ledgerImg) {
    const isFgBlack = (r, g, b) => Math.max(r, g, b) > 12;
    const sheet = imageToCanvas(ledgerImg);
    const imgData = sheet.ctx.getImageData(0, 0, sheet.width, sheet.height);
    const bands = findBandsY(imgData, sheet.height, isFgBlack, 18, 6);
    if (bands.length < 2) return;

    const hdrBox = tightTrimBox(imgData, 0, bands[0].y0, sheet.width - 1, bands[0].y1, isFgBlack);
    const rowBox = tightTrimBox(imgData, 0, bands[1].y0, sheet.width - 1, bands[1].y1, isFgBlack);
    if (!hdrBox || !rowBox) return;

    const hdrCanvas = cropCanvasRegion(sheet.canvas, hdrBox);
    clearBlackBackgroundBFS(hdrCanvas, { threshold: 10 });

    const rowCanvas = cropCanvasRegion(sheet.canvas, rowBox);
    clearBlackBackgroundBFS(rowCanvas, { threshold: 10 });

    // Scan Repeatable Row Template for exact 7 cell X intervals: [Socket, Name, Tier, BasePts, Clicked, Missed, NetPoints]
    const rw = rowCanvas.width;
    const rh = rowCanvas.height;
    const rdata = rowCanvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, rw, rh).data;
    const y0 = Math.floor(rh * 0.25);
    const y1 = Math.ceil(rh * 0.75);
    const isWellCol = new Uint8Array(rw);

    for (let x = 0; x < rw; x++) {
      let sumLum = 0;
      let cnt = 0;
      for (let y = y0; y <= y1; y++) {
        const off = (y * rw + x) * 4;
        if (rdata[off + 3] < 128) continue;
        sumLum += 0.299 * rdata[off] + 0.587 * rdata[off + 1] + 0.114 * rdata[off + 2];
        cnt++;
      }
      if (cnt > 0 && sumLum / cnt < 34) {
        isWellCol[x] = 1;
      }
    }

    const wells = [];
    let inRun = false;
    let rStart = 0;
    const minColW = Math.max(18, Math.round(rw * 0.025));
    for (let x = 0; x < rw; x++) {
      if (isWellCol[x] && !inRun) {
        inRun = true;
        rStart = x;
      } else if (!isWellCol[x] && inRun) {
        inRun = false;
        if (x - rStart >= minColW) wells.push({ x0: rStart, x1: x - 1 });
      }
    }
    if (inRun && rw - rStart >= minColW) {
      wells.push({ x0: rStart, x1: rw - 1 });
    }

    if (wells.length === 7) {
      modalAssets.rowLayout = wells.map((b) => ({
        left: (b.x0 / rw) * 100,
        width: ((b.x1 - b.x0 + 1) / rw) * 100
      }));
    } else {
      modalAssets.rowLayout = [
        { left: 1.0, width: 6.0 },
        { left: 7.6, width: 24.4 },
        { left: 32.4, width: 8.6 },
        { left: 41.5, width: 11.7 },
        { left: 53.7, width: 12.1 },
        { left: 66.2, width: 12.1 },
        { left: 78.8, width: 20.4 }
      ];
    }

    modalAssets.rowBgUrl = rowCanvas.toDataURL('image/png');

    // Crop out any blank bottom preview spacer underneath the header title pills
    const hw = hdrCanvas.width;
    const hh = hdrCanvas.height;
    const hctx = hdrCanvas.getContext('2d', { willReadFrequently: true });
    const hdata = hctx.getImageData(0, 0, hw, hh).data;
    const col1Layout = modalAssets.rowLayout[1];
    const c1x0 = Math.round(hw * ((col1Layout.left + 2) / 100));
    const c1x1 = Math.round(hw * ((col1Layout.left + col1Layout.width - 2) / 100));

    let cleanCropH = hh;
    for (let y = Math.floor(hh * 0.42); y < Math.floor(hh * 0.85); y++) {
      let sum = 0;
      let maxL = 0;
      let cnt = 0;
      for (let x = c1x0; x <= c1x1; x++) {
        const off = (y * hw + x) * 4;
        const lum = 0.299 * hdata[off] + 0.587 * hdata[off + 1] + 0.114 * hdata[off + 2];
        sum += lum;
        if (lum > maxL) maxL = lum;
        cnt++;
      }
      if (cnt > 0 && sum / cnt < 22 && maxL < 30) {
        cleanCropH = Math.max(Math.round(hh * 0.48), y);
        break;
      }
    }

    let finalHdr = hdrCanvas;
    if (cleanCropH < hh - 4) {
      finalHdr = cropCanvasRegion(hdrCanvas, { x: 0, y: 0, w: hw, h: cleanCropH });
      // Copy bottom metallic 3px rim from original hdrCanvas bottom across cleanly so bottom border is sealed
      const fctx = finalHdr.getContext('2d');
      fctx.drawImage(hdrCanvas, 0, hh - 3, hw, 3, 0, cleanCropH - 3, hw, 3);
    }

    if (imgLedgerHeader) {
      imgLedgerHeader.src = finalHdr.toDataURL('image/png');
    }
  }

  function sliceModalBadgesAndButtons(badgesImg) {
    const isFgBlack = (r, g, b) => Math.max(r, g, b) > 12;
    const sheet = imageToCanvas(badgesImg);
    const w = sheet.width;
    const imgData = sheet.ctx.getImageData(0, 0, w, sheet.height);
    const sdata = imgData.data;
    const bands = findBandsY(imgData, sheet.height, isFgBlack, 20, 8);
    if (bands.length < 2) return;

    // Row 0: 8 Tier Shields (S++, S+, S, A+, A, B, D, F) via minimum column-energy valley splits
    const b0 = bands[0];
    const colSum = new Float64Array(w);
    let rowX0 = w;
    let rowX1 = 0;
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let y = b0.y0; y <= b0.y1; y++) {
        const off = (y * w + x) * 4;
        const m = Math.max(sdata[off], sdata[off + 1], sdata[off + 2]);
        if (m > 12) sum += m;
      }
      colSum[x] = sum;
      if (sum > 80) {
        if (x < rowX0) rowX0 = x;
        if (x > rowX1) rowX1 = x;
      }
    }

    const tierOrder = ['S++', 'S+', 'S', 'A+', 'A', 'B', 'D', 'F'];
    const rowSpan = Math.max(200, rowX1 - rowX0 + 1);
    const slotW = rowSpan / 8;
    const bounds = [Math.max(0, rowX0 - 4)];
    for (let k = 1; k < 8; k++) {
      const approxX = rowX0 + k * slotW;
      const win0 = Math.max(1, Math.floor(approxX - slotW * 0.28));
      const win1 = Math.min(w - 2, Math.ceil(approxX + slotW * 0.28));
      let bestX = Math.round(approxX);
      let minVal = Infinity;
      for (let x = win0; x <= win1; x++) {
        if (colSum[x] < minVal) {
          minVal = colSum[x];
          bestX = x;
        }
      }
      bounds.push(bestX);
    }
    bounds.push(Math.min(w - 1, rowX1 + 4));

    for (let i = 0; i < 8; i++) {
      const lx = Math.max(0, bounds[i]);
      const rx = Math.min(w - 1, bounds[i + 1]);
      if (rx <= lx + 12) continue;
      const tight = tightTrimBox(imgData, lx, b0.y0, rx, b0.y1, isFgBlack);
      if (!tight) continue;
      const c = cropCanvasRegion(sheet.canvas, tight);
      clearBlackBackgroundBFS(c, {
        threshold: 10,
        featherHaloThreshold: 26,
        unpremultiply: true
      });
      modalAssets.tierBadges.set(tierOrder[i], trimCanvasByAlpha(c, 12).toDataURL('image/png'));
    }

    // Row 1: Action buttons ("RUN ANOTHER MAP", "CLOSE BREAKDOWN")
    const b1 = bands[1];
    const btnIslands = findIslandsX(imgData, b1.y0, b1.y1, isFgBlack, 100, 14);
    if (btnIslands.length >= 2) {
      const replayCanvas = cropCanvasRegion(sheet.canvas, btnIslands[0]);
      clearBlackBackgroundBFS(replayCanvas, { threshold: 10, featherHaloThreshold: 22, unpremultiply: true });
      const replayTrim = trimCanvasByAlpha(replayCanvas, 12);
      if (imgBtnReplay) imgBtnReplay.src = replayTrim.toDataURL('image/png');

      const dismissCanvas = cropCanvasRegion(sheet.canvas, btnIslands[1]);
      clearBlackBackgroundBFS(dismissCanvas, { threshold: 10, featherHaloThreshold: 22, unpremultiply: true });
      const dismissTrim = trimCanvasByAlpha(dismissCanvas, 12);
      if (imgBtnDismiss) imgBtnDismiss.src = dismissTrim.toDataURL('image/png');
    }
  }

  function prepareModalBackdropParts(backdropImg) {
    const sheet = imageToCanvas(backdropImg);
    const w = sheet.width;
    const h = sheet.height;
    const sdata = sheet.ctx.getImageData(0, 0, w, h).data;

    // 1. Locate exact inner modal vertical riveted side rails (skipping dim outer vignette margins)
    const yScan0 = Math.floor(h * 0.25);
    const yScan1 = Math.ceil(h * 0.65);
    const colAvgLum = new Float32Array(w);
    for (let x = 0; x < w; x++) {
      let sum = 0;
      let cnt = 0;
      for (let y = yScan0; y <= yScan1; y++) {
        const off = (y * w + x) * 4;
        sum += 0.299 * sdata[off] + 0.587 * sdata[off + 1] + 0.114 * sdata[off + 2];
        cnt++;
      }
      colAvgLum[x] = cnt > 0 ? sum / cnt : 0;
    }

    let frameX0 = -1;
    for (let x = Math.floor(w * 0.05); x <= Math.floor(w * 0.35); x++) {
      if (colAvgLum[x] >= 30) {
        let edge = x;
        while (edge > 0 && colAvgLum[edge - 1] >= 16) edge--;
        frameX0 = edge;
        break;
      }
    }
    let frameX1 = -1;
    for (let x = Math.floor(w * 0.95); x >= Math.floor(w * 0.65); x--) {
      if (colAvgLum[x] >= 30) {
        let edge = x;
        while (edge < w - 1 && colAvgLum[edge + 1] >= 16) edge++;
        frameX1 = edge;
        break;
      }
    }
    if (frameX0 === -1 || frameX1 <= frameX0 + 160) {
      frameX0 = Math.round(w * 0.147);
      frameX1 = Math.round(w * 0.853);
    }
    const frameW = frameX1 - frameX0 + 1;
    const upperH = Math.floor(h * 0.88);

    const bodyCanvas = cropCanvasRegion(sheet.canvas, { x: frameX0, y: 0, w: frameW, h: upperH });
    const bctx = bodyCanvas.getContext('2d', { willReadFrequently: true });

    // Clear outer top black corners above crest/rails safely (clamped to top 9.5% so interior never leaks)
    {
      const topH = Math.floor(h * 0.095);
      const topCap = cropCanvasRegion(bodyCanvas, { x: 0, y: 0, w: frameW, h: topH });
      clearBlackBackgroundBFS(topCap, { threshold: 12, featherHaloThreshold: 20 });
      bctx.clearRect(0, 0, frameW, topH);
      bctx.drawImage(topCap, 0, 0);
    }

    const bImgData = bctx.getImageData(0, 0, frameW, upperH);
    const bdata = bImgData.data;

    // 2. Measure left/right vertical riveted rail thicknesses at y = 0.45h
    const yMid = Math.floor(upperH * 0.45);
    let railL = 22;
    for (let x = 6; x < Math.min(52, Math.floor(frameW * 0.08)); x++) {
      const off = (yMid * frameW + x) * 4;
      const lum = 0.299 * bdata[off] + 0.587 * bdata[off + 1] + 0.114 * bdata[off + 2];
      if (lum < 25) {
        railL = x + 3;
        break;
      }
    }
    let railR = 22;
    for (let dx = 6; dx < Math.min(52, Math.floor(frameW * 0.08)); dx++) {
      const x = frameW - 1 - dx;
      const off = (yMid * frameW + x) * 4;
      const lum = 0.299 * bdata[off] + 0.587 * bdata[off + 1] + 0.114 * bdata[off + 2];
      if (lum < 25) {
        railR = dx + 3;
        break;
      }
    }

    // 3. Cleanly erase baked sample subtitle ("Game Over! Collected 3 Minus-Value Clutter Drops...") from interior charcoal
    const refY = Math.floor(h * 0.185);
    let refSumLum = 0;
    let refCnt = 0;
    for (let x = Math.floor(frameW * 0.25); x < Math.ceil(frameW * 0.75); x++) {
      const off = (refY * frameW + x) * 4;
      refSumLum += 0.299 * bdata[off] + 0.587 * bdata[off + 1] + 0.114 * bdata[off + 2];
      refCnt++;
    }
    const refLum = refCnt > 0 ? refSumLum / refCnt : 16;

    let subY0 = upperH;
    let subY1 = 0;
    let subX0 = frameW;
    let subX1 = 0;
    for (let y = Math.floor(h * 0.090); y <= Math.ceil(h * 0.148); y++) {
      for (let x = railL + 20; x <= frameW - railR - 20; x++) {
        const off = (y * frameW + x) * 4;
        const lum = 0.299 * bdata[off] + 0.587 * bdata[off + 1] + 0.114 * bdata[off + 2];
        if (lum > refLum + 9 && lum > 27) {
          if (y < subY0) subY0 = y;
          if (y > subY1) subY1 = y;
          if (x < subX0) subX0 = x;
          if (x > subX1) subX1 = x;
        }
      }
    }
    if (subY1 >= subY0 && subX1 > subX0) {
      const sy0 = Math.max(Math.floor(h * 0.088), subY0 - 4);
      const sy1 = Math.min(refY - 2, subY1 + 5);
      const sx0 = Math.max(railL + 12, subX0 - 10);
      const sx1 = Math.min(frameW - railR - 12, subX1 + 10);
      const ySampleTop = sy0 - 2;
      const ySampleBot = sy1 + 3;

      for (let y = sy0; y <= sy1; y++) {
        const t = (y - sy0) / Math.max(1, sy1 - sy0);
        for (let x = sx0; x <= sx1; x++) {
          const topOff = (ySampleTop * frameW + x) * 4;
          const botOff = (ySampleBot * frameW + x) * 4;
          const topLum = 0.299 * bdata[topOff] + 0.587 * bdata[topOff + 1] + 0.114 * bdata[topOff + 2];
          const useTop = topLum >= refLum - 4 && topLum <= refLum + 7;
          const rA = useTop ? bdata[topOff] : bdata[botOff];
          const gA = useTop ? bdata[topOff + 1] : bdata[botOff + 1];
          const bA = useTop ? bdata[topOff + 2] : bdata[botOff + 2];
          const dstOff = (y * frameW + x) * 4;
          const grain = (((x * 73 + y * 151) % 3) - 1);
          bdata[dstOff] = Math.max(0, Math.min(255, Math.round(rA * (1 - t) + bdata[botOff] * t + grain)));
          bdata[dstOff + 1] = Math.max(0, Math.min(255, Math.round(gA * (1 - t) + bdata[botOff + 1] * t + grain)));
          bdata[dstOff + 2] = Math.max(0, Math.min(255, Math.round(bA * (1 - t) + bdata[botOff + 2] * t + grain)));
          bdata[dstOff + 3] = 255;
        }
      }
      bctx.putImageData(bImgData, 0, 0);
    }

    // 4. Detect tight crest span [crestX0 .. crestX1] & top-right [X] close button inside frameW
    // Scan inside y = 0.042h..0.082h (below flat top rail, where ONLY the arched title banner & corner filigree exist)
    let crestX0 = Math.round(frameW * 0.22);
    let crestX1 = Math.round(frameW * 0.78);
    const yCrest0 = Math.floor(h * 0.042);
    const yCrest1 = Math.floor(h * 0.082);
    for (let x = Math.floor(frameW * 0.18); x <= Math.floor(frameW * 0.42); x++) {
      let brightCnt = 0;
      for (let y = yCrest0; y <= yCrest1; y++) {
        const off = (y * frameW + x) * 4;
        if (bdata[off + 3] > 128) {
          const lum = 0.299 * bdata[off] + 0.587 * bdata[off + 1] + 0.114 * bdata[off + 2];
          if (lum >= 45) brightCnt++;
        }
      }
      if (brightCnt >= 4) {
        crestX0 = x - 8;
        break;
      }
    }
    for (let x = Math.floor(frameW * 0.82); x >= Math.floor(frameW * 0.58); x--) {
      let brightCnt = 0;
      for (let y = yCrest0; y <= yCrest1; y++) {
        const off = (y * frameW + x) * 4;
        if (bdata[off + 3] > 128) {
          const lum = 0.299 * bdata[off] + 0.587 * bdata[off + 1] + 0.114 * bdata[off + 2];
          if (lum >= 45) brightCnt++;
        }
      }
      if (brightCnt >= 4) {
        crestX1 = x + 8;
        break;
      }
    }
    crestX0 = Math.max(Math.round(frameW * 0.18), Math.min(Math.round(frameW * 0.28), crestX0));
    crestX1 = Math.min(Math.round(frameW * 0.82), Math.max(Math.round(frameW * 0.72), crestX1));

    const topRailH = Math.max(16, Math.round(h * 0.036));

    // Locate [X] square button cleanly inside top-right corner, stopping short of right riveted rail edge
    let cxMin = frameW;
    let cxMax = 0;
    const xCloseScanMin = Math.max(crestX1 + 18, Math.floor(frameW * 0.865));
    const xCloseScanMax = frameW - Math.max(7, Math.round(railR * 0.65));
    const yBtnMid0 = Math.max(topRailH + 2, Math.floor(h * 0.038));
    const yBtnMid1 = Math.floor(h * 0.086);
    for (let x = xCloseScanMin; x <= xCloseScanMax; x++) {
      let brightCol = 0;
      for (let y = yBtnMid0; y <= yBtnMid1; y++) {
        const off = (y * frameW + x) * 4;
        if (bdata[off + 3] > 128) {
          const lum = 0.299 * bdata[off] + 0.587 * bdata[off + 1] + 0.114 * bdata[off + 2];
          if (lum >= 56) brightCol++;
        }
      }
      if (brightCol >= 3) {
        if (x < cxMin) cxMin = x;
        if (x > cxMax) cxMax = x;
      }
    }
    let cyMin = upperH;
    let cyMax = 0;
    if (cxMax > cxMin + 12) {
      const xIn0 = Math.min(cxMax, cxMin + 3);
      const xIn1 = Math.max(cxMin, cxMax - 3);
      for (let y = Math.floor(h * 0.014); y <= Math.floor(h * 0.098); y++) {
        let brightRow = 0;
        for (let x = xIn0; x <= xIn1; x++) {
          const off = (y * frameW + x) * 4;
          if (bdata[off + 3] > 128) {
            const lum = 0.299 * bdata[off] + 0.587 * bdata[off + 1] + 0.114 * bdata[off + 2];
            if (lum >= 54) brightRow++;
          }
        }
        if (brightRow >= 4) {
          if (y < cyMin) cyMin = y;
          if (y > cyMax) cyMax = y;
        }
      }
    }
    const closeBox =
      cxMax > cxMin + 16 && cyMax > cyMin + 16
        ? { x: cxMin - 1, y: cyMin - 1, w: cxMax - cxMin + 3, h: cyMax - cyMin + 3 }
        : {
            x: Math.round(frameW * 0.90),
            y: Math.round(h * 0.022),
            w: Math.round(frameW * 0.062),
            h: Math.round(h * 0.068)
          };

    const closeSpriteCanvas = cropCanvasRegion(sheet.canvas, {
      x: frameX0 + closeBox.x,
      y: closeBox.y,
      w: closeBox.w,
      h: closeBox.h
    });
    if (imgModalClose) {
      imgModalClose.src = closeSpriteCanvas.toDataURL('image/png');
    }

    // 5. Locate bottom riveted horizontal rail at bottom of original backdrop sheet & build crisp bottom strip
    let botRailY0 = Math.floor(h * 0.955);
    for (let y = h - 4; y >= Math.floor(h * 0.88); y--) {
      let sumLum = 0;
      let cnt = 0;
      for (let x = Math.floor(w * 0.35); x <= Math.ceil(w * 0.65); x++) {
        const off = (y * w + x) * 4;
        sumLum += 0.299 * sdata[off] + 0.587 * sdata[off + 1] + 0.114 * sdata[off + 2];
        cnt++;
      }
      if (cnt > 0 && sumLum / cnt < 18) {
        botRailY0 = Math.min(h - 16, y + 1);
        break;
      }
    }
    const botRailH = Math.max(18, h - botRailY0);
    const topCornerW = Math.round(railL * 2.55);
    const topCornerRW = Math.min(Math.round(frameW * 0.09), Math.max(Math.round(railR * 1.9), frameW - closeBox.x + 2));
    const topCornerH = Math.round(h * 0.128);
    const crestH = Math.round(h * 0.088);

    // Build clean alpha-feathered top overlays so dark source vignette never forms rectangular blocks over interior charcoal
    const extractTopOverlay = (sx, sy, sw, sh, solidX0, solidX1, solidY1, maskCloseRect = false) => {
      const piece = cropCanvasRegion(bodyCanvas, { x: sx, y: sy, w: sw, h: sh });
      const pctx = piece.getContext('2d', { willReadFrequently: true });
      const pImg = pctx.getImageData(0, 0, sw, sh);
      const pdata = pImg.data;
      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const off = (y * sw + x) * 4;
          if (pdata[off + 3] === 0) continue;
          const absX = sx + x;
          if (
            maskCloseRect &&
            absX >= closeBox.x - 2 &&
            absX <= closeBox.x + closeBox.w + 1 &&
            y >= Math.max(topRailH, closeBox.y - 1) &&
            y <= closeBox.y + closeBox.h + 2
          ) {
            pdata[off + 3] = 0;
            continue;
          }
          const inRail = absX < solidX0 || absX >= solidX1 || y < solidY1;
          if (inRail) continue;
          const lum = 0.299 * pdata[off] + 0.587 * pdata[off + 1] + 0.114 * pdata[off + 2];
          if (lum <= 18) {
            pdata[off + 3] = 0;
          } else if (lum < 32) {
            const factor = (lum - 18) / 14;
            pdata[off + 3] = Math.round(pdata[off + 3] * factor);
          }
        }
      }
      pctx.putImageData(pImg, 0, 0);
      return piece;
    };

    const topCornerLCanvas = extractTopOverlay(0, 0, topCornerW, topCornerH, railL, frameW, topRailH, false);
    const topCornerRCanvas = extractTopOverlay(
      frameW - topCornerRW,
      0,
      topCornerRW,
      topCornerH,
      0,
      frameW - railR,
      topRailH,
      true
    );
    const crestCanvas = extractTopOverlay(crestX0, 0, crestX1 - crestX0, crestH, 0, frameW, topRailH, false);

    const botRailCanvas = document.createElement('canvas');
    botRailCanvas.width = frameW;
    botRailCanvas.height = botRailH;
    const brctx = botRailCanvas.getContext('2d');
    brctx.drawImage(sheet.canvas, frameX0, botRailY0, frameW, botRailH, 0, 0, frameW, botRailH);
    const botCornerW = Math.min(topCornerW + 16, Math.round(w * 0.088));
    const botCornerH = Math.min(botRailH + 26, Math.round(h * 0.085));
    const cornerL = cropCanvasRegion(sheet.canvas, { x: 0, y: h - botCornerH, w: botCornerW, h: botCornerH });
    clearBlackBackgroundBFS(cornerL, { threshold: 12 });
    const cornerR = cropCanvasRegion(sheet.canvas, { x: w - botCornerW, y: h - botCornerH, w: botCornerW, h: botCornerH });
    clearBlackBackgroundBFS(cornerR, { threshold: 12 });

    modalAssets.backdropParts = {
      sheetCanvas: sheet.canvas,
      bodyCanvas,
      frameX0,
      frameX1,
      frameW,
      upperH,
      railL,
      railR,
      topCornerW,
      topCornerRW,
      topCornerH,
      topCornerLCanvas,
      topCornerRCanvas,
      crestCanvas,
      crestX0,
      crestX1,
      crestH,
      topRailH,
      botRailCanvas,
      botRailH,
      cornerL,
      cornerR,
      botCornerW,
      botCornerH,
      closeBox
    };
  }

  function renderModalFrameCanvas() {
    const parts = modalAssets.backdropParts;
    if (!parts || !summaryModalFrame || !modalFrameCanvas) return;

    const tw = summaryModalFrame.clientWidth;
    const th = summaryModalFrame.clientHeight;
    if (tw < 200 || th < 200) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    modalFrameCanvas.width = Math.round(tw * dpr);
    modalFrameCanvas.height = Math.round(th * dpr);
    const fctx = modalFrameCanvas.getContext('2d');
    fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fctx.clearRect(0, 0, tw, th);

    const {
      bodyCanvas,
      frameW,
      upperH,
      railL,
      railR,
      topCornerW,
      topCornerRW,
      topCornerH,
      topCornerLCanvas,
      topCornerRCanvas,
      crestCanvas,
      crestX0,
      crestX1,
      crestH,
      topRailH,
      botRailCanvas,
      botRailH,
      cornerL,
      cornerR,
      botCornerW,
      botCornerH,
      closeBox
    } = parts;

    const scale = Math.min(1, tw / frameW, th / 760);
    const rL = Math.round(railL * scale);
    const rR = Math.round(railR * scale);
    const tCW = Math.round(topCornerW * scale);
    const tCRW = Math.round(topCornerRW * scale);
    const tCH = Math.round(topCornerH * scale);
    const cW = Math.round((crestX1 - crestX0) * scale);
    const cH = Math.round(crestH * scale);
    const tRH = Math.round(topRailH * scale);
    const bRH = Math.round(botRailH * scale);

    // 1. Interior charcoal textured gradient
    const bgGrad = fctx.createRadialGradient(tw * 0.5, th * 0.36, 30, tw * 0.5, th * 0.5, Math.max(tw, th) * 0.65);
    bgGrad.addColorStop(0, '#18181d');
    bgGrad.addColorStop(0.65, '#111116');
    bgGrad.addColorStop(1, '#09090d');
    fctx.fillStyle = bgGrad;
    fctx.fillRect(rL * 0.5, tRH * 0.6, tw - (rL + rR) * 0.5, th - tRH * 0.6 - bRH * 0.5);

    // Overlay clean interior texture from original backdrop body (20%..85% Y) subtly
    fctx.save();
    fctx.globalAlpha = 0.72;
    fctx.drawImage(
      bodyCanvas,
      railL,
      Math.round(upperH * 0.2),
      frameW - railL - railR,
      Math.round(upperH * 0.65),
      rL,
      tRH,
      tw - rL - rR,
      th - tRH - bRH
    );
    fctx.restore();

    // 2. Left & Right vertical riveted pillars (clean unstretched rail width)
    const sideSrcY0 = topCornerH;
    const sideSrcH = Math.max(40, Math.round(upperH * 0.78) - sideSrcY0);
    const sideDstH = Math.max(20, th - tCH - bRH + 4);
    fctx.drawImage(bodyCanvas, 0, sideSrcY0, railL, sideSrcH, 0, tCH - 2, rL, sideDstH);
    fctx.drawImage(bodyCanvas, frameW - railR, sideSrcY0, railR, sideSrcH, tw - rR, tCH - 2, rR, sideDstH);

    // 3. Top horizontal riveted rail segments connecting corners to center crest (using clean rail pattern from left side for both sides)
    const crestLeftX = Math.round((tw - cW) * 0.5);
    const crestRightX = crestLeftX + cW;
    const railSampleX = topCornerW + 6;
    const railSampleW = Math.max(24, crestX0 - railSampleX - 4);
    if (crestLeftX > tCW) {
      fctx.drawImage(bodyCanvas, railSampleX, 0, railSampleW, topRailH, tCW - 2, 0, crestLeftX - tCW + 6, tRH);
    }
    const rightRailStart = crestRightX - 4;
    const rightCornerX = tw - tCRW;
    if (rightCornerX > rightRailStart) {
      fctx.drawImage(bodyCanvas, railSampleX, 0, railSampleW, topRailH, rightRailStart, 0, rightCornerX - rightRailStart + 4, tRH);
    }

    // 4. Top-Left & Top-Right corner filigree + Center "POST-MAP LOOT BREAKDOWN" Crest (feathered inner shadow)
    fctx.drawImage(topCornerLCanvas, 0, 0, topCornerW, topCornerH, 0, 0, tCW, tCH);
    fctx.drawImage(topCornerRCanvas, 0, 0, topCornerRW, topCornerH, tw - tCRW, 0, tCRW, tCH);
    fctx.drawImage(crestCanvas, 0, 0, crestX1 - crestX0, crestH, crestLeftX, 0, cW, cH);

    // 5. Bottom riveted horizontal rail + corner filigree
    const midBotSrcX = railL + 16;
    const midBotSrcW = frameW - (railL + railR + 32);
    fctx.drawImage(botRailCanvas, midBotSrcX, 0, midBotSrcW, botRailH, rL - 2, th - bRH, tw - rL - rR + 4, bRH);
    const bCW = Math.round(botCornerW * scale);
    const bCH = Math.round(botCornerH * scale);
    fctx.drawImage(cornerL, 0, 0, botCornerW, botCornerH, 0, th - bCH, bCW, bCH);
    fctx.drawImage(cornerR, 0, 0, botCornerW, botCornerH, tw - bCW, th - bCH, bCW, bCH);

    // 6. Position interactive [X] close button sprite right inside its top-right iron frame socket
    if (btnCloseModal && closeBox) {
      const rightOffset = (frameW - (closeBox.x + closeBox.w)) * scale;
      btnCloseModal.style.right = `${Math.max(4, Math.round(rightOffset))}px`;
      btnCloseModal.style.top = `${Math.max(2, Math.round(closeBox.y * scale))}px`;
      btnCloseModal.style.width = `${Math.round(closeBox.w * scale)}px`;
      btnCloseModal.style.height = `${Math.round(closeBox.h * scale)}px`;
    }

    // 7. Set responsive inner padding vars so stat bar, ledger, and footer sit evenly inside the riveted frame
    if (summaryModalContent) {
      const padTop = Math.round(cH * 0.88 + 4);
      const padX = Math.max(rL + 14, Math.round(tw * 0.036));
      const padBot = Math.max(bRH + 10, Math.round(th * 0.032));
      summaryModalContent.style.setProperty('--modal-pad-top', `${padTop}px`);
      summaryModalContent.style.setProperty('--modal-pad-x', `${padX}px`);
      summaryModalContent.style.setProperty('--modal-pad-bot', `${padBot}px`);
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
        astrolabeImg,
        divineOrbImg,
        breachIconImg,
        abyssIconImg,
        modalBackdropImg,
        modalStatBarImg,
        modalLedgerImg,
        modalBadgesImg
      ] = await Promise.all([
        loadImageAsset('./assets/ui/plaque_gem_sheet.webp'),
        loadImageAsset('./assets/ui/topbar_stats_sheet.webp'),
        loadImageAsset('./assets/ui/scroll_dock_sheet.jpg?v=13'),
        loadImageAsset('./assets/ui/astrolabe.webp'),
        loadImageAsset('./assets/icons/divine_orb.jpg?v=13'),
        loadImageAsset('./assets/icons/breach.webp?v=13'),
        loadImageAsset('./assets/icons/abyss.webp?v=13'),
        loadImageAsset('./assets/ui/modal_backdrop_sheet.webp?v=19'),
        loadImageAsset('./assets/ui/modal_statbar_sheet.webp?v=19'),
        loadImageAsset('./assets/ui/modal_ledger_sheet.webp?v=19'),
        loadImageAsset('./assets/ui/modal_badges_buttons_sheet.webp?v=19'),
        fontReady
      ]);

      // Load & process all custom PoE2 currency orb icons cleanly
      const uniqueOrbPaths = [...new Set(Object.values(CURRENCY_ICON_PATHS))];
      const loadedOrbs = new Map();
      await Promise.all(
        uniqueOrbPaths.map(async (path) => {
          try {
            const img = await loadImageAsset(`${path}?v=22`);
            const processed = processCurrencyIconCanvas(img);
            loadedOrbs.set(path, processed.toDataURL('image/png'));
          } catch (e) {
            console.warn('Could not load currency orb icon:', path, e);
          }
        })
      );
      for (const [id, path] of Object.entries(CURRENCY_ICON_PATHS)) {
        const url = loadedOrbs.get(path);
        if (url) modalAssets.currencyIcons.set(id, url);
      }

      // Slice Post-Map Loot Breakdown Modal UI sheets
      prepareModalBackdropParts(modalBackdropImg);
      sliceModalStatBar(modalStatBarImg);
      sliceModalLedger(modalLedgerImg);
      sliceModalBadgesAndButtons(modalBadgesImg);

      // Process standalone Divine Orb top-left brand icon (#000 studio bg removed & tightly trimmed)
      if (divineOrbImg && imgBrandDivineOrb) {
        const orbSheet = imageToCanvas(divineOrbImg);
        clearBlackBackgroundBFS(orbSheet.canvas, {
          threshold: 16,
          featherHaloThreshold: 30,
          unpremultiply: true
        });
        const orbTrimmed = trimCanvasByAlpha(orbSheet.canvas, 16);
        imgBrandDivineOrb.src = orbTrimmed.toDataURL('image/png');
      }

      // Process standalone Breach & Abyss icons (dock sockets + map canvas rifts)
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

      // 4. Slice Bottom Parchment Scroll, Riveted Dock & Golden Gauntlet (#FFFFFF bg)
      {
        const sheet = imageToCanvas(scrollDockImg);
        const maxY = Math.floor(sheet.height * 0.91); // Excludes bottom-right watermark
        const imgData = sheet.ctx.getImageData(0, 0, sheet.width, sheet.height);
        const bands = findBandsY(imgData, maxY, isFgWhite, 16, 12);

        if (bands.length >= 3) {
          const scrollBox = tightTrimBox(imgData, 0, bands[0].y0, sheet.width - 1, bands[0].y1, isFgWhite);
          const dockBox = tightTrimBox(imgData, 0, bands[1].y0, sheet.width - 1, bands[1].y1, isFgWhite);
          const gauntletBox = tightTrimBox(imgData, 0, bands[2].y0, sheet.width - 1, bands[2].y1, isFgWhite);

          if (scrollBox && imgScrollBanner) {
            const c = cropCanvasRegion(sheet.canvas, scrollBox);
            clearWhiteBackgroundBFS(c);
            imgScrollBanner.src = c.toDataURL('image/png');
          }
          if (dockBox && imgBottomDock) {
            const c = cropCanvasRegion(sheet.canvas, dockBox);
            clearWhiteBackgroundBFS(c);
            applyDockLayoutFromPixels(c);
            imgBottomDock.src = c.toDataURL('image/png');
          }
          if (gauntletBox && imgGauntlet) {
            const c = cropCanvasRegion(sheet.canvas, gauntletBox);
            clearWhiteBackgroundBFS(c);
            imgGauntlet.src = c.toDataURL('image/png');
          }
        }
      }
    } catch (err) {
      console.error('Failed to process UI sprite sheets:', err);
    } finally {
      document.body.classList.remove('assets-loading');
    }
  }

  window.addEventListener('resize', () => {
    if (summaryModal && !summaryModal.classList.contains('hidden')) {
      renderModalFrameCanvas();
    }
  });

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
  loadAndSliceUIAssets();
  resizeCanvas();
  initFogWisps();
  syncMuteUI();
  updateHUD();
  requestAnimationFrame(frameLoop);
})();
