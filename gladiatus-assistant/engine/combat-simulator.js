"use strict";

(() => {
  const TRAINABLE = ["strength", "dexterity", "agility", "constitution", "charisma", "intelligence"];
  const MODIFIER_KEYS = [
    "strength", "dexterity", "agility", "constitution", "charisma", "intelligence",
    "armour", "health", "criticalAttack", "blockValue", "hardening", "healing", "damage", "threat", "criticalHealing"
  ];
  const SLOTS = ["helmet", "amulet", "chest", "gloves", "weapon", "shield", "boots", "ring1", "ring2"];
  const MODEL_VERSION = "dinodevs-arena-ported-v2";
  const DEFAULT_ARENA_ROUNDS = 15;

  function finite(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }

  function numberOrNull(value) {
    if (value == null || (typeof value === "string" && value.trim() === "")) return null;
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, finite(value)));
  }

  function roundDino(value) {
    const n = finite(value);
    return n >= 0 ? Math.floor(n + 0.5) : Math.ceil(n - 0.5);
  }

  function hitChance(skill, enemyAgility) {
    const s = Math.max(0, finite(skill));
    const a = Math.max(0, finite(enemyAgility));
    if (s <= 0 || s + a <= 0) return 0;
    return Math.floor(s / (s + a) * 100);
  }

  function doubleHitChance(charisma, skill, enemyIntelligence, enemyAgility) {
    const c = Math.max(0, finite(charisma));
    const s = Math.max(0, finite(skill));
    const ei = Math.max(1, finite(enemyIntelligence, 1));
    const ea = Math.max(1, finite(enemyAgility, 1));
    return roundDino((c * s) / (ea * ei) * 10);
  }

  function totalBlockValue(strength, itemBlockValue = 0) {
    return Math.max(0, Math.floor(finite(strength) / 10) + finite(itemBlockValue));
  }

  function blockChance(level, strength, itemBlockValue = 0, enemyLevel = 0) {
    const levelFactor = Math.max(2, finite(level) - 8);
    const base = roundDino(totalBlockValue(strength, itemBlockValue) * 52 / levelFactor / 6);
    return clamp(base + Math.max(0, finite(level) - finite(enemyLevel)) * 2, 0, 50);
  }

  function criticalAttackValue(dexterity, itemCritical = 0) {
    return Math.max(0, Math.floor(finite(dexterity) / 10) + finite(itemCritical));
  }

  function criticalChance(level, dexterity, itemCritical = 0) {
    const levelFactor = Math.max(2, finite(level) - 8);
    return clamp(roundDino(criticalAttackValue(dexterity, itemCritical) * 52 / levelFactor / 5), 0, 50);
  }

  function resilience(agility, itemHardening = 0) {
    return Math.max(0, Math.floor(finite(agility) / 10) + finite(itemHardening));
  }

  function avoidCritChance(level, agility, itemHardening = 0) {
    const levelFactor = Math.max(2, finite(level) - 8);
    return clamp(roundDino(resilience(agility, itemHardening) * 52 / levelFactor / 4), 0, 25);
  }

  function damageRange(baseMin, baseMax, itemDamage = 0, strength = 0, itemDamagePercent = 0) {
    const flatBonus = finite(itemDamage) + Math.floor(finite(strength) / 10);
    const factor = 1 + finite(itemDamagePercent) / 100;
    const min = Math.max(0, Math.round((finite(baseMin) + flatBonus) * factor));
    const max = Math.max(min, Math.round((finite(baseMax) + flatBonus) * factor));
    return { min, max };
  }

  function armourAbsorption(armour) {
    const a = Math.max(0, finite(armour));
    return {
      min: Math.max(0, Math.floor(a / 66) - Math.floor((a - 66) / 660 + 1)),
      max: Math.max(0, Math.floor(a / 66) + Math.floor(a / 660))
    };
  }

  function modifier() {
    return { flat: 0, percent: 0 };
  }

  function modifierSet() {
    const out = {};
    for (const key of MODIFIER_KEYS) out[key] = modifier();
    return out;
  }

  function mergeModifier(target, source) {
    if (!target || !source) return;
    if (typeof source === "number") {
      target.flat += finite(source);
      return;
    }
    target.flat += finite(source.flat);
    target.percent += finite(source.percent);
  }

  function itemModifier(item, key) {
    // Durability is intentionally excluded from optimization/simulation calculations.
    // The scanner may still capture durability for display and diagnostics.
    const out = modifier();
    mergeModifier(out, item?.raw?.[key]);
    return out;
  }

  function parseRange(input) {
    if (input == null) return null;
    if (typeof input === "object" && Number.isFinite(Number(input.min)) && Number.isFinite(Number(input.max))) {
      return { min: Number(input.min), max: Number(input.max) };
    }
    const text = String(input);
    const match = text.match(/(-?\d+(?:[.,]\d+)?)\s*[-–]\s*(-?\d+(?:[.,]\d+)?)/);
    if (!match) return null;
    return {
      min: Number(match[1].replace(",", ".")),
      max: Number(match[2].replace(",", "."))
    };
  }

  function aggregateEquipment(equipment) {
    const totals = modifierSet();
    const slots = {};
    let itemCount = 0;

    for (const slot of SLOTS) {
      const item = equipment?.[slot];
      if (!item) continue;
      itemCount++;
      slots[slot] = {
        name: item.name || "Unknown item",
        itemId: item.itemId ?? null,
        listingId: item.listingId ?? null,
        categoryValue: item.categoryValue ?? null
      };
      for (const key of MODIFIER_KEYS) mergeModifier(totals[key], itemModifier(item, key));
    }

    return { itemCount, slots, totals };
  }

  function displayedStat(stats, key) {
    return numberOrNull(stats?.[key]);
  }

  function baseStat(input, key) {
    const detailBase = numberOrNull(input?.statDetails?.[key]?.base);
    if (detailBase != null) return { value: detailBase, source: "statDetails.base" };
    const explicit = numberOrNull(input?.baseStats?.[key]);
    if (explicit != null) return { value: explicit, source: "baseStats" };
    return { value: null, source: null };
  }

  function deriveTrainableStat(input, key, itemTotals) {
    const base = baseStat(input, key);
    if (base.value == null) {
      const displayed = displayedStat(input?.stats || input?.displayedStats, key);
      return {
        value: displayed,
        source: displayed == null ? "unavailable" : "displayed",
        base: null,
        itemFlat: finite(itemTotals?.[key]?.flat),
        itemPercent: finite(itemTotals?.[key]?.percent)
      };
    }
    const mod = itemTotals?.[key] || modifier();
    const continuous = (base.value + mod.flat) * (1 + mod.percent / 100);
    return {
      value: Math.round(continuous),
      continuous,
      source: "base+items",
      base: base.value,
      itemFlat: mod.flat,
      itemPercent: mod.percent
    };
  }

  function equipmentDamageRange(equipment, itemTotals, strength, baseDamageRange = { min: 0, max: 0 }) {
    const weapon = equipment?.weapon;
    const weaponRange = parseRange(weapon?.raw?.damage);
    const weaponMin = weaponRange?.min ?? 0;
    const weaponMax = weaponRange?.max ?? weaponMin;
    const weaponRawFlat = finite(weapon?.raw?.damage?.flat);
    const weaponDurFlat = finite(weapon?.throughDurability?.damage?.flat);
    const otherDamageFlat = finite(itemTotals?.damage?.flat) - weaponRawFlat - weaponDurFlat;
    const damagePercent = finite(itemTotals?.damage?.percent);
    const baseMin = finite(baseDamageRange?.min) + weaponMin + otherDamageFlat;
    const baseMax = finite(baseDamageRange?.max) + weaponMax + otherDamageFlat;
    const range = damageRange(baseMin, baseMax, 0, strength, damagePercent);
    return {
      ...range,
      source: weaponRange ? "base+weapon+items+strength" : "base+items+strength",
      baseMin: finite(baseDamageRange?.min),
      baseMax: finite(baseDamageRange?.max),
      weaponMin: weaponRange?.min ?? null,
      weaponMax: weaponRange?.max ?? null,
      otherDamageFlat,
      damagePercent,
      strengthContribution: Math.floor(finite(strength) / 10)
    };
  }

  function inferBaseDamageRange(displayedMin, displayedMax, equipment, itemTotals, strength) {
    const weapon = equipment?.weapon;
    const weaponRange = parseRange(weapon?.raw?.damage);
    const weaponMin = weaponRange?.min ?? 0;
    const weaponMax = weaponRange?.max ?? weaponMin;
    const weaponRawFlat = finite(weapon?.raw?.damage?.flat);
    const weaponDurFlat = finite(weapon?.throughDurability?.damage?.flat);
    const otherDamageFlat = finite(itemTotals?.damage?.flat) - weaponRawFlat - weaponDurFlat;
    const damagePercent = finite(itemTotals?.damage?.percent);
    const factor = 1 + damagePercent / 100;
    if (factor <= 0) return { min: 0, max: 0 };
    const strengthContribution = Math.floor(finite(strength) / 10);
    return {
      min: Math.max(0, finite(displayedMin) / factor - weaponMin - otherDamageFlat - strengthContribution),
      max: Math.max(0, finite(displayedMax) / factor - weaponMax - otherDamageFlat - strengthContribution)
    };
  }

  function calculateHitChance(dexterity, enemyAgility) {
    return hitChance(dexterity, enemyAgility);
  }

  function calculateDoubleHit(charisma, dexterity, enemyIntelligence, enemyAgility) {
    return doubleHitChance(charisma, dexterity, enemyIntelligence, enemyAgility);
  }

  function calculateBlockChance(level, strength, itemBlockValue = 0, enemyLevel = 0) {
    return blockChance(level, strength, itemBlockValue, enemyLevel);
  }

  function calculateCriticalChance(level, dexterity, itemCritical = 0) {
    return criticalChance(level, dexterity, itemCritical);
  }

  function calculateAvoidCritChance(level, agility, itemHardening = 0) {
    return avoidCritChance(level, agility, itemHardening);
  }

  function buildProfile({
    equipmentSnapshot = null,
    stats = {},
    baseStats = null,
    statDetails = null,
    opponentStats = null,
    explicitLifeMax = null,
    explicitArmour = null,
    explicitDamageRange = null,
    baseDamageRange = null,
    baseArmour = null,
    baseLifeMax = null,
    recalculateDerived = false,
    name = null
  } = {}) {
    const equipment = equipmentSnapshot?.equipment || equipmentSnapshot || {};
    const itemData = aggregateEquipment(equipment);
    const input = { stats, baseStats, statDetails };
    const derived = {};
    const sources = {};

    for (const key of TRAINABLE) {
      const displayed = !recalculateDerived ? displayedStat(stats, key) : null;
      if (displayed != null) {
        derived[key] = displayed;
        sources[key] = "displayed";
      } else {
        const projected = deriveTrainableStat(input, key, itemData.totals);
        derived[key] = projected.value;
        sources[key] = projected.source;
      }
    }

    const level = displayedStat(stats, "level") ?? finite(baseStats?.level ?? stats?.level, 0);
    derived.level = level;
    sources.level = displayedStat(stats, "level") != null ? "displayed" : "input";

    const displayedDamageMin = numberOrNull(stats?.damageMin);
    const displayedDamageMax = numberOrNull(stats?.damageMax);
    let damageRange = parseRange(explicitDamageRange);
    let baseDamage = baseDamageRange || null;
    if (damageRange == null && !recalculateDerived && displayedDamageMin != null && displayedDamageMax != null) {
      damageRange = { min: displayedDamageMin, max: displayedDamageMax };
    }
    if (damageRange == null && !baseDamage && recalculateDerived && displayedDamageMin != null && displayedDamageMax != null) {
      baseDamage = inferBaseDamageRange(displayedDamageMin, displayedDamageMax, equipmentSnapshot?.equipment || equipment, aggregateEquipment(equipment).totals, derived.strength ?? 0);
    }
    if (damageRange == null) {
      damageRange = equipmentDamageRange(equipment, itemData.totals, derived.strength ?? 0, baseDamage || { min: 0, max: 0 });
    }
    derived.damageMin = Math.max(0, finite(damageRange?.min));
    derived.damageMax = Math.max(derived.damageMin, finite(damageRange?.max, derived.damageMin));
    sources.damage = explicitDamageRange ? "explicit" : ((!recalculateDerived && displayedDamageMin != null) ? "displayed" : (baseDamage ? "base+equipment" : "equipment+strength"));

    const displayedArmour = numberOrNull(stats?.armour);
    const armourMod = itemData.totals.armour || modifier();
    if (explicitArmour != null) {
      derived.armour = Math.max(0, finite(explicitArmour));
      sources.armour = "explicit";
    } else if (!recalculateDerived && displayedArmour != null) {
      derived.armour = Math.max(0, displayedArmour);
      sources.armour = "displayed";
    } else if (baseArmour != null) {
      const divisor = 1 + armourMod.percent / 100;
      derived.armour = Math.max(0, Math.round(finite(baseArmour) * divisor + armourMod.flat));
      sources.armour = "explicit-base+items";
    } else if (displayedArmour != null) {
      const divisor = 1 + armourMod.percent / 100;
      const inferredBase = divisor > 0 ? (displayedArmour - armourMod.flat) / divisor : displayedArmour - armourMod.flat;
      derived.armour = Math.max(0, Math.round(inferredBase * divisor + armourMod.flat));
      sources.armour = "displayed-baseline+items";
    } else {
      derived.armour = Math.max(0, finite(baseStats?.armour) + armourMod.flat);
      sources.armour = "base+items";
    }

    const displayedLifeMax = numberOrNull(explicitLifeMax) ?? numberOrNull(stats?.lifeMax ?? stats?.healthMax);
    const healthMod = itemData.totals.health || modifier();
    if (displayedLifeMax != null && !recalculateDerived && explicitLifeMax == null) {
      derived.lifeMax = Math.max(1, displayedLifeMax);
      sources.lifeMax = "displayed";
    } else if (baseLifeMax != null) {
      const divisor = 1 + healthMod.percent / 100;
      derived.lifeMax = Math.max(1, Math.round(finite(baseLifeMax) * divisor + healthMod.flat));
      sources.lifeMax = "explicit-base+items";
    } else if (displayedLifeMax != null) {
      const divisor = 1 + healthMod.percent / 100;
      const inferredBase = divisor > 0 ? (displayedLifeMax - healthMod.flat) / divisor : displayedLifeMax - healthMod.flat;
      derived.lifeMax = Math.max(1, Math.round(inferredBase * divisor + healthMod.flat));
      sources.lifeMax = "displayed-baseline+items";
    } else {
      derived.lifeMax = Math.max(1, finite(baseStats?.lifeMax ?? baseStats?.healthMax, 1) + healthMod.flat);
      sources.lifeMax = "base+items";
    }

    derived.itemModifiers = itemData.totals;
    derived.itemCount = itemData.itemCount;
    const opponentAgility = numberOrNull(opponentStats?.agility);
    const opponentIntelligence = numberOrNull(opponentStats?.intelligence);
    derived.hitChance = !recalculateDerived && numberOrNull(stats?.hitChance) != null
      ? numberOrNull(stats.hitChance)
      : (opponentAgility != null ? calculateHitChance(derived.dexterity, opponentAgility) : 0);
    derived.doubleHit = !recalculateDerived && numberOrNull(stats?.doubleHit) != null
      ? numberOrNull(stats.doubleHit)
      : (opponentAgility != null && opponentIntelligence != null ? calculateDoubleHit(derived.charisma, derived.dexterity, opponentIntelligence, opponentAgility) : 0);
    derived.criticalChance = !recalculateDerived && numberOrNull(stats?.criticalChance) != null
      ? numberOrNull(stats.criticalChance)
      : calculateCriticalChance(derived.level, derived.dexterity, itemData.totals.criticalAttack.flat);
    derived.blockChance = !recalculateDerived && numberOrNull(stats?.blockChance) != null
      ? numberOrNull(stats.blockChance)
      : calculateBlockChance(derived.level, derived.strength, itemData.totals.blockValue.flat, numberOrNull(opponentStats?.level) ?? 0);
    derived.criticalAvoidance = !recalculateDerived && numberOrNull(stats?.criticalAvoidance) != null
      ? numberOrNull(stats.criticalAvoidance)
      : calculateAvoidCritChance(derived.level, derived.agility, itemData.totals.hardening.flat);
    derived.healing = !recalculateDerived && numberOrNull(stats?.healing) != null
      ? numberOrNull(stats.healing)
      : finite(itemData.totals.healing.flat);

    return {
      modelVersion: MODEL_VERSION,
      formulaVersion: MODEL_VERSION,
      name: name || stats?.name || null,
      level: derived.level,
      strength: finite(derived.strength),
      dexterity: finite(derived.dexterity),
      agility: finite(derived.agility),
      constitution: finite(derived.constitution),
      charisma: finite(derived.charisma),
      intelligence: finite(derived.intelligence),
      armour: Math.max(0, derived.armour),
      lifeMax: Math.max(1, derived.lifeMax),
      lifeCurrent: Math.max(1, Math.min(derived.lifeMax, numberOrNull(stats?.lifeCurrent) ?? derived.lifeMax)),
      damageMin: derived.damageMin,
      damageMax: derived.damageMax,
      hitChance: clamp(derived.hitChance, 0, 100),
      doubleHit: clamp(derived.doubleHit, 0, 100),
      criticalChance: clamp(derived.criticalChance, 0, 100),
      blockChance: clamp(derived.blockChance, 0, 100),
      criticalAvoidance: clamp(derived.criticalAvoidance, 0, 100),
      healing: Math.max(0, derived.healing),
      equipment: itemData.slots,
      itemModifiers: itemData.totals,
      itemCount: itemData.itemCount,
      dinoPoints: {
        avoidCritical: Math.max(0, Math.floor(finite(derived.agility) / 10) + finite(itemData.totals.hardening?.flat)),
        block: Math.max(0, Math.floor(finite(derived.strength) / 10) + finite(itemData.totals.blockValue?.flat)),
        critical: Math.max(0, Math.floor(finite(derived.dexterity) / 10) + finite(itemData.totals.criticalAttack?.flat))
      },
      buffs: {
        minerva: !!stats?.buffs?.minerva,
        mars: !!stats?.buffs?.mars,
        apollo: !!stats?.buffs?.apollo,
        honour_veteran: !!stats?.buffs?.honour_veteran,
        honour_destroyer: !!stats?.buffs?.honour_destroyer
      },
      baselines: {
        damageRange: baseDamage || null,
        armour: baseArmour != null ? finite(baseArmour) : ((displayedArmour != null && recalculateDerived) ? (() => {
          const divisor = 1 + armourMod.percent / 100;
          return divisor > 0 ? (displayedArmour - armourMod.flat) / divisor : displayedArmour - armourMod.flat;
        })() : null),
        lifeMax: baseLifeMax != null ? finite(baseLifeMax) : ((displayedLifeMax != null && recalculateDerived) ? (() => {
          const divisor = 1 + healthMod.percent / 100;
          return divisor > 0 ? (displayedLifeMax - healthMod.flat) / divisor : displayedLifeMax - healthMod.flat;
        })() : null),
        trainable: Object.fromEntries(TRAINABLE.map(key => [key, baseStat(input, key).value]))
      },
      sources
    };
  }

  function applyHypotheticalBaseInvestment(profile, key, investment = 1, opponent = null, equipmentSnapshot = null) {
    if (!TRAINABLE.includes(String(key))) throw new Error(`Unsupported trainable stat: ${key}`);
    const statKey = String(key);
    const n = Math.max(0, Math.floor(finite(investment, 0)));
    const next = JSON.parse(JSON.stringify(profile || {}));
    const baseBefore = numberOrNull(next?.baselines?.trainable?.[statKey]);
    if (baseBefore == null) throw new Error(`Missing baseline trained value for ${statKey}.`);
    const baseAfter = baseBefore + n;
    const itemMods = next.itemModifiers || modifierSet();
    const mod = itemMods[statKey] || modifier();
    const factor = 1 + finite(mod.percent) / 100;
    const effectiveAfter = Math.max(0, Math.round((baseAfter + finite(mod.flat)) * factor));
    const effectiveBefore = Math.max(0, finite(next[statKey]));

    next[statKey] = effectiveAfter;
    next.baselines = next.baselines && typeof next.baselines === "object" ? next.baselines : {};
    next.baselines.trainable = next.baselines.trainable && typeof next.baselines.trainable === "object" ? next.baselines.trainable : {};
    next.baselines.trainable[statKey] = baseAfter;

    const enemy = opponent || {};
    next.hitChance = calculateHitChance(next.dexterity, enemy.agility);
    next.doubleHit = calculateDoubleHit(next.charisma, next.dexterity, enemy.intelligence, enemy.agility);
    next.criticalChance = calculateCriticalChance(next.level, next.dexterity, itemMods.criticalAttack?.flat || 0);
    next.blockChance = calculateBlockChance(next.level, next.strength, itemMods.blockValue?.flat || 0, numberOrNull(enemy.level) ?? 0);
    next.criticalAvoidance = calculateAvoidCritChance(next.level, next.agility, itemMods.hardening?.flat || 0);
    next.dinoPoints = {
      critical: Math.max(0, Math.floor(finite(next.dexterity) / 10) + finite(itemMods.criticalAttack?.flat)),
      block: Math.max(0, Math.floor(finite(next.strength) / 10) + finite(itemMods.blockValue?.flat)),
      avoidCritical: Math.max(0, Math.floor(finite(next.agility) / 10) + finite(itemMods.hardening?.flat))
    };

    const damageBaseline = next.baselines?.damageRange;
    if (damageBaseline) {
      const equipmentSource = equipmentSnapshot?.equipment || equipmentSnapshot || null;
      if (equipmentSource) {
        const projectedRange = equipmentDamageRange(equipmentSource, itemMods, next.strength, damageBaseline);
        next.damageMin = projectedRange.min;
        next.damageMax = projectedRange.max;
      }
    } else if (statKey === "strength") {
      const delta = Math.floor(finite(next.strength) / 10) - Math.floor(effectiveBefore / 10);
      next.damageMin = Math.max(0, finite(profile?.damageMin) + delta);
      next.damageMax = Math.max(next.damageMin, finite(profile?.damageMax) + delta);
    }

    const armourBaseline = numberOrNull(next.baselines?.armour);
    if (armourBaseline != null) {
      const modArmour = itemMods.armour || modifier();
      next.armour = Math.max(0, Math.round(armourBaseline * (1 + finite(modArmour.percent) / 100) + finite(modArmour.flat)));
    }

    const healthBaseline = numberOrNull(next.baselines?.lifeMax);
    if (healthBaseline != null) {
      const healthMod = itemMods.health || modifier();
      const healthFactor = 1 + finite(healthMod.percent) / 100;
      next.lifeMax = Math.max(1, Math.round(healthBaseline * healthFactor + finite(healthMod.flat)));
      if (statKey === "constitution" && n !== 0) {
        next.lifeMax = Math.max(1, Math.round(next.lifeMax + n * 25 * healthFactor));
      }
    } else if (statKey === "constitution" && n !== 0) {
      next.lifeMax = Math.max(1, finite(profile?.lifeMax, 1) + n * 25);
    }

    next.lifeCurrent = next.lifeMax;
    next.hypothetical = true;
    next.sources = next.sources && typeof next.sources === "object" ? { ...next.sources } : {};
    next.sources.hypotheticalBaseInvestment = statKey;
    return { profile: next, baseBefore, baseAfter, effectiveBefore, effectiveAfter, investment: n };
  }

  function applyHypotheticalStats(profile, overrides = {}, opponent = null, equipmentSnapshot = null) {
    const next = JSON.parse(JSON.stringify(profile || {}));
    const originalConstitution = finite(next.constitution);
    for (const key of TRAINABLE) {
      const value = numberOrNull(overrides?.[key]);
      if (value != null) next[key] = Math.max(0, value);
    }

    const enemy = opponent || {};
    const itemMods = next.itemModifiers || modifierSet();
    next.hitChance = calculateHitChance(next.dexterity, enemy.agility);
    next.doubleHit = calculateDoubleHit(next.charisma, next.dexterity, enemy.intelligence, enemy.agility);
    next.criticalChance = calculateCriticalChance(next.level, next.dexterity, itemMods.criticalAttack?.flat || 0);
    next.blockChance = calculateBlockChance(next.level, next.strength, itemMods.blockValue?.flat || 0, numberOrNull(enemy.level) ?? 0);
    next.criticalAvoidance = calculateAvoidCritChance(next.level, next.agility, itemMods.hardening?.flat || 0);

    const damageBaseline = next.baselines?.damageRange;
    if (damageBaseline) {
      const equipmentSource = equipmentSnapshot?.equipment || equipmentSnapshot || null;
      if (equipmentSource) {
        const projectedRange = equipmentDamageRange(equipmentSource, itemMods, next.strength, damageBaseline);
        next.damageMin = projectedRange.min;
        next.damageMax = projectedRange.max;
      }
    } else {
      const oldStrengthContribution = Math.floor(finite(profile?.strength) / 10);
      const newStrengthContribution = Math.floor(finite(next.strength) / 10);
      const delta = newStrengthContribution - oldStrengthContribution;
      next.damageMin = Math.max(0, finite(profile?.damageMin) + delta);
      next.damageMax = Math.max(next.damageMin, finite(profile?.damageMax) + delta);
    }

    const armourBaseline = numberOrNull(next.baselines?.armour);
    const healthBaseline = numberOrNull(next.baselines?.lifeMax);
    if (armourBaseline != null) {
      const mod = itemMods.armour || modifier();
      next.armour = Math.max(0, Math.round(armourBaseline * (1 + mod.percent / 100) + mod.flat));
    }
    if (healthBaseline != null) {
      const mod = itemMods.health || modifier();
      next.lifeMax = Math.max(1, Math.round(healthBaseline * (1 + mod.percent / 100) + mod.flat));
    }

    const constitutionDelta = finite(next.constitution) - originalConstitution;
    if (constitutionDelta !== 0) {
      const healthMod = itemMods.health || modifier();
      const healthFactor = 1 + finite(healthMod.percent) / 100;
      // Gladiatus adds 25 maximum life per point of Constitution. Apply any
      // percentage health item modifier to the Constitution-derived portion.
      next.lifeMax = Math.max(1, Math.round(finite(next.lifeMax, 1) + constitutionDelta * 25 * healthFactor));
    }

    if (next.sources && typeof next.sources === "object") {
      next.sources.hypotheticalStats = Object.keys(overrides).length ? "manual-overrides" : next.sources.hypotheticalStats || null;
    }

    next.hypothetical = true;
    return next;
  }

  function applyHypotheticalCombatModifiers(profile, adjustments = {}) {
    const next = JSON.parse(JSON.stringify(profile || {}));
    const num = key => finite(adjustments?.[key]);
    next.lifeMax = Math.max(1, finite(next.lifeMax, 1) + num("health"));
    next.lifeCurrent = next.lifeMax;
    next.armour = Math.max(0, finite(next.armour) + num("armour"));
    next.damageMin = Math.max(1, finite(next.damageMin, 1) + num("damageMin"));
    next.damageMax = Math.max(next.damageMin, finite(next.damageMax, next.damageMin) + num("damageMax"));

    const baseMods = next.itemModifiers && typeof next.itemModifiers === "object" ? next.itemModifiers : modifierSet();
    const itemMods = { ...modifierSet(), ...baseMods };
    for (const key of ["criticalAttack", "blockValue", "hardening"]) {
      const current = itemMods[key] && typeof itemMods[key] === "object" ? itemMods[key] : modifier();
      itemMods[key] = { flat: finite(current.flat), percent: finite(current.percent) };
      itemMods[key].flat += num(key);
    }
    next.itemModifiers = itemMods;
    next.dinoPoints = {
      critical: Math.max(0, Math.floor(finite(next.dexterity) / 10) + finite(itemMods.criticalAttack.flat)),
      block: Math.max(0, Math.floor(finite(next.strength) / 10) + finite(itemMods.blockValue.flat)),
      avoidCritical: Math.max(0, Math.floor(finite(next.agility) / 10) + finite(itemMods.hardening.flat))
    };
    next.hypothetical = true;
    return next;
  }

  function createSeededRng(seed = 1) {
    let state = (finite(seed, 1) >>> 0) || 1;
    return () => {
      state |= 0;
      state = (state + 0x6D2B79F5) | 0;
      let t = Math.imul(state ^ state >>> 15, 1 | state);
      t = (t + Math.imul(t ^ t >>> 7, 61 | t)) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function rollInt(rng, min, max) {
    if (max <= min) return Math.round(min);
    return Math.round(min) + Math.floor(rng() * (Math.round(max) - Math.round(min) + 1));
  }

  function rollPercent(rng, chance) {
    return rng() < clamp(chance, 0, 100) / 100;
  }

  function effectiveDamageRange(attacker, defender, critical, blocked = false, criticalAvoided = false) {
    const baseMin = Math.max(0, finite(attacker.damageMin));
    const baseMax = Math.max(baseMin, finite(attacker.damageMax, baseMin));
    const absorb = armourAbsorption(defender.armour);
    let rawMin;
    let rawMax;

    if (blocked) {
      rawMin = baseMin * 0.5;
      rawMax = baseMax * 0.5;
    } else if (critical && !criticalAvoided) {
      rawMin = baseMin * 2;
      rawMax = baseMax * 2;
    } else {
      rawMin = baseMin;
      rawMax = baseMax;
    }

    return {
      min: Math.max(0, rawMin - absorb.max),
      max: Math.max(0, rawMax - absorb.min),
      absorption: absorb,
      blocked: !!blocked,
      critical: !!critical && !criticalAvoided,
      criticalAvoided: !!criticalAvoided,
      blockMultiplier: blocked ? 0.5 : 1
    };
  }

  function normalizeBattleProfile(profile, fallbackName) {
    if (!profile) throw new TypeError(`Missing ${fallbackName} combat profile.`);
    const itemMods = profile.itemModifiers || {};
    const dinoPoints = profile.dinoPoints || {
      avoidCritical: Math.max(0, Math.floor(finite(profile.agility) / 10) + finite(itemMods.hardening?.flat)),
      block: Math.max(0, Math.floor(finite(profile.strength) / 10) + finite(itemMods.blockValue?.flat)),
      critical: Math.max(0, Math.floor(finite(profile.dexterity) / 10) + finite(itemMods.criticalAttack?.flat))
    };
    return {
      name: profile.name || fallbackName,
      level: finite(profile.level),
      lifeMax: Math.max(1, finite(profile.lifeMax, 1)),
      lifeCurrent: Math.max(1, Math.min(finite(profile.lifeMax, 1), finite(profile.lifeCurrent, profile.lifeMax))),
      strength: Math.max(0, finite(profile.strength)),
      dexterity: Math.max(0, finite(profile.dexterity)),
      agility: Math.max(0, finite(profile.agility)),
      constitution: Math.max(0, finite(profile.constitution)),
      charisma: Math.max(0, finite(profile.charisma)),
      intelligence: Math.max(1, finite(profile.intelligence, 1)),
      armour: Math.max(0, finite(profile.armour)),
      damageMin: Math.max(1, finite(profile.damageMin, profile.damage)),
      damageMax: Math.max(Math.max(1, finite(profile.damageMin, profile.damage)), finite(profile.damageMax, profile.damageMin ?? profile.damage)),
      dinoPoints: {
        avoidCritical: Math.max(0, finite(dinoPoints.avoidCritical)),
        block: Math.max(0, finite(dinoPoints.block)),
        critical: Math.max(0, finite(dinoPoints.critical))
      },
      buffs: {
        minerva: !!profile?.buffs?.minerva,
        mars: !!profile?.buffs?.mars,
        apollo: !!profile?.buffs?.apollo,
        honour_veteran: !!profile?.buffs?.honour_veteran,
        honour_destroyer: !!profile?.buffs?.honour_destroyer
      }
    };
  }

  function calculateDinoChances(player, opponent) {
    const points = {
      avoidCritical: Math.max(0, player.dinoPoints.avoidCritical),
      block: Math.max(0, player.dinoPoints.block),
      critical: Math.max(0, player.dinoPoints.critical)
    };

    const baseAvoidCriticalPoints = Math.floor(player.agility / 10);
    const itemHardeningPoints = Math.max(0, points.avoidCritical - baseAvoidCriticalPoints);
    let avoidCriticalChance = calculateAvoidCritChance(
      player.level,
      player.agility,
      itemHardeningPoints
    );
    let blockChanceValue = calculateBlockChance(
      player.level,
      player.strength,
      points.block - Math.floor(player.strength / 10),
      opponent.level
    );
    let criticalChanceValue = calculateCriticalChance(
      player.level,
      player.dexterity,
      points.critical - Math.floor(player.dexterity / 10)
    );
    let hitChanceValue = calculateHitChance(player.dexterity, opponent.agility);
    let doubleHit = calculateDoubleHit(player.charisma, player.dexterity, opponent.intelligence, opponent.agility);

    if (player.buffs.minerva || opponent.buffs.minerva) doubleHit = 0;
    if (player.buffs.mars || opponent.buffs.mars) criticalChanceValue = 0;
    if (player.buffs.apollo) blockChanceValue += 15;
    if (player.buffs.honour_veteran) criticalChanceValue += 10;

    let armour = player.armour;
    if (opponent.buffs.honour_destroyer) armour = Math.max(0, armour - opponent.level * 15);

    return {
      hitChance: Math.max(0, hitChanceValue),
      doubleHit: Math.max(0, doubleHit),
      criticalChance: Math.max(0, criticalChanceValue),
      blockChance: Math.max(0, blockChanceValue),
      criticalAvoidance: Math.max(0, Math.min(25, avoidCriticalChance)),
      armour,
      armourAbsorption: armourAbsorption(armour),
      dinoPoints: points
    };
  }

  function createBattleRng(seed = 1) {
    // Deterministic PRNG for reproducible batch simulations. The distribution matches
    // the inclusive integer rand(0,100) / rand(min,max) shape used by DinoDevs.
    return createSeededRng(seed);
  }

  function dinoRandInt(rng, min, max) {
    const lo = Math.ceil(finite(min));
    const hi = Math.floor(finite(max, lo));
    if (hi <= lo) return lo;
    return lo + Math.floor(rng() * (hi - lo + 1));
  }

  function dinoRollPercent(rng, chance) {
    return dinoRandInt(rng, 0, 100) <= finite(chance);
  }

  function dinoHitSimulation(attacker, defender, rng, chancesA, chancesB) {
    // Directly mirrors DinoDevs' roll order:
    // hit -> critical -> critical avoidance, otherwise block -> damage.
    if (!dinoRollPercent(rng, chancesA.hitChance)) {
      return { type: "missed", damage: 0, critical: false, criticalAttempted: false, criticalAvoided: false, blocked: false };
    }

    const armourRoll = () => dinoRandInt(rng, chancesB.armourAbsorption.min, chancesB.armourAbsorption.max);
    const damageRoll = () => dinoRandInt(rng, attacker.damageMin, attacker.damageMax);

    if (dinoRollPercent(rng, chancesA.criticalChance)) {
      const criticalAvoided = dinoRollPercent(rng, chancesB.criticalAvoidance);
      const rawDamage = (criticalAvoided ? 1 : 2) * damageRoll() - armourRoll();
      return {
        type: criticalAvoided ? "critical-avoided" : "critical",
        damage: Math.max(0, rawDamage),
        critical: !criticalAvoided,
        criticalAttempted: true,
        criticalAvoided,
        blocked: false
      };
    }

    if (dinoRollPercent(rng, chancesB.blockChance)) {
      const rawDamage = damageRoll() / 2 - armourRoll();
      return {
        type: "blocked",
        damage: Math.max(0, rawDamage),
        critical: false,
        criticalAttempted: false,
        criticalAvoided: false,
        blocked: true
      };
    }

    const rawDamage = damageRoll() - armourRoll();
    return {
      type: "normal",
      damage: Math.max(0, rawDamage),
      critical: false,
      criticalAttempted: false,
      criticalAvoided: false,
      blocked: false
    };
  }

  function simulateBattle({ player, enemy, seed = 1, maxRounds = DEFAULT_ARENA_ROUNDS, lifeMode = "current" } = {}) {
    const roundLimit = Math.max(1, Math.min(50, Math.floor(finite(maxRounds, DEFAULT_ARENA_ROUNDS))));
    const attacker = normalizeBattleProfile(player, "player");
    const defender = normalizeBattleProfile(enemy, "enemy");
    const rng = createBattleRng(seed);

    const attackerChances = calculateDinoChances(attacker, defender);
    const defenderChances = calculateDinoChances(defender, attacker);
    attacker.armour = attackerChances.armour;
    defender.armour = defenderChances.armour;

    const selectLife = profile => {
      const max = Math.max(1, profile.lifeMax);
      switch (String(lifeMode || "current").toLowerCase()) {
        case "full": return max;
        case "unlimited": return Infinity;
        default: return Math.max(1, Math.min(max, profile.lifeCurrent));
      }
    };

    const life = {
      player: selectLife(attacker),
      enemy: selectLife(defender)
    };
    const initialLife = { ...life };
    const scores = { player: 0, enemy: 0 };
    const rounds = [];
    const counters = {
      playerAttempts: 0, playerHits: 0, playerMisses: 0, playerBlocks: 0, playerCrits: 0,
      playerCriticalAttempts: 0, playerCriticalAvoided: 0, playerDoubleAttacks: 0, playerAttackOpportunities: 0,
      enemyAttempts: 0, enemyHits: 0, enemyMisses: 0, enemyBlocks: 0, enemyCrits: 0,
      enemyCriticalAttempts: 0, enemyCriticalAvoided: 0, enemyDoubleAttacks: 0, enemyAttackOpportunities: 0
    };

    const participants = {
      player: { profile: attacker, chances: attackerChances },
      enemy: { profile: defender, chances: defenderChances }
    };

    let sequence = 0;
    let winner = null;

    const emitAttack = (sourceKey, targetKey, events) => {
      if (winner) return;
      const source = participants[sourceKey];
      const target = participants[targetKey];
      const attackCount = 1 + (dinoRollPercent(rng, source.chances.doubleHit) ? 1 : 0);
      counters[`${sourceKey}AttackOpportunities`]++;
      if (attackCount > 1) counters[`${sourceKey}DoubleAttacks`]++;

      for (let pairSequence = 1; pairSequence <= attackCount; pairSequence++) {
        if (winner || life[targetKey] <= 0) break;
        const key = sourceKey;
        counters[`${key}Attempts`]++;
        const hit = dinoHitSimulation(source.profile, target.profile, rng, source.chances, target.chances);
        const before = life[targetKey];
        const rawDamage = Math.max(0, finite(hit.damage));
        const actualDamage = Number.isFinite(before) ? Math.max(0, Math.min(before, rawDamage)) : rawDamage;
        life[targetKey] = Number.isFinite(before) ? Math.max(0, before - rawDamage) : before;

        const event = {
          sequence,
          attacker: source.profile.name,
          target: target.profile.name,
          resultType: hit.type === "missed" ? "miss" : hit.type === "blocked" ? "blocked" : "damage",
          resultText: hit.type === "missed" ? "missed" : "",
          damage: hit.type === "missed" ? null : actualDamage,
          critical: !!hit.critical,
          criticalAttempted: !!hit.criticalAttempted,
          criticalAvoided: !!hit.criticalAvoided,
          pairSequence,
          durabilityLosses: []
        };
        sequence++;

        if (hit.type === "missed") {
          counters[`${key}Misses`]++;
          event.resultText = "missed";
          events.push(event);
          continue;
        }

        counters[`${key}Hits`]++;
        if (hit.blocked) counters[`${key}Blocks`]++;
        if (hit.criticalAttempted) counters[`${key}CriticalAttempts`]++;
        if (hit.criticalAvoided) counters[`${key}CriticalAvoided`]++;
        if (hit.critical) counters[`${key}Crits`]++;
        scores[sourceKey] += actualDamage;

        if (hit.type === "blocked") {
          event.resultText = actualDamage > 0 ? `${target.profile.name} receives ${formatDamage(actualDamage)} damage (blocked)` : "blocked";
        } else if (hit.type === "critical-avoided") {
          event.resultText = `${target.profile.name} receives ${formatDamage(actualDamage)} damage (critical avoided)`;
        } else if (hit.type === "critical") {
          event.resultText = `*${target.profile.name} receives ${formatDamage(actualDamage)} damage*`;
        } else {
          event.resultText = `${target.profile.name} receives ${formatDamage(actualDamage)} damage`;
        }
        if (life[targetKey] <= 0) {
          event.resultText += `${target.profile.name} dies`;
          winner = sourceKey;
        }
        events.push(event);
      }
    };

    function formatDamage(value) {
      return Number.isInteger(value) ? String(value) : String(Math.round(value * 10) / 10);
    }

    let completedRounds = 0;
    while (!winner && completedRounds < roundLimit && life.player > 0 && life.enemy > 0) {
      const round = completedRounds + 1;
      const events = [];
      const order = ["player", "enemy"];
      for (const sourceKey of order) emitAttack(sourceKey, sourceKey === "player" ? "enemy" : "player", events);
      if (events.length) rounds.push({ round, events });
      completedRounds++;
    }

    const score = scores.player - scores.enemy;
    let outcomeType = "loss";
    let resolution = "score";
    if (life.enemy <= 0 || score > 0) {
      winner = "player";
      outcomeType = "win";
      resolution = life.enemy <= 0 ? "death" : "score";
    } else if (score === 0) {
      winner = null;
      outcomeType = "unknown";
      resolution = "draw";
    } else {
      winner = "enemy";
      outcomeType = "loss";
      resolution = life.player <= 0 ? "death" : "score";
    }

    const playerDamage = scores.player;
    const enemyDamage = scores.enemy;
    return {
      modelVersion: MODEL_VERSION,
      formulaVersion: MODEL_VERSION,
      seed,
      settings: { maxRounds: roundLimit, lifeMode: String(lifeMode || "current") },
      dino: {
        attackerFirst: true,
        sourceCompatibility: "GladiatusBattleSimulator LGPL-2.1 port"
      },
      outcome: {
        type: outcomeType,
        winner: winner === "player" ? attacker.name : winner === "enemy" ? defender.name : null,
        resolution
      },
      rounds,
      totalEvents: sequence,
      counters,
      summary: {
        playerDamage,
        enemyDamage,
        playerLifeRemaining: Number.isFinite(life.player) ? life.player : null,
        enemyLifeRemaining: Number.isFinite(life.enemy) ? life.enemy : null,
        initialPlayerLife: Number.isFinite(initialLife.player) ? initialLife.player : null,
        initialEnemyLife: Number.isFinite(initialLife.enemy) ? initialLife.enemy : null,
        rounds: rounds.length,
        playerHitRate: counters.playerAttempts ? counters.playerHits / counters.playerAttempts * 100 : 0,
        enemyHitRate: counters.enemyAttempts ? counters.enemyHits / counters.enemyAttempts * 100 : 0,
        playerCritRate: counters.playerCriticalAttempts ? counters.playerCrits / counters.playerCriticalAttempts * 100 : 0,
        enemyCritRate: counters.enemyCriticalAttempts ? counters.enemyCrits / counters.enemyCriticalAttempts * 100 : 0,
        playerDoubleHitRate: counters.playerAttackOpportunities ? counters.playerDoubleAttacks / counters.playerAttackOpportunities * 100 : 0,
        enemyDoubleHitRate: counters.enemyAttackOpportunities ? counters.enemyDoubleAttacks / counters.enemyAttackOpportunities * 100 : 0
      },
      chances: {
        player: attackerChances,
        enemy: defenderChances
      }
    };
  }

  function optionsLifeIsUnlimited(options) {
    return String(options?.lifeMode || "current").toLowerCase() === "unlimited";
  }

  function createBatchAccumulator(includeResults = false) {
    return {
      includeResults,
      results: [],
      outcomes: { wins: 0, losses: 0, unknown: 0 },
      playerDamage: 0,
      enemyDamage: 0,
      rounds: 0,
      playerLife: 0,
      enemyLife: 0,
      playerHits: 0,
      playerAttempts: 0,
      playerCrits: 0,
      playerCriticalAttempts: 0,
      playerBlocksReceived: 0,
      playerDoubleAttacks: 0,
      playerAttackOpportunities: 0,
      enemyHits: 0,
      enemyAttempts: 0,
      enemyCrits: 0,
      enemyCriticalAttempts: 0,
      enemyBlocks: 0,
      enemyDoubleAttacks: 0,
      enemyAttackOpportunities: 0
    };
  }

  function addBatchResult(acc, result) {
    if (acc.includeResults && acc.results.length < 1000) acc.results.push(result);
    const key = result.outcome.type === "win" ? "wins" : result.outcome.type === "loss" ? "losses" : "unknown";
    acc.outcomes[key]++;
    acc.playerDamage += result.summary.playerDamage;
    acc.enemyDamage += result.summary.enemyDamage;
    acc.rounds += result.summary.rounds;
    if (Number.isFinite(result.summary.playerLifeRemaining)) acc.playerLife += result.summary.playerLifeRemaining;
    if (Number.isFinite(result.summary.enemyLifeRemaining)) acc.enemyLife += result.summary.enemyLifeRemaining;
    acc.playerHits += result.counters.playerHits;
    acc.playerAttempts += result.counters.playerAttempts;
    acc.playerCrits += result.counters.playerCrits;
    acc.playerCriticalAttempts += result.counters.playerCriticalAttempts;
    acc.playerBlocksReceived += result.counters.enemyBlocks;
    acc.playerDoubleAttacks += result.counters.playerDoubleAttacks;
    acc.playerAttackOpportunities += result.counters.playerAttackOpportunities;
    acc.enemyHits += result.counters.enemyHits;
    acc.enemyAttempts += result.counters.enemyAttempts;
    acc.enemyCrits += result.counters.enemyCrits;
    acc.enemyCriticalAttempts += result.counters.enemyCriticalAttempts;
    acc.enemyBlocks += result.counters.playerBlocks;
    acc.enemyDoubleAttacks += result.counters.enemyDoubleAttacks;
    acc.enemyAttackOpportunities += result.counters.enemyAttackOpportunities;
  }

  function finalizeBatch(acc, count, options) {
    const probability = value => count ? value / count : 0;
    return {
      modelVersion: MODEL_VERSION,
      formulaVersion: MODEL_VERSION,
      simulations: count,
      outcomes: acc.outcomes,
      rates: {
        win: probability(acc.outcomes.wins) * 100,
        loss: probability(acc.outcomes.losses) * 100,
        unknown: probability(acc.outcomes.unknown) * 100,
        playerHit: acc.playerAttempts ? acc.playerHits / acc.playerAttempts * 100 : 0,
        playerCritical: acc.playerHits - acc.playerBlocksReceived > 0 ? acc.playerCrits / (acc.playerHits - acc.playerBlocksReceived) * 100 : 0,
        playerDoubleAttack: acc.playerAttackOpportunities ? acc.playerDoubleAttacks / acc.playerAttackOpportunities * 100 : 0,
        enemyHit: acc.enemyAttempts ? acc.enemyHits / acc.enemyAttempts * 100 : 0,
        enemyCritical: acc.enemyHits - acc.enemyBlocks > 0 ? acc.enemyCrits / (acc.enemyHits - acc.enemyBlocks) * 100 : 0,
        enemyDoubleAttack: acc.enemyAttackOpportunities ? acc.enemyDoubleAttacks / acc.enemyAttackOpportunities * 100 : 0
      },
      averages: {
        playerDamage: acc.playerDamage / count,
        enemyDamage: acc.enemyDamage / count,
        rounds: acc.rounds / count,
        playerLifeRemaining: optionsLifeIsUnlimited(options) ? null : acc.playerLife / count,
        enemyLifeRemaining: optionsLifeIsUnlimited(options) ? null : acc.enemyLife / count
      },
      resultCount: acc.results.length,
      results: acc.includeResults ? acc.results : null,
      counters: {
        playerAttackOpportunities: acc.playerAttackOpportunities,
        playerAttempts: acc.playerAttempts,
        playerHits: acc.playerHits,
        playerDoubleAttacks: acc.playerDoubleAttacks,
        playerBlocksReceived: acc.playerBlocksReceived,
        playerCrits: acc.playerCrits,
        playerCriticalAttempts: acc.playerCriticalAttempts,
        enemyAttackOpportunities: acc.enemyAttackOpportunities,
        enemyAttempts: acc.enemyAttempts,
        enemyHits: acc.enemyHits,
        enemyDoubleAttacks: acc.enemyDoubleAttacks,
        enemyBlocks: acc.enemyBlocks,
        enemyCrits: acc.enemyCrits,
        enemyCriticalAttempts: acc.enemyCriticalAttempts
      }
    };
  }

  function simulateBatch({ player, enemy, simulations = 500, seed = 1, includeResults = false, ...options } = {}) {
    const count = Math.max(1, Math.min(10000, Math.floor(finite(simulations, 500))));
    const acc = createBatchAccumulator(includeResults);
    for (let i = 0; i < count; i++) {
      const result = simulateBattle({ player, enemy, seed: finite(seed, 1) + i, ...options });
      addBatchResult(acc, result);
    }
    return finalizeBatch(acc, count, options);
  }

  async function simulateBatchAsync({ player, enemy, simulations = 500, seed = 1, includeResults = false, chunkSize = 25, onProgress = null, onYield = null, ...options } = {}) {
    const count = Math.max(1, Math.min(10000, Math.floor(finite(simulations, 500))));
    const chunk = Math.max(1, Math.min(count, Math.floor(finite(chunkSize, 25))));
    const baseSeed = finite(seed, 1);
    const acc = createBatchAccumulator(includeResults);
    const startedAt = performance?.now ? performance.now() : Date.now();
    let chunkStartedAt = startedAt;
    if (typeof onProgress === "function") {
      try { onProgress({ completed: 0, total: count, chunkSize: chunk, chunkElapsedMs: 0, totalElapsedMs: 0 }); } catch (_) {}
    }
    for (let i = 0; i < count; i++) {
      const result = simulateBattle({ player, enemy, seed: baseSeed + i, ...options });
      addBatchResult(acc, result);
      const completed = i + 1;
      if (completed % chunk === 0 || completed === count) {
        const now = performance?.now ? performance.now() : Date.now();
        if (typeof onProgress === "function") {
          try { onProgress({ completed, total: count, chunkSize: chunk, chunkElapsedMs: now - chunkStartedAt, totalElapsedMs: now - startedAt }); } catch (_) {}
        }
        chunkStartedAt = now;
      }
      if (completed < count && completed % chunk === 0) {
        const yieldAt = performance?.now ? performance.now() : Date.now();
        if (typeof onYield === "function") {
          try { onYield({ completed, total: count, chunkSize: chunk, yieldElapsedMs: yieldAt - startedAt }); } catch (_) {}
        }
        await new Promise(resolve => setTimeout(resolve, 0));
        const resumedAt = performance?.now ? performance.now() : Date.now();
        if (typeof onYield === "function") {
          try { onYield({ completed, total: count, chunkSize: chunk, resumed: true, resumeDelayMs: resumedAt - yieldAt, totalElapsedMs: resumedAt - startedAt }); } catch (_) {}
        }
        chunkStartedAt = resumedAt;
      }
    }
    return finalizeBatch(acc, count, options);
  }


  const DEFAULT_TURMA_ROUNDS = 50;

  function normalizeTurmaRole(profile) {
    const raw = String(profile?.turmaRole || profile?.roleKey || profile?.role || "").trim().toLowerCase();
    if (raw === "healer" || raw === "heal") return "healer";
    if (raw === "tank" || raw === "tanker") return "tank";
    if (raw === "leave" || raw === "out") return "leave";
    return "dps";
  }

  function normalizeTurmaProfile(profile, fallbackName = "Fighter", index = 0) {
    const base = normalizeBattleProfile(profile, fallbackName);
    const role = normalizeTurmaRole(profile);
    const itemMods = profile?.itemModifiers || {};
    const threatSource = profile?.turmaThreat ?? profile?.threat ?? profile?.stats?.threat ?? itemMods?.threat?.flat ?? 0;
    const criticalHealingSource = profile?.criticalHealing ?? profile?.stats?.criticalHealing ?? itemMods?.criticalHealing?.flat ?? 0;
    return {
      ...base,
      index,
      role,
      threat: role === "healer" ? 0 : Math.max(0, finite(threatSource)),
      criticalHealing: clamp(finite(criticalHealingSource), 0, 100),
      healing: Math.max(0, finite(profile?.healing)),
      itemModifiers: itemMods
    };
  }

  function calculateTurmaChances(teamA, teamB) {
    const apply = (team, opponents) => team.map((player) => {
      const levelFactor = Math.max(2, finite(player.level) - 8);
      const avoidCriticalChance = clamp(roundDino(player.dinoPoints.avoidCritical * 52 / levelFactor / 4), 0, 25);
      const criticalChance = roundDino(player.dinoPoints.critical * 52 / levelFactor / 5);
      const absorb = armourAbsorption(player.armour);
      const hitChance = [];
      const doubleHitChance = [];
      const blockChance = [];
      const blockStatic = roundDino(player.dinoPoints.block * 52 / levelFactor / 6);
      for (const opponent of opponents) {
        const denominator = Math.max(1, player.dexterity + opponent.agility);
        hitChance[opponent.index] = Math.floor(player.dexterity / denominator * 100);
        doubleHitChance[opponent.index] = clamp(Math.max(0, player.charisma - opponent.charisma), 0, 100);
        blockChance[opponent.index] = clamp(blockStatic + Math.max(0, player.level - opponent.level) * 2, 0, 50);
      }
      return {
        ...player,
        chances: {
          avoidCriticalChance,
          criticalChance,
          hitChance,
          doubleHitChance,
          blockChance,
          armourAbsorption: absorb
        }
      };
    });
    return { attackers: apply(teamA, teamB), defenders: apply(teamB, teamA) };
  }

  function turmaHitSimulation(attacker, defender, attackerChances, defenderChances, rng) {
    const hitChance = finite(attackerChances?.hitChance?.[defender.index], 0);
    if (!dinoRollPercent(rng, hitChance)) {
      return { type: "missed", damage: 0, critical: false, criticalAttempted: false, criticalAvoided: false, blocked: false };
    }
    const damageRoll = () => dinoRandInt(rng, attacker.damageMin, attacker.damageMax);
    const armourRoll = () => dinoRandInt(rng, defenderChances.armourAbsorption.min, defenderChances.armourAbsorption.max);
    if (dinoRollPercent(rng, attackerChances.criticalChance)) {
      const criticalAvoided = dinoRollPercent(rng, defenderChances.avoidCriticalChance);
      const rawDamage = (criticalAvoided ? 1 : 2) * damageRoll() - armourRoll();
      return {
        type: criticalAvoided ? "critical-avoided" : "critical",
        damage: Math.max(0, rawDamage),
        critical: !criticalAvoided,
        criticalAttempted: true,
        criticalAvoided,
        blocked: false
      };
    }
    if (dinoRollPercent(rng, defenderChances.blockChance?.[attacker.index])) {
      const rawDamage = damageRoll() / 2 - armourRoll();
      return { type: "blocked", damage: Math.max(0, rawDamage), critical: false, criticalAttempted: false, criticalAvoided: false, blocked: true };
    }
    const rawDamage = damageRoll() - armourRoll();
    return { type: "normal", damage: Math.max(0, rawDamage), critical: false, criticalAttempted: false, criticalAvoided: false, blocked: false };
  }

  function turmaMostWounded(players) {
    let selected = null;
    let wound = 0;
    for (const player of players) {
      const currentWound = Math.max(0, player.lifeMax - player.life);
      if (currentWound > wound) {
        selected = player;
        wound = currentWound;
      }
    }
    return selected;
  }

  function turmaThreatTarget(players, rng) {
    if (!players.length) return null;
    let total = 0;
    const weights = players.map(player => {
      const weight = player.last.threat > 0 ? player.last.threat : player.threat;
      const safeWeight = Math.max(0, finite(weight));
      total += safeWeight;
      return safeWeight;
    });
    if (total <= 0) return players[0];
    const selected = dinoRandInt(rng, 0, Math.max(0, Math.floor(total)));
    let remaining = selected;
    for (let i = 0; i < players.length; i++) {
      if (remaining <= weights[i]) return players[i];
      remaining -= weights[i];
    }
    return players[players.length - 1];
  }

  function turmaScore(team, opponents) {
    let score = 0;
    for (const player of team) {
      score += finite(player.score.damageDone);
      score += roundDino(finite(player.score.healingDone) / 2);
    }
    for (const opponent of opponents) if (opponent.life <= 0) score += opponent.life;
    return score;
  }

  function turmaClonePreparedTeam(team, fallbackPrefix) {
    return (Array.isArray(team) ? team : []).map((profile, index) => {
      const player = normalizeTurmaProfile(profile, `${fallbackPrefix} ${index + 1}`, index);
      return {
        ...player,
        life: player.lifeMax,
        score: { damageDone: 0, damageTaken: 0, healingDone: 0, healingTaken: 0 },
        last: { threat: 0, heal: 0, damage: 0 },
        isAlive: true
      };
    }).filter(player => player.role !== "leave");
  }

  function simulateTurmaBattle({ attackers = [], defenders = [], seed = 1, maxRounds = DEFAULT_TURMA_ROUNDS } = {}) {
    const roundLimit = Math.max(1, Math.min(50, Math.floor(finite(maxRounds, DEFAULT_TURMA_ROUNDS))));
    let teamA = turmaClonePreparedTeam(attackers, "Attacker");
    let teamB = turmaClonePreparedTeam(defenders, "Defender");
    if (!teamA.length || !teamB.length) throw new TypeError("Turma simulation requires at least one active fighter on each team.");
    const rng = createBattleRng(seed);
    const chances = calculateTurmaChances(teamA, teamB);
    teamA = chances.attackers;
    teamB = chances.defenders;
    const rounds = [];
    let sequence = 0;
    let completedRounds = 0;

    const livePlayers = (team) => team.filter(player => player.life > 0);

    const executeAction = (actor, teammates, opponents, actorTeam, actorChances, opponentChances) => {
      actor.last.heal = 0;
      actor.last.damage = 0;
      const wounded = actor.role === "healer" ? turmaMostWounded(teammates) : null;
      if (wounded) {
        let heal = actor.healing;
        if (dinoRollPercent(rng, actor.criticalHealing)) heal *= 2;
        heal = Math.max(0, Math.min(heal, wounded.lifeMax - wounded.life));
        wounded.life += heal;
        wounded.score.healingTaken += heal;
        actor.score.healingDone += heal;
        actor.last.heal = heal;
        actor.last.threat += heal;
        return { type: "heal", actor, target: wounded, amount: heal, critical: heal > actor.healing && actor.healing > 0 };
      }

      const target = turmaThreatTarget(opponents, rng);
      if (!target) return { type: "none", actor };
      const first = turmaHitSimulation(actor, target, actorChances, opponentChances.get(target.index), rng);
      let second = null;
      let firstDamage = Math.max(0, finite(first.damage));
      if (target.life - firstDamage < 0) firstDamage = target.life;
      if (target.life > firstDamage && dinoRollPercent(rng, actorChances.doubleHitChance?.[target.index])) {
        second = turmaHitSimulation(actor, target, actorChances, opponentChances.get(target.index), rng);
        let secondDamage = Math.max(0, finite(second.damage));
        if (target.life - firstDamage - secondDamage < 0) secondDamage = Math.max(0, target.life - firstDamage);
        second.damage = secondDamage;
      }
      target.life = Math.max(0, target.life - firstDamage);
      target.score.damageTaken += firstDamage;
      actor.score.damageDone += firstDamage;
      actor.last.damage = firstDamage;
      if (second) {
        target.life = Math.max(0, target.life - second.damage);
        target.score.damageTaken += second.damage;
        actor.score.damageDone += second.damage;
        actor.last.damage += actor.threat + second.damage;
      }
      actor.last.threat += 2 * (actor.threat + actor.last.damage);
      return {
        type: "attack", actor, target, amount: firstDamage + (second?.damage || 0),
        first, second, killed: target.life <= 0
      };
    };

    while (completedRounds < roundLimit && teamA.some(p => p.life > 0) && teamB.some(p => p.life > 0)) {
      const events = [];
      const active = [
        ...livePlayers(teamA).map(p => ({ side: "A", index: p.index, player: p })),
        ...livePlayers(teamB).map(p => ({ side: "B", index: p.index, player: p }))
      ];
      while (active.length && teamA.some(p => p.life > 0) && teamB.some(p => p.life > 0)) {
        const selected = dinoRandInt(rng, 0, active.length - 1);
        const [entry] = active.splice(selected, 1);
        if (!entry || entry.player.life <= 0) continue;
        const actorTeam = entry.side === "A" ? teamA : teamB;
        const opponentTeam = entry.side === "A" ? teamB : teamA;
        const actorChances = entry.side === "A" ? teamA.find(p => p.index === entry.index).chances : teamB.find(p => p.index === entry.index).chances;
        const opponentChanceSource = entry.side === "A" ? teamB : teamA;
        const opponentChances = new Map(opponentChanceSource.map(p => [p.index, p.chances]));
        const result = executeAction(entry.player, livePlayers(actorTeam), livePlayers(opponentTeam), actorTeam, actorChances, opponentChances);
        if (result.type === "attack") {
          events.push({ sequence: sequence++, attacker: entry.player.name, target: result.target.name, action: "attack", damage: result.amount, killed: result.killed, critical: !!result.first?.critical, blocked: !!result.first?.blocked });
        } else if (result.type === "heal") {
          events.push({ sequence: sequence++, attacker: entry.player.name, target: result.target.name, action: "heal", amount: result.amount, critical: result.critical });
        }
        for (let i = active.length - 1; i >= 0; i--) if (active[i].player.life <= 0) active.splice(i, 1);
      }
      if (events.length) rounds.push({ round: completedRounds + 1, events });
      completedRounds++;
    }

    const attackerScore = turmaScore(teamA, teamB);
    const defenderScore = turmaScore(teamB, teamA);
    let outcome = "draw";
    if (attackerScore > defenderScore) outcome = "win";
    else if (attackerScore < defenderScore) outcome = "loss";
    const attackerAlive = teamA.filter(p => p.life > 0).length;
    const defenderAlive = teamB.filter(p => p.life > 0).length;
    return {
      modelVersion: `${MODEL_VERSION}+turma`,
      formulaVersion: `${MODEL_VERSION}+turma-ported-v1`,
      seed,
      settings: { maxRounds: roundLimit },
      dino: { teamMode: "circus-turma", sourceCompatibility: "GladiatusBattleSimulator simulate_turma_arena.php" },
      outcome: { type: outcome === "win" ? "win" : outcome === "loss" ? "loss" : "unknown", winner: outcome === "win" ? "attackers" : outcome === "loss" ? "defenders" : null, resolution: attackerAlive === 0 || defenderAlive === 0 ? "wipe" : "score" },
      summary: {
        attackerScore, defenderScore, attackerAlive, defenderAlive, rounds: completedRounds,
        attackerDamage: teamA.reduce((sum, p) => sum + p.score.damageDone, 0),
        defenderDamage: teamB.reduce((sum, p) => sum + p.score.damageDone, 0),
        attackerHealing: teamA.reduce((sum, p) => sum + p.score.healingDone, 0),
        defenderHealing: teamB.reduce((sum, p) => sum + p.score.healingDone, 0)
      },
      teams: { attackers: teamA, defenders: teamB },
      roundsLog: rounds
    };
  }

  function createTurmaBatchAccumulator(includeResults = false) {
    return { includeResults, results: [], outcomes: { wins: 0, losses: 0, unknown: 0 }, attackerScore: 0, defenderScore: 0, attackerDamage: 0, defenderDamage: 0, attackerHealing: 0, defenderHealing: 0, rounds: 0 };
  }

  function addTurmaBatchResult(acc, result) {
    if (acc.includeResults && acc.results.length < 500) acc.results.push(result);
    const key = result.outcome.type === "win" ? "wins" : result.outcome.type === "loss" ? "losses" : "unknown";
    acc.outcomes[key]++;
    acc.attackerScore += result.summary.attackerScore;
    acc.defenderScore += result.summary.defenderScore;
    acc.attackerDamage += result.summary.attackerDamage;
    acc.defenderDamage += result.summary.defenderDamage;
    acc.attackerHealing += result.summary.attackerHealing;
    acc.defenderHealing += result.summary.defenderHealing;
    acc.rounds += result.summary.rounds;
  }

  function finalizeTurmaBatch(acc, count, options) {
    return {
      modelVersion: `${MODEL_VERSION}+turma`,
      formulaVersion: `${MODEL_VERSION}+turma-ported-v1`,
      simulations: count,
      outcomes: acc.outcomes,
      rates: {
        win: acc.outcomes.wins / count * 100,
        loss: acc.outcomes.losses / count * 100,
        unknown: acc.outcomes.unknown / count * 100
      },
      averages: {
        attackerScore: acc.attackerScore / count,
        defenderScore: acc.defenderScore / count,
        attackerDamage: acc.attackerDamage / count,
        defenderDamage: acc.defenderDamage / count,
        attackerHealing: acc.attackerHealing / count,
        defenderHealing: acc.defenderHealing / count,
        rounds: acc.rounds / count
      },
      resultCount: acc.results.length,
      results: acc.includeResults ? acc.results : null,
      settings: { maxRounds: Math.max(1, Math.min(50, Math.floor(finite(options?.maxRounds, DEFAULT_TURMA_ROUNDS)))) }
    };
  }

  function simulateTurmaBatch({ attackers = [], defenders = [], simulations = 500, seed = 1, includeResults = false, ...options } = {}) {
    const count = Math.max(1, Math.min(10000, Math.floor(finite(simulations, 500))));
    const acc = createTurmaBatchAccumulator(includeResults);
    const baseSeed = finite(seed, 1);
    for (let i = 0; i < count; i++) addTurmaBatchResult(acc, simulateTurmaBattle({ attackers, defenders, seed: baseSeed + i, ...options }));
    return finalizeTurmaBatch(acc, count, options);
  }

  async function simulateTurmaBatchAsync({ attackers = [], defenders = [], simulations = 500, seed = 1, includeResults = false, chunkSize = 25, onProgress = null, onYield = null, ...options } = {}) {
    const count = Math.max(1, Math.min(10000, Math.floor(finite(simulations, 500))));
    const chunk = Math.max(1, Math.min(count, Math.floor(finite(chunkSize, 25))));
    const baseSeed = finite(seed, 1);
    const acc = createTurmaBatchAccumulator(includeResults);
    const startedAt = performance?.now ? performance.now() : Date.now();
    for (let i = 0; i < count; i++) {
      addTurmaBatchResult(acc, simulateTurmaBattle({ attackers, defenders, seed: baseSeed + i, ...options }));
      const completed = i + 1;
      if (completed % chunk === 0 || completed === count) {
        const now = performance?.now ? performance.now() : Date.now();
        try { onProgress?.({ completed, total: count, chunkSize: chunk, totalElapsedMs: now - startedAt }); } catch (_) {}
      }
      if (completed < count && completed % chunk === 0) {
        try { onYield?.({ completed, total: count, chunkSize: chunk }); } catch (_) {}
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    return finalizeTurmaBatch(acc, count, options);
  }

  function projectEquipment({ currentEquipmentSnapshot = null, hypotheticalEquipmentSnapshot = null, liveStats = {}, opponentStats = null } = {}) {
    const currentEquipment = currentEquipmentSnapshot?.equipment || currentEquipmentSnapshot || {};
    const hypotheticalEquipment = hypotheticalEquipmentSnapshot?.equipment || hypotheticalEquipmentSnapshot || {};
    const currentAggregated = aggregateEquipment(currentEquipment);
    const liveStrength = numberOrNull(liveStats?.strength) ?? numberOrNull(liveStats?.statDetails?.strength?.current) ?? 0;
    const currentArmour = numberOrNull(liveStats?.armour);
    const currentArmourMod = currentAggregated.totals.armour || modifier();
    const armourDivisor = 1 + currentArmourMod.percent / 100;
    const baseArmour = currentArmour != null ? (armourDivisor > 0 ? (currentArmour - currentArmourMod.flat) / armourDivisor : currentArmour - currentArmourMod.flat) : null;
    const currentLifeMax = numberOrNull(liveStats?.lifeMax ?? liveStats?.healthMax);
    const currentHealthMod = currentAggregated.totals.health || modifier();
    const healthDivisor = 1 + currentHealthMod.percent / 100;
    const baseLifeMax = currentLifeMax != null ? (healthDivisor > 0 ? (currentLifeMax - currentHealthMod.flat) / healthDivisor : currentLifeMax - currentHealthMod.flat) : null;
    const currentDamageMin = numberOrNull(liveStats?.damageMin);
    const currentDamageMax = numberOrNull(liveStats?.damageMax);
    const baseDamageRange = currentDamageMin != null && currentDamageMax != null
      ? inferBaseDamageRange(currentDamageMin, currentDamageMax, currentEquipment, currentAggregated.totals, liveStrength)
      : null;

    return buildProfile({
      equipmentSnapshot: hypotheticalEquipment,
      stats: liveStats,
      statDetails: liveStats?.statDetails,
      opponentStats,
      baseDamageRange,
      baseArmour,
      baseLifeMax,
      recalculateDerived: true
    });
  }

  function buildProfileFromSnapshot(snapshot, liveStats = {}, options = {}) {
    return buildProfile({
      equipmentSnapshot: snapshot,
      stats: liveStats,
      statDetails: liveStats?.statDetails,
      baseStats: options.baseStats || null,
      opponentStats: options.opponentStats || null,
      explicitLifeMax: options.explicitLifeMax ?? null,
      explicitArmour: options.explicitArmour ?? null,
      explicitDamageRange: options.explicitDamageRange ?? null,
      baseDamageRange: options.baseDamageRange ?? null,
      baseArmour: options.baseArmour ?? null,
      baseLifeMax: options.baseLifeMax ?? null,
      recalculateDerived: options.recalculateDerived === true,
      name: options.name || null
    });
  }

  function prepareHypotheticalEquipment({ currentEquipment = {}, replacements = {} } = {}) {
    const equipment = { ...currentEquipment };
    for (const slot of SLOTS) {
      if (Object.prototype.hasOwnProperty.call(replacements, slot)) {
        equipment[slot] = replacements[slot] || null;
      }
    }
    return equipment;
  }

  globalThis.GladiatusCombatSimulator = Object.freeze({
    VERSION: MODEL_VERSION,
    TRAINABLE: [...TRAINABLE],
    SLOTS: [...SLOTS],
    aggregateEquipment,
    armourAbsorption,
    buildProfile,
    buildProfileFromSnapshot,
    applyHypotheticalStats,
    applyHypotheticalBaseInvestment,
    projectEquipment,
    prepareHypotheticalEquipment,
    applyHypotheticalCombatModifiers,
    createSeededRng,
    effectiveDamageRange,
    calculateDinoChances,
    simulateBattle,
    simulateBatch,
    simulateBatchAsync,
    simulateTurmaBattle,
    simulateTurmaBatch,
    simulateTurmaBatchAsync
  });
})();
