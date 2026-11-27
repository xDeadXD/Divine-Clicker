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

test('Astrolabe streak intensity profile stays calm at 1.0x and intensifies smoothly through 5.0x', () => {
  const calm = FilterBlade.getStreakIntensityProfile(1.0);
  assert.equal(calm.intensity, 0);
  assert.equal(calm.distortionScale, 0);
  assert.equal(calm.emberRate, 0);
  assert.equal(calm.arcChance, 0);
  assert.equal(calm.maxArcs, 0);
  assert.equal(calm.palette, 'calm');

  const levels = [1.5, 2.0, 3.0, 4.0, 5.0].map((s) => FilterBlade.getStreakIntensityProfile(s));
  for (let i = 1; i < levels.length; i++) {
    assert.ok(levels[i].intensity > levels[i - 1].intensity, 'intensity increases with streak');
    assert.ok(levels[i].distortionScale > levels[i - 1].distortionScale, 'distortion increases with streak');
    assert.ok(levels[i].emberRate > levels[i - 1].emberRate, 'ember rate increases with streak');
    assert.ok(levels[i].arcChance >= levels[i - 1].arcChance, 'arc chance increases with streak');
    assert.ok(levels[i].spinSpeedMultiplier > levels[i - 1].spinSpeedMultiplier, 'spin accelerates with streak');
  }
  assert.equal(levels[levels.length - 1].palette, 'overdrive');
  assert.ok(levels[levels.length - 1].maxArcs >= 5);
});

test('streak difficulty escalates harder at every streak multiplier while remaining playable', () => {
  const steps = [1.0, 1.5, 2.0, 3.0, 4.0, 5.0].map((s) => FilterBlade.getStreakDifficulty(s, false));
  for (let i = 1; i < steps.length; i++) {
    assert.ok(steps[i].lifetimeMinMs < steps[i - 1].lifetimeMinMs, 'despawn window shortens with streak');
    assert.ok(steps[i].lifetimeMaxMs < steps[i - 1].lifetimeMaxMs, 'max despawn shortens with streak');
    assert.ok(steps[i].burstIntervalMinMs < steps[i - 1].burstIntervalMinMs, 'burst cadence speeds up with streak');
    assert.ok(steps[i].arcDurationMs <= steps[i - 1].arcDurationMs, 'pop-up arc gets snappier');
    assert.ok(steps[i].clutterBias > steps[i - 1].clutterBias, 'hazard clutter bias rises with streak');
    assert.ok(steps[i].extraItems >= steps[i - 1].extraItems, 'burst hazard count rises at higher multipliers');
  }

  // Still playable at max 5.0x overdrive
  const maxDiff = steps[steps.length - 1];
  assert.ok(maxDiff.lifetimeMinMs >= 750, '5.0x lifetime stays humanly clickable');
  assert.ok(maxDiff.burstIntervalMinMs >= 250, '5.0x cadence stays bounded');

  // Delirium finale stacks faster cadence on top of streak difficulty
  const finale5 = FilterBlade.getStreakDifficulty(5.0, true);
  assert.ok(finale5.burstIntervalMinMs <= maxDiff.burstIntervalMinMs);
});

test('all 8 Post-Map Breakdown tier badges have strictly unique themes and colors', () => {
  const allTiers = ['S++', 'S+', 'S', 'A+', 'A', 'B', 'D', 'F'];
  const seenIds = new Set();
  const seenModes = new Set();
  const seenColors = new Set();

  for (const tier of allTiers) {
    const theme = FilterBlade.getTierBadgeTheme(tier);
    assert.ok(theme && theme.id && theme.mode && theme.enamelHex, `theme exists for ${tier}`);
    assert.equal(seenIds.has(theme.id), false, `duplicate badge id for ${tier}`);
    assert.equal(seenModes.has(theme.mode), false, `duplicate badge mode for ${tier}`);
    assert.equal(seenColors.has(theme.enamelHex), false, `duplicate badge color for ${tier}`);
    seenIds.add(theme.id);
    seenModes.add(theme.mode);
    seenColors.add(theme.enamelHex);
  }
  assert.equal(seenColors.size, 8);
});

test('Breach and Abyss charge gauges fill monotonically and cap cleanly at 100% ready', () => {
  let breach = 0;
  let abyss = 0;
  const highStep = FilterBlade.advanceMechanicCharge(0, 2.0, true, 'breach');
  const normStep = FilterBlade.advanceMechanicCharge(0, 2.0, false, 'breach');
  assert.ok(highStep.charge > normStep.charge, 'high-tier currency charges Breach faster');

  for (let i = 0; i < 12; i++) {
    breach = FilterBlade.advanceMechanicCharge(breach, 3.0, i % 2 === 0, 'breach').charge;
    abyss = FilterBlade.advanceMechanicCharge(abyss, 3.0, i % 2 === 0, 'abyss').charge;
  }
  assert.equal(breach, 100);
  assert.equal(abyss, 100);
  assert.equal(FilterBlade.advanceMechanicCharge(100, 5.0, true, 'breach').ready, true);
});

test('Post-Map Run Grade spans F through S++ and rewards clean high-score runs', () => {
  assert.equal(FilterBlade.computeMapRunGrade({ score: 0, validClicks: 0 }).grade, 'F');
  assert.equal(
    FilterBlade.computeMapRunGrade({ score: 25000, accuracy: 96, maxStreak: 4.5, strikesUsed: 0, validClicks: 40 }).grade,
    'S++'
  );
  // Taking a clutter strike prevents S++ even at very high score
  assert.notEqual(
    FilterBlade.computeMapRunGrade({ score: 25000, accuracy: 96, maxStreak: 4.5, strikesUsed: 1, validClicks: 40 }).grade,
    'S++'
  );
  assert.equal(
    FilterBlade.computeMapRunGrade({ score: 4000, accuracy: 85, maxStreak: 2.0, strikesUsed: 1, validClicks: 14 }).grade,
    'A'
  );
});

test('Breakdown filter isolates collected and missed currencies accurately', () => {
  const sample = [
    { id: 'divine_orb' },
    { id: 'chaos_orb' },
    { id: 'scroll_wisdom' }
  ];
  const stats = {
    divine_orb: { clicked: 2, missed: 0, netPoints: 1400 },
    chaos_orb: { clicked: 0, missed: 3, netPoints: 0 },
    scroll_wisdom: { clicked: 0, missed: 0, netPoints: 0 }
  };

  assert.equal(FilterBlade.filterBreakdownCurrencies(sample, stats, 'all').length, 3);
  assert.deepEqual(
    FilterBlade.filterBreakdownCurrencies(sample, stats, 'collected').map((c) => c.id),
    ['divine_orb']
  );
  assert.deepEqual(
    FilterBlade.filterBreakdownCurrencies(sample, stats, 'missed').map((c) => c.id),
    ['chaos_orb']
  );
});

test('Vaal Altar 50/50 gamble drops half of picked valuable currencies on win and bricks 1 Integrity on loss', () => {
  const picked = [
    'divine_orb',
    'divine_orb',
    'exalted_orb',
    'chaos_orb',
    'perfect_exalted_orb',
    'vaal_orb'
  ];

  // 50% WIN -> drops exact floor(6 / 2) = 3 currencies sampled from what player actually picked
  let seed = 0.25;
  const deterministicRng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const winRes = FilterBlade.resolveVaalAltarRoll(picked, 0.22, deterministicRng);
  assert.equal(winRes.outcome, 'duplicate');
  assert.equal(winRes.dropCount, 3);
  assert.equal(winRes.dropIds.length, 3);
  assert.equal(winRes.integrityLoss, 0);
  for (const id of winRes.dropIds) {
    assert.ok(picked.includes(id), `dropped ${id} must come from player picked currencies`);
  }

  // Cap very large runs cleanly to 18 ground drops so playfield never overflows
  const hugePicked = new Array(50).fill('exalted_orb');
  const cappedWin = FilterBlade.resolveVaalAltarRoll(hugePicked, 0.1, deterministicRng);
  assert.equal(cappedWin.dropCount, 18);

  // 50% LOSS -> bricks 1 Integrity Gem and drops nothing
  const lossRes = FilterBlade.resolveVaalAltarRoll(picked, 0.78, deterministicRng);
  assert.equal(lossRes.outcome, 'brick');
  assert.equal(lossRes.dropCount, 0);
  assert.equal(lossRes.dropIds.length, 0);
  assert.equal(lossRes.integrityLoss, 1);
});

test('Vaal Altar spawn gate keeps altars rare, waits for enough loot/time, and caps timed maps to 1', () => {
  // Too early (< 20s) or too few picked orbs (< 6) -> never spawns even with lucky roll
  assert.equal(
    FilterBlade.shouldSpawnVaalAltar({ elapsedMs: 12000, pickedCount: 10, altarsSpawnedThisRun: 0, mode: 'timed', rng: () => 0.01 }),
    false
  );
  assert.equal(
    FilterBlade.shouldSpawnVaalAltar({ elapsedMs: 25000, pickedCount: 4, altarsSpawnedThisRun: 0, mode: 'timed', rng: () => 0.01 }),
    false
  );
  // Eligible in timed mode -> spawns only on lucky rare roll (< 0.42)
  assert.equal(
    FilterBlade.shouldSpawnVaalAltar({ elapsedMs: 26000, pickedCount: 7, altarsSpawnedThisRun: 0, mode: 'timed', rng: () => 0.25 }),
    true
  );
  assert.equal(
    FilterBlade.shouldSpawnVaalAltar({ elapsedMs: 26000, pickedCount: 7, altarsSpawnedThisRun: 0, mode: 'timed', rng: () => 0.6 }),
    false
  );
  // Timed 60s mode strictly caps at 1 Vaal Altar per map
  assert.equal(
    FilterBlade.shouldSpawnVaalAltar({ elapsedMs: 45000, pickedCount: 20, altarsSpawnedThisRun: 1, mode: 'timed', rng: () => 0.01 }),
    false
  );
  // Endless mode allows rare follow-up altars
  assert.equal(
    FilterBlade.shouldSpawnVaalAltar({ elapsedMs: 75000, pickedCount: 20, altarsSpawnedThisRun: 1, mode: 'endless', rng: () => 0.2 }),
    true
  );
});

