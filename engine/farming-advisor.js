"use strict";

(() => {
  const MODEL_VERSION = "expedition-farming-v1";
  const MAX_SIMULATIONS = 10000;
  const DEFAULT_SIMULATIONS = 1000;
  const DEFAULT_MAX_ROUNDS = 50;

  function finite(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function clampInt(value, min, max, fallback) {
    const n = Number(value);
    if (!Number.isFinite(n)) return fallback;
    return Math.max(min, Math.min(max, Math.trunc(n)));
  }

  function rollRange(rng, range) {
    const lo = Math.round(finite(Array.isArray(range) ? range[0] : 0));
    const hi = Math.round(finite(Array.isArray(range) ? range[1] : lo));
    if (hi <= lo) return lo;
    return lo + Math.floor(rng() * (hi - lo + 1));
  }

  function buildEnemyProfile(engine, source, seed) {
    if (!engine) throw new Error("Combat simulator engine unavailable.");
    if (!source || typeof source !== "object") throw new Error("Expedition enemy data is unavailable.");
    const rng = engine.createSeededRng(seed);
    const level = rollRange(rng, source.l);
    const strength = rollRange(rng, source.str);
    const dexterity = rollRange(rng, source.dex);
    const agility = rollRange(rng, source.agi);
    const constitution = rollRange(rng, source.con);
    const charisma = rollRange(rng, source.cha);
    const intelligence = rollRange(rng, source.int);
    const armour = rollRange(rng, source.a);
    const damageMin = rollRange(rng, source.dmin);
    const damageMax = Math.max(damageMin, rollRange(rng, source.dmax));
    const lifeMax = Math.max(1, rollRange(rng, source.hp));
    const critical = Math.max(0, Math.trunc(finite(source.cr)));
    const block = Math.max(0, Math.trunc(finite(source.bl)));
    const avoidCritical = Math.max(0, Math.trunc(finite(source.ac)));
    const profile = engine.buildProfile({
      equipmentSnapshot: {},
      stats: {
        level,
        strength,
        dexterity,
        agility,
        constitution,
        charisma,
        intelligence,
        armour,
        damageMin,
        damageMax,
        lifeMax,
        lifeCurrent: lifeMax,
        dinoPoints: {
          critical: Math.max(0, Math.floor(dexterity / 10) + critical),
          block: Math.max(0, Math.floor(strength / 10) + block),
          avoidCritical: Math.max(0, Math.floor(agility / 10) + avoidCritical)
        }
      },
      explicitLifeMax: lifeMax,
      explicitArmour: armour,
      explicitDamageRange: `${damageMin}-${damageMax}`,
      recalculateDerived: false,
      name: source.n || "Expedition Enemy"
    });
    profile.lifeCurrent = profile.lifeMax;
    profile.dinoPoints = {
      critical: Math.max(0, Math.floor(profile.dexterity / 10) + critical),
      block: Math.max(0, Math.floor(profile.strength / 10) + block),
      avoidCritical: Math.max(0, Math.floor(profile.agility / 10) + avoidCritical)
    };
    return profile;
  }

  function resultMetrics(batch, target, playerLifeMax, hpThresholdPercent) {
    const lifeMax = Math.max(1, finite(playerLifeMax, 1));
    const threshold = Math.max(0, Math.min(100, finite(hpThresholdPercent, 30)));
    const usableHp = Math.max(1, lifeMax * (1 - threshold / 100));
    const winRate = Math.max(0, Math.min(100, finite(batch?.rates?.win)));
    const avgDamageTaken = Math.max(0, finite(batch?.averages?.enemyDamage));
    const sustainableFights = avgDamageTaken > 0 ? usableHp / avgDamageTaken : Infinity;
    const riskAdjustedEfficiency = sustainableFights === Infinity
      ? (winRate > 0 ? Infinity : 0)
      : sustainableFights * (winRate / 100);
    const lossRate = Math.max(0, Math.min(100, finite(batch?.rates?.loss)));
    return {
      modelVersion: MODEL_VERSION,
      targetKey: target.key,
      countryKey: target.countryKey,
      countryName: target.countryName,
      expeditionName: target.expeditionName,
      expeditionSlug: target.expeditionSlug,
      name: target.name,
      isBoss: !!target.isBoss,
      simulations: Number(batch?.simulations) || 0,
      winRate,
      lossRate,
      unknownRate: Math.max(0, Math.min(100, finite(batch?.rates?.unknown))),
      averageDamageTaken: avgDamageTaken,
      averageDamageDealt: Math.max(0, finite(batch?.averages?.playerDamage)),
      averageRounds: Math.max(0, finite(batch?.averages?.rounds)),
      sustainableFights,
      riskAdjustedEfficiency,
      usableHp,
      hpThresholdPercent: threshold
    };
  }

  async function simulateTargetBatchAsync({
    engine,
    player,
    target,
    simulations = DEFAULT_SIMULATIONS,
    seed = 1,
    maxRounds = DEFAULT_MAX_ROUNDS,
    chunkSize = 25,
    playerLifeMax = null,
    hpThresholdPercent = 30,
    onProgress = null,
    onYield = null
  } = {}) {
    if (!engine) throw new Error("Combat simulator engine unavailable.");
    if (!player) throw new Error("Player combat profile is unavailable.");
    if (!target?.enemy) throw new Error("Expedition target data is unavailable.");

    const count = clampInt(simulations, 1, MAX_SIMULATIONS, DEFAULT_SIMULATIONS);
    const baseSeed = Math.max(1, Math.trunc(finite(seed, 1)));
    const enemies = new Array(count);
    for (let i = 0; i < count; i++) {
      // Same seed sequence across targets reduces Monte Carlo noise when the
      // target rankings are compared, while each target still receives fresh
      // enemy rolls from its own stat ranges.
      enemies[i] = buildEnemyProfile(engine, target.enemy, baseSeed + ((i + 1) * 0x9E3779B1));
    }

    const batch = await engine.simulateBatchAsync({
      player,
      enemy: enemies[0],
      enemies,
      simulations: count,
      seed: baseSeed,
      lifeMode: "full",
      maxRounds: Math.max(1, Math.min(50, Math.trunc(finite(maxRounds, DEFAULT_MAX_ROUNDS)))),
      chunkSize: Math.max(1, Math.min(100, Math.trunc(finite(chunkSize, 25)))),
      onProgress,
      onYield
    });

    return resultMetrics(batch, target, playerLifeMax ?? player.lifeMax, hpThresholdPercent);
  }

  function sortResults(results) {
    return [...(Array.isArray(results) ? results : [])].sort((a, b) => {
      const ae = Number.isFinite(Number(a?.riskAdjustedEfficiency)) ? Number(a.riskAdjustedEfficiency) : Infinity;
      const be = Number.isFinite(Number(b?.riskAdjustedEfficiency)) ? Number(b.riskAdjustedEfficiency) : Infinity;
      if (be !== ae) return be - ae;
      if (Number(b?.winRate) !== Number(a?.winRate)) return Number(b?.winRate || 0) - Number(a?.winRate || 0);
      if (Number(a?.averageDamageTaken) !== Number(b?.averageDamageTaken)) return Number(a?.averageDamageTaken || 0) - Number(b?.averageDamageTaken || 0);
      return String(a?.name || "").localeCompare(String(b?.name || ""));
    });
  }

  function rankResults(results, minWinRate = 99) {
    const threshold = Math.max(0, Math.min(100, finite(minWinRate, 99)));
    const rankedAll = sortResults(results);
    const eligible = rankedAll.filter(result => Number(result?.winRate) >= threshold);
    const ranked = [
      ...eligible,
      ...rankedAll.filter(result => !eligible.includes(result))
    ];
    return {
      modelVersion: MODEL_VERSION,
      minWinRate: threshold,
      count: rankedAll.length,
      eligibleCount: eligible.length,
      recommended: eligible[0] || rankedAll[0] || null,
      ranked
    };
  }

  globalThis.GladiatusFarmingAdvisor = Object.freeze({
    VERSION: MODEL_VERSION,
    DEFAULT_SIMULATIONS,
    MAX_SIMULATIONS,
    buildEnemyProfile,
    simulateTargetBatchAsync,
    sortResults,
    rankResults
  });
})();
