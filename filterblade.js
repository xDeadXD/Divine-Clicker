/* ==========================================================================
   DIVINE CLICKER — OFFICIAL NEVERSINK / FILTERBLADE POE 2 SPECIFICATION
   Exact RGBA rules derived from NeverSink's filter 2 (1-REGULAR.filter)
   ========================================================================== */

(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.FilterBladeSpec = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Exact NeverSink PoE 2 FilterBlade tier definitions (RGBA 0-255 -> CSS)
  const TIER_STYLES = {
    'tier-spp': {
      neversinkTier: '$tier->s (Mythic)',
      fontSize: 45,
      textColor: 'rgb(255, 0, 0)',
      borderColor: 'rgb(255, 0, 0)',
      backgroundColor: 'rgb(255, 255, 255)',
      playEffect: 'Red',
      beamKind: 'red-mythic',
      minimapIcon: { size: 0, color: '#ff2424', shape: 'star' },
      alertSound: 6
    },
    'tier-sp': {
      neversinkTier: '$tier->s (Apex)',
      fontSize: 45,
      textColor: 'rgb(255, 0, 0)',
      borderColor: 'rgb(255, 0, 0)',
      backgroundColor: 'rgb(255, 255, 255)',
      playEffect: 'Red',
      beamKind: 'red-mythic',
      minimapIcon: { size: 0, color: '#ff2424', shape: 'star' },
      alertSound: 6
    },
    'tier-s': {
      neversinkTier: '$tier->s',
      fontSize: 45,
      textColor: 'rgb(255, 0, 0)',
      borderColor: 'rgb(255, 0, 0)',
      backgroundColor: 'rgb(255, 255, 255)',
      playEffect: 'Red',
      beamKind: 'red',
      minimapIcon: { size: 0, color: '#ff2424', shape: 'star' },
      alertSound: 6
    },
    'tier-ap': {
      neversinkTier: '$tier->a',
      fontSize: 45,
      textColor: 'rgb(255, 255, 255)',
      borderColor: 'rgb(255, 255, 255)',
      backgroundColor: 'rgb(245, 105, 90)',
      playEffect: 'Red',
      beamKind: 'red-a',
      minimapIcon: { size: 0, color: '#ff3030', shape: 'circle' },
      alertSound: 1
    },
    'tier-a': {
      neversinkTier: '$tier->c',
      fontSize: 42,
      textColor: 'rgb(0, 0, 0)',
      borderColor: 'rgb(0, 0, 0)',
      backgroundColor: 'rgb(245, 139, 87)',
      playEffect: 'Yellow',
      beamKind: 'yellow',
      minimapIcon: { size: 1, color: '#ffd84d', shape: 'circle' },
      alertSound: 2
    },
    'tier-b': {
      neversinkTier: '$tier->d',
      fontSize: 40,
      textColor: 'rgb(0, 0, 0)',
      borderColor: 'rgb(0, 0, 0)',
      backgroundColor: 'rgb(240, 180, 100)',
      playEffect: 'White',
      beamKind: 'white',
      minimapIcon: { size: 2, color: '#f4f4f0', shape: 'circle' },
      alertSound: 2
    },
    'tier-d': {
      neversinkTier: '$tier->supplymagic',
      fontSize: 38,
      textColor: 'rgb(220, 175, 132)',
      borderColor: 'rgb(220, 175, 132)',
      backgroundColor: 'rgba(0, 0, 0, 0.82)',
      playEffect: null,
      beamKind: null,
      minimapIcon: null,
      alertSound: null
    },
    'tier-f': {
      neversinkTier: '$tier->supplieslow',
      fontSize: 35,
      textColor: 'rgb(170, 158, 130)',
      borderColor: 'rgba(130, 118, 96, 0.45)',
      backgroundColor: 'rgba(0, 0, 0, 0.78)',
      playEffect: null,
      beamKind: null,
      minimapIcon: null,
      alertSound: null
    }
  };

  // Volumetric PoE 2 PlayEffect beam parameters
  const BEAM_SPECS = {
    'red-mythic': {
      playEffect: 'Red',
      height: 360,
      outerWidth: 58,
      innerWidth: 20,
      coreWidth: 4,
      groundRadiusX: 40,
      groundRadiusY: 15,
      outerRgb: [255, 24, 24],
      innerRgb: [255, 76, 66],
      coreHex: '#ffffff',
      moteCount: 7
    },
    red: {
      playEffect: 'Red',
      height: 300,
      outerWidth: 46,
      innerWidth: 16,
      coreWidth: 3.4,
      groundRadiusX: 33,
      groundRadiusY: 12.5,
      outerRgb: [248, 22, 22],
      innerRgb: [255, 72, 62],
      coreHex: '#ffffff',
      moteCount: 5
    },
    'red-a': {
      playEffect: 'Red',
      height: 225,
      outerWidth: 34,
      innerWidth: 12,
      coreWidth: 2.5,
      groundRadiusX: 25,
      groundRadiusY: 10,
      outerRgb: [245, 72, 58],
      innerRgb: [255, 118, 98],
      coreHex: '#fff4ef',
      moteCount: 3
    },
    yellow: {
      playEffect: 'Yellow',
      height: 195,
      outerWidth: 28,
      innerWidth: 10,
      coreWidth: 2.2,
      groundRadiusX: 22,
      groundRadiusY: 8.5,
      outerRgb: [255, 204, 52],
      innerRgb: [255, 228, 120],
      coreHex: '#fffbe6',
      moteCount: 2
    },
    white: {
      playEffect: 'White',
      height: 150,
      outerWidth: 22,
      innerWidth: 7.5,
      coreWidth: 1.7,
      groundRadiusX: 18,
      groundRadiusY: 7,
      outerRgb: [232, 232, 226],
      innerRgb: [250, 248, 242],
      coreHex: '#ffffff',
      moteCount: 1
    }
  };

  function getTierStyle(cssClass) {
    return TIER_STYLES[cssClass] || TIER_STYLES['tier-f'];
  }

  function getBeamSpec(beamKind) {
    if (!beamKind) return null;
    return BEAM_SPECS[beamKind] || null;
  }

  const DISTINCT_ICON_TIERED_IDS = new Set([
    'perfect_jewellers_orb',
    'greater_jewellers_orb',
    'lesser_jewellers_orb'
  ]);

  function getCurrencyVariantTier(currencyId) {
    if (!currencyId || typeof currencyId !== 'string') return 'base';
    if (DISTINCT_ICON_TIERED_IDS.has(currencyId)) return 'base';
    if (currencyId.startsWith('perfect_')) return 'perfect';
    if (currencyId.startsWith('greater_')) return 'greater';
    return 'base';
  }

  function getDropSoundKey(currencyOrCssClass) {
    if (!currencyOrCssClass) return null;
    if (typeof currencyOrCssClass === 'object' && currencyOrCssClass.points <= 0) {
      return null;
    }
    const cssClass =
      typeof currencyOrCssClass === 'string'
        ? currencyOrCssClass
        : currencyOrCssClass.cssClass;
    if (cssClass === 'tier-spp' || cssClass === 'tier-sp' || cssClass === 'tier-s') {
      return 's_tier';
    }
    if (cssClass === 'tier-ap') {
      return 'a_plus_tier';
    }
    if (cssClass === 'tier-a' || cssClass === 'tier-b') {
      return 'a_b_tier';
    }
    return null;
  }

  function computeDropScore(basePoints, streakMultiplier) {
    const pts = Number(basePoints) || 0;
    if (pts <= 0) return pts;
    const mult = Math.max(1, Math.min(5, Number(streakMultiplier) || 1));
    return Math.round(pts * mult);
  }

  // Maps player streak multiplier [1.0 .. 5.0] to Astrolabe fire/electrical distortion parameters
  function getStreakIntensityProfile(streakMultiplier) {
    const mult = Math.max(1, Math.min(5, Number(streakMultiplier) || 1));
    const norm = (mult - 1) / 4; // 0.0 at 1.0x -> 1.0 at 5.0x
    const tier = Math.floor(mult); // 1, 2, 3, 4, 5

    if (norm <= 0.001) {
      return {
        streak: 1.0,
        tier: 1,
        intensity: 0,
        distortionScale: 0,
        turbulenceFreq: 0.014,
        glowStrength: 0,
        emberRate: 0,
        arcChance: 0,
        maxArcs: 0,
        spinSpeedMultiplier: 1.0,
        palette: 'calm'
      };
    }

    // Smooth non-linear ramp: subtle warmth at 1.2x-2.0x, surging fire & lightning at 3.0x-5.0x
    const curved = Math.pow(norm, 1.15);
    const palette =
      mult >= 4.0 ? 'overdrive' : mult >= 3.0 ? 'stormfire' : mult >= 2.0 ? 'ember' : 'spark';

    return {
      streak: Math.round(mult * 10) / 10,
      tier,
      intensity: Number(curved.toFixed(4)),
      distortionScale: Number((1.2 + curved * 6.2).toFixed(2)),
      turbulenceFreq: Number((0.015 + curved * 0.017).toFixed(4)),
      glowStrength: Number((0.14 + curved * 0.86).toFixed(3)),
      emberRate: Number((5 + curved * 34).toFixed(2)), // embers/sec
      arcChance: mult >= 1.4 ? Number((0.08 + Math.pow((mult - 1.4) / 3.6, 1.2) * 0.72).toFixed(3)) : 0,
      maxArcs: mult >= 4.0 ? 6 : mult >= 3.0 ? 4 : mult >= 2.0 ? 3 : mult >= 1.4 ? 2 : 0,
      spinSpeedMultiplier: Number((1.0 + curved * 2.4).toFixed(3)),
      palette
    };
  }

  // Scales gameplay difficulty steadily harder with every streak multiplier increase [1.0x .. 5.0x]
  function getStreakDifficulty(streakMultiplier, isFinale = false) {
    const mult = Math.max(1, Math.min(5, Number(streakMultiplier) || 1));
    const norm = (mult - 1) / 4; // 0 at 1.0x -> 1 at 5.0x
    const tierStep = Math.floor(mult) - 1; // 0, 1, 2, 3, 4 whole-multiplier jumps

    // Ground despawn window tightens continuously + slightly per whole multiplier milestone
    // 1.0x: 1450-1820ms -> 2.0x: ~1260-1585ms -> 3.0x: ~1085-1365ms -> 4.0x: ~925-1165ms -> 5.0x: 780-990ms
    const lifetimeFactor = Math.max(0.53, 1 - norm * 0.42 - tierStep * 0.012);
    const lifetimeMinMs = Math.max(760, Math.round(1450 * lifetimeFactor));
    const lifetimeMaxMs = Math.max(lifetimeMinMs + 180, Math.round(1820 * lifetimeFactor));

    // Wave spawn cadence accelerates with streak (and stacks cleanly with Delirium finale)
    const baseMin = isFinale ? 400 : 560;
    const baseMax = isFinale ? 620 : 850;
    const cadenceFactor = Math.max(0.55, 1 - norm * 0.39 - tierStep * 0.014);
    const burstIntervalMinMs = Math.max(250, Math.round(baseMin * cadenceFactor));
    const burstIntervalMaxMs = Math.max(burstIntervalMinMs + 120, Math.round(baseMax * cadenceFactor));

    // Faster pop-up arc so drops settle quicker and demand faster reaction
    const arcDurationMs = Math.max(82, Math.round(120 - norm * 36));

    // Extra hazard/clutter items added per burst at higher streak tiers (tests click precision)
    const extraItems = tierStep >= 4 ? 3 : tierStep >= 2 ? 2 : tierStep >= 1 ? 1 : 0;

    // Slight clutter hazard bias on non-guaranteed drops (0 at 1.0x -> +0.16 at 5.0x)
    const clutterBias = Number((norm * 0.16).toFixed(4));

    // Slightly wider drop scatter at higher streaks so eyes must scan more of the Atlas playfield
    const scatterBonusPx = Math.round(norm * 42);

    return {
      streak: Math.round(mult * 10) / 10,
      tier: Math.floor(mult),
      lifetimeMinMs,
      lifetimeMaxMs,
      burstIntervalMinMs,
      burstIntervalMaxMs,
      arcDurationMs,
      extraItems,
      clutterBias,
      scatterBonusPx
    };
  }

  // Distinct sculpted gothic heraldic shield themes for all 8 Post-Map Breakdown tiers
  // Ensures no two tiers ever share an identical badge color or silhouette+tint combination
  const TIER_BADGE_THEMES = {
    'S++': {
      id: 'badge-spp',
      baseShieldIndex: 0,
      mode: 'pearl-mirror',
      enamelHex: '#f2ece4',
      textColor: '#b80f18',
      glowRgba: 'rgba(255, 224, 150, 0.55)',
      textClass: 'tier-txt-spp'
    },
    'S+': {
      id: 'badge-sp',
      baseShieldIndex: 0,
      mode: 'imperial-ruby',
      enamelHex: '#a80d2c',
      textColor: '#fff6de',
      glowRgba: 'rgba(232, 46, 78, 0.42)',
      textClass: 'tier-txt-sp'
    },
    S: {
      id: 'badge-s',
      baseShieldIndex: 1,
      mode: 'blood-garnet',
      enamelHex: '#861212',
      textColor: '#fff5e6',
      glowRgba: 'rgba(214, 48, 42, 0.36)',
      textClass: 'tier-txt-s'
    },
    'A+': {
      id: 'badge-ap',
      baseShieldIndex: 1,
      mode: 'arcane-amethyst',
      enamelHex: '#7d2ca8',
      textColor: '#f8e9ff',
      glowRgba: 'rgba(182, 86, 238, 0.42)',
      textClass: 'tier-txt-ap'
    },
    A: {
      id: 'badge-a',
      baseShieldIndex: 2,
      mode: 'molten-copper',
      enamelHex: '#d46a1c',
      textColor: '#fff4df',
      glowRgba: 'rgba(235, 132, 42, 0.34)',
      textClass: 'tier-txt-a'
    },
    B: {
      id: 'badge-b',
      baseShieldIndex: 2,
      mode: 'viridian-jade',
      enamelHex: '#257d62',
      textColor: '#e8fff4',
      glowRgba: 'rgba(64, 196, 148, 0.36)',
      textClass: 'tier-txt-b'
    },
    D: {
      id: 'badge-d',
      baseShieldIndex: 3,
      mode: 'cobalt-steel',
      enamelHex: '#43607e',
      textColor: '#e2effa',
      glowRgba: 'rgba(104, 152, 204, 0.28)',
      textClass: 'tier-txt-d'
    },
    F: {
      id: 'badge-f',
      baseShieldIndex: 3,
      mode: 'ashen-iron',
      enamelHex: '#2b2829',
      textColor: '#a8a29c',
      glowRgba: 'rgba(0, 0, 0, 0.55)',
      textClass: 'tier-txt-f'
    }
  };

  function getTierBadgeTheme(tier) {
    return TIER_BADGE_THEMES[tier] || TIER_BADGE_THEMES.F;
  }

  // Advances Breach or Abyss dock charge gauge [0 .. 100] on valuable currency pickup
  function advanceMechanicCharge(currentCharge, streakMultiplier, isHighTier, mechanic = 'breach') {
    const base = Math.max(0, Math.min(100, Number(currentCharge) || 0));
    const mult = Math.max(1, Math.min(5, Number(streakMultiplier) || 1));
    // Breach favors high-tier S/A+ bursts; Abyss builds steadily from rapid clicks & streaks
    const gain =
      mechanic === 'abyss'
        ? (isHighTier ? 14 : 11) + Math.round((mult - 1) * 3.5)
        : (isHighTier ? 18 : 9) + Math.round((mult - 1) * 2.5);
    const charge = Math.min(100, Math.round(base + gain));
    return {
      charge,
      ready: charge >= 100
    };
  }

  // Computes Heraldic Post-Map Run Grade (S++ .. F) from score, accuracy, streak, and remaining strikes
  function computeMapRunGrade({ score = 0, accuracy = 100, maxStreak = 1, strikesUsed = 0, validClicks = 0 } = {}) {
    const s = Number(score) || 0;
    const acc = Math.max(0, Math.min(100, Number(accuracy) || 0));
    const streak = Math.max(1, Number(maxStreak) || 1);
    const strikes = Math.max(0, Number(strikesUsed) || 0);
    const clicks = Math.max(0, Number(validClicks) || 0);

    if (clicks === 0 || s <= 0) {
      return { grade: 'F', label: 'Unclaimed Map' };
    }

    // Weighted run rating combining raw currency value, streak mastery, accuracy, and integrity discipline
    const composite =
      s +
      (streak - 1) * 900 +
      acc * 22 -
      strikes * 1400;

    if (composite >= 26000 && strikes === 0 && acc >= 92) {
      return { grade: 'S++', label: 'Mirror-Tier Exile' };
    }
    if (composite >= 16500 && strikes <= 1) {
      return { grade: 'S+', label: 'Apex Delirium Clear' };
    }
    if (composite >= 10500) {
      return { grade: 'S', label: 'Exalted Mapper' };
    }
    if (composite >= 6500) {
      return { grade: 'A+', label: 'Vaal-Touched Clear' };
    }
    if (composite >= 3600) {
      return { grade: 'A', label: 'Veteran Atlas Runner' };
    }
    if (composite >= 1600) {
      return { grade: 'B', label: 'Steady Scavenger' };
    }
    if (composite >= 450) {
      return { grade: 'D', label: 'Fractured Run' };
    }
    return { grade: 'F', label: 'Corrupted Failure' };
  }

  // Filters currency table rows for Post-Map Loot Breakdown ('all' | 'collected' | 'missed')
  function filterBreakdownCurrencies(currencies, statsByCurrency, filterMode = 'all') {
    const list = Array.isArray(currencies) ? currencies : [];
    const stats = statsByCurrency || {};
    if (filterMode === 'collected') {
      return list.filter((c) => ((stats[c.id] && stats[c.id].clicked) || 0) > 0);
    }
    if (filterMode === 'missed') {
      return list.filter((c) => ((stats[c.id] && stats[c.id].missed) || 0) > 0);
    }
    return list.slice();
  }

  // Resolves the rare Vaal Altar 50/50 gamble:
  // - 50% WIN (roll < 0.5): Drop HALF of all valuable currencies picked so far back onto the ground (not instant score double!)
  // - 50% LOSS (roll >= 0.5): Brick — shatter 1 Integrity Gem and reset streak
  function resolveVaalAltarRoll(pickedValuableIds, rollRandom, rng = Math.random) {
    const picked = Array.isArray(pickedValuableIds) ? pickedValuableIds.filter(Boolean) : [];
    const totalPicked = picked.length;
    const roll = typeof rollRandom === 'number' ? rollRandom : rng();

    if (roll < 0.5 && totalPicked > 0) {
      const exactHalf = Math.max(1, Math.floor(totalPicked / 2));
      const dropCount = Math.min(18, exactHalf);
      // Fisher-Yates shuffle on a copy so drops faithfully mirror what the player actually picked up
      const pool = picked.slice();
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        const tmp = pool[i];
        pool[i] = pool[j];
        pool[j] = tmp;
      }
      const dropIds = pool.slice(0, dropCount);
      return {
        outcome: 'duplicate',
        dropIds,
        dropCount: dropIds.length,
        totalPicked,
        integrityLoss: 0
      };
    }

    return {
      outcome: 'brick',
      dropIds: [],
      dropCount: 0,
      totalPicked,
      integrityLoss: 1
    };
  }

  // Rarity gate for spawning a Vaal Altar during a map run:
  // - Never spawns early (< 20s elapsed) or before the player has collected >= 6 valuable currencies
  // - Timed (60s) maps cap at max 1 Vaal Altar per run with a ~42% roll per check window
  // - Endless maps roll at ~38% per long check window so encounters remain genuinely rare
  function shouldSpawnVaalAltar({
    elapsedMs = 0,
    pickedCount = 0,
    altarsSpawnedThisRun = 0,
    mode = 'timed',
    rng = Math.random
  } = {}) {
    if (elapsedMs < 20000) return false;
    if (pickedCount < 6) return false;
    if (mode === 'timed' && altarsSpawnedThisRun >= 1) return false;
    const chance = mode === 'timed' ? 0.42 : 0.38;
    return rng() < chance;
  }

  return {
    TIER_STYLES,
    BEAM_SPECS,
    TIER_BADGE_THEMES,
    getTierStyle,
    getBeamSpec,
    getTierBadgeTheme,
    getCurrencyVariantTier,
    getDropSoundKey,
    computeDropScore,
    getStreakIntensityProfile,
    getStreakDifficulty,
    advanceMechanicCharge,
    computeMapRunGrade,
    filterBreakdownCurrencies,
    resolveVaalAltarRoll,
    shouldSpawnVaalAltar
  };
});

