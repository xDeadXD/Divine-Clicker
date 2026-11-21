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

  return {
    TIER_STYLES,
    BEAM_SPECS,
    getTierStyle,
    getBeamSpec,
    getCurrencyVariantTier,
    getDropSoundKey,
    computeDropScore
  };
});
