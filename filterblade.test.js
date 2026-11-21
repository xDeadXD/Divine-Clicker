const test = require('node:test');
const assert = require('node:assert/strict');
const FilterBlade = require('./filterblade');

test('S-tier currencies use exact NeverSink PoE 2 white-bg / red-text / red-border / Red Star spec', () => {
  for (const cls of ['tier-s', 'tier-sp', 'tier-spp']) {
    const style = FilterBlade.getTierStyle(cls);
    assert.equal(style.backgroundColor, 'rgb(255, 255, 255)');
    assert.equal(style.textColor, 'rgb(255, 0, 0)');
    assert.equal(style.borderColor, 'rgb(255, 0, 0)');
    assert.equal(style.fontSize, 45);
    assert.equal(style.playEffect, 'Red');
    assert.equal(style.minimapIcon.shape, 'star');
  }
});

test('A+ tier uses exact NeverSink $tier->a white text/border on coral-red with Red beam', () => {
  const style = FilterBlade.getTierStyle('tier-ap');
  assert.equal(style.backgroundColor, 'rgb(245, 105, 90)');
  assert.equal(style.textColor, 'rgb(255, 255, 255)');
  assert.equal(style.borderColor, 'rgb(255, 255, 255)');
  assert.equal(style.playEffect, 'Red');
  assert.equal(style.minimapIcon.shape, 'circle');
});

test('A and B tiers use exact NeverSink orange/amber with black text and Yellow/White beams', () => {
  const a = FilterBlade.getTierStyle('tier-a');
  assert.equal(a.backgroundColor, 'rgb(245, 139, 87)');
  assert.equal(a.textColor, 'rgb(0, 0, 0)');
  assert.equal(a.playEffect, 'Yellow');

  const b = FilterBlade.getTierStyle('tier-b');
  assert.equal(b.backgroundColor, 'rgb(240, 180, 100)');
  assert.equal(b.textColor, 'rgb(0, 0, 0)');
  assert.equal(b.playEffect, 'White');
});

test('D and F clutter tiers use dark translucent boxes with no beam or minimap icon', () => {
  const d = FilterBlade.getTierStyle('tier-d');
  assert.equal(d.textColor, 'rgb(220, 175, 132)');
  assert.equal(d.playEffect, null);
  assert.equal(d.minimapIcon, null);

  const f = FilterBlade.getTierStyle('tier-f');
  assert.equal(f.textColor, 'rgb(170, 158, 130)');
  assert.equal(f.playEffect, null);
  assert.equal(f.minimapIcon, null);
});

test('variant tier detection and beam specs resolve accurately', () => {
  assert.equal(FilterBlade.getCurrencyVariantTier('perfect_exalted_orb'), 'perfect');
  assert.equal(FilterBlade.getCurrencyVariantTier('greater_chaos_orb'), 'greater');
  assert.equal(FilterBlade.getCurrencyVariantTier('perfect_jewellers_orb'), 'base');
  assert.equal(FilterBlade.getCurrencyVariantTier('greater_jewellers_orb'), 'base');
  assert.equal(FilterBlade.getCurrencyVariantTier('divine_orb'), 'base');

  const mythic = FilterBlade.getBeamSpec('red-mythic');
  const white = FilterBlade.getBeamSpec('white');
  assert.ok(mythic.height > white.height);
  assert.equal(FilterBlade.getBeamSpec(null), null);

  assert.equal(FilterBlade.computeDropScore(500, 2.5), 1250);
  assert.equal(FilterBlade.computeDropScore(-20, 4.0), -20);
});

test('drop sound mapping routes S-S++, A+, and A-B to their distinct custom audio keys', () => {
  assert.equal(FilterBlade.getDropSoundKey({ cssClass: 'tier-spp', points: 5000 }), 's_tier');
  assert.equal(FilterBlade.getDropSoundKey({ cssClass: 'tier-sp', points: 2200 }), 's_tier');
  assert.equal(FilterBlade.getDropSoundKey({ cssClass: 'tier-s', points: 500 }), 's_tier');
  assert.equal(FilterBlade.getDropSoundKey({ cssClass: 'tier-ap', points: 180 }), 'a_plus_tier');
  assert.equal(FilterBlade.getDropSoundKey({ cssClass: 'tier-a', points: 50 }), 'a_b_tier');
  assert.equal(FilterBlade.getDropSoundKey({ cssClass: 'tier-b', points: 25 }), 'a_b_tier');
  assert.equal(FilterBlade.getDropSoundKey({ cssClass: 'tier-d', points: -15 }), null);
  assert.equal(FilterBlade.getDropSoundKey({ cssClass: 'tier-f', points: -20 }), null);
});
