(() => {
  "use strict";

  const api = globalThis.browser || globalThis.chrome;
  const VERSION = "0.5.97";
  const STORAGE_KEY_PREFIX = "equipment:v0.2.5.9:";
  const OVERLAY_STATE_PREFIX = "overlay:v0.2.5.10:";
  const ACTIVE_TAB_PREFIX = "active-tab:v0.3.5:";
  const ARENA_ANALYSIS_STORAGE_PREFIX = "arena-opponent-analysis:v0.5:";
  const CIRCUS_PROVINCIARUM_STORAGE_PREFIX = "auto-provinciarum:v0.1:";
  const CIRCUS_PROVINCIARUM_ANALYSIS_STORAGE_PREFIX = "provinciarum-opponent-analysis:v0.1:";
  const CIRCUS_COMBAT_STORAGE_PREFIX = "circus-combat:v0.1:";
  const DUNGEON_STORAGE_PREFIX = "auto-dungeon:v0.1.0:";
  const DUNGEON_COMBAT_STORAGE_PREFIX = "dungeon-combat:v0.1:";
  const DUNGEON_LOCATION_ID = "0";
  const DUNGEON_LOCATION_NAME = "Cave Temple";
  const SLOT_ORDER = ["helmet", "amulet", "weapon", "chest", "shield", "gloves", "boots", "ring1", "ring2"];
  const SLOT_LABELS = {
    helmet: "Helmet", amulet: "Amulet", weapon: "Weapon", chest: "Chest", shield: "Shield",
    gloves: "Gloves", boots: "Boots", ring1: "Ring 1", ring2: "Ring 2"
  };
  const QUALITY_NAMES = Object.freeze({
    white: "Standard", green: "Ceres", blue: "Neptune", purple: "Mars", orange: "Jupiter", red: "Olympus", unknown: "Unknown"
  });
  const QUALITY_FALLBACK_COLORS = Object.freeze({
    white: "#f5f5f5", green: "lime", blue: "#5159F7", purple: "#b86cff", orange: "#ff9f1c", red: "#ff4545", unknown: "#e5e7eb"
  });
  const LABELS = {
    level: "Level", strength: "STR", dexterity: "DEX", agility: "AGI",
    constitution: "CON", charisma: "CHA", intelligence: "INT", armour: "Armour", damage: "Damage", health: "HP"
  };
  const AUCTION_STORAGE_PREFIX = "auction:v0.3.2:";
  const LEGACY_AUCTION_STORAGE_PREFIX = "auction:v0.3:";
  const AUCTION_GOLD_ICON_PREFIX = "auction-gold-icon:v0.3.2:";
  const AUCTION_DIAGNOSTIC_PREFIX = "auction-diagnostic:v0.3.2:";
  const AUCTION_COMPARISON_DIAGNOSTIC_PREFIX = "auction-comparison-diagnostic:v0.5.21:";
  const AUCTION_COMPARISON_DIAGNOSTIC_MAX_EVENTS = 250;
  const AUCTION_COMPARISON_STORAGE_PREFIX = "auction-comparison:v0.1:";
  const AUCTION_VIEW_STATE_PREFIX = "auction-view-state:v0.1:";
  const AUCTION_AFFIX_CATALOG_STORAGE_KEY = "auction-affix-catalog:v0.1";
  const AUCTION_AFFIX_NONE_TOKEN = "__none__";
  const AUCTION_AFFIX_CATALOG_MAX_AGE_MS = 24 * 60 * 60 * 1000;
  const AUCTION_AFFIX_CATALOG_URLS = Object.freeze({
    prefixes: "https://raw.githubusercontent.com/Djongov/gladiatus-fansite/main/static/data/items/prefixes.json",
    suffixes: "https://raw.githubusercontent.com/Djongov/gladiatus-fansite/main/static/data/items/suffixes.json"
  });
  const COMBAT_STORAGE_PREFIX = "combat:v0.3.6:";
  const SIMULATOR_STATE_PREFIX = "combat-simulator:v0.4.5:";
  const STAT_PRIORITY_STORAGE_PREFIX = "stat-priority:v0.1:";
  const STAT_PRIORITY_DIAGNOSTIC_PREFIX = "stat-priority-diagnostics:v0.5.26:";
  const STAT_PRIORITY_DIAGNOSTIC_MAX_EVENTS = 250;
  const MASTER_DIAGNOSTIC_MAX_EVENTS = 1000;
  const MASTER_DIAGNOSTIC_PREVIEW_EVENTS = 120;
  const AUTO_EXPEDITION_STORAGE_PREFIX = "auto-expedition:v0.4.3.5:";
  const ARENA_STORAGE_PREFIX = "auto-arena:v0.1.0:";
  const ARENA_CAPTURE_STORAGE_PREFIX = "arena-combat:v0.1.0:";
  const CURRENT_STATS_STORAGE_PREFIX = "current-stats:v0.4.5.10:";
  const CHARACTER_PROFILE_STORAGE_PREFIX = "character-profile:v1:";
  const CHARACTER_CAPTURE_WORKFLOW_PREFIX = "character-capture:v1:";
  const CHARACTER_SELECTION_PREFIX = "character-selection:v1:";
  const CHARACTER_STATS_REFRESH_MS = 30000;
  const ARENA_MAX_RUNS = 1000;
  const ARENA_SIMULATION_ROUNDS = 15;
  const CIRCUS_PROVINCIARUM_MAX_RUNS = 1000;
  const CIRCUS_PROVINCIARUM_SIMULATION_ROUNDS = 50;
  const CIRCUS_PROVINCIARUM_TEAM_DOLL_IDS = Object.freeze(["2", "3", "4", "5", "6"]);
  const CIRCUS_OPPONENT_PROFILE_RETRY_LIMIT = 3;
  const CIRCUS_OPPONENT_PROFILE_RETRY_DELAYS_MS = Object.freeze([750, 1500, 3000]);
  const AUTO_EXPEDITION_MAX_RUNS = 1000;
  const CIRCUS_REPORT_CAPTURE_TIMEOUT_MS = 8000;
  const CIRCUS_REPORT_LOADING_GRACE_MS = 12000;
  const CIRCUS_REPORT_RETRY_MS = 350;
  const CIRCUS_CONFIRMATION_TIMEOUT_MS = 15000;
  const CIRCUS_CONFIRMATION_RETRY_DELAY_MS = 750;
  const CIRCUS_CONFIRMATION_RETRY_LIMIT = 3;
  const ARENA_CONFIRMATION_RETRY_DELAY_MS = 750;
  const ARENA_CONFIRMATION_RETRY_LIMIT = 3;
  const AUTO_COMBAT_GLOBAL_COOLDOWN_RETRY_MS = 1000;
  const AUTO_HEALING_STORAGE_PREFIX = "auto-healing:v0.4.6:";
  const AUTO_HEALING_TARGET_CONTAINER = "8";
  const AUTO_HEALING_TARGET_X = "1";
  const AUTO_HEALING_TARGET_Y = "1";
  const AUTO_HEALING_MAIN_DOLL = "1";
  const AUTO_HEALING_MAX_BAG_NUMBER = 9999;
  const EXPEDITION_COUNTRIES = Object.freeze({
    italy: {
      name: "Italy",
      locations: [
        [0, "Grimwood"], [1, "Pirate Harbour"], [2, "Misty Mountains"], [3, "Wolf Cave"],
        [4, "Ancient Temple"], [5, "Barbarian Village"], [6, "Bandit Camp"]
      ]
    },
    africa: {
      name: "Africa",
      locations: [
        [0, "Voodoo Temple"], [1, "Bridge"], [2, "Blood Cave"], [3, "Lost Harbour"],
        [4, "Umpokta Tribe"], [5, "Caravan"], [6, "Mesoai-Oasis"], [7, "Cliff Jumper"]
      ]
    },
    germania: {
      name: "Germania",
      locations: [
        [0, "Cave Temple"], [1, "The Green Forest"], [2, "Cursed Village"], [3, "Death Hill"],
        [4, "Vandal Village"], [5, "Mine"], [6, "Teuton Camp"], [7, "Koman Mountain"], [8, "Dragon Remains"]
      ]
    },
    britannia: {
      name: "Britannia",
      locations: [
        [0, "Bank of the Thames"], [1, "Forest Fortress"], [2, "The Moor"], [3, "Camp Cassivellaunus"],
        [4, "Kent"], [5, "The Ford"], [6, "Camulodunum"], [7, "Cambria"], [8, "Mona Isle"]
      ]
    }
  });
  const EXPEDITION_FIGHTS = Object.freeze({
    italy: {
      0: ["Rat", "Lynx", "Wolf", "Bear"],
      1: ["Fled Slave", "Corrupt Soldier", "Assassin", "Captain"],
      2: ["Elusive Recruit", "Harpy", "Cerberus", "Medusa"],
      3: ["Wild Boar", "Wolf Pack", "Alphawolf", "Werewolf"],
      4: ["Cultist Guard", "Wererat", "Minotaur", "Minotaur Chief"],
      5: ["Barbarian", "Barbarian Warrior", "Berserker", "Barbarian Chief"],
      6: ["Renegade Soldier", "Renegade Mercenary", "Assassinator", "Bandit Chief"]
    },
    africa: {
      0: ["Cobra", "Giant Scorpion", "Awakened Mummy", "Seth Priest"],
      1: ["Tax Collector", "Man Eater", "Tribal Warrior", "Bone Shaman"],
      2: ["Blood Wolf", "Giant Beetle", "Fire Dancer", "Fire Demon"],
      3: ["Crocodile", "Undead Holder", "Giant Water Snake", "Mokele Mbembe"],
      4: ["Tribal Warrior", "Tribal Magician", "Spirit Warrior", "Seth High Priest"],
      5: ["Spy", "Caravan Guard", "Elite Guard", "Slave Merchant"],
      6: ["Elephant", "Cheetah", "Demon Lion", "Demon Elephant"],
      7: ["Cursed Antelope", "Giant Spider", "Shaman", "High Shaman"]
    },
    germania: {
      0: ["Legionnaire", "Myrmidon", "Centurion", "Soulless"],
      1: ["Giant Wild Boar", "Swamp Lord", "Swamp Spirit", "Werebear"],
      2: ["Hun", "Ancient", "Nachzehrer", "Abomination"],
      3: ["Skeleton Warrior", "Skeleton Berserker", "Lich", "Necromancer Prince"],
      4: ["Vandal Warrior", "Jarl", "Dark Fighter", "Death Knight"],
      5: ["Guard", "Draug", "Stone Golem", "Tatzelwurm"],
      6: ["Barbarian", "Teuton Hero", "Teuton Lord", "Seidr"],
      7: ["Infernal Springbok", "Sabre-Tooth Tiger", "Dragon Whelp", "Dragon"],
      8: ["Bone Golem", "Lemures", "Ritualist", "Dracolich"]
    },
    britannia: {
      0: ["Bibroci", "Ancalite", "Cenimagni", "Cassi"],
      1: ["Forest Elf", "Dwarf", "British Chariot", "Callirius"],
      2: ["Lindow Man", "Lindow Woman", "Bandit", "Nodens"],
      3: ["Chariot Rider", "Mercenary", "Fflur", "Cassivellaunus"],
      4: ["Cingetorix", "Segovax", "Carvilius", "Taximagulus"],
      5: ["Bloodleech", "Water Spider", "Caratacus", "Togodumnus"],
      6: ["Town Guard", "Trinovantes Settler", "Trinovantes Warrior", "Caratacus"],
      7: ["Deceangli", "Caratacus", "Silures", "Ordovices"],
      8: ["Bard", "Seer", "Druid", "Antenociticus"]
    }
  });

  const SLOT_TO_CONTAINER = Object.freeze({
    helmet: "2", weapon: "3", shield: "4", chest: "5", ring1: "6", ring2: "7", gloves: "9", boots: "10", amulet: "11"
  });
  const AUCTION_CATEGORIES = Object.freeze([
    { value: "1", label: "Weapons" },
    { value: "2", label: "Shields" },
    { value: "3", label: "Chest Armour" },
    { value: "4", label: "Helmets" },
    { value: "5", label: "Gloves" },
    { value: "8", label: "Shoes" },
    { value: "6", label: "Rings" },
    { value: "9", label: "Amulets" },
    { value: "7", label: "Usable" },
    { value: "11", label: "Reinforcements" },
    { value: "12", label: "Upgrades" },
    { value: "15", label: "Mercenary" }
  ]);
  const AUCTION_CATEGORY_MAP = Object.freeze(Object.fromEntries(AUCTION_CATEGORIES.map(x => [x.value, x.label])));
  const AUCTION_RESULTS_FILTERS = Object.freeze([
    { value: "all", label: "All Items" },
    ...AUCTION_CATEGORIES,
    { value: "status:upgrade", label: "Upgrades Only" },
    { value: "status:sidegrade", label: "Sidegrades Only" },
    { value: "status:worse", label: "Worse Items Only" }
  ]);
  const AUCTION_RESULTS_SORTS = Object.freeze([
    { value: "scan", label: "Scan order" },
    { value: "improvement-desc", label: "Improvement ↓" },
    { value: "improvement-asc", label: "Improvement ↑" },
    { value: "efficiency-desc", label: "Efficiency ↓" },
    { value: "price-asc", label: "Price ↑" },
    { value: "price-desc", label: "Price ↓" }
  ]);
  const AUCTION_GOLD_ICON_PATH = "/cdn/img/res2.gif";

  let host = null;
  let shadow = null;
  let panel = null;
  let body = null;
  let statusEl = null;
  let currentEquipment = null;
  let latestParsedState = {};
  let selectedCharacterDollId = null;
  let settings = null;
  let overlayState = { visible: true, minimized: false, left: null, top: null, width: null, height: null };
  let savedEquipment = null;
  let characterProfileStore = { schemaVersion: 1, updatedAt: null, characters: {} };
  let characterStatsRefreshTimer = null;
  let characterCaptureBusy = false;
  let currentAuctionScan = null;
  let currentAuctionStore = null;
  let auctionGoldIconDataUrl = null;
  let auctionScanInFlight = false;
  let auctionScanStopRequested = false;
  let auctionResultFilter = "all";
  let auctionResultSort = "scan";
  let auctionResultMinImprovement = 0;
  let auctionResultMaxPrice = null;
  let auctionResultPrefixes = [];
  let auctionResultSuffixes = [];
  let auctionResultCombineAffixes = false;
  let auctionResultViewStateLoaded = false;
  let auctionAffixCatalog = { schemaVersion: 1, prefixes: [], suffixes: [], updatedAt: null, source: "unavailable", error: null };
  let auctionAffixCatalogLoaded = false;
  let auctionAffixCatalogPromise = null;
  let auctionAffixMenuOpen = null;
  let auctionAffixSearch = { prefix: "", suffix: "" };
  let auctionScanMenuOpen = false;
  let auctionWorkflowResumeTimer = null;
  let statPriorityStateLoaded = false;
  let statPriorityLastRenderedSignature = null;
  let auctionComparisonState = { generation: 0, context: null, contextPromise: null, cache: new Map(), inFlight: new Map(), queue: [], queued: new Set(), running: false, pendingInvalidation: false, pendingInvalidationReasons: new Set(), forceResimulation: false };
  let auctionComparisonPersistentResults = new Map();
  let auctionComparisonCurrentPlayerFingerprint = null;
  let auctionComparisonDiagnostics = { schemaVersion: 1, updatedAt: null, active: null, lastCompleted: null, events: [] };
  let auctionComparisonDiagnosticSaveTimer = null;
  let auctionComparisonDiagnosticWriteChain = Promise.resolve();
  let combatCaptureStore = null;
  let latestEquipmentDiagnostic = null;
  let latestAuctionDiagnostic = null;
  let masterDiagnosticText = "";
  let masterDiagnosticRefreshPromise = null;
  let combatCaptureObserver = null;
  let combatCaptureTimer = null;
  let combatCaptureInFlight = false;
  let autoExpeditionState = null;
  let autoExpeditionTimer = null;
  let autoExpeditionBusy = false;
  let arenaAutomationState = null;
  let arenaAutomationTimer = null;
  let arenaAutomationBusy = false;
  let arenaCombatStore = null;
  let arenaOpponentAnalysisStore = { schemaVersion: 3, updatedAt: null, setSignature: null, analysisSeedBase: null, playerProfile: null, opponents: {} };
  let arenaAnalysisBusy = false;
  let arenaAnalysisPromise = null;
  let circusProvinciarumAutomationState = null;
  let circusProvinciarumAutomationTimer = null;
  let circusProvinciarumAutomationBusy = false;
  let circusProvinciarumAnalysisStore = { schemaVersion: 1, updatedAt: null, setSignature: null, analysisSeedBase: null, playerProfile: null, opponents: {} };
  let circusProvinciarumAnalysisBusy = false;
  let circusProvinciarumAnalysisPromise = null;
  let nativeOpponentWinRateObserver = null;
  let nativeOpponentWinRateRenderTimer = null;
  let nativeOpponentWinRateAutoAnalysisTimer = null;
  let nativeOpponentWinRateAutoAnalysisReady = false;
  let nativeWinrateLastLoggedSignature = { arena: null, circus: null };
  let nativeOpponentWinRateObservedSetSignature = { arena: null, circus: null };
  let nativeAuctionComparisonObserver = null;
  let nativeAuctionComparisonRenderTimer = null;
  let nativeAuctionComparisonListenersReady = false;
  let nativeEquipmentComparisonObserver = null;
  let nativeEquipmentComparisonScanTimer = null;
  let nativeEquipmentComparisonScanInFlight = false;
  let nativeEquipmentComparisonScanGeneration = 0;
  let nativeEquipmentComparisonCandidates = new Map();
  let nativeEquipmentComparisonListenersReady = false;
  let nativeItemTooltipHoveredElement = null;
  let nativeItemTooltipHoveredKey = "";
  let nativeItemTooltipRenderTimer = null;
  let nativeItemTooltipLastPointerItem = null;
  let nativeItemTooltipLastPointerAt = 0;
  let circusCombatStore = null;
  let dungeonCombatStore = null;
  let dungeonReportWaitStartedAt = 0;
  let autoDungeonState = null;
  let autoDungeonTimer = null;
  let autoDungeonBusy = false;
  let arenaCaptureInFlight = false;
  // Both automation workflows share one browser tab. This short-lived in-memory
  // lease prevents independent resume timers from issuing competing navigations
  // during the same page transition. It resets naturally on page load.
  let automationNavigationOwner = null;
  let automationNavigationReleaseTimer = null;
  let autoCombatSchedulerTimer = null;
  let autoCombatCooldownObserver = null;
  let autoCombatSchedulerBusy = false;
  let autoCombatDispatcherState = { lastModule: null };
  let autoHealingState = null;
  let autoHealingBusy = false;
  let arenaReportWaitStartedAt = 0;
  let expeditionReportWaitStartedAt = 0;
  const POST_BATTLE_LOOT_WAIT_TIMEOUT_MS = 15000;
  const postBattleLootLifecycle = { expedition: null, dungeon: null };
  const VALID_TABS = new Set(["equipment", "auctions", "combat", "stat-priority", "diagnostics", "settings"]);
  const AUCTION_TIMING = Object.freeze({
    categorySettleMs: 1000,
    categoryJitterMs: 300,
    scrollSettleMs: 850,
    scrollJitterMs: 200,
    domSampleMs: 150,
    domJitterMs: 150,
    maxStalledIterations: 3
  });
  let activeTab = "equipment";
  let combatResultFilter = "all";
  let combatOpponentFilter = "all";
  let combatWindowFilter = "all";
  let simulatorState = { reportId: null, simulations: 500, seed: 1, lifeMode: "current", statOverrides: {}, equipmentSelections: {}, result: null };
  let statPriorityState = { mode: "turma", investment: 1, simulations: 50, seed: 1, training: null, result: null, manualAdjustments: { health: 0, armour: 0, damageMin: 0, damageMax: 0, criticalAttack: 0, blockValue: 0, hardening: 0 }, manualResult: null, turmaRoles: {}, selectedCharacterDollId: null, busy: false, error: null };
  let resizeSaveTimer = null;

  function storageGet(key) {
    return new Promise((resolve, reject) => {
      try {
        const result = api.storage.local.get(key);
        if (result?.then) result.then(resolve, reject);
        else api.storage.local.get(key, resolve);
      } catch (e) { reject(e); }
    });
  }

  function storageSet(data) {
    try {
      const result = api.storage.local.set(data);
      return result?.then ? result : Promise.resolve();
    } catch (e) { return Promise.reject(e); }
  }

  function storageRemove(key) {
    try {
      const result = api.storage.local.remove(key);
      return result?.then ? result : Promise.resolve();
    } catch (e) { return Promise.reject(e); }
  }

  function promiseWithTimeout(promise, timeoutMs, label = "operation") {
    const ms = Math.max(1, Number(timeoutMs) || 1);
    let timer = null;
    const timeoutPromise = new Promise((_, reject) => {
      timer = setTimeout(() => {
        const error = new Error(`${label} timed out after ${ms}ms`);
        error.code = "timeout";
        reject(error);
      }, ms);
    });
    return Promise.race([Promise.resolve(promise), timeoutPromise]).finally(() => {
      if (timer) { clearTimeout(timer); timer = null; }
    });
  }

  function runtimeSend(message) {
    return new Promise((resolve, reject) => {
      try {
        const result = api.runtime.sendMessage(message);
        if (result?.then) result.then(resolve, reject);
        else api.runtime.sendMessage(message, response => {
          const err = api.runtime.lastError;
          if (err) reject(new Error(err.message)); else resolve(response);
        });
      } catch (e) { reject(e); }
    });
  }

  function hostnameKey() { return location.hostname || "unknown"; }
  function equipmentKey() { return `${STORAGE_KEY_PREFIX}${hostnameKey()}`; }
  function auctionKey() { return `${AUCTION_STORAGE_PREFIX}${hostnameKey()}`; }
  function legacyAuctionKey() { return `${LEGACY_AUCTION_STORAGE_PREFIX}${hostnameKey()}`; }
  function auctionListingId(categoryValue, auctionIndex) {
    const category = String(categoryValue ?? "0");
    const index = Number(auctionIndex);
    return `${location.hostname}:auction:${category}:${Number.isFinite(index) ? index : "unknown"}`;
  }

  function repairAuctionItemIdentity(item, categoryValue) {
    if (!item || typeof item !== "object") return item;
    const category = String(categoryValue ?? item.categoryValue ?? item.auctionCategoryValue ?? "0");
    const index = Number(item.auctionIndex);
    item.categoryValue = category;
    item.auctionCategoryValue = category;
    if (Number.isFinite(index)) item.listingId = auctionListingId(category, index);
    return item;
  }
  function auctionWorkflowKey() { return `auction-workflow:v0.3.2:${hostnameKey()}`; }
  function auctionSelectionKey() { return `auction-selection:v0.3.2:${hostnameKey()}`; }
  function auctionGoldIconKey() { return `${AUCTION_GOLD_ICON_PREFIX}${hostnameKey()}`; }
  function auctionDiagnosticKey() { return `${AUCTION_DIAGNOSTIC_PREFIX}${hostnameKey()}`; }
  function auctionComparisonDiagnosticKey() { return `${AUCTION_COMPARISON_DIAGNOSTIC_PREFIX}${hostnameKey()}`; }
  function auctionComparisonStorageKey() { return `${AUCTION_COMPARISON_STORAGE_PREFIX}${hostnameKey()}`; }
  function auctionResultViewStateKey() { return `${AUCTION_VIEW_STATE_PREFIX}${hostnameKey()}`; }
  function overlayStateKey() { return `${OVERLAY_STATE_PREFIX}${hostnameKey()}`; }
  function activeTabKey() { return `${ACTIVE_TAB_PREFIX}${hostnameKey()}`; }
  function diagnosticKey() { return `diagnostic:v0.2.5.13:${hostnameKey()}`; }
  function combatKey() { return `${COMBAT_STORAGE_PREFIX}${hostnameKey()}`; }
  function simulatorStateKey() { return `${SIMULATOR_STATE_PREFIX}${hostnameKey()}`; }
  function statPriorityStateKey() { return `${STAT_PRIORITY_STORAGE_PREFIX}${hostnameKey()}`; }
  function statPriorityDiagnosticKey() { return `${STAT_PRIORITY_DIAGNOSTIC_PREFIX}${hostnameKey()}`; }
  function currentStatsSnapshotKey() { return `${CURRENT_STATS_STORAGE_PREFIX}${hostnameKey()}`; }
  function characterProfileKey() { return `${CHARACTER_PROFILE_STORAGE_PREFIX}${hostnameKey()}`; }
  function characterCaptureWorkflowKey() { return `${CHARACTER_CAPTURE_WORKFLOW_PREFIX}${hostnameKey()}`; }
  function characterSelectionKey() { return `${CHARACTER_SELECTION_PREFIX}${hostnameKey()}`; }
  function currentPageDollId() {
    try { return String(new URL(location.href).searchParams.get("doll") || document.querySelector("#doll")?.value || "1"); } catch (_) { return "1"; }
  }
  function currentOverviewHref() {
    const links = Array.from(document.querySelectorAll('a[href]'));
    const link = links.find(a => {
      try {
        const u = new URL(a.href, location.href);
        return u.searchParams.get("mod") === "overview" && !u.searchParams.get("doll") && !u.searchParams.get("submod");
      } catch (_) { return false; }
    });
    if (link?.href) return link.href;
    try {
      const u = new URL("/game/index.php?mod=overview", location.href);
      const sh = new URL(location.href).searchParams.get("sh");
      if (sh) u.searchParams.set("sh", sh);
      return u.href;
    } catch (_) { return null; }
  }

  const REQUIRED_CURRENT_PROFILE_KEYS = Object.freeze([
    "level", "strength", "dexterity", "agility", "constitution", "charisma", "intelligence",
    "lifeMax", "armour", "damageMin", "damageMax"
  ]);

  function currentStatsAreComplete(state) {
    if (!state || typeof state !== "object") return false;
    return REQUIRED_CURRENT_PROFILE_KEYS.every(key => {
      const raw = state?.[key] ?? (key === "lifeMax" ? state?.healthMax : undefined);
      if (raw == null || raw === "") return false;
      return Number.isFinite(Number(raw));
    });
  }

  async function loadCharacterProfileStore() {
    try {
      const result = await storageGet(characterProfileKey());
      const stored = result?.[characterProfileKey()];
      if (stored?.characters && typeof stored.characters === "object") {
        characterProfileStore = { schemaVersion: 1, updatedAt: stored.updatedAt || null, characters: { ...stored.characters } };
      }
    } catch (_) {}

    if (!Object.keys(characterProfileStore.characters || {}).length) {
      try {
        const legacyEq = (await storageGet(equipmentKey()))?.[equipmentKey()] || null;
        const legacyStats = (await storageGet(currentStatsSnapshotKey()))?.[currentStatsSnapshotKey()] || null;
        if (legacyEq?.equipment || legacyStats?.state) {
          characterProfileStore.characters["1"] = {
            schemaVersion: 1, dollId: "1", name: null, className: "Standard Battle", roleKey: "main", roleRaw: "Standard Battle",
            stats: legacyStats?.state || {}, statsUpdatedAt: legacyStats?.capturedAt || null,
            equipment: legacyEq?.equipment || {}, equipmentUpdatedAt: legacyEq?.scannedAt || legacyEq?.savedAt || null,
            fingerprint: legacyEq?.fingerprint || null, quickSignature: legacyEq?.quickSignature || null,
            diagnostics: legacyEq?.diagnostics || null, capturedAt: legacyEq?.scannedAt || legacyStats?.capturedAt || null
          };
          await saveCharacterProfileStore();
        }
      } catch (_) {}
    }
    return characterProfileStore;
  }

  async function saveCharacterProfileStore() {
    characterProfileStore.updatedAt = new Date().toISOString();
    try {
      await storageSet({ [characterProfileKey()]: characterProfileStore });
      return true;
    } catch (_) {
      const scrubbed = JSON.parse(JSON.stringify(characterProfileStore));
      for (const [dollId, profile] of Object.entries(scrubbed.characters || {})) {
        if (dollId !== "1") for (const item of Object.values(profile?.equipment || {})) if (item?.iconDataUrl) item.iconDataUrl = null;
      }
      try {
        await storageSet({ [characterProfileKey()]: scrubbed });
        characterProfileStore = scrubbed;
        return true;
      } catch (_) {
        for (const profile of Object.values(scrubbed.characters || {})) for (const item of Object.values(profile?.equipment || {})) if (item?.iconDataUrl) item.iconDataUrl = null;
        try {
          await storageSet({ [characterProfileKey()]: scrubbed });
          characterProfileStore = scrubbed;
          return true;
        } catch (_) { return false; }
      }
    }
  }

  function characterProfilesList() {
    return Object.values(characterProfileStore.characters || {})
      .filter(profile => profile && profile.dollId != null)
      .sort((a, b) => Number(a.dollId) - Number(b.dollId));
  }

  function roleDisplayName(roleKey) {
    return ({ main: "Main", healer: "Healer", dps: "DPS", tank: "Tank" })[String(roleKey || "").toLowerCase()] || "Other";
  }

  function characterDisplayName(profile) {
    if (!profile) return "No character profile";
    const className = String(profile.className || profile.name || `Character ${profile.dollId}`).trim();
    const role = roleDisplayName(profile.roleKey);
    return `${className} · ${role}`;
  }

  function selectedCharacterProfile() {
    return characterProfileStore.characters?.[String(selectedCharacterDollId)] || null;
  }

  // Doll 1 is the account's actual main character. Circus Turma roster
  // membership must never be inferred from the current Tank/DPS/Healer role,
  // because those roles are simulation overrides.
  function isMainCharacterProfile(profile) {
    return String(profile?.dollId || "") === "1";
  }

  function turmaCharacterProfilesList() {
    return characterProfilesList().filter(profile => !isMainCharacterProfile(profile));
  }

  function selectedCharacterStats() {
    const stats = selectedCharacterProfile()?.stats;
    return stats && typeof stats === "object" ? stats : {};
  }

  function characterProfileBaseStats(profile) {
    const stats = profile?.stats || {};
    const out = {};
    for (const key of TRAINABLE_STAT_KEYS) {
      const base = Number(stats?.statDetails?.[key]?.base);
      if (Number.isFinite(base)) out[key] = base;
    }
    return out;
  }

  function characterProfileMissingSimulationData(profile) {
    const stats = profile?.stats || {};
    const missing = REQUIRED_CURRENT_PROFILE_KEYS.filter(key => {
      const raw = stats?.[key] ?? (key === "lifeMax" ? stats?.healthMax : undefined);
      return raw == null || raw === "" || !Number.isFinite(Number(raw));
    });
    for (const key of TRAINABLE_STAT_KEYS) {
      const base = Number(stats?.statDetails?.[key]?.base);
      const max = Number(stats?.statDetails?.[key]?.max);
      if (!Number.isFinite(base)) missing.push(`${key} trained/base`);
      if (!Number.isFinite(max)) missing.push(`${key} maximum`);
    }
    if (!profile?.equipment || !Object.values(profile.equipment).some(Boolean)) missing.push("equipment");
    return [...new Set(missing)];
  }

  // Arena combat simulation only requires the current combat snapshot and
  // equipped items. Stat-priority base/max metadata is intentionally not a
  // prerequisite for Arena simulation. Keeping this separate also allows
  // Arena to recover from a legacy/live-refresh profile that lacks nested
  // statDetails while preserving that metadata for Stat Priority.
  function characterProfileMissingArenaSimulationData(profile) {
    const stats = profile?.stats || {};
    const missing = REQUIRED_CURRENT_PROFILE_KEYS.filter(key => {
      const raw = stats?.[key] ?? (key === "lifeMax" ? stats?.healthMax : undefined);
      return raw == null || raw === "" || !Number.isFinite(Number(raw));
    });
    if (!profile?.equipment || !Object.values(profile.equipment).some(Boolean)) missing.push("equipment");
    return [...new Set(missing)];
  }

  function statPriorityMode() {
    return statPriorityState?.mode === "arena" ? "arena" : "turma";
  }

  function selectedStatPriorityCharacterProfile(mode = statPriorityMode()) {
    if (mode === "arena") return characterProfileStore.characters?.["1"] || null;
    const roster = turmaCharacterProfilesList();
    if (!roster.length) return null;
    const selectedId = String(statPriorityState?.selectedCharacterDollId || "");
    const selected = roster.find(profile => String(profile.dollId) === selectedId);
    if (selected) return selected;
    const globallySelected = roster.find(profile => String(profile.dollId) === String(selectedCharacterDollId));
    return globallySelected || roster[0];
  }

  async function selectStatPriorityCharacterByOffset(offset) {
    const roster = turmaCharacterProfilesList();
    if (!roster.length || statPriorityMode() !== "turma") return;
    const currentProfile = selectedStatPriorityCharacterProfile("turma");
    const currentIndex = currentProfile ? roster.findIndex(profile => String(profile.dollId) === String(currentProfile.dollId)) : -1;
    const baseIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = Math.max(0, Math.min(roster.length - 1, baseIndex + Number(offset || 0)));
    const next = roster[nextIndex];
    if (!next) return;
    statPriorityState.selectedCharacterDollId = String(next.dollId);
    statPriorityState.result = null;
    statPriorityState.manualResult = null;
    statPriorityState.training = null;
    statPriorityState.error = null;
    await saveStatPriorityState();
    renderStatPriorityTab();
  }

  function statPriorityTurmaRoleForProfile(profile) {
    const id = String(profile?.dollId || "");
    const override = String(statPriorityState?.turmaRoles?.[id] || "").toLowerCase();
    if (["dps", "tank", "healer", "leave"].includes(override)) return override;
    const saved = String(profile?.roleKey || "").toLowerCase();
    if (["dps", "tank", "healer", "leave"].includes(saved)) return saved;
    return "dps";
  }

  function statPriorityRoleLabel(role) {
    return ({ dps: "DPS", tank: "Tank", healer: "Healer", leave: "Leave" })[String(role || "").toLowerCase()] || "DPS";
  }

  async function loadCharacterSelection() {
    await loadCharacterProfileStore();
    const profiles = characterProfilesList();
    let saved = null;
    try {
      const result = await storageGet(characterSelectionKey());
      saved = result?.[characterSelectionKey()];
    } catch (_) {}
    const savedId = String(saved || "");
    if (savedId && characterProfileStore.characters?.[savedId]) selectedCharacterDollId = savedId;
    else {
      const pageId = currentPageDollId();
      selectedCharacterDollId = characterProfileStore.characters?.[pageId] ? pageId : (profiles[0]?.dollId ? String(profiles[0].dollId) : null);
    }
    renderCharacterSelectors();
    return selectedCharacterDollId;
  }

  async function saveCharacterSelection() {
    if (!selectedCharacterDollId) return;
    try { await storageSet({ [characterSelectionKey()]: String(selectedCharacterDollId) }); } catch (_) {}
  }

  function renderCharacterSelectors() {
    const profiles = characterProfilesList();
    if (selectedCharacterDollId && !characterProfileStore.characters?.[String(selectedCharacterDollId)]) {
      selectedCharacterDollId = profiles[0]?.dollId ? String(profiles[0].dollId) : null;
    }
    const index = Math.max(0, profiles.findIndex(profile => String(profile.dollId) === String(selectedCharacterDollId)));
    const total = profiles.length;
    const profile = profiles[index] || null;
    const label = profile ? `${characterDisplayName(profile)} · ${index + 1}/${total}` : "No captured characters";
    const liveId = currentPageDollId();
    const liveNote = profile && String(profile.dollId) === liveId ? " · Live page" : "";
    for (const el of shadow?.querySelectorAll?.("[data-character-selector-label]") || []) el.textContent = `${label}${liveNote}`;
    for (const btn of shadow?.querySelectorAll?.("[data-character-cycle]") || []) {
      const direction = Number(btn.dataset.characterCycle || 0);
      btn.disabled = total < 2 || (direction < 0 ? index <= 0 : index < 0 || index >= total - 1);
    }
  }

  async function selectCharacterByOffset(offset) {
    const profiles = characterProfilesList();
    if (profiles.length < 1) return;
    const currentIndex = profiles.findIndex(profile => String(profile.dollId) === String(selectedCharacterDollId));
    const baseIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = Math.max(0, Math.min(profiles.length - 1, baseIndex + Number(offset || 0)));
    const next = profiles[nextIndex];
    if (!next) return;
    selectedCharacterDollId = String(next.dollId);
    await saveCharacterSelection();
    if (!statPriorityState.busy) {
      statPriorityState.result = null;
      statPriorityState.manualResult = null;
      statPriorityState.training = null;
      statPriorityState.error = null;
    }
    renderSelectedCharacterProfile();
    renderStatPriorityTab();
  }

  function loadCurrentStatsSnapshot() {
    const pageDoll = currentPageDollId();
    const candidate = characterProfileStore.characters?.[pageDoll];
    if (candidate?.stats && Object.keys(candidate.stats).length) { latestParsedState = { ...candidate.stats }; return latestParsedState; }
    return null;
  }

  async function acceptCurrentStatsState(state, characterMeta = null) {
    if (!state || typeof state !== "object" || !Object.keys(state).length) return false;
    await loadCharacterProfileStore();
    const pageDollId = String(currentPageDollId() || "1");
    const reportedDollId = characterMeta?.dollId != null ? String(characterMeta.dollId) : null;
    // A refresh can only update the character actually represented by this
    // document. Refuse to save if the parser metadata and page identity disagree.
    if (reportedDollId && reportedDollId !== pageDollId) return false;
    const dollId = pageDollId;
    const previous = characterProfileStore.characters?.[dollId] || { schemaVersion: 1, dollId };
    const merged = { ...(previous.stats || {}), ...state };
    const now = new Date().toISOString();
    characterProfileStore.characters[dollId] = { ...previous, dollId,
      name: characterMeta?.name ?? previous.name ?? null, className: characterMeta?.className ?? previous.className ?? null,
      roleKey: characterMeta?.roleKey ?? previous.roleKey ?? null, roleRaw: characterMeta?.roleRaw ?? previous.roleRaw ?? null,
      roleTooltip: characterMeta?.roleTooltip ?? previous.roleTooltip ?? null, stats: merged, statsUpdatedAt: now, capturedAt: previous.capturedAt || now };
    latestParsedState = { ...merged };
    await saveCharacterProfileStore();
    if (selectedCharacterDollId == null) selectedCharacterDollId = dollId;
    return currentStatsAreComplete(merged);
  }
  function autoExpeditionKey() { return `${AUTO_EXPEDITION_STORAGE_PREFIX}${hostnameKey()}`; }
  function autoHealingKey() { return `${AUTO_HEALING_STORAGE_PREFIX}${hostnameKey()}`; }
  function arenaAutomationKey() { return `${ARENA_STORAGE_PREFIX}${hostnameKey()}`; }
  function arenaCombatKey() { return `${ARENA_CAPTURE_STORAGE_PREFIX}${hostnameKey()}`; }
  function arenaOpponentAnalysisKey() { return `${ARENA_ANALYSIS_STORAGE_PREFIX}${hostnameKey()}`; }
  function circusProvinciarumAutomationKey() { return `${CIRCUS_PROVINCIARUM_STORAGE_PREFIX}${hostnameKey()}`; }
  function circusProvinciarumAnalysisKey() { return `${CIRCUS_PROVINCIARUM_ANALYSIS_STORAGE_PREFIX}${hostnameKey()}`; }
  function circusCombatKey() { return `${CIRCUS_COMBAT_STORAGE_PREFIX}${hostnameKey()}`; }
  function dungeonAutomationKey() { return `${DUNGEON_STORAGE_PREFIX}${hostnameKey()}`; }
  function dungeonCombatKey() { return `${DUNGEON_COMBAT_STORAGE_PREFIX}${hostnameKey()}`; }
  function autoCombatDiagnosticKey() { return `auto-combat-diagnostics:v0.4.5.21:${hostnameKey()}`; }

  let autoCombatDiagnostics = { schemaVersion: 1, updatedAt: null, events: [] };
  let autoCombatDiagnosticWriteChain = Promise.resolve();
  const AUTO_COMBAT_DIAGNOSTIC_MAX_EVENTS = 500;

  async function loadActiveTab() {
    try {
      const result = await storageGet(activeTabKey());
      const stored = String(result?.[activeTabKey()] || "");
      if (VALID_TABS.has(stored)) return stored;
    } catch (_) {}
    return "equipment";
  }

  async function saveActiveTab(tabName) {
    if (!VALID_TABS.has(tabName)) return;
    try { await storageSet({ [activeTabKey()]: tabName }); } catch (_) {}
  }



  function isCombatReportPage() {
    try {
      const url = new URL(location.href);
      return url.searchParams.get("mod") === "reports"
        && url.searchParams.get("submod") === "showCombatReport"
        && /^(0|1|2|3)$/.test(String(url.searchParams.get("t") || ""))
        && !!url.searchParams.get("reportId");
    } catch (_) { return false; }
  }

  function reportIdFromUrl() {
    try { return new URL(location.href).searchParams.get("reportId") || null; }
    catch (_) { return null; }
  }

  function reportPageReferrerKind() {
    if (!document.referrer) return "unknown";
    try {
      const ref = new URL(document.referrer, location.href);
      const mod = String(ref.searchParams.get("mod") || "").toLowerCase();
      const submod = String(ref.searchParams.get("submod") || "").toLowerCase();
      const combined = `${mod} ${submod} ${ref.pathname} ${ref.href}`.toLowerCase();
      if (/dungeon/.test(combined)) return "dungeon";
      if (mod === "arena" && submod === "serverarena" && ref.searchParams.get("aType") === "2") return "arena";
      if (/arena|circus|turma|grouparena/.test(combined)) return "other-combat";
      if (mod === "reports") return "reports";
      if (mod === "location" || /expedition/.test(combined)) return "expedition";
      return "other";
    } catch (_) { return "unknown"; }
  }

  function combatReportTypeFromUrl() {
    if (!isCombatReportPage()) return null;
    try {
      const t = new URL(location.href).searchParams.get("t");
      if (t === "2") return "arena";
      if (t === "3") return "circus";
      if (t === "1") return "dungeon";
      if (t === "0") return "expedition";
    } catch (_) {}
    return null;
  }

  function expeditionReportDetection() {
    if (!isCombatReportPage()) {
      return { isExpedition: false, source: "not-combat-report", referrerKind: reportPageReferrerKind() };
    }

    const referrerKind = reportPageReferrerKind();
    const reportType = combatReportTypeFromUrl();

    // Combat-report type is authoritative for Auto Combat.  In Gladiatus, t=0 is
    // an expedition report and t=2 is an Arena report.  This must be checked
    // before body/referrer markers because every game page, including Arena
    // reports, contains the global Expedition header text (e.g. "Go to expedition").
    if (reportType === "arena") {
      return { isExpedition: false, source: "report-type-2-arena", referrerKind, reportType };
    }
    if (reportType === "dungeon") {
      return { isExpedition: false, source: "report-type-1-dungeon", referrerKind, reportType };
    }
    if (reportType === "expedition") {
      return { isExpedition: true, source: "report-type-0-expedition", referrerKind, reportType };
    }

    return { isExpedition: false, source: "unknown-report-type", referrerKind, reportType };
  }

  function looksLikeExpeditionReport() {
    return expeditionReportDetection().isExpedition;
  }

  function parseLocalizedInteger(value) {
    if (value == null) return null;
    const s = normalize(value).replace(/[^\d.,-]/g, "");
    if (!s) return null;
    if (/^-?\d{1,3}(?:\.\d{3})+$/.test(s)) return Number(s.replace(/\./g, ""));
    if (/^-?\d{1,3}(?:,\d{3})+$/.test(s)) return Number(s.replace(/,/g, ""));
    if (/^-?\d+$/.test(s)) return Number(s);
    const n = Number(s.replace(/\./g, "").replace(/,(?=\d{1,2}$)/, "."));
    return Number.isFinite(n) ? n : null;
  }

  function parsePercentage(value) {
    const m = normalize(value).match(/(-?\d+(?:[.,]\d+)?)\s*%/);
    return m ? Number(m[1].replace(",", ".")) : null;
  }

  function parseDamageRangeText(value) {
    const s = normalize(value);
    const m = s.match(/(-?\d[\d.,]*)\s*[-–]\s*(-?\d[\d.,]*)/);
    if (!m) return null;
    return {
      min: parseLocalizedInteger(m[1]),
      max: parseLocalizedInteger(m[2]),
      text: s
    };
  }

  function combatantStatRows(container) {
    if (!container) return [];
    return [...container.querySelectorAll(".charstats_bg2")].map(row => {
      const labelEl = row.querySelector(".charstats_text, .charstats_text_mirrored, .charstats_value21, .charstats_value21_mirrored");
      const valueEl = row.querySelector(".charstats_value3, .charstats_value3_mirrored, .charstats_value22, .charstats_value22_mirrored");
      return { label: normalize(labelEl?.textContent || ""), value: normalize(valueEl?.textContent || "") };
    }).filter(row => row.label);
  }

  function parseCombatantStats(container, role) {
    const rows = combatantStatRows(container);
    const stats = { role, rawRows: rows };
    for (const row of rows) {
      const label = row.label.toLowerCase();
      const value = row.value;
      if (label === "level") {
        stats.level = parseLocalizedInteger(value);
      } else if (label === "life points") {
        const m = value.match(/(-?[\d.,]+)\s*\/\s*(-?[\d.,]+)/);
        if (m) {
          stats.lifeCurrent = parseLocalizedInteger(m[1]);
          stats.lifeMax = parseLocalizedInteger(m[2]);
        }
      } else if (["strength", "dexterity", "agility", "constitution", "charisma", "intelligence"].includes(label)) {
        stats[label] = parseLocalizedInteger(value);
      } else if (label === "armour" || label === "armor") {
        const main = value.match(/-?[\d.,]+/);
        const range = value.match(/\(\s*(-?[\d.,]+)\s*[-–]\s*(-?[\d.,]+)\s*\)/);
        stats.armour = main ? parseLocalizedInteger(main[0]) : null;
        if (range) {
          stats.armourMin = parseLocalizedInteger(range[1]);
          stats.armourMax = parseLocalizedInteger(range[2]);
        }
      } else if (label === "damage") {
        const range = parseDamageRangeText(value);
        stats.damageMin = range?.min ?? null;
        stats.damageMax = range?.max ?? null;
        stats.damageRange = range?.text ?? value;
      } else if (label === "hit chance") {
        stats.hitChance = parsePercentage(value);
      } else if (label === "double hit") {
        stats.doubleHit = parsePercentage(value);
      } else if (label === "chance for critical damage") {
        stats.criticalChance = parsePercentage(value);
      } else if (label === "chance to block a hit") {
        stats.blockChance = parsePercentage(value);
      } else if (label === "chance of avoiding critical hits") {
        stats.criticalAvoidance = parsePercentage(value);
      } else if (label === "healing") {
        stats.healing = parseLocalizedInteger(value);
      } else if (label === "critical healing value") {
        stats.criticalHealingValue = parsePercentage(value);
      }
    }
    return stats;
  }

  function parseCombatReward() {
    const root = document.querySelector(".report_reward");
    if (!root) return null;
    const lines = [...root.querySelectorAll("p")].map(el => normalize(el.textContent || "")).filter(Boolean);
    const reward = { rawLines: lines, text: normalize(root.textContent || "") };
    const goldLine = lines.find(line => /has raided\s*:/i.test(line));
    const xpLine = lines.find(line => /experience point/i.test(line));
    const honourLine = lines.find(line => /has received .*honour/i.test(line));
    const goldMatch = goldLine?.match(/has raided\s*:\s*([\d.,]+)/i);
    const xpMatch = xpLine?.match(/received\s+([\d.,]+)\s+experience point/i);
    const honourMatch = honourLine?.match(/has received\s+([\d.,]+)\s+honou?r/i);
    if (goldMatch) reward.gold = parseLocalizedInteger(goldMatch[1]);
    if (xpMatch) reward.experience = parseLocalizedInteger(xpMatch[1]);
    if (honourMatch) reward.honour = parseLocalizedInteger(honourMatch[1]);
    const playerLink = root.querySelector('a[href*="mod=player"]');
    if (playerLink) reward.playerName = normalize(playerLink.textContent || "");
    return reward;
  }

  function parseCombatDamageSummary() {
    const fieldset = [...document.querySelectorAll("fieldset")].find(node => normalize(node.querySelector("legend")?.textContent || "") === "Damage");
    if (!fieldset) return [];
    return [...fieldset.querySelectorAll("tr")].slice(1).map(row => {
      const cells = [...row.children].filter(node => node.tagName === "TD");
      if (cells.length < 4) return null;
      return {
        name: normalize(cells[0].textContent || ""),
        guild: normalize(cells[1].textContent || "") || null,
        damageDone: parseLocalizedInteger(cells[2].textContent || ""),
        lifeRemaining: parseLocalizedInteger(cells[3].textContent || "")
      };
    }).filter(Boolean);
  }

  // Dungeon reports use a different statistics table from Arena/Circus.
  // The legend is "Damage & Healing" and the first column is a <th>, followed
  // by Damage done/get, Healing done/get and Threat.
  function parseDungeonDamageSummary() {
    const fieldset = [...document.querySelectorAll("fieldset.dungeon_report_statistic")].find(node =>
      normalize(node.querySelector("legend")?.textContent || "") === "Damage & Healing"
    );
    if (!fieldset) return [];
    return [...fieldset.querySelectorAll("tr")].map(row => {
      const nameCell = [...row.children].find(node => node.tagName === "TH" && !node.hasAttribute("colspan"));
      const cells = [...row.children].filter(node => node.tagName === "TD");
      if (!nameCell || cells.length < 5) return null;
      const name = normalize(nameCell.textContent || "");
      if (!name) return null;
      return {
        name,
        damageDone: parseLocalizedInteger(cells[0].textContent || ""),
        damageTaken: parseLocalizedInteger(cells[1].textContent || ""),
        healingDone: parseLocalizedInteger(cells[2].textContent || ""),
        healingReceived: parseLocalizedInteger(cells[3].textContent || ""),
        threat: parseLocalizedInteger(cells[4].textContent || "")
      };
    }).filter(Boolean);
  }

  function parseCombatEvents() {
    const reportSections = [...document.querySelectorAll("section.dungeon_report_statistic")];
    const sections = reportSections.filter(section => [...section.querySelectorAll("th")].some(th => /^Round\s+\d+$/i.test(normalize(th.textContent || ""))));
    if (!sections.length) return { rounds: [], eventCount: 0 };

    const rounds = [];
    const roundMap = new Map();
    let eventSequence = 0;
    for (const section of sections) {
      let currentRound = null;
      for (const row of section.querySelectorAll("tr")) {
        const header = row.querySelector("th");
        if (header) {
          const match = normalize(header.textContent || "").match(/^Round\s+(\d+)$/i);
          if (match) {
            currentRound = Number(match[1]);
            if (!roundMap.has(currentRound)) {
              const round = { round: currentRound, events: [] };
              roundMap.set(currentRound, round);
              rounds.push(round);
            }
          }
          continue;
        }
        if (currentRound == null) continue;
        const cells = [...row.children].filter(node => node.tagName === "TD");
        if (cells.length < 2) continue;
        const actionText = normalize(cells[0].textContent || "");
        const resultText = normalize(cells[1].textContent || "");
        const action = actionText.match(/^(.+?)\s+hits\s+(.+?)\.?$/i);
        if (!action) continue;

        let resultType = "other";
        let damage = null;
        const damageMatch = resultText.match(/receives\s+([\d.,]+)\s+damage/i);
        if (/^missed(?:\s|$)/i.test(resultText) || /\b(?:dodged|evaded)\b/i.test(resultText)) {
          resultType = "miss";
        } else if (/\bblocked\b/i.test(resultText)) {
          resultType = "blocked";
          damage = damageMatch ? parseLocalizedInteger(damageMatch[1]) : null;
        } else if (damageMatch) {
          resultType = "damage";
          damage = parseLocalizedInteger(damageMatch[1]);
        }
        const durabilityLosses = [...row.querySelectorAll(".report_durability_loss")].map(span => {
          const parent = span.closest(".durability_loss_details");
          return {
            itemType: normalize(parent?.querySelector("img[title]")?.getAttribute("title") || "") || null,
            amount: parseLocalizedInteger(span.textContent || "")
          };
        }).filter(x => x.amount != null || x.itemType);

        const round = roundMap.get(currentRound);
        const samePairPrior = round.events.filter(event => event.attacker === normalize(action[1]) && event.target === normalize(action[2])).length;
        round.events.push({
          sequence: eventSequence++,
          attacker: normalize(action[1]),
          target: normalize(action[2]),
          resultType,
          resultText,
          damage,
          critical: !!cells[1].querySelector("b") || /^\*.*\*$/.test(resultText),
          pairSequence: samePairPrior + 1,
          durabilityLosses
        });
      }
    }
    return { rounds, eventCount: rounds.reduce((sum, round) => sum + round.events.length, 0) };
  }

  function deriveCombatOutcome(attackerName, defenderName, damageSummary, reward = null) {
    const reportHeader = document.querySelector("#reportHeader");
    const reportHeaderClass = String(reportHeader?.className || "").trim();

    // Arena reports can omit the explicit "Winner:" heading on losses (and
    // may also omit Reward entirely). The report header's final-result class
    // is authoritative, just as it is for Dungeon/Circus reports.
    if (/\breportWin\b/i.test(reportHeaderClass)) {
      return { type: "win", winner: attackerName || null, source: "report-header-class" };
    }
    if (/\breportLose\b/i.test(reportHeaderClass)) {
      return { type: "loss", winner: defenderName || null, source: "report-header-class" };
    }

    const winnerCandidates = [...document.querySelectorAll("h1, h2, h3, h4, legend, .section-header")];
    let explicitWinner = "";
    for (const node of winnerCandidates) {
      const text = normalize(node.textContent || "");
      const match = text.match(/^Winner:\s*(.+)$/i);
      if (match && match[1] && match[1].length <= 80) {
        explicitWinner = normalize(match[1]);
        break;
      }
    }
    if (explicitWinner) {
      if (attackerName && explicitWinner === attackerName) return { type: "win", winner: explicitWinner, source: "winner-heading" };
      if (defenderName && explicitWinner === defenderName) return { type: "loss", winner: explicitWinner, source: "winner-heading" };
      return { type: "unknown", winner: explicitWinner, source: "winner-heading" };
    }

    // Expedition reports expose a successful raid in the Reward section even
    // when the report does not contain an explicit Winner heading. Treat that
    // marker as an authoritative player win.
    const rewardText = normalize(reward?.text || "");
    if (/\bhas raided\s*:/i.test(rewardText)) {
      const winner = normalize(reward?.playerName || attackerName || "");
      if (winner) return { type: "win", winner, source: "reward-has-raided" };
    }

    const attackerRow = damageSummary.find(row => row.name && attackerName && row.name === attackerName);
    const defenderRow = damageSummary.find(row => row.name && defenderName && row.name === defenderName);
    if (attackerRow?.lifeRemaining === 0 && defenderRow?.lifeRemaining > 0) return { type: "loss", winner: defenderName, source: "remaining-life" };
    if (defenderRow?.lifeRemaining === 0 && attackerRow?.lifeRemaining > 0) return { type: "win", winner: attackerName, source: "remaining-life" };
    return { type: "unknown", winner: null, source: null };
  }

  function combatOutcomeLabel(outcome) {
    if (outcome?.type === "win") return "Win";
    if (outcome?.type === "loss") return "Loss";
    return "Unknown";
  }

  function buildCombatReadiness({ reportId, reportType = null, attackerContainer, defenderContainer, attacker, defender, reward, damageSummary, eventData, outcome }) {
    const missingRequired = [];
    const missingOptional = [];
    if (!reportId) missingRequired.push("reportId");
    if (!attackerContainer) missingRequired.push("attacker stats container");
    if (!defenderContainer) missingRequired.push("defender stats container");
    if (!attacker || (attacker.rawRows?.length || 0) < 8) missingRequired.push("attacker stats");
    if (!defender || (defender.rawRows?.length || 0) < 8) missingRequired.push("defender stats");
    if (!eventData?.rounds?.length) missingRequired.push("rounds");
    if (!eventData?.eventCount) missingRequired.push("combat events");
    if (!attacker?.name) missingRequired.push("attacker name");
    if (!defender?.name) missingRequired.push("defender name");
    if (!reward) missingOptional.push("reward");
    if (!Array.isArray(damageSummary) || damageSummary.length < 2) missingOptional.push("damage summary");
    if (!outcome || outcome.type === "unknown" || !outcome.winner) missingOptional.push("final result");
    const ready = missingRequired.length === 0;
    const resultKnown = !!outcome && outcome.type !== "unknown" && !!outcome.winner;
    const rewardReady = !!reward;
    const damageSummaryReady = Array.isArray(damageSummary) && damageSummary.length >= 2;
    const complete = ready && rewardReady && damageSummaryReady && resultKnown;
    return {
      ready,
      complete,
      missing: [...missingRequired, ...missingOptional],
      missingRequired,
      missingOptional,
      reportId: reportId || null,
      reportType: reportType || null,
      expedition: reportType === "expedition",
      arena: reportType === "arena",
      attackerStats: !!attackerContainer && !!attacker && (attacker.rawRows?.length || 0) >= 8,
      defenderStats: !!defenderContainer && !!defender && (defender.rawRows?.length || 0) >= 8,
      reward: rewardReady,
      damageSummary: damageSummaryReady,
      rounds: eventData?.rounds?.length || 0,
      events: eventData?.eventCount || 0,
      resultKnown,
      resultSource: outcome?.source || null
    };
  }

  function validateCombatRecord(record) {
    const errors = [];
    const warnings = [];
    const reportType = String(record?.reportType || "").toLowerCase();
    const isCircus = reportType === "circus";
    if (!record?.reportId) errors.push("Missing report ID");
    if (!(isCircus || ["expedition", "arena"].includes(reportType))) errors.push("Unsupported combat report type");
    if (isCircus) {
      if (!Array.isArray(record?.participants?.attackers) || record.participants.attackers.length !== 5) errors.push(`Invalid Circus attacker team (${record?.participants?.attackers?.length || 0}/5)`);
      if (!Array.isArray(record?.participants?.defenders) || record.participants.defenders.length !== 5) errors.push(`Invalid Circus defender team (${record?.participants?.defenders?.length || 0}/5)`);
      if (Array.isArray(record?.participants?.attackers) && record.participants.attackers.some(f => (f?.rawRows?.length || 0) < 8)) errors.push("Incomplete Circus attacker stats");
      if (Array.isArray(record?.participants?.defenders) && record.participants.defenders.some(f => (f?.rawRows?.length || 0) < 8)) errors.push("Incomplete Circus defender stats");
    } else {
      if (!record?.participants?.attacker?.name) errors.push("Missing attacker name");
      if (!record?.participants?.defender?.name) errors.push("Missing defender name");
      if (!record?.participants?.attacker?.rawRows?.length) errors.push("Missing attacker stat rows");
      if (!record?.participants?.defender?.rawRows?.length) errors.push("Missing defender stat rows");
    }
    if (!record?.reward && !isCircus) warnings.push("Reward section missing");
    if (!Array.isArray(record?.damageSummary) || record.damageSummary.length < (isCircus ? 10 : 2)) warnings.push(`Damage summary incomplete${isCircus ? ` (${record?.damageSummary?.length || 0}/10)` : ""}`);
    if (!Array.isArray(record?.rounds) || record.rounds.length === 0) errors.push("No combat rounds captured");
    if (!record?.totalEvents) errors.push("No combat events captured");
    if (!record?.outcome || record.outcome.type === "unknown" || !record.outcome.winner) warnings.push("Final result is unknown");
    const roundNumbers = [];
    const sequences = [];
    let eventCount = 0, damageEvents = 0, missEvents = 0, criticalEvents = 0, otherEvents = 0;
    for (const round of record.rounds || []) {
      if (!Number.isFinite(Number(round?.round))) errors.push("Invalid round number"); else roundNumbers.push(Number(round.round));
      for (const event of round?.events || []) {
        eventCount++;
        if (Number.isFinite(Number(event?.sequence))) sequences.push(Number(event.sequence));
        if (event?.resultType === "damage") damageEvents++; else if (event?.resultType === "miss") missEvents++; else otherEvents++;
        if (event?.critical) criticalEvents++;
        if (!event?.attacker || !event?.target) warnings.push("Event missing attacker or target");
      }
    }
    if (eventCount !== Number(record.totalEvents)) warnings.push(`Event count mismatch: stored ${record.totalEvents}, counted ${eventCount}`);
    if (sequences.length) {
      const sorted = [...sequences].sort((a,b)=>a-b);
      for (let i=0;i<sorted.length;i++) if (sorted[i] !== i) { warnings.push("Event sequence is not contiguous"); break; }
      if (new Set(sequences).size !== sequences.length) warnings.push("Duplicate event sequence numbers");
    }
    if (otherEvents) warnings.push(`${otherEvents} event(s) have an unclassified result type`);
    if (roundNumbers.length && new Set(roundNumbers).size !== roundNumbers.length) warnings.push("Duplicate round numbers");
    const expectedCapture = record.captureDiagnostics || {};
    return {
      ready: errors.length === 0,
      errors: [...new Set(errors)], warnings: [...new Set(warnings)],
      counts: {
        rounds: Array.isArray(record.rounds) ? record.rounds.length : 0, events: eventCount,
        damageEvents, missEvents, criticalEvents, otherEvents,
        damageSummaryRows: Array.isArray(record.damageSummary) ? record.damageSummary.length : 0,
        attackerStatsRows: isCircus ? (record.participants?.attackers || []).reduce((sum,f)=>sum+(f?.rawRows?.length||0),0) : (record.participants?.attacker?.rawRows?.length||0),
        defenderStatsRows: isCircus ? (record.participants?.defenders || []).reduce((sum,f)=>sum+(f?.rawRows?.length||0),0) : (record.participants?.defender?.rawRows?.length||0)
      },
      readinessAtCapture: expectedCapture.readiness || null
    };
  }

  function formatCombatSummary(record) {
    if (!record) return "No combat report captured.";
    const validation = validateCombatRecord(record);
    const isCircus = String(record?.reportType || "").toLowerCase() === "circus";
    const metrics = combatRecordMetrics(record);
    const lines = [
      `Report ID: ${record.reportId || "unknown"}`,
      `Type: ${combatRecordTypeLabel(record)}`,
      `Captured: ${record.capturedAt || "unknown"}`,
      `Result: ${combatOutcomeLabel(record.outcome)}${record.outcome?.winner ? ` (winner: ${record.outcome.winner})` : ""}`,
      `Result source: ${record.outcome?.source || "none"}`, ""
    ];
    if (isCircus) {
      lines.push("ATTACKERS:");
      for (const fighter of record.participants?.attackers || []) lines.push(`  ${fighter?.name || "unknown"} · Lv ${fighter?.level ?? "?"} · HP ${fighter?.lifeCurrent ?? "?"}/${fighter?.lifeMax ?? "?"}`);
      lines.push("", "DEFENDERS:");
      for (const fighter of record.participants?.defenders || []) lines.push(`  ${fighter?.name || "unknown"} · Lv ${fighter?.level ?? "?"} · HP ${fighter?.lifeCurrent ?? "?"}/${fighter?.lifeMax ?? "?"}`);
      const aNames = new Set((record.participants?.attackers || []).map(f=>normalize(f?.name || "")).filter(Boolean));
      const dNames = new Set((record.participants?.defenders || []).map(f=>normalize(f?.name || "")).filter(Boolean));
      const aRows = (record.damageSummary || []).filter(row=>aNames.has(normalize(row?.name || "")));
      const dRows = (record.damageSummary || []).filter(row=>dNames.has(normalize(row?.name || "")));
      lines.push("", "DAMAGE SUMMARY", `  Attacker team: ${metrics.playerDamageSummary ?? metrics.playerDamage} damage · ${metrics.playerLifeRemaining ?? "?"} total HP remaining`, `  Defender team: ${metrics.enemyDamageSummary ?? metrics.enemyDamage} damage · ${metrics.enemyLifeRemaining ?? "?"} total HP remaining`, `  Summary rows: ${aRows.length} attacker / ${dRows.length} defender`);
    } else {
      const a = record.participants?.attacker || {}; const d = record.participants?.defender || {};
      const damage = record.damageSummary || [];
      const pa = damage.find(row=>row.name===a.name); const pd = damage.find(row=>row.name===d.name);
      lines.push(`ATTACKER: ${a.name || "unknown"}`, `  Level: ${a.level ?? "?"}`, `  Life: ${a.lifeCurrent ?? "?"}/${a.lifeMax ?? "?"}`, `  Damage: ${a.damageMin ?? "?"}–${a.damageMax ?? "?"}`, `  Armour: ${a.armour ?? "?"}`, `  Hit: ${a.hitChance ?? "?"}% | Double hit: ${a.doubleHit ?? "?"}% | Crit: ${a.criticalChance ?? "?"}% | Block: ${a.blockChance ?? "?"}%`, "", `DEFENDER: ${d.name || "unknown"}`, `  Level: ${d.level ?? "?"}`, `  Life: ${d.lifeCurrent ?? "?"}/${d.lifeMax ?? "?"}`, `  Damage: ${d.damageMin ?? "?"}–${d.damageMax ?? "?"}`, `  Armour: ${d.armour ?? "?"}`, `  Hit: ${d.hitChance ?? "?"}% | Double hit: ${d.doubleHit ?? "?"}% | Crit: ${d.criticalChance ?? "?"}% | Block: ${d.blockChance ?? "?"}%`, "", "REWARD", `  Gold: ${record.reward?.gold ?? "?"}`, `  Experience: ${record.reward?.experience ?? "?"}`, `  Honour: ${record.reward?.honour ?? "?"}`, "", "DAMAGE SUMMARY", `  ${a.name || "Attacker"}: ${pa?.damageDone ?? "?"} damage | ${pa?.lifeRemaining ?? "?"} life remaining`, `  ${d.name || "Defender"}: ${pd?.damageDone ?? "?"} damage | ${pd?.lifeRemaining ?? "?"} life remaining`);
    }
    lines.push("", `ROUND / EVENT COUNTS: ${record.rounds?.length || 0} rounds | ${record.totalEvents || 0} events`, ...(record.rounds || []).map(round=>`  Round ${round.round}: ${(round.events||[]).length} events`), "", "VALIDATION", `  Ready: ${validation.ready ? "YES" : "NO"}`, `  Errors:\n${validation.errors.length ? validation.errors.map(x=>`  - ${x}`).join("\n") : "  None"}`, `  Warnings:\n${validation.warnings.length ? validation.warnings.map(x=>`  - ${x}`).join("\n") : "  None"}`);
    return lines.join("\n");
  }

  async function copyTextWithButton(text, button, defaultLabel) {
    if (!String(text || "").trim()) {
      if (button) {
        button.textContent = "Nothing to copy";
        setTimeout(() => { button.textContent = defaultLabel; }, 1200);
      }
      return;
    }
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement("textarea");
        area.value = text; area.readOnly = true; area.style.position = "fixed"; area.style.left = "-9999px";
        document.body.appendChild(area); area.select();
        if (!document.execCommand("copy")) throw new Error("Copy failed");
        area.remove();
      }
      if (button) {
        button.textContent = "Copied!";
        setTimeout(() => { button.textContent = defaultLabel; }, 1200);
      }
    } catch (_) {
      if (button) {
        button.textContent = "Copy failed";
        setTimeout(() => { button.textContent = defaultLabel; }, 1400);
      }
    }
  }

  function deriveReportNames(reward, rounds, damageSummary) {
    let attackerName = reward?.playerName || null;
    const events = rounds;
    if (!attackerName) {
      const attackerCell = document.querySelector('#attackerCharStats1')?.closest('td');
      const playerLink = attackerCell?.querySelector('a[href*="mod=player"]') || document.querySelector('#attackerCharStats1 a[href*="mod=player"]');
      attackerName = normalize(playerLink?.textContent || "") || null;
    }
    const eventNames = [...new Set(events.flatMap(round => round.events.flatMap(event => [event.attacker, event.target])).filter(Boolean))];
    if (!attackerName) attackerName = damageSummary.find(row => row.name)?.name || eventNames[0] || null;
    const defenderName = eventNames.find(name => name && name !== attackerName) || damageSummary.find(row => row.name && row.name !== attackerName)?.name || null;
    return { attackerName, defenderName };
  }

  async function loadCombatCaptureStore() {
    try {
      const result = await storageGet(combatKey());
      const stored = result?.[combatKey()];
      if (stored && Array.isArray(stored.reports)) {
        combatCaptureStore = { ...stored, schemaVersion: Math.max(3, Number(stored.schemaVersion) || 1) };
        return combatCaptureStore;
      }
    } catch (_) {}
    combatCaptureStore = { schemaVersion: 3, reports: [], updatedAt: null };
    return combatCaptureStore;
  }

  function combatRecordMetrics(record) {
    const isCircus = String(record?.reportType || "").toLowerCase() === "circus";
    const attackerNames = isCircus
      ? new Set((record?.participants?.attackers || []).map(x => normalize(x?.name || "")).filter(Boolean))
      : new Set([normalize(record?.participants?.attacker?.name || "")].filter(Boolean));
    const defenderNames = isCircus
      ? new Set((record?.participants?.defenders || []).map(x => normalize(x?.name || "")).filter(Boolean))
      : new Set([normalize(record?.participants?.defender?.name || "")].filter(Boolean));
    const rounds = Array.isArray(record?.rounds) ? record.rounds : [];
    const events = rounds.flatMap(round => Array.isArray(round?.events) ? round.events : []);
    const playerEvents = events.filter(event => attackerNames.has(normalize(event?.attacker || "")));
    const enemyEvents = events.filter(event => defenderNames.has(normalize(event?.attacker || "")));
    const playerHits = playerEvents.filter(event => event?.resultType === "damage");
    const enemyHits = enemyEvents.filter(event => event?.resultType === "damage");
    const playerMisses = playerEvents.filter(event => event?.resultType === "miss");
    const enemyMisses = enemyEvents.filter(event => event?.resultType === "miss");
    const playerCrits = playerHits.filter(event => event?.critical);
    const enemyCrits = enemyHits.filter(event => event?.critical);
    const playerDoubleHits = playerEvents.filter(event => Number(event?.pairSequence) > 1);
    const enemyDoubleHits = enemyEvents.filter(event => Number(event?.pairSequence) > 1);
    const sumDamage = list => list.reduce((sum, event) => sum + (Number.isFinite(Number(event?.damage)) ? Number(event.damage) : 0), 0);
    const playerDamage = sumDamage(playerHits);
    const enemyDamage = sumDamage(enemyHits);
    const avgHit = list => list.length ? sumDamage(list) / list.length : null;
    const maxHit = list => {
      const values = list.map(event => Number(event?.damage)).filter(Number.isFinite);
      return values.length ? Math.max(...values) : null;
    };
    const summaryRowsFor = names => (record?.damageSummary || []).filter(row => names.has(normalize(row?.name || "")));
    const summaryPlayerRows = summaryRowsFor(attackerNames);
    const summaryEnemyRows = summaryRowsFor(defenderNames);
    const sumSummary = (rows, key) => {
      const values = rows.map(row => Number(row?.[key])).filter(Number.isFinite);
      return values.length ? values.reduce((sum, value) => sum + value, 0) : null;
    };
    const playerDamageSummary = sumSummary(summaryPlayerRows, "damageDone");
    const enemyDamageSummary = sumSummary(summaryEnemyRows, "damageDone");
    const playerLifeRemaining = sumSummary(summaryPlayerRows, "lifeRemaining");
    const enemyLifeRemaining = sumSummary(summaryEnemyRows, "lifeRemaining");
    const playerHitDenom = playerHits.length + playerMisses.length;
    const enemyHitDenom = enemyHits.length + enemyMisses.length;
    return {
      rounds: rounds.length, events: events.length,
      playerAttacks: playerEvents.length, playerHits: playerHits.length, playerMisses: playerMisses.length,
      playerCrits: playerCrits.length, playerDoubleHits: playerDoubleHits.length,
      playerDamage, playerAvgHit: avgHit(playerHits), playerMaxHit: maxHit(playerHits),
      playerHitRate: playerHitDenom ? (playerHits.length / playerHitDenom) * 100 : null,
      playerCritRate: playerHits.length ? (playerCrits.length / playerHits.length) * 100 : null,
      playerDoubleHitRate: playerEvents.length ? (playerDoubleHits.length / playerEvents.length) * 100 : null,
      enemyAttacks: enemyEvents.length, enemyHits: enemyHits.length, enemyMisses: enemyMisses.length,
      enemyCrits: enemyCrits.length, enemyDoubleHits: enemyDoubleHits.length,
      enemyDamage, enemyAvgHit: avgHit(enemyHits), enemyMaxHit: maxHit(enemyHits),
      enemyHitRate: enemyHitDenom ? (enemyHits.length / enemyHitDenom) * 100 : null,
      enemyCritRate: enemyHits.length ? (enemyCrits.length / enemyHits.length) * 100 : null,
      enemyDoubleHitRate: enemyEvents.length ? (enemyDoubleHits.length / enemyEvents.length) * 100 : null,
      playerDamageSummary, enemyDamageSummary, playerLifeRemaining, enemyLifeRemaining
    };
  }

  function validatedCombatReports(reports) {
    return reports.filter(record => {
      const validation = validateCombatRecord(record);
      return validation.ready && validation.errors.length === 0;
    });
  }

  function filterCombatReports(reports) {
    let filtered = reports.filter(record => {
      if (combatOpponentFilter !== "all" && normalize(record?.participants?.defender?.name || "") !== normalize(combatOpponentFilter)) return false;
      if (combatResultFilter !== "all") {
        const result = String(record?.outcome?.type || "unknown").toLowerCase();
        if (result !== combatResultFilter) return false;
      }
      return true;
    });
    if (combatWindowFilter !== "all") {
      const count = Number(combatWindowFilter);
      if (Number.isFinite(count) && count > 0) filtered = filtered.slice(0, count);
    }
    return filtered;
  }

  function aggregateCombatMetrics(reports) {
    const total = {
      battles: reports.length,
      wins: 0,
      losses: 0,
      unknown: 0,
      validated: 0,
      rounds: 0,
      playerAttacks: 0,
      playerHits: 0,
      playerMisses: 0,
      playerCrits: 0,
      playerDoubleHits: 0,
      playerDamage: 0,
      enemyAttacks: 0,
      enemyHits: 0,
      enemyMisses: 0,
      enemyCrits: 0,
      enemyDoubleHits: 0,
      enemyDamage: 0,
      gold: 0,
      experience: 0,
      honour: 0,
      maxPlayerHit: null,
      maxEnemyHit: null
    };
    for (const record of reports) {
      const outcome = String(record?.outcome?.type || "unknown").toLowerCase();
      if (outcome === "win") total.wins += 1;
      else if (outcome === "loss") total.losses += 1;
      else total.unknown += 1;
      const metrics = combatRecordMetrics(record);
      total.rounds += metrics.rounds;
      total.playerAttacks += metrics.playerAttacks;
      total.playerHits += metrics.playerHits;
      total.playerMisses += metrics.playerMisses;
      total.playerCrits += metrics.playerCrits;
      total.playerDoubleHits += metrics.playerDoubleHits;
      total.playerDamage += Number.isFinite(metrics.playerDamageSummary) ? metrics.playerDamageSummary : metrics.playerDamage;
      total.enemyAttacks += metrics.enemyAttacks;
      total.enemyHits += metrics.enemyHits;
      total.enemyMisses += metrics.enemyMisses;
      total.enemyCrits += metrics.enemyCrits;
      total.enemyDoubleHits += metrics.enemyDoubleHits;
      total.enemyDamage += Number.isFinite(metrics.enemyDamageSummary) ? metrics.enemyDamageSummary : metrics.enemyDamage;
      if (Number.isFinite(metrics.playerMaxHit)) total.maxPlayerHit = total.maxPlayerHit === null ? metrics.playerMaxHit : Math.max(total.maxPlayerHit, metrics.playerMaxHit);
      if (Number.isFinite(metrics.enemyMaxHit)) total.maxEnemyHit = total.maxEnemyHit === null ? metrics.enemyMaxHit : Math.max(total.maxEnemyHit, metrics.enemyMaxHit);
      total.gold += Number.isFinite(Number(record?.reward?.gold)) ? Number(record.reward.gold) : 0;
      total.experience += Number.isFinite(Number(record?.reward?.experience)) ? Number(record.reward.experience) : 0;
      total.honour += Number.isFinite(Number(record?.reward?.honour)) ? Number(record.reward.honour) : 0;
    }
    const rate = (n, d) => d ? (n / d) * 100 : null;
    return {
      ...total,
      avgRounds: total.battles ? total.rounds / total.battles : null,
      avgDamageDealt: total.battles ? total.playerDamage / total.battles : null,
      avgDamageTaken: total.battles ? total.enemyDamage / total.battles : null,
      damagePerRound: total.rounds ? total.playerDamage / total.rounds : null,
      damageTakenPerRound: total.rounds ? total.enemyDamage / total.rounds : null,
      hitRate: rate(total.playerHits, total.playerHits + total.playerMisses),
      critRate: rate(total.playerCrits, total.playerHits),
      doubleHitRate: rate(total.playerDoubleHits, total.playerAttacks),
      avgSuccessfulHit: total.playerHits ? total.playerDamage / total.playerHits : null,
      opponentHitRate: rate(total.enemyHits, total.enemyHits + total.enemyMisses),
      opponentCritRate: rate(total.enemyCrits, total.enemyHits),
      winRate: rate(total.wins, total.battles)
    };
  }

  function combatTrendPair(reports) {
    if (reports.length < 10) return null;
    const size = reports.length >= 20 ? 10 : 5;
    const recent = reports.slice(0, size);
    const prior = reports.slice(size, size * 2);
    if (prior.length < size) return null;
    return { size, recent: aggregateCombatMetrics(recent), prior: aggregateCombatMetrics(prior) };
  }

  function formatCombatDelta(current, previous, digits = 1, suffix = "", inverse = false) {
    if (!Number.isFinite(Number(current)) || !Number.isFinite(Number(previous))) return "—";
    const diff = Number(current) - Number(previous);
    const sign = diff > 0 ? "+" : diff < 0 ? "−" : "±";
    const shown = digits === 0 ? Math.abs(Math.round(diff)).toLocaleString() : Math.abs(diff).toFixed(digits);
    const direction = inverse ? (diff > 0 ? "down" : diff < 0 ? "up" : "same") : (diff > 0 ? "up" : diff < 0 ? "down" : "same");
    return `<span class="ga-combat-delta ${direction}">${sign}${shown}${suffix}</span>`;
  }

  function formatCombatMetric(value, digits = 1, suffix = "") {
    if (!Number.isFinite(Number(value))) return "—";
    const n = Number(value);
    const shown = digits === 0 ? Math.round(n).toLocaleString() : n.toFixed(digits);
    return `${shown}${suffix}`;
  }

  function combatAnalysisConfidenceBand(winRate) {
    const n = Number(winRate);
    if (!Number.isFinite(n)) return "Unknown";
    if (n >= 80) return "Very high";
    if (n >= 65) return "High";
    if (n >= 55) return "Moderate";
    if (n >= 50) return "Close";
    return "Below 50%";
  }

  function combatRecordOpponentLabel(record) {
    if (String(record?.reportType || "") === "circus") {
      const defenders = Array.isArray(record?.participants?.defenders) ? record.participants.defenders : [];
      const names = defenders.map(f => normalize(f?.name || "")).filter(Boolean);
      if (!names.length) return "Unknown Circus opponent";
      return names.length > 1 ? `${names[0]} +${names.length - 1}` : names[0];
    }
    return normalize(record?.participants?.defender?.name || "Unknown opponent");
  }

  function combatRecordTypeLabel(record) {
    const type = String(record?.reportType || "").toLowerCase();
    if (type === "circus") return "Circus 5v5";
    if (type === "arena") return "Arena";
    if (type === "expedition") return "Expedition";
    return type || "Combat";
  }

  function combatResultClass(outcome) {
    if (outcome === "Win") return "win";
    if (outcome === "Loss") return "loss";
    return "unknown";
  }

  const SIMULATOR_EQUIPMENT_CATEGORIES = Object.freeze({
    helmet: "4", weapon: "1", shield: "2", chest: "3", gloves: "5", boots: "8", amulet: "9", ring1: "6", ring2: "6"
  });
  const SIMULATOR_SLOT_LABELS = Object.freeze({ helmet: "Helmet", amulet: "Amulet", chest: "Chest", gloves: "Gloves", weapon: "Weapon", shield: "Shield", boots: "Boots", ring1: "Ring 1", ring2: "Ring 2" });
  const SIMULATOR_STAT_KEYS = Object.freeze(["strength", "dexterity", "agility", "constitution", "charisma", "intelligence"]);

  function simulatorEngine() { return globalThis.GladiatusCombatSimulator || null; }

  async function loadSimulatorState() {
    try {
      const result = await storageGet(simulatorStateKey());
      const stored = result?.[simulatorStateKey()];
      if (stored && typeof stored === "object") {
        simulatorState = {
          ...simulatorState,
          ...stored,
          simulations: Math.max(1, Math.min(50000, Number(stored.simulations) || 1000)),
          seed: Number.isFinite(Number(stored.seed)) ? Number(stored.seed) : 1,
          lifeMode: ["current", "full", "unlimited"].includes(String(stored.lifeMode)) ? String(stored.lifeMode) : "current",
          statOverrides: { ...(stored.statOverrides || {}) },
          equipmentSelections: { ...(stored.equipmentSelections || {}) },
          result: null
        };
      }
    } catch (_) {}
  }

  async function saveSimulatorState() {
    try {
      const safe = { ...simulatorState, result: null };
      await storageSet({ [simulatorStateKey()]: safe });
    } catch (_) {}
  }

  function statPriorityResultMatchesGlobalSimulationCount(result) {
    if (!result || typeof result !== "object") return false;
    const simulations = Number(result.simulations);
    return Number.isFinite(simulations) && simulations === globalSimulationCount();
  }

  function statPriorityPersistableResult(result) {
    if (!result || typeof result !== "object") return null;
    try {
      const copy = JSON.parse(JSON.stringify(result));
      const stripProfile = profile => {
        if (!profile || typeof profile !== "object") return;
        delete profile.equipment;
        delete profile.iconDataUrl;
        delete profile.iconUrl;
      };
      stripProfile(copy.player);
      stripProfile(copy.dummy);
      stripProfile(copy.combined?.profile);
      for (const member of Array.isArray(copy.baseTeam) ? copy.baseTeam : []) stripProfile(member);
      for (const member of Array.isArray(copy.trainingTeam) ? copy.trainingTeam : []) stripProfile(member);
      for (const row of Array.isArray(copy.rows) ? copy.rows : []) stripProfile(row?.profile);
      return copy;
    } catch (_) { return null; }
  }

  async function loadStatPriorityState() {
    statPriorityStateLoaded = false;
    try {
      const result = await storageGet(statPriorityStateKey());
      const stored = result?.[statPriorityStateKey()];
      if (stored && typeof stored === "object") {
        const manual = stored.manualAdjustments && typeof stored.manualAdjustments === "object" ? stored.manualAdjustments : {};
        statPriorityState = {
          ...statPriorityState,
          ...stored,
          mode: stored.mode === "arena" ? "arena" : "turma",
          turmaRoles: stored.turmaRoles && typeof stored.turmaRoles === "object" ? { ...stored.turmaRoles } : {},
          investment: Math.max(1, Math.min(100, Math.floor(Number(stored.investment) || 1))),
          simulations: globalSimulationCount(),
          seed: Math.max(1, Math.floor(Number(stored.seed) || 1)),
          training: stored.training && typeof stored.training === "object" ? stored.training : null,
          selectedCharacterDollId: stored.selectedCharacterDollId != null ? String(stored.selectedCharacterDollId) : null,
          manualAdjustments: {
            health: Number(manual.health) || 0,
            armour: Number(manual.armour) || 0,
            damageMin: Number(manual.damageMin) || 0,
            damageMax: Number(manual.damageMax) || 0,
            criticalAttack: Number(manual.criticalAttack) || 0,
            blockValue: Number(manual.blockValue) || 0,
            hardening: Number(manual.hardening) || 0
          },
          result: statPriorityResultMatchesGlobalSimulationCount(stored.result) ? statPriorityPersistableResult(stored.result) : null,
          manualResult: statPriorityResultMatchesGlobalSimulationCount(stored.manualResult) ? statPriorityPersistableResult(stored.manualResult) : null,
          busy: false,
          error: null
        };
        if (statPriorityState.result || statPriorityState.manualResult) {
          void appendStatPriorityDiagnostic("result-restored", {
            result: !!statPriorityState.result,
            manualResult: !!statPriorityState.manualResult,
            resultMode: statPriorityState.result?.mode || null,
            resultGeneratedAt: statPriorityState.result?.generatedAt || null,
            manualResultMode: statPriorityState.manualResult?.mode || null,
            manualResultGeneratedAt: statPriorityState.manualResult?.generatedAt || null
          });
        }
      }
    } catch (error) {
      void appendStatPriorityDiagnostic("state-load-error", { error: error?.message || String(error) });
    }
    finally { statPriorityStateLoaded = true; }
  }

  async function saveStatPriorityState(reason = "state-save") {
    try {
      const { busy: _busy, ...rest } = statPriorityState;
      const safe = {
        ...rest,
        simulations: globalSimulationCount(),
        result: statPriorityPersistableResult(statPriorityState.result),
        manualResult: statPriorityPersistableResult(statPriorityState.manualResult)
      };
      await storageSet({ [statPriorityStateKey()]: safe });
      void appendStatPriorityDiagnostic("state-persisted", {
        reason,
        result: !!safe.result,
        manualResult: !!safe.manualResult,
        resultMode: safe.result?.mode || null,
        resultGeneratedAt: safe.result?.generatedAt || null
      });
      return true;
    } catch (error) {
      void appendStatPriorityDiagnostic("state-persist-error", { reason, error: error?.message || String(error), result: !!statPriorityState.result, manualResult: !!statPriorityState.manualResult });
      return false;
    }
  }

  let statPriorityDiagnostics = { schemaVersion: 1, updatedAt: null, events: [] };
  let statPriorityDiagnosticWriteChain = Promise.resolve();

  function statPriorityDiagnosticSnapshot() {
    return {
      mode: statPriorityMode(),
      busy: !!statPriorityState.busy,
      error: statPriorityState.error || null,
      resultPresent: !!statPriorityState.result,
      manualResultPresent: !!statPriorityState.manualResult,
      resultMode: statPriorityState.result?.mode || null,
      resultGeneratedAt: statPriorityState.result?.generatedAt || null,
      manualResultMode: statPriorityState.manualResult?.mode || null,
      selectedCharacterDollId: statPriorityState.selectedCharacterDollId || null,
      investment: Number(statPriorityState.investment) || null,
      simulations: globalSimulationCount(),
      seed: Number(statPriorityState.seed) || null
    };
  }

  async function loadStatPriorityDiagnostics() {
    try {
      const result = await storageGet(statPriorityDiagnosticKey());
      const stored = result?.[statPriorityDiagnosticKey()];
      if (stored && typeof stored === "object") {
        statPriorityDiagnostics = {
          schemaVersion: 1,
          updatedAt: stored.updatedAt || null,
          events: Array.isArray(stored.events) ? stored.events.slice(0, STAT_PRIORITY_DIAGNOSTIC_MAX_EVENTS) : []
        };
      }
    } catch (_) {}
    renderStatPriorityDiagnostics();
    return statPriorityDiagnostics;
  }

  async function saveStatPriorityDiagnostics() {
    try { await storageSet({ [statPriorityDiagnosticKey()]: statPriorityDiagnostics }); } catch (_) {}
  }

  function renderStatPriorityDiagnostics() {
    const el = shadow?.querySelector("#ga-stat-priority-diagnostic-text");
    if (!el) return;
    el.textContent = statPriorityDiagnostics?.events?.length
      ? statPriorityDiagnostics.events.map((event, index) => JSON.stringify({ index: statPriorityDiagnostics.events.length - index, ...event }, null, 2)).join("\n\n")
      : "No Stat Priority diagnostic events recorded yet.";
  }

  async function appendStatPriorityDiagnostic(event, details = {}) {
    if (!diagnosticCaptureEnabled()) return false;
    const record = {
      at: new Date().toISOString(),
      event: String(event || "event"),
      details: details && typeof details === "object" ? details : { value: details },
      snapshot: statPriorityDiagnosticSnapshot()
    };
    statPriorityDiagnostics.events = [record, ...(statPriorityDiagnostics.events || [])].slice(0, STAT_PRIORITY_DIAGNOSTIC_MAX_EVENTS);
    statPriorityDiagnostics.updatedAt = record.at;
    renderStatPriorityDiagnostics();
    statPriorityDiagnosticWriteChain = statPriorityDiagnosticWriteChain.then(() => saveStatPriorityDiagnostics()).catch(() => {});
    await statPriorityDiagnosticWriteChain;
    return true;
  }

  function logStatPriorityDiagnostic(event, details = {}) {
    if (!diagnosticCaptureEnabled()) return;
    void appendStatPriorityDiagnostic(event, details);
  }

  async function clearStatPriorityDiagnostics() {
    statPriorityDiagnostics = { schemaVersion: 1, updatedAt: null, events: [] };
    try { await storageRemove(statPriorityDiagnosticKey()); } catch (_) {}
    renderStatPriorityDiagnostics();
  }

  async function copyStatPriorityDiagnostics(event) {
    const button = event?.currentTarget || shadow?.querySelector("#ga-copy-stat-priority-diagnostics");
    await copyTextWithButton(JSON.stringify(statPriorityDiagnostics, null, 2), button, "Copy diagnostics");
  }

  const STAT_PRIORITY_CONFIG = Object.freeze({
    strength: { exponent: 2.6, id: "char_f0_tt", label: "Strength" },
    dexterity: { exponent: 2.5, id: "char_f1_tt", label: "Dexterity" },
    agility: { exponent: 2.3, id: "char_f2_tt", label: "Agility" },
    constitution: { exponent: 2.3, id: "char_f3_tt", label: "Constitution" },
    charisma: { exponent: 2.5, id: "char_f4_tt", label: "Charisma" },
    intelligence: { exponent: 2.4, id: "char_f5_tt", label: "Intelligence" }
  });

  function stripTags(value) {
    return normalize(String(value ?? "").replace(/<[^>]*>/g, " "));
  }

  function statPriorityTooltipPairs(rawTooltip) {
    if (!rawTooltip) return [];
    try {
      const data = typeof rawTooltip === "string" ? JSON.parse(rawTooltip) : rawTooltip;
      const pairs = [];
      const walk = value => {
        if (!Array.isArray(value)) return;
        if (value.length >= 2 && typeof value[0] === "string" && (typeof value[1] === "string" || typeof value[1] === "number")) {
          pairs.push({ label: normalize(stripTags(value[0]).replace(/&nbsp;/gi, " ")), value: value[1] });
        }
        for (const child of value) walk(child);
      };
      walk(data);
      return pairs;
    } catch (_) {
      return [];
    }
  }

  function statPriorityTooltipValue(rawTooltip, pattern) {
    const rx = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
    return statPriorityTooltipPairs(rawTooltip).find(pair => rx.test(normalize(pair.label)))?.value ?? null;
  }

  function statPriorityTrainingUrl() {
    const u = new URL("/game/index.php", location.href);
    u.searchParams.set("mod", "training");
    try {
      const sh = new URL(location.href).searchParams.get("sh");
      if (sh) u.searchParams.set("sh", sh);
    } catch (_) {}
    return u.href;
  }

  function statPriorityRawFormulaCost(base, exponent) {
    const n = Number(base);
    if (!Number.isFinite(n) || n < 5) return 0;
    return Math.floor(Math.pow(n - 4, exponent));
  }

  function inferStatPriorityDiscount(rows) {
    const valid = rows.filter(row => Number.isFinite(row?.base) && Number.isFinite(row?.nextCost));
    if (!valid.length) return { factor: 1, method: "fallback-no-anchors", interval: null };
    let lower = 0;
    let upper = 1;
    for (const row of valid) {
      const raw = statPriorityRawFormulaCost(row.base, row.exponent);
      if (raw <= 0) continue;
      lower = Math.max(lower, row.nextCost / raw);
      upper = Math.min(upper, (row.nextCost + 1) / raw);
    }
    lower = Math.max(0, Math.min(1, lower));
    upper = Math.max(0, Math.min(1, upper));
    if (lower <= upper) {
      const minTick = Math.ceil((lower - 1e-12) * 10000);
      const maxTick = Math.floor((upper + 1e-12) * 10000);
      if (minTick <= maxTick) {
        const factor = Math.max(0, Math.min(1, minTick / 10000));
        return { factor, method: "common-0.01%-grid", interval: [lower, upper] };
      }
      return { factor: (lower + upper) / 2, method: "common-interval", interval: [lower, upper] };
    }
    const factors = valid.map(row => {
      const raw = statPriorityRawFormulaCost(row.base, row.exponent);
      return raw > 0 ? row.nextCost / raw : 1;
    }).filter(Number.isFinite);
    const factor = factors.length ? Math.max(0, Math.min(1, factors.reduce((a, b) => a + b, 0) / factors.length)) : 1;
    return { factor, method: "mean-anchors-fallback", interval: null };
  }

  function statPriorityCostAtBase(base, config, discountFactor, anchorCost = null) {
    const raw = statPriorityRawFormulaCost(base, config.exponent);
    if (anchorCost != null && Number.isFinite(Number(anchorCost))) return Math.max(0, Math.floor(Number(anchorCost)));
    return Math.max(0, Math.floor(raw * discountFactor + 1e-9));
  }

  function statPriorityMaximumMode(trainingRow, characterLevel) {
    const base = Number(trainingRow?.base);
    const max = Number(trainingRow?.max);
    const level = Number(characterLevel);
    if (!Number.isFinite(base) || !Number.isFinite(max) || !Number.isFinite(level)) return { type: "standard", factor: 1.5 };
    const standard = Math.floor(base * 1.5) + level;
    const pact = Math.floor(base * 2) + level;
    if (Math.abs(max - standard) <= 1) return { type: "standard", factor: 1.5 };
    if (Math.abs(max - pact) <= 1) return { type: "expanded", factor: 2 };
    const inferred = base > 0 ? (max - level) / base : 1.5;
    return inferred >= 1.75 ? { type: "inferred-expanded", factor: 2 } : { type: "inferred-standard", factor: 1.5 };
  }

  function statPriorityMaximumAtBase(trainingRow, base, characterLevel) {
    const projectedBase = Math.max(0, Math.floor(Number(base) || 0));
    const level = Math.max(0, Math.floor(Number(characterLevel) || 0));
    const mode = statPriorityMaximumMode(trainingRow, level);
    return Math.floor(projectedBase * mode.factor) + level;
  }

  function statPriorityTrainingBaseMaximum(characterLevel) {
    const level = Math.max(0, Math.floor(Number(characterLevel) || 0));
    return Math.max(200, level * 5);
  }

  function statPriorityCostForInvestment(trainingRow, investment, characterLevel) {
    const n = Math.max(1, Math.floor(Number(investment) || 1));
    const base = Math.max(0, Math.floor(Number(trainingRow?.base) || 0));
    const current = Number(trainingRow?.current);
    const projectedBase = base + n;
    const projectedMaximum = statPriorityMaximumAtBase(trainingRow, projectedBase, characterLevel);
    const trainingBaseMaximum = statPriorityTrainingBaseMaximum(characterLevel);
    if (projectedBase > trainingBaseMaximum) {
      const remainingBase = Math.max(0, trainingBaseMaximum - base);
      return { ok: false, totalCost: null, costs: [], reason: `Exceeds training-base maximum (${trainingBaseMaximum} base; ${remainingBase} point${remainingBase === 1 ? "" : "s"} remaining).` };
    }
    // Item flat bonuses do NOT increase the maximum and do not consume the
    // available training headroom. Compare the projected TRAINED/BASE value
    // against the dynamically recalculated maximum only. The displayed/current
    // total may be much higher because of equipment flat bonuses.
    if (projectedBase > projectedMaximum) {
      const remainingBase = Math.max(0, projectedMaximum - base);
      return { ok: false, totalCost: null, costs: [], reason: `Exceeds dynamic stat maximum (${projectedMaximum} base after ${projectedBase}; ${remainingBase} point${remainingBase === 1 ? "" : "s"} remaining).` };
    }
    // Match the current Gladiatus Tools calculator: sum the unrounded
    // per-point power terms, then floor the aggregate base cost and apply the
    // current discount once to that aggregate. The first displayed game cost
    // remains the authoritative anchor for +1.
    let rawTotal = 0;
    const costs = [];
    for (let i = 0; i < n; i++) {
      const pointBase = base + i;
      const raw = Math.pow(Math.max(0, pointBase - 4), trainingRow.config.exponent);
      rawTotal += raw;
      costs.push(i === 0 ? trainingRow.nextCost : Math.max(0, Math.floor(raw * trainingRow.discountFactor + 1e-9)));
    }
    const totalCost = Math.max(0, Math.floor(rawTotal * trainingRow.discountFactor + 1e-9));
    return { ok: true, totalCost, baseCost: Math.floor(rawTotal), costs, projectedBase, projectedMaximum, trainingBaseMaximum };
  }

  async function fetchStatPriorityTraining(profile = null) {
    const url = statPriorityTrainingUrl();
    const response = await fetch(url, { credentials: "include", redirect: "follow", headers: { Accept: "text/html,application/xhtml+xml" } });
    if (!response.ok) throw new Error(`Training page returned HTTP ${response.status}.`);
    const html = await response.text();
    if (!html) throw new Error("Training page returned empty HTML.");
    const doc = new DOMParser().parseFromString(html, "text/html");

    // The training page is used only to recover the shared discount multiplier.
    // Character-specific BASE/MAX values come from the saved Character Overview
    // profile, never from the current page. This prevents the main character's
    // training values from being applied to another saved character.
    const rawRows = [];
    for (const [key, config] of Object.entries(STAT_PRIORITY_CONFIG)) {
      const el = doc.querySelector(`#${config.id}`);
      if (!el) continue;
      const tooltip = el.getAttribute("data-tooltip") || "";
      const baseRaw = statPriorityTooltipValue(tooltip, /^&?nbsp;?\s*Basic:?$/i) ?? statPriorityTooltipValue(tooltip, /^Basic:?$/i);
      const maxRaw = statPriorityTooltipValue(tooltip, /^&?nbsp;?\s*Maximum:?$/i) ?? statPriorityTooltipValue(tooltip, /^Maximum:?$/i);
      const currentRaw = statPriorityTooltipValue(tooltip, new RegExp(`^${config.label}:?$`, "i"));
      const base = parseLocalizedInteger(baseRaw);
      const max = parseLocalizedInteger(maxRaw);
      const current = parseLocalizedInteger(currentRaw);
      const valueNodes = Array.from(el.querySelectorAll(".training_value"));
      const currentFallback = valueNodes.length ? parseLocalizedInteger(valueNodes[valueNodes.length - 1]?.textContent || "") : null;
      const currentTotal = Number.isFinite(current) ? current : currentFallback;
      const costEl = el.parentElement?.querySelector(".training_costs") || el.closest("div[style*='width:500px']")?.querySelector(".training_costs");
      const nextCost = parseLocalizedInteger(costEl?.textContent || "");
      if (Number.isFinite(base) && Number.isFinite(max) && Number.isFinite(currentTotal) && Number.isFinite(nextCost)) {
        rawRows.push({ key, config, base, current: currentTotal, max, nextCost });
      }
    }
    const discount = inferStatPriorityDiscount(rawRows.map(row => ({ ...row, exponent: row.config.exponent })));

    if (profile) {
      const stats = profile.stats || {};
      const missing = [];
      for (const key of TRAINABLE_STAT_KEYS) {
        const base = Number(stats?.statDetails?.[key]?.base);
        const max = Number(stats?.statDetails?.[key]?.max);
        if (!Number.isFinite(base)) missing.push(`${key} trained/base`);
        if (!Number.isFinite(max)) missing.push(`${key} maximum`);
      }
      if (missing.length) throw new Error(`Saved profile for ${characterDisplayName(profile)} is missing ${missing.join(", ")}. Capture All Characters again to refresh the saved profile.`);

      const rows = Object.entries(STAT_PRIORITY_CONFIG).map(([key, config]) => {
        const detail = stats?.statDetails?.[key] || {};
        const base = Number(detail.base);
        const max = Number(detail.max);
        const current = Number(stats?.[key]);
        const estimatedNextCost = Math.max(0, Math.floor(statPriorityRawFormulaCost(base, config.exponent) * discount.factor + 1e-9));
        return {
          key, config, base, current: Number.isFinite(current) ? current : base, max,
          nextCost: estimatedNextCost, discountFactor: discount.factor, source: "saved-character-profile"
        };
      });
      return {
        capturedAt: new Date().toISOString(), sourceUrl: url, source: "saved-character-profile",
        characterDollId: String(profile.dollId), characterName: profile.name || stats.name || null,
        discountFactor: discount.factor, discountMethod: discount.method, discountInterval: discount.interval,
        level: Number.isFinite(Number(stats.level)) ? Number(stats.level) : null, rows
      };
    }

    const normalizedRows = rawRows.map(row => ({ ...row, discountFactor: discount.factor }));
    const capturedAt = new Date().toISOString();
    const levelValue = parseLocalizedInteger((doc.querySelector('[data-tooltip*="Level"], .level')?.getAttribute?.("data-tooltip") || "").match(/Level:?\s*([0-9.,\s]+)/i)?.[1] || "");
    return { capturedAt, sourceUrl: response.url || url, discountFactor: discount.factor, discountMethod: discount.method, discountInterval: discount.interval, level: Number.isFinite(levelValue) ? levelValue : null, rows: normalizedRows };
  }

  function statPriorityPlayerEquipment() {
    const main = characterProfileStore.characters?.["1"];
    if (main?.equipment && Object.keys(main.equipment).length) return main.equipment;
    if (savedEquipment?.equipment && Object.keys(savedEquipment.equipment).length) return savedEquipment.equipment;
    if (currentEquipment && Object.keys(currentEquipment).length) return currentEquipment;
    return {};
  }

  function statPriorityFormatGold(value) {
    return Number.isFinite(Number(value)) ? `${Math.round(Number(value)).toLocaleString()}g` : "—";
  }

  function statPriorityFormatDelta(value, digits = 2) {
    if (!Number.isFinite(Number(value))) return "—";
    const n = Number(value);
    return `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(digits)}`;
  }

  function statPriorityDummyRawStats(profile) {
    return {
      level: profile.level,
      strength: profile.strength,
      dexterity: profile.dexterity,
      agility: profile.agility,
      constitution: profile.constitution,
      charisma: profile.charisma,
      intelligence: profile.intelligence,
      armour: profile.armour,
      damageMin: profile.damageMin,
      damageMax: profile.damageMax,
      lifeMax: profile.lifeMax,
      lifeCurrent: profile.lifeMax,
      name: "Training Dummy"
    };
  }

  function statPriorityBuildSavedCombatProfile(engine, profile, turmaRole = null) {
    const stats = { ...(profile.stats || {}), name: profile.name || profile.stats?.name || characterDisplayName(profile) };
    const equipment = profile.equipment || {};
    const baseStats = characterProfileBaseStats(profile);
    const combatProfile = engine.buildProfileFromSnapshot(equipment, stats, {
      baseStats,
      name: stats.name,
      recalculateDerived: false
    });
    combatProfile.name = stats.name;
    combatProfile.lifeCurrent = combatProfile.lifeMax;
    combatProfile.dollId = String(profile.dollId);
    combatProfile.turmaRole = turmaRole || statPriorityTurmaRoleForProfile(profile);
    combatProfile.turmaThreat = Number.isFinite(Number(stats?.threat)) ? Number(stats.threat) : Number(combatProfile?.itemModifiers?.threat?.flat || 0);
    combatProfile.criticalHealing = Number.isFinite(Number(stats?.criticalHealing)) ? Number(stats.criticalHealing) : Number(combatProfile?.itemModifiers?.criticalHealing?.flat || 0);
    return combatProfile;
  }

  function buildStatPriorityProfiles(profile, training, mode = statPriorityMode()) {
    const engine = simulatorEngine();
    if (!engine) throw new Error("Combat simulator engine unavailable.");
    if (!profile) throw new Error("No saved character profile is selected. Capture All Characters first.");
    const missing = characterProfileMissingSimulationData(profile);
    if (missing.length) throw new Error(`Saved profile for ${characterDisplayName(profile)} is missing ${missing.join(", ")}. Capture All Characters again to refresh the saved profile.`);

    const costRows = Object.fromEntries((training?.rows || []).map(row => [row.key, row]));

    if (mode === "arena") {
      const mainProfile = characterProfileStore.characters?.["1"] || profile;
      const basePlayer = statPriorityBuildSavedCombatProfile(engine, mainProfile, "dps");
      const dummyRaw = statPriorityDummyRawStats(basePlayer);
      const dummy = engine.buildProfile({
        equipmentSnapshot: mainProfile.equipment || {}, stats: dummyRaw, opponentStats: basePlayer,
        explicitLifeMax: basePlayer.lifeMax, explicitArmour: basePlayer.armour,
        explicitDamageRange: `${basePlayer.damageMin}-${basePlayer.damageMax}`,
        recalculateDerived: true, name: "Arena Training Dummy"
      });
      dummy.lifeCurrent = dummy.lifeMax;
      dummy.turmaRole = "dps";

      // Normalize target-dependent derived values on the saved baseline against the
      // exact frozen Arena dummy used by every Stat Priority test. Saved profiles
      // may legitimately store hitChance/doubleHit as 0 because those values are
      // opponent-dependent and were captured without a target context. A zero-point
      // hypothetical investment recalculates the derived fields without changing any
      // trainable stat, damage baseline, armour baseline, or life baseline.
      const baselineNormalization = engine.applyHypotheticalBaseInvestment(basePlayer, "strength", 0, dummy, mainProfile.equipment || {});
      const normalizedBasePlayer = baselineNormalization?.profile || basePlayer;
      normalizedBasePlayer.hypothetical = false;
      normalizedBasePlayer.sources = normalizedBasePlayer.sources && typeof normalizedBasePlayer.sources === "object" ? { ...normalizedBasePlayer.sources } : {};
      delete normalizedBasePlayer.sources.hypotheticalBaseInvestment;
      return { mode: "arena", profile: mainProfile, equipment: mainProfile.equipment || {}, basePlayer: normalizedBasePlayer, dummy, costRows, baseStats: characterProfileBaseStats(mainProfile), baseTeam: null, trainingTeam: null, selectedTeamMember: normalizedBasePlayer };
    }

    const roster = turmaCharacterProfilesList().filter(character => characterProfileMissingSimulationData(character).length === 0);
    if (roster.length < 2) {
      throw new Error("Circus Turma Stat Priority requires at least 2 complete saved character profiles. Capture All Characters first.");
    }
    const baseTeam = roster.map(character => statPriorityBuildSavedCombatProfile(engine, character));
    const selectedIndex = Math.max(0, roster.findIndex(character => String(character.dollId) === String(profile.dollId)));
    const selectedTeamMember = baseTeam[selectedIndex >= 0 ? selectedIndex : 0];
    const trainingTeam = baseTeam.map(member => {
      const clone = JSON.parse(JSON.stringify(member));
      clone.name = `${member.name} · Training Mirror`;
      clone.lifeCurrent = clone.lifeMax;
      return clone;
    });
    return {
      mode: "turma",
      profile: roster[selectedIndex >= 0 ? selectedIndex : 0],
      equipment: roster[selectedIndex >= 0 ? selectedIndex : 0].equipment || {},
      basePlayer: selectedTeamMember,
      dummy: null,
      baseTeam,
      trainingTeam,
      selectedTeamMember,
      costRows,
      baseStats: characterProfileBaseStats(roster[selectedIndex >= 0 ? selectedIndex : 0]),
      roster
    };
  }

  function statPriorityHypotheticalTeam(engine, profiles, hypotheticalSelected) {
    return profiles.baseTeam.map(member => String(member.dollId) === String(hypotheticalSelected?.dollId) ? hypotheticalSelected : JSON.parse(JSON.stringify(member)));
  }

  function statPriorityTurmaRelevantDiff(baseline, hypothetical) {
    const fields = [];
    for (const key of ["strength", "dexterity", "agility", "constitution", "charisma", "intelligence", "damageMin", "damageMax", "lifeMax"]) {
      if (!statPriorityProfileNumbersEqual(baseline?.[key], hypothetical?.[key])) fields.push(`${key} ${fmtNum(baseline?.[key])}→${fmtNum(hypothetical?.[key])}`);
    }
    for (const key of ["critical", "block", "avoidCritical"]) {
      if (!statPriorityProfileNumbersEqual(baseline?.dinoPoints?.[key], hypothetical?.dinoPoints?.[key])) fields.push(`${key} points ${fmtNum(baseline?.dinoPoints?.[key])}→${fmtNum(hypothetical?.dinoPoints?.[key])}`);
    }
    return fields;
  }

  function statPriorityNextTurmaDerivedChange(key, baseline, mirror, equipment, maxLookahead = 100) {
    const engine = simulatorEngine();
    if (!engine) return { points: null, base: null, changed: false };
    const base = Number(baseline?.baselines?.trainable?.[key]);
    if (!Number.isFinite(base)) return { points: null, base: null, changed: false };
    const opponent = mirror || null;
    for (let points = 1; points <= maxLookahead; points++) {
      const candidate = engine.applyHypotheticalBaseInvestment(baseline, key, points, opponent, equipment);
      if (!statPriorityProfileNumbersEqual(baseline?.damageMin, candidate?.damageMin) ||
          !statPriorityProfileNumbersEqual(baseline?.damageMax, candidate?.damageMax) ||
          !statPriorityProfileNumbersEqual(baseline?.lifeMax, candidate?.lifeMax) ||
          !statPriorityProfileNumbersEqual(baseline?.dinoPoints?.["critical"], candidate?.dinoPoints?.["critical"]) ||
          !statPriorityProfileNumbersEqual(baseline?.dinoPoints?.["block"], candidate?.dinoPoints?.["block"]) ||
          !statPriorityProfileNumbersEqual(baseline?.dinoPoints?.["avoidCritical"], candidate?.dinoPoints?.["avoidCritical"])) {
        return { points, base: base + points, changed: true };
      }
    }
    return { points: null, base: null, changed: false };
  }

  function statPriorityTurmaEffectSummary(key, baseline, hypothetical, enemyTeam = []) {
    const name = baseline?.name || "Selected fighter";
    const effective = `${fmtNum(baseline?.[key])}→${fmtNum(hypothetical?.[key])}`;
    switch (key) {
      case "strength": return `${name} · effective ${effective} · damage ${fmtNum(baseline?.damageMin)}–${fmtNum(baseline?.damageMax)}→${fmtNum(hypothetical?.damageMin)}–${fmtNum(hypothetical?.damageMax)} · block points ${fmtNum(baseline?.dinoPoints?.block)}→${fmtNum(hypothetical?.dinoPoints?.block)}`;
      case "dexterity": return `${name} · effective ${effective} · hit/crit calculations are target-specific across ${enemyTeam.length} opponents · crit points ${fmtNum(baseline?.dinoPoints?.critical)}→${fmtNum(hypothetical?.dinoPoints?.critical)}`;
      case "agility": return `${name} · effective ${effective} · critical-avoidance points ${fmtNum(baseline?.dinoPoints?.avoidCritical)}→${fmtNum(hypothetical?.dinoPoints?.avoidCritical)} · opponent hit/double-hit chances are target-specific`;
      case "constitution": return `${name} · effective ${effective} · HP ${fmtNum(baseline?.lifeMax)}→${fmtNum(hypothetical?.lifeMax)}`;
      case "charisma": return `${name} · effective ${effective} · double-hit chance is target-specific versus ${enemyTeam.length} opponents`;
      case "intelligence": return `${name} · effective ${effective} · reduces enemy double-hit chance against this fighter on a target-by-target basis`;
      default: return `${name} · effective ${effective}`;
    }
  }

  const STAT_PRIORITY_PROFILE_FIELDS = Object.freeze([
    "strength", "dexterity", "agility", "constitution", "charisma", "intelligence",
    "armour", "lifeMax", "damageMin", "damageMax", "hitChance", "doubleHit",
    "criticalChance", "blockChance", "criticalAvoidance", "healing"
  ]);

  const STAT_PRIORITY_ALLOWED_PROFILE_CHANGES = Object.freeze({
    strength: new Set(["strength", "damageMin", "damageMax", "blockChance"]),
    dexterity: new Set(["dexterity", "hitChance", "doubleHit", "criticalChance"]),
    agility: new Set(["agility", "criticalAvoidance"]),
    constitution: new Set(["constitution", "lifeMax"]),
    charisma: new Set(["charisma", "doubleHit"]),
    intelligence: new Set(["intelligence"])
  });

  function statPriorityProfileNumbersEqual(a, b) {
    const left = Number(a);
    const right = Number(b);
    if (!Number.isFinite(left) && !Number.isFinite(right)) return true;
    return Math.abs(left - right) <= 1e-9;
  }

  function statPriorityProfileDiff(baseline, hypothetical) {
    const fields = [];
    for (const field of STAT_PRIORITY_PROFILE_FIELDS) {
      if (!statPriorityProfileNumbersEqual(baseline?.[field], hypothetical?.[field])) {
        fields.push(`${field} ${fmtNum(baseline?.[field])}→${fmtNum(hypothetical?.[field])}`);
      }
    }
    return fields;
  }

  function statPriorityValidateHypotheticalProfile(baseline, hypothetical, key, mode = "arena") {
    const allowed = STAT_PRIORITY_ALLOWED_PROFILE_CHANGES[key] || new Set([key]);
    const ignoredForTurma = mode === "turma" ? new Set(["hitChance", "doubleHit"]) : null;
    const issues = [];
    for (const field of STAT_PRIORITY_PROFILE_FIELDS) {
      if (allowed.has(field)) continue;
      if (ignoredForTurma?.has(field)) continue;
      if (!statPriorityProfileNumbersEqual(baseline?.[field], hypothetical?.[field])) {
        issues.push(`${field} ${fmtNum(baseline?.[field])}→${fmtNum(hypothetical?.[field])}`);
      }
    }
    const baselineDino = baseline?.dinoPoints || {};
    const hypotheticalDino = hypothetical?.dinoPoints || {};
    const allowedDino = key === "strength" ? "block" : key === "dexterity" ? "critical" : key === "agility" ? "avoidCritical" : null;
    for (const field of ["block", "critical", "avoidCritical"]) {
      if (field === allowedDino) continue;
      if (!statPriorityProfileNumbersEqual(baselineDino[field], hypotheticalDino[field])) {
        issues.push(`dino.${field} ${fmtNum(baselineDino[field])}→${fmtNum(hypotheticalDino[field])}`);
      }
    }
    return { ok: issues.length === 0, issues };
  }

  function statPriorityNextDerivedChange(key, baseline, dummy, equipment, maxLookahead = 100) {
    const engine = simulatorEngine();
    if (!engine?.applyHypotheticalBaseInvestment || !engine?.calculateDinoChances) return { points: null, base: null, changed: false };
    const currentBase = Number(baseline?.baselines?.trainable?.[key] ?? baseline?.[key] ?? 0);
    const matchupChanged = candidate => {
      const playerBefore = engine.calculateDinoChances(baseline, dummy);
      const playerAfter = engine.calculateDinoChances(candidate, dummy);
      const enemyBefore = engine.calculateDinoChances(dummy, baseline);
      const enemyAfter = engine.calculateDinoChances(dummy, candidate);
      if (key === "strength" && (
        !statPriorityProfileNumbersEqual(baseline?.damageMin, candidate?.damageMin) ||
        !statPriorityProfileNumbersEqual(baseline?.damageMax, candidate?.damageMax) ||
        !statPriorityProfileNumbersEqual(playerBefore.blockChance, playerAfter.blockChance))) return true;
      if (key === "dexterity" && (
        !statPriorityProfileNumbersEqual(playerBefore.hitChance, playerAfter.hitChance) ||
        !statPriorityProfileNumbersEqual(playerBefore.doubleHit, playerAfter.doubleHit) ||
        !statPriorityProfileNumbersEqual(playerBefore.criticalChance, playerAfter.criticalChance))) return true;
      if (key === "agility" && (
        !statPriorityProfileNumbersEqual(playerBefore.criticalAvoidance, playerAfter.criticalAvoidance) ||
        !statPriorityProfileNumbersEqual(enemyBefore.hitChance, enemyAfter.hitChance) ||
        !statPriorityProfileNumbersEqual(enemyBefore.doubleHit, enemyAfter.doubleHit))) return true;
      if (key === "constitution" && !statPriorityProfileNumbersEqual(baseline?.lifeMax, candidate?.lifeMax)) return true;
      if (key === "charisma" && !statPriorityProfileNumbersEqual(playerBefore.doubleHit, playerAfter.doubleHit)) return true;
      if (key === "intelligence" && !statPriorityProfileNumbersEqual(enemyBefore.doubleHit, enemyAfter.doubleHit)) return true;
      return false;
    };
    for (let points = 1; points <= Math.max(1, Math.floor(maxLookahead)); points++) {
      const projected = engine.applyHypotheticalBaseInvestment(baseline, key, points, dummy, equipment)?.profile;
      if (projected && matchupChanged(projected)) return { points, base: currentBase + points, changed: true };
    }
    return { points: null, base: null, changed: false };
  }

  function statPriorityEffectSummary(key, baseline, hypothetical, dummy = null) {
    const engine = simulatorEngine();
    const b = Number(baseline?.[key] || 0);
    const h = Number(hypothetical?.[key] || 0);
    const baseBefore = Number(baseline?.baselines?.trainable?.[key] ?? b);
    const baseAfter = Number(hypothetical?.baselines?.trainable?.[key] ?? h);
    const effective = `${fmtNum(b)}→${fmtNum(h)}`;
    const base = `base ${fmtNum(baseBefore)}→${fmtNum(baseAfter)}`;
    const playerBefore = engine?.calculateDinoChances && dummy ? engine.calculateDinoChances(baseline, dummy) : null;
    const playerAfter = engine?.calculateDinoChances && dummy ? engine.calculateDinoChances(hypothetical, dummy) : null;
    const enemyBefore = engine?.calculateDinoChances && dummy ? engine.calculateDinoChances(dummy, baseline) : null;
    const enemyAfter = engine?.calculateDinoChances && dummy ? engine.calculateDinoChances(dummy, hypothetical) : null;
    switch (key) {
      case "strength":
        return `${base} · effective ${effective} · damage ${fmtNum(baseline?.damageMin)}–${fmtNum(baseline?.damageMax)}→${fmtNum(hypothetical?.damageMin)}–${fmtNum(hypothetical?.damageMax)} · block ${fmtNum(playerBefore?.blockChance)}→${fmtNum(playerAfter?.blockChance)}%`;
      case "dexterity":
        return `${base} · effective ${effective} · hit ${fmtNum(playerBefore?.hitChance)}→${fmtNum(playerAfter?.hitChance)}% · double hit ${fmtNum(playerBefore?.doubleHit)}→${fmtNum(playerAfter?.doubleHit)}% · crit ${fmtNum(playerBefore?.criticalChance)}→${fmtNum(playerAfter?.criticalChance)}%`;
      case "agility":
        return `${base} · effective ${effective} · crit avoidance ${fmtNum(playerBefore?.criticalAvoidance)}→${fmtNum(playerAfter?.criticalAvoidance)}% · dummy hit ${fmtNum(enemyBefore?.hitChance)}→${fmtNum(enemyAfter?.hitChance)}% · dummy double hit ${fmtNum(enemyBefore?.doubleHit)}→${fmtNum(enemyAfter?.doubleHit)}%`;
      case "constitution":
        return `${base} · effective ${effective} · HP ${fmtNum(baseline?.lifeMax)}→${fmtNum(hypothetical?.lifeMax)}`;
      case "charisma":
        return `${base} · effective ${effective} · double hit ${fmtNum(playerBefore?.doubleHit)}→${fmtNum(playerAfter?.doubleHit)}%`;
      case "intelligence":
        return `${base} · effective ${effective} · dummy double hit ${fmtNum(enemyBefore?.doubleHit)}→${fmtNum(enemyAfter?.doubleHit)}%`;
      default:
        return `${base} · effective ${effective}`;
    }
  }

  async function runStatPriorityAnalysis() {
    if (statPriorityState.busy) return;
    const button = shadow?.querySelector("#ga-stat-priority-run");
    const status = shadow?.querySelector("#ga-stat-priority-status");
    const mode = statPriorityMode();
    statPriorityState.busy = true;
    statPriorityState.error = null;
    statPriorityState.result = null;
    const globalSimulations = globalSimulationCount();
    statPriorityState.simulations = globalSimulations;
    logStatPriorityDiagnostic("analysis-start", { mode, investment: Number(statPriorityState.investment) || 1, simulations: globalSimulations, seed: Number(statPriorityState.seed) || 1 });
    if (button) button.disabled = true;
    if (status) status.textContent = "Loading saved character profile and training data…";
    try {
      await loadCharacterProfileStore();
      const selectedProfile = selectedStatPriorityCharacterProfile(mode);
      if (!selectedProfile) throw new Error("No saved character profile is available. Use Capture All Characters first.");
      const missingProfileData = characterProfileMissingSimulationData(selectedProfile);
      if (missingProfileData.length) throw new Error(`Saved profile for ${characterDisplayName(selectedProfile)} is missing ${missingProfileData.join(", ")}. Capture All Characters again to refresh the saved profile.`);
      const currentStats = { ...(selectedProfile.stats || {}), name: selectedProfile.name || selectedProfile.stats?.name || characterDisplayName(selectedProfile) };
      const training = await fetchStatPriorityTraining(selectedProfile);
      statPriorityState.training = training;
      const profiles = buildStatPriorityProfiles(selectedProfile, training, mode);
      const engine = simulatorEngine();
      const investment = Math.max(1, Math.min(100, Math.floor(Number(statPriorityState.investment) || 1)));
      const simulations = globalSimulationCount();
      const seed = Math.max(1, Math.floor(Number(statPriorityState.seed) || 1));
      const rows = [];
      logStatPriorityDiagnostic("profiles-ready", { mode, selectedCharacterDollId: profiles.profile?.dollId || selectedProfile?.dollId || null, selectedCharacterName: profiles.profile?.name || selectedProfile?.name || null, teamSize: mode === "turma" ? profiles.baseTeam?.length || 0 : 1, enemyTeamSize: mode === "turma" ? profiles.trainingTeam?.length || 0 : 1 });

      if (mode === "arena") {
        const options = { simulations, seed, lifeMode: "full", maxRounds: ARENA_SIMULATION_ROUNDS };
        if (status) status.textContent = `Running Arena baseline (${simulations.toLocaleString()})…`;
        await new Promise(resolve => requestAnimationFrame(resolve));
        const baseline = engine.simulateBatch({ player: profiles.basePlayer, enemy: profiles.dummy, ...options });
        logStatPriorityDiagnostic("baseline-complete", { mode, winRate: Number(baseline?.rates?.win || 0), simulations: Number(baseline?.simulations || simulations) });
        const mirror = profiles.dummy;
        const sortedKeys = Object.keys(STAT_PRIORITY_CONFIG);
        for (let index = 0; index < sortedKeys.length; index++) {
          const key = sortedKeys[index];
          const costRow = profiles.costRows[key];
          const cost = statPriorityCostForInvestment(costRow, investment, Number(currentStats?.level) || Number(training?.level) || 0);
          if (!cost.ok) {
            rows.push({ key, label: costRow.config.label, base: costRow.base, maximum: costRow.max, investment, totalCost: null, costs: cost.costs, valid: false, reason: cost.reason, baselineWinRate: baseline.rates.win, testWinRate: null, deltaWinRate: null, efficiency: null });
            continue;
          }
          const hypotheticalResult = engine.applyHypotheticalBaseInvestment(profiles.basePlayer, key, investment, mirror, profiles.equipment);
          const hypotheticalPlayer = hypotheticalResult.profile;
          const sanity = statPriorityValidateHypotheticalProfile(profiles.basePlayer, hypotheticalPlayer, key, "arena");
          const changedFields = statPriorityProfileDiff(profiles.basePlayer, hypotheticalPlayer);
          logStatPriorityDiagnostic("hypothetical-validation", { mode: "arena", key, label: costRow.config.label, ok: sanity.ok, changedFields, issues: sanity.issues });
          if (!sanity.ok) throw new Error(`${costRow.config.label} hypothetical profile changed unrelated combat fields: ${sanity.issues.join(", ")}`);
          hypotheticalPlayer.lifeCurrent = hypotheticalPlayer.lifeMax;
          const test = engine.simulateBatch({ player: hypotheticalPlayer, enemy: profiles.dummy, ...options });
          const delta = Number(test?.rates?.win || 0) - Number(baseline?.rates?.win || 0);
          const nextChange = statPriorityNextDerivedChange(key, profiles.basePlayer, profiles.dummy, profiles.equipment);
          rows.push({
            key, label: costRow.config.label, base: costRow.base, maximum: costRow.max, investment, totalCost: cost.totalCost, costs: cost.costs, valid: true, reason: null, nextChange,
            baselineWinRate: Number(baseline?.rates?.win || 0), testWinRate: Number(test?.rates?.win || 0), deltaWinRate: delta,
            efficiency: cost.totalCost > 0 ? delta / cost.totalCost * 1000 : null,
            resultingStat: hypotheticalPlayer[key], resultingLifeMax: hypotheticalPlayer.lifeMax,
            resultingDamageMin: hypotheticalPlayer.damageMin, resultingDamageMax: hypotheticalPlayer.damageMax,
            testHitRate: Number(test?.rates?.playerHit || 0), baselineHitRate: Number(baseline?.rates?.playerHit || 0),
            effect: statPriorityEffectSummary(key, profiles.basePlayer, hypotheticalPlayer, profiles.dummy),
            changedFields, sanityOk: true
          });
          logStatPriorityDiagnostic("stat-test-complete", { mode, key, label: costRow.config.label, baselineWinRate: Number(baseline?.rates?.win || 0), testWinRate: Number(test?.rates?.win || 0), deltaWinRate: delta, totalCost: cost.totalCost, valid: true, index: index + 1, totalTests: sortedKeys.length });
          if (status) status.textContent = `Tested Arena ${costRow.config.label} (${index + 1}/${sortedKeys.length})…`;
          await new Promise(resolve => requestAnimationFrame(resolve));
        }
        rows.sort((a, b) => {
          if (a.valid !== b.valid) return a.valid ? -1 : 1;
          const ae = Number.isFinite(a.efficiency) ? a.efficiency : -Infinity;
          const be = Number.isFinite(b.efficiency) ? b.efficiency : -Infinity;
          if (be !== ae) return be - ae;
          return String(a.label).localeCompare(String(b.label));
        });
        statPriorityState.result = {
          generatedAt: new Date().toISOString(), mode: "arena", characterDollId: "1", characterName: profiles.profile.name || null,
          investment, simulations, seed, maxRounds: ARENA_SIMULATION_ROUNDS, baseline, rows,
          player: profiles.basePlayer, dummy: profiles.dummy, training
        };
      } else {
        const options = { simulations, seed, maxRounds: 50 };
        if (status) status.textContent = `Running Circus Turma team baseline (${simulations.toLocaleString()})…`;
        await new Promise(resolve => requestAnimationFrame(resolve));
        const baseline = await engine.simulateTurmaBatchAsync({ attackers: profiles.baseTeam, defenders: profiles.trainingTeam, ...options, chunkSize: 25,
          onProgress: progress => { if (status) status.textContent = `Circus Turma baseline ${progress.completed.toLocaleString()}/${progress.total.toLocaleString()}…`; }
        });
        logStatPriorityDiagnostic("baseline-complete", { mode, winRate: Number(baseline?.rates?.win || 0), simulations: Number(baseline?.simulations || simulations), teamSize: profiles.baseTeam?.length || 0 });
        const selectedMirror = profiles.trainingTeam.find(member => String(member.dollId) === String(profiles.selectedTeamMember?.dollId)) || profiles.trainingTeam[0] || null;
        const selectedLabel = profiles.profile?.name || profiles.selectedTeamMember?.name || "Selected fighter";
        const sortedKeys = Object.keys(STAT_PRIORITY_CONFIG);
        for (let index = 0; index < sortedKeys.length; index++) {
          const key = sortedKeys[index];
          const costRow = profiles.costRows[key];
          const cost = statPriorityCostForInvestment(costRow, investment, Number(currentStats?.level) || Number(training?.level) || 0);
          if (!cost.ok) {
            rows.push({ key, label: costRow.config.label, base: costRow.base, maximum: costRow.max, investment, totalCost: null, costs: cost.costs, valid: false, reason: cost.reason, baselineWinRate: baseline.rates.win, testWinRate: null, deltaWinRate: null, efficiency: null });
            continue;
          }
          const hypotheticalResult = engine.applyHypotheticalBaseInvestment(profiles.selectedTeamMember, key, investment, selectedMirror, profiles.equipment);
          const hypotheticalSelected = hypotheticalResult.profile;
          hypotheticalSelected.dollId = profiles.selectedTeamMember.dollId;
          hypotheticalSelected.turmaRole = profiles.selectedTeamMember.turmaRole;
          hypotheticalSelected.turmaThreat = profiles.selectedTeamMember.turmaThreat;
          hypotheticalSelected.criticalHealing = profiles.selectedTeamMember.criticalHealing;
          const changedFields = statPriorityTurmaRelevantDiff(profiles.selectedTeamMember, hypotheticalSelected);
          const sanity = statPriorityValidateHypotheticalProfile(profiles.selectedTeamMember, hypotheticalSelected, key, "turma");
          logStatPriorityDiagnostic("hypothetical-validation", { mode: "turma", key, label: costRow.config.label, ok: sanity.ok, changedFields, issues: sanity.issues });
          if (!sanity.ok) throw new Error(`${costRow.config.label} hypothetical profile changed unrelated combat fields: ${sanity.issues.join(", ")}`);
          hypotheticalSelected.lifeCurrent = hypotheticalSelected.lifeMax;
          const testTeam = statPriorityHypotheticalTeam(engine, profiles, hypotheticalSelected);
          const test = await engine.simulateTurmaBatchAsync({ attackers: testTeam, defenders: profiles.trainingTeam, ...options, chunkSize: 25,
            onProgress: progress => { if (status) status.textContent = `Tested ${costRow.config.label}: ${progress.completed.toLocaleString()}/${progress.total.toLocaleString()}…`; }
          });
          const delta = Number(test?.rates?.win || 0) - Number(baseline?.rates?.win || 0);
          const nextChange = statPriorityNextTurmaDerivedChange(key, profiles.selectedTeamMember, selectedMirror, profiles.equipment);
          rows.push({
            key, label: costRow.config.label, base: costRow.base, maximum: costRow.max, investment, totalCost: cost.totalCost, costs: cost.costs, valid: true, reason: null, nextChange,
            baselineWinRate: Number(baseline?.rates?.win || 0), testWinRate: Number(test?.rates?.win || 0), deltaWinRate: delta,
            efficiency: cost.totalCost > 0 ? delta / cost.totalCost * 1000 : null,
            resultingStat: hypotheticalSelected[key], resultingLifeMax: hypotheticalSelected.lifeMax,
            resultingDamageMin: hypotheticalSelected.damageMin, resultingDamageMax: hypotheticalSelected.damageMax,
            effect: statPriorityTurmaEffectSummary(key, profiles.selectedTeamMember, hypotheticalSelected, profiles.trainingTeam),
            changedFields, sanityOk: true, testedCharacter: selectedLabel, teamSize: profiles.baseTeam.length
          });
          logStatPriorityDiagnostic("stat-test-complete", { mode, key, label: costRow.config.label, testedCharacter: selectedLabel, teamSize: profiles.baseTeam.length, baselineWinRate: Number(baseline?.rates?.win || 0), testWinRate: Number(test?.rates?.win || 0), deltaWinRate: delta, totalCost: cost.totalCost, valid: true, index: index + 1, totalTests: sortedKeys.length });
          await new Promise(resolve => requestAnimationFrame(resolve));
        }
        rows.sort((a, b) => {
          if (a.valid !== b.valid) return a.valid ? -1 : 1;
          const ae = Number.isFinite(a.efficiency) ? a.efficiency : -Infinity;
          const be = Number.isFinite(b.efficiency) ? b.efficiency : -Infinity;
          if (be !== ae) return be - ae;
          return String(a.label).localeCompare(String(b.label));
        });
        statPriorityState.result = {
          generatedAt: new Date().toISOString(), mode: "turma", characterDollId: String(profiles.profile.dollId), characterName: profiles.profile.name || null,
          investment, simulations, seed, maxRounds: 50, baseline, rows,
          player: profiles.selectedTeamMember, baseTeam: profiles.baseTeam, trainingTeam: profiles.trainingTeam, training, selectedTeamMemberId: String(profiles.selectedTeamMember.dollId)
        };
      }
      logStatPriorityDiagnostic("result-created", { mode, resultPresent: !!statPriorityState.result, rowCount: Array.isArray(statPriorityState.result?.rows) ? statPriorityState.result.rows.length : 0, generatedAt: statPriorityState.result?.generatedAt || null });
      await saveStatPriorityState("analysis-result");
      logStatPriorityDiagnostic("analysis-complete", { mode, rowCount: Array.isArray(statPriorityState.result?.rows) ? statPriorityState.result.rows.length : 0, resultPresent: !!statPriorityState.result });
      if (status) status.textContent = `Completed ${simulations.toLocaleString()} simulations per ${mode === "turma" ? "team test" : "test"}.`;
    } catch (error) {
      statPriorityState.error = error?.message || String(error);
      statPriorityState.result = null;
      logStatPriorityDiagnostic("analysis-error", { message: statPriorityState.error, stack: error?.stack || null });
      if (status) status.textContent = `Analysis error: ${statPriorityState.error}`;
    } finally {
      statPriorityState.busy = false;
      if (button) button.disabled = false;
      renderStatPriorityTab();
      logStatPriorityDiagnostic("analysis-rendered", {
        resultPresent: !!statPriorityState.result,
        resultMode: statPriorityState.result?.mode || null,
        resultGeneratedAt: statPriorityState.result?.generatedAt || null,
        resultDomPresent: !!shadow?.querySelector("#ga-stat-priority-results"),
        error: statPriorityState.error || null
      });
    }
  }

  const STAT_PRIORITY_MANUAL_CONFIG = Object.freeze({
    health: { label: "HP", unit: "HP" },
    armour: { label: "Armour", unit: "Armour" },
    damageMin: { label: "Damage Min", unit: "Damage" },
    damageMax: { label: "Damage Max", unit: "Damage" },
    criticalAttack: { label: "Critical Attack Value", unit: "points" },
    blockValue: { label: "Block Value", unit: "points" },
    hardening: { label: "Hardening", unit: "points" }
  });

  function statPriorityManualAdjustmentIsEmpty(adjustments) {
    return Object.keys(STAT_PRIORITY_MANUAL_CONFIG).every(key => !(Number(adjustments?.[key]) > 0));
  }

  function statPriorityManualCloneProfile(profile) {
    return JSON.parse(JSON.stringify(profile || {}));
  }

  function statPriorityManualApply(engine, profile, adjustments) {
    if (!engine?.applyHypotheticalCombatModifiers) {
      const next = statPriorityManualCloneProfile(profile);
      next.lifeMax = Math.max(1, Number(next.lifeMax || 1) + Number(adjustments?.health || 0));
      next.lifeCurrent = next.lifeMax;
      next.armour = Math.max(0, Number(next.armour || 0) + Number(adjustments?.armour || 0));
      next.damageMin = Math.max(1, Number(next.damageMin || 1) + Number(adjustments?.damageMin || 0));
      next.damageMax = Math.max(next.damageMin, Number(next.damageMax || next.damageMin || 1) + Number(adjustments?.damageMax || 0));
      const mods = next.itemModifiers && typeof next.itemModifiers === "object" ? next.itemModifiers : {};
      for (const key of ["criticalAttack", "blockValue", "hardening"]) {
        mods[key] = mods[key] && typeof mods[key] === "object" ? mods[key] : { flat: 0, percent: 0 };
        mods[key].flat = Number(mods[key].flat || 0) + Number(adjustments?.[key] || 0);
      }
      next.itemModifiers = mods;
      next.dinoPoints = {
        critical: Math.max(0, Math.floor(Number(next.dexterity || 0) / 10) + Number(mods.criticalAttack.flat || 0)),
        block: Math.max(0, Math.floor(Number(next.strength || 0) / 10) + Number(mods.blockValue.flat || 0)),
        avoidCritical: Math.max(0, Math.floor(Number(next.agility || 0) / 10) + Number(mods.hardening.flat || 0))
      };
      next.hypothetical = true;
      return next;
    }
    return engine.applyHypotheticalCombatModifiers(profile, adjustments);
  }

  function statPriorityManualCurrentValue(profile, key) {
    switch (key) {
      case "health": return Number(profile?.lifeMax || 0);
      case "armour": return Number(profile?.armour || 0);
      case "damageMin": return Number(profile?.damageMin || 0);
      case "damageMax": return Number(profile?.damageMax || 0);
      case "criticalAttack": return Number(profile?.dinoPoints?.critical || 0);
      case "blockValue": return Number(profile?.dinoPoints?.block || 0);
      case "hardening": return Number(profile?.dinoPoints?.avoidCritical || 0);
      default: return 0;
    }
  }

  function statPriorityManualFormatAdjustment(key, value) {
    const n = Number(value) || 0;
    if (key === "damageMin" || key === "damageMax") return `${n >= 0 ? "+" : "−"}${Math.abs(n)}`;
    return `${n >= 0 ? "+" : "−"}${Math.abs(n)}`;
  }

  function statPriorityManualResultMarkup(result) {
    if (!result) return `<div class="ga-muted">Enter one or more manual adjustments and run the analysis.</div>`;
    const baseline = Number(result?.baseline?.rates?.win || 0);
    const rows = Array.isArray(result.rows) ? result.rows : [];
    const body = rows.map(row => {
      const delta = Number(row.deltaWinRate || 0);
      const sign = delta >= 0 ? "+" : "−";
      const current = String(row.currentValue ?? "");
      const resulting = String(row.resultingValue ?? "");
      return `<tr>
        <td><strong>${esc(row.label)}</strong><small>${esc(current)} → ${esc(resulting)}</small></td>
        <td>${esc(row.adjustmentText)}</td>
        <td>${row.testWinRate.toFixed(2)}%</td>
        <td><strong>${sign}${Math.abs(delta).toFixed(2)}</strong> pp</td>
      </tr>`;
    }).join("");
    let combined = "";
    if (result.combined) {
      const delta = Number(result.combined.deltaWinRate || 0);
      const sign = delta >= 0 ? "+" : "−";
      combined = `<div class="ga-manual-combined"><div class="ga-manual-combined-title">Combined adjustment</div><div class="ga-manual-combined-grid">
        <span>Win rate</span><strong>${baseline.toFixed(2)}% → ${result.combined.testWinRate.toFixed(2)}%</strong>
        <span>Change</span><strong>${sign}${Math.abs(delta).toFixed(2)} pp</strong>
        <span>HP</span><strong>${fmtNum(result.combined.profile.lifeMax)}</strong>
        <span>Damage</span><strong>${fmtNum(result.combined.profile.damageMin)}–${fmtNum(result.combined.profile.damageMax)}</strong>
        <span>Armour</span><strong>${fmtNum(result.combined.profile.armour)}</strong>
        <span>Crit / Block / Hardening</span><strong>${fmtNum(result.combined.profile.dinoPoints.critical)} / ${fmtNum(result.combined.profile.dinoPoints.block)} / ${fmtNum(result.combined.profile.dinoPoints.avoidCritical)}</strong>
      </div></div>`;
    }
    const characterLabel = result.characterName || (result.characterDollId ? `Character ${result.characterDollId}` : "Saved character");
    return `<div class="ga-stat-priority-summary">
      <div class="ga-stat"><span>Character</span><strong>${esc(characterLabel)}</strong></div>
      <div class="ga-stat"><span>Baseline win rate</span><strong>${baseline.toFixed(2)}%</strong></div>
      <div class="ga-stat"><span>Simulations / test</span><strong>${fmtNum(result.simulations)}</strong></div>
      <div class="ga-stat"><span>Seed</span><strong>${fmtNum(result.seed)}</strong></div>
      <div class="ga-stat"><span>Tests</span><strong>${fmtNum(rows.length)}</strong></div>
    </div>
    ${combined}
    <div class="ga-table-wrap"><table class="ga-stat-priority-table"><thead><tr><th>Adjustment</th><th>Added</th><th>Win rate</th><th>Change</th></tr></thead><tbody>${body}</tbody></table></div>`;
  }

  async function runStatPriorityManualAnalysis() {
    if (statPriorityState.busy) return;
    const button = shadow?.querySelector("#ga-stat-priority-manual-run");
    const status = shadow?.querySelector("#ga-stat-priority-manual-status");
    const adjustments = Object.fromEntries(Object.keys(STAT_PRIORITY_MANUAL_CONFIG).map(key => [key, Math.max(0, Number(statPriorityState.manualAdjustments?.[key]) || 0)]));
    if (statPriorityManualAdjustmentIsEmpty(adjustments)) {
      statPriorityState.error = "Enter at least one manual adjustment greater than zero.";
      if (status) status.textContent = statPriorityState.error;
      renderStatPriorityTab();
      return;
    }
    statPriorityState.busy = true;
    statPriorityState.error = null;
    statPriorityState.manualResult = null;
    if (button) button.disabled = true;
    if (status) status.textContent = "Loading saved character profile…";
    try {
      await loadCharacterProfileStore();
      const mode = statPriorityMode();
      const selectedProfile = selectedStatPriorityCharacterProfile(mode);
      if (!selectedProfile) throw new Error("No saved character profile is available. Use Capture All Characters first.");
      const missingProfileData = characterProfileMissingSimulationData(selectedProfile);
      if (missingProfileData.length) throw new Error(`Saved profile for ${characterDisplayName(selectedProfile)} is missing ${missingProfileData.join(", ")}. Capture All Characters again to refresh the saved profile.`);
      const engine = simulatorEngine();
      if (!engine) throw new Error("Combat simulator engine unavailable.");
      const training = await fetchStatPriorityTraining(selectedProfile);
      const profiles = buildStatPriorityProfiles(selectedProfile, training, mode);
      const basePlayer = profiles.basePlayer;
      const simulations = globalSimulationCount();
      const seed = Math.max(1, Math.floor(Number(statPriorityState.seed) || 1));
      const options = mode === "arena" ? { simulations, seed, lifeMode: "full", maxRounds: ARENA_SIMULATION_ROUNDS } : { simulations, seed, maxRounds: 50 };
      const runTeamOrArena = async (playerProfile, label = "") => {
        if (mode === "arena") return engine.simulateBatch({ player: playerProfile, enemy: profiles.dummy, ...options });
        const testTeam = statPriorityHypotheticalTeam(engine, profiles, playerProfile);
        return engine.simulateTurmaBatchAsync({ attackers: testTeam, defenders: profiles.trainingTeam, ...options, chunkSize: 25,
          onProgress: progress => { if (status) status.textContent = `${label || "Simulation"} ${progress.completed.toLocaleString()}/${progress.total.toLocaleString()}…`; }
        });
      };
      if (status) status.textContent = `Running ${mode === "turma" ? "Circus Turma team" : "Arena"} baseline (${simulations.toLocaleString()})…`;
      await new Promise(resolve => requestAnimationFrame(resolve));
      const baseline = await runTeamOrArena(basePlayer, "Baseline");
      const rows = [];
      const testDefinitions = [];
      for (const key of Object.keys(STAT_PRIORITY_MANUAL_CONFIG)) {
        if (key === "damageMin" || key === "damageMax") continue;
        const value = adjustments[key];
        if (value > 0) testDefinitions.push({ key, label: STAT_PRIORITY_MANUAL_CONFIG[key].label, adjustment: { [key]: value }, adjustmentText: statPriorityManualFormatAdjustment(key, value) });
      }
      if (adjustments.damageMin > 0 || adjustments.damageMax > 0) {
        testDefinitions.push({
          key: "damage", label: "Damage", adjustment: { damageMin: adjustments.damageMin, damageMax: adjustments.damageMax },
          adjustmentText: `${statPriorityManualFormatAdjustment("damageMin", adjustments.damageMin)}–${statPriorityManualFormatAdjustment("damageMax", adjustments.damageMax)}`
        });
      }
      for (let index = 0; index < testDefinitions.length; index++) {
        const definition = testDefinitions[index];
        const profile = statPriorityManualApply(engine, basePlayer, definition.adjustment);
        profile.lifeCurrent = profile.lifeMax;
        if (profile.damageMax < profile.damageMin) throw new Error(`${definition.label} adjustment creates an invalid damage range (${profile.damageMin}–${profile.damageMax}).`);
        if (mode === "turma") {
          profile.dollId = basePlayer.dollId;
          profile.turmaRole = basePlayer.turmaRole;
          profile.turmaThreat = basePlayer.turmaThreat;
          profile.criticalHealing = basePlayer.criticalHealing;
        }
        const test = await runTeamOrArena(profile, `Test ${definition.label}`);
        const isDamage = definition.key === "damage";
        rows.push({
          key: definition.key, label: definition.label,
          currentValue: isDamage ? `${fmtNum(basePlayer.damageMin)}–${fmtNum(basePlayer.damageMax)}` : fmtNum(statPriorityManualCurrentValue(basePlayer, definition.key)),
          resultingValue: isDamage ? `${fmtNum(profile.damageMin)}–${fmtNum(profile.damageMax)}` : fmtNum(statPriorityManualCurrentValue(profile, definition.key)),
          adjustment: definition.adjustment, adjustmentText: definition.adjustmentText,
          testWinRate: Number(test?.rates?.win || 0), deltaWinRate: Number(test?.rates?.win || 0) - Number(baseline?.rates?.win || 0)
        });
        if (status) status.textContent = `Tested ${definition.label} (${index + 1}/${testDefinitions.length})…`;
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
      const combinedProfile = statPriorityManualApply(engine, basePlayer, adjustments);
      combinedProfile.lifeCurrent = combinedProfile.lifeMax;
      if (combinedProfile.damageMax < combinedProfile.damageMin) throw new Error("Combined adjustments create an invalid damage range.");
      if (mode === "turma") {
        combinedProfile.dollId = basePlayer.dollId;
        combinedProfile.turmaRole = basePlayer.turmaRole;
        combinedProfile.turmaThreat = basePlayer.turmaThreat;
        combinedProfile.criticalHealing = basePlayer.criticalHealing;
      }
      const combinedTest = await runTeamOrArena(combinedProfile, "Combined");
      const result = {
        generatedAt: new Date().toISOString(), mode, simulations, seed,
        maxRounds: mode === "turma" ? 50 : ARENA_SIMULATION_ROUNDS,
        baseline, adjustments, rows,
        combined: {
          testWinRate: Number(combinedTest?.rates?.win || 0),
          deltaWinRate: Number(combinedTest?.rates?.win || 0) - Number(baseline?.rates?.win || 0),
          profile: combinedProfile
        },
        player: basePlayer,
        dummy: mode === "arena" ? profiles.dummy : null,
        baseTeam: mode === "turma" ? profiles.baseTeam : null,
        trainingTeam: mode === "turma" ? profiles.trainingTeam : null,
        characterDollId: String(profiles.profile.dollId),
        characterName: profiles.profile.name || null
      };
      rows.sort((a, b) => b.deltaWinRate - a.deltaWinRate || String(a.label).localeCompare(String(b.label)));
      statPriorityState.manualResult = result;
      logStatPriorityDiagnostic("manual-result-created", { mode, rowCount: rows.length, generatedAt: result.generatedAt });
      await saveStatPriorityState("manual-result");
      if (status) status.textContent = `Completed ${simulations.toLocaleString()} simulations per manual test.`;
    } catch (error) {
      statPriorityState.error = error?.message || String(error);
      statPriorityState.manualResult = null;
      if (status) status.textContent = `Analysis error: ${statPriorityState.error}`;
    } finally {
      statPriorityState.busy = false;
      if (button) button.disabled = false;
      renderStatPriorityTab();
    }
  }

  function statPriorityResultMarkup(result) {
    if (!result) return `<div class="ga-muted">Run an analysis to calculate simulated combat improvement per gold.</div>`;
    const baseline = Number(result?.baseline?.rates?.win || 0);
    const rows = Array.isArray(result.rows) ? result.rows : [];
    const body = rows.map((row, index) => {
      const delta = row.valid ? statPriorityFormatDelta(row.deltaWinRate, 2) : "—";
      const efficiency = row.valid && Number.isFinite(row.efficiency) ? `${row.efficiency >= 0 ? "+" : "−"}${Math.abs(row.efficiency).toFixed(3)}` : "—";
      const test = row.valid ? `${row.testWinRate.toFixed(2)}%` : row.reason || "Unavailable";
      const cost = row.valid ? statPriorityFormatGold(row.totalCost) : "—";
      const cap = `${fmtNum(row.base)} → ${fmtNum(row.base + row.investment)} base`;
      const total = row.valid && Number.isFinite(row.resultingStat) ? ` · ${fmtNum(row.resultingStat)} total` : "";
      const effect = row.valid ? row.effect || "No derived-effect summary" : "—";
      const nextThreshold = row.valid && row.nextChange?.changed ? `+${row.nextChange.points} point${row.nextChange.points === 1 ? "" : "s"} · base ${fmtNum(row.nextChange.base)}` : (row.valid ? "No change within +100" : "—");
      const sanity = row.valid && row.sanityOk !== false ? "✓" : "⚠";
      const audit = row.valid ? (Array.isArray(row.changedFields) && row.changedFields.length ? row.changedFields.join(" · ") : "No profile fields changed") : "Unavailable";
      return `<tr>
        <td><strong>${esc(row.label)}</strong><small>${esc(cap + total)}</small></td>
        <td>${esc(cost)}</td>
        <td>${esc(effect)}</td>
        <td><small>${esc(nextThreshold)}</small></td>
        <td>${row.valid ? `${baseline.toFixed(2)}% → ${test}` : test}</td>
        <td>${esc(delta)} pp</td>
        <td><strong>${esc(efficiency)}</strong><small>pp / 1,000g</small></td>
        <td title="${esc(row.valid ? `Hypothetical profile sanity check passed · ${audit}` : "Unavailable")}">${sanity}</td>
      </tr>`;
    }).join("");
    const characterLabel = result.characterName || (result.characterDollId ? `Character ${result.characterDollId}` : "Saved character");
    return `<div class="ga-stat-priority-summary">
      <div class="ga-stat"><span>Character</span><strong>${esc(characterLabel)}</strong></div>
      <div class="ga-stat"><span>Baseline win rate</span><strong>${baseline.toFixed(2)}%</strong></div>
      <div class="ga-stat"><span>Investment tested</span><strong>+${fmtNum(result.investment)}</strong></div>
      <div class="ga-stat"><span>Simulations / test</span><strong>${fmtNum(result.simulations)}</strong></div>
      <div class="ga-stat"><span>Seed</span><strong>${fmtNum(result.seed)}</strong></div>
    </div>
    <div class="ga-table-wrap"><table class="ga-stat-priority-table"><thead><tr><th>Stat</th><th>Gold</th><th>Direct effect</th><th>Next change</th><th>Win rate</th><th>Change</th><th>Efficiency</th><th>Check</th></tr></thead><tbody>${body}</tbody></table></div>`;
  }

  function statPriorityTeamMarkup(team, title) {
    const rows = (Array.isArray(team) ? team : []).map(member => `
      <div class="ga-sim-profile">
        <div class="ga-sim-profile-title">${esc(member.name || `Character ${member.dollId || "?"}`)} <span class="ga-muted">· ${esc(statPriorityRoleLabel(member.turmaRole))}</span></div>
        <div class="ga-sim-profile-grid">
          <span>HP ${fmtNum(member.lifeMax)}</span>
          <span>Damage ${fmtNum(member.damageMin)}–${fmtNum(member.damageMax)}</span>
          <span>STR ${fmtNum(member.strength)} · DEX ${fmtNum(member.dexterity)} · AGI ${fmtNum(member.agility)}</span>
          <span>CHA ${fmtNum(member.charisma)} · INT ${fmtNum(member.intelligence)}</span>
        </div>
      </div>`).join("");
    return `<div><div class="ga-sim-profile-title" style="margin-bottom:6px">${esc(title)}</div><div class="ga-sim-profile-grid">${rows || `<span class="ga-muted">No active team members.</span>`}</div></div>`;
  }

  function renderStatPriorityTab() {
    const root = shadow?.querySelector("#ga-stat-priority-tab-content");
    if (!root) return;
    const mode = statPriorityMode();
    const training = statPriorityState.training;
    const result = statPriorityState.result;
    const manualResult = statPriorityState.manualResult;
    const trainingSummary = training ? `Training data: ${new Date(training.capturedAt).toLocaleString()} · cost multiplier ${(training.discountFactor * 100).toFixed(2)}%` : "Training data will be fetched when analysis starts.";
    const rows = training?.rows || [];
    const costPreview = rows.length ? rows.map(row => `<span>${esc(row.config.label)} ${esc(statPriorityFormatGold(row.nextCost))}</span>`).join("") : `<span class="ga-muted">No training data loaded.</span>`;
    const currentProfile = manualResult?.player || result?.player || selectedStatPriorityCharacterProfile(mode);
    const selectedProfile = selectedStatPriorityCharacterProfile(mode);
    const selectedProfileLabel = selectedProfile ? characterDisplayName(selectedProfile) : "No saved character profile";
    const selectedProfileUpdated = selectedProfile?.capturedAt ? new Date(selectedProfile.capturedAt).toLocaleString() : "never";
    const completeRoster = (mode === "turma" ? turmaCharacterProfilesList() : characterProfilesList()).filter(profile => characterProfileMissingSimulationData(profile).length === 0);
    const rosterControls = completeRoster.map(profile => {
      const id = String(profile.dollId);
      const role = statPriorityTurmaRoleForProfile(profile);
      return `<label class="ga-field"><span>${esc(profile.name || `Character ${id}`)}</span><select data-stat-priority-role="${esc(id)}"><option value="dps"${role === "dps" ? " selected" : ""}>DPS</option><option value="tank"${role === "tank" ? " selected" : ""}>Tank</option><option value="healer"${role === "healer" ? " selected" : ""}>Healer</option><option value="leave"${role === "leave" ? " selected" : ""}>Leave</option></select></label>`;
    }).join("");
    const manualInputs = Object.keys(STAT_PRIORITY_MANUAL_CONFIG).map(key => {
      const config = STAT_PRIORITY_MANUAL_CONFIG[key];
      const current = currentProfile ? statPriorityManualCurrentValue(currentProfile, key) : null;
      const value = Number(statPriorityState.manualAdjustments?.[key]) || 0;
      const currentText = current != null ? ` · current ${fmtNum(current)}` : "";
      return `<label class="ga-field"><span>${esc(config.label)}${esc(currentText)}</span><input data-stat-priority-manual="${esc(key)}" type="number" min="0" step="1" value="${esc(value)}"></label>`;
    }).join("");
    const modeDescription = mode === "turma"
      ? "Circus Turma mode runs a full team-vs-team simulation. The selected saved Turma fighter receives the hypothetical investment, every other saved Turma member stays frozen, and the opponent side is a frozen mirror of the same saved Turma team. The account main character (doll 1) is excluded automatically regardless of role. This is a controlled training matchup, not a captured enemy team."
      : "Arena mode runs the main character only against a single Arena-style training dummy. It does not use mercenaries or Circus Turma team mechanics.";
    const turmaRoster = mode === "turma" ? completeRoster : [];
    const selectedTurmaIndex = mode === "turma" && selectedProfile ? turmaRoster.findIndex(profile => String(profile.dollId) === String(selectedProfile.dollId)) : -1;
    const characterSelector = mode === "turma" ? `<div class="ga-character-switcher" aria-label="Stat Priority character selector">
        <button class="ga-character-cycle" data-stat-priority-character-cycle="-1" type="button" aria-label="Previous character"${selectedTurmaIndex <= 0 ? " disabled" : ""}>‹</button>
        <div class="ga-character-current">${esc(selectedProfileLabel)}${selectedTurmaIndex >= 0 ? ` · ${selectedTurmaIndex + 1}/${turmaRoster.length}` : ""} · Captured ${esc(selectedProfileUpdated)}</div>
        <button class="ga-character-cycle" data-stat-priority-character-cycle="1" type="button" aria-label="Next character"${selectedTurmaIndex < 0 || selectedTurmaIndex >= turmaRoster.length - 1 ? " disabled" : ""}>›</button>
      </div>` : `<div class="ga-muted" style="margin-top:8px">Arena optimizer always uses the saved main character (doll 1): <strong>${esc(selectedProfileLabel)}</strong>.</div>`;
    const teamRoleControls = mode === "turma" ? `<section class="ga-subsection" style="margin-top:10px"><div class="ga-card-head"><div><h3 class="ga-subsection-title">Turma team roles</h3><div class="ga-muted">Saved roles are used by default. Override them here for the simulation; changes do not recapture stats or equipment.</div></div></div><div class="ga-field-grid ga-stat-priority-manual-grid">${rosterControls || `<span class="ga-muted">No complete saved team profiles.</span>`}</div></section>` : "";
    const resultProfiles = result?.mode === "turma" && result?.baseTeam ? `<section class="ga-card"><div class="ga-card-head"><div><h2>Simulation Teams</h2><div class="ga-muted">The left side is your saved team. The right side is the frozen mirror used for controlled comparisons; only the selected fighter changes between tests.</div></div></div><div class="ga-sim-profile-three">${statPriorityTeamMarkup(result.baseTeam, "Your saved team")}${statPriorityTeamMarkup(result.trainingTeam || [], "Frozen mirror team")}<div class="ga-sim-profile"><div class="ga-sim-profile-title">Cost model</div><div class="ga-sim-profile-grid"><span>Cost multiplier ${(result.training?.discountFactor * 100 || 0).toFixed(2)}%</span><span>Rounds ${result.maxRounds}</span><span>Investment +${result.investment}</span></div></div></div></section>` : (result?.player && result?.dummy ? `<section class="ga-card"><div class="ga-card-head"><div><h2>Simulation Profiles</h2><div class="ga-muted">Both sides start at full/max HP. The dummy remains frozen across every hypothetical test.</div></div></div><div class="ga-sim-profile-three">${simulatorProfileMarkup("Player baseline", result.player)}${simulatorProfileMarkup("Training dummy", result.dummy)}<div class="ga-sim-profile"><div class="ga-sim-profile-title">Cost model</div><div class="ga-sim-profile-grid"><span>Cost multiplier ${(result.training.discountFactor * 100).toFixed(2)}%</span><span>Rounds ${result.maxRounds}</span><span>Investment +${result.investment}</span></div></div></div></section>` : "");
    root.innerHTML = `<section class="ga-card">
      <div class="ga-card-head"><div><h2>Stat Upgrade Priority</h2><div class="ga-muted">Uses the selected SAVED character profile and its saved equipment. No live stats or equipment are captured when analysis starts. ${esc(modeDescription)}</div></div></div>
      <div class="ga-field-grid ga-stat-priority-controls">
        <label class="ga-field"><span>Combat model</span><select id="ga-stat-priority-mode"><option value="turma"${mode === "turma" ? " selected" : ""}>Circus Turma · Team battle</option><option value="arena"${mode === "arena" ? " selected" : ""}>Arena · Main character</option></select></label>
        <label class="ga-field"><span>Points per test</span><input id="ga-stat-priority-investment" type="number" min="1" max="100" step="1" value="${esc(statPriorityState.investment)}"></label>
        <div class="ga-field"><span>Simulations per test</span><strong>${fmtNum(globalSimulationCount())}</strong></div>
        <label class="ga-field"><span>Seed</span><input id="ga-stat-priority-seed" type="number" min="1" step="1" value="${esc(statPriorityState.seed)}"></label>
      </div>
      ${characterSelector}
      ${teamRoleControls}
      <div class="ga-actions-row" style="margin-top:8px"><button class="ga-primary" id="ga-stat-priority-run" type="button"${statPriorityState.busy ? " disabled" : ""}>Analyze Stat Priority</button><button class="ga-secondary" data-stat-priority-preset="1" type="button">+1</button><button class="ga-secondary" data-stat-priority-preset="5" type="button">+5</button><button class="ga-secondary" data-stat-priority-preset="10" type="button">+10</button><span class="ga-statusline" id="ga-stat-priority-status">${esc(statPriorityState.error || trainingSummary)}</span></div>
      <div class="ga-stat-priority-cost-preview" style="margin-top:8px"><strong>Current next-point costs</strong>${costPreview}</div>
    </section>
    ${result ? `<section class="ga-card" id="ga-stat-priority-results"><div class="ga-card-head"><div><h2>Stat Priority Results · ${esc(result.mode === "turma" ? "Circus Turma team model" : "Arena main-character model")}</h2><div class="ga-muted">Each row changes one base-stat investment on the selected fighter and reruns the ${result.mode === "turma" ? "entire team battle" : "frozen one-on-one battle"}. The opponent side remains frozen.</div></div></div>${statPriorityResultMarkup(result)}</section>` : ""}
    ${resultProfiles}
    <section class="ga-card">
      <div class="ga-card-head"><div><h2>Manual Combat Adjustments</h2><div class="ga-muted">${esc(mode === "turma" ? "Adjustments are applied to the selected team member, then the entire Circus Turma team is simulated against the frozen mirror team." : "Adjustments are applied to the saved main character and simulated against the frozen Arena training dummy.")} Healing is intentionally excluded.</div></div></div>
      <div class="ga-field-grid ga-stat-priority-manual-grid">${manualInputs}</div>
      <div class="ga-actions-row" style="margin-top:8px"><button class="ga-primary" id="ga-stat-priority-manual-run" type="button"${statPriorityState.busy ? " disabled" : ""}>Analyze Manual Adjustments</button><span class="ga-statusline" id="ga-stat-priority-manual-status">${esc(statPriorityState.error || "Enter the hypothetical values you want to test.")}</span></div>
    </section>
    ${manualResult ? `<section class="ga-card" id="ga-stat-priority-manual-results"><div class="ga-card-head"><div><h2>Manual Adjustment Results · ${esc(manualResult.mode === "turma" ? "Circus Turma team model" : "Arena main-character model")}</h2><div class="ga-muted">Win-rate change is shown in percentage points. The same deterministic seed is used for the baseline, individual tests, and combined scenario.</div></div></div>${statPriorityManualResultMarkup(manualResult)}</section>` : ""}`;
    const renderedSignature = result ? `${result.mode}:${result.generatedAt || "present"}` : (manualResult ? `manual:${manualResult.mode}:${manualResult.generatedAt || "present"}` : "none");
    if (renderedSignature !== statPriorityLastRenderedSignature) {
      statPriorityLastRenderedSignature = renderedSignature;
      logStatPriorityDiagnostic("result-dom-rendered", {
        resultPresent: !!result,
        resultMode: result?.mode || null,
        resultGeneratedAt: result?.generatedAt || null,
        resultDomPresent: !!root.querySelector("#ga-stat-priority-results"),
        manualResultPresent: !!manualResult,
        manualResultDomPresent: !!root.querySelector("#ga-stat-priority-manual-results")
      });
    }
    root.querySelectorAll("[data-stat-priority-character-cycle]").forEach(btn => btn.addEventListener("click", () => void selectStatPriorityCharacterByOffset(Number(btn.dataset.statPriorityCharacterCycle || 0))));
    root.querySelectorAll("[data-stat-priority-role]").forEach(select => select.addEventListener("change", async event => {
      const id = String(event.target.getAttribute("data-stat-priority-role") || "");
      const role = String(event.target.value || "dps").toLowerCase();
      statPriorityState.turmaRoles = { ...(statPriorityState.turmaRoles || {}), [id]: ["dps", "tank", "healer", "leave"].includes(role) ? role : "dps" };
      statPriorityState.result = null;
      statPriorityState.manualResult = null;
      statPriorityState.error = null;
      await saveStatPriorityState();
      renderStatPriorityTab();
    }));
    const modeInput = root.querySelector("#ga-stat-priority-mode");
    const inv = root.querySelector("#ga-stat-priority-investment");
    const seed = root.querySelector("#ga-stat-priority-seed");
    modeInput?.addEventListener("change", async event => {
      statPriorityState.mode = event.target.value === "arena" ? "arena" : "turma";
      if (statPriorityState.mode === "turma") {
        const roster = turmaCharacterProfilesList();
        const validSelected = roster.some(profile => String(profile.dollId) === String(statPriorityState.selectedCharacterDollId));
        if (!validSelected) {
          const globallySelected = roster.find(profile => String(profile.dollId) === String(selectedCharacterDollId));
          statPriorityState.selectedCharacterDollId = String((globallySelected || roster[0] || {}).dollId || "");
        }
      }
      statPriorityState.result = null;
      statPriorityState.manualResult = null;
      statPriorityState.training = null;
      statPriorityState.error = null;
      await saveStatPriorityState();
      renderStatPriorityTab();
    });
    const clearResults = () => { statPriorityState.result = null; statPriorityState.manualResult = null; };
    inv?.addEventListener("change", async event => { statPriorityState.investment = Math.max(1, Math.min(100, Math.floor(Number(event.target.value) || 1))); clearResults(); await saveStatPriorityState(); renderStatPriorityTab(); });
    seed?.addEventListener("change", async event => { statPriorityState.seed = Math.max(1, Math.floor(Number(event.target.value) || 1)); clearResults(); invalidateAuctionComparisons("stat-priority-seed-changed"); await saveStatPriorityState(); renderStatPriorityTab(); renderAuctionList(); });
    root.querySelectorAll("[data-stat-priority-manual]").forEach(input => input.addEventListener("change", async event => {
      const key = event.target.getAttribute("data-stat-priority-manual");
      statPriorityState.manualAdjustments = { ...statPriorityState.manualAdjustments, [key]: Math.max(0, Number(event.target.value) || 0) };
      statPriorityState.manualResult = null;
      statPriorityState.error = null;
      await saveStatPriorityState();
      renderStatPriorityTab();
    }));
    root.querySelectorAll("[data-stat-priority-preset]").forEach(button => button.addEventListener("click", async event => {
      statPriorityState.investment = Math.max(1, Math.min(100, Number(event.currentTarget.getAttribute("data-stat-priority-preset")) || 1));
      statPriorityState.result = null;
      statPriorityState.manualResult = null;
      await saveStatPriorityState();
      renderStatPriorityTab();
    }));
    root.querySelector("#ga-stat-priority-run")?.addEventListener("click", runStatPriorityAnalysis);
    root.querySelector("#ga-stat-priority-manual-run")?.addEventListener("click", runStatPriorityManualAnalysis);
  }

  function simulatorReportKey(record) {
    if (!record) return "";
    return `${String(record.reportType || "combat")}::${String(record.reportId || "")}`;
  }

  function arenaAnalysisSimulatorReports() {
    return Object.values(arenaOpponentAnalysisStore?.opponents || {})
      .filter(row => row?.ok && row?.profile)
      .map(row => ({
        reportType: "arena-profile",
        reportId: `arena-profile:${row.key}`,
        capturedAt: row.analyzedAt || row.source?.capturedAt || arenaOpponentAnalysisStore?.updatedAt || null,
        arenaAnalysisProfile: true,
        arenaKey: row.key,
        source: row.source || null,
        participants: {
          attacker: {
            name: arenaOpponentAnalysisStore?.playerProfile?.name || "Main Character",
            level: arenaOpponentAnalysisStore?.playerProfile?.stats?.level ?? arenaOpponentAnalysisStore?.playerProfile?.profile?.level ?? null
          },
          defender: { ...row.profile, name: row.name || row.profile?.name || "Opponent" }
        }
      }));
  }

  function simulatorReports() {
    const expedition = validatedCombatReports(Array.isArray(combatCaptureStore?.reports) ? combatCaptureStore.reports : []);
    const arena = validatedCombatReports(Array.isArray(arenaCombatStore?.reports) ? arenaCombatStore.reports : []);
    const arenaProfiles = arenaAnalysisSimulatorReports();
    return [...expedition, ...arena, ...arenaProfiles]
      .filter((record, index, all) => simulatorReportKey(record) && all.findIndex(item => simulatorReportKey(item) === simulatorReportKey(record)) === index)
      .sort((a, b) => String(b.capturedAt || "").localeCompare(String(a.capturedAt || "")));
  }

  function selectedSimulatorReport() {
    const reports = simulatorReports();
    const selected = reports.find(record => simulatorReportKey(record) === String(simulatorState.reportId))
      || reports.find(record => String(record?.reportId) === String(simulatorState.reportId));
    return selected || reports[0] || null;
  }

  function auctionItemsForSlot(slot) {
    const category = SIMULATOR_EQUIPMENT_CATEGORIES[slot];
    if (!category) return [];
    return combinedAuctionItems(currentAuctionStore).filter(item => String(item?.categoryValue ?? item?.auctionCategoryValue ?? "") === category);
  }

  function simulatorItemKey(item) {
    if (!item) return "";
    return String(item.listingId || item.itemHash || item.itemId || `${item.categoryValue || "x"}:${item.auctionIndex ?? "x"}`);
  }

  function simulatorItemLabel(item) {
    const name = normalize(item?.name || "Unknown item");
    const price = Number.isFinite(Number(item?.auctionPrice)) ? ` · ${Number(item.auctionPrice).toLocaleString()}g` : "";
    return `${name}${price}`;
  }

  function simulatorEquipmentSelection(slot, currentItem) {
    const selected = simulatorState.equipmentSelections?.[slot];
    if (!selected || selected === "current") return currentItem || null;
    const item = auctionItemsForSlot(slot).find(candidate => simulatorItemKey(candidate) === selected);
    return item || currentItem || null;
  }

  function selectedSimulatorEquipment(currentEquipment) {
    const replacements = {};
    for (const slot of Object.keys(SIMULATOR_SLOT_LABELS)) {
      replacements[slot] = simulatorEquipmentSelection(slot, currentEquipment?.[slot] || null);
    }
    return replacements;
  }

  function simulatorPlayerBaseStats() {
    const main = characterProfileStore.characters?.["1"] || null;
    const live = currentStatsAreComplete(main?.stats) ? { ...(main.stats || {}), name: main.name || main.stats?.name || "Main Character" } : null;
    const baseStats = characterProfileBaseStats(main);
    return { live, baseStats, profile: main };
  }

  function augmentLiveStatsFromCurrentCombatReport(state) {
    if (!isCombatReportPage() || !state || typeof state !== "object") return state;
    const attackerContainer = document.querySelector("#attackerCharStats1");
    if (!attackerContainer) return state;
    const combatStats = parseCombatantStats(attackerContainer, "attacker");
    if (!combatStats || !Number.isFinite(Number(combatStats.lifeMax))) return state;
    const next = { ...state };
    const copyKeys = [
      "level", "strength", "dexterity", "agility", "constitution", "charisma", "intelligence",
      "armour", "armourMin", "armourMax", "damageMin", "damageMax", "damageRange",
      "hitChance", "doubleHit", "criticalChance", "blockChance", "criticalAvoidance", "healing", "criticalHealingValue"
    ];
    for (const key of copyKeys) {
      if (combatStats[key] != null && (typeof combatStats[key] !== "number" || Number.isFinite(combatStats[key]))) next[key] = combatStats[key];
    }
    next.healthCurrent = combatStats.lifeCurrent;
    next.healthMax = combatStats.lifeMax;
    next.lifeCurrent = combatStats.lifeCurrent;
    next.lifeMax = combatStats.lifeMax;
    next.combatDetails = {
      ...(next.combatDetails || {}),
      health: { ...(next.combatDetails?.health || {}), current: `${combatStats.lifeCurrent ?? "?"} / ${combatStats.lifeMax}` },
      armour: { ...(next.combatDetails?.armour || {}), current: combatStats.armour },
      damage: { ...(next.combatDetails?.damage || {}), current: combatStats.damageRange }
    };
    return next;
  }

  function buildSimulatorProfiles() {
    const engine = simulatorEngine();
    const report = selectedSimulatorReport();
    if (!engine || !report) return null;
    const { live, baseStats, profile } = simulatorPlayerBaseStats();
    const equipmentSnapshot = profile?.equipment || savedEquipment?.equipment || currentEquipment || {};
    if (!live) return null;
    const enemyStats = report.participants?.defender || {};
    const playerStats = { ...live, name: live?.name || report.participants?.attacker?.name || "Player" };
    const currentProfile = engine.buildProfileFromSnapshot(equipmentSnapshot, playerStats, {
      baseStats,
      opponentStats: enemyStats,
      name: playerStats.name,
      recalculateDerived: false
    });
    const hypotheticalEquipment = selectedSimulatorEquipment(equipmentSnapshot);
    const overrides = {};
    for (const key of SIMULATOR_STAT_KEYS) {
      const value = Number(simulatorState.statOverrides?.[key]);
      if (Number.isFinite(value)) overrides[key] = value;
    }
    const hasStatOverrides = Object.keys(overrides).length > 0;
    const hasEquipmentChanges = Object.keys(SIMULATOR_SLOT_LABELS).some(slot => simulatorItemKey(hypotheticalEquipment?.[slot]) !== simulatorItemKey(equipmentSnapshot?.[slot]));

    let hypotheticalProfile = currentProfile;
    if (hasEquipmentChanges) {
      try {
        hypotheticalProfile = engine.projectEquipment({
          currentEquipmentSnapshot: equipmentSnapshot,
          hypotheticalEquipmentSnapshot: hypotheticalEquipment,
          liveStats: playerStats,
          opponentStats: enemyStats
        });
        hypotheticalProfile.name = currentProfile.name;
      } catch (_) {
        hypotheticalProfile = currentProfile;
      }
    } else {
      hypotheticalProfile = JSON.parse(JSON.stringify(currentProfile));
    }
    if (hasStatOverrides) hypotheticalProfile = engine.applyHypotheticalStats(hypotheticalProfile, overrides, enemyStats, hypotheticalEquipment);
    const enemyProfile = engine.buildProfile({
      stats: enemyStats,
      name: enemyStats.name || "Enemy",
      opponentStats: playerStats,
      recalculateDerived: false
    });
    return { report, currentEquipment: equipmentSnapshot, hypotheticalEquipment, currentProfile, hypotheticalProfile, enemyProfile, hasEquipmentChanges, hasStatOverrides };
  }

  function simulatorProfileDifference(currentProfile, hypotheticalProfile) {
    const fields = ["strength", "dexterity", "agility", "constitution", "charisma", "intelligence", "lifeMax", "armour", "damageMin", "damageMax", "hitChance", "doubleHit", "criticalChance", "blockChance", "criticalAvoidance"];
    return fields.some(key => Math.abs(Number(currentProfile?.[key] || 0) - Number(hypotheticalProfile?.[key] || 0)) > 1e-9);
  }

  function simulatorMetricRows(batch) {
    if (!batch) return "";
    return [
      ["Win rate", `${formatCombatMetric(batch.rates.win, 1, "%")}`],
      ["Average rounds", formatCombatMetric(batch.averages.rounds, 2)],
      ["Average damage dealt", formatCombatMetric(batch.averages.playerDamage, 1)],
      ["Average damage taken", formatCombatMetric(batch.averages.enemyDamage, 1)],
      ["Average HP remaining", formatCombatMetric(batch.averages.playerLifeRemaining, 1)],
      ["Hit rate", formatCombatMetric(batch.rates.playerHit, 1, "%")],
      ["Critical rate", formatCombatMetric(batch.rates.playerCritical, 1, "%")],
      ["Double-attack rate", formatCombatMetric(batch.rates.playerDoubleAttack, 1, "%")]
    ].map(([label, value]) => `<div class="ga-row"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join("");
  }

  function simulatorProfileMarkup(label, profile, extraClass = "") {
    if (!profile) return `<div class="ga-muted">${esc(label)} unavailable.</div>`;
    return `<div class="ga-sim-profile ${extraClass}">
      <div class="ga-sim-profile-title">${esc(label)}</div>
      <div class="ga-sim-profile-grid">
        <span>STR ${fmtNum(profile.strength)}</span><span>DEX ${fmtNum(profile.dexterity)}</span><span>AGI ${fmtNum(profile.agility)}</span>
        <span>CON ${fmtNum(profile.constitution)}</span><span>CHA ${fmtNum(profile.charisma)}</span><span>INT ${fmtNum(profile.intelligence)}</span>
        <span>HP ${fmtNum(profile.lifeMax)}</span><span>Armour ${fmtNum(profile.armour)}</span><span>Damage ${fmtNum(profile.damageMin)}–${fmtNum(profile.damageMax)}</span>
        <span>Hit ${fmtNum(profile.hitChance)}%</span><span>Double ${fmtNum(profile.doubleHit)}%</span><span>Crit ${fmtNum(profile.criticalChance)}%</span>
        <span>Block ${fmtNum(profile.blockChance)}%</span><span>Crit avoid ${fmtNum(profile.criticalAvoidance)}%</span>
      </div>
    </div>`;
  }

  function simulatorCapturedArenaProfileMarkup(report) {
    if (report?.reportType !== "arena-profile") return "";
    const stats = report.participants?.defender || {};
    const mods = stats.itemModifiers || {};
    const source = report.source || {};
    return `<div class="ga-sim-captured-profile" style="margin-top:8px">
      <div class="ga-sim-profile-title">Captured Arena Profile · verify source data</div>
      <div class="ga-sim-profile-grid">
        <span>Level ${fmtNum(stats.level)}</span><span>HP ${fmtNum(stats.lifeCurrent)} / ${fmtNum(stats.lifeMax)}</span><span>Armour ${fmtNum(stats.armour)}</span>
        <span>STR ${fmtNum(stats.strength)}</span><span>DEX ${fmtNum(stats.dexterity)}</span><span>AGI ${fmtNum(stats.agility)}</span>
        <span>CON ${fmtNum(stats.constitution)}</span><span>CHA ${fmtNum(stats.charisma)}</span><span>INT ${fmtNum(stats.intelligence)}</span>
        <span>Damage ${fmtNum(stats.damageMin)}–${fmtNum(stats.damageMax)}</span>
        <span>Crit item ${fmtNum(mods.criticalAttack?.flat || 0)}</span><span>Block item ${fmtNum(mods.blockValue?.flat || 0)}</span>
        <span>Hardening item ${fmtNum(mods.hardening?.flat || 0)}</span>
      </div>
      <div class="ga-muted" style="margin-top:6px">Source: ${esc(source.profileUrl || "Gladiatus player profile")} · Captured ${esc(report.capturedAt ? new Date(report.capturedAt).toLocaleString() : "unknown")}</div>
    </div>`;
  }

  function renderSimulatorMarkup() {
    const reports = simulatorReports();
    const report = selectedSimulatorReport();
    const root = shadow?.querySelector("#ga-combat-simulator");
    if (!root) return;
    if (!report) {
      root.innerHTML = `<div class="ga-muted">Capture at least one validated expedition/Arena battle, or use Analyze Now on the Provinciarum Arena page to create opponent profiles.</div>`;
      return;
    }
    const current = buildSimulatorProfiles();
    if (!current) {
      root.innerHTML = `<div class="ga-muted">Capture complete Current Stats before using the simulator. Use the Refresh button in Stat Overview, then return here.</div>`;
      return;
    }
    const currentEquipment = current.currentEquipment || {};
    const reportOptions = reports.map(item => {
      const key = simulatorReportKey(item);
      const selected = key === simulatorReportKey(report) ? " selected" : "";
      const enemy = item.participants?.defender?.name || "Unknown";
      const source = item.reportType === "arena-profile" ? "Arena Profile" : (item.reportType === "arena" ? "Arena" : "Expedition");
      const idLabel = item.reportType === "arena-profile" ? "Captured profile" : `Report ${item.reportId}`;
      const date = item.capturedAt ? new Date(item.capturedAt).toLocaleString() : "Unknown time";
      return `<option value="${esc(key)}"${selected}>${esc(source)} · ${esc(enemy)} · ${esc(idLabel)} · ${esc(date)}</option>`;
    }).join("");
    const statInputs = SIMULATOR_STAT_KEYS.map(key => `<label class="ga-field"><span>${esc(LABELS[key])} override · current ${esc(fmtNum(current.currentProfile[key]))}</span><input data-sim-stat="${esc(key)}" type="number" min="0" step="1" value="${simulatorState.statOverrides?.[key] ?? ""}"></label>`).join("");
    const equipmentRows = Object.entries(SIMULATOR_SLOT_LABELS).map(([slot, label]) => {
      const currentItem = currentEquipment?.[slot] || null;
      const choices = auctionItemsForSlot(slot).slice(0, 100);
      const selected = simulatorState.equipmentSelections?.[slot] || "current";
      const options = [`<option value="current"${selected === "current" ? " selected" : ""}>Current: ${esc(currentItem?.name || "empty")}</option>`]
        .concat(choices.filter(item => simulatorItemKey(item) !== simulatorItemKey(currentItem)).map(item => `<option value="${esc(simulatorItemKey(item))}"${selected === simulatorItemKey(item) ? " selected" : ""}>${esc(simulatorItemLabel(item))}</option>`)).join("");
      return `<label class="ga-field"><span>${esc(label)}</span><select data-sim-slot="${esc(slot)}">${options}</select></label>`;
    }).join("");

    root.innerHTML = `
      <div class="ga-card-head"><div><h2>Combat Simulator</h2><div class="ga-muted">Monte Carlo simulation against a captured combat profile. Engine: ${esc(simulatorEngine()?.VERSION || "unknown")} · DinoDevs Arena rules.</div></div></div>
      <div class="ga-field-grid ga-sim-controls">
        <label class="ga-field"><span>Opponent profile</span><select id="ga-sim-opponent">${reportOptions}</select></label>
        <label class="ga-field"><span>Simulations</span><input id="ga-sim-count" type="number" min="1" max="10000" step="100" value="${esc(simulatorState.simulations)}"></label>
        <label class="ga-field"><span>Seed</span><input id="ga-sim-seed" type="number" min="1" step="1" value="${esc(simulatorState.seed)}"></label>
        <label class="ga-field"><span>Life mode</span><select id="ga-sim-life"><option value="current"${simulatorState.lifeMode === "current" ? " selected" : ""}>Current</option><option value="full"${simulatorState.lifeMode === "full" ? " selected" : ""}>Full</option><option value="unlimited"${simulatorState.lifeMode === "unlimited" ? " selected" : ""}>Unlimited</option></select></label>
      </div>
      <div class="ga-actions-row" style="margin-top:8px"><button class="ga-primary" id="ga-sim-run" type="button">Simulate</button><button class="ga-secondary" id="ga-sim-reset" type="button">Reset hypothetical</button><span class="ga-statusline" id="ga-sim-status"></span></div>
      <div class="ga-sim-two-col" style="margin-top:8px">
        <section><h3>Hypothetical stats</h3><div class="ga-field-grid">${statInputs}</div></section>
        <section><h3>Hypothetical equipment</h3><div class="ga-field-grid">${equipmentRows}</div></section>
      </div>
      <div class="ga-sim-profile-three" style="margin-top:8px">${simulatorProfileMarkup("Current profile", current.currentProfile)}${simulatorProfileMarkup("Hypothetical profile", current.hypotheticalProfile)}${simulatorProfileMarkup(`Opponent · ${current.enemyProfile?.name || "Enemy"}`, current.enemyProfile)}</div>
      ${simulatorCapturedArenaProfileMarkup(report)}
      <div id="ga-sim-result" class="ga-sim-result" style="margin-top:8px">${simulatorState.result ? renderSimulatorResultMarkup(simulatorState.result) : `<div class="ga-muted">Run a simulation to see the comparison.</div>`}</div>`;

    root.querySelector("#ga-sim-opponent")?.addEventListener("change", async event => { simulatorState.reportId = String(event.target.value || ""); simulatorState.result = null; await saveSimulatorState(); renderCombatTab(); });
    root.querySelector("#ga-sim-count")?.addEventListener("change", async event => { simulatorState.simulations = Math.max(1, Math.min(50000, Math.floor(Number(event.target.value) || 1000))); await saveSimulatorState(); });
    root.querySelector("#ga-sim-seed")?.addEventListener("change", async event => { simulatorState.seed = Math.max(1, Math.floor(Number(event.target.value) || 1)); await saveSimulatorState(); });
    root.querySelector("#ga-sim-life")?.addEventListener("change", async event => { simulatorState.lifeMode = ["current", "full", "unlimited"].includes(event.target.value) ? event.target.value : "current"; await saveSimulatorState(); });
    root.querySelectorAll("[data-sim-stat]").forEach(input => input.addEventListener("change", async event => {
      const key = String(event.target.dataset.simStat);
      const value = String(event.target.value || "").trim();
      if (value === "") delete simulatorState.statOverrides[key]; else simulatorState.statOverrides[key] = Math.max(0, Number(value));
      simulatorState.result = null; await saveSimulatorState(); renderCombatTab();
    }));
    root.querySelectorAll("[data-sim-slot]").forEach(select => select.addEventListener("change", async event => {
      simulatorState.equipmentSelections[event.target.dataset.simSlot] = String(event.target.value || "current");
      simulatorState.result = null; await saveSimulatorState(); renderCombatTab();
    }));
    root.querySelector("#ga-sim-reset")?.addEventListener("click", async () => {
      simulatorState.statOverrides = {};
      simulatorState.equipmentSelections = {};
      simulatorState.result = null;
      await saveSimulatorState();
      renderCombatTab();
    });
    root.querySelector("#ga-sim-run")?.addEventListener("click", runCombatSimulation);
  }

  function renderSimulatorResultMarkup(result) {
    if (!result) return `<div class="ga-muted">No simulation result.</div>`;
    const current = result.current;
    const hypothetical = result.hypothetical;
    return `<div class="ga-sim-result-grid">
      <div class="ga-stat"><span>Current win rate</span><strong>${formatCombatMetric(current.rates.win, 1, "%")}</strong></div>
      <div class="ga-stat"><span>Hypothetical win rate</span><strong>${formatCombatMetric(hypothetical.rates.win, 1, "%")}</strong></div>
      <div class="ga-stat"><span>Current avg rounds</span><strong>${formatCombatMetric(current.averages.rounds, 2)}</strong></div>
      <div class="ga-stat"><span>Hypothetical avg rounds</span><strong>${formatCombatMetric(hypothetical.averages.rounds, 2)}</strong></div>
      <div class="ga-stat"><span>Current damage dealt</span><strong>${formatCombatMetric(current.averages.playerDamage, 1)}</strong></div>
      <div class="ga-stat"><span>Hypothetical damage dealt</span><strong>${formatCombatMetric(hypothetical.averages.playerDamage, 1)}</strong></div>
      <div class="ga-stat"><span>Current damage taken</span><strong>${formatCombatMetric(current.averages.enemyDamage, 1)}</strong></div>
      <div class="ga-stat"><span>Hypothetical damage taken</span><strong>${formatCombatMetric(hypothetical.averages.enemyDamage, 1)}</strong></div>
      <div class="ga-stat"><span>Current HP remaining</span><strong>${formatCombatMetric(current.averages.playerLifeRemaining, 1)}</strong></div>
      <div class="ga-stat"><span>Hypothetical HP remaining</span><strong>${formatCombatMetric(hypothetical.averages.playerLifeRemaining, 1)}</strong></div>
      <div class="ga-stat"><span>Current hit rate</span><strong>${formatCombatMetric(current.rates.playerHit, 1, "%")}</strong></div>
      <div class="ga-stat"><span>Hypothetical hit rate</span><strong>${formatCombatMetric(hypothetical.rates.playerHit, 1, "%")}</strong></div>
    </div>
    <div class="ga-muted" style="margin-top:7px">${esc(result.note)}</div>`;
  }

  async function runCombatSimulation() {
    const engine = simulatorEngine();
    const status = shadow?.querySelector("#ga-sim-status");
    const button = shadow?.querySelector("#ga-sim-run");
    if (!engine) {
      if (status) status.textContent = "Combat simulator engine unavailable.";
      return;
    }
    if (button) button.disabled = true;
    if (status) status.textContent = "Loading saved main-character profile…";
    try {
      await loadCharacterProfileStore();
      const mainProfile = characterProfileStore.characters?.["1"] || null;
      const missingMainData = characterProfileMissingSimulationData(mainProfile);
      if (!mainProfile || missingMainData.length) throw new Error(`Complete saved main-character stats/equipment are required. Missing: ${missingMainData.join(", ") || "saved profile"}. Capture All Characters first.`);
      const profiles = buildSimulatorProfiles();
      if (!profiles) throw new Error("Complete Current Stats have not been captured yet. Use Refresh in Stat Overview first.");
      if (status) status.textContent = `Running ${simulatorState.simulations.toLocaleString()} simulations…`;
      await new Promise(resolve => requestAnimationFrame(resolve));
      const arenaRules = profiles.report.reportType === "arena" || profiles.report.reportType === "arena-profile";
      const options = { simulations: simulatorState.simulations, seed: simulatorState.seed, lifeMode: simulatorState.lifeMode, maxRounds: arenaRules ? ARENA_SIMULATION_ROUNDS : 50 };
      const current = engine.simulateBatch({ player: profiles.currentProfile, enemy: profiles.enemyProfile, ...options });
      const hypothetical = engine.simulateBatch({ player: profiles.hypotheticalProfile, enemy: profiles.enemyProfile, ...options });
      simulatorState.result = {
        generatedAt: new Date().toISOString(),
        reportId: profiles.report.reportId,
        simulations: simulatorState.simulations,
        current,
        hypothetical,
        note: "Simulation uses the JavaScript DinoDevs GladiatusBattleSimulator Arena engine under LGPL-2.1. The engine rules are authoritative; simulations vary only analysis inputs such as starting life, seed, hypothetical stats, and equipment."
      };
      if (status) status.textContent = `Completed ${simulatorState.simulations.toLocaleString()} simulations.`;
    } catch (error) {
      simulatorState.result = null;
      if (status) status.textContent = `Simulation error: ${error?.message || String(error)}`;
    } finally {
      if (button) button.disabled = false;
    }
    renderCombatTab();
  }

  function renderCombatTab() {
    const root = shadow?.querySelector("#ga-combat-tab-content");
    if (!root) return;
    const expeditionReports = Array.isArray(combatCaptureStore?.reports) ? combatCaptureStore.reports : [];
    const arenaReports = Array.isArray(arenaCombatStore?.reports) ? arenaCombatStore.reports : [];
    const circusReports = Array.isArray(circusCombatStore?.reports) ? circusCombatStore.reports : [];
    const reports = [...expeditionReports, ...arenaReports, ...circusReports]
      .filter((record, index, all) => simulatorReportKey(record) && all.findIndex(item => simulatorReportKey(item) === simulatorReportKey(record)) === index)
      .sort((a, b) => String(b.capturedAt || "").localeCompare(String(a.capturedAt || "")));
    const validated = validatedCombatReports(reports);
    if (!reports.length) {
      root.innerHTML = `
        <section class="ga-card" id="ga-auto-combat"></section>
        <section class="ga-card"><div class="ga-card-head"><div><h2>Combat Simulator</h2><div class="ga-muted">Capture a validated expedition or Arena battle first.</div></div></div></section>
        <section class="ga-card"><div class="ga-card-head"><div><h2>Combat Performance</h2><div class="ga-muted">Captured Expedition, Arena and Circus battles appear here automatically.</div></div></div><div class="ga-muted" style="margin-top:8px">No combat battles captured yet.</div></section>`;
      renderAutoCombatUI();
      return;
    }

    const opponents = [...new Set(reports.map(record => combatRecordOpponentLabel(record)))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    const selectedAll = filterCombatReports(validated);
    const metrics = aggregateCombatMetrics(selectedAll);
    const trend = combatTrendPair(selectedAll);
    const latest = selectedAll[0] || null;
    const latestMetrics = latest ? combatRecordMetrics(latest) : null;
    const opponent = latest ? combatRecordOpponentLabel(latest) : "Unknown opponent";
    const resultLabel = latest ? combatOutcomeLabel(latest.outcome) : "No matching battles";
    const resultClass = combatResultClass(resultLabel);
    const historyRows = selectedAll.slice(0, 50).map((record, index) => {
      const recordMetrics = combatRecordMetrics(record);
      const enemy = combatRecordOpponentLabel(record);
      const result = combatOutcomeLabel(record?.outcome);
      const date = record?.capturedAt ? new Date(record.capturedAt).toLocaleString() : "Unknown time";
      return `<button class="ga-combat-history-row" type="button" data-combat-history-index="${index}">
        <span class="ga-combat-history-main"><strong>${esc(enemy)}</strong><small>${esc(combatRecordTypeLabel(record))} · ${esc(date)} · ${recordMetrics.rounds} rounds</small></span>
        <span class="ga-combat-history-result ${combatResultClass(result)}">${esc(result)}</span>
        <span class="ga-combat-history-values"><span>${formatCombatMetric(recordMetrics.playerDamageSummary ?? recordMetrics.playerDamage, 0)}</span><span>${formatCombatMetric(recordMetrics.enemyDamageSummary ?? recordMetrics.enemyDamage, 0)}</span></span>
      </button>`;
    }).join("");

    const trendMarkup = trend ? `
      <section class="ga-card">
        <div class="ga-card-head"><div><h2>Recent Trend</h2><div class="ga-muted">Newest ${trend.size} validated battles compared with the preceding ${trend.size}.</div></div></div>
        <div class="ga-combat-trend-grid">
          <div class="ga-stat"><span>Damage / round</span><strong>${formatCombatMetric(trend.recent.damagePerRound, 1)}</strong><small>previous ${formatCombatMetric(trend.prior.damagePerRound, 1)} ${formatCombatDelta(trend.recent.damagePerRound, trend.prior.damagePerRound, 1)}</small></div>
          <div class="ga-stat"><span>Hit rate</span><strong>${formatCombatMetric(trend.recent.hitRate, 1, "%")}</strong><small>previous ${formatCombatMetric(trend.prior.hitRate, 1, "%")} ${formatCombatDelta(trend.recent.hitRate, trend.prior.hitRate, 1, "%")}</small></div>
          <div class="ga-stat"><span>Average hit</span><strong>${formatCombatMetric(trend.recent.avgSuccessfulHit, 1)}</strong><small>previous ${formatCombatMetric(trend.prior.avgSuccessfulHit, 1)} ${formatCombatDelta(trend.recent.avgSuccessfulHit, trend.prior.avgSuccessfulHit, 1)}</small></div>
          <div class="ga-stat"><span>Damage taken / round</span><strong>${formatCombatMetric(trend.recent.damageTakenPerRound, 1)}</strong><small>previous ${formatCombatMetric(trend.prior.damageTakenPerRound, 1)} ${formatCombatDelta(trend.recent.damageTakenPerRound, trend.prior.damageTakenPerRound, 1, "", true)}</small></div>
        </div>
      </section>` : "";

    root.innerHTML = `
      <section class="ga-card" id="ga-auto-combat"></section>
      <section class="ga-card" id="ga-combat-simulator"></section>
      <section class="ga-card">
        <div class="ga-card-head">
          <div><h2>Combat Overview</h2><div class="ga-muted">Aggregated from ${metrics.battles} validated combat${metrics.battles === 1 ? "" : "s"}. ${reports.length - validated.length} captured record${reports.length - validated.length === 1 ? "" : "s"} excluded from analysis due to validation issues.</div></div>
        </div>
        <div class="ga-combat-filters">
          <label><span>Window</span><select id="ga-combat-window"><option value="all">All captured</option><option value="10">Last 10</option><option value="25">Last 25</option><option value="50">Last 50</option><option value="100">Last 100</option></select></label>
          <label><span>Opponent</span><select id="ga-combat-opponent"><option value="all">All opponents</option>${opponents.map(name => `<option value="${esc(name)}">${esc(name)}</option>`).join("")}</select></label>
          <label><span>Result</span><select id="ga-combat-result-filter"><option value="all">All results</option><option value="win">Wins</option><option value="loss">Losses</option><option value="unknown">Unknown</option></select></label>
        </div>
        <div class="ga-stats-grid ga-combat-metrics-grid" style="margin-top:8px">
          <div class="ga-stat"><span>Combat reports</span><strong>${metrics.battles}</strong></div>
          <div class="ga-stat"><span>Win rate</span><strong>${formatCombatMetric(metrics.winRate, 1, "%")}</strong></div>
          <div class="ga-stat"><span>Average rounds</span><strong>${formatCombatMetric(metrics.avgRounds, 1)}</strong></div>
          <div class="ga-stat"><span>Avg damage dealt</span><strong>${formatCombatMetric(metrics.avgDamageDealt, 1)}</strong></div>
          <div class="ga-stat"><span>Avg damage taken</span><strong>${formatCombatMetric(metrics.avgDamageTaken, 1)}</strong></div>
          <div class="ga-stat"><span>Damage / round</span><strong>${formatCombatMetric(metrics.damagePerRound, 1)}</strong></div>
          <div class="ga-stat"><span>Hit rate</span><strong>${formatCombatMetric(metrics.hitRate, 1, "%")}</strong></div>
          <div class="ga-stat"><span>Critical rate</span><strong>${formatCombatMetric(metrics.critRate, 1, "%")}</strong></div>
          <div class="ga-stat"><span>Double-hit rate</span><strong>${formatCombatMetric(metrics.doubleHitRate, 1, "%")}</strong></div>
          <div class="ga-stat"><span>Average successful hit</span><strong>${formatCombatMetric(metrics.avgSuccessfulHit, 1)}</strong></div>
          <div class="ga-stat"><span>Highest hit</span><strong>${formatCombatMetric(metrics.maxPlayerHit, 0)}</strong></div>
          <div class="ga-stat"><span>Gold earned</span><strong>${formatCombatMetric(metrics.gold, 0)}</strong></div>
        </div>
      </section>

      ${trendMarkup}

      <section class="ga-card">
        <div class="ga-card-head">
          <div><h2>Latest Selected Battle</h2><div class="ga-muted">${esc(opponent)} · ${esc(resultLabel)} · ${latestMetrics ? `${latestMetrics.rounds} rounds` : "No matching battle"}</div></div>
          ${latest ? `<span class="ga-combat-result ${resultClass}">${esc(resultLabel)}</span>` : ""}
        </div>
        ${latest ? `<div class="ga-stats-grid ga-combat-metrics-grid" style="margin-top:8px">
          <div class="ga-stat"><span>Damage dealt</span><strong>${formatCombatMetric(latestMetrics.playerDamageSummary ?? latestMetrics.playerDamage, 0)}</strong></div>
          <div class="ga-stat"><span>Damage taken</span><strong>${formatCombatMetric(latestMetrics.enemyDamageSummary ?? latestMetrics.enemyDamage, 0)}</strong></div>
          <div class="ga-stat"><span>Hit rate</span><strong>${formatCombatMetric(latestMetrics.playerHitRate, 1, "%")}</strong></div>
          <div class="ga-stat"><span>Average hit</span><strong>${formatCombatMetric(latestMetrics.playerAvgHit, 1)}</strong></div>
          <div class="ga-stat"><span>Critical hits</span><strong>${formatCombatMetric(latestMetrics.playerCrits, 0)}</strong></div>
          <div class="ga-stat"><span>Double-hit attacks</span><strong>${formatCombatMetric(latestMetrics.playerDoubleHits, 0)}</strong></div>
        </div>` : `<div class="ga-muted" style="margin-top:8px">No validated battles match the current filters.</div>`}
      </section>

      <section class="ga-card">
        <div class="ga-card-head"><div><h2>Offense</h2><div class="ga-muted">Aggregated observed player attacks from the selected battles.</div></div></div>
        <div class="ga-row"><span>Attacks</span><strong>${metrics.playerAttacks}</strong></div>
        <div class="ga-row"><span>Hits</span><strong>${metrics.playerHits}</strong></div>
        <div class="ga-row"><span>Misses</span><strong>${metrics.playerMisses}</strong></div>
        <div class="ga-row"><span>Hit rate</span><strong>${formatCombatMetric(metrics.hitRate, 1, "%")}</strong></div>
        <div class="ga-row"><span>Critical hits</span><strong>${metrics.playerCrits}</strong></div>
        <div class="ga-row"><span>Critical rate</span><strong>${formatCombatMetric(metrics.critRate, 1, "%")}</strong></div>
        <div class="ga-row"><span>Double-hit attacks</span><strong>${metrics.playerDoubleHits}</strong></div>
        <div class="ga-row"><span>Average damage per hit</span><strong>${formatCombatMetric(metrics.avgSuccessfulHit, 1)}</strong></div>
        <div class="ga-row"><span>Damage per round</span><strong>${formatCombatMetric(metrics.damagePerRound, 1)}</strong></div>
        <div class="ga-row"><span>Highest hit</span><strong>${formatCombatMetric(metrics.maxPlayerHit, 0)}</strong></div>
      </section>

      <section class="ga-card">
        <div class="ga-card-head"><div><h2>Defense</h2><div class="ga-muted">Aggregated observed opponent attacks from the selected battles.</div></div></div>
        <div class="ga-row"><span>Attacks received</span><strong>${metrics.enemyAttacks}</strong></div>
        <div class="ga-row"><span>Hits received</span><strong>${metrics.enemyHits}</strong></div>
        <div class="ga-row"><span>Misses</span><strong>${metrics.enemyMisses}</strong></div>
        <div class="ga-row"><span>Opponent hit rate</span><strong>${formatCombatMetric(metrics.opponentHitRate, 1, "%")}</strong></div>
        <div class="ga-row"><span>Critical hits received</span><strong>${metrics.enemyCrits}</strong></div>
        <div class="ga-row"><span>Damage taken per round</span><strong>${formatCombatMetric(metrics.damageTakenPerRound, 1)}</strong></div>
        <div class="ga-row"><span>Highest hit received</span><strong>${formatCombatMetric(metrics.maxEnemyHit, 0)}</strong></div>
      </section>

      <section class="ga-card">
        <div class="ga-card-head"><div><h2>Combat History</h2><div class="ga-muted">Showing up to the 50 most recent validated combat reports matching the filters.</div></div></div>
        <div class="ga-combat-history-head"><span>Opponent</span><span>Result</span><span>Damage dealt / taken</span></div>
        <div class="ga-combat-history">${historyRows || `<div class="ga-muted" style="padding:10px 7px">No validated battles match the current filters.</div>`}</div>
        <pre class="ga-combat-history-detail" id="ga-combat-history-detail" hidden></pre>
      </section>`;

    renderSimulatorMarkup();
    renderAutoCombatUI();
    root.querySelector("#ga-copy-combat-summary")?.addEventListener("click", copyLatestCombatSummary);
    root.querySelector("#ga-copy-combat-json")?.addEventListener("click", copyLatestCombatJson);
    root.querySelector("#ga-clear-combat")?.addEventListener("click", clearCombatData);
    const windowSelect = root.querySelector("#ga-combat-window");
    const opponentSelect = root.querySelector("#ga-combat-opponent");
    const resultSelect = root.querySelector("#ga-combat-result-filter");
    if (windowSelect) { windowSelect.value = combatWindowFilter; windowSelect.addEventListener("change", event => { combatWindowFilter = String(event.target.value || "all"); renderCombatTab(); }); }
    if (opponentSelect) { opponentSelect.value = combatOpponentFilter; opponentSelect.addEventListener("change", event => { combatOpponentFilter = String(event.target.value || "all"); renderCombatTab(); }); }
    if (resultSelect) { resultSelect.value = combatResultFilter; resultSelect.addEventListener("change", event => { combatResultFilter = String(event.target.value || "all"); renderCombatTab(); }); }

    root.querySelectorAll("[data-combat-history-index]").forEach(button => button.addEventListener("click", () => {
      const index = Number(button.dataset.combatHistoryIndex);
      const record = selectedAll[index];
      const detail = root.querySelector("#ga-combat-history-detail");
      if (!detail || !record) return;
      detail.hidden = false;
      detail.textContent = formatCombatSummary(record);
    }));
  }

  function renderCombatCaptureStatus() {
    const el = shadow?.querySelector("#ga-combat-status");
    if (!el) return;
    const reports = combatCaptureStore?.reports || [];
    if (!reports.length) {
      el.textContent = "No expedition battles captured yet.";
      renderCombatDiagnostics();
      return;
    }
    const latest = reports[0];
    const outcome = combatOutcomeLabel(latest.outcome);
    const opponent = latest.participants?.defender?.name || "Unknown opponent";
    const validation = validateCombatRecord(latest);
    el.textContent = `${reports.length} captured · Latest: ${opponent} · ${outcome} · ${latest.rounds?.length || 0} rounds · ${validation.ready ? "validated" : "needs review"}`;
    renderCombatDiagnostics();
    renderCombatTab();
  }

  function renderCombatDiagnostics() {
    const el = shadow?.querySelector("#ga-combat-diagnostic-text");
    if (!el) return;
    const reports = combatCaptureStore?.reports || [];
    if (!reports.length) {
      el.textContent = "No expedition combat data captured yet.";
      return;
    }
    const latest = reports[0];
    const validation = validateCombatRecord(latest);
    const readiness = latest.captureDiagnostics?.readiness || null;
    const summary = formatCombatSummary(latest);
    el.textContent = [
      summary,
      "",
      "CAPTURE READINESS",
      `  Core data ready at capture: ${readiness?.ready ? "YES" : "NO"}`,
      `  Complete at capture: ${readiness?.complete ? "YES" : "NO"}`,
      `  Missing required: ${(readiness?.missingRequired || []).join(", ") || "None"}`,
      `  Missing optional: ${(readiness?.missingOptional || []).join(", ") || "None"}`,
      `  Result source: ${latest.outcome?.source || "none"}`,
      "",
      "VALIDATION JSON",
      JSON.stringify(validation, null, 2)
    ].join("\n");
  }

  async function copyLatestCombatSummary() {
    const latest = combatCaptureStore?.reports?.[0];
    const button = shadow?.querySelector("#ga-copy-combat-summary");
    await copyTextWithButton(formatCombatSummary(latest), button, "Copy summary");
  }

  async function copyLatestCombatJson() {
    const latest = combatCaptureStore?.reports?.[0];
    const button = shadow?.querySelector("#ga-copy-combat-json");
    await copyTextWithButton(latest ? JSON.stringify(latest, null, 2) : "", button, "Copy full JSON");
  }

  async function clearCombatData() {
    try { await storageRemove(combatKey()); } catch (_) {}
    try { await storageRemove(arenaCombatKey()); } catch (_) {}
    try { await storageRemove(circusCombatKey()); } catch (_) {}
    combatCaptureStore = { schemaVersion: 3, reports: [], updatedAt: null };
    arenaCombatStore = { schemaVersion: 1, reports: [], updatedAt: null };
    circusCombatStore = { schemaVersion: 1, reports: [], updatedAt: null };
    renderCombatCaptureStatus();
    renderCombatTab();
    renderStatPriorityTab();
    if (statusEl) statusEl.textContent = "Captured combat battles cleared.";
  }

  async function captureExpeditionCombatReport() {
    if (combatCaptureInFlight) return { captured: false, reason: "busy" };
    combatCaptureInFlight = true;
    try {
      const expeditionDetection = expeditionReportDetection();
      if (!expeditionDetection.isExpedition) {
        return { captured: false, reason: "not-expedition-report", detection: expeditionDetection };
      }
      const reportId = reportIdFromUrl();
      if (!reportId) return { captured: false, reason: "no-report-id" };
      if (!combatCaptureStore) await loadCombatCaptureStore();

      const attackerContainer = document.querySelector("#attackerCharStats1");
      const defenderContainer = document.querySelector('[id^="defenderCharStats"]');
      const eventData = parseCombatEvents();
      const attacker = attackerContainer ? parseCombatantStats(attackerContainer, "attacker") : null;
      const defender = defenderContainer ? parseCombatantStats(defenderContainer, "defender") : null;
      const reward = parseCombatReward();
      const damageSummary = parseCombatDamageSummary();
      const names = deriveReportNames(reward, eventData.rounds, damageSummary);
      if (attacker) attacker.name = names.attackerName;
      if (defender) defender.name = names.defenderName;
      const outcome = deriveCombatOutcome(names.attackerName, names.defenderName, damageSummary, reward);
      const readiness = buildCombatReadiness({ reportId, reportType: "expedition", attackerContainer, defenderContainer, attacker, defender, reward, damageSummary, eventData, outcome });

      const existingIndex = combatCaptureStore.reports.findIndex(report => String(report.reportId) === String(reportId));
      const existing = existingIndex >= 0 ? combatCaptureStore.reports[existingIndex] : null;

      if (!readiness.ready) {
        return { captured: false, reason: "report-not-ready", readiness, report: existing || null };
      }
      if (existing && readiness.complete && existing.captureDiagnostics?.readiness?.complete && existing.outcome?.type === outcome?.type && existing.outcome?.winner === outcome?.winner) {
        return { captured: false, reason: "already-captured", report: existing };
      }

      const now = new Date().toISOString();
      const record = {
        schemaVersion: 3,
        reportId: String(reportId),
        capturedAt: existing?.capturedAt || now,
        updatedAt: existing ? now : null,
        reportPath: `${location.origin}${location.pathname}`,
        reportType: "expedition",
        participants: { attacker, defender },
        reward,
        damageSummary,
        outcome,
        rounds: eventData.rounds,
        totalEvents: eventData.eventCount,
        captureDiagnostics: {
          expeditionDetection,
          attackerStatsRows: attacker?.rawRows?.length || 0,
          defenderStatsRows: defender?.rawRows?.length || 0,
          rewardCaptured: !!reward,
          damageSummaryRows: damageSummary.length,
          criticalEvents: eventData.rounds.reduce((sum, round) => sum + round.events.filter(event => event.critical).length, 0),
          missEvents: eventData.rounds.reduce((sum, round) => sum + round.events.filter(event => event.resultType === "miss").length, 0),
          durabilityEvents: eventData.rounds.reduce((sum, round) => sum + round.events.filter(event => event.durabilityLosses?.length).length, 0),
          readiness,
          repairedUnknownOutcome: !!existing && existing.outcome?.type === "unknown",
          captureCompleteness: readiness.missingOptional?.length ? "result-only" : "complete"
        },
        source: {
          referrerKind: reportPageReferrerKind(),
          pageTitle: document.title || ""
        }
      };

      const validation = validateCombatRecord(record);
      record.captureDiagnostics.validation = validation;

      if (existingIndex >= 0) {
        combatCaptureStore.reports.splice(existingIndex, 1, record);
      } else {
        combatCaptureStore.reports.unshift(record);
        if (combatCaptureStore.reports.length > 500) combatCaptureStore.reports.length = 500;
      }
      combatCaptureStore.schemaVersion = 3;
      combatCaptureStore.updatedAt = now;
      await storageSet({ [combatKey()]: combatCaptureStore });
      renderCombatCaptureStatus();
      renderCombatDiagnostics();
      renderCombatTab();
      if (statusEl) statusEl.textContent = existingIndex >= 0 ? `Expedition battle repaired · ${names.defenderName || "Unknown opponent"} · ${eventData.eventCount} events.` : `Expedition battle captured · ${names.defenderName || "Unknown opponent"} · ${eventData.eventCount} events.`;
      return { captured: true, repaired: existingIndex >= 0, needsFollowup: !readiness.complete, report: record };
    } finally {
      combatCaptureInFlight = false;
    }
  }

  function arenaReportDetection() {
    if (!isCombatReportPage()) return { isArena: false, source: "not-combat-report", referrerKind: reportPageReferrerKind() };
    const referrerKind = reportPageReferrerKind();
    const reportType = combatReportTypeFromUrl();

    // Keep report routing mutually exclusive with Expedition.  Gladiatus combat
    // reports use t=2 for Provinciarum Arena and t=0 for Expedition.
    if (reportType === "expedition") {
      return { isArena: false, source: "report-type-0-expedition", referrerKind, reportType };
    }
    if (reportType === "arena") {
      return { isArena: true, source: "report-type-2-arena", referrerKind, reportType };
    }

    return { isArena: false, source: "unknown-report-type", referrerKind, reportType };
  }

  function circusReportDetection() {
    if (!isCombatReportPage()) return { isCircus: false, source: "not-combat-report", referrerKind: reportPageReferrerKind() };
    const referrerKind = reportPageReferrerKind();
    const reportType = combatReportTypeFromUrl();
    if (reportType === "circus") return { isCircus: true, source: "report-type-3-circus", referrerKind, reportType };
    return { isCircus: false, source: reportType ? `report-type-${reportType}-not-circus` : "unknown-report-type", referrerKind, reportType };
  }

  async function loadCircusCombatStore() {
    try {
      const result = await storageGet(circusCombatKey());
      const stored = result?.[circusCombatKey()];
      if (stored && Array.isArray(stored.reports)) {
        circusCombatStore = { ...stored, schemaVersion: Math.max(1, Number(stored.schemaVersion) || 1) };
        return circusCombatStore;
      }
    } catch (_) {}
    circusCombatStore = { schemaVersion: 1, reports: [], updatedAt: null };
    return circusCombatStore;
  }

  async function saveCircusCombatStore() {
    if (!circusCombatStore) return;
    try { await storageSet({ [circusCombatKey()]: circusCombatStore }); } catch (_) {}
  }

  function circusReportFighterContainers(side) {
    const ids = side === "attacker" ? [1, 2, 3, 4, 5] : [11, 12, 13, 14, 15];
    return ids.map(index => document.querySelector(`#${side}CharStats${index}`)).filter(Boolean);
  }

  function circusReportFighterName(side, index) {
    const avatarId = side === "attacker" ? index : 10 + index;
    const name = normalize(document.querySelector(`#${side}Avatar${avatarId} .playername`)?.textContent || "");
    return name || null;
  }

  function deriveDungeonOutcome(attackers, defenders) {
    const aNames = new Set((attackers || []).map(x => normalize(x?.name || "")).filter(Boolean));
    const dNames = new Set((defenders || []).map(x => normalize(x?.name || "")).filter(Boolean));
    const header = document.querySelector("#reportHeader");
    const headerText = normalize(header?.textContent || "");
    const winnerMatch = headerText.match(/\bWinner:\s*(.+?)\s*$/i);
    if (winnerMatch) {
      const winner = normalize(winnerMatch[1]);
      if (aNames.has(winner)) return { type: "win", winner, source: "report-header" };
      if (dNames.has(winner)) return { type: "loss", winner, source: "report-header" };
      if (/^(?:attackers?|player|you)$/i.test(winner)) return { type: "win", winner, source: "report-header" };
      if (/^defenders?$/i.test(winner)) return { type: "loss", winner, source: "report-header" };
    }
    const headerClass = String(header?.className || "").trim();
    if (/\breportWin\b/i.test(headerClass) && aNames.size) return { type: "win", winner: [...aNames][0], source: "report-header-class" };
    if (/\breportLose\b/i.test(headerClass) && dNames.size) return { type: "loss", winner: [...dNames][0], source: "report-header-class" };
    return { type: "unknown", winner: null, source: null };
  }

  function deriveCircusOutcome(attackers, defenders, damageSummary) {
    const aNames = new Set((attackers || []).map(x => normalize(x?.name || "")).filter(Boolean));
    const dNames = new Set((defenders || []).map(x => normalize(x?.name || "")).filter(Boolean));
    const header = document.querySelector("#reportHeader");
    const headerText = normalize(header?.textContent || "");
    const winnerMatch = headerText.match(/\bWinner:\s*(.+?)\s*$/i);
    if (winnerMatch) {
      const winner = normalize(winnerMatch[1]);
      if (aNames.has(winner)) return { type: "win", winner, source: "report-header" };
      if (dNames.has(winner)) return { type: "loss", winner, source: "report-header" };
      if (/^(?:attackers?|player|you)$/i.test(winner)) return { type: "win", winner, source: "report-header" };
      if (/^defenders?$/i.test(winner)) return { type: "loss", winner, source: "report-header" };
    }
    const headerClass = String(header?.className || "").trim();
    // The report header's final-result class is authoritative for automation.
    // Fighter/participant lists may still be partially hydrated, so do not
    // require a parsed winner name before accepting a completed fight.
    if (/\breportWin\b/i.test(headerClass)) return { type: "win", winner: aNames.size ? [...aNames][0] : null, source: "report-header-class" };
    if (/\breportLose\b/i.test(headerClass)) return { type: "loss", winner: dNames.size ? [...dNames][0] : null, source: "report-header-class" };
    return { type: "unknown", winner: null, source: null };
  }

  async function captureCircusCombatReport() {
    if (combatCaptureInFlight) return { captured: false, reason: "busy" };
    combatCaptureInFlight = true;
    try {
      const detection = circusReportDetection();
      if (!detection.isCircus) return { captured: false, reason: "not-circus-report", detection };
      const reportId = reportIdFromUrl();
      if (!reportId) return { captured: false, reason: "no-report-id" };
      if (!circusCombatStore) {
        await promiseWithTimeout(loadCircusCombatStore(), CIRCUS_REPORT_CAPTURE_TIMEOUT_MS, "Circus report store load");
      }

      const attackerContainers = circusReportFighterContainers("attacker");
      const defenderContainers = circusReportFighterContainers("defender");
      const eventData = parseCombatEvents();
      const attackers = [1, 2, 3, 4, 5].map((index, i) => {
        const container = document.querySelector(`#attackerCharStats${index}`);
        if (!container) return null;
        const fighter = parseCombatantStats(container, "attacker");
        if (fighter) fighter.name = circusReportFighterName("attacker", i + 1) || fighter.name || `Attacker ${i + 1}`;
        fighter.dollIndex = i + 1;
        return fighter;
      }).filter(Boolean);
      const defenders = [11, 12, 13, 14, 15].map((index, i) => {
        const container = document.querySelector(`#defenderCharStats${index}`);
        if (!container) return null;
        const fighter = parseCombatantStats(container, "defender");
        if (fighter) fighter.name = circusReportFighterName("defender", i + 1) || fighter.name || `Defender ${i + 1}`;
        fighter.dollIndex = i + 1;
        return fighter;
      }).filter(Boolean);
      const reward = parseCombatReward();
      const damageSummary = parseDungeonDamageSummary();
      const outcome = deriveCircusOutcome(attackers, defenders, damageSummary);
      // A Circus fight is complete for Auto Combat as soon as Gladiatus exposes
      // a definitive Win/Loss in the report header. The participant lists,
      // combat events, reward block and damage summary can hydrate unevenly;
      // they are useful enrichment, but must never block scheduler progress.
      const missingRequired = [];
      const missingOptional = [];
      if (!reportId) missingRequired.push("reportId");
      if (attackerContainers.length < 5) missingOptional.push(`attacker fighter containers (${attackerContainers.length}/5)`);
      if (defenderContainers.length < 5) missingOptional.push(`defender fighter containers (${defenderContainers.length}/5)`);
      if (attackers.length < 5) missingOptional.push(`attacker stats (${attackers.length}/5)`);
      if (defenders.length < 5) missingOptional.push(`defender stats (${defenders.length}/5)`);
      if (attackers.some(f => (f.rawRows?.length || 0) < 8)) missingOptional.push("complete attacker fighter stats");
      if (defenders.some(f => (f.rawRows?.length || 0) < 8)) missingOptional.push("complete defender fighter stats");
      if (!eventData?.rounds?.length || !eventData?.eventCount) missingOptional.push("combat events");
      if (!reward) missingOptional.push("reward");
      if (damageSummary.length < 10) missingOptional.push(`damage summary (${damageSummary.length}/10)`);
      if (outcome.type === "unknown") missingRequired.push("final result");
      const readiness = {
        ready: missingRequired.length === 0,
        complete: missingRequired.length === 0,
        missingRequired,
        missingOptional,
        reportId: String(reportId),
        format: "5v5",
        attackerFighters: attackers.length,
        defenderFighters: defenders.length,
        rounds: eventData.rounds.length,
        events: eventData.eventCount
      };
      const existingIndex = circusCombatStore.reports.findIndex(report => String(report.reportId) === String(reportId));
      const existing = existingIndex >= 0 ? circusCombatStore.reports[existingIndex] : null;
      if (!readiness.complete) return { captured: false, reason: "report-not-ready", readiness, report: existing || null };
      if (existing?.captureDiagnostics?.readiness?.complete) return { captured: false, reason: "already-captured", report: existing };

      const now = new Date().toISOString();
      const record = {
        schemaVersion: 1,
        reportId: String(reportId),
        capturedAt: existing?.capturedAt || now,
        updatedAt: existing ? now : null,
        reportPath: `${location.origin}${location.pathname}`,
        reportType: "circus",
        combatFormat: "5v5",
        participants: { attackers, defenders },
        reward,
        damageSummary,
        outcome,
        rounds: eventData.rounds,
        totalEvents: eventData.eventCount,
        captureDiagnostics: {
          circusDetection: detection,
          attackerFighters: attackers.length,
          defenderFighters: defenders.length,
          attackerStatsRows: attackers.reduce((sum, f) => sum + (f.rawRows?.length || 0), 0),
          defenderStatsRows: defenders.reduce((sum, f) => sum + (f.rawRows?.length || 0), 0),
          rewardCaptured: !!reward,
          damageSummaryRows: damageSummary.length,
          readiness,
          excludedArenaCharacterDoll: "1",
          captureCompleteness: readiness.complete ? "complete" : "core-only"
        },
        source: { referrerKind: reportPageReferrerKind(), pageTitle: document.title || "" }
      };
      if (existingIndex >= 0) circusCombatStore.reports.splice(existingIndex, 1, record);
      else {
        circusCombatStore.reports.unshift(record);
        if (circusCombatStore.reports.length > 500) circusCombatStore.reports.length = 500;
      }
      circusCombatStore.schemaVersion = 1;
      circusCombatStore.updatedAt = now;
      await promiseWithTimeout(saveCircusCombatStore(), CIRCUS_REPORT_CAPTURE_TIMEOUT_MS, "Circus report store save");
      if (statusEl) statusEl.textContent = existingIndex >= 0
        ? `Circus battle repaired · 5v5 · ${eventData.eventCount} events.`
        : `Circus battle captured · 5v5 · ${eventData.eventCount} events.`;
      return { captured: true, repaired: existingIndex >= 0, needsFollowup: !readiness.complete, report: record };
    } finally {
      combatCaptureInFlight = false;
    }
  }

  function dungeonReportDetection() {
    if (!isCombatReportPage()) return { isDungeon: false, source: "not-combat-report", referrerKind: reportPageReferrerKind() };
    const referrerKind = reportPageReferrerKind();
    const reportType = combatReportTypeFromUrl();
    if (reportType === "dungeon") return { isDungeon: true, source: "report-type-1-dungeon", referrerKind, reportType };
    return { isDungeon: false, source: reportType ? `report-type-${reportType}-not-dungeon` : "unknown-report-type", referrerKind, reportType };
  }

  async function loadDungeonCombatStore() {
    try {
      const result = await storageGet(dungeonCombatKey());
      const stored = result?.[dungeonCombatKey()];
      if (stored && Array.isArray(stored.reports)) {
        dungeonCombatStore = { ...stored, schemaVersion: Math.max(1, Number(stored.schemaVersion) || 1) };
        return dungeonCombatStore;
      }
    } catch (_) {}
    dungeonCombatStore = { schemaVersion: 1, reports: [], updatedAt: null };
    return dungeonCombatStore;
  }

  async function saveDungeonCombatStore() {
    if (!dungeonCombatStore) return;
    try { await storageSet({ [dungeonCombatKey()]: dungeonCombatStore }); } catch (_) {}
  }

  function dungeonReportFighterContainers(side) {
    const prefix = side === "attacker" ? "attackerCharStats" : "defenderCharStats";
    return [...document.querySelectorAll(`[id^="${prefix}"]`)]
      .filter(node => new RegExp(`^${prefix}\\d+$`).test(String(node.id || "")))
      .sort((a, b) => Number(String(a.id).match(/(\d+)$/)?.[1] || 0) - Number(String(b.id).match(/(\d+)$/)?.[1] || 0));
  }

  function dungeonReportFighterIndex(side, node) {
    const match = String(node?.id || "").match(new RegExp(`^${side}CharStats(\\d+)$`));
    if (!match) return null;
    const absolute = Number(match[1]);
    if (!Number.isFinite(absolute)) return null;
    return side === "attacker" ? absolute : absolute - 10;
  }

  async function captureDungeonCombatReport() {
    if (combatCaptureInFlight) return { captured: false, reason: "busy" };
    combatCaptureInFlight = true;
    try {
      const detection = dungeonReportDetection();
      if (!detection.isDungeon) return { captured: false, reason: "not-dungeon-report", detection };
      const reportId = reportIdFromUrl();
      if (!reportId) return { captured: false, reason: "no-report-id" };
      if (!dungeonCombatStore) await loadDungeonCombatStore();

      const attackerContainers = dungeonReportFighterContainers("attacker");
      const defenderContainers = dungeonReportFighterContainers("defender");
      const eventData = parseCombatEvents();
      const attackers = attackerContainers.map(container => {
        const fighter = parseCombatantStats(container, "attacker");
        if (!fighter) return null;
        const index = dungeonReportFighterIndex("attacker", container);
        if (index != null) fighter.name = circusReportFighterName("attacker", index) || fighter.name || `Attacker ${index}`;
        fighter.reportIndex = index;
        return fighter;
      }).filter(Boolean);
      const defenders = defenderContainers.map(container => {
        const fighter = parseCombatantStats(container, "defender");
        if (!fighter) return null;
        const index = dungeonReportFighterIndex("defender", container);
        if (index != null) fighter.name = circusReportFighterName("defender", index) || fighter.name || `Defender ${index}`;
        fighter.reportIndex = index;
        return fighter;
      }).filter(Boolean);
      const reward = parseCombatReward();
      const damageSummary = parseDungeonDamageSummary();
      const outcome = deriveDungeonOutcome(attackers, defenders);
      const minDamageRows = Math.max(1, attackers.length + defenders.length);
      const missingRequired = [];
      if (!attackerContainers.length) missingRequired.push("attacker fighter containers");
      if (!defenderContainers.length) missingRequired.push("defender fighter containers");
      if (!attackers.length) missingRequired.push("attacker stats");
      if (!defenders.length) missingRequired.push("defender stats");
      if (attackers.some(f => (f.rawRows?.length || 0) < 8)) missingRequired.push("complete attacker fighter stats");
      if (defenders.some(f => (f.rawRows?.length || 0) < 8)) missingRequired.push("complete defender fighter stats");
      if (!eventData?.rounds?.length || !eventData?.eventCount) missingRequired.push("combat events");
      if (outcome.type === "unknown") missingRequired.push("final result");
      const readiness = {
        ready: missingRequired.length === 0,
        complete: missingRequired.length === 0 && !!reward && damageSummary.length >= minDamageRows,
        missingRequired,
        missingOptional: [!reward ? "reward" : null, damageSummary.length < minDamageRows ? `damage summary (${damageSummary.length}/${minDamageRows})` : null].filter(Boolean),
        reportId: String(reportId),
        format: `5v${defenders.length}`,
        attackerFighters: attackers.length,
        defenderFighters: defenders.length,
        rounds: eventData.rounds.length,
        events: eventData.eventCount,
        outcome: { type: outcome.type, winner: outcome.winner, source: outcome.source },
        damageSummaryRows: damageSummary.length
      };
      const existingIndex = dungeonCombatStore.reports.findIndex(report => String(report.reportId) === String(reportId));
      const existing = existingIndex >= 0 ? dungeonCombatStore.reports[existingIndex] : null;
      if (!readiness.ready) return { captured: false, reason: "report-not-ready", readiness, report: existing || null };
      if (existing?.captureDiagnostics?.readiness?.complete && readiness.complete) return { captured: false, reason: "already-captured", report: existing };

      const now = new Date().toISOString();
      const record = {
        schemaVersion: 1,
        reportId: String(reportId),
        capturedAt: existing?.capturedAt || now,
        updatedAt: existing ? now : null,
        reportPath: `${location.origin}${location.pathname}`,
        reportType: "dungeon",
        combatFormat: `5v${defenders.length}`,
        participants: { attackers, defenders },
        reward,
        damageSummary,
        outcome,
        rounds: eventData.rounds,
        totalEvents: eventData.eventCount,
        captureDiagnostics: {
          dungeonDetection: detection,
          attackerFighters: attackers.length,
          defenderFighters: defenders.length,
          attackerStatsRows: attackers.reduce((sum, f) => sum + (f.rawRows?.length || 0), 0),
          defenderStatsRows: defenders.reduce((sum, f) => sum + (f.rawRows?.length || 0), 0),
          rewardCaptured: !!reward,
          damageSummaryRows: damageSummary.length,
          readiness,
          captureCompleteness: readiness.complete ? "complete" : "core-only"
        },
        source: { referrerKind: reportPageReferrerKind(), pageTitle: document.title || "" }
      };
      if (existingIndex >= 0) dungeonCombatStore.reports.splice(existingIndex, 1, record);
      else {
        dungeonCombatStore.reports.unshift(record);
        if (dungeonCombatStore.reports.length > 500) dungeonCombatStore.reports.length = 500;
      }
      dungeonCombatStore.schemaVersion = 1;
      dungeonCombatStore.updatedAt = now;
      await promiseWithTimeout(saveDungeonCombatStore(), CIRCUS_REPORT_CAPTURE_TIMEOUT_MS, "Dungeon report store save");
      if (statusEl) statusEl.textContent = existingIndex >= 0
        ? `Dungeon battle repaired · ${attackers.length}v${defenders.length} · ${eventData.eventCount} events.`
        : `Dungeon battle captured · ${attackers.length}v${defenders.length} · ${eventData.eventCount} events.`;
      return { captured: true, repaired: existingIndex >= 0, needsFollowup: !readiness.complete, report: record };
    } finally {
      combatCaptureInFlight = false;
    }
  }

  async function loadArenaCombatStore() {
    try {
      const result = await storageGet(arenaCombatKey());
      const stored = result?.[arenaCombatKey()];
      if (stored && Array.isArray(stored.reports)) {
        arenaCombatStore = { ...stored, schemaVersion: Math.max(1, Number(stored.schemaVersion) || 1) };
        return arenaCombatStore;
      }
    } catch (_) {}
    arenaCombatStore = { schemaVersion: 1, reports: [], updatedAt: null };
    return arenaCombatStore;
  }

  async function saveArenaCombatStore() {
    if (!arenaCombatStore) return;
    try { await storageSet({ [arenaCombatKey()]: arenaCombatStore }); } catch (_) {}
  }

  async function captureArenaCombatReport() {
    if (arenaCaptureInFlight) return { captured: false, reason: "busy" };
    arenaCaptureInFlight = true;
    try {
      const detection = arenaReportDetection();
      if (!detection.isArena) return { captured: false, reason: "not-arena-report", detection };
      const reportId = reportIdFromUrl();
      if (!reportId) return { captured: false, reason: "no-report-id" };
      if (!arenaCombatStore) await loadArenaCombatStore();

      const attackerContainer = document.querySelector("#attackerCharStats1");
      const defenderContainer = document.querySelector('[id^="defenderCharStats"]');
      const eventData = parseCombatEvents();
      const attacker = attackerContainer ? parseCombatantStats(attackerContainer, "attacker") : null;
      const defender = defenderContainer ? parseCombatantStats(defenderContainer, "defender") : null;
      const reward = parseCombatReward();
      const damageSummary = parseCombatDamageSummary();
      const names = deriveReportNames(reward, eventData.rounds, damageSummary);
      if (attacker) attacker.name = names.attackerName;
      if (defender) defender.name = names.defenderName;
      const outcome = deriveCombatOutcome(names.attackerName, names.defenderName, damageSummary, reward);
      const readiness = buildCombatReadiness({ reportId, reportType: "arena", attackerContainer, defenderContainer, attacker, defender, reward, damageSummary, eventData, outcome });
      const existingIndex = arenaCombatStore.reports.findIndex(report => String(report.reportId) === String(reportId));
      const existing = existingIndex >= 0 ? arenaCombatStore.reports[existingIndex] : null;
      if (!readiness.ready) return { captured: false, reason: "report-not-ready", readiness, report: existing || null };
      if (existing && existing.captureDiagnostics?.readiness?.complete && readiness.complete) {
        return { captured: false, reason: "already-captured", report: existing };
      }

      const now = new Date().toISOString();
      const record = {
        schemaVersion: 1,
        reportId: String(reportId),
        capturedAt: existing?.capturedAt || now,
        updatedAt: existing ? now : null,
        reportPath: `${location.origin}${location.pathname}`,
        reportType: "arena",
        arenaType: "provinciarum",
        participants: { attacker, defender },
        reward,
        damageSummary,
        outcome,
        rounds: eventData.rounds,
        totalEvents: eventData.eventCount,
        captureDiagnostics: {
          arenaDetection: detection,
          attackerStatsRows: attacker?.rawRows?.length || 0,
          defenderStatsRows: defender?.rawRows?.length || 0,
          rewardCaptured: !!reward,
          damageSummaryRows: damageSummary.length,
          readiness,
          captureCompleteness: readiness.complete ? "complete" : "core-only"
        },
        source: { referrerKind: reportPageReferrerKind(), pageTitle: document.title || "" }
      };

      if (existingIndex >= 0) arenaCombatStore.reports.splice(existingIndex, 1, record);
      else {
        arenaCombatStore.reports.unshift(record);
        if (arenaCombatStore.reports.length > 500) arenaCombatStore.reports.length = 500;
      }
      arenaCombatStore.schemaVersion = 1;
      arenaCombatStore.updatedAt = now;
      await saveArenaCombatStore();
      renderCombatTab();
      if (statusEl) statusEl.textContent = existingIndex >= 0
        ? `Arena battle repaired · ${names.defenderName || "Unknown opponent"}.`
        : `Arena battle captured · ${names.defenderName || "Unknown opponent"}.`;
      return { captured: true, repaired: existingIndex >= 0, needsFollowup: !readiness.complete, report: record };
    } finally {
      arenaCaptureInFlight = false;
    }
  }

  function lootSearchDialogState() {
    const candidates = [...document.querySelectorAll("#blackoutDialog")];
    const dialog = candidates.find(node => {
      const buttons = node.querySelectorAll("button.loot-button");
      const text = normalize(node.textContent || "");
      return buttons.length > 0 || node.classList.contains("loot-modal") || /Search (?:.+?)['’]?s Nest/i.test(text);
    }) || null;
    if (!dialog) return { present: false, dialog: null };
    const style = getComputedStyle(dialog);
    const visible = style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) !== 0;
    if (!visible) return { present: false, dialog: null };
    const buttons = [...dialog.querySelectorAll("button.loot-button, button")];
    const byText = text => buttons.find(button => normalize(button.textContent || "") === text) || null;
    const byActionCode = code => buttons.find(button => new RegExp(`runAction\\(this,\\s*0,\\s*[^,]+,\\s*${code}\\s*,`, "i").test(String(button.getAttribute("onclick") || ""))) || null;
    return {
      present: true,
      dialog,
      returnButton: dialog.querySelector("#back_to_safety") || byText("Return to Safety") || byActionCode(2),
      quickButton: byText("Quick Search") || byActionCode(3),
      thoroughButton: byText("Thorough Search") || byActionCode(4)
    };
  }

  async function handlePostBattleLootSearch(module, { scheduleAfterMs = 1000 } = {}) {
    if (!module || !["expedition", "dungeon"].includes(module)) return { detected: false, clicked: false };
    if (!isCombatReportPage()) return { detected: false, clicked: false };
    const relevant = module === "dungeon" ? dungeonReportDetection().isDungeon : expeditionReportDetection().isExpedition;
    if (!relevant) return { detected: false, clicked: false };
    const reportId = reportIdFromUrl();
    const state = module === "dungeon" ? autoDungeonState : autoExpeditionState;
    const lifecycle = postBattleLootLifecycle[module];
    const loot = lootSearchDialogState();

    if (reportId && state?.lastReportId && String(state.lastReportId) === String(reportId)) {
      postBattleLootLifecycle[module] = null;
      logAutoCombatDiagnostic("loot-search-stale-report-skipped", { module, reportId });
      return { detected: false, clicked: false, staleReport: true };
    }

    if (!loot.present && lifecycle?.reportId && String(lifecycle.reportId) === String(reportId || "")) {
      logAutoCombatDiagnostic("loot-search-completed", {
        module,
        reportId: reportId || null,
        action: lifecycle.action,
        elapsedMs: Date.now() - lifecycle.startedAt
      });
      postBattleLootLifecycle[module] = null;
      return { detected: false, clicked: false, completed: true };
    }
    if (!loot.present) return { detected: false, clicked: false };

    const action = currentPostBattleLootAction();
    const button = action === "quick" ? loot.quickButton : action === "thorough" ? loot.thoroughButton : loot.returnButton;
    logAutoCombatDiagnostic("loot-search-detected", {
      module,
      reportId: reportId || null,
      action,
      buttons: { return: !!loot.returnButton, quick: !!loot.quickButton, thorough: !!loot.thoroughButton }
    });

    if (!button) {
      if (state) {
        state.enabled = false;
        state.phase = "error";
        state.error = `Post-battle loot action '${action}' was not found on the loot screen.`;
        releaseAutomationNavigation(module);
        stopAutoCombatModuleTimer(module);
        if (module === "dungeon") await saveAutoDungeonState(); else await saveAutoExpeditionState();
      }
      postBattleLootLifecycle[module] = null;
      renderAutoCombatUI();
      logAutoCombatDiagnostic("loot-search-action-missing", { module, reportId: reportId || null, action });
      return { detected: true, clicked: false, error: state?.error || "Loot action control missing." };
    }

    const marker = `${module}:${reportId || "unknown"}:${action}`;
    if (loot.dialog.dataset.gaLootActionStarted === marker) {
      const current = postBattleLootLifecycle[module];
      const startedAt = Number(current?.startedAt) || Date.now();
      const elapsedMs = Date.now() - startedAt;
      if (elapsedMs > POST_BATTLE_LOOT_WAIT_TIMEOUT_MS) {
        if (state) {
          state.enabled = false;
          state.phase = "error";
          state.error = `Post-battle loot action '${action}' did not finish within ${Math.round(POST_BATTLE_LOOT_WAIT_TIMEOUT_MS / 1000)} seconds.`;
          releaseAutomationNavigation(module);
          stopAutoCombatModuleTimer(module);
          if (module === "dungeon") await saveAutoDungeonState(); else await saveAutoExpeditionState();
        }
        delete loot.dialog.dataset.gaLootActionStarted;
        postBattleLootLifecycle[module] = null;
        renderAutoCombatUI();
        logAutoCombatDiagnostic("loot-search-timeout", { module, reportId: reportId || null, action, elapsedMs });
        return { detected: true, clicked: false, timedOut: true, error: state?.error || "Loot action timed out." };
      }
      logAutoCombatDiagnostic("loot-search-awaiting-transition", { module, reportId: reportId || null, action, elapsedMs });
      scheduleAutoCombatResume(Math.min(scheduleAfterMs, 1000), "loot-search-transition");
      return { detected: true, clicked: false, awaiting: true };
    }

    loot.dialog.dataset.gaLootActionStarted = marker;
    postBattleLootLifecycle[module] = { reportId: reportId || null, action, startedAt: Date.now() };
    if (state) {
      state.phase = "handling-loot";
      state.error = `Performing post-battle loot action · ${action === "return" ? "Return to Safety" : action === "quick" ? "Quick Search" : "Thorough Search"}.`;
      if (module === "dungeon") await saveAutoDungeonState(); else await saveAutoExpeditionState();
    }
    renderAutoCombatUI();
    const clicked = await humanizedClick(button, `${module}-loot-${action}`);
    logAutoCombatDiagnostic("loot-search-click-result", { module, reportId: reportId || null, action, clicked });
    if (!clicked) {
      delete loot.dialog.dataset.gaLootActionStarted;
      postBattleLootLifecycle[module] = null;
      if (state) {
        state.phase = "waiting-report";
        state.error = "Post-battle loot action click failed; retrying.";
        if (module === "dungeon") await saveAutoDungeonState(); else await saveAutoExpeditionState();
      }
      renderAutoCombatUI();
      scheduleAutoCombatResume(500, "loot-search-click-retry");
      return { detected: true, clicked: false, error: "Loot action click failed." };
    }

    if (state) {
      state.phase = "waiting-report";
      state.error = "Waiting for the post-battle loot action to finish.";
      if (module === "dungeon") await saveAutoDungeonState(); else await saveAutoExpeditionState();
    }
    renderAutoCombatUI();
    scheduleAutoCombatResume(scheduleAfterMs, "loot-search-action-complete");
    return { detected: true, clicked: true, action };
  }

  function stopCombatCaptureObserver() {
    if (combatCaptureObserver) {
      try { combatCaptureObserver.disconnect(); } catch (_) {}
      combatCaptureObserver = null;
    }
    if (combatCaptureTimer) {
      clearTimeout(combatCaptureTimer);
      combatCaptureTimer = null;
    }
  }

  function initializePassiveCombatCapture() {
    stopCombatCaptureObserver();
    if (!isCombatReportPage()) return;

    let attempts = 0;
    let completed = false;
    let retryTimer = null;
    const maxAttempts = 30;
    const retryMs = 350;
    const finish = () => {
      completed = true;
      if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
      stopCombatCaptureObserver();
    };
    const scheduleRetry = () => {
      if (completed || retryTimer) return;
      retryTimer = setTimeout(() => {
        retryTimer = null;
        void tryCapture();
      }, retryMs);
    };
    const tryCapture = async () => {
      if (completed) return;
      if (combatCaptureInFlight) {
        scheduleRetry();
        return;
      }
      attempts += 1;
      const arena = arenaReportDetection();
      const circus = circusReportDetection();
      const dungeon = dungeonReportDetection();
      const lootModule = dungeon.isDungeon && autoDungeonState?.enabled
        ? "dungeon"
        : (!arena.isArena && !circus.isCircus && autoExpeditionState?.enabled ? "expedition" : null);
      if (lootModule) {
        const lootResult = await handlePostBattleLootSearch(lootModule);
        if (lootResult.detected) {
          finish();
          return;
        }
      }
      const result = arena.isArena
        ? await captureArenaCombatReport().catch(() => ({ captured: false, reason: "capture-error" }))
        : circus.isCircus
          ? await captureCircusCombatReport().catch(() => ({ captured: false, reason: "capture-error" }))
          : dungeon.isDungeon
            ? await captureDungeonCombatReport().catch(() => ({ captured: false, reason: "capture-error" }))
            : await captureExpeditionCombatReport().catch(() => ({ captured: false, reason: "capture-error" }));
      const reportId = reportIdFromUrl();
      if (result?.captured) {
        if (arena.isArena && arenaAutomationState?.enabled && reportId) await markArenaRunComplete(reportId);
        if (circus.isCircus && circusProvinciarumAutomationState?.enabled && reportId) await markCircusProvinciarumRunComplete(reportId);
        if (dungeon.isDungeon && autoDungeonState?.enabled && reportId) await markAutoDungeonBattleComplete(reportId, result.report || null);
        if (!arena.isArena && !circus.isCircus && !dungeon.isDungeon && autoExpeditionState?.enabled && reportId) await markAutoExpeditionRunComplete(reportId);
        if (result.needsFollowup) {
          if (attempts >= maxAttempts) {
            finish();
            return;
          }
          scheduleRetry();
        } else {
          finish();
        }
        return;
      }
      if (result?.reason === "already-captured") {
        if (arena.isArena && arenaAutomationState?.enabled && reportId) await markArenaRunComplete(reportId);
        if (circus.isCircus && circusProvinciarumAutomationState?.enabled && reportId) await markCircusProvinciarumRunComplete(reportId);
        if (dungeon.isDungeon && autoDungeonState?.enabled && reportId) await markAutoDungeonBattleComplete(reportId, result.report || null);
        if (!arena.isArena && !circus.isCircus && !dungeon.isDungeon && autoExpeditionState?.enabled && reportId) await markAutoExpeditionRunComplete(reportId);
        finish();
        return;
      }
      if (result?.reason === "not-expedition-report" || result?.reason === "not-arena-report" || result?.reason === "not-circus-report" || result?.reason === "not-dungeon-report" || result?.reason === "no-report-id") {
        finish();
        return;
      }
      if (attempts >= maxAttempts) {
        finish();
        return;
      }
      scheduleRetry();
    };

    void tryCapture();
    if (typeof MutationObserver !== "undefined" && document.body) {
      combatCaptureObserver = new MutationObserver(() => void tryCapture());
      combatCaptureObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
      combatCaptureTimer = setTimeout(finish, maxAttempts * retryMs + 1500);
    }
  }


  function arenaTooltipPairs(rawTooltip) {
    if (!rawTooltip) return [];
    try {
      const data = typeof rawTooltip === "string" ? JSON.parse(rawTooltip) : rawTooltip;
      const pairs = [];
      const walk = value => {
        if (!Array.isArray(value)) return;
        if (value.length >= 2 && typeof value[0] === "string" && (typeof value[1] === "string" || typeof value[1] === "number")) {
          pairs.push({ label: normalize(stripTags(value[0]).replace(/&nbsp;/gi, " ")), value: value[1] });
        }
        for (const child of value) walk(child);
      };
      walk(data);
      return pairs;
    } catch (_) { return []; }
  }

  function arenaTooltipValue(rawTooltip, pattern) {
    const rx = pattern instanceof RegExp ? pattern : new RegExp(pattern, "i");
    return arenaTooltipPairs(rawTooltip).find(pair => rx.test(normalize(pair.label)))?.value ?? null;
  }

  function parseAuthoritativeDinoPoints(root, rawHtml = "") {
    // Use Gladiatus' own special-stat tooltip totals. The public DinoDevs
    // PlayerStatsAPI reads the same values instead of reconstructing them from
    // individual item modifiers, which can omit combined/item-side effects.
    const readIndexed = (element, index) => {
      const raw = element?.getAttribute?.("data-tooltip") || "";
      try {
        const data = typeof raw === "string" ? JSON.parse(raw) : raw;
        const value = data?.[0]?.[index]?.[0]?.[1];
        const parsed = typeof value === "number" ? value : parseLocalizedInteger(value);
        return Number.isFinite(parsed) ? parsed : null;
      } catch (_) {
        return null;
      }
    };

    const armourTooltip = root?.querySelector?.("#char_panzer_tt[data-tooltip]") || null;
    const damageTooltip = root?.querySelector?.("#char_schaden_tt[data-tooltip]") || null;
    const avoidCritical = readIndexed(armourTooltip, 3);
    const block = readIndexed(armourTooltip, 7);
    const critical = readIndexed(damageTooltip, 6);

    if ([avoidCritical, block, critical].every(Number.isFinite)) {
      return { dinoPoints: { avoidCritical, block, critical }, source: "char-tooltip-indexed" };
    }

    // Fallback to the same narrow raw-HTML pattern used by DinoDevs.
    const decoded = String(rawHtml || "")
      .replace(/&quot;/gi, '"')
      .replace(/&#34;/gi, '"')
      .replace(/&amp;/gi, '&')
      .replace(/&#x2F;/gi, '/')
      .replace(/\\\//g, '/')
      .replace(/\\\\\//g, '/');
    const matches = [...decoded.matchAll(/",(-?\d+)\],\s*\["#BA9700","#BA9700"\]\]/gi)]
      .map(match => Number(match[1]))
      .filter(Number.isFinite);
    if (matches.length > 9) {
      return { dinoPoints: { avoidCritical: matches[7], block: matches[8], critical: matches[9] }, source: "raw-html-indexed" };
    }
    return { dinoPoints: null, source: null };
  }

  function parseArenaDisplayedCriticalPercent(root, dinoPoints, level) {
    const tooltip = root?.querySelector?.("#char_schaden_tt[data-tooltip]")?.getAttribute?.("data-tooltip") || "";
    const rows = arenaTooltipPairs(tooltip);
    let percent = null;
    const labeled = rows.find(row => /^Chance for critical damage$/i.test(normalize(row.label || "")))?.value;
    if (labeled != null) percent = parsePercentage(String(labeled));
    if (!Number.isFinite(percent)) {
      const decoded = String(tooltip)
        .replace(/&quot;/gi, '"')
        .replace(/&#34;/gi, '"')
        .replace(/&amp;/gi, '&');
      const matches = [...decoded.matchAll(/","(\d+) %"\],\["#DDDDDD","#DDDDDD"\]\]/gi)]
        .map(match => Number(match[1]))
        .filter(Number.isFinite);
      if (Number.isFinite(matches[2])) percent = matches[2];
    }
    if (!Number.isFinite(percent) || !dinoPoints || !Number.isFinite(Number(level))) return null;
    const levelFactor = Math.max(2, Number(level) - 8);
    const withoutVeteran = Math.round(Number(dinoPoints.critical) * 52 / levelFactor / 5);
    return { displayedPercent: percent, formulaWithoutVeteran: withoutVeteran, veteranDetected: percent - withoutVeteran === 10 };
  }

  function parseArenaLifePoints(root, doc, rawHtml = "") {
    const elements = [];
    const pushUnique = el => {
      if (el && !elements.includes(el)) elements.push(el);
    };
    pushUnique(root?.querySelector?.("#char_leben_tt"));
    for (const el of doc?.querySelectorAll?.("#char_leben_tt") || []) pushUnique(el);

    const parseLifeText = value => {
      const text = normalize(String(value ?? ""));
      const match = text.match(/(?:^|[^\d])([\d.,]+)\s*\\*\/\s*([\d.,]+)(?:$|[^\d])/);
      if (!match) return null;
      const current = parseLocalizedInteger(match[1]);
      const max = parseLocalizedInteger(match[2]);
      if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 1) return null;
      return { current, max };
    };

    for (const el of elements) {
      const raw = el.getAttribute("data-tooltip") || "";
      const exact = parseLifeText(arenaTooltipValue(raw, /^(?:Life points|Health|Hit points|Lebenspunkte|Can puanları|Can puani):?$/i));
      if (exact) return { ...exact, source: "char_leben_tt-labeled" };

      // The tooltip belongs specifically to the Life points row, so when the
      // label is localized or otherwise altered, accept the first value shaped
      // like current/max from that tooltip instead of depending on English text.
      for (const pair of arenaTooltipPairs(raw)) {
        const candidate = parseLifeText(pair.value);
        if (candidate) return { ...candidate, source: "char_leben_tt-value" };
      }

      // Last-resort extraction from the serialized tooltip itself.
      const fallback = parseLifeText(raw);
      if (fallback) return { ...fallback, source: "char_leben_tt-raw" };
    }

    // Network/profile responses are authoritative raw data. Do not make a
    // successful capture depend on JSON-decoding the tooltip. Extract the Life
    // Points pair directly from the raw response as a final parser-level fallback.
    const raw = String(rawHtml || "");
    if (raw) {
      const lifeScope = raw.match(/id\s*=\s*["']char_leben_tt["'][\s\S]{0,5000}/i)?.[0] || raw.slice(0, 250000);
      const decoded = lifeScope
        .replace(/&quot;/gi, '"')
        .replace(/&#34;/gi, '"')
        .replace(/&amp;/gi, '&')
        .replace(/&#x2F;/gi, '/')
        .replace(/\\\//g, '/')
        .replace(/\\\\\//g, '/');
      const lifeIndex = decoded.search(/Life\s+points\s*:/i);
      if (lifeIndex >= 0) {
        const lifeWindow = decoded.slice(lifeIndex, lifeIndex + 240);
        const match = lifeWindow.match(/([\d.,]+)\s*\\*\/\s*([\d.,]+)/);
        if (match) {
          const current = parseLocalizedInteger(match[1]);
          const max = parseLocalizedInteger(match[2]);
          if (Number.isFinite(current) && Number.isFinite(max) && max > 1) {
            return { current, max, source: "raw-html-direct" };
          }
        }
      }
    }

    return { current: null, max: null, source: null };
  }

  function parseArenaProfileDocument(html, profileUrl, expectedOpponent = null) {
    if (!html || typeof DOMParser === "undefined") return { ok: false, error: "DOMParser is unavailable." };
    const doc = new DOMParser().parseFromString(String(html), "text/html");
    const root = doc.querySelector("#charstats");
    if (!root) return { ok: false, error: "Opponent profile has no #charstats panel." };

    const name = normalize(doc.querySelector(".playername_achievement, .playername.ellipsis, .playername")?.textContent || "");
    const level = parseLocalizedInteger(root.querySelector("#char_level")?.textContent || "");
    const life = parseArenaLifePoints(root, doc, html);
    let dollId = null;
    let roleKey = "dps";
    let roleRaw = null;
    let roleTooltip = null;
    try { dollId = new URL(profileUrl || location.href, location.href).searchParams.get("doll") || null; } catch (_) {}
    dollId = dollId || root.ownerDocument?.querySelector("#plDoll")?.value || doc.querySelector("#plDoll")?.value || null;
    // Some Gladiatus profile responses omit the hidden #plDoll input even
    // though the page still declares the selected doll in its bootstrap
    // JavaScript. Use that server-provided declaration before treating the
    // doll as unknown.
    if (!dollId) {
      const declaredDoll = String(html).match(/\b(?:var|let|const)\s+dollId\s*=\s*["\']?(\d+)["\']?\s*;/i);
      if (declaredDoll) dollId = declaredDoll[1];
    }
    const activeDoll = doc.querySelector(".charmercsel.active .charmercpic") || (dollId ? doc.querySelector(`.charmercpic.doll${CSS.escape(String(dollId))}`) : null);
    if (activeDoll) {
      const tooltip = activeDoll.getAttribute("data-tooltip") || "";
      const first = arenaTooltipPairs(tooltip)[0]?.label || null;
      roleTooltip = normalize(first || "") || null;
      roleRaw = normalize(String(first || "").replace(/<[^>]+>/g, " ")) || null;
      if (/heal group members/i.test(roleTooltip || "")) roleKey = "healer";
      else if (/direct attention to oneself/i.test(roleTooltip || "")) roleKey = "tank";
      else if (/dish out damage/i.test(roleTooltip || "")) roleKey = "dps";
      const className = normalize(String(roleTooltip || "").split(/quest:/i)[0]) || null;
      if (className) roleRaw = className;
    }

    const out = {
      name: name || expectedOpponent?.name || null,
      level,
      lifeCurrent: life.current,
      lifeMax: life.max,
      lifeSource: life.source,
      lifeRaw: life.raw || null,
      dollId: dollId ? String(dollId) : null,
      turmaRole: roleKey,
      roleRaw,
      roleTooltip,
      strength: null, dexterity: null, agility: null, constitution: null, charisma: null, intelligence: null,
      armour: parseLocalizedInteger(root.querySelector("#char_panzer")?.textContent || ""),
      damageMin: null, damageMax: null, damageRange: null,
      healing: parseLocalizedInteger(root.querySelector("#char_healing")?.textContent || ""),
      hitChance: null, doubleHit: null, criticalChance: null, blockChance: null, criticalAvoidance: null, criticalHealingValue: null, threat: null,
      dinoPoints: null,
      dinoPointItemBonuses: null,
      dinoPointSource: null,
      buffs: { minerva: false, mars: false, apollo: false, honour_veteran: false, honour_destroyer: false },
      itemModifiers: {
        criticalAttack: { flat: 0, percent: 0 },
        blockValue: { flat: 0, percent: 0 },
        hardening: { flat: 0, percent: 0 }
      }
    };

    const statMap = [
      ["strength", "#char_f0"], ["dexterity", "#char_f1"], ["agility", "#char_f2"],
      ["constitution", "#char_f3"], ["charisma", "#char_f4"], ["intelligence", "#char_f5"]
    ];
    for (const [key, selector] of statMap) out[key] = parseLocalizedInteger(root.querySelector(selector)?.textContent || "");

    for (const row of root.querySelectorAll(".charstats_bg2")) {
      const label = normalize(row.querySelector(".charstats_text, .charstats_value21")?.textContent || "").toLowerCase();
      const value = normalize(row.querySelector(".charstats_value22, .charstats_value3")?.textContent || "");
      if (!label || !value) continue;
      if (label === "hit chance") out.hitChance = parsePercentage(value);
      else if (label === "double hit") out.doubleHit = parsePercentage(value);
      else if (label === "chance for critical damage") out.criticalChance = parsePercentage(value);
      else if (label === "chance to block a hit") out.blockChance = parsePercentage(value);
      else if (label === "chance of avoiding critical hits") out.criticalAvoidance = parsePercentage(value);
      else if (label === "critical healing value") out.criticalHealingValue = parsePercentage(value);
      else if (label === "threat") out.threat = parseLocalizedInteger(value);
      else if (label === "healing" && !Number.isFinite(Number(out.healing))) out.healing = parseLocalizedInteger(value);
    }

    const damageText = normalize(root.querySelector("#char_schaden")?.textContent || "");
    const damage = parseDamageRangeText(damageText);
    if (damage) {
      out.damageMin = damage.min;
      out.damageMax = damage.max;
      out.damageRange = damage.text;
    }

    const itemElements = Array.from(doc.querySelectorAll('#char [data-tooltip][data-item-id]'));
    for (const item of itemElements) {
      for (const pair of arenaTooltipPairs(item.getAttribute("data-tooltip") || "")) {
        const label = normalize(String(pair.label || ""));
        const valMatch = label.match(/^(Critical attack(?: value)?|Block(?: value)?|Hardening|Resilience)\s*([+-]?\d+(?:[.,]\d+)?)\s*%?$/i);
        if (!valMatch) continue;
        const keyName = valMatch[1].toLowerCase();
        const value = Number(valMatch[2].replace(",", "."));
        if (!Number.isFinite(value)) continue;
        if (keyName.startsWith("critical")) out.itemModifiers.criticalAttack.flat += value;
        else if (keyName.startsWith("block")) out.itemModifiers.blockValue.flat += value;
        else out.itemModifiers.hardening.flat += value;
      }
    }

    const authoritativeDino = parseAuthoritativeDinoPoints(root, html);
    if (authoritativeDino.dinoPoints) {
      out.dinoPoints = {
        avoidCritical: Math.max(0, Number(authoritativeDino.dinoPoints.avoidCritical)),
        block: Math.max(0, Number(authoritativeDino.dinoPoints.block)),
        critical: Math.max(0, Number(authoritativeDino.dinoPoints.critical))
      };
      out.dinoPointSource = authoritativeDino.source;
      out.dinoPointItemBonuses = {
        avoidCritical: Math.max(0, out.dinoPoints.avoidCritical - Math.floor(Number(out.agility) / 10)),
        block: Math.max(0, out.dinoPoints.block - Math.floor(Number(out.strength) / 10)),
        critical: Math.max(0, out.dinoPoints.critical - Math.floor(Number(out.dexterity) / 10))
      };
      const critDetection = parseArenaDisplayedCriticalPercent(root, out.dinoPoints, out.level);
      if (critDetection) {
        out.criticalChance = critDetection.displayedPercent;
        out.buffs.honour_veteran = critDetection.veteranDetected;
      }
    } else {
      out.dinoPoints = {
        avoidCritical: Math.max(0, Math.floor(Number(out.agility) / 10) + Number(out.itemModifiers.hardening.flat || 0)),
        block: Math.max(0, Math.floor(Number(out.strength) / 10) + Number(out.itemModifiers.blockValue.flat || 0)),
        critical: Math.max(0, Math.floor(Number(out.dexterity) / 10) + Number(out.itemModifiers.criticalAttack.flat || 0))
      };
      out.dinoPointItemBonuses = {
        avoidCritical: Number(out.itemModifiers.hardening.flat || 0),
        block: Number(out.itemModifiers.blockValue.flat || 0),
        critical: Number(out.itemModifiers.criticalAttack.flat || 0)
      };
      out.dinoPointSource = "item-modifier-fallback";
    }

    const validCore = ["level","lifeCurrent","lifeMax","strength","dexterity","agility","constitution","charisma","intelligence","armour","damageMin","damageMax"];
    const missing = validCore.filter(key => !Number.isFinite(Number(out[key])));
    if (Number.isFinite(Number(out.lifeMax)) && Number(out.lifeMax) <= 1) missing.push("lifeMax(valid > 1)");
    if (missing.length) return { ok: false, error: `${out.name || "Opponent"} profile is missing required combat data: ${missing.join(", ")}`, stats: out, missing, name: out.name };

    return {
      ok: true,
      name: out.name,
      stats: out,
      profileUrl: profileUrl || null,
      expectedPlayerId: expectedOpponent?.playerId || null,
      live: false,
      capturedAt: new Date().toISOString()
    };
  }

  function buildArenaOpponentStandardProfileUrl(profileUrl, playerId) {
    try {
      const u = new URL(profileUrl || location.href, location.href);
      u.searchParams.set("mod", "player");
      if (playerId != null && String(playerId)) u.searchParams.set("p", String(playerId));
      // Arena simulations must always use the opponent's standard/main
      // character (doll 1). Alternate dolls such as Druid Master are valid
      // Circus Provinciarum fighters, but are never valid Arena opponents.
      u.searchParams.set("doll", "1");
      return u.href;
    } catch (_) {
      return null;
    }
  }

  async function fetchArenaOpponentProfile(opponent) {
    if (!opponent?.profileUrl) return { ok: false, error: "No opponent profile URL." };
    const profileUrl = buildArenaOpponentStandardProfileUrl(opponent.profileUrl, opponent.playerId);
    if (!profileUrl) return { ok: false, error: "Could not construct the standard Arena opponent profile URL." };
    try {
      const response = await runtimeSend({ type: "FETCH_GLADIATUS_PROFILE", url: profileUrl });
      if (!response?.ok || typeof response.html !== "string") {
        return { ok: false, error: response?.error || "Opponent profile request failed.", profileUrl };
      }

      const finalUrl = response.finalUrl || profileUrl;
      try {
        const final = new URL(finalUrl, profileUrl);
        const returnedPlayerId = final.searchParams.get("p");
        if (returnedPlayerId && String(returnedPlayerId) !== String(opponent.playerId)) {
          return {
            ok: false,
            error: `Arena opponent profile returned player ${returnedPlayerId} instead of ${opponent.playerId}.`,
            profileUrl, finalUrl
          };
        }
        const returnedDollId = final.searchParams.get("doll");
        if (returnedDollId && String(returnedDollId) !== "1") {
          return {
            ok: false,
            error: `Arena opponent profile returned doll ${returnedDollId} instead of standard doll 1.`,
            profileUrl, finalUrl
          };
        }
      } catch (_) {}

      // Gladiatus may strip the doll query parameter from the final/redirected URL.
      // Parse with the explicit requested Arena profile URL so doll=1 remains
      // authoritative for this Arena-only fetch. Circus Provinciarum uses its
      // own fetchCircusProvinciarumDoll() path and is intentionally untouched.
      const parsed = parseArenaProfileDocument(response.html, profileUrl, opponent);
      if (!parsed?.ok) return { ...parsed, profileUrl, finalUrl };

      // Validate the character selected inside the returned document as well
      // as the request URL. This catches servers/pages that ignore or rewrite
      // the doll query parameter and would otherwise feed a mercenary profile
      // into the Arena simulator.
      if (String(parsed.dollId || "") !== "1") {
        // The explicit Arena request is the authoritative selector when the
        // returned document omits all doll markers. Do not reject a complete
        // main-character profile merely because Gladiatus stripped #plDoll and
        // its bootstrap declaration. A contradictory explicit doll marker is
        // still rejected.
        const requestedDollId = (() => {
          try { return new URL(profileUrl, location.href).searchParams.get("doll") || null; } catch (_) { return null; }
        })();
        if (!parsed.dollId && String(requestedDollId || "") === "1") {
          parsed.dollId = "1";
          logAutoCombatDiagnostic("arena-opponent-profile-doll-inferred-from-request", {
            opponent: { key: opponent.key, name: opponent.name, playerId: opponent.playerId },
            requestedDollId: "1",
            finalProfileUrl: finalUrl
          });
        } else {
          return {
            ok: false,
            error: `Arena opponent profile resolved to doll ${parsed.dollId || "unknown"} instead of standard doll 1.`,
            profileUrl,
            finalUrl,
            stats: parsed.stats || null
          };
        }
      }

      logAutoCombatDiagnostic("arena-opponent-profile-validated", {
        opponent: { key: opponent.key, name: opponent.name, playerId: opponent.playerId },
        requestedDollId: "1",
        returnedDollId: parsed.dollId,
        requestedProfileUrl: profileUrl,
        finalProfileUrl: finalUrl,
        capturedName: parsed.name,
        capturedLevel: parsed.stats?.level ?? null
      });

      return { ...parsed, profileUrl, finalUrl };
    } catch (error) {
      return { ok: false, error: error?.message || String(error), profileUrl };
    }
  }

  function arenaAnalysisSetSignature(opponents) {
    return opponents.map(op => op.key).sort().join("||");
  }

  async function loadArenaOpponentAnalysisStore() {
    try {
      const result = await storageGet(arenaOpponentAnalysisKey());
      const stored = result?.[arenaOpponentAnalysisKey()];
      if (stored && typeof stored === "object") {
        arenaOpponentAnalysisStore = {
          schemaVersion: 3,
          updatedAt: stored.updatedAt || null,
          setSignature: stored.setSignature || null,
          analysisSeedBase: Number.isFinite(Number(stored.analysisSeedBase)) ? Number(stored.analysisSeedBase) : null,
          playerProfile: stored.playerProfile && typeof stored.playerProfile === "object" ? { ...stored.playerProfile } : null,
          opponents: stored.opponents && typeof stored.opponents === "object" ? { ...stored.opponents } : {}
        };
        return arenaOpponentAnalysisStore;
      }
    } catch (_) {}
    arenaOpponentAnalysisStore = { schemaVersion: 2, updatedAt: null, setSignature: null, playerProfile: null, opponents: {} };
    return arenaOpponentAnalysisStore;
  }

  async function saveArenaOpponentAnalysisStore() {
    arenaOpponentAnalysisStore.updatedAt = new Date().toISOString();
    try { await storageSet({ [arenaOpponentAnalysisKey()]: arenaOpponentAnalysisStore }); } catch (_) {}
  }

  async function withArenaAnalysisTimeout(promise, timeoutMs, label) {
    let timer = null;
    try {
      return await Promise.race([
        Promise.resolve(promise),
        new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error(`${label} timed out after ${Math.round(timeoutMs / 1000)}s.`)), timeoutMs);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  function buildOwnArenaProfileUrl(playerId) {
    const u = new URL('/game/index.php', location.href);
    u.searchParams.set('mod', 'player');
    u.searchParams.set('p', String(playerId));
    u.searchParams.set('doll', '1');
    const sh = new URL(location.href).searchParams.get('sh');
    if (sh) u.searchParams.set('sh', sh);
    return u.href;
  }

  async function freshMainArenaStatsForAnalysis() {
    const ping = await withArenaAnalysisTimeout(runtimeSend({ type: "PING" }), 5000, "Live character check");
    const character = ping?.character || null;
    const playerId = character?.playerId ? String(character.playerId) : null;
    if (!playerId) throw new Error("Could not determine the main character's player ID from the current Gladiatus page.");

    // Arena pages can report an unrelated/active mercenary doll through #doll.
    // Never use that value to choose the player profile. Fetch the account's
    // explicit doll=1 profile and use its combat stats as the authoritative input.
    const profileUrl = buildOwnArenaProfileUrl(playerId);
    const fetched = await withArenaAnalysisTimeout(
      runtimeSend({ type: "FETCH_GLADIATUS_PROFILE", url: profileUrl }),
      10000,
      "Main-character profile request"
    );
    if (!fetched?.ok || typeof fetched.html !== "string") {
      throw new Error(fetched?.error || "Could not fetch the main-character profile.");
    }

    const finalUrl = fetched.finalUrl || profileUrl;
    try {
      const returnedPlayerId = new URL(finalUrl).searchParams.get("p");
      if (returnedPlayerId && String(returnedPlayerId) !== playerId) {
        throw new Error(`Main-character profile request returned player ${returnedPlayerId} instead of ${playerId}.`);
      }
    } catch (error) {
      if (error?.message?.startsWith("Main-character profile request")) throw error;
    }
    const parsed = parseArenaProfileDocument(fetched.html, finalUrl, { playerId, name: character?.name || null });
    if (!parsed?.ok) throw new Error(parsed?.error || "Main-character profile is missing required combat data.");

    const state = {
      ...(ping?.state && typeof ping.state === "object" ? ping.state : {}),
      ...parsed.stats,
      name: parsed.name || character?.name || "Main Character",
      playerId,
      dollId: "1",
      sourceProfileUrl: finalUrl,
      freshProfileCapturedAt: parsed.capturedAt
    };
    if (!currentStatsAreComplete(state)) {
      throw new Error("Fresh main-character stats are incomplete; the Arena simulation will not fall back to cached stats.");
    }
    // Arena pages may represent a mercenary/alternate doll in #doll. Do not
    // route this fresh main-character capture through acceptCurrentStatsState(),
    // because that function intentionally keys updates to the live document.
    // Save the explicit doll=1 result directly into the main-character slot.
    await loadCharacterProfileStore();
    const previous = characterProfileStore.characters?.["1"] || { schemaVersion: 1, dollId: "1" };
    const now = new Date().toISOString();
    characterProfileStore.characters["1"] = {
      ...previous,
      schemaVersion: 1,
      dollId: "1",
      playerId,
      name: state.name || previous.name || null,
      className: previous.className || character?.className || "Standard Battle",
      roleKey: previous.roleKey || character?.roleKey || "main",
      roleRaw: previous.roleRaw || character?.roleRaw || "Standard Battle",
      roleTooltip: previous.roleTooltip || character?.roleTooltip || null,
      url: finalUrl,
      stats: {
        ...(previous.stats || {}),
        ...state,
        statDetails: { ...(previous.stats?.statDetails || {}), ...(state?.statDetails || {}) }
      },
      statsUpdatedAt: now,
      capturedAt: previous.capturedAt || now,
      equipment: previous.equipment || {},
      equipmentUpdatedAt: previous.equipmentUpdatedAt || previous.capturedAt || now
    };
    await saveCharacterProfileStore();
    const mergedState = {
      ...(previous.stats || {}),
      ...state,
      statDetails: { ...(previous.stats?.statDetails || {}), ...(state?.statDetails || {}) }
    };
    latestParsedState = { ...mergedState };
    return { stats: { ...mergedState }, character: { ...character, name: state.name, playerId, dollId: "1" }, profile: parsed.stats, profileUrl: finalUrl };
  }

  function mainArenaSimulatorProfile(liveStats = null, liveHp = null) {
    const main = characterProfileStore.characters?.["1"];
    const stats = liveStats && typeof liveStats === "object" ? liveStats : main?.stats;
    if (!main || !stats || !currentStatsAreComplete(stats)) return null;
    const engine = simulatorEngine();
    if (!engine) return null;
    const profile = engine.buildProfileFromSnapshot(main.equipment || {}, stats, {
      name: main.name || stats.name || "Main Character",
      recalculateDerived: false
    });
    if (liveHp && Number.isFinite(liveHp.current) && Number.isFinite(liveHp.max)) {
      profile.lifeCurrent = Math.max(1, Math.min(profile.lifeMax, Number(liveHp.current)));
      profile.lifeMax = Math.max(profile.lifeMax, Number(liveHp.max));
    }
    profile.liveStatsCapturedAt = new Date().toISOString();
    profile.liveStatsSource = "PING";
    profile.sourceDollId = "1";
    return profile;
  }

  function arenaSimulationCount() {
    return globalSimulationCount();
  }

  function arenaSimulationSeedForOpponent(opponent, seedBase = 0) {
    let hash = 2166136261;
    const text = `${String(opponent?.key || "")}|${String(seedBase || 0)}`;
    for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
    return (hash >>> 0) || 1;
  }

  // Simulation caches are deliberately short-lived. A cached matchup may become
  // invalid after equipment/stat changes or after another module changes the
  // player's current HP. We also fingerprint the actual simulation inputs.
  const ARENA_ANALYSIS_CACHE_MAX_AGE_MS = 15000;
  const CIRCUS_ANALYSIS_CACHE_MAX_AGE_MS = 15000;

  function stableSimulationSerialize(value) {
    if (value === null) return "null";
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "string") return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(stableSimulationSerialize).join(",")}]`;
    if (typeof value === "object") {
      return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableSimulationSerialize(value[key])}`).join(",")}}`;
    }
    return JSON.stringify(String(value));
  }

  function simulationInputFingerprint(value) {
    let hash = 2166136261;
    const text = stableSimulationSerialize(value);
    for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  function newSimulationSeedBase() {
    try {
      if (globalThis.crypto?.getRandomValues) {
        const values = new Uint32Array(2);
        globalThis.crypto.getRandomValues(values);
        return ((values[0] ^ values[1]) >>> 0) || 1;
      }
    } catch (_) {}
    return ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0) || 1;
  }

  function arenaPlayerSimulationFingerprint(stats, equipment) {
    return simulationInputFingerprint({
      stats: {
        level: stats?.level, strength: stats?.strength, dexterity: stats?.dexterity, agility: stats?.agility,
        constitution: stats?.constitution, charisma: stats?.charisma, intelligence: stats?.intelligence,
        armour: stats?.armour, damageMin: stats?.damageMin, damageMax: stats?.damageMax, healing: stats?.healing,
        dinoPoints: stats?.dinoPoints || null, dinoPointItemBonuses: stats?.dinoPointItemBonuses || null,
        buffs: stats?.buffs || null,
        itemModifiers: stats?.itemModifiers || null
      },
      equipment: equipment || {}
    });
  }

  function circusTeamSimulationFingerprint(roster) {
    return simulationInputFingerprint((Array.isArray(roster) ? roster : []).map(profile => ({
      dollId: profile?.dollId, name: profile?.name, roleKey: profile?.roleKey,
      stats: profile?.stats || {}, equipment: profile?.equipment || {}
    })).sort((a, b) => String(a.dollId).localeCompare(String(b.dollId))));
  }

  function arenaOpponentSimulationFingerprint(stats) {
    return simulationInputFingerprint({
      level: stats?.level, strength: stats?.strength, dexterity: stats?.dexterity, agility: stats?.agility,
      constitution: stats?.constitution, charisma: stats?.charisma, intelligence: stats?.intelligence,
      armour: stats?.armour, damageMin: stats?.damageMin, damageMax: stats?.damageMax, lifeMax: stats?.lifeMax,
      dinoPoints: stats?.dinoPoints || null, dinoPointItemBonuses: stats?.dinoPointItemBonuses || null,
      buffs: stats?.buffs || null, itemModifiers: stats?.itemModifiers || null
    });
  }

  function calculateArenaInputChance(player, opponent, key) {
    try {
      const engine = simulatorEngine();
      if (!engine || typeof engine.calculateChancesFromProfiles !== "function") return null;
      const chances = engine.calculateChancesFromProfiles({ player, opponent });
      return Number.isFinite(Number(chances?.[key])) ? Number(chances[key]) : null;
    } catch (_) {
      return null;
    }
  }

  async function performArenaOpponentAnalysis(opponents, preparedContext = null) {
    arenaAnalysisBusy = true;
    renderNativeOpponentWinRateBadges();
    renderAutoCombatUI();
    try {
      await loadCharacterProfileStore();
      await loadArenaOpponentAnalysisStore();
      const hp = preparedContext?.playerHp || readLiveHpSnapshot();
      const mainProfile = characterProfileStore.characters?.["1"] || null;
      const missingMainData = characterProfileMissingArenaSimulationData(mainProfile);
      if (!mainProfile || missingMainData.length) return { ok: false, reason: "main-profile-unavailable", error: `Complete saved main-character stats/equipment are required for Arena simulation. Missing: ${missingMainData.join(", ") || "saved profile"}.`, playerHp: hp };
      const playerStats = preparedContext?.playerStats || mainProfile.stats;
      const playerCurrent = mainArenaSimulatorProfile(playerStats, hp);
      const playerFingerprint = preparedContext?.playerFingerprint || arenaPlayerSimulationFingerprint(playerStats, mainProfile.equipment || {});
      const engine = simulatorEngine();
      if (!playerCurrent || !engine) {
        return { ok: false, reason: "main-profile-unavailable", error: "Complete main-character stats/equipment are required before Arena simulation.", playerHp: hp };
      }

      const setSignature = arenaAnalysisSetSignature(opponents);
      const analysisSeedBase = newSimulationSeedBase();
      const results = {};
      let failures = 0;
      for (const opponent of opponents) {
        const fetched = await withArenaAnalysisTimeout(fetchArenaOpponentProfile(opponent), 12000, `Opponent profile (${opponent.name})`);
        if (!fetched.ok) {
          failures++;
          const capturedAt = new Date().toISOString();
          results[opponent.key] = {
            key: opponent.key, name: opponent.name, playerId: opponent.playerId, province: opponent.province,
            level: opponent.level, ok: false, unavailable: true, failureStage: "profile-capture",
            error: fetched.error || "Could not capture opponent profile.", capturedAt
          };
          logAutoCombatDiagnostic("arena-opponent-analysis-failure", {
            opponent: { key: opponent.key, name: opponent.name, playerId: opponent.playerId },
            stage: "profile-capture", error: results[opponent.key].error
          });
          continue;
        }
        try {
          const enemy = fetched.stats;
          const opponentFingerprint = arenaOpponentSimulationFingerprint(enemy);
          const currentPlayer = { ...playerCurrent };
          const currentSeed = arenaSimulationSeedForOpponent(opponent, analysisSeedBase);
          const count = arenaSimulationCount();
          const simulationOptions = { simulations: count, seed: currentSeed, maxRounds: ARENA_SIMULATION_ROUNDS };
          const current = engine.simulateBatch({ player: currentPlayer, enemy, ...simulationOptions, lifeMode: "current" });
          const full = engine.simulateBatch({ player: currentPlayer, enemy, ...simulationOptions, lifeMode: "full" });
          const currentWinRate = Number(current?.rates?.win || 0);
          const fullWinRate = Number(full?.rates?.win || 0);
          results[opponent.key] = {
            key: opponent.key,
            name: opponent.name,
            playerId: opponent.playerId,
            province: opponent.province,
            level: opponent.level,
            ok: true,
            profile: { ...enemy },
            capturedStats: {
              level: enemy.level,
              lifeCurrent: enemy.lifeCurrent,
              lifeMax: enemy.lifeMax,
              lifeSource: enemy.lifeSource || null,
              strength: enemy.strength,
              dexterity: enemy.dexterity,
              agility: enemy.agility,
              constitution: enemy.constitution,
              charisma: enemy.charisma,
              intelligence: enemy.intelligence,
              armour: enemy.armour,
                damageMin: enemy.damageMin,
              damageMax: enemy.damageMax,
              dinoPoints: enemy.dinoPoints || null,
              dinoPointItemBonuses: enemy.dinoPointItemBonuses || null,
              buffs: enemy.buffs || null,
              itemModifiers: enemy.itemModifiers
            },
            source: { profileUrl: fetched.profileUrl || opponent.profileUrl, finalProfileUrl: fetched.finalUrl || null, requestedDollId: "1", playerId: opponent.playerId, province: opponent.province, capturedAt: fetched.capturedAt },
            currentHp: { player: currentPlayer.lifeCurrent, playerMax: currentPlayer.lifeMax, enemy: enemy.lifeCurrent, enemyMax: enemy.lifeMax },
            simulations: count,
            maxRounds: ARENA_SIMULATION_ROUNDS,
            seed: currentSeed,
            playerFingerprint,
            opponentFingerprint,
            current: { winRate: currentWinRate, lossRate: Number(current?.rates?.loss || 0), unknownRate: Number(current?.rates?.unknown || 0), avgPlayerDamage: Number(current?.averages?.playerDamage || 0), avgEnemyDamage: Number(current?.averages?.enemyDamage || 0) },
            full: { winRate: fullWinRate, lossRate: Number(full?.rates?.loss || 0), unknownRate: Number(full?.rates?.unknown || 0) },
            hpImpact: Math.max(0, fullWinRate - currentWinRate),
            analyzedAt: new Date().toISOString()
          };
          results[opponent.key].profile.itemModifiers = enemy.itemModifiers;
          logAutoCombatDiagnostic("arena-opponent-analysis-input", {
            opponent: { key: opponent.key, name: opponent.name, playerId: opponent.playerId },
            player: {
              level: playerCurrent.level, lifeCurrent: playerCurrent.lifeCurrent, lifeMax: playerCurrent.lifeMax,
              strength: playerCurrent.strength, dexterity: playerCurrent.dexterity, agility: playerCurrent.agility,
              charisma: playerCurrent.charisma, intelligence: playerCurrent.intelligence,
              damageMin: playerCurrent.damageMin, damageMax: playerCurrent.damageMax, armour: playerCurrent.armour,
              dinoPoints: playerCurrent.dinoPoints, buffs: playerCurrent.buffs,
              hitChance: calculateArenaInputChance(playerCurrent, enemy, "hitChance"),
              doubleHit: calculateArenaInputChance(playerCurrent, enemy, "doubleHit"),
              criticalChance: calculateArenaInputChance(playerCurrent, enemy, "criticalChance"),
              blockChance: calculateArenaInputChance(playerCurrent, enemy, "blockChance"),
              criticalAvoidance: calculateArenaInputChance(enemy, playerCurrent, "criticalAvoidance")
            },
            opponentProfile: {
              level: enemy.level, lifeCurrent: enemy.lifeCurrent, lifeMax: enemy.lifeMax,
              strength: enemy.strength, dexterity: enemy.dexterity, agility: enemy.agility,
              charisma: enemy.charisma, intelligence: enemy.intelligence,
              damageMin: enemy.damageMin, damageMax: enemy.damageMax, armour: enemy.armour,
              dinoPoints: enemy.dinoPoints, buffs: enemy.buffs,
              fingerprint: opponentFingerprint
            },
            current: { winRate: currentWinRate, lossRate: Number(current?.rates?.loss || 0), unknownRate: Number(current?.rates?.unknown || 0) },
            full: { winRate: fullWinRate, lossRate: Number(full?.rates?.loss || 0), unknownRate: Number(full?.rates?.unknown || 0) },
            simulations: count, seed: currentSeed
          });
        } catch (error) {
          failures++;
          const errorText = `Simulation failed: ${error?.message || String(error)}`;
          results[opponent.key] = { key: opponent.key, name: opponent.name, playerId: opponent.playerId, province: opponent.province, level: opponent.level, ok: false, unavailable: true, failureStage: "simulation", error: errorText, capturedAt: new Date().toISOString() };
          logAutoCombatDiagnostic("arena-opponent-analysis-failure", {
            opponent: { key: opponent.key, name: opponent.name, playerId: opponent.playerId },
            stage: "simulation", error: errorText, stack: error?.stack || null
          });
        }
      }
      arenaOpponentAnalysisStore = {
        schemaVersion: 3,
        updatedAt: new Date().toISOString(),
        setSignature,
        analysisSeedBase,
        playerProfile: {
          name: playerCurrent.name,
          sourceDollId: "1",
          playerId: mainProfile.playerId || null,
          simulationFingerprint: playerFingerprint,
          simulationHpCurrent: Number.isFinite(Number(hp?.current)) ? Number(hp.current) : null,
          simulationHpMax: Number.isFinite(Number(hp?.max)) ? Number(hp.max) : null,
          sourceProfileUrl: mainProfile.url || null,
          liveStatsCapturedAt: playerCurrent.liveStatsCapturedAt,
          stats: { ...(mainProfile.stats || {}) },
          profile: { ...playerCurrent, equipment: mainProfile.equipment || {}, itemModifiers: playerCurrent.itemModifiers }
        },
        opponents: results
      };
      await saveArenaOpponentAnalysisStore();
      try { renderCombatTab(); } catch (_) {}
      const completed = Object.values(results).filter(x => x?.ok).length;
      const partial = completed > 0 && completed < opponents.length;
      if (partial) {
        logAutoCombatDiagnostic("arena-opponent-analysis-partial", {
          completed, total: opponents.length, failures,
          usableTargets: Object.values(results).filter(x => x?.ok).map(x => ({ key: x.key, name: x.name, winRate: x.current?.winRate ?? null })),
          failedTargets: Object.values(results).filter(x => !x?.ok).map(x => ({ key: x.key, name: x.name, stage: x.failureStage || null, error: x.error || null }))
        });
      }
      return { ok: completed > 0, reason: partial ? "partial-opponents" : completed === 0 ? "no-usable-opponents" : null, completed, total: opponents.length, failures, playerHp: hp, setSignature, results, playerProfile: arenaOpponentAnalysisStore.playerProfile };
    } catch (error) {
      logAutoCombatDiagnostic("arena-analysis-error", { error: error?.message || String(error), stack: error?.stack || null });
      return { ok: false, reason: "analysis-error", error: error?.message || String(error) };
    } finally {
      arenaAnalysisBusy = false;
      renderNativeOpponentWinRateBadges();
      renderAutoCombatUI();
    }
  }

  function arenaAnalysisCacheIsCurrent(opponents, context = null) {
    if (!Array.isArray(opponents) || !opponents.length) return false;
    if (arenaOpponentAnalysisStore?.setSignature !== arenaAnalysisSetSignature(opponents)) return false;
    const simulations = arenaSimulationCount();
    const updatedAtMs = Date.parse(String(arenaOpponentAnalysisStore?.updatedAt || ""));
    if (!Number.isFinite(updatedAtMs) || Date.now() - updatedAtMs > ARENA_ANALYSIS_CACHE_MAX_AGE_MS) return false;
    const playerProfile = arenaOpponentAnalysisStore?.playerProfile || null;
    if (context?.playerFingerprint && String(playerProfile?.simulationFingerprint || "") !== String(context.playerFingerprint)) return false;
    if (context?.playerHp?.current != null && Number.isFinite(Number(playerProfile?.simulationHpCurrent))
      && Number(context.playerHp.current) !== Number(playerProfile.simulationHpCurrent)) return false;
    if (context?.playerHp?.max != null && Number.isFinite(Number(playerProfile?.simulationHpMax))
      && Number(context.playerHp.max) !== Number(playerProfile.simulationHpMax)) return false;
    return opponents.every(op => {
      const result = arenaOpponentAnalysisStore?.opponents?.[op.key];
      if (result?.ok === true) {
        return Number(result.simulations) === simulations
          && Number.isFinite(Number(result.current?.winRate))
          && String(result.playerFingerprint || "") === String(context?.playerFingerprint || playerProfile?.simulationFingerprint || "");
      }
      return result?.unavailable === true && typeof result.error === "string" && !!result.error;
    });
  }

  async function analyzeCurrentArenaOpponents() {
    if (!isProvinciarumArenaPage()) return { ok: false, reason: "not-arena-page" };
    const opponents = parseArenaOpponents();
    if (!opponents.length) return { ok: false, reason: "no-opponents" };
    if (arenaAnalysisPromise) return arenaAnalysisPromise;

    arenaAnalysisPromise = (async () => {
      let freshMain = null;
      try {
        freshMain = await freshMainArenaStatsForAnalysis();
      } catch (error) {
        logAutoCombatDiagnostic("arena-analysis-fresh-player-capture-failed", { error: error?.message || String(error), stack: error?.stack || null });
        return { ok: false, reason: "main-profile-refresh-failed", error: error?.message || String(error) };
      }
      await loadCharacterProfileStore();
      const playerHp = readLiveHpSnapshot();
      const equipment = characterProfileStore.characters?.["1"]?.equipment || {};
      const playerFingerprint = arenaPlayerSimulationFingerprint(freshMain?.stats, equipment);
      const context = { playerStats: freshMain?.stats, playerHp, playerFingerprint };
      await loadArenaOpponentAnalysisStore();
      if (arenaAnalysisCacheIsCurrent(opponents, context)) {
        renderNativeOpponentWinRateBadges();
        return {
          ok: true,
          reused: true,
          reason: "cached",
          completed: Object.values(arenaOpponentAnalysisStore.opponents || {}).filter(x => x?.ok).length,
          total: opponents.length,
          failures: Object.values(arenaOpponentAnalysisStore.opponents || {}).filter(x => !x?.ok).length,
          setSignature: arenaOpponentAnalysisStore.setSignature,
          results: arenaOpponentAnalysisStore.opponents,
          playerProfile: arenaOpponentAnalysisStore.playerProfile
        };
      }
      return performArenaOpponentAnalysis(opponents, context);
    })();
    try {
      return await arenaAnalysisPromise;
    } finally {
      arenaAnalysisPromise = null;
    }
  }

  function currentArenaAnalysisRows() {
    const current = parseArenaOpponents();
    return current.map(op => arenaOpponentAnalysisStore?.opponents?.[op.key] || null).filter(Boolean);
  }

  function arenaNeedsSimulatorHealing() {
    const rows = currentArenaAnalysisRows().filter(row => row.ok);
    const threshold = 5; // percentage-point advantage from full HP required to justify a simulator-driven heal.
    const candidates = rows.filter(row => Number(row.hpImpact) >= threshold && Number(row.full?.winRate || 0) > Number(row.current?.winRate || 0));
    if (!candidates.length) return { needed: false, threshold, maxImpact: 0, reason: "no-material-hp-impact" };
    const maxImpact = Math.max(...candidates.map(row => Number(row.hpImpact) || 0));
    return { needed: true, threshold, maxImpact, candidates: candidates.map(row => ({ name: row.name, key: row.key, hpImpact: row.hpImpact, currentWinRate: row.current?.winRate, fullWinRate: row.full?.winRate })) };
  }

  function elementIsActuallyVisible(element) {
    if (!element || !element.isConnected) return false;
    for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    }
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && Number.isFinite(rect.left) && Number.isFinite(rect.top);
  }

  function visibleArenaConfirmationButton() {
    const candidates = [
      ...document.querySelectorAll("#blackoutDialogbod #linkbod, #blackoutDialognotification #linkbod, input#linkbod, button#linkbod")
    ];
    const seen = new Set();
    for (const button of candidates) {
      if (seen.has(button)) continue;
      seen.add(button);
      if (elementIsActuallyVisible(button)) return button;
    }
    return null;
  }

  function visibleCircusProvinciarumConfirmationButton() {
    const candidates = [
      ...document.querySelectorAll("#blackoutDialogbod #linkbod, #blackoutDialognotification #linkbod, input#linkbod, button#linkbod")
    ];
    const seen = new Set();
    for (const button of candidates) {
      if (seen.has(button)) continue;
      seen.add(button);
      const onclick = String(button.getAttribute("onclick") || "");
      const isCircusConfirm = /startProvinciarumFightConfirmed\s*\(/i.test(onclick);
      if (isCircusConfirm && elementIsActuallyVisible(button)) return button;
    }
    return null;
  }

  async function waitForCircusProvinciarumConfirmation({ timeoutMs = CIRCUS_CONFIRMATION_TIMEOUT_MS, cooldownBeforeClickMs = null } = {}) {
    const started = Date.now();
    const check = () => {
      if (isCombatReportPage() && circusReportDetection().isCircus) {
        return { kind: "report", reportId: reportIdFromUrl(), elapsedMs: Date.now() - started };
      }
      const button = visibleCircusProvinciarumConfirmationButton();
      if (button) return { kind: "confirmation", button, elapsedMs: Date.now() - started };
      const cooldownNow = circusProvinciarumCooldownMs();
      if (Number.isFinite(cooldownBeforeClickMs) && cooldownBeforeClickMs <= 0 && Number.isFinite(cooldownNow) && cooldownNow > 0) {
        return { kind: "cooldown", cooldownMs: cooldownNow, elapsedMs: Date.now() - started };
      }
      return null;
    };

    const immediate = check();
    if (immediate) return immediate;

    return await new Promise(resolve => {
      let settled = false;
      let observer = null;
      let interval = null;
      let timeout = null;
      const finish = result => {
        if (settled) return;
        settled = true;
        if (observer) observer.disconnect();
        if (interval) clearInterval(interval);
        if (timeout) clearTimeout(timeout);
        resolve(result);
      };
      const poll = () => {
        const result = check();
        if (result) finish(result);
      };
      try {
        if (document.body) {
          observer = new MutationObserver(poll);
          observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class", "id"] });
        }
      } catch (_) {}
      interval = setInterval(poll, 200);
      timeout = setTimeout(() => finish({ kind: "timeout", elapsedMs: Date.now() - started }), Math.max(250, timeoutMs));
      poll();
    });
  }

  async function recoverStaleCircusProvinciarumActionState() {
    const state = circusProvinciarumAutomationState;
    if (!state?.enabled) return false;
    if (!["confirming", "humanizing"].includes(state.phase)) return false;

    const phaseBefore = state.phase;
    const reportPage = isCombatReportPage() && circusReportDetection().isCircus;
    const currentReportId = reportPage ? reportIdFromUrl() : null;

    if (reportPage && currentReportId) {
      state.phase = "waiting-report";
      state.error = null;
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-stale-state-recovery", {
        fromPhase: phaseBefore,
        toPhase: "waiting-report",
        reason: "circus-report-present",
        reportId: String(currentReportId),
        pendingTargetName: state.pendingTargetName || "",
        completedRuns: state.completedRuns || 0
      });
      return true;
    }

    const recoveryCooldownMs = circusProvinciarumCooldownMs();
    if (Number.isFinite(recoveryCooldownMs) && recoveryCooldownMs > 0) {
      if (state.pendingTargetKey) {
        state.attemptedOpponents = state.attemptedOpponents || {};
        if (!Object.prototype.hasOwnProperty.call(state.attemptedOpponents, state.pendingTargetKey)) {
          state.attemptedOpponents[state.pendingTargetKey] = { name: state.pendingTargetName || "", attemptedAt: new Date().toISOString(), recovered: true };
        }
      }
      state.phase = "waiting-report";
      state.error = "Circus Provinciarum cooldown is active; treating the pending action as already started and refusing another click.";
      setModuleReadiness("provinciarum", null);
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-stale-state-cooldown-guard", { cooldownMs: recoveryCooldownMs, pendingTargetName: state.pendingTargetName || null });
      scheduleAutoCombatResume(350, "provinciarum-stale-state-cooldown-guard");
      return true;
    }

    if (isCircusProvinciarumPage() && state.pendingTargetKey) {
      const confirmButton = visibleCircusProvinciarumConfirmationButton();
      if (confirmButton) {
        state.phase = "humanizing";
        state.error = null;
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("provinciarum-action-navigation-recovery", {
          fromPhase: phaseBefore,
          action: "resume-pending-confirmation",
          target: state.pendingTargetName || null,
          targetKey: state.pendingTargetKey || null
        });
        const confirmed = await humanizedClick(confirmButton, "provinciarum-confirm-recovery", {
          beforeClick: () => ensureAutoCombatHpSafety("provinciarum", "confirm-recovery")
        });
        logAutoCombatDiagnostic("provinciarum-confirmation-recovery-result", {
          clicked: confirmed,
          target: state.pendingTargetName || null
        });
        if (confirmed && state.enabled) {
          const pendingOpponent = state.pendingTargetKey ? String(state.pendingTargetKey) : null;
          if (pendingOpponent && !Object.prototype.hasOwnProperty.call(state.attemptedOpponents || {}, pendingOpponent)) {
            state.attemptedOpponents[pendingOpponent] = {
              name: state.pendingTargetName || "", attemptedAt: new Date().toISOString(), recovered: true
            };
          }
          state.confirmationRetryCount = 0;
          state.confirmationRetryTargetKey = null;
          state.phase = "waiting-report";
          state.error = null;
          await saveCircusProvinciarumAutomationState();
          renderAutoCombatUI();
        } else if (!autoHealingState?.active) {
          state.phase = "queued";
          state.pendingTargetKey = null;
          state.pendingTargetName = "";
          state.error = "Recovered Circus Provinciarum state, but the pending confirmation disappeared; rechecking the live opponent list.";
          await saveCircusProvinciarumAutomationState();
          renderAutoCombatUI();
          logAutoCombatDiagnostic("provinciarum-confirmation-recovery-fallback", { reason: "confirmation-click-failed" });
        }
        return true;
      }
    }

    const previousTarget = state.pendingTargetName || null;
    state.phase = "queued";
    state.pendingTargetKey = null;
    state.pendingTargetName = "";
    state.error = "Recovered a stale Circus Provinciarum action state; rechecking the live page before the next attack.";
    await saveCircusProvinciarumAutomationState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("provinciarum-action-navigation-recovery", {
      fromPhase: phaseBefore,
      toPhase: "queued",
      reason: "no-live-report-or-confirmation",
      previousTarget
    });
    return true;
  }

  function isCircusProvinciarumPage() {
    try {
      const url = new URL(location.href);
      return url.searchParams.get("mod") === "arena"
        && ["serverArena", "getNewOpponents"].includes(url.searchParams.get("submod"))
        && url.searchParams.get("aType") === "3";
    } catch (_) { return false; }
  }

  function isCircusProvinciarumOpponentRefreshPage() {
    try {
      const url = new URL(location.href);
      return url.searchParams.get("mod") === "arena"
        && url.searchParams.get("submod") === "getNewOpponents"
        && url.searchParams.get("aType") === "3";
    } catch (_) { return false; }
  }

  function parseCircusProvinciarumOpponents() {
    if (!isCircusProvinciarumPage()) return [];
    // Circus Provinciarum is rendered in #own3. #own2 is Provinciarum Arena
    // and must remain reserved for the 1v1 Arena opponent parser.
    const container = document.querySelector("#own3");
    const rows = container ? [...container.querySelectorAll("table tbody tr")] : [];
    return rows.map((row, index) => {
      const cells = row.querySelectorAll(":scope > td");
      const profile = cells[0]?.querySelector('a[href*="mod=player"]');
      const attackButton = cells[3]?.querySelector(".attack");
      if (!profile || !attackButton) return null;
      let profileUrl = null;
      let playerId = null;
      let profileHost = location.hostname;
      try {
        const parsed = new URL(profile.href || profile.getAttribute("href") || "", location.href);
        profileUrl = parsed.href;
        playerId = parsed.searchParams.get("p");
        profileHost = parsed.hostname || profileHost;
      } catch (_) {}
      const level = parseLocalizedInteger(cells[1]?.textContent || "");
      const province = normalize(cells[2]?.textContent || "");
      const name = normalize(profile.textContent || "");
      if (!playerId || !name || level == null) return null;
      return {
        index, name, level, province, playerId: String(playerId), profileHost, profileUrl,
        key: `${profileHost}|${String(playerId)}|${province}`, button: attackButton, row
      };
    }).filter(Boolean);
  }

  function circusProvinciarumProfileUrl(profileUrl, dollId) {
    try {
      const url = new URL(profileUrl, location.href);
      url.searchParams.set("doll", String(dollId));
      return url.href;
    } catch (_) {
      return profileUrl || null;
    }
  }

  function buildSavedCircusFighterProfile(engine, profile) {
    const stats = { ...(profile?.stats || {}), name: profile?.name || profile?.stats?.name || characterDisplayName(profile) };
    const combatProfile = engine.buildProfileFromSnapshot(profile?.equipment || {}, stats, {
      baseStats: characterProfileBaseStats(profile),
      name: stats.name,
      recalculateDerived: false
    });
    combatProfile.name = stats.name;
    combatProfile.lifeCurrent = combatProfile.lifeMax;
    combatProfile.dollId = String(profile?.dollId || "");
    const roleSource = `${profile?.roleKey || ""} ${profile?.roleRaw || ""} ${stats?.turmaRole || ""}`.toLowerCase();
    combatProfile.turmaRole = /healer|heal group members/.test(roleSource) ? "healer" : /tank|direct attention to oneself/.test(roleSource) ? "tank" : "dps";
    combatProfile.turmaThreat = Number.isFinite(Number(stats?.threat)) ? Number(stats.threat) : Number(combatProfile?.itemModifiers?.threat?.flat || 0);
    combatProfile.criticalHealing = Number.isFinite(Number(stats?.criticalHealingValue)) ? Number(stats.criticalHealingValue) : Number(stats?.criticalHealing || 0);
    return combatProfile;
  }

  function circusProvinciarumSimulationCount() {
    return arenaSimulationCount();
  }

  function circusProvinciarumSimulationSeedForOpponent(opponent, seedBase = 0) {
    let hash = 2166136261;
    const text = `circus-provinciarum|${String(opponent?.key || "")}|${String(seedBase || 0)}`;
    for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
    return (hash >>> 0) || 1;
  }

  function circusTransientProfileStatus(response) {
    const status = Number(response?.status);
    if (Number.isFinite(status) && status >= 500 && status <= 599) return status;
    if (status === 429) return status;
    const message = String(response?.error || "");
    const match = message.match(/HTTP\s+(\d{3})/i);
    const parsed = match ? Number(match[1]) : NaN;
    return Number.isFinite(parsed) && (parsed === 429 || (parsed >= 500 && parsed <= 599)) ? parsed : null;
  }

  async function fetchCircusProvinciarumDoll(opponent, dollId) {
    const profileUrl = circusProvinciarumProfileUrl(opponent?.profileUrl, dollId);
    if (!profileUrl) return { ok: false, error: `No profile URL for ${opponent?.name || "opponent"}.`, dollId: String(dollId), attempts: 0 };
    let lastFailure = null;
    for (let retry = 0; retry <= CIRCUS_OPPONENT_PROFILE_RETRY_LIMIT; retry++) {
      const attempt = retry + 1;
      try {
        const response = await runtimeSend({ type: "FETCH_GLADIATUS_PROFILE", url: profileUrl });
        if (!response?.ok || typeof response.html !== "string") {
          const status = circusTransientProfileStatus(response);
          lastFailure = { ok: false, error: response?.error || "Opponent fighter profile request failed.", status, dollId: String(dollId), profileUrl, attempts: attempt };
          if (status != null && retry < CIRCUS_OPPONENT_PROFILE_RETRY_LIMIT) {
            const delayMs = Number(CIRCUS_OPPONENT_PROFILE_RETRY_DELAYS_MS[retry] || CIRCUS_OPPONENT_PROFILE_RETRY_DELAYS_MS[CIRCUS_OPPONENT_PROFILE_RETRY_DELAYS_MS.length - 1] || 3000);
            logAutoCombatDiagnostic("provinciarum-opponent-profile-retry", {
              opponent: { key: opponent?.key || null, name: opponent?.name || null, playerId: opponent?.playerId || null },
              dollId: String(dollId), status, attempt, retryLimit: CIRCUS_OPPONENT_PROFILE_RETRY_LIMIT, delayMs
            });
            await new Promise(resolve => setTimeout(resolve, delayMs));
            continue;
          }
          break;
        }
        const finalUrl = response.finalUrl || profileUrl;
        try {
          const final = new URL(finalUrl, location.href);
          const finalPlayerId = final.searchParams.get("p");
          const finalDollId = final.searchParams.get("doll");
          if (finalPlayerId && String(finalPlayerId) !== String(opponent.playerId)) {
            return { ok: false, error: `Profile request returned player ${finalPlayerId} instead of ${opponent.playerId}.`, dollId: String(dollId), profileUrl, finalUrl, attempts: attempt };
          }
          if (finalDollId && String(finalDollId) !== String(dollId)) {
            return { ok: false, error: `Profile request returned doll ${finalDollId} instead of ${dollId}.`, dollId: String(dollId), profileUrl, finalUrl, attempts: attempt };
          }
        } catch (_) {}
        const parsed = parseArenaProfileDocument(response.html, finalUrl, opponent);
        if (!parsed?.ok) return { ok: false, error: parsed?.error || "Opponent fighter profile is incomplete.", dollId: String(dollId), profileUrl, finalUrl, stats: parsed?.stats || null, attempts: attempt };
        const stats = { ...(parsed.stats || {}), dollId: String(dollId), turmaRole: parsed.stats?.turmaRole || "dps", name: parsed.name || `${opponent.name} · Doll ${dollId}` };
        if (attempt > 1) {
          logAutoCombatDiagnostic("provinciarum-opponent-profile-recovered", {
            opponent: { key: opponent?.key || null, name: opponent?.name || null, playerId: opponent?.playerId || null },
            dollId: String(dollId), attempt, retriesUsed: retry, status: lastFailure?.status || null
          });
        }
        return { ok: true, dollId: String(dollId), profileUrl, finalUrl, name: stats.name, stats, capturedAt: parsed.capturedAt, attempts: attempt, retriesUsed: retry };
      } catch (error) {
        lastFailure = { ok: false, error: error?.message || String(error), dollId: String(dollId), profileUrl, attempts: attempt, status: null };
        break;
      }
    }
    if (lastFailure?.status != null) {
      logAutoCombatDiagnostic("provinciarum-opponent-profile-retry-exhausted", {
        opponent: { key: opponent?.key || null, name: opponent?.name || null, playerId: opponent?.playerId || null },
        dollId: String(dollId), status: lastFailure.status, attempts: lastFailure.attempts || (CIRCUS_OPPONENT_PROFILE_RETRY_LIMIT + 1), retryLimit: CIRCUS_OPPONENT_PROFILE_RETRY_LIMIT
      });
    }
    return lastFailure || { ok: false, error: "Opponent fighter profile request failed.", dollId: String(dollId), profileUrl, attempts: CIRCUS_OPPONENT_PROFILE_RETRY_LIMIT + 1 };
  }

  async function fetchCircusProvinciarumOpponentTeam(opponent) {
    if (!opponent?.profileUrl) return { ok: false, error: "No opponent profile URL." };
    const excludedDollIds = ["1"];
    const capturedDollIds = [...CIRCUS_PROVINCIARUM_TEAM_DOLL_IDS];
    logAutoCombatDiagnostic("provinciarum-opponent-team-capture-start", {
      opponent: { key: opponent.key, name: opponent.name, playerId: opponent.playerId },
      requestedDollIds: capturedDollIds,
      excludedDollIds,
      format: "5v5"
    });
    const results = await Promise.all(capturedDollIds.map(dollId => fetchCircusProvinciarumDoll(opponent, dollId)));
    const failures = results.filter(result => !result.ok);
    if (failures.length) {
      return {
        ok: false,
        error: `${opponent.name}: could not capture all 5 Circus fighters. ${failures.map(result => `doll ${result.dollId}: ${result.error}`).join("; ")}`,
        fighters: results.filter(result => result.ok),
        requestedDollIds: capturedDollIds,
        excludedDollIds,
        failures,
        retrySummary: {
          retried: results.filter(result => Number(result?.attempts) > 1).map(result => ({ dollId: result.dollId, attempts: result.attempts, status: result.status || null })),
          exhausted: failures.filter(result => Number(result?.attempts) > CIRCUS_OPPONENT_PROFILE_RETRY_LIMIT).map(result => ({ dollId: result.dollId, attempts: result.attempts, status: result.status || null }))
        }
      };
    }
    const fighters = results.map(result => ({
      ...result.stats,
      dollId: result.dollId,
      name: result.name,
      turmaRole: result.stats?.turmaRole || "dps",
      sourceProfileUrl: result.finalUrl || result.profileUrl,
      capturedAt: result.capturedAt
    }));
    if (fighters.length !== 5) return { ok: false, error: `${opponent.name}: expected exactly 5 Circus fighters after excluding Arena doll 1, captured ${fighters.length}.`, fighters, requestedDollIds: capturedDollIds, excludedDollIds };
    return { ok: true, fighters, requestedDollIds: capturedDollIds, excludedDollIds, capturedAt: new Date().toISOString() };
  }

  async function loadCircusProvinciarumAnalysisStore() {
    try {
      const result = await storageGet(circusProvinciarumAnalysisKey());
      const stored = result?.[circusProvinciarumAnalysisKey()];
      if (stored && typeof stored === "object") {
        circusProvinciarumAnalysisStore = {
          schemaVersion: 1,
          updatedAt: stored.updatedAt || null,
          setSignature: stored.setSignature || null,
          analysisSeedBase: Number.isFinite(Number(stored.analysisSeedBase)) ? Number(stored.analysisSeedBase) : null,
          playerProfile: stored.playerProfile && typeof stored.playerProfile === "object" ? { ...stored.playerProfile } : null,
          opponents: stored.opponents && typeof stored.opponents === "object" ? { ...stored.opponents } : {}
        };
        return circusProvinciarumAnalysisStore;
      }
    } catch (_) {}
    circusProvinciarumAnalysisStore = { schemaVersion: 1, updatedAt: null, setSignature: null, playerProfile: null, opponents: {} };
    return circusProvinciarumAnalysisStore;
  }

  async function saveCircusProvinciarumAnalysisStore() {
    circusProvinciarumAnalysisStore.updatedAt = new Date().toISOString();
    try { await storageSet({ [circusProvinciarumAnalysisKey()]: circusProvinciarumAnalysisStore }); } catch (_) {}
  }

  function circusProvinciarumAnalysisSetSignature(opponents) {
    return opponents.map(op => op.key).sort().join("||");
  }

  async function performCircusProvinciarumOpponentAnalysis(opponents) {
    circusProvinciarumAnalysisBusy = true;
    renderNativeOpponentWinRateBadges();
    renderAutoCombatUI();
    try {
      await loadCharacterProfileStore();
      await loadCircusProvinciarumAnalysisStore();
      const engine = simulatorEngine();
      if (!engine) return { ok: false, reason: "simulator-unavailable", error: "Combat simulator engine unavailable." };
      const roster = turmaCharacterProfilesList()
        .slice()
        .sort((a, b) => Number(a.dollId) - Number(b.dollId));
      const incomplete = roster.filter(profile => characterProfileMissingSimulationData(profile).length).map(profile => ({ name: characterDisplayName(profile), missing: characterProfileMissingSimulationData(profile) }));
      if (incomplete.length) return { ok: false, reason: "own-team-incomplete", error: `Complete Circus team profiles are required. Missing data: ${incomplete.map(x => `${x.name}: ${x.missing.join(", ")}`).join("; ")}` };
      if (roster.length !== 5) return { ok: false, reason: "own-team-count", error: `Circus Provinciarum requires exactly 5 saved Circus fighters (dolls 2–6); found ${roster.length}.` };
      const ownTeam = roster.map(profile => buildSavedCircusFighterProfile(engine, profile));
      if (ownTeam.length !== 5) return { ok: false, reason: "own-team-build", error: `Could not build a complete 5-fighter Circus team; built ${ownTeam.length}.` };
      const teamFingerprint = circusTeamSimulationFingerprint(roster);

      logAutoCombatDiagnostic("provinciarum-analysis-start", {
        format: "5v5",
        opponentCount: opponents.length,
        ownTeamDollIds: ownTeam.map(f => f.dollId),
        ownTeamNames: ownTeam.map(f => f.name),
        excludedArenaCharacterDoll: "1"
      });

      const setSignature = circusProvinciarumAnalysisSetSignature(opponents);
      const analysisSeedBase = newSimulationSeedBase();
      const results = {};
      let failures = 0;
      const count = circusProvinciarumSimulationCount();
      for (const opponent of opponents) {
        if (circusProvinciarumOpponentIsUnavailable(opponent)) {
          failures++;
          const unavailable = circusProvinciarumAutomationState.unavailableOpponents[opponent.key] || {};
          results[opponent.key] = {
            key: opponent.key, name: opponent.name, playerId: opponent.playerId, province: opponent.province, level: opponent.level,
            ok: false, error: unavailable.error || "Opponent excluded after repeated profile capture failures.",
            capturedDollIds: unavailable.capturedDollIds || [], excludedDollIds: ["1"], unavailable: true, retrySummary: unavailable.retrySummary || null,
            capturedAt: unavailable.capturedAt || null
          };
          logAutoCombatDiagnostic("provinciarum-opponent-skipped-unavailable", {
            opponent: { key: opponent.key, name: opponent.name, playerId: opponent.playerId },
            retrySummary: unavailable.retrySummary || null
          });
          continue;
        }
        const teamCapture = await withArenaAnalysisTimeout(
          fetchCircusProvinciarumOpponentTeam(opponent),
          30000,
          `Circus opponent team (${opponent.name})`
        );
        if (!teamCapture.ok) {
          failures++;
          const capturedAt = new Date().toISOString();
          const retrySummary = teamCapture.retrySummary || null;
          results[opponent.key] = {
            key: opponent.key, name: opponent.name, playerId: opponent.playerId, province: opponent.province, level: opponent.level,
            ok: false, error: teamCapture.error || "Could not capture the Circus opponent team.",
            capturedDollIds: teamCapture.fighters?.map(f => f.dollId) || [],
            excludedDollIds: ["1"], capturedAt, unavailable: true, retrySummary
          };
          if (circusProvinciarumAutomationState?.unavailableOpponents) {
            circusProvinciarumAutomationState.unavailableOpponents[opponent.key] = {
              name: opponent.name, playerId: opponent.playerId, province: opponent.province, level: opponent.level,
              error: teamCapture.error || "Could not capture the Circus opponent team.",
              capturedDollIds: teamCapture.fighters?.map(f => f.dollId) || [],
              retrySummary, capturedAt
            };
            await saveCircusProvinciarumAutomationState();
          }
          logAutoCombatDiagnostic("provinciarum-opponent-team-capture-error", { opponent: opponent.name, error: teamCapture.error || null, failures: teamCapture.failures || [], retrySummary, markedUnavailable: true });
          continue;
        }
        try {
          const opponentTeam = teamCapture.fighters.map(fighter => ({
            ...fighter,
            name: fighter.name || `${opponent.name} · Doll ${fighter.dollId}`,
            lifeCurrent: fighter.lifeMax,
            lifeMax: fighter.lifeMax,
            turmaRole: fighter.turmaRole || "dps",
            roleKey: fighter.turmaRole || "dps",
            criticalHealing: Number.isFinite(Number(fighter.criticalHealingValue)) ? Number(fighter.criticalHealingValue) : 0,
            turmaThreat: Number.isFinite(Number(fighter.threat)) ? Number(fighter.threat) : 0
          }));
          const seed = circusProvinciarumSimulationSeedForOpponent(opponent, analysisSeedBase);
          const simulation = await withArenaAnalysisTimeout(engine.simulateTurmaBatchAsync({
            attackers: ownTeam,
            defenders: opponentTeam,
            simulations: count,
            seed,
            maxRounds: CIRCUS_PROVINCIARUM_SIMULATION_ROUNDS,
            chunkSize: 25,
            onProgress: progress => logAutoCombatDiagnostic("provinciarum-simulation-progress", { opponent: opponent.name, ...progress }),
            onYield: progress => logAutoCombatDiagnostic("provinciarum-simulation-yield", { opponent: opponent.name, ...progress })
          }), 60000, `5v5 simulation (${opponent.name})`);
          const winRate = Number(simulation?.rates?.win || 0);
          results[opponent.key] = {
            key: opponent.key, name: opponent.name, playerId: opponent.playerId, province: opponent.province, level: opponent.level,
            ok: true, format: "5v5", profileDollIds: opponentTeam.map(f => f.dollId), excludedDollIds: ["1"],
            team: opponentTeam,
            teamFingerprint,
            simulations: Number(simulation?.simulations || count), maxRounds: CIRCUS_PROVINCIARUM_SIMULATION_ROUNDS, seed,
            current: {
              winRate,
              lossRate: Number(simulation?.rates?.loss || 0),
              unknownRate: Number(simulation?.rates?.unknown || 0),
              avgPlayerDamage: Number(simulation?.averages?.attackerDamage || 0),
              avgEnemyDamage: Number(simulation?.averages?.defenderDamage || 0),
              avgPlayerHealing: Number(simulation?.averages?.attackerHealing || 0),
              avgEnemyHealing: Number(simulation?.averages?.defenderHealing || 0),
              avgRounds: Number(simulation?.averages?.rounds || 0)
            },
            analyzedAt: new Date().toISOString()
          };
          logAutoCombatDiagnostic("provinciarum-opponent-analysis-complete", {
            opponent: { name: opponent.name, key: opponent.key, playerId: opponent.playerId },
            winRate, simulations: Number(simulation?.simulations || count), format: "5v5"
          });
        } catch (error) {
          failures++;
          const capturedAt = teamCapture.capturedAt || new Date().toISOString();
          const simulationError = `5v5 simulation failed: ${error?.message || String(error)}`;
          results[opponent.key] = {
            key: opponent.key, name: opponent.name, playerId: opponent.playerId, province: opponent.province, level: opponent.level,
            ok: false, error: simulationError,
            capturedDollIds: teamCapture.fighters.map(f => f.dollId), excludedDollIds: ["1"], capturedAt, unavailable: true
          };
          if (circusProvinciarumAutomationState?.unavailableOpponents) {
            circusProvinciarumAutomationState.unavailableOpponents[opponent.key] = {
              name: opponent.name, playerId: opponent.playerId, province: opponent.province, level: opponent.level,
              error: simulationError, capturedDollIds: teamCapture.fighters.map(f => f.dollId), retrySummary: null, capturedAt
            };
            await saveCircusProvinciarumAutomationState();
          }
          logAutoCombatDiagnostic("provinciarum-simulation-error", { opponent: opponent.name, error: error?.message || String(error), stack: error?.stack || null, markedUnavailable: true });
        }
      }

      circusProvinciarumAnalysisStore = {
        schemaVersion: 1,
        updatedAt: new Date().toISOString(),
        setSignature,
        analysisSeedBase,
        playerProfile: {
          format: "5v5",
          simulationFingerprint: teamFingerprint,
          excludedArenaCharacterDoll: "1",
          ownTeam: ownTeam.map(f => ({ name: f.name, dollId: f.dollId, level: f.level, lifeMax: f.lifeMax, turmaRole: f.turmaRole }))
        },
        opponents: results
      };
      await saveCircusProvinciarumAnalysisStore();
      const completed = Object.values(results).filter(x => x?.ok).length;
      const partial = completed > 0 && completed < opponents.length;
      if (partial) {
        logAutoCombatDiagnostic("provinciarum-opponent-analysis-partial", {
          completed,
          total: opponents.length,
          failures,
          usableTargets: Object.values(results).filter(x => x?.ok).map(x => ({ key: x.key, name: x.name, winRate: x.current?.winRate ?? null }))
        });
      }
      return {
        ok: completed > 0,
        reason: partial ? "partial-opponents" : completed === 0 ? "no-usable-opponents" : null,
        completed,
        total: opponents.length,
        failures,
        setSignature,
        results
      };
    } catch (error) {
      logAutoCombatDiagnostic("provinciarum-analysis-error", { error: error?.message || String(error), stack: error?.stack || null });
      return { ok: false, reason: "analysis-error", error: error?.message || String(error) };
    } finally {
      circusProvinciarumAnalysisBusy = false;
      renderNativeOpponentWinRateBadges();
      renderAutoCombatUI();
    }
  }

  function currentCircusTeamFingerprint() {
    const roster = turmaCharacterProfilesList()
      .slice()
      .sort((a, b) => Number(a.dollId) - Number(b.dollId));
    if (roster.length !== 5) return null;
    if (roster.some(profile => characterProfileMissingSimulationData(profile).length)) return null;
    return circusTeamSimulationFingerprint(roster);
  }

  function circusProvinciarumAnalysisCacheIsCurrent(opponents, context = null) {
    if (!Array.isArray(opponents) || opponents.length !== 5) return false;
    if (circusProvinciarumAnalysisStore?.setSignature !== circusProvinciarumAnalysisSetSignature(opponents)) return false;
    const simulations = circusProvinciarumSimulationCount();
    const updatedAtMs = Date.parse(String(circusProvinciarumAnalysisStore?.updatedAt || ""));
    if (!Number.isFinite(updatedAtMs) || Date.now() - updatedAtMs > CIRCUS_ANALYSIS_CACHE_MAX_AGE_MS) return false;
    const teamFingerprint = context?.teamFingerprint || null;
    if (teamFingerprint && String(circusProvinciarumAnalysisStore?.playerProfile?.simulationFingerprint || "") !== String(teamFingerprint)) return false;
    return opponents.every(op => {
      const result = circusProvinciarumAnalysisStore?.opponents?.[op.key];
      if (result?.ok === true) return Number(result.simulations) === simulations
        && Number.isFinite(Number(result.current?.winRate))
        && (!teamFingerprint || String(result.teamFingerprint || "") === String(teamFingerprint));
      return result?.unavailable === true && typeof result.error === "string" && !!result.error;
    });
  }

  async function analyzeCurrentCircusProvinciarumOpponents() {
    if (!isCircusProvinciarumPage()) return { ok: false, reason: "not-provinciarum-page" };
    const opponents = parseCircusProvinciarumOpponents();
    if (opponents.length !== 5) {
      const container = document.querySelector("#own3");
      const rowCount = container ? container.querySelectorAll("table tbody tr").length : 0;
      logAutoCombatDiagnostic("provinciarum-analysis-invalid-opponent-count", {
        opponentCount: opponents.length,
        containerFound: !!container,
        containerId: container?.id || null,
        rowCount,
        expectedContainerId: "own3"
      });
      return { ok: false, reason: "invalid-opponent-count", error: `Circus Provinciarum must expose exactly 5 opponents; found ${opponents.length}.` };
    }
    if (circusProvinciarumAnalysisPromise) return circusProvinciarumAnalysisPromise;

    circusProvinciarumAnalysisPromise = (async () => {
      await loadCharacterProfileStore();
      const teamFingerprint = currentCircusTeamFingerprint();
      await loadCircusProvinciarumAnalysisStore();
      if (teamFingerprint && circusProvinciarumAnalysisCacheIsCurrent(opponents, { teamFingerprint })) {
        renderNativeOpponentWinRateBadges();
        const values = Object.values(circusProvinciarumAnalysisStore.opponents || {});
        return {
          ok: true,
          reused: true,
          reason: "cached",
          completed: values.filter(x => x?.ok).length,
          total: opponents.length,
          failures: values.filter(x => !x?.ok).length,
          setSignature: circusProvinciarumAnalysisStore.setSignature,
          results: circusProvinciarumAnalysisStore.opponents,
          playerProfile: circusProvinciarumAnalysisStore.playerProfile
        };
      }
      return performCircusProvinciarumOpponentAnalysis(opponents);
    })();
    try {
      return await circusProvinciarumAnalysisPromise;
    } finally {
      circusProvinciarumAnalysisPromise = null;
    }
  }

  function circusProvinciarumAnalysisRows() {
    const current = parseCircusProvinciarumOpponents();
    return current.map(op => circusProvinciarumAnalysisStore?.opponents?.[op.key] || null);
  }

  function chooseCircusProvinciarumTarget() {
    const threshold = minimumOpponentWinRateThresholdPercent();
    const candidates = parseCircusProvinciarumOpponents().filter(opponent => !circusProvinciarumOpponentIsAttempted(opponent));
    const analyzed = candidates
      .map(opponent => ({ opponent, analysis: circusProvinciarumAnalysisStore?.opponents?.[opponent.key] || null }))
      .filter(row => row.analysis?.ok && Number.isFinite(Number(row.analysis?.current?.winRate))
        && (threshold <= 0 || Number(row.analysis.current.winRate) >= threshold));
    if (!analyzed.length) return null;
    analyzed.sort((a, b) => {
      const aw = Number(a.analysis.current.winRate);
      const bw = Number(b.analysis.current.winRate);
      if (bw !== aw) return bw - aw;
      const ad = Number(a.analysis.current.avgEnemyDamage || 0);
      const bd = Number(b.analysis.current.avgEnemyDamage || 0);
      if (ad !== bd) return ad - bd;
      const ar = Number(a.analysis.current.avgRounds ?? Number.POSITIVE_INFINITY);
      const br = Number(b.analysis.current.avgRounds ?? Number.POSITIVE_INFINITY);
      if (ar !== br) return ar - br;
      return a.opponent.index - b.opponent.index;
    });
    return analyzed[0].opponent;
  }

  function circusProvinciarumCooldownMs() {
    const text = normalize(document.querySelector("#cooldown_bar_text_ct")?.textContent || "");
    if (!text) return null;
    if (/to circus turma/i.test(text) || /^ready$/i.test(text) || /go to circus/i.test(text)) return 0;
    const m = text.match(/^(?:(\d+)\s*:)?(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const hours = Number(m[1] || 0);
    const minutes = Number(m[2] || 0);
    const seconds = Number(m[3] || 0);
    return ((hours * 60 + minutes) * 60 + seconds) * 1000;
  }

  function findCircusProvinciarumLink() {
    const selectors = [
      'a[href*="mod=arena"][href*="submod=serverArena"][href*="aType=3"]',
      '#cooldown_bar_ct .cooldown_bar_link'
    ];
    for (const selector of selectors) {
      const anchor = document.querySelector(selector);
      if (!anchor?.href) continue;
      try {
        const url = new URL(anchor.href, location.href);
        if (url.origin === location.origin && url.searchParams.get("mod") === "arena" && url.searchParams.get("submod") === "serverArena" && url.searchParams.get("aType") === "3") return anchor;
      } catch (_) {}
    }
    return null;
  }

  function findRegularCircusTurmaLink() {
    const selectors = [
      'a[href*="mod=arena"][href*="submod=grouparena"]',
      '#mainnav a.awesome-tabs'
    ];
    for (const selector of selectors) {
      for (const anchor of Array.from(document.querySelectorAll(selector))) {
        if (!anchor?.href) continue;
        try {
          const url = new URL(anchor.href, location.href);
          if (url.origin === location.origin
            && url.searchParams.get("mod") === "arena"
            && url.searchParams.get("submod") === "grouparena") return anchor;
        } catch (_) {}
      }
    }
    return null;
  }

  function isRegularCircusTurmaPage() {
    try {
      const url = new URL(location.href);
      return url.searchParams.get("mod") === "arena"
        && url.searchParams.get("submod") === "grouparena";
    } catch (_) { return false; }
  }

  function fallbackRegularCircusTurmaHref() {
    try {
      const current = new URL(location.href);
      const target = new URL("/game/index.php", location.origin);
      target.searchParams.set("mod", "arena");
      target.searchParams.set("submod", "grouparena");
      const sh = current.searchParams.get("sh");
      if (sh) target.searchParams.set("sh", sh);
      return target.href;
    } catch (_) { return null; }
  }

  function circusProvinciarumOpponentIsAttempted(opponent) {
    return !!opponent && Object.prototype.hasOwnProperty.call(circusProvinciarumAutomationState?.attemptedOpponents || {}, opponent.key);
  }

  function circusProvinciarumOpponentIsUnavailable(opponent) {
    return !!opponent && Object.prototype.hasOwnProperty.call(circusProvinciarumAutomationState?.unavailableOpponents || {}, opponent.key);
  }

  function circusProvinciarumAutomationStatusText() {
    const state = circusProvinciarumAutomationState;
    if (!state?.enabled) {
      return state?.phase === "complete" ? `Complete · ${state.completedRuns || 0}/${state.maxRuns || 0} Circus Provinciarum fights.` : "Stopped.";
    }
    const runs = Number(state.completedRuns) || 0;
    const max = Number(state.maxRuns) || 0;
    const target = state.pendingTargetName || "target";
    const stats = autoOpponentSearchStats(state);
    const withStats = text => `${text} · ${stats}`;
    switch (state.phase) {
      case "starting": return withStats(`Starting · ${runs}/${max}`);
      case "navigating": return withStats(`Opening Circus Provinciarum · ${runs}/${max}`);
      case "waiting-cooldown": return withStats(`Waiting for Circus cooldown · ${runs}/${max}`);
      case "waiting-other": return withStats(`Waiting for dispatcher · ${runs}/${max}`);
      case "queued": return withStats(`Ready check · ${moduleReadinessLabel("provinciarum")} · ${runs}/${max}`);
      case "checking": return withStats(`Analyzing Provinciarum opponents · ${runs}/${max}`);
      case "refreshing": return withStats(`Requesting a new opponent set · ${runs}/${max}`);
      case "confirming": return withStats(`Confirming 5v5 attack · ${target} · ${runs}/${max}`);
      case "attacking": return withStats(`Circus Provinciarum fight started · ${target} · ${runs}/${max}`);
      case "humanizing": return withStats(`Preparing Circus action · ${target} · ${runs}/${max}`);
      case "waiting-report": return withStats(`Waiting for Circus report · ${target} · ${runs}/${max}`);
      case "error": return withStats(`Stopped: ${state.error || "unexpected state"}`);
      default: return withStats(`Running · ${runs}/${max}`);
    }
  }

  async function loadCircusProvinciarumAutomationState() {
    try {
      const result = await storageGet(circusProvinciarumAutomationKey());
      const stored = result?.[circusProvinciarumAutomationKey()];
      if (stored && typeof stored === "object") {
        const recoverKnownError = !stored.enabled && stored.phase === "error" && /confirmation did not appear|Could not capture any usable Circus Provinciarum opponent/i.test(String(stored.error || ""));
        circusProvinciarumAutomationState = {
          enabled: !!stored.enabled || recoverKnownError,
          maxRuns: Math.max(1, Math.min(CIRCUS_PROVINCIARUM_MAX_RUNS, Number(stored.maxRuns) || 100)),
          completedRuns: Math.max(0, Number(stored.completedRuns) || 0),
          opponentSearches: Math.max(0, Number(stored.opponentSearches) || 0),
          bestObservedWinRate: ((Number(stored.opponentSearches) || 0) === 0 && (Number(stored.completedRuns) || 0) === 0 && !stored.lastBattle) ? null : (Number.isFinite(Number(stored.bestObservedWinRate)) ? Number(stored.bestObservedWinRate) : null),
          lastBattle: stored.lastBattle && typeof stored.lastBattle === "object" ? { ...stored.lastBattle } : null,
          attemptedOpponents: stored.attemptedOpponents && typeof stored.attemptedOpponents === "object" ? { ...stored.attemptedOpponents } : {},
          unavailableOpponents: stored.unavailableOpponents && typeof stored.unavailableOpponents === "object" ? { ...stored.unavailableOpponents } : {},
          pendingTargetKey: stored.pendingTargetKey ? String(stored.pendingTargetKey) : null,
          pendingTargetName: normalize(stored.pendingTargetName || ""),
          confirmationRetryCount: Math.max(0, Number(stored.confirmationRetryCount) || 0),
          confirmationRetryTargetKey: stored.confirmationRetryTargetKey ? String(stored.confirmationRetryTargetKey) : null,
          refreshHandoffPending: stored.refreshHandoffPending === true,
          refreshHandoffStartedAt: Number.isFinite(Number(stored.refreshHandoffStartedAt)) ? Number(stored.refreshHandoffStartedAt) : null,
          pendingReportId: stored.pendingReportId ? String(stored.pendingReportId) : null,
          lastProcessedReportId: stored.lastProcessedReportId
            ? String(stored.lastProcessedReportId)
            : (stored.pendingReportId ? String(stored.pendingReportId) : null),
          reportWaitReportId: stored.reportWaitReportId ? String(stored.reportWaitReportId) : null,
          reportWaitStartedAt: Number.isFinite(Number(stored.reportWaitStartedAt)) ? Number(stored.reportWaitStartedAt) : null,
          reportWaitAttempts: Math.max(0, Number(stored.reportWaitAttempts) || 0),
          readiness: stored.readiness === "ready" || stored.readiness === "cooling" ? stored.readiness : "unknown",
          readyAt: Number.isFinite(Number(stored.readyAt)) ? Number(stored.readyAt) : null,
          phase: recoverKnownError ? "queued" : (stored.phase || "stopped"),
          startedAt: stored.startedAt || null,
          error: recoverKnownError ? null : (stored.error || null)
        };
        return circusProvinciarumAutomationState;
      }
    } catch (_) {}
    circusProvinciarumAutomationState = {
      enabled: false, maxRuns: 100, completedRuns: 0, opponentSearches: 0, bestObservedWinRate: null, lastBattle: null, attemptedOpponents: {}, unavailableOpponents: {},
      pendingTargetKey: null, pendingTargetName: "", pendingReportId: null, lastProcessedReportId: null,
      reportWaitReportId: null, reportWaitStartedAt: null, reportWaitAttempts: 0,
      confirmationRetryCount: 0, confirmationRetryTargetKey: null,
      readiness: "unknown", readyAt: null, phase: "stopped", startedAt: null, error: null
    };
    return circusProvinciarumAutomationState;
  }

  async function saveCircusProvinciarumAutomationState() {
    if (!circusProvinciarumAutomationState) return;
    try { await storageSet({ [circusProvinciarumAutomationKey()]: circusProvinciarumAutomationState }); } catch (_) {}
  }

  function stopCircusProvinciarumAutomationTimer() {
    if (circusProvinciarumAutomationTimer) { clearTimeout(circusProvinciarumAutomationTimer); circusProvinciarumAutomationTimer = null; }
  }

  async function navigateToCircusProvinciarum() {
    if (isCircusProvinciarumPage()) return true;
    if (!beginAutomationNavigation("provinciarum")) {
      logAutoCombatDiagnostic("provinciarum-navigation-blocked", { owner: automationNavigationOwner });
      circusProvinciarumAutomationState.phase = "queued";
      circusProvinciarumAutomationState.error = "Navigation is owned by another active combat job; Provinciarum remains queued.";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      return false;
    }

    const finalLink = findCircusProvinciarumLink();
    if (finalLink) {
      stopCircusProvinciarumAutomationTimer();
      circusProvinciarumAutomationState.phase = "navigating";
      circusProvinciarumAutomationState.error = null;
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-navigation-click-start", {
        step: "final",
        href: finalLink.href || finalLink.getAttribute("href") || null
      });
      const clicked = await humanizedClick(finalLink, "provinciarum-navigation");
      logAutoCombatDiagnostic("provinciarum-navigation-click-result", {
        step: "final",
        clicked,
        href: finalLink.href || finalLink.getAttribute("href") || null
      });
      if (!clicked) {
        releaseAutomationNavigation("provinciarum");
        circusProvinciarumAutomationState.phase = "checking";
        circusProvinciarumAutomationState.error = "Circus Provinciarum navigation control disappeared before the click could be performed; retrying.";
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(500, "provinciarum-navigation-click-failed");
      }
      return false;
    }

    if (isRegularCircusTurmaPage()) {
      circusProvinciarumAutomationState.phase = "navigating";
      circusProvinciarumAutomationState.error = "On regular Circus Turma; waiting for the Provinciarum Circus link.";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-navigation-intermediate-ready", {
        step: "regular-circus-turma",
        destination: "Circus Provinciarum"
      });
      scheduleAutoCombatResume(350, "provinciarum-final-link-wait");
      return false;
    }

    const intermediateLink = findRegularCircusTurmaLink();
    const fallbackHref = fallbackRegularCircusTurmaHref();
    const href = intermediateLink?.href || fallbackHref;
    if (!href) {
      releaseAutomationNavigation("provinciarum");
      circusProvinciarumAutomationState.phase = "error";
      circusProvinciarumAutomationState.error = "Could not reach regular Circus Turma to continue to Circus Provinciarum.";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-navigation-link-missing", {
        step: "intermediate",
        target: "regular-circus-turma"
      });
      return false;
    }

    stopCircusProvinciarumAutomationTimer();
    circusProvinciarumAutomationState.phase = "navigating";
    circusProvinciarumAutomationState.error = "Provinciarum Circus is not directly reachable; opening regular Circus Turma first.";
    await saveCircusProvinciarumAutomationState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("provinciarum-navigation-intermediate-start", {
      step: "regular-circus-turma",
      href
    });
    if (intermediateLink) {
      const clicked = await humanizedClick(intermediateLink, "provinciarum-navigation-intermediate");
      logAutoCombatDiagnostic("provinciarum-navigation-intermediate-result", { clicked, href });
      if (!clicked) {
        releaseAutomationNavigation("provinciarum");
        circusProvinciarumAutomationState.phase = "checking";
        circusProvinciarumAutomationState.error = "Regular Circus Turma navigation control disappeared before the click could be performed; retrying.";
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(500, "provinciarum-intermediate-click-failed");
      }
    } else {
      logAutoCombatDiagnostic("provinciarum-navigation-intermediate-fallback", { step: "regular-circus-turma", href });
      location.href = href;
    }
    return false;
  }

  function findCircusOpponentRefreshControl() {
    const form = document.querySelector('form[name="filterForm"][action*="getNewOpponents"][action*="aType=3"]');
    if (!form) return null;
    return form.querySelector('input[type="submit"][name="actionButton"]')
      || form.querySelector('button[type="submit"]')
      || form.querySelector('input[type="submit"]')
      || form.querySelector('button[name="actionButton"]')
      || null;
  }

  async function requestNewCircusProvinciarumOpponents(reason = null) {
    const form = document.querySelector('form[name="filterForm"][action*="getNewOpponents"][action*="aType=3"]');
    const submit = findCircusOpponentRefreshControl();
    if (!form || !submit) {
      logAutoCombatDiagnostic("provinciarum-opponent-refresh-control-missing", {
        reason: reason || null,
        url: location.href,
        page: document.body?.id || null
      });
      return false;
    }
    const currentCooldownMs = circusProvinciarumCooldownMs();
    if (Number.isFinite(currentCooldownMs) && currentCooldownMs > 0) {
      circusProvinciarumAutomationState.phase = "waiting-cooldown";
      circusProvinciarumAutomationState.error = `Waiting for Circus Provinciarum availability · ${formatExpeditionCooldown(currentCooldownMs)}.`;
      setModuleReadiness("provinciarum", currentCooldownMs);
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-opponent-refresh-blocked-cooldown", { cooldownMs: currentCooldownMs, reason: reason || null });
      scheduleAutoCombatResume(Math.max(25, currentCooldownMs + 25), "provinciarum-refresh-cooldown");
      return false;
    }
    circusProvinciarumAutomationState.phase = "refreshing";
    circusProvinciarumAutomationState.error = reason || "All five visible Provinciarum opponents have already been attempted; requesting a fresh opponent set.";
    circusProvinciarumAutomationState.refreshHandoffPending = true;
    circusProvinciarumAutomationState.refreshHandoffStartedAt = Date.now();
    await saveCircusProvinciarumAutomationState();
    renderAutoCombatUI();
    stopCircusProvinciarumAutomationTimer();
    const previousSearches = Math.max(0, Number(circusProvinciarumAutomationState.opponentSearches) || 0);
    circusProvinciarumAutomationState.opponentSearches = previousSearches + 1;
    await saveCircusProvinciarumAutomationState();
    logAutoCombatDiagnostic("provinciarum-opponent-refresh-start", {
      searchNumber: circusProvinciarumAutomationState.opponentSearches,
      reason: reason || null
    });
    const clicked = await humanizedClick(submit, "provinciarum-refresh-opponents");
    if (clicked) {
      scheduleAutoCombatResume(500, "provinciarum-opponent-refresh-settle");
    }
    if (!clicked) {
      circusProvinciarumAutomationState.opponentSearches = previousSearches;
      circusProvinciarumAutomationState.refreshHandoffPending = false;
      circusProvinciarumAutomationState.refreshHandoffStartedAt = null;
      circusProvinciarumAutomationState.phase = "checking";
      circusProvinciarumAutomationState.error = "Circus Provinciarum Search control disappeared before the click could be performed; retrying.";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      scheduleAutoCombatResume(500, "provinciarum-refresh-click-failed");
      return false;
    }
    circusProvinciarumAutomationState.unavailableOpponents = {};
    circusProvinciarumAutomationState.confirmationRetryCount = 0;
    circusProvinciarumAutomationState.confirmationRetryTargetKey = null;
    await saveCircusProvinciarumAutomationState();
    logAutoCombatDiagnostic("provinciarum-opponent-refresh-cleared-unavailable", {});
    return true;
  }

  async function stopCircusProvinciarumAutomation() {
    stopCircusProvinciarumAutomationTimer();
    releaseAutomationNavigation("provinciarum");
    circusProvinciarumAutomationState = circusProvinciarumAutomationState || await loadCircusProvinciarumAutomationState();
    circusProvinciarumAutomationState.enabled = false;
    circusProvinciarumAutomationState.refreshHandoffPending = false;
    circusProvinciarumAutomationState.refreshHandoffStartedAt = null;
    circusProvinciarumAutomationState.phase = "stopped";
    circusProvinciarumAutomationState.error = null;
    circusProvinciarumAutomationState.readiness = "unknown";
    circusProvinciarumAutomationState.readyAt = null;
    circusProvinciarumAutomationState.pendingReportId = null;
    circusProvinciarumAutomationState.reportWaitReportId = null;
    circusProvinciarumAutomationState.reportWaitStartedAt = null;
    circusProvinciarumAutomationState.reportWaitAttempts = 0;
    circusProvinciarumAutomationState.confirmationRetryCount = 0;
    circusProvinciarumAutomationState.confirmationRetryTargetKey = null;
    await saveCircusProvinciarumAutomationState();
    renderAutoCombatUI();
    if (!autoCombatEnabledModules().length) { stopAutoCombatDispatcherTimer(); stopAutoCombatCooldownObserver(); }
    else scheduleAutoCombatResume(0, "provinciarum-stopped-handoff");
    if (statusEl) statusEl.textContent = "Circus Provinciarum automation stopped.";
  }

  async function startCircusProvinciarumAutomation({ deferScheduler = false } = {}) {
    if (circusProvinciarumAutomationBusy) return;
    circusProvinciarumAutomationBusy = true;
    try {
      if (!circusProvinciarumAutomationState) await loadCircusProvinciarumAutomationState();
      const runsInput = shadow?.querySelector("#ga-auto-provinciarum-runs");
      const maxRuns = Math.max(1, Math.min(CIRCUS_PROVINCIARUM_MAX_RUNS, Number(runsInput?.value) || circusProvinciarumAutomationState.maxRuns || 100));
      circusProvinciarumAutomationState = {
        enabled: true, maxRuns, completedRuns: 0, opponentSearches: 0, bestObservedWinRate: null, lastBattle: null, attemptedOpponents: {}, unavailableOpponents: {}, pendingTargetKey: null, pendingTargetName: "", pendingReportId: null, lastProcessedReportId: null,
        reportWaitReportId: null, reportWaitStartedAt: null, reportWaitAttempts: 0,
        confirmationRetryCount: 0, confirmationRetryTargetKey: null,
        refreshHandoffPending: false, refreshHandoffStartedAt: null,
        readiness: "unknown", readyAt: null, phase: "starting", startedAt: new Date().toISOString(), error: null
      };
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      ensureAutoCombatCooldownObserver();
      if (!deferScheduler) scheduleAutoCombatResume(250, "provinciarum-start");
    } finally {
      circusProvinciarumAutomationBusy = false;
    }
  }

  function buildAutoCombatPostBattleDecision(module, reportId, completedRuns, maxRuns) {
    const store = module === "arena" ? arenaCombatStore : circusCombatStore;
    const report = store?.reports?.find(item => String(item?.reportId || "") === String(reportId || "")) || null;
    const metrics = report ? combatRecordMetrics(report) : null;
    const result = report ? combatOutcomeLabel(report.outcome) : "Unknown";
    const willComplete = completedRuns >= maxRuns;
    return {
      module, reportId: reportId ? String(reportId) : null, result, opponent: report ? combatRecordOpponentLabel(report) : null,
      damageTaken: metrics ? (metrics.enemyDamageSummary ?? metrics.enemyDamage) : null,
      damageDealt: metrics ? (metrics.playerDamageSummary ?? metrics.playerDamage) : null,
      nextAction: willComplete ? "complete-run" : "return-to-scheduler"
    };
  }

  async function markCircusProvinciarumRunComplete(reportId) {
    if (!circusProvinciarumAutomationState?.enabled) return;
    const id = reportId ? String(reportId) : null;
    if (!id) return;
    if (id === String(circusProvinciarumAutomationState.lastProcessedReportId || "")) {
      logAutoCombatDiagnostic("provinciarum-report-already-processed", {
        reportId: id,
        completedRuns: circusProvinciarumAutomationState.completedRuns || 0
      });
      return;
    }
    const previousPending = circusProvinciarumAutomationState.pendingReportId || null;
    circusProvinciarumAutomationState.lastProcessedReportId = id;
    circusProvinciarumAutomationState.pendingReportId = null;
    circusProvinciarumAutomationState.reportWaitReportId = null;
    circusProvinciarumAutomationState.reportWaitStartedAt = null;
    circusProvinciarumAutomationState.reportWaitAttempts = 0;
    circusProvinciarumAutomationState.completedRuns = Math.min(circusProvinciarumAutomationState.maxRuns, (Number(circusProvinciarumAutomationState.completedRuns) || 0) + 1);
    const postBattleDecision = buildAutoCombatPostBattleDecision("provinciarum", id, circusProvinciarumAutomationState.completedRuns, circusProvinciarumAutomationState.maxRuns);
    circusProvinciarumAutomationState.lastBattle = postBattleDecision;
    logAutoCombatDiagnostic("provinciarum-post-battle-decision", postBattleDecision);
    const matchedCircusTargetKey = circusProvinciarumAutomationState.pendingTargetKey || null;
    const predictedCircusWinRate = matchedCircusTargetKey ? Number(circusProvinciarumAnalysisStore?.opponents?.[matchedCircusTargetKey]?.current?.winRate) : NaN;
    if (Number.isFinite(predictedCircusWinRate) && ((postBattleDecision.result === "Loss" && predictedCircusWinRate >= 80) || (postBattleDecision.result === "Win" && predictedCircusWinRate <= 20))) {
      logAutoCombatDiagnostic("provinciarum-prediction-mismatch", {
        target: postBattleDecision.opponent, targetKey: matchedCircusTargetKey, predictedWinRate: predictedCircusWinRate,
        actualResult: postBattleDecision.result, reportId: id, simulations: circusProvinciarumAnalysisStore?.opponents?.[matchedCircusTargetKey]?.simulations || null,
        seed: circusProvinciarumAnalysisStore?.opponents?.[matchedCircusTargetKey]?.seed || null, teamFingerprint: circusProvinciarumAnalysisStore?.opponents?.[matchedCircusTargetKey]?.teamFingerprint || null
      });
    }
    circusProvinciarumAutomationState.pendingTargetKey = null;
    circusProvinciarumAutomationState.pendingTargetName = "";
    if (circusProvinciarumAutomationState.completedRuns >= circusProvinciarumAutomationState.maxRuns) {
      releaseAutomationNavigation("provinciarum");
      stopCircusProvinciarumAutomationTimer();
      circusProvinciarumAutomationState.enabled = false;
      circusProvinciarumAutomationState.phase = "complete";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      if (statusEl) statusEl.textContent = `Circus Provinciarum complete · ${circusProvinciarumAutomationState.completedRuns} fights.`;
      logAutoCombatDiagnostic("provinciarum-complete", { reason: "max-runs", completedRuns: circusProvinciarumAutomationState.completedRuns, remainingModules: autoCombatEnabledModules() });
      if (autoCombatEnabledModules().length) scheduleAutoCombatResume(0, "provinciarum-max-runs-handoff");
      else { stopAutoCombatDispatcherTimer(); stopAutoCombatCooldownObserver(); }
      return;
    }
    circusProvinciarumAutomationState.phase = "queued";
    circusProvinciarumAutomationState.error = null;
    await saveCircusProvinciarumAutomationState();
    renderAutoCombatUI();
    await completeAutoCombatModule("provinciarum");
  }

  function circusProvinciarumReportIsPendingCapture() {
    return !!circusProvinciarumAutomationState?.enabled && isCombatReportPage() && circusReportDetection().isCircus;
  }

  async function handoffCircusProvinciarumFromReport(reportId, reason = "report-handoff") {
    if (!circusProvinciarumAutomationState?.enabled) return;
    const id = reportId ? String(reportId) : null;
    const cooldownMs = circusProvinciarumCooldownMs();
    logAutoCombatDiagnostic("provinciarum-report-handoff", {
      reportId: id,
      reason,
      cooldownMs,
      processed: id ? id === String(circusProvinciarumAutomationState.lastProcessedReportId || "") : false,
      completedRuns: circusProvinciarumAutomationState.completedRuns || 0
    });

    if (!Number.isFinite(cooldownMs)) {
      circusProvinciarumAutomationState.phase = "waiting-report";
      circusProvinciarumAutomationState.error = "Circus Provinciarum cooldown could not be read from the global header while on the combat report.";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      scheduleAutoCombatResume(750, "provinciarum-report-cooldown-unknown");
      return;
    }

    if (cooldownMs > 0) {
      circusProvinciarumAutomationState.phase = "waiting-cooldown";
      circusProvinciarumAutomationState.error = `Waiting for Circus Provinciarum availability · ${formatExpeditionCooldown(cooldownMs)}.`;
      setModuleReadiness("provinciarum", cooldownMs);
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      scheduleAutoCombatResume(Math.max(25, cooldownMs + 25), "provinciarum-report-cooldown");
      return;
    }

    circusProvinciarumAutomationState.phase = "navigating";
    circusProvinciarumAutomationState.error = "Report processed; returning to Circus Provinciarum.";
    setModuleReadiness("provinciarum", 0);
    await saveCircusProvinciarumAutomationState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("provinciarum-return-to-list", { reportId: id, cooldownMs });
    const opened = await navigateToCircusProvinciarum();
    if (opened && circusProvinciarumAutomationState.enabled) {
      scheduleAutoCombatResume(50, "provinciarum-report-return-ready");
    }
  }

  async function resumeCircusProvinciarumAutomation({ allowBusy = false } = {}) {
    if ((circusProvinciarumAutomationBusy && !allowBusy) || !circusProvinciarumAutomationState?.enabled) return;
    logAutoCombatDiagnostic("provinciarum-resume", { reason: allowBusy ? "scheduler" : "direct" });

    const liveCircusCooldownMs = circusProvinciarumCooldownMs();
    if (circusProvinciarumAutomationState.phase === "refreshing"
      && circusProvinciarumAutomationState.refreshHandoffPending
      && isCircusProvinciarumOpponentRefreshPage()) {
      const refreshWaitStartedAt = Number(circusProvinciarumAutomationState.refreshHandoffStartedAt) || Date.now();
      const refreshWaitElapsedMs = Math.max(0, Date.now() - refreshWaitStartedAt);
      if (Number.isFinite(liveCircusCooldownMs) && liveCircusCooldownMs > 0) {
        circusProvinciarumAutomationState.phase = "waiting-cooldown";
        circusProvinciarumAutomationState.error = `Waiting for Circus Provinciarum availability · ${formatExpeditionCooldown(liveCircusCooldownMs)}.`;
        circusProvinciarumAutomationState.refreshHandoffPending = false;
        circusProvinciarumAutomationState.refreshHandoffStartedAt = null;
        setModuleReadiness("provinciarum", liveCircusCooldownMs);
        releaseAutomationNavigation("provinciarum");
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("provinciarum-refresh-accepted-direct-handoff", {
          cooldownMs: liveCircusCooldownMs,
          page: location.href,
          nextAction: "shared-dispatcher"
        });
        scheduleAutoCombatResume(0, "provinciarum-refresh-complete-handoff");
        return;
      }
      // A successful in-page refresh can briefly render the new opponent list
      // before Gladiatus has painted the newly-started Circus cooldown. Never
      // analyze that list during this settling window: doing so keeps the
      // scheduler inside Circus and can leave Arena stuck in `starting`.
      circusProvinciarumAutomationState.phase = "waiting-other";
      circusProvinciarumAutomationState.error = `Circus Provinciarum refresh accepted; waiting for cooldown state (${Math.ceil(Math.max(0, 5000 - refreshWaitElapsedMs) / 1000)}s).`;
      releaseAutomationNavigation("provinciarum");
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-refresh-settling", {
        cooldownMs: Number.isFinite(liveCircusCooldownMs) ? liveCircusCooldownMs : null,
        elapsedMs: refreshWaitElapsedMs,
        handoffPending: true,
        nextAction: "shared-dispatcher"
      });
      scheduleAutoCombatResume(refreshWaitElapsedMs >= 5000 ? 0 : 350, "provinciarum-refresh-settling");
      return;
    }

    if (Number.isFinite(liveCircusCooldownMs) && liveCircusCooldownMs > 0) {
      if (["queued", "checking", "refreshing", "confirming", "humanizing", "navigating"].includes(circusProvinciarumAutomationState.phase)) {
        circusProvinciarumAutomationState.pendingTargetKey = null;
        circusProvinciarumAutomationState.pendingTargetName = "";
      }
      circusProvinciarumAutomationState.phase = "waiting-cooldown";
      circusProvinciarumAutomationState.error = `Waiting for Circus Provinciarum availability · ${formatExpeditionCooldown(liveCircusCooldownMs)}.`;
      setModuleReadiness("provinciarum", liveCircusCooldownMs);
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-resume-blocked-cooldown", { cooldownMs: liveCircusCooldownMs });
      scheduleAutoCombatResume(Math.max(25, liveCircusCooldownMs + 25), "provinciarum-resume-cooldown");
      return;
    }

    if (circusProvinciarumAutomationState.completedRuns >= circusProvinciarumAutomationState.maxRuns) {
      circusProvinciarumAutomationState.enabled = false;
      circusProvinciarumAutomationState.phase = "complete";
      setModuleReadiness("provinciarum", null);
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      return;
    }

    if (isCombatReportPage() && circusReportDetection().isCircus) {
      const reportId = reportIdFromUrl();
      logAutoCombatDiagnostic("provinciarum-report-detected", { reportId });
      if (!reportId) {
        circusProvinciarumAutomationState.phase = "waiting-report";
        circusProvinciarumAutomationState.error = "Circus combat report has no report ID yet; waiting for the report URL to settle.";
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(500, "provinciarum-report-no-id");
        return;
      }

      const currentReportId = String(reportId);
      if (String(circusProvinciarumAutomationState.lastProcessedReportId || "") === currentReportId) {
        await handoffCircusProvinciarumFromReport(currentReportId, "already-processed");
        return;
      }
      const previousPendingReportId = circusProvinciarumAutomationState.pendingReportId || null;
      if (String(circusProvinciarumAutomationState.reportWaitReportId || "") !== currentReportId) {
        circusProvinciarumAutomationState.pendingReportId = currentReportId;
        circusProvinciarumAutomationState.reportWaitReportId = currentReportId;
        circusProvinciarumAutomationState.reportWaitStartedAt = Date.now();
        circusProvinciarumAutomationState.reportWaitAttempts = 0;
        logAutoCombatDiagnostic("provinciarum-report-context-reconciled", {
          previousPendingReportId,
          lastProcessedReportId: circusProvinciarumAutomationState.lastProcessedReportId || null,
          reportId: currentReportId
        });
        await saveCircusProvinciarumAutomationState();
      }
      circusProvinciarumAutomationState.reportWaitAttempts = Math.max(0, Number(circusProvinciarumAutomationState.reportWaitAttempts) || 0) + 1;

      // The passive report capture and the scheduler share this page. Once a
      // report ID is marked as processed, never parse/save the same report
      // again; hand the state machine directly back to the CP list/cooldown.
      if (!circusCombatStore) {
        try {
          await promiseWithTimeout(loadCircusCombatStore(), CIRCUS_REPORT_CAPTURE_TIMEOUT_MS, "Circus report store load for handoff");
        } catch (error) {
          logAutoCombatDiagnostic("provinciarum-report-store-load-timeout", { reportId: String(reportId), error: error?.message || String(error) });
        }
      }
      const storedReport = circusCombatStore?.reports?.find(report => String(report?.reportId) === String(reportId)) || null;
      const processed = String(circusProvinciarumAutomationState.lastProcessedReportId || "") === String(reportId);
      const storedComplete = !!storedReport?.captureDiagnostics?.readiness?.complete;
      logAutoCombatDiagnostic("provinciarum-report-processing-gate", {
        reportId: String(reportId),
        processed,
        storedComplete,
        captureInFlight: !!combatCaptureInFlight,
        completedRuns: circusProvinciarumAutomationState.completedRuns || 0
      });

      if (processed) {
        await handoffCircusProvinciarumFromReport(reportId, "already-processed");
        return;
      }

      if (storedComplete) {
        logAutoCombatDiagnostic("provinciarum-report-already-captured", { reportId: String(reportId) });
        await markCircusProvinciarumRunComplete(reportId);
        return;
      }

      let result;
      try {
        result = await promiseWithTimeout(
          captureCircusCombatReport(),
          CIRCUS_REPORT_CAPTURE_TIMEOUT_MS,
          "Circus Provinciarum report capture"
        );
      } catch (error) {
        result = {
          captured: false,
          reason: error?.code === "timeout" ? "capture-timeout" : "capture-error",
          error: error?.message || String(error)
        };
      }
      logAutoCombatDiagnostic("provinciarum-report-capture-result", result);
      if ((result?.captured || result?.reason === "already-captured") && reportId) {
        await markCircusProvinciarumRunComplete(reportId);
        return;
      }
      if (result?.reason === "report-not-ready" || result?.reason === "capture-error" || result?.reason === "busy" || result?.reason === "capture-timeout") {
        circusProvinciarumAutomationState.phase = "waiting-report";
        const startedAt = Number(circusProvinciarumAutomationState.reportWaitStartedAt) || Date.now();
        circusProvinciarumAutomationState.reportWaitStartedAt = startedAt;
        const elapsedMs = Math.max(0, Date.now() - startedAt);
        if (result?.reason === "capture-timeout") {
          circusProvinciarumAutomationState.error = `Circus report capture timed out after ${CIRCUS_REPORT_CAPTURE_TIMEOUT_MS}ms; checking again until the report recovery limit.`;
          logAutoCombatDiagnostic("provinciarum-report-capture-timeout", { reportId: String(reportId), timeoutMs: CIRCUS_REPORT_CAPTURE_TIMEOUT_MS, captureInFlight: !!combatCaptureInFlight, elapsedMs });
        } else {
          circusProvinciarumAutomationState.error = result?.reason === "capture-error" ? `Capturing Circus report: ${result.error || "temporary error"}` : result?.reason === "busy" ? "Another report capture is still finishing; checking the same report again." : "Waiting briefly for the 5v5 Circus report to finish loading.";
        }
        logAutoCombatDiagnostic("provinciarum-report-retry-state", {
          reportId: String(reportId),
          reason: result?.reason || "report-not-ready",
          elapsedMs,
          graceMs: CIRCUS_REPORT_LOADING_GRACE_MS,
          attempts: circusProvinciarumAutomationState.reportWaitAttempts || 0,
          missingRequired: result?.readiness?.missingRequired || []
        });
        if (elapsedMs >= CIRCUS_REPORT_LOADING_GRACE_MS) {
          logAutoCombatDiagnostic("provinciarum-report-recovery-timeout", {
            reportId: String(reportId),
            elapsedMs,
            graceMs: CIRCUS_REPORT_LOADING_GRACE_MS,
            attempts: circusProvinciarumAutomationState.reportWaitAttempts || 0,
            reason: "report-never-reached-complete-5v5-structure",
            missingRequired: result?.readiness?.missingRequired || [],
            missingOptional: result?.readiness?.missingOptional || []
          });

          // An incomplete Circus report is a failed/abandoned automation action,
          // not a reason to disable the entire scheduler. Mark this report as
          // handled so the same report cannot trap the module in waiting-report,
          // clear the pending action/navigation ownership, and return control to
          // the shared dispatcher. The fight is deliberately NOT counted.
          circusProvinciarumAutomationState.lastProcessedReportId = String(reportId);
          circusProvinciarumAutomationState.pendingReportId = null;
          circusProvinciarumAutomationState.reportWaitReportId = null;
          circusProvinciarumAutomationState.reportWaitStartedAt = null;
          circusProvinciarumAutomationState.reportWaitAttempts = 0;
          circusProvinciarumAutomationState.pendingTargetKey = null;
          circusProvinciarumAutomationState.pendingTargetName = "";
          circusProvinciarumAutomationState.phase = "queued";
          circusProvinciarumAutomationState.error = `Circus combat report did not become complete within the ${Math.round(CIRCUS_REPORT_LOADING_GRACE_MS / 1000)}-second recovery window; the fight was not counted. Returning to the routine.`;
          releaseAutomationNavigation("provinciarum");
          stopCircusProvinciarumAutomationTimer();
          await saveCircusProvinciarumAutomationState();
          renderAutoCombatUI();
          logAutoCombatDiagnostic("provinciarum-report-recovery-handoff", {
            reportId: String(reportId),
            completedRuns: circusProvinciarumAutomationState.completedRuns || 0,
            phase: circusProvinciarumAutomationState.phase,
            nextAction: "resume-shared-dispatcher",
            fightCounted: false
          });
          scheduleAutoCombatResume(0, "provinciarum-report-recovery-handoff");
          return;
        }
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(Math.max(100, Math.min(CIRCUS_REPORT_RETRY_MS, CIRCUS_REPORT_LOADING_GRACE_MS - elapsedMs)), "provinciarum-report-retry");
        return;
      }
      circusProvinciarumAutomationState.enabled = false;
      circusProvinciarumAutomationState.phase = "error";
      circusProvinciarumAutomationState.error = "Circus combat report could not be captured; automation stopped.";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-error", { error: circusProvinciarumAutomationState.error, result });
      return;
    }

    if (!isCircusProvinciarumPage()) {
      circusProvinciarumAutomationState.phase = "navigating";
      circusProvinciarumAutomationState.error = "Opening Circus Provinciarum.";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      const opened = await navigateToCircusProvinciarum();
      if (opened && circusProvinciarumAutomationState.enabled) scheduleAutoCombatResume(50, "provinciarum-page-ready");
      return;
    }

    const provinciarumRefreshPage = isCircusProvinciarumOpponentRefreshPage() && circusProvinciarumAutomationState.phase === "refreshing";
    if (provinciarumRefreshPage) {
      const refreshCooldownMs = circusProvinciarumCooldownMs();
      logAutoCombatDiagnostic("provinciarum-opponent-refresh-cooldown-check", {
        cooldownMs: refreshCooldownMs,
        url: location.href
      });
      if (!Number.isFinite(refreshCooldownMs)) {
        circusProvinciarumAutomationState.error = "Waiting for the Circus Provinciarum cooldown to appear after requesting new opponents.";
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(350, "provinciarum-opponent-refresh-wait-cooldown");
        return;
      }
      if (refreshCooldownMs > 0) {
        // The game's in-page opponent refresh has completed: the newly-started
        // Circus cooldown is the authoritative signal that the refresh action
        // was accepted. Do not keep the scheduler blocked on Circus until that
        // cooldown expires. Hand control back immediately so another ready
        // module (notably Arena) can be selected.
        circusProvinciarumAutomationState.phase = "waiting-cooldown";
        circusProvinciarumAutomationState.error = `Waiting for Circus Provinciarum availability · ${formatExpeditionCooldown(refreshCooldownMs)}.`;
        setModuleReadiness("provinciarum", refreshCooldownMs);
        releaseAutomationNavigation("provinciarum");
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("provinciarum-opponent-refresh-cooldown-detected", {
          cooldownMs: refreshCooldownMs,
          handoff: "shared-dispatcher"
        });
        scheduleAutoCombatResume(0, "provinciarum-refresh-complete-handoff");
        return;
      }
      const refreshedOpponents = parseCircusProvinciarumOpponents();
      logAutoCombatDiagnostic("provinciarum-opponent-refresh-page-ready", {
        opponentCount: refreshedOpponents.length,
        url: location.href
      });
      if (!refreshedOpponents.length) {
        circusProvinciarumAutomationState.error = "Waiting for the refreshed Circus Provinciarum opponent list to finish loading.";
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(350, "provinciarum-opponent-refresh-wait-list");
        return;
      }
      circusProvinciarumAutomationState.phase = "checking";
      circusProvinciarumAutomationState.error = null;
      setModuleReadiness("provinciarum", 0);
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-opponent-refresh-page-accepted", { opponentCount: refreshedOpponents.length });
    }

    const provinciarumContainer = document.querySelector("#own3");
    const provinciarumRows = provinciarumContainer ? provinciarumContainer.querySelectorAll("table tbody tr").length : 0;
    const parsedProvinciarumOpponents = parseCircusProvinciarumOpponents();
    logAutoCombatDiagnostic("provinciarum-page-ready", {
      opponentCount: parsedProvinciarumOpponents.length,
      containerFound: !!provinciarumContainer,
      containerId: provinciarumContainer?.id || null,
      rowCount: provinciarumRows,
      expectedContainerId: "own3",
      arenaContainerId: "own2"
    });
    const analysis = await analyzeCurrentCircusProvinciarumOpponents();
    logAutoCombatDiagnostic("provinciarum-opponent-analysis", { ok: analysis?.ok, completed: analysis?.completed, total: analysis?.total, failures: analysis?.failures });
    await recordOpponentAnalysisSnapshot("provinciarum", parseCircusProvinciarumOpponents(), circusProvinciarumAnalysisStore);
    if (!analysis?.ok) {
      const refreshed = await requestNewCircusProvinciarumOpponents();
      if (refreshed) {
        logAutoCombatDiagnostic("provinciarum-analysis-blocked-refreshed", {
          reason: analysis?.reason || null,
          completed: analysis?.completed || 0,
          total: analysis?.total || parsedProvinciarumOpponents.length
        });
        return;
      }
      circusProvinciarumAutomationState.phase = "checking";
      circusProvinciarumAutomationState.pendingTargetKey = null;
      circusProvinciarumAutomationState.pendingTargetName = "";
      circusProvinciarumAutomationState.error = analysis?.error || "No usable Circus Provinciarum opponent was captured; waiting to retry the opponent page.";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-analysis-retry-state", { reason: analysis?.reason || null, error: circusProvinciarumAutomationState.error });
      scheduleAutoCombatResume(1000, "provinciarum-analysis-retry");
      return;
    }

    const circusLowWinRateSafeguard = lowWinRateOpponentSetSafeguard(
      "provinciarum",
      parsedProvinciarumOpponents,
      circusProvinciarumAnalysisStore,
      circusProvinciarumOpponentIsAttempted
    );
    logAutoCombatDiagnostic("provinciarum-win-rate-safeguard-check", circusLowWinRateSafeguard);
    if (circusLowWinRateSafeguard.triggered) {
      const threshold = circusLowWinRateSafeguard.threshold;
      const refreshed = await requestNewCircusProvinciarumOpponents(
        `All ${circusLowWinRateSafeguard.candidates.length} unattempted Circus Provinciarum opponents are below the ${threshold}% minimum win-rate threshold; requesting a fresh opponent set.`
      );
      if (refreshed) {
        logAutoCombatDiagnostic("provinciarum-win-rate-safeguard-triggered", circusLowWinRateSafeguard);
        return;
      }
      circusProvinciarumAutomationState.phase = "checking";
      circusProvinciarumAutomationState.pendingTargetKey = null;
      circusProvinciarumAutomationState.pendingTargetName = "";
      circusProvinciarumAutomationState.error = "Waiting for the Circus Provinciarum Search for opponents control after the minimum win-rate safeguard.";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-win-rate-safeguard-refresh-retry", {
        ...circusLowWinRateSafeguard,
        reason: "refresh-control-unavailable"
      });
      scheduleAutoCombatResume(750, "provinciarum-win-rate-safeguard-refresh-retry");
      return;
    }

    const target = chooseCircusProvinciarumTarget();
    logAutoCombatDiagnostic("provinciarum-target-selection", {
      selected: target ? { key: target.key, name: target.name, level: target.level, province: target.province, playerId: target.playerId, winRate: circusProvinciarumAnalysisStore?.opponents?.[target.key]?.current?.winRate ?? null } : null,
      selectionPolicy: "highest win rate, then lowest expected team damage taken, then shortest expected fight",
      visibleOpponents: parseCircusProvinciarumOpponents().map(opponent => ({ key: opponent.key, name: opponent.name, level: opponent.level, province: opponent.province, playerId: opponent.playerId, attempted: circusProvinciarumOpponentIsAttempted(opponent), winRate: circusProvinciarumAnalysisStore?.opponents?.[opponent.key]?.current?.winRate ?? null }))
    });
    if (!target) {
      if (await requestNewCircusProvinciarumOpponents("No usable unattempted Circus Provinciarum opponent remains; requesting a fresh opponent set.")) return;
      circusProvinciarumAutomationState.phase = "checking";
      circusProvinciarumAutomationState.error = "No usable unattempted Circus Provinciarum opponent is available; waiting to retry the live opponent page.";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-target-retry-state", { reason: "no-target-and-refresh-unavailable" });
      scheduleAutoCombatResume(1000, "provinciarum-target-retry");
      return;
    }

    const targetWinRate = Number(circusProvinciarumAnalysisStore?.opponents?.[target.key]?.current?.winRate);
    const targetThreshold = minimumOpponentWinRateThresholdPercent();
    if (targetThreshold > 0 && (!Number.isFinite(targetWinRate) || targetWinRate < targetThreshold)) {
      logAutoCombatDiagnostic("provinciarum-target-blocked-win-rate", { target: target.name, winRate: Number.isFinite(targetWinRate) ? targetWinRate : null, threshold: targetThreshold });
      circusProvinciarumAutomationState.pendingTargetKey = null;
      circusProvinciarumAutomationState.pendingTargetName = "";
      circusProvinciarumAutomationState.phase = "queued";
      circusProvinciarumAutomationState.error = `Selected Circus Provinciarum opponent did not meet the ${targetThreshold}% minimum win-rate threshold; refreshing before any attack.`;
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      await requestNewCircusProvinciarumOpponents(circusProvinciarumAutomationState.error);
      return;
    }
    const preTargetClickCooldownMs = circusProvinciarumCooldownMs();
    if (Number.isFinite(preTargetClickCooldownMs) && preTargetClickCooldownMs > 0) {
      circusProvinciarumAutomationState.pendingTargetKey = null;
      circusProvinciarumAutomationState.pendingTargetName = "";
      circusProvinciarumAutomationState.phase = "waiting-cooldown";
      circusProvinciarumAutomationState.error = `Waiting for Circus Provinciarum availability · ${formatExpeditionCooldown(preTargetClickCooldownMs)}.`;
      setModuleReadiness("provinciarum", preTargetClickCooldownMs);
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-target-blocked-cooldown", { cooldownMs: preTargetClickCooldownMs, target: target.name });
      scheduleAutoCombatResume(Math.max(25, preTargetClickCooldownMs + 25), "provinciarum-target-cooldown");
      return;
    }

    circusProvinciarumAutomationState.pendingTargetKey = target.key;
    circusProvinciarumAutomationState.pendingTargetName = target.name;
    circusProvinciarumAutomationState.phase = "confirming";
    circusProvinciarumAutomationState.error = null;
    const cooldownBeforeClickMs = circusProvinciarumCooldownMs();
    await saveCircusProvinciarumAutomationState();
    renderAutoCombatUI();

    const opponentClicked = await humanizedClick(target.button, "provinciarum-opponent", {
      beforeClick: async () => {
        const cooldown = circusProvinciarumCooldownMs();
        if (Number.isFinite(cooldown) && cooldown > 0) {
          logAutoCombatDiagnostic("provinciarum-click-guard-cooldown", { target: target.name, cooldownMs: cooldown });
          return false;
        }
        return ensureAutoCombatHpSafety("provinciarum", "opponent-click");
      }
    });
    logAutoCombatDiagnostic("provinciarum-click-opponent-result", { clicked: opponentClicked, target: target.name });
    if (!opponentClicked || !circusProvinciarumAutomationState?.enabled) {
      if (autoHealingState?.active) {
        circusProvinciarumAutomationState.phase = "queued";
        circusProvinciarumAutomationState.error = "HP is below the configured threshold; healing before the Circus Provinciarum battle.";
        circusProvinciarumAutomationState.pendingTargetKey = null;
        circusProvinciarumAutomationState.pendingTargetName = "";
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(0, "provinciarum-waiting-healing");
        return;
      }
      const failedClickCooldownMs = circusProvinciarumCooldownMs();
      if (Number.isFinite(failedClickCooldownMs) && failedClickCooldownMs > 0) {
        circusProvinciarumAutomationState.phase = "waiting-report";
        circusProvinciarumAutomationState.error = "Circus Provinciarum cooldown started during the click delay; treating the attack as started and refusing a retry click.";
        markTargetAttempted();
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("provinciarum-click-blocked-after-cooldown-start", { target: target.name, cooldownMs: failedClickCooldownMs });
        scheduleAutoCombatResume(350, "provinciarum-click-blocked-after-cooldown-start");
        return;
      }
      circusProvinciarumAutomationState.phase = "error";
      circusProvinciarumAutomationState.error = "Circus Provinciarum opponent control disappeared before the click could be performed.";
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      return;
    }
    if (circusProvinciarumAutomationState.confirmationRetryTargetKey !== target.key) {
      circusProvinciarumAutomationState.confirmationRetryTargetKey = target.key;
      circusProvinciarumAutomationState.confirmationRetryCount = 0;
    }

    const markTargetAttempted = () => {
      circusProvinciarumAutomationState.attemptedOpponents[target.key] = {
        name: target.name, level: target.level, province: target.province, playerId: target.playerId, profileHost: target.profileHost, attemptedAt: new Date().toISOString()
      };
    };

    const confirmState = await waitForCircusProvinciarumConfirmation({ cooldownBeforeClickMs });
    logAutoCombatDiagnostic("provinciarum-confirmation-detected", {
      found: confirmState.kind === "confirmation",
      kind: confirmState.kind,
      reportId: confirmState.reportId || null,
      cooldownMs: confirmState.cooldownMs || null,
      elapsedMs: confirmState.elapsedMs
    });

    if (!circusProvinciarumAutomationState?.enabled) return;

    if (confirmState.kind === "report" && confirmState.reportId) {
      markTargetAttempted();
      circusProvinciarumAutomationState.confirmationRetryCount = 0;
      circusProvinciarumAutomationState.confirmationRetryTargetKey = null;
      circusProvinciarumAutomationState.phase = "waiting-report";
      circusProvinciarumAutomationState.error = null;
      circusProvinciarumAutomationState.pendingReportId = String(confirmState.reportId);
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-report-transition-after-opponent", { target: target.name, reportId: String(confirmState.reportId) });
      scheduleAutoCombatResume(150, "provinciarum-report-transition-detected");
      return;
    }

    if (confirmState.kind === "cooldown") {
      markTargetAttempted();
      circusProvinciarumAutomationState.confirmationRetryCount = 0;
      circusProvinciarumAutomationState.confirmationRetryTargetKey = null;
      circusProvinciarumAutomationState.phase = "waiting-report";
      circusProvinciarumAutomationState.error = "Circus Provinciarum attack started; the confirmation dialog was not visible before the fight cooldown began.";
      setModuleReadiness("provinciarum", null);
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("provinciarum-attack-started-without-visible-confirmation", { target: target.name, cooldownMs: confirmState.cooldownMs });
      scheduleAutoCombatResume(350, "provinciarum-attack-started-without-confirmation");
      return;
    }

    const handleConfirmationFailure = async (reason, extra = {}) => {
      const state = circusProvinciarumAutomationState;
      if (!state?.enabled) return;
      const previousCount = state.confirmationRetryTargetKey === target.key ? (Number(state.confirmationRetryCount) || 0) : 0;
      const nextCount = previousCount + 1;
      state.confirmationRetryTargetKey = target.key;
      state.confirmationRetryCount = nextCount;
      // The opponent is only considered attempted after Gladiatus accepts the
      // actual Go!/confirmation click. A missing/vanished confirmation must
      // therefore leave this opponent eligible for a retry.
      delete state.attemptedOpponents[target.key];
      state.pendingTargetKey = null;
      state.pendingTargetName = "";

      if (nextCount <= CIRCUS_CONFIRMATION_RETRY_LIMIT) {
        state.phase = "queued";
        state.error = `Circus Provinciarum confirmation was not completed; retrying the opponent (${nextCount}/${CIRCUS_CONFIRMATION_RETRY_LIMIT}).`;
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("provinciarum-confirmation-retry", {
          target: target.name, retryCount: nextCount, retryLimit: CIRCUS_CONFIRMATION_RETRY_LIMIT, reason, ...extra
        });
        scheduleAutoCombatResume(CIRCUS_CONFIRMATION_RETRY_DELAY_MS, "provinciarum-confirmation-retry");
        return;
      }

      state.confirmationRetryCount = 0;
      state.confirmationRetryTargetKey = null;
      await saveCircusProvinciarumAutomationState();
      const refreshed = await requestNewCircusProvinciarumOpponents(
        `Circus Provinciarum confirmation failed ${CIRCUS_CONFIRMATION_RETRY_LIMIT} times; requesting a fresh opponent set.`
      );
      if (!refreshed) {
        state.phase = "checking";
        state.error = "Circus Provinciarum confirmation could not be completed; waiting to retry the live opponent page.";
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("provinciarum-confirmation-refresh-fallback", {
          target: target.name, reason, ...extra
        });
        scheduleAutoCombatResume(1000, "provinciarum-confirmation-refresh-fallback");
      }
    };

    if (confirmState.kind !== "confirmation") {
      await handleConfirmationFailure("confirmation-timeout", { timeoutMs: CIRCUS_CONFIRMATION_TIMEOUT_MS, elapsedMs: confirmState.elapsedMs });
      return;
    }

    circusProvinciarumAutomationState.phase = "humanizing";
    circusProvinciarumAutomationState.error = null;
    setModuleReadiness("provinciarum", null);
    await saveCircusProvinciarumAutomationState();
    renderAutoCombatUI();
    const confirmed = await humanizedClick(confirmState.button, "provinciarum-confirm", {
      beforeClick: async () => {
        const cooldown = circusProvinciarumCooldownMs();
        if (Number.isFinite(cooldown) && cooldown > 0) {
          logAutoCombatDiagnostic("provinciarum-confirm-guard-cooldown", { target: target.name, cooldownMs: cooldown });
          return false;
        }
        return true;
      }
    });
    logAutoCombatDiagnostic("provinciarum-click-confirm-result", { clicked: confirmed, target: target.name });
    if (!confirmed || !circusProvinciarumAutomationState?.enabled) {
      await handleConfirmationFailure("confirmation-click-failed");
      return;
    }

    markTargetAttempted();
    circusProvinciarumAutomationState.confirmationRetryCount = 0;
    circusProvinciarumAutomationState.confirmationRetryTargetKey = null;
    circusProvinciarumAutomationState.phase = "waiting-report";
    await saveCircusProvinciarumAutomationState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("provinciarum-action-fired", { target: target.name });
  }

  function isProvinciarumArenaPage() {
    try {
      const url = new URL(location.href);
      return url.searchParams.get("mod") === "arena"
        && ["serverArena", "getNewOpponents"].includes(url.searchParams.get("submod"))
        && url.searchParams.get("aType") === "2";
    } catch (_) { return false; }
  }

  function isArenaOpponentRefreshPage() {
    try {
      const url = new URL(location.href);
      return url.searchParams.get("mod") === "arena"
        && url.searchParams.get("submod") === "getNewOpponents"
        && url.searchParams.get("aType") === "2";
    } catch (_) { return false; }
  }

  function parseArenaOpponents() {
    if (!isProvinciarumArenaPage()) return [];
    const rows = [...document.querySelectorAll("#own2 table tbody tr")];
    return rows.map((row, index) => {
      const cells = row.querySelectorAll(":scope > td");
      const profile = cells[0]?.querySelector('a[href*="mod=player"]');
      const attackButton = cells[3]?.querySelector(".attack");
      if (!profile || !attackButton) return null;
      let profileUrl = null;
      let playerId = null;
      let profileHost = location.hostname;
      try {
        profileUrl = new URL(profile.href || profile.getAttribute("href") || "", location.href);
        playerId = profileUrl.searchParams.get("p");
        profileHost = profileUrl.hostname || profileHost;
      } catch (_) {}
      const level = parseLocalizedInteger(cells[1]?.textContent || "");
      const province = normalize(cells[2]?.textContent || "");
      const name = normalize(profile.textContent || "");
      if (!playerId || !name || level == null) return null;
      return {
        index, name, level, province, playerId: String(playerId), profileHost, profileUrl: profileUrl?.href || null,
        key: `${profileHost}|${String(playerId)}|${province}`, button: attackButton, row
      };
    }).filter(Boolean);
  }

  function nativeOpponentWinRateLightState(winRate) {
    const n = Number(winRate);
    if (!Number.isFinite(n)) return "error";
    const threshold = minimumOpponentWinRateThresholdPercent();
    if (threshold > 0) {
      if (n >= threshold) return "good";
      if (n >= Math.max(0, threshold - 5)) return "warn";
      return "bad";
    }
    // With the minimum-win-rate safeguard disabled, use the simulation itself
    // as the traffic-light signal: >=65% green, 50–64.9% yellow, <50% red.
    if (n >= 65) return "good";
    if (n >= 50) return "warn";
    return "bad";
  }

  function nativeOpponentWinRateLabel(result, busy, mode) {
    if (busy) {
      return {
        text: "Analyzing…",
        state: "pending",
        light: "warn",
        title: `${mode === "circus" ? "Circus team" : "Arena opponent"} analysis is running with ${globalSimulationCount()} simulations.`
      };
    }
    if (!result) return null;
    if (result.ok) {
      const winRate = Number(result.current?.winRate);
      if (!Number.isFinite(winRate)) {
        return { text: "Win rate unavailable", state: "error", light: "error", title: "The analysis result did not contain a valid win-rate value." };
      }
      const simulations = Number(result.simulations);
      const configured = globalSimulationCount();
      if (Number.isFinite(simulations) && simulations !== configured) {
        return {
          text: "Reanalyze",
          state: "stale",
          light: "warn",
          title: `This result used ${simulations} simulations, while the current global setting is ${configured}. Click Analyze Now to refresh this result.`
        };
      }
      return {
        text: `Winrate: ${winRate.toFixed(1)}%`,
        state: "ready",
        light: nativeOpponentWinRateLightState(winRate),
        title: `${mode === "circus" ? "5v5 team" : "Arena opponent"} simulation: ${winRate.toFixed(1)}% win rate using ${Number.isFinite(simulations) ? simulations : configured} simulations.`
      };
    }
    return {
      text: "Analysis unavailable",
      state: "error",
      light: "error",
      title: result.error || "The opponent analysis did not complete successfully."
    };
  }

  function positionNativeOpponentWinRateBadge(badge, attackButton, actionCell) {
    if (!badge || !attackButton || !actionCell) return;
    const cellRect = actionCell.getBoundingClientRect();
    const attackRect = attackButton.getBoundingClientRect();
    if (!cellRect.width && !cellRect.height) return;
    const left = Math.max(0, attackRect.right - cellRect.left + 7);
    const centerY = attackRect.top - cellRect.top + attackRect.height / 2;
    badge.style.left = `${left}px`;
    badge.style.top = `${centerY}px`;
  }

  function clearNativeOpponentWinRateHost(actionCell) {
    if (!actionCell) return;
    actionCell.classList.remove("ga-native-winrate-host");
  }

  function renderNativeOpponentWinRateBadges() {
    const arenaPage = isProvinciarumArenaPage();
    const circusPage = isCircusProvinciarumPage();
    if (!arenaPage && !circusPage) {
      document.querySelectorAll(".ga-native-winrate-badge").forEach(el => el.remove());
      document.querySelectorAll(".ga-native-winrate-host").forEach(el => clearNativeOpponentWinRateHost(el));
      return;
    }

    const mode = circusPage ? "circus" : "arena";
    const container = circusPage ? document.querySelector("#own3") : document.querySelector("#own2");
    if (!container) return;
    const opponents = circusPage ? parseCircusProvinciarumOpponents() : parseArenaOpponents();
    const store = circusPage ? circusProvinciarumAnalysisStore : arenaOpponentAnalysisStore;
    const busy = circusPage ? circusProvinciarumAnalysisBusy : arenaAnalysisBusy;
    const activeRows = new Set(opponents.map(op => op.row));

    document.querySelectorAll(".ga-native-winrate-badge").forEach(el => {
      const row = el.closest("tr");
      if (!row || !activeRows.has(row)) {
        const host = el.closest("td");
        el.remove();
        clearNativeOpponentWinRateHost(host);
      }
    });

    for (const opponent of opponents) {
      const row = opponent.row;
      const profile = row?.querySelector('a[href*="mod=player"]');
      const attackButton = opponent.button || row?.querySelector(".attack");
      const actionCell = attackButton?.closest("td") || attackButton?.parentElement;
      if (!row || !profile || !attackButton || !actionCell) continue;
      const result = store?.opponents?.[opponent.key] || null;
      const state = nativeOpponentWinRateLabel(result, busy, mode);
      if (!state) {
        const existing = row.querySelector(".ga-native-winrate-badge");
        const host = existing?.closest("td");
        existing?.remove();
        clearNativeOpponentWinRateHost(host);
        continue;
      }

      let badge = row.querySelector(".ga-native-winrate-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "ga-native-winrate-badge";
        badge.dataset.gaMode = mode;
        const dot = document.createElement("span");
        dot.className = "ga-native-winrate-dot";
        dot.setAttribute("aria-hidden", "true");
        const label = document.createElement("span");
        label.className = "ga-native-winrate-text";
        badge.append(dot, label);
        actionCell.appendChild(badge);
      }

      actionCell.classList.add("ga-native-winrate-host");
      badge.dataset.state = state.state;
      badge.dataset.light = state.light;
      badge.title = state.title;
      const dot = badge.querySelector(".ga-native-winrate-dot");
      const label = badge.querySelector(".ga-native-winrate-text");
      if (dot) dot.dataset.light = state.light;
      if (label && label.textContent !== state.text) label.textContent = state.text;
      positionNativeOpponentWinRateBadge(badge, attackButton, actionCell);
    }
  }

  function scheduleNativeOpponentWinRateRender() {
    if (nativeOpponentWinRateRenderTimer) return;
    nativeOpponentWinRateRenderTimer = setTimeout(() => {
      nativeOpponentWinRateRenderTimer = null;
      renderNativeOpponentWinRateBadges();
    }, 0);
  }

  function scheduleNativeOpponentWinRateAutoAnalysis({ force = false } = {}) {
    if (!nativeOpponentWinRateAutoAnalysisReady) return;
    const arenaPage = isProvinciarumArenaPage();
    const circusPage = isCircusProvinciarumPage();
    if (!arenaPage && !circusPage) return;
    const mode = circusPage ? "circus" : "arena";
    if (nativeOpponentWinRateAutoAnalysisTimer) return;
    if (mode === "circus" && circusProvinciarumAnalysisBusy) return;
    if (mode === "arena" && arenaAnalysisBusy) return;

    const opponents = circusPage ? parseCircusProvinciarumOpponents() : parseArenaOpponents();
    if (opponents.length !== 5) return;
    const setSignature = circusPage
      ? circusProvinciarumAnalysisSetSignature(opponents)
      : arenaAnalysisSetSignature(opponents);

    // ChildList mutations are extremely frequent on Gladiatus pages, including
    // mutations caused by our own badge rendering. Only analyze automatically
    // when the actual five-opponent set changes, unless explicitly forced by
    // initialization/settings changes.
    if (!force && nativeOpponentWinRateObservedSetSignature[mode] === setSignature) return;

    nativeOpponentWinRateAutoAnalysisTimer = setTimeout(() => {
      nativeOpponentWinRateAutoAnalysisTimer = null;
      void (async () => {
        try {
          if (isProvinciarumArenaPage()) {
            const currentOpponents = parseArenaOpponents();
            if (currentOpponents.length !== 5) return;
            const currentSignature = arenaAnalysisSetSignature(currentOpponents);
            if (!force && nativeOpponentWinRateObservedSetSignature.arena === currentSignature) return;
            const result = await analyzeCurrentArenaOpponents();
            nativeOpponentWinRateObservedSetSignature.arena = result?.setSignature || currentSignature;
            const signature = `${result?.setSignature || ""}|${result?.completed || 0}|${result?.total || 0}|${result?.failures || 0}|${result?.ok ? 1 : 0}|${result?.reused ? 1 : 0}`;
            if (nativeWinrateLastLoggedSignature.arena !== signature) {
              nativeWinrateLastLoggedSignature.arena = signature;
              logAutoCombatDiagnostic(result?.reused ? "native-arena-winrate-cache-reused" : "native-arena-winrate-auto-analysis-complete", { ok: !!result?.ok, reused: !!result?.reused, completed: result?.completed || 0, total: result?.total || 0, failures: result?.failures || 0, simulations: arenaSimulationCount(), setSignature: result?.setSignature || null });
            }
          } else if (isCircusProvinciarumPage()) {
            const currentOpponents = parseCircusProvinciarumOpponents();
            if (currentOpponents.length !== 5) return;
            const currentSignature = circusProvinciarumAnalysisSetSignature(currentOpponents);
            if (!force && nativeOpponentWinRateObservedSetSignature.circus === currentSignature) return;
            const result = await analyzeCurrentCircusProvinciarumOpponents();
            nativeOpponentWinRateObservedSetSignature.circus = result?.setSignature || currentSignature;
            const signature = `${result?.setSignature || ""}|${result?.completed || 0}|${result?.total || 0}|${result?.failures || 0}|${result?.ok ? 1 : 0}|${result?.reused ? 1 : 0}`;
            if (nativeWinrateLastLoggedSignature.circus !== signature) {
              nativeWinrateLastLoggedSignature.circus = signature;
              logAutoCombatDiagnostic(result?.reused ? "native-provinciarum-winrate-cache-reused" : "native-provinciarum-winrate-auto-analysis-complete", { ok: !!result?.ok, reused: !!result?.reused, completed: result?.completed || 0, total: result?.total || 0, failures: result?.failures || 0, simulations: circusProvinciarumSimulationCount(), setSignature: result?.setSignature || null });
            }
          }
        } catch (error) {
          logAutoCombatDiagnostic("native-winrate-auto-analysis-error", { mode: isCircusProvinciarumPage() ? "circus" : "arena", error: error?.message || String(error), stack: error?.stack || null });
        }
      })();
    }, 50);
  }

  function initializeNativeOpponentWinRateDisplay() {
    if (typeof MutationObserver === "undefined" || !document.body) {
      renderNativeOpponentWinRateBadges();
      return;
    }
    if (!nativeOpponentWinRateObserver) {
      nativeOpponentWinRateObserver = new MutationObserver((records) => {
        const relevant = records.some(record => record.type === "childList");
        if (!relevant) return;
        if (!isProvinciarumArenaPage() && !isCircusProvinciarumPage()) return;
        scheduleNativeOpponentWinRateRender();
        scheduleNativeOpponentWinRateAutoAnalysis();
      });
      nativeOpponentWinRateObserver.observe(document.body, { childList: true, subtree: true });
    }
    scheduleNativeOpponentWinRateRender();
  }

  function arenaAutomationStatusText() {
    const state = arenaAutomationState;
    if (!state?.enabled) {
      const captured = arenaCombatStore?.reports?.length || 0;
      return state?.phase === "complete" ? `Complete · ${state.completedRuns || 0}/${state.maxRuns || 0} fights · ${captured} Arena reports captured.` : "Stopped.";
    }
    const runs = Number(state.completedRuns) || 0;
    const max = Number(state.maxRuns) || 0;
    const target = state.pendingTargetName || "target";
    const stats = autoOpponentSearchStats(state);
    const withStats = text => `${text} · ${stats}`;
    switch (state.phase) {
      case "starting": return withStats(`Starting · ${runs}/${max}`);
      case "navigating": return withStats(`Opening Provinciarum Arena · ${runs}/${max}`);
      case "waiting-cooldown": return withStats(`Waiting for Arena cooldown · ${runs}/${max}`);
      case "waiting-other": return withStats(`Waiting for dispatcher · ${runs}/${max}`);
      case "queued": return withStats(`Ready check · ${moduleReadinessLabel("arena")} · ${runs}/${max}`);
      case "checking": return withStats(`Analyzing Arena opponents · ${runs}/${max}`);
      case "refreshing": return withStats(`Requesting a new opponent set · ${runs}/${max}`);
      case "confirming": return withStats(`Confirming attack · ${target} · ${runs}/${max}`);
      case "attacking": return withStats(`Arena fight started · ${target} · ${runs}/${max}`);
      case "humanizing": return withStats(`Preparing Arena action · ${target} · ${runs}/${max}`);
      case "waiting-report": return withStats(`Waiting for Arena report · ${target} · ${runs}/${max}`);
      case "error": return withStats(`Stopped: ${state.error || "unexpected state"}`);
      default: return withStats(`Running · ${runs}/${max}`);
    }
  }

  async function loadArenaAutomationState() {
    try {
      const result = await storageGet(arenaAutomationKey());
      const stored = result?.[arenaAutomationKey()];
      if (stored && typeof stored === "object") {
        const recoverKnownError = !stored.enabled && stored.phase === "error" && /Could not capture and simulate every available Arena opponent|Arena attack confirmation did not appear|Arena confirmation disappeared before the click could be performed/i.test(String(stored.error || ""));
        arenaAutomationState = {
          enabled: !!stored.enabled || recoverKnownError,
          maxRuns: Math.max(1, Math.min(ARENA_MAX_RUNS, Number(stored.maxRuns) || 100)),
          completedRuns: Math.max(0, Number(stored.completedRuns) || 0),
          opponentSearches: Math.max(0, Number(stored.opponentSearches) || 0),
          bestObservedWinRate: ((Number(stored.opponentSearches) || 0) === 0 && (Number(stored.completedRuns) || 0) === 0 && !stored.lastBattle) ? null : (Number.isFinite(Number(stored.bestObservedWinRate)) ? Number(stored.bestObservedWinRate) : null),
          lastBattle: stored.lastBattle && typeof stored.lastBattle === "object" ? { ...stored.lastBattle } : null,
          attemptedOpponents: stored.attemptedOpponents && typeof stored.attemptedOpponents === "object" ? { ...stored.attemptedOpponents } : {},
          pendingTargetKey: stored.pendingTargetKey ? String(stored.pendingTargetKey) : null,
          pendingTargetName: normalize(stored.pendingTargetName || ""),
          confirmationRetryCount: Math.max(0, Number(stored.confirmationRetryCount) || 0),
          confirmationRetryTargetKey: stored.confirmationRetryTargetKey ? String(stored.confirmationRetryTargetKey) : null,
          pendingReportId: stored.pendingReportId ? String(stored.pendingReportId) : null,
          readiness: stored.readiness === "ready" || stored.readiness === "cooling" ? stored.readiness : "unknown",
          readyAt: Number.isFinite(Number(stored.readyAt)) ? Number(stored.readyAt) : null,
          phase: recoverKnownError ? "queued" : (stored.phase || "stopped"),
          startedAt: stored.startedAt || null,
          error: recoverKnownError ? null : (stored.error || null)
        };
        return arenaAutomationState;
      }
    } catch (_) {}
    arenaAutomationState = {
      enabled: false, maxRuns: 100, completedRuns: 0, opponentSearches: 0, bestObservedWinRate: null, lastBattle: null, attemptedOpponents: {},
      pendingTargetKey: null, pendingTargetName: "", confirmationRetryCount: 0, confirmationRetryTargetKey: null, pendingReportId: null,
      readiness: "unknown", readyAt: null,
      phase: "stopped", startedAt: null, error: null
    };
    return arenaAutomationState;
  }

  async function saveArenaAutomationState() {
    if (!arenaAutomationState) return;
    try { await storageSet({ [arenaAutomationKey()]: arenaAutomationState }); } catch (_) {}
  }

  function stopArenaAutomationTimer() {
    if (arenaAutomationTimer) { clearTimeout(arenaAutomationTimer); arenaAutomationTimer = null; }
  }

  function releaseAutomationNavigation(owner = null) {
    if (owner && automationNavigationOwner !== owner) return;
    automationNavigationOwner = null;
    if (automationNavigationReleaseTimer) {
      clearTimeout(automationNavigationReleaseTimer);
      automationNavigationReleaseTimer = null;
    }
  }

  function beginAutomationNavigation(owner) {
    if (!owner) return false;
    if (automationNavigationOwner && automationNavigationOwner !== owner) return false;
    automationNavigationOwner = owner;
    if (automationNavigationReleaseTimer) clearTimeout(automationNavigationReleaseTimer);
    automationNavigationReleaseTimer = setTimeout(() => {
      if (automationNavigationOwner === owner) releaseAutomationNavigation(owner);
    }, 15000);
    return true;
  }

  function arenaCooldownMs() {
    const text = normalize(document.querySelector("#cooldown_bar_text_arena")?.textContent || "");
    if (!text) return null;
    if (/go to the arena/i.test(text) || /^ready$/i.test(text)) return 0;
    const m = text.match(/^(?:(\d+)\s*:)??(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const hours = Number(m[1] || 0);
    const minutes = Number(m[2] || 0);
    const seconds = Number(m[3] || 0);
    return ((hours * 60 + minutes) * 60 + seconds) * 1000;
  }

  function findProvinciarumArenaLink() {
    const selectors = [
      'a[href*="mod=arena"][href*="submod=serverArena"][href*="aType=2"]',
      '#cooldown_bar_arena .cooldown_bar_link'
    ];
    for (const selector of selectors) {
      for (const anchor of Array.from(document.querySelectorAll(selector))) {
        if (!anchor?.href) continue;
        try {
          const url = new URL(anchor.href, location.href);
          if (url.origin === location.origin && url.searchParams.get("mod") === "arena" && url.searchParams.get("submod") === "serverArena" && url.searchParams.get("aType") === "2") return anchor;
        } catch (_) {}
      }
    }
    return null;
  }

  function findRegularArenaLink() {
    const selectors = [
      'a[href*="mod=arena"]',
      '#mainnav a.awesome-tabs'
    ];
    for (const selector of selectors) {
      for (const anchor of Array.from(document.querySelectorAll(selector))) {
        if (!anchor?.href) continue;
        try {
          const url = new URL(anchor.href, location.href);
          if (url.origin === location.origin
            && url.searchParams.get("mod") === "arena"
            && !url.searchParams.get("submod")
            && !url.searchParams.get("aType")) return anchor;
        } catch (_) {}
      }
    }
    return null;
  }

  function isRegularArenaPage() {
    try {
      const url = new URL(location.href);
      return url.searchParams.get("mod") === "arena"
        && !url.searchParams.get("submod")
        && !url.searchParams.get("aType");
    } catch (_) { return false; }
  }

  function fallbackRegularArenaHref() {
    try {
      const current = new URL(location.href);
      const target = new URL("/game/index.php", location.origin);
      target.searchParams.set("mod", "arena");
      const sh = current.searchParams.get("sh");
      if (sh) target.searchParams.set("sh", sh);
      return target.href;
    } catch (_) { return null; }
  }

  function arenaOpponentIsAttempted(opponent) {
    return !!opponent && Object.prototype.hasOwnProperty.call(arenaAutomationState?.attemptedOpponents || {}, opponent.key);
  }

  function autoOpponentSearchStats(state) {
    const searches = Math.max(0, Number(state?.opponentSearches) || 0);
    const best = Number.isFinite(Number(state?.bestObservedWinRate)) ? Number(state.bestObservedWinRate) : null;
    return `Searches ${searches} · Best ${best == null ? "—" : `${best.toFixed(1)}%`}`;
  }

  async function recordOpponentAnalysisSnapshot(module, opponents, analysisStore) {
    const state = module === "arena" ? arenaAutomationState : circusProvinciarumAutomationState;
    if (!state) return;
    const attempted = module === "arena" ? arenaOpponentIsAttempted : circusProvinciarumOpponentIsAttempted;
    const rates = (Array.isArray(opponents) ? opponents : [])
      .filter(opponent => !attempted(opponent))
      .map(opponent => Number(analysisStore?.opponents?.[opponent.key]?.current?.winRate))
      .filter(Number.isFinite);
    if (!rates.length) return;
    const best = Math.max(...rates);
    state.bestObservedWinRate = Number.isFinite(Number(state.bestObservedWinRate)) ? Math.max(Number(state.bestObservedWinRate), best) : best;
    await (module === "arena" ? saveArenaAutomationState() : saveCircusProvinciarumAutomationState());
  }

  function lowWinRateOpponentSetSafeguard(module, opponents, analysisStore, attemptedPredicate) {
    const threshold = minimumOpponentWinRateThresholdPercent();
    if (threshold <= 0) return { triggered: false, disabled: true, threshold, candidates: [], winRates: [], missing: [] };
    const candidates = (Array.isArray(opponents) ? opponents : [])
      .filter(opponent => !attemptedPredicate || !attemptedPredicate(opponent));
    const rows = candidates.map(opponent => ({
      opponent,
      analysis: analysisStore?.opponents?.[opponent.key] || null
    }));
    const missing = rows.filter(row => !row.analysis?.ok || !Number.isFinite(Number(row.analysis?.current?.winRate)));
    const winRates = rows
      .filter(row => row.analysis?.ok && Number.isFinite(Number(row.analysis?.current?.winRate)))
      .map(row => Number(row.analysis.current.winRate));
    const triggered = winRates.length > 0 && winRates.every(rate => rate < threshold);
    const eligibleCandidates = rows.filter(row => row.analysis?.ok && Number.isFinite(Number(row.analysis?.current?.winRate))
      && Number(row.analysis.current.winRate) >= threshold);
    return {
      triggered,
      disabled: false,
      threshold,
      candidates: candidates.map(opponent => ({ key: opponent.key, name: opponent.name, index: opponent.index })),
      analyzedCandidates: rows.filter(row => row.analysis?.ok && Number.isFinite(Number(row.analysis?.current?.winRate))).map(row => ({ key: row.opponent.key, name: row.opponent.name, index: row.opponent.index, winRate: Number(row.analysis.current.winRate) })),
      eligibleCandidates: eligibleCandidates.map(row => ({ key: row.opponent.key, name: row.opponent.name, index: row.opponent.index, winRate: Number(row.analysis.current.winRate) })),
      winRates,
      missing: missing.map(row => ({ key: row.opponent.key, name: row.opponent.name, reason: row.analysis?.error || "win rate unavailable" }))
    };
  }

  function chooseArenaTarget() {
    const threshold = minimumOpponentWinRateThresholdPercent();
    const candidates = parseArenaOpponents().filter(opponent => !arenaOpponentIsAttempted(opponent));
    const analyzed = candidates
      .map(opponent => ({ opponent, analysis: arenaOpponentAnalysisStore?.opponents?.[opponent.key] || null }))
      .filter(row => row.analysis?.ok && Number.isFinite(Number(row.analysis?.current?.winRate))
        && (threshold <= 0 || Number(row.analysis.current.winRate) >= threshold));
    if (analyzed.length) {
      analyzed.sort((a, b) => {
        const aw = Number(a.analysis?.current?.winRate ?? -1);
        const bw = Number(b.analysis?.current?.winRate ?? -1);
        if (bw !== aw) return bw - aw;
        const ad = Number(a.analysis?.current?.avgEnemyDamage ?? a.analysis?.current?.avgPlayerDamage ?? 0);
        const bd = Number(b.analysis?.current?.avgEnemyDamage ?? b.analysis?.current?.avgPlayerDamage ?? 0);
        if (ad !== bd) return ad - bd;
        const ar = Number(a.analysis?.current?.avgRounds ?? Number.POSITIVE_INFINITY);
        const br = Number(b.analysis?.current?.avgRounds ?? Number.POSITIVE_INFINITY);
        if (ar !== br) return ar - br;
        return a.opponent.index - b.opponent.index;
      });
      return analyzed[0].opponent;
    }
    return null;
  }

  async function waitForArenaConfirmation({ timeoutMs = 9000, cooldownBeforeClickMs = null } = {}) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      if (isCombatReportPage() && arenaReportDetection().isArena) {
        return { kind: "report", reportId: reportIdFromUrl(), elapsedMs: Date.now() - started };
      }
      const button = visibleArenaConfirmationButton();
      if (button) return { kind: "confirmation", button, elapsedMs: Date.now() - started };
      const cooldownNow = arenaCooldownMs();
      if (Number.isFinite(cooldownBeforeClickMs) && cooldownBeforeClickMs <= 0 && Number.isFinite(cooldownNow) && cooldownNow > 0) {
        return { kind: "cooldown", cooldownMs: cooldownNow, elapsedMs: Date.now() - started };
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    return { kind: "timeout", elapsedMs: Date.now() - started };
  }

  async function navigateToProvinciarumArena() {
    if (isProvinciarumArenaPage()) return true;
    if (!beginAutomationNavigation("arena")) {
      logAutoCombatDiagnostic("arena-navigation-blocked", { owner: automationNavigationOwner });
      arenaAutomationState.phase = "queued";
      arenaAutomationState.error = "Navigation is owned by the active combat job; this job remains queued.";
      await saveArenaAutomationState();
      renderAutoCombatUI();
      return false;
    }

    const finalLink = findProvinciarumArenaLink();
    if (finalLink) {
      stopArenaAutomationTimer();
      arenaAutomationState.phase = "navigating";
      arenaAutomationState.error = null;
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-navigation-click-start", {
        step: "final",
        href: finalLink.href || finalLink.getAttribute("href") || null
      });
      const clicked = await humanizedClick(finalLink, "arena-navigation");
      logAutoCombatDiagnostic("arena-navigation-click-result", {
        step: "final",
        clicked,
        href: finalLink.href || finalLink.getAttribute("href") || null
      });
      if (!clicked) {
        releaseAutomationNavigation("arena");
        arenaAutomationState.phase = "checking";
        arenaAutomationState.error = "Arena navigation control disappeared before the click could be performed; retrying.";
        await saveArenaAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(500, "arena-navigation-click-failed");
      }
      return false;
    }

    if (isRegularArenaPage()) {
      arenaAutomationState.phase = "navigating";
      arenaAutomationState.error = "On regular Arena; waiting for the Provinciarum Arena link.";
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-navigation-intermediate-ready", {
        step: "regular-arena",
        destination: "Provinciarum Arena"
      });
      scheduleAutoCombatResume(350, "arena-final-link-wait");
      return false;
    }

    const intermediateLink = findRegularArenaLink();
    const fallbackHref = fallbackRegularArenaHref();
    const href = intermediateLink?.href || fallbackHref;
    if (!href) {
      releaseAutomationNavigation("arena");
      arenaAutomationState.phase = "error";
      arenaAutomationState.error = "Could not reach regular Arena to continue to Provinciarum Arena.";
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-navigation-link-missing", {
        step: "intermediate",
        target: "regular-arena"
      });
      return false;
    }

    stopArenaAutomationTimer();
    arenaAutomationState.phase = "navigating";
    arenaAutomationState.error = "Provinciarum Arena is not directly reachable; opening regular Arena first.";
    await saveArenaAutomationState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("arena-navigation-intermediate-start", {
      step: "regular-arena",
      href
    });
    if (intermediateLink) {
      const clicked = await humanizedClick(intermediateLink, "arena-navigation-intermediate");
      logAutoCombatDiagnostic("arena-navigation-intermediate-result", { clicked, href });
      if (!clicked) {
        releaseAutomationNavigation("arena");
        arenaAutomationState.phase = "checking";
        arenaAutomationState.error = "Regular Arena navigation control disappeared before the click could be performed; retrying.";
        await saveArenaAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(500, "arena-intermediate-click-failed");
      }
    } else {
      logAutoCombatDiagnostic("arena-navigation-intermediate-fallback", { step: "regular-arena", href });
      location.href = href;
    }
    return false;
  }

  function findArenaOpponentRefreshControl() {
    const form = document.querySelector('form[name="filterForm"][action*="getNewOpponents"][action*="aType=2"]');
    if (!form) return null;
    return form.querySelector('input[type="submit"][name="actionButton"]')
      || form.querySelector('button[type="submit"]')
      || form.querySelector('input[type="submit"]')
      || form.querySelector('button[name="actionButton"]')
      || null;
  }

  async function requestNewArenaOpponents(reason = null) {
    const form = document.querySelector('form[name="filterForm"][action*="getNewOpponents"][action*="aType=2"]');
    const submit = findArenaOpponentRefreshControl();
    if (!form || !submit) {
      logAutoCombatDiagnostic("arena-opponent-refresh-control-missing", {
        reason: reason || null,
        url: location.href,
        page: document.body?.id || null
      });
      return false;
    }
    const currentCooldownMs = arenaCooldownMs();
    if (Number.isFinite(currentCooldownMs) && currentCooldownMs > 0) {
      arenaAutomationState.phase = "waiting-cooldown";
      arenaAutomationState.error = `Waiting for Arena availability · ${formatExpeditionCooldown(currentCooldownMs)}.`;
      setModuleReadiness("arena", currentCooldownMs);
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-opponent-refresh-blocked-cooldown", { cooldownMs: currentCooldownMs, reason: reason || null });
      scheduleAutoCombatResume(Math.max(25, currentCooldownMs + 25), "arena-refresh-cooldown");
      return false;
    }
    arenaAutomationState.phase = "refreshing";
    arenaAutomationState.error = reason || "All five visible opponents have already been attempted; requesting a fresh opponent set.";
    await saveArenaAutomationState();
    renderAutoCombatUI();
    stopArenaAutomationTimer();
    const previousSearches = Math.max(0, Number(arenaAutomationState.opponentSearches) || 0);
    arenaAutomationState.opponentSearches = previousSearches + 1;
    await saveArenaAutomationState();
    logAutoCombatDiagnostic("arena-opponent-refresh-start", {
      searchNumber: arenaAutomationState.opponentSearches,
      reason: reason || null
    });
    const clicked = await humanizedClick(submit, "arena-refresh-opponents");
    if (clicked) {
      scheduleAutoCombatResume(500, "arena-opponent-refresh-settle");
    }
    if (!clicked) {
      arenaAutomationState.opponentSearches = previousSearches;
      arenaAutomationState.phase = "checking";
      arenaAutomationState.error = "Search control disappeared before the click could be performed; retrying.";
      await saveArenaAutomationState();
      renderAutoCombatUI();
      scheduleAutoCombatResume(500);
      return false;
    }
    return true;
  }

  async function stopArenaAutomation() {
    arenaReportWaitStartedAt = 0;
    stopArenaAutomationTimer();
    releaseAutomationNavigation("arena");
    arenaAutomationState = arenaAutomationState || await loadArenaAutomationState();
    arenaAutomationState.enabled = false;
    arenaAutomationState.phase = "stopped";
    arenaAutomationState.error = null;
    arenaAutomationState.readiness = "unknown";
    arenaAutomationState.readyAt = null;
    await saveArenaAutomationState();
    renderAutoCombatUI();
    if (!autoCombatEnabledModules().length) { stopAutoCombatDispatcherTimer(); stopAutoCombatCooldownObserver(); }
    else scheduleAutoCombatResume(0, "arena-stopped-handoff");
    if (statusEl) statusEl.textContent = "Arena automation stopped.";
  }

  async function startArenaAutomation({ deferScheduler = false } = {}) {
    if (arenaAutomationBusy) return;
    arenaAutomationBusy = true;
    try {
      if (!arenaAutomationState) await loadArenaAutomationState();
      const runsInput = shadow?.querySelector("#ga-auto-arena-runs");
      const maxRuns = Math.max(1, Math.min(ARENA_MAX_RUNS, Number(runsInput?.value) || arenaAutomationState.maxRuns || 100));
      arenaReportWaitStartedAt = 0;
      arenaAutomationState = {
        enabled: true, maxRuns, completedRuns: 0, opponentSearches: 0, bestObservedWinRate: null, lastBattle: null, attemptedOpponents: {},
        pendingTargetKey: null, pendingTargetName: "", confirmationRetryCount: 0, confirmationRetryTargetKey: null, pendingReportId: null,
        readiness: "unknown", readyAt: null,
          phase: "starting", startedAt: new Date().toISOString(), error: null
      };
      await saveArenaAutomationState();
      renderAutoCombatUI();
      ensureAutoCombatCooldownObserver();
      if (!deferScheduler) scheduleAutoCombatResume(250);
    } finally {
      arenaAutomationBusy = false;
    }
  }

  async function markArenaRunComplete(reportId) {
    if (!arenaAutomationState?.enabled) return;
    arenaReportWaitStartedAt = 0;
    const id = reportId ? String(reportId) : null;
    if (!id || id === arenaAutomationState.pendingReportId) return;
    arenaAutomationState.pendingReportId = id;
    arenaAutomationState.completedRuns = Math.min(arenaAutomationState.maxRuns, (Number(arenaAutomationState.completedRuns) || 0) + 1);
    const postBattleDecision = buildAutoCombatPostBattleDecision("arena", id, arenaAutomationState.completedRuns, arenaAutomationState.maxRuns);
    arenaAutomationState.lastBattle = postBattleDecision;
    logAutoCombatDiagnostic("arena-post-battle-decision", postBattleDecision);
    const matchedArenaTargetKey = arenaAutomationState.pendingTargetKey || null;
    const predictedArenaWinRate = matchedArenaTargetKey ? Number(arenaOpponentAnalysisStore?.opponents?.[matchedArenaTargetKey]?.current?.winRate) : NaN;
    if (Number.isFinite(predictedArenaWinRate) && ((postBattleDecision.result === "Loss" && predictedArenaWinRate >= 80) || (postBattleDecision.result === "Win" && predictedArenaWinRate <= 20))) {
      logAutoCombatDiagnostic("arena-prediction-mismatch", {
        target: postBattleDecision.opponent, targetKey: matchedArenaTargetKey, predictedWinRate: predictedArenaWinRate,
        actualResult: postBattleDecision.result, reportId: id, simulations: arenaOpponentAnalysisStore?.opponents?.[matchedArenaTargetKey]?.simulations || null,
        seed: arenaOpponentAnalysisStore?.opponents?.[matchedArenaTargetKey]?.seed || null, playerFingerprint: arenaOpponentAnalysisStore?.opponents?.[matchedArenaTargetKey]?.playerFingerprint || null
      });
    }
    arenaAutomationState.pendingTargetKey = null;
    arenaAutomationState.pendingTargetName = "";
    if (arenaAutomationState.completedRuns >= arenaAutomationState.maxRuns) {
      releaseAutomationNavigation("arena");
      stopArenaAutomationTimer();
      arenaAutomationState.enabled = false;
      arenaAutomationState.phase = "complete";
      await saveArenaAutomationState();
      renderAutoCombatUI();
      if (statusEl) statusEl.textContent = `Arena capture complete · ${arenaAutomationState.completedRuns} fights.`;
      logAutoCombatDiagnostic("arena-complete", { reason: "max-runs", completedRuns: arenaAutomationState.completedRuns, remainingModules: autoCombatEnabledModules() });
      if (autoCombatEnabledModules().length) scheduleAutoCombatResume(0, "arena-max-runs-handoff");
      else { stopAutoCombatDispatcherTimer(); stopAutoCombatCooldownObserver(); }
      return;
    }
    arenaAutomationState.phase = "queued";
    arenaAutomationState.error = null;
    await saveArenaAutomationState();
    renderAutoCombatUI();
    await completeAutoCombatModule("arena");
  }

  function arenaReportIsPendingCapture() {
    return !!arenaAutomationState?.enabled && isCombatReportPage() && arenaReportDetection().isArena;
  }

  function expeditionReportIsPendingCapture() {
    return !!autoExpeditionState?.enabled && isCombatReportPage() && expeditionReportDetection().isExpedition;
  }

  async function resumeArenaAutomation({ allowBusy = false } = {}) {
    if ((arenaAutomationBusy && !allowBusy) || !arenaAutomationState?.enabled) return;
    logAutoCombatDiagnostic("arena-resume", { reason: allowBusy ? "scheduler" : "direct" });

    if (arenaAutomationState.completedRuns >= arenaAutomationState.maxRuns) {
      arenaAutomationState.enabled = false;
      arenaAutomationState.phase = "complete";
      setModuleReadiness("arena", null);
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-complete", { reason: "max-runs" });
      return;
    }

    if (isCombatReportPage() && arenaReportDetection().isArena) {
      logAutoCombatDiagnostic("arena-report-detected", { reportId: reportIdFromUrl() });
      arenaReportWaitStartedAt ||= Date.now();
      const reportId = reportIdFromUrl();
      const result = await captureArenaCombatReport().catch((error) => ({ captured: false, reason: "capture-error", error: error?.message || String(error) }));
      logAutoCombatDiagnostic("arena-report-capture-result", result);
      if ((result?.captured || result?.reason === "already-captured") && reportId) {
        await markArenaRunComplete(reportId);
        arenaReportWaitStartedAt = 0;
        return;
      }
      if (Date.now() - arenaReportWaitStartedAt > 15000) {
        arenaAutomationState.enabled = false;
        arenaAutomationState.phase = "error";
        arenaAutomationState.error = "Arena combat report capture timed out after 15 seconds.";
        arenaAutomationState.pendingTargetKey = null;
        arenaAutomationState.pendingTargetName = "";
        arenaReportWaitStartedAt = 0;
        await saveArenaAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("arena-error", { error: arenaAutomationState.error });
        return;
      }
      arenaAutomationState.phase = "waiting-report";
      arenaAutomationState.error = result?.reason === "report-not-ready"
        ? "Waiting briefly for the Arena report to finish loading."
        : "Capturing Arena combat report.";
      await saveArenaAutomationState();
      renderAutoCombatUI();
      scheduleAutoCombatResume(350);
      return;
    }

    // The scheduler already established Arena's global cooldown as READY.
    // Navigation is the first module-specific operation; no Arena cooldown
    // or availability check occurs before this point.
    if (!isProvinciarumArenaPage()) {
      arenaAutomationState.phase = "navigating";
      arenaAutomationState.error = "Opening Provinciarum Arena.";
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-navigation-needed", { destination: "Provinciarum Arena" });
      const opened = await navigateToProvinciarumArena();
      logAutoCombatDiagnostic("arena-navigation-dispatched", { opened });
      if (opened && arenaAutomationState.enabled) scheduleAutoCombatResume(50);
      return;
    }

    const arenaRefreshPage = isArenaOpponentRefreshPage() && arenaAutomationState.phase === "refreshing";
    if (arenaRefreshPage) {
      const refreshCooldownMs = arenaCooldownMs();
      logAutoCombatDiagnostic("arena-opponent-refresh-cooldown-check", {
        cooldownMs: refreshCooldownMs,
        url: location.href
      });
      if (!Number.isFinite(refreshCooldownMs)) {
        arenaAutomationState.error = "Waiting for the Arena cooldown to appear after requesting new opponents.";
        await saveArenaAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(350, "arena-opponent-refresh-wait-cooldown");
        return;
      }
      if (refreshCooldownMs > 0) {
        arenaAutomationState.phase = "waiting-cooldown";
        arenaAutomationState.error = `Waiting for Arena availability · ${formatExpeditionCooldown(refreshCooldownMs)}.`;
        setModuleReadiness("arena", refreshCooldownMs);
        await saveArenaAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("arena-opponent-refresh-cooldown-detected", { cooldownMs: refreshCooldownMs });
        scheduleAutoCombatResume(Math.max(25, refreshCooldownMs + 25), "arena-refresh-cooldown");
        return;
      }
      const refreshedOpponents = parseArenaOpponents();
      logAutoCombatDiagnostic("arena-opponent-refresh-page-ready", {
        opponentCount: refreshedOpponents.length,
        url: location.href
      });
      if (!refreshedOpponents.length) {
        arenaAutomationState.error = "Waiting for the refreshed Arena opponent list to finish loading.";
        await saveArenaAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(350, "arena-opponent-refresh-wait-list");
        return;
      }
      arenaAutomationState.phase = "checking";
      arenaAutomationState.error = null;
      setModuleReadiness("arena", 0);
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-opponent-refresh-page-accepted", { opponentCount: refreshedOpponents.length });
    }
    logAutoCombatDiagnostic("arena-page-ready", { refreshPage: arenaRefreshPage });
    const analysis = await analyzeCurrentArenaOpponents();
    logAutoCombatDiagnostic("arena-opponent-analysis", { ok: analysis?.ok, completed: analysis?.completed, total: analysis?.total, failures: analysis?.failures, playerHp: analysis?.playerHp });
    await recordOpponentAnalysisSnapshot("arena", parseArenaOpponents(), arenaOpponentAnalysisStore);
    if (!analysis?.ok) {
      if (analysis?.reason === "no-usable-opponents") {
        const refreshed = await requestNewArenaOpponents("No available Arena opponent could be captured and simulated; requesting a fresh opponent set.");
        if (refreshed) {
          logAutoCombatDiagnostic("arena-analysis-refresh-requested", { reason: analysis.reason, completed: analysis.completed || 0, total: analysis.total || 0 });
          return;
        }
      }
      // Opponent analysis is a recoverable preparation step. A transient
      // profile/parser/network failure must never terminate Auto Arena. Keep
      // the module enabled and retry from the live opponent page.
      arenaAutomationState.phase = "checking";
      arenaAutomationState.pendingTargetKey = null;
      arenaAutomationState.pendingTargetName = "";
      arenaAutomationState.error = analysis?.error || "Arena opponent analysis could not be completed; retrying.";
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-analysis-nonterminal-retry", {
        reason: analysis?.reason || null,
        completed: analysis?.completed || 0,
        total: analysis?.total || 0,
        failures: analysis?.failures || 0,
        error: arenaAutomationState.error
      });
      scheduleAutoCombatResume(1000, "arena-analysis-retry");
      return;
    }
    const arenaLowWinRateSafeguard = lowWinRateOpponentSetSafeguard(
      "arena",
      parseArenaOpponents(),
      arenaOpponentAnalysisStore,
      arenaOpponentIsAttempted
    );
    logAutoCombatDiagnostic("arena-win-rate-safeguard-check", arenaLowWinRateSafeguard);
    if (arenaLowWinRateSafeguard.triggered) {
      const threshold = arenaLowWinRateSafeguard.threshold;
      const refreshed = await requestNewArenaOpponents(
        `All ${arenaLowWinRateSafeguard.candidates.length} unattempted Arena opponents are below the ${threshold}% minimum win-rate threshold; requesting a fresh opponent set.`
      );
      if (refreshed) {
        logAutoCombatDiagnostic("arena-win-rate-safeguard-triggered", arenaLowWinRateSafeguard);
        return;
      }
      arenaAutomationState.phase = "checking";
      arenaAutomationState.pendingTargetKey = null;
      arenaAutomationState.pendingTargetName = "";
      arenaAutomationState.error = "Waiting for the Arena Search for opponents control after the minimum win-rate safeguard.";
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-win-rate-safeguard-refresh-retry", {
        ...arenaLowWinRateSafeguard,
        reason: "refresh-control-unavailable"
      });
      scheduleAutoCombatResume(750, "arena-win-rate-safeguard-refresh-retry");
      return;
    }
    const simHeal = arenaNeedsSimulatorHealing();
    if (simHeal.needed && !autoHealingState?.active) {
      arenaAutomationState.phase = "queued";
      arenaAutomationState.error = `Healing before Arena: current HP reduces simulator win chance by up to ${simHeal.maxImpact.toFixed(1)} percentage points.`;
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-simulator-heal-trigger", simHeal);
      await triggerAutoHealing("arena-simulator-hp-impact");
      return;
    }
    const target = chooseArenaTarget();
    logAutoCombatDiagnostic("arena-target-selection", {
      selected: target ? { key: target.key, name: target.name, level: target.level, province: target.province, playerId: target.playerId } : null,
      selectionPolicy: "highest win rate, then lowest expected damage taken, then shortest expected fight",
      visibleOpponents: parseArenaOpponents().map(opponent => ({ key: opponent.key, name: opponent.name, level: opponent.level, province: opponent.province, playerId: opponent.playerId }))
    });
    if (!target) {
      if (await requestNewArenaOpponents("No usable unattempted Arena opponent remains; requesting a fresh opponent set.")) {
        logAutoCombatDiagnostic("arena-opponent-refresh-clicked", {});
        return;
      }
      arenaAutomationState.phase = "checking";
      arenaAutomationState.error = "No usable unattempted Arena opponent is available; waiting to retry the live Arena page.";
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-target-retry-state", { reason: "no-target-and-refresh-unavailable" });
      scheduleAutoCombatResume(1000, "arena-target-retry");
      return;
    }

    const targetWinRate = Number(arenaOpponentAnalysisStore?.opponents?.[target.key]?.current?.winRate);
    const targetThreshold = minimumOpponentWinRateThresholdPercent();
    if (targetThreshold > 0 && (!Number.isFinite(targetWinRate) || targetWinRate < targetThreshold)) {
      logAutoCombatDiagnostic("arena-target-blocked-win-rate", { target: target.name, winRate: Number.isFinite(targetWinRate) ? targetWinRate : null, threshold: targetThreshold });
      arenaAutomationState.pendingTargetKey = null;
      arenaAutomationState.pendingTargetName = "";
      arenaAutomationState.phase = "queued";
      arenaAutomationState.error = `Selected Arena opponent did not meet the ${targetThreshold}% minimum win-rate threshold; refreshing before any attack.`;
      await saveArenaAutomationState();
      renderAutoCombatUI();
      await requestNewArenaOpponents(arenaAutomationState.error);
      return;
    }
    const preTargetClickCooldownMs = arenaCooldownMs();
    if (Number.isFinite(preTargetClickCooldownMs) && preTargetClickCooldownMs > 0) {
      arenaAutomationState.pendingTargetKey = null;
      arenaAutomationState.pendingTargetName = "";
      arenaAutomationState.phase = "waiting-cooldown";
      arenaAutomationState.error = `Waiting for Arena availability · ${formatExpeditionCooldown(preTargetClickCooldownMs)}.`;
      setModuleReadiness("arena", preTargetClickCooldownMs);
      await saveArenaAutomationState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("arena-target-blocked-cooldown", { cooldownMs: preTargetClickCooldownMs, target: target.name });
      scheduleAutoCombatResume(Math.max(25, preTargetClickCooldownMs + 25), "arena-target-cooldown");
      return;
    }

    arenaAutomationState.pendingTargetKey = target.key;
    arenaAutomationState.pendingTargetName = target.name;
    arenaAutomationState.phase = "confirming";
    arenaAutomationState.error = null;
    if (arenaAutomationState.confirmationRetryTargetKey !== target.key) {
      arenaAutomationState.confirmationRetryTargetKey = target.key;
      arenaAutomationState.confirmationRetryCount = 0;
    }
    const cooldownBeforeClickMs = arenaCooldownMs();
    await saveArenaAutomationState();
    renderAutoCombatUI();

    const retryArenaConfirmation = async (reason, extra = {}) => {
      const state = arenaAutomationState;
      if (!state?.enabled) return;
      const previousCount = state.confirmationRetryTargetKey === target.key ? (Number(state.confirmationRetryCount) || 0) : 0;
      const nextCount = previousCount + 1;
      state.confirmationRetryTargetKey = target.key;
      state.confirmationRetryCount = nextCount;
      delete state.attemptedOpponents[target.key];
      state.pendingTargetKey = null;
      state.pendingTargetName = "";
      if (nextCount <= ARENA_CONFIRMATION_RETRY_LIMIT) {
        state.phase = "queued";
        state.error = `Arena confirmation was not completed; retrying the opponent (${nextCount}/${ARENA_CONFIRMATION_RETRY_LIMIT}).`;
        await saveArenaAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("arena-confirmation-retry", { target: target.name, retryCount: nextCount, retryLimit: ARENA_CONFIRMATION_RETRY_LIMIT, reason, ...extra });
        scheduleAutoCombatResume(ARENA_CONFIRMATION_RETRY_DELAY_MS, "arena-confirmation-retry");
        return;
      }
      state.confirmationRetryCount = 0;
      state.confirmationRetryTargetKey = null;
      const refreshed = await requestNewArenaOpponents(`Arena confirmation failed ${ARENA_CONFIRMATION_RETRY_LIMIT} times; requesting a fresh opponent set.`);
      if (!refreshed) {
        state.phase = "checking";
        state.error = "Arena confirmation could not be completed; waiting to retry the live Arena page.";
        await saveArenaAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("arena-confirmation-refresh-fallback", { target: target.name, reason, ...extra });
        scheduleAutoCombatResume(1000, "arena-confirmation-refresh-fallback");
      }
    };

    logAutoCombatDiagnostic("arena-click-opponent-start", { target: { key: target.key, name: target.name, level: target.level } });
    const opponentClicked = await humanizedClick(target.button, "arena-opponent", {
      beforeClick: async () => {
        const cooldown = arenaCooldownMs();
        if (Number.isFinite(cooldown) && cooldown > 0) {
          logAutoCombatDiagnostic("arena-click-guard-cooldown", { target: target.name, cooldownMs: cooldown });
          return false;
        }
        return ensureAutoCombatHpSafety("arena", "opponent-click");
      }
    });
    logAutoCombatDiagnostic("arena-click-opponent-result", { clicked: opponentClicked });
    if (!opponentClicked || !arenaAutomationState?.enabled) {
      if (autoHealingState?.active) {
        arenaAutomationState.phase = "queued";
        arenaAutomationState.error = "HP is below the configured threshold; healing before the Arena battle.";
        arenaAutomationState.pendingTargetKey = null;
        arenaAutomationState.pendingTargetName = "";
        await saveArenaAutomationState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(0, "arena-waiting-healing");
        return;
      }
      const failedClickCooldownMs = arenaCooldownMs();
      if (Number.isFinite(failedClickCooldownMs) && failedClickCooldownMs > 0) {
        arenaAutomationState.phase = "waiting-report";
        arenaAutomationState.error = "Arena cooldown started during the click delay; treating the attack as started and refusing a retry click.";
        arenaAutomationState.attemptedOpponents[target.key] = { name: target.name, level: target.level, province: target.province, playerId: target.playerId, profileHost: target.profileHost, attemptedAt: new Date().toISOString() };
        await saveArenaAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("arena-click-blocked-after-cooldown-start", { target: target.name, cooldownMs: failedClickCooldownMs });
        arenaReportWaitStartedAt = Date.now();
        scheduleAutoCombatResume(350, "arena-click-blocked-after-cooldown-start");
        return;
      }
      await retryArenaConfirmation("opponent-click-failed");
      return;
    }

    const confirmState = await waitForArenaConfirmation({ cooldownBeforeClickMs });
    logAutoCombatDiagnostic("arena-confirmation-detected", {
      found: confirmState.kind === "confirmation", kind: confirmState.kind, reportId: confirmState.reportId || null, cooldownMs: confirmState.cooldownMs || null, elapsedMs: confirmState.elapsedMs
    });
    if (!arenaAutomationState?.enabled) return;

    if (confirmState.kind === "report" && confirmState.reportId) {
      arenaAutomationState.attemptedOpponents[target.key] = {
        name: target.name, level: target.level, province: target.province, playerId: target.playerId,
        profileHost: target.profileHost, attemptedAt: new Date().toISOString()
      };
      arenaAutomationState.confirmationRetryCount = 0;
      arenaAutomationState.confirmationRetryTargetKey = null;
      arenaAutomationState.pendingTargetKey = null;
      arenaAutomationState.pendingTargetName = "";
      arenaAutomationState.phase = "waiting-report";
      arenaAutomationState.error = null;
      await saveArenaAutomationState();
      renderAutoCombatUI();
      arenaReportWaitStartedAt = Date.now();
      logAutoCombatDiagnostic("arena-report-transition-after-opponent", { target: target.name, reportId: String(confirmState.reportId) });
      scheduleAutoCombatResume(150, "arena-report-transition-detected");
      return;
    }

    if (confirmState.kind === "cooldown") {
      arenaAutomationState.attemptedOpponents[target.key] = {
        name: target.name, level: target.level, province: target.province, playerId: target.playerId,
        profileHost: target.profileHost, attemptedAt: new Date().toISOString()
      };
      arenaAutomationState.confirmationRetryCount = 0;
      arenaAutomationState.confirmationRetryTargetKey = null;
      arenaAutomationState.phase = "waiting-report";
      arenaAutomationState.error = "Arena attack started; the confirmation dialog was not visible before the fight cooldown began.";
      setModuleReadiness("arena", null);
      await saveArenaAutomationState();
      renderAutoCombatUI();
      arenaReportWaitStartedAt = Date.now();
      logAutoCombatDiagnostic("arena-attack-started-without-visible-confirmation", { target: target.name, cooldownMs: confirmState.cooldownMs });
      scheduleAutoCombatResume(350, "arena-attack-started-without-confirmation");
      return;
    }

    if (confirmState.kind !== "confirmation") {
      await retryArenaConfirmation("confirmation-timeout", { timeoutMs: 9000, elapsedMs: confirmState.elapsedMs });
      return;
    }

    arenaAutomationState.phase = "humanizing";
    arenaAutomationState.error = null;
    setModuleReadiness("arena", null);
    await saveArenaAutomationState();
    renderAutoCombatUI();
    const confirmed = await humanizedClick(confirmState.button, "arena-confirm");
    logAutoCombatDiagnostic("arena-click-confirm-result", { clicked: confirmed });
    if (!confirmed || !arenaAutomationState?.enabled) {
      await retryArenaConfirmation("confirmation-click-failed");
      return;
    }
    arenaAutomationState.attemptedOpponents[target.key] = {
      name: target.name, level: target.level, province: target.province, playerId: target.playerId,
      profileHost: target.profileHost, attemptedAt: new Date().toISOString()
    };
    arenaAutomationState.confirmationRetryCount = 0;
    arenaAutomationState.confirmationRetryTargetKey = null;
    arenaAutomationState.phase = "waiting-report";
    arenaAutomationState.error = null;
    await saveArenaAutomationState();
    renderAutoCombatUI();
    arenaReportWaitStartedAt = Date.now();
    logAutoCombatDiagnostic("arena-action-fired", { target: target.name });
  }

  function autoCombatModuleState(module) {
    if (module === "arena") return arenaAutomationState;
    if (module === "provinciarum") return circusProvinciarumAutomationState;
    if (module === "dungeon") return autoDungeonState;
    if (module === "expedition") return autoExpeditionState;
    return null;
  }

  function autoCombatEnabledModules() {
    const modules = [];
    if (arenaAutomationState?.enabled) modules.push("arena");
    if (circusProvinciarumAutomationState?.enabled) modules.push("provinciarum");
    // A Dungeon that has reached its terminal Boss outcome is no longer an
    // active scheduler module for this run. startAutoDungeon() explicitly
    // clears runComplete when the user starts another Dungeon run.
    if (autoDungeonState?.enabled && !autoDungeonState?.runComplete) modules.push("dungeon");
    if (autoExpeditionState?.enabled) modules.push("expedition");
    return modules;
  }

  function canonicalAutoCombatRoutineModule(module) {
    const value = String(module || "").toLowerCase().trim();
    if (value === "circus" || value === "circus-provinciarum" || value === "provinciarum") return "provinciarum";
    if (["arena", "dungeon", "expedition"].includes(value)) return value;
    return null;
  }

  function autoCombatDispatchOrder(enabledModules) {
    const enabled = Array.isArray(enabledModules) ? enabledModules : [];
    const configured = Array.isArray(settings?.routine) ? settings.routine : [];
    const order = [];
    const seen = new Set();

    for (const raw of configured) {
      const module = canonicalAutoCombatRoutineModule(raw);
      if (!module || !enabled.includes(module) || seen.has(module)) continue;
      seen.add(module);
      order.push(module);
    }

    // Keep enabled modules that are not present in the configured routine
    // runnable, but append them deterministically after the configured order.
    // This preserves backward compatibility with the development-only Arena
    // module, which is not included in the default Expedition/Dungeon/Circus
    // routine.
    for (const module of ["expedition", "dungeon", "provinciarum", "arena"]) {
      if (enabled.includes(module) && !seen.has(module)) {
        seen.add(module);
        order.push(module);
      }
    }
    return order;
  }

  function autoCombatModuleLabel(module) {
    if (module === "arena") return "Arena";
    if (module === "provinciarum") return "Circus Provinciarum";
    if (module === "dungeon") return "Dungeon";
    if (module === "expedition") return "Expedition";
    return String(module || "Combat");
  }

  function autoCombatModuleCooldown(module) {
    if (module === "arena") return arenaCooldownMs();
    if (module === "provinciarum") return circusProvinciarumCooldownMs();
    if (module === "dungeon") return readGlobalDungeonCooldownMs();
    if (module === "expedition") return readGlobalExpeditionCooldownMs();
    return null;
  }

  async function saveAutoCombatModuleState(module) {
    if (module === "arena") return saveArenaAutomationState();
    if (module === "provinciarum") return saveCircusProvinciarumAutomationState();
    if (module === "dungeon") return saveAutoDungeonState();
    if (module === "expedition") return saveAutoExpeditionState();
  }

  async function resumeAutoCombatModule(module, options = {}) {
    if (module === "arena") return resumeArenaAutomation(options);
    if (module === "provinciarum") return resumeCircusProvinciarumAutomation(options);
    if (module === "dungeon") return resumeAutoDungeon(options);
    if (module === "expedition") return resumeAutoExpedition(options);
    return undefined;
  }

  function stopAutoCombatDispatcherTimer() {
    if (autoCombatSchedulerTimer) {
      clearTimeout(autoCombatSchedulerTimer);
      autoCombatSchedulerTimer = null;
    }
  }

  function stopAutoCombatModuleTimer(module) {
    if (module === "arena") stopArenaAutomationTimer();
    else if (module === "provinciarum") stopCircusProvinciarumAutomationTimer();
    else if (module === "dungeon") stopAutoDungeonTimer();
    else if (module === "expedition") stopAutoExpeditionTimer();
  }

  function ensureAutoCombatCooldownObserver() {
    if (autoCombatCooldownObserver || typeof MutationObserver === "undefined") return;
    const expeditionFill = document.querySelector("#cooldown_bar_fill_expedition");
    const dungeonFill = document.querySelector("#cooldown_bar_fill_dungeon");
    const arenaFill = document.querySelector("#cooldown_bar_fill_arena");
    const circusFill = document.querySelector("#cooldown_bar_fill_ct");
    if (!expeditionFill && !dungeonFill && !arenaFill && !circusFill) return;

    autoCombatCooldownObserver = new MutationObserver((records) => {
      if (!autoCombatEnabledModules().length) return;
      logAutoCombatDiagnostic("cooldown-observer-fired", { mutations: records.length });
      scheduleAutoCombatResume(0, "cooldown-header-mutation");
      if (isCircusProvinciarumPage()) {
        const cooldownMs = circusProvinciarumCooldownMs();
        if (Number.isFinite(cooldownMs) && cooldownMs <= 0) scheduleNativeOpponentWinRateAutoAnalysis({ force: true });
      }
    });
    [arenaFill, circusFill, dungeonFill, expeditionFill].filter(Boolean).forEach(node => {
      // Gladiatus updates the fill width frequently while cooling, but the
      // ready/progress class changes only at the state transition. Observe the
      // class instead of the ticking text so this remains event-driven.
      autoCombatCooldownObserver.observe(node, { attributes: true, attributeFilter: ["class"] });
    });
  }

  function stopAutoCombatCooldownObserver() {
    if (!autoCombatCooldownObserver) return;
    autoCombatCooldownObserver.disconnect();
    autoCombatCooldownObserver = null;
  }

  function scheduleAutoCombatResume(delayMs = 250, reason = "unspecified") {
    stopAutoCombatDispatcherTimer();
    const delay = Math.max(0, Number(delayMs) || 0);
    logAutoCombatDiagnostic("scheduler-timer-set", { delayMs: delay, reason });
    autoCombatSchedulerTimer = setTimeout(async () => {
      autoCombatSchedulerTimer = null;
      logAutoCombatDiagnostic("scheduler-timer-fire", { reason });
      await runAutoCombatScheduler();
    }, delay);
  }

  function circusRefreshAcceptedForScheduler() {
    if (!circusProvinciarumAutomationState?.enabled) return false;
    if (circusProvinciarumAutomationState.phase !== "refreshing") return false;
    if (!isCircusProvinciarumPage()) return false;
    const cooldownMs = circusProvinciarumCooldownMs();
    return Number.isFinite(cooldownMs) && cooldownMs > 0;
  }

  function autoCombatInFlightModule() {
    const continuations = new Set(["navigating", "waiting-report"]);
    const modules = autoCombatEnabledModules();
    for (const module of modules) {
      const state = autoCombatModuleState(module);
      if (continuations.has(state?.phase)) return module;
      if (state?.phase === "refreshing") {
        if (module === "provinciarum" && state?.refreshHandoffPending && isCircusProvinciarumOpponentRefreshPage()) continue;
        if (module === "provinciarum" && circusRefreshAcceptedForScheduler()) continue;
        const refreshPage = module === "arena"
          ? isArenaOpponentRefreshPage()
          : module === "provinciarum"
            ? isCircusProvinciarumOpponentRefreshPage()
            : false;
        if (refreshPage) return module;
      }
    }
    return null;
  }

  function roundRobinPick(modules) {
    if (!modules.length) return null;
    const last = autoCombatDispatcherState.lastModule;
    if (!last) return modules[0];
    const index = modules.indexOf(last);
    if (index < 0) return modules[0];
    return modules[(index + 1) % modules.length];
  }

  function routinePickReadyModule(enabledModules, readyModules) {
    const order = autoCombatDispatchOrder(enabledModules);
    if (!readyModules.length) return { selected: null, order, selectedIndex: -1 };
    const last = autoCombatDispatcherState.lastModule;
    const startIndex = last && order.includes(last) ? order.indexOf(last) + 1 : 0;

    for (let offset = 0; offset < order.length; offset++) {
      const index = (startIndex + offset) % order.length;
      const module = order[index];
      if (readyModules.includes(module)) {
        return { selected: module, order, selectedIndex: index };
      }
    }
    return { selected: null, order, selectedIndex: -1 };
  }

  async function completeAutoCombatModule(module) {
    const state = autoCombatModuleState(module);
    if (!state) return;
    if (module === "dungeon" && state.runComplete) return;
    releaseAutomationNavigation(module);
    stopAutoCombatModuleTimer(module);
    const cooldownMs = autoCombatModuleCooldown(module);
    const label = autoCombatModuleLabel(module);
    logAutoCombatDiagnostic("module-complete", { module, cooldownMs });
    setModuleReadiness(module, Number.isFinite(cooldownMs) && cooldownMs >= 0 ? cooldownMs : null);
    if (Number.isFinite(cooldownMs) && cooldownMs > 0) {
      state.phase = "waiting-cooldown";
      state.error = `Waiting for ${label} availability · ${formatExpeditionCooldown(cooldownMs)}.`;
    } else if (cooldownMs === 0) {
      state.phase = "queued";
      state.error = null;
    } else {
      state.phase = "checking";
      state.error = `${label} cooldown is temporarily unavailable.`;
    }
    await saveAutoCombatModuleState(module);
    renderAutoCombatUI();
    const enabledAfterCompletion = autoCombatEnabledModules();
    const wakeCandidates = enabledAfterCompletion.map(autoCombatModuleCooldown).filter(ms => Number.isFinite(ms) && ms >= 0);
    const nextWakeMs = wakeCandidates.length ? Math.min(...wakeCandidates) : 0;
    logAutoCombatDiagnostic("scheduler-post-combat-wake", { module, wakeCandidates, nextWakeMs });
    scheduleAutoCombatResume(nextWakeMs > 0 ? Math.max(25, nextWakeMs + 25) : 0, "post-combat-earliest-global-cooldown");
  }

  async function runAutoCombatScheduler() {
    if (autoCombatSchedulerBusy) {
      logAutoCombatDiagnostic("scheduler-skipped-busy", {});
      return;
    }
    const enabled = autoCombatEnabledModules();
    if (!enabled.length) {
      stopAutoCombatDispatcherTimer();
      stopAutoCombatCooldownObserver();
      return;
    }
    ensureAutoCombatCooldownObserver();
    autoCombatSchedulerBusy = true;
    logAutoCombatDiagnostic("scheduler-start", { enabled });
    try {
      if (circusRefreshAcceptedForScheduler()) {
        const cooldownMs = circusProvinciarumCooldownMs();
        circusProvinciarumAutomationState.phase = "waiting-cooldown";
        circusProvinciarumAutomationState.error = `Waiting for Circus Provinciarum availability · ${formatExpeditionCooldown(cooldownMs)}.`;
        setModuleReadiness("provinciarum", cooldownMs);
        releaseAutomationNavigation("provinciarum");
        await saveCircusProvinciarumAutomationState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("provinciarum-refresh-accepted-scheduler-handoff", {
          cooldownMs,
          page: location.href,
          nextAction: "shared-dispatcher"
        });
      }

      if (circusProvinciarumAutomationState?.enabled
        && circusProvinciarumAutomationState.refreshHandoffPending
        && isCircusProvinciarumOpponentRefreshPage()) {
        const refreshCooldownMs = circusProvinciarumCooldownMs();
        if (Number.isFinite(refreshCooldownMs) && refreshCooldownMs > 0) {
          circusProvinciarumAutomationState.phase = "waiting-cooldown";
          circusProvinciarumAutomationState.error = `Waiting for Circus Provinciarum availability · ${formatExpeditionCooldown(refreshCooldownMs)}.`;
          circusProvinciarumAutomationState.refreshHandoffPending = false;
          circusProvinciarumAutomationState.refreshHandoffStartedAt = null;
          setModuleReadiness("provinciarum", refreshCooldownMs);
          releaseAutomationNavigation("provinciarum");
          await saveCircusProvinciarumAutomationState();
          renderAutoCombatUI();
          logAutoCombatDiagnostic("provinciarum-refresh-handoff-finalized", {
            cooldownMs: refreshCooldownMs,
            page: location.href,
            nextAction: "shared-dispatcher"
          });
        }
      }

      const active = autoCombatInFlightModule();
      if (active) {
        const activeState = autoCombatModuleState(active);
        const phase = activeState?.phase || null;
        logAutoCombatDiagnostic("scheduler-resume-continuation", { module: active, phase });
        await resumeAutoCombatModule(active, { allowBusy: true });
        return;
      }
      const recoveredProvinciarum = await recoverStaleCircusProvinciarumActionState();
      if (recoveredProvinciarum) {
        const recoveredState = autoCombatModuleState("provinciarum");
        logAutoCombatDiagnostic("scheduler-resume-after-provinciarum-recovery", {
          phase: recoveredState?.phase || null,
          pendingTargetName: recoveredState?.pendingTargetName || null
        });
        await resumeAutoCombatModule("provinciarum", { allowBusy: true });
        return;
      }

      const busyModule = enabled.find(module => {
        const state = autoCombatModuleState(module);
        if (module === "provinciarum" && state?.refreshHandoffPending && isCircusProvinciarumOpponentRefreshPage()) return false;
        if (module === "provinciarum" && circusRefreshAcceptedForScheduler()) return false;
        return ["refreshing", "confirming", "humanizing", "attacking"].includes(state?.phase);
      });
      if (busyModule) {
        const state = autoCombatModuleState(busyModule);
        logAutoCombatDiagnostic("scheduler-suppressed-active-action", { module: busyModule, phase: state?.phase || null });
        return;
      }

      if (autoHealingState?.active) {
        logAutoCombatDiagnostic("scheduler-resume-healing", { phase: autoHealingState.phase || null });
        await resumeAutoHealing({ allowBusy: true });
        return;
      }

      const hp = readLiveHpSnapshot();
      const threshold = currentHpThresholdPercent();
      if (hp) {
        logAutoCombatDiagnostic("hp-check", { context: "scheduler-before-module-selection", hp, thresholdPercent: threshold });
        if (threshold > 0 && (hp.current / hp.max) * 100 < threshold) {
          logAutoCombatDiagnostic("hp-threshold-trigger", { context: "scheduler-before-module-selection", hp, thresholdPercent: threshold });
          await triggerAutoHealing("scheduler-hp-threshold");
          return;
        }
      } else {
        await stopAutoCombatForHealingFailure("Current/max HP could not be read before selecting the next automated battle.");
        return;
      }

      const cooldowns = {
        arena: enabled.includes("arena") ? arenaCooldownMs() : null,
        provinciarum: enabled.includes("provinciarum") ? circusProvinciarumCooldownMs() : null,
        dungeon: enabled.includes("dungeon") ? readGlobalDungeonCooldownMs() : null,
        expedition: enabled.includes("expedition") ? readGlobalExpeditionCooldownMs() : null
      };
      logAutoCombatDiagnostic("scheduler-global-cooldowns", { cooldowns, raw: {
        arena: normalize(document.querySelector("#cooldown_bar_text_arena")?.textContent || ""),
        provinciarum: normalize(document.querySelector("#cooldown_bar_text_ct")?.textContent || ""),
        dungeon: normalize(document.querySelector("#cooldown_bar_text_dungeon")?.textContent || ""),
        expedition: normalize(document.querySelector("#cooldown_bar_text_expedition")?.textContent || "")
      }});

      // A Dungeon run reset is a control action, not a new Dungeon attack. Once the
      // consecutive same-opponent loss limit is reached, allow the reset to be
      // dispatched immediately even while the previous battle cooldown remains.
      const readyModules = enabled.filter(module =>
        !(module === "provinciarum" && circusProvinciarumAutomationState?.refreshHandoffPending)
        && ((module === "dungeon" && autoDungeonState?.pendingRunReset) || cooldowns[module] === 0)
      );
      if (readyModules.length) {
        const dispatch = routinePickReadyModule(enabled, readyModules);
        const selected = dispatch.selected;
        const order = dispatch.order;
        logAutoCombatDiagnostic("scheduler-routine-order", {
          configuredRoutine: Array.isArray(settings?.routine) ? [...settings.routine] : [],
          effectiveOrder: order,
          enabledModules: enabled,
          readyModules,
          lastModule: autoCombatDispatcherState.lastModule || null
        });

        if (!selected) {
          logAutoCombatDiagnostic("scheduler-routine-selection-failed", { readyModules, effectiveOrder: order });
          scheduleAutoCombatResume(AUTO_COMBAT_GLOBAL_COOLDOWN_RETRY_MS, "routine-selection-unavailable");
          return;
        }

        for (const module of readyModules) {
          if (module === selected) continue;
          const orderIndex = order.indexOf(module);
          logAutoCombatDiagnostic("scheduler-module-skipped", {
            module,
            selected,
            reason: "routine-order",
            orderIndex,
            selectedOrderIndex: dispatch.selectedIndex
          });
        }

        const state = autoCombatModuleState(selected);
        const lastModuleBeforeSelection = autoCombatDispatcherState.lastModule || null;
        autoCombatDispatcherState.lastModule = selected;
        setModuleReadiness(selected, 0);
        if (state) {
          state.phase = "selected";
          state.error = null;
        }
        await saveAutoCombatModuleState(selected);
        renderAutoCombatUI();
        logAutoCombatDiagnostic("scheduler-module-selected", {
          selected,
          readyModules,
          effectiveOrder: order,
          selectedOrderIndex: dispatch.selectedIndex,
          lastModuleBeforeSelection,
          action: "navigate-then-module-checks"
        });
        await resumeAutoCombatModule(selected, { allowBusy: true });
        return;
      }

      const coolingModules = enabled.filter(module => Number.isFinite(cooldowns[module]) && cooldowns[module] > 0);
      if (coolingModules.length) {
        let earliest = Infinity;
        for (const module of coolingModules) {
          const state = autoCombatModuleState(module);
          const ms = cooldowns[module];
          setModuleReadiness(module, ms);
          if (state) {
            state.phase = "waiting-cooldown";
            state.error = `Waiting for ${autoCombatModuleLabel(module)} availability · ${formatExpeditionCooldown(ms)}.`;
          }
          earliest = Math.min(earliest, ms);
          await saveAutoCombatModuleState(module);
        }
        renderAutoCombatUI();
        logAutoCombatDiagnostic("scheduler-wait-cooldown", { coolingModules, earliestMs: earliest });
        scheduleAutoCombatResume(Math.max(25, earliest + 25), "earliest-global-cooldown");
        return;
      }

      const unknown = enabled.filter(module => cooldowns[module] == null);
      for (const module of unknown) {
        const state = autoCombatModuleState(module);
        if (state) {
          state.phase = "checking";
          state.error = `Waiting for ${autoCombatModuleLabel(module)} global cooldown state.`;
        }
        await saveAutoCombatModuleState(module);
      }
      renderAutoCombatUI();
      logAutoCombatDiagnostic("scheduler-cooldown-unknown", { unknown });
      scheduleAutoCombatResume(AUTO_COMBAT_GLOBAL_COOLDOWN_RETRY_MS, "global-cooldown-unavailable");
    } catch (error) {
      logAutoCombatDiagnostic("scheduler-error", { error: error?.message || String(error), stack: error?.stack || null });
    } finally {
      autoCombatSchedulerBusy = false;
    }
  }

  function renderAutoCombatUI() {
    const root = shadow?.querySelector("#ga-auto-combat");
    if (!root) return;
    const arena = arenaAutomationState || { enabled: false, maxRuns: 100, completedRuns: 0, phase: "stopped", error: null };
    const provin = circusProvinciarumAutomationState || { enabled: false, maxRuns: 100, completedRuns: 0, phase: "stopped", error: null, attemptedOpponents: {}, unavailableOpponents: {} };
    const expedition = autoExpeditionState || { enabled: false, maxRuns: 100, completedRuns: 0, phase: "stopped", error: null, targetName: "", locationName: "" };
    const dungeon = autoDungeonState || { enabled: false, completedBattles: 0, phase: "stopped", error: null, locationName: DUNGEON_LOCATION_NAME, pendingEncounterKind: null, cancelBeforeBoss: false };
    const detectedCountry = currentCountryFromPageOrSaved();
    const countryKey = detectedCountry?.countryKey || expedition.countryKey || null;
    const catalog = countryKey ? expeditionTargetCatalog(countryKey) : [];
    const currentValue = expedition.locationId != null && expedition.targetId != null ? `${expedition.locationId}|${expedition.targetId}` : "";
    const selectedExists = catalog.some(row => row.value === currentValue);
    const targetOptions = catalog.length
      ? catalog.map(row => `<option value="${esc(row.value)}"${selectedExists && row.value === currentValue ? " selected" : ""}>${esc(row.locationName)} — ${esc(row.targetName)}${row.boss ? " (Boss)" : ""}</option>`).join("")
      : `<option value="">${countryKey ? "No expedition targets known" : "Country not detected"}</option>`;
    const running = !!arena.enabled || !!provin.enabled || !!dungeon.enabled || !!expedition.enabled;
    const statusBlock = (name, enabled, status) => `<div class="ga-auto-module"><div class="ga-auto-module-head"><label class="ga-check"><input type="checkbox" data-auto-module="${name}"${enabled ? " checked" : ""}${running ? " disabled" : ""}><strong>Auto ${esc(autoCombatModuleLabel(name))}</strong></label><span class="ga-statusline">${esc(status)}</span></div></div>`;
    root.innerHTML = `
      <div class="ga-card-head">
        <div><h2>Auto Combat</h2><div class="ga-muted">Arena, Circus Provinciarum, Dungeon and Expedition read their cooldowns from the global game header on every page. One dispatcher runs whichever module is ready; navigation is only used to perform the selected combat action.</div></div>
      </div>
      ${statusBlock("arena", arena.enabled, arenaAutomationStatusText())}
      ${statusBlock("provinciarum", provin.enabled, circusProvinciarumAutomationStatusText())}
      ${statusBlock("dungeon", dungeon.enabled, autoDungeonStatusText())}
      ${statusBlock("expedition", expedition.enabled, autoExpeditionStatusText())}
      <div class="ga-auto-combat-options" style="margin-top:8px">
        <label><span>Arena fights</span><input id="ga-auto-arena-runs" type="number" min="1" max="${ARENA_MAX_RUNS}" value="${esc(String(arena.maxRuns || 100))}" ${running ? "disabled" : ""}></label>
        <label><span>Provinciarum fights</span><input id="ga-auto-provinciarum-runs" type="number" min="1" max="${CIRCUS_PROVINCIARUM_MAX_RUNS}" value="${esc(String(provin.maxRuns || 100))}" ${running ? "disabled" : ""}></label>
        <label><span>Dungeon</span><select id="ga-auto-dungeon-location" ${running ? "disabled" : ""}>${(() => {
          const options = currentDungeonLocationOptions();
          const selectedId = String(dungeon.locationId || DUNGEON_LOCATION_ID);
          const selectedExists = options.some(row => String(row.locationId) === selectedId);
          const fallback = selectedExists ? "" : `<option value="${esc(selectedId)}" selected>${esc(dungeon.locationName || `Location ${selectedId}`)}</option>`;
          return fallback + options.map(row => `<option value="${esc(row.locationId)}"${String(row.locationId) === selectedId ? " selected" : ""}>${esc(row.locationName)}</option>`).join("");
        })()}</select></label>
        <label class="ga-check"><input id="ga-auto-dungeon-cancel-before-boss" type="checkbox"${dungeon.cancelBeforeBoss ? " checked" : ""}${running ? " disabled" : ""}><span>Cancel/reset Dungeon when Boss is the only target</span></label>
        <label><span>Expedition target</span><select id="ga-auto-expedition-target" ${running ? "disabled" : ""}>${targetOptions}</select></label>
        <label><span>Expedition runs</span><input id="ga-auto-expedition-runs" type="number" min="1" max="${AUTO_EXPEDITION_MAX_RUNS}" value="${esc(String(expedition.maxRuns || 100))}" ${running ? "disabled" : ""}></label>
      </div>
      <div class="ga-muted" style="margin-top:6px">Dispatcher: Arena ${esc(moduleReadinessLabel("arena"))} · Circus Provinciarum ${esc(moduleReadinessLabel("provinciarum"))} · Dungeon ${esc(moduleReadinessLabel("dungeon"))} · Expedition ${esc(moduleReadinessLabel("expedition"))}</div>
      <div class="ga-muted" style="margin-top:4px">Auto Dungeon enters the selected dungeon on Normal difficulty when no active instance exists, follows the live map, attacks the visible Boss whenever it is available, and otherwise attacks a normal encounter. When enabled, Boss cancellation/reset occurs only when the Boss is the only remaining attack target.</div>
      <div class="ga-statusline" style="margin-top:6px">HP safety: ${esc(autoHealingStatusText())}</div>
      ${isProvinciarumArenaPage() ? (() => {
        const rows = parseArenaOpponents();
        const analysisRows = rows.map(op => arenaOpponentAnalysisStore?.opponents?.[op.key] || null);
        const hp = readLiveHpSnapshot();
        const simHeal = arenaNeedsSimulatorHealing();
        const analysisButtonDisabled = running || arenaAnalysisBusy || rows.length === 0;
        return `<div class="ga-auto-arena-analysis" style="margin-top:9px">
          <div class="ga-card-head"><div><h3 class="ga-subsection-title">Arena Opponent Analysis</h3><div class="ga-muted">${arenaAnalysisBusy ? "Analyzing all five opponents…" : `15-round Arena simulation · ${analysisRows.filter(Boolean).length}/${rows.length} opponents analyzed${hp ? ` · Your HP ${hp.current}/${hp.max}` : ""}`}</div></div><button class="ga-secondary" id="ga-auto-arena-analyze" type="button" ${analysisButtonDisabled ? "disabled" : ""}>${arenaAnalysisBusy ? "Analyzing…" : "Analyze Now"}</button></div>
          ${simHeal.needed ? `<div class="ga-statusline" style="color:#fbbf24">Simulator recommends healing: up to ${simHeal.maxImpact.toFixed(1)} percentage-point win-rate loss from current HP.</div>` : ""}
          <div class="ga-arena-analysis-list">${analysisRows.map((row, i) => row?.ok ? `<div class="ga-arena-analysis-row"><span><strong>${esc(rows[i]?.name || row.name)}</strong> · Lv ${esc(rows[i]?.level ?? "—")} <span class="ga-pill">${esc(combatAnalysisConfidenceBand(row.current?.winRate))}</span><small class="ga-muted">Expected damage taken ${esc(formatCombatMetric(row.current?.avgEnemyDamage, 1))}</small></span><strong>${esc((Number(row.current?.winRate || 0)).toFixed(1))}%</strong><span class="ga-muted">HP ${esc(row.currentHp?.enemy ?? "—")}/${esc(row.currentHp?.enemyMax ?? "—")}</span></div>` : `<div class="ga-arena-analysis-row"><span>${esc(rows[i]?.name || "Opponent")}</span><span class="ga-muted">${esc(row?.error || (arenaAnalysisBusy ? "Analyzing…" : "Not analyzed yet."))}</span></div>`).join("")}</div>
          <div class="ga-muted" style="margin-top:6px">Manual analysis only fetches profiles and runs simulations; it does not start Auto Combat or click an Arena opponent.</div>
        </div>`;
      })() : ""}
      ${isCircusProvinciarumPage() ? (() => {
        const rows = parseCircusProvinciarumOpponents();
        const analysisRows = rows.map(op => circusProvinciarumAnalysisStore?.opponents?.[op.key] || null);
        const analysisButtonDisabled = running || circusProvinciarumAnalysisBusy || rows.length !== 5;
        const analyzed = analysisRows.filter(row => row?.ok).length;
        return `<div class="ga-auto-arena-analysis" style="margin-top:9px">
          <div class="ga-card-head"><div><h3 class="ga-subsection-title">Circus Provinciarum 5v5 Opponent Analysis</h3><div class="ga-muted">${circusProvinciarumAnalysisBusy ? "Capturing five fighters and simulating…" : `50-round 5v5 simulation · ${analyzed}/${rows.length} opponents analyzed`}</div></div><button class="ga-secondary" id="ga-auto-provinciarum-analyze" type="button" ${analysisButtonDisabled ? "disabled" : ""}>${circusProvinciarumAnalysisBusy ? "Analyzing…" : "Analyze Now"}</button></div>
          <div class="ga-arena-analysis-list">${analysisRows.map((row, i) => row?.ok ? `<div class="ga-arena-analysis-row"><span><strong>${esc(rows[i]?.name || row.name)}</strong> · Lv ${esc(row.level ?? rows[i]?.level ?? "—")} · Province ${esc(row.province ?? rows[i]?.province ?? "—")} <span class="ga-pill">${esc(combatAnalysisConfidenceBand(row.current?.winRate))}</span><small class="ga-muted">Expected team damage taken ${esc(formatCombatMetric(row.current?.avgEnemyDamage, 1))}</small></span><strong>${esc((Number(row.current?.winRate || 0)).toFixed(1))}%</strong><span class="ga-muted">5 fighters · doll 1 excluded</span></div>` : `<div class="ga-arena-analysis-row"><span>${esc(rows[i]?.name || "Opponent")}</span><span class="ga-muted">${esc(row?.error || (circusProvinciarumAnalysisBusy ? "Analyzing…" : "Not analyzed yet."))}</span></div>`).join("")}</div>
          <div class="ga-muted" style="margin-top:6px">Each opponent is simulated against your saved Circus team as a full 5v5 battle. The opponent's Arena/Standard Battle character (doll 1) is never captured or simulated.</div>
        </div>`;
      })() : ""}
      <div class="ga-actions-row" style="margin-top:8px">
        <button class="ga-primary" id="ga-auto-combat-toggle" type="button">${running ? "Stop Auto Combat" : "Start Auto Combat"}</button>
        ${!running ? `<button class="ga-secondary" id="ga-auto-arena-reset" type="button">Reset Arena opponent history</button><button class="ga-secondary" id="ga-auto-provinciarum-reset" type="button">Reset Provinciarum opponent history</button>` : `<span class="ga-statusline">Arena ${arena.completedRuns || 0}/${arena.maxRuns || 0} · Provinciarum ${provin.completedRuns || 0}/${provin.maxRuns || 0} · Dungeon ${dungeon.completedBattles || 0} battle(s) · Expedition ${expedition.completedRuns || 0}/${expedition.maxRuns || 0}</span>`}
      </div>`;

    const dungeonLocationSelect = root.querySelector("#ga-auto-dungeon-location");
    if (dungeonLocationSelect) dungeonLocationSelect.value = String(dungeon.locationId || DUNGEON_LOCATION_ID);
    dungeonLocationSelect?.addEventListener("change", async event => {
      if (!autoDungeonState) await loadAutoDungeonState();
      const value = String(event.target.value || DUNGEON_LOCATION_ID);
      const match = currentDungeonLocationOptions().find(row => String(row.locationId) === value);
      autoDungeonState.locationId = value;
      autoDungeonState.locationName = match?.locationName || autoDungeonState.locationName || DUNGEON_LOCATION_NAME;
      autoDungeonState.dungeonId = null;
      autoDungeonState.dungeonName = "";
      autoDungeonState.runComplete = false;
      autoDungeonState.pendingEncounterKind = null;
      autoDungeonState.pendingEncounterLabel = "";
      autoDungeonState.pendingReportId = null;
      autoDungeonState.noEncounterSince = null;
      autoDungeonState.error = null;
      if (!autoDungeonState.enabled) autoDungeonState.phase = "stopped";
      await saveAutoDungeonState();
      logAutoCombatDiagnostic("dungeon-location-selected", { locationId: value, locationName: autoDungeonState.locationName });
      renderAutoCombatUI();
    });

    root.querySelector("#ga-auto-dungeon-cancel-before-boss")?.addEventListener("change", async event => {
      if (!autoDungeonState || running) return;
      autoDungeonState.cancelBeforeBoss = !!event.target.checked;
      await saveAutoDungeonState();
      logAutoCombatDiagnostic("dungeon-cancel-before-boss-changed", { cancelBeforeBoss: autoDungeonState.cancelBeforeBoss });
      renderAutoCombatUI();
    });

    const targetSelect = root.querySelector("#ga-auto-expedition-target");
    if (targetSelect && selectedExists) targetSelect.value = currentValue;
    targetSelect?.addEventListener("change", async event => {
      if (!autoExpeditionState) await loadAutoExpeditionState();
      const detected = currentCountryFromPageOrSaved();
      const match = detected ? expeditionTargetCatalogEntry(detected.countryKey, event.target.value) : null;
      if (!match || !detected) return;
      autoExpeditionState.countryKey = detected.countryKey;
      autoExpeditionState.countryName = detected.countryName;
      autoExpeditionState.locationId = String(match.locationId);
      autoExpeditionState.locationName = match.locationName;
      autoExpeditionState.targetId = Number(match.targetId);
      autoExpeditionState.targetName = match.targetName;
      await saveAutoExpeditionState();
      renderAutoCombatUI();
    });
    root.querySelector("#ga-auto-arena-runs")?.addEventListener("change", async event => {
      if (!arenaAutomationState || running) return;
      arenaAutomationState.maxRuns = Math.max(1, Math.min(ARENA_MAX_RUNS, Number(event.target.value) || 100));
      await saveArenaAutomationState();
      renderAutoCombatUI();
    });
    root.querySelector("#ga-auto-provinciarum-runs")?.addEventListener("change", async event => {
      if (!circusProvinciarumAutomationState || running) return;
      circusProvinciarumAutomationState.maxRuns = Math.max(1, Math.min(CIRCUS_PROVINCIARUM_MAX_RUNS, Number(event.target.value) || 100));
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
    });
    root.querySelector("#ga-auto-expedition-runs")?.addEventListener("change", async event => {
      if (!autoExpeditionState || running) return;
      autoExpeditionState.maxRuns = Math.max(1, Math.min(AUTO_EXPEDITION_MAX_RUNS, Number(event.target.value) || 100));
      await saveAutoExpeditionState();
      renderAutoCombatUI();
    });
    root.querySelector("#ga-auto-arena-analyze")?.addEventListener("click", async () => {
      if (arenaAnalysisBusy || running) return;
      await analyzeCurrentArenaOpponents().catch(error => {
        logAutoCombatDiagnostic("arena-manual-analysis-error", { error: error?.message || String(error), stack: error?.stack || null });
      });
    });
    root.querySelector("#ga-auto-provinciarum-analyze")?.addEventListener("click", async () => {
      if (circusProvinciarumAnalysisBusy || running) return;
      await analyzeCurrentCircusProvinciarumOpponents().catch(error => {
        logAutoCombatDiagnostic("provinciarum-manual-analysis-error", { error: error?.message || String(error), stack: error?.stack || null });
      });
    });
    root.querySelector("#ga-auto-arena-reset")?.addEventListener("click", async () => {
      if (!arenaAutomationState) await loadArenaAutomationState();
      arenaAutomationState.attemptedOpponents = {};
      arenaAutomationState.pendingTargetKey = null;
      arenaAutomationState.pendingTargetName = "";
      arenaAutomationState.pendingReportId = null;
      arenaAutomationState.completedRuns = 0;
      arenaAutomationState.opponentSearches = 0;
      arenaAutomationState.bestObservedWinRate = null;
      arenaAutomationState.lastBattle = null;
      arenaAutomationState.phase = "stopped";
      arenaAutomationState.error = null;
      await saveArenaAutomationState();
      renderAutoCombatUI();
    });
    root.querySelector("#ga-auto-provinciarum-reset")?.addEventListener("click", async () => {
      if (!circusProvinciarumAutomationState) await loadCircusProvinciarumAutomationState();
      circusProvinciarumAutomationState.attemptedOpponents = {};
      circusProvinciarumAutomationState.unavailableOpponents = {};
      circusProvinciarumAutomationState.pendingTargetKey = null;
      circusProvinciarumAutomationState.pendingTargetName = "";
      circusProvinciarumAutomationState.pendingReportId = null;
      circusProvinciarumAutomationState.lastProcessedReportId = null;
      circusProvinciarumAutomationState.reportWaitReportId = null;
      circusProvinciarumAutomationState.reportWaitStartedAt = null;
      circusProvinciarumAutomationState.reportWaitAttempts = 0;
      circusProvinciarumAutomationState.completedRuns = 0;
      circusProvinciarumAutomationState.opponentSearches = 0;
      circusProvinciarumAutomationState.bestObservedWinRate = null;
      circusProvinciarumAutomationState.lastBattle = null;
      circusProvinciarumAutomationState.phase = "stopped";
      circusProvinciarumAutomationState.error = null;
      await saveCircusProvinciarumAutomationState();
      renderAutoCombatUI();
    });
    root.querySelector("#ga-auto-combat-toggle")?.addEventListener("click", () => void toggleAutoCombatFromUI());
  }

  async function toggleAutoCombatFromUI() {
    const root = shadow?.querySelector("#ga-auto-combat");
    if (!root) return;
    const running = !!arenaAutomationState?.enabled || !!circusProvinciarumAutomationState?.enabled || !!autoDungeonState?.enabled || !!autoExpeditionState?.enabled;
    if (running) {
      await stopArenaAutomation();
      await stopCircusProvinciarumAutomation();
      await stopAutoDungeon();
      await stopAutoExpedition();
      await stopAutoHealing();
      autoCombatDispatcherState.lastModule = null;
      stopAutoCombatDispatcherTimer();
      stopArenaAutomationTimer();
      stopCircusProvinciarumAutomationTimer();
      stopAutoExpeditionTimer();
      renderAutoCombatUI();
      return;
    }

    const arenaSelected = !!root.querySelector('[data-auto-module="arena"]')?.checked;
    const provinSelected = !!root.querySelector('[data-auto-module="provinciarum"]')?.checked;
    const dungeonSelected = !!root.querySelector('[data-auto-module="dungeon"]')?.checked;
    const expeditionSelected = !!root.querySelector('[data-auto-module="expedition"]')?.checked;
    if (autoHealingState?.phase === "error") await stopAutoHealing();
    if (!arenaSelected && !provinSelected && !dungeonSelected && !expeditionSelected) {
      if (statusEl) statusEl.textContent = "Select Auto Arena, Auto Circus Provinciarum, Auto Dungeon and/or Auto Expedition before starting.";
      return;
    }

    if (!arenaSelected && arenaAutomationState?.enabled) await stopArenaAutomation();
    if (!provinSelected && circusProvinciarumAutomationState?.enabled) await stopCircusProvinciarumAutomation();
    if (!dungeonSelected && autoDungeonState?.enabled) await stopAutoDungeon();
    if (!expeditionSelected && autoExpeditionState?.enabled) await stopAutoExpedition();

    autoCombatDispatcherState.lastModule = null;
    const starts = [];
    if (arenaSelected) starts.push(startArenaAutomation({ deferScheduler: true }));
    if (provinSelected) starts.push(startCircusProvinciarumAutomation({ deferScheduler: true }));
    if (dungeonSelected) starts.push(startAutoDungeon({ deferScheduler: true }));
    if (expeditionSelected) starts.push(startAutoExpedition({ deferScheduler: true }));
    await Promise.all(starts);
    renderAutoCombatUI();
    scheduleAutoCombatResume(50);
  }

  function renderAutoArenaUI() {
    const root = shadow?.querySelector("#ga-auto-arena");
    if (!root) return;
    const state = arenaAutomationState || { enabled:false, maxRuns:100, completedRuns:0, phase:"stopped", error:null };
    const reports = arenaCombatStore?.reports || [];
    const recent = reports[0] || null;
    root.innerHTML = `
      <div class="ga-card-head">
        <div><h2>Auto Arena Capture</h2><div class="ga-muted">Development-only data collection. Selects the lowest-level unattempted Provinciarum Arena opponent, records the fight, and never intentionally attacks the same player twice in one capture run.</div></div>
        <div class="ga-statusline" id="ga-auto-arena-status">${esc(arenaAutomationStatusText())}</div>
      </div>
      <div class="ga-auto-expedition-grid">
        <label><span>Fights</span><input id="ga-auto-arena-runs" type="number" min="1" max="${ARENA_MAX_RUNS}" value="${esc(String(state.maxRuns || 100))}" ${state.enabled ? "disabled" : ""}></label>
        <div class="ga-stat"><span>Captured Arena reports</span><strong>${reports.length}</strong></div>
      </div>
      <div class="ga-muted" style="margin-top:6px">Current strategy: lowest level first; ties use the opponent's visible order. ${recent ? `Latest capture: ${esc(recent.participants?.defender?.name || "Unknown opponent")} · ${esc(combatOutcomeLabel(recent.outcome))}.` : "No Arena reports captured yet."}</div>
      <div class="ga-actions-row" style="margin-top:7px">
        <button class="ga-primary" id="ga-auto-arena-start" type="button" ${state.enabled ? "disabled" : ""}>Start</button>
        <button class="ga-secondary" id="ga-auto-arena-stop" type="button" ${state.enabled ? "" : "disabled"}>Stop</button>
        <button class="ga-secondary" id="ga-auto-arena-reset" type="button" ${state.enabled ? "disabled" : ""}>Reset opponent history</button>
      </div>
      ${state.enabled ? `<div class="ga-muted" style="margin-top:6px">Progress: ${state.completedRuns || 0}/${state.maxRuns || 0}${state.pendingTargetName ? ` · Current target: ${esc(state.pendingTargetName)}` : ""}</div>` : ""}`;

    root.querySelector("#ga-auto-arena-start")?.addEventListener("click", startArenaAutomation);
    root.querySelector("#ga-auto-arena-stop")?.addEventListener("click", stopArenaAutomation);
    root.querySelector("#ga-auto-arena-reset")?.addEventListener("click", async () => {
      if (!arenaAutomationState) await loadArenaAutomationState();
      arenaAutomationState.attemptedOpponents = {};
      arenaAutomationState.pendingTargetKey = null;
      arenaAutomationState.pendingTargetName = "";
      arenaAutomationState.pendingReportId = null;
      arenaAutomationState.completedRuns = 0;
      arenaAutomationState.opponentSearches = 0;
      arenaAutomationState.bestObservedWinRate = null;
      arenaAutomationState.lastBattle = null;
      arenaAutomationState.phase = "stopped";
      arenaAutomationState.error = null;
      await saveArenaAutomationState();
      renderAutoCombatUI();
    });
    root.querySelector("#ga-auto-arena-runs")?.addEventListener("change", async event => {
      if (!arenaAutomationState || arenaAutomationState.enabled) return;
      arenaAutomationState.maxRuns = Math.max(1, Math.min(ARENA_MAX_RUNS, Number(event.target.value) || 100));
      await saveArenaAutomationState();
      renderAutoCombatUI();
    });
  }

  function normalizeExpeditionLocationName(value) {
    return normalize(value).toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
  }

  function expeditionCountryLocationRows(countryKey) {
    const country = EXPEDITION_COUNTRIES[countryKey];
    return country ? country.locations.map(([locationId, name]) => ({ locationId: String(locationId), name })) : [];
  }

  function currentExpeditionMenuLocations() {
    const rows = [];
    const seen = new Set();
    const add = (node, name, href, active) => {
      const normalizedName = normalize(name || "");
      if (!normalizedName) return;
      const hrefText = String(href || "");
      const hrefMatch = hrefText.match(/[?&]loc=(\d+)/);
      const inactiveMatch = String(node?.id || "").match(/^location_inactive_(\d+)$/);
      const locationId = hrefMatch ? hrefMatch[1] : inactiveMatch ? inactiveMatch[1] : null;
      if (locationId == null) return;
      const key = `${locationId}:${normalizeExpeditionLocationName(normalizedName)}`;
      if (seen.has(key)) return;
      seen.add(key);
      rows.push({
        locationId: String(locationId),
        name: normalizedName,
        href: hrefText ? (node?.href || null) : null,
        active: !!active
      });
    };

    const menu = document.querySelector("#submenu2");
    if (menu) {
      menu.querySelectorAll("a.menuitem[href*='mod=location'], span.menuitem[id^='location_inactive_']").forEach(node => {
        add(node, node.textContent || node.getAttribute("title") || node.getAttribute("alt") || "", node.getAttribute("href") || "", node.tagName === "A");
      });
    }

    // The country map uses transparent image-map anchors. Their labels are
    // carried by title/alt rather than visible text, so include them in the
    // same country-detection/navigation dataset.
    document.querySelectorAll(".map_clickareas a.map_link[href]").forEach(node => {
      const name = node.getAttribute("title") || node.getAttribute("alt") || node.textContent || "";
      add(node, name, node.getAttribute("href") || "", true);
    });

    return rows;
  }

  function detectCurrentExpeditionCountry() {
    const menuLocations = currentExpeditionMenuLocations();
    if (!menuLocations.length) return null;
    const observed = new Set(menuLocations.map(x => normalizeExpeditionLocationName(x.name)));
    let best = null;
    for (const [countryKey, country] of Object.entries(EXPEDITION_COUNTRIES)) {
      const matched = country.locations.reduce((sum, [, name]) => sum + (observed.has(normalizeExpeditionLocationName(name)) ? 1 : 0), 0);
      if (!best || matched > best.matched) best = { countryKey, countryName: country.name, matched };
    }
    if (!best || best.matched < 1) return null;
    const ties = Object.entries(EXPEDITION_COUNTRIES).filter(([, country]) => country.locations.reduce((sum, [, name]) => sum + (observed.has(normalizeExpeditionLocationName(name)) ? 1 : 0), 0) === best.matched);
    if (ties.length !== 1) return null;
    return { ...best, menuLocations };
  }

  function autoExpeditionCountryContext() {
    const detected = detectCurrentExpeditionCountry();
    if (detected) return { ...detected, source: "page-menu" };
    const savedKey = autoExpeditionState?.countryKey ? String(autoExpeditionState.countryKey) : "";
    const savedCountry = savedKey ? EXPEDITION_COUNTRIES[savedKey] : null;
    if (savedCountry) {
      return {
        countryKey: savedKey,
        countryName: savedCountry.name,
        matched: 0,
        menuLocations: [],
        source: "saved-state"
      };
    }
    return null;
  }

  function getCurrentCountryAccessibleLocations(countryKey) {
    const detected = detectCurrentExpeditionCountry();
    if (!detected || detected.countryKey !== countryKey) return [];
    const known = new Map(expeditionCountryLocationRows(countryKey).map(row => [normalizeExpeditionLocationName(row.name), row]));
    return detected.menuLocations
      .filter(row => row.active)
      .map(row => {
        const knownRow = known.get(normalizeExpeditionLocationName(row.name));
        return knownRow ? { ...knownRow, href: row.href } : null;
      })
      .filter(Boolean);
  }

  function currentExpeditionLocationId() {
    try {
      const url = new URL(location.href);
      return url.searchParams.get("mod") === "location" ? url.searchParams.get("loc") : null;
    } catch (_) { return null; }
  }

  function isExpeditionLocationPage() {
    try {
      const url = new URL(location.href);
      return url.searchParams.get("mod") === "location" && !!url.searchParams.get("loc") && !!document.querySelector("#expedition_list");
    } catch (_) { return false; }
  }

  function isVisibleElement(element) {
    if (!element) return false;
    try {
      const style = globalThis.getComputedStyle ? getComputedStyle(element) : null;
      if (style && (style.display === "none" || style.visibility === "hidden")) return false;
      return element.getClientRects ? element.getClientRects().length > 0 : true;
    } catch (_) {
      return true;
    }
  }

  function hasVisibleRubyCooldownCost(box) {
    if (!box) return false;
    const reductionEl = box.querySelector(".expedition_cooldown_reduce");
    if (reductionEl && isVisibleElement(reductionEl)) return true;
    const rubyImage = [...box.querySelectorAll("img[title='Rubies'], img[alt='Rubies']")].find(isVisibleElement);
    if (!rubyImage) return false;
    const text = normalize(box.textContent || "");
    return /\bcost\s*:/i.test(text) || /\brub(?:y|ies)\b/i.test(text);
  }

  function parseAttackHandler(value) {
    const text = String(value || "");
    const match = text.match(/attack\s*\(\s*null\s*,\s*['"]([^'"]+)['"]\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!match) return null;
    return {
      contextId: match[1],
      targetId: Number(match[2]),
      cooldownFlag: Number(match[3])
    };
  }

  function getExpeditionTargets() {
    const boxes = [...document.querySelectorAll("#expedition_list .expedition_box")];
    const pageLocationId = currentExpeditionLocationId();
    return boxes.map((box, index) => {
      const button = box.querySelector("button.expedition_button[onclick*='attack(']");
      const attack = parseAttackHandler(button?.getAttribute("onclick"));
      const name = normalize(box.querySelector(".expedition_name")?.textContent || "");
      const disabled = !!button?.disabled || button?.classList.contains("disabled");
      const cooldownSkipCostVisible = hasVisibleRubyCooldownCost(box);
      const cooldownFlag = Number.isFinite(Number(attack?.cooldownFlag)) ? Number(attack.cooldownFlag) : null;
      const cooldownActive = cooldownFlag !== 0 || cooldownSkipCostVisible;
      return {
        index,
        name: name || `Expedition ${index + 1}`,
        targetId: attack?.targetId ?? null,
        locationId: pageLocationId,
        contextId: attack?.contextId ?? null,
        cooldownFlag,
        cooldownActive,
        cooldownSkipCostVisible,
        disabled,
        available: !!attack && !disabled && !cooldownActive,
        button
      };
    }).filter(target => target.targetId != null);
  }

  function parseExpeditionCooldownMs(value) {
    const text = normalize(value || "");
    if (!text) return null;
    if (/^go\s+to\s+(?:the\s+)?expedition$/i.test(text) || /^(?:ready|available|now)$/i.test(text)) return 0;
    const match = text.match(/^(\d+):(\d{1,2})(?::(\d{1,2}))?$/);
    if (!match) return null;
    const hoursOrMinutes = Number(match[1]);
    const minutesOrSeconds = Number(match[2]);
    const seconds = match[3] != null ? Number(match[3]) : 0;
    const totalSeconds = match[3] != null
      ? hoursOrMinutes * 3600 + minutesOrSeconds * 60 + seconds
      : hoursOrMinutes * 60 + minutesOrSeconds;
    return Number.isFinite(totalSeconds) ? totalSeconds * 1000 : null;
  }

  function readGlobalExpeditionCooldownMs() {
    return parseExpeditionCooldownMs(document.querySelector("#cooldown_bar_text_expedition")?.textContent || "");
  }

  function formatExpeditionCooldown(ms) {
    const totalSeconds = Math.max(0, Math.ceil((Number(ms) || 0) / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0
      ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      : `${Math.floor(totalSeconds / 60)}:${String(seconds).padStart(2, "0")}`;
  }

  function autoExpeditionStatusText() {
    const state = autoExpeditionState;
    if (!state?.enabled) return "Stopped.";
    const target = state.targetName || "Target";
    const runs = Number(state.completedRuns) || 0;
    const max = Number(state.maxRuns) || 0;
    switch (state.phase) {
      case "starting": return `Starting · ${target} · ${runs}/${max}`;
      case "waiting-report": return `Waiting for battle result · ${target} · ${runs}/${max}`;
      case "waiting-cooldown": return `Waiting for expedition availability · ${target} · ${runs}/${max}`;
      case "waiting-other": return `Waiting for dispatcher · ${target} · ${runs}/${max}`;
      case "queued": return `Ready check · ${moduleReadinessLabel("expedition")} · ${target} · ${runs}/${max}`;
      case "checking": return `Checking Expedition availability · ${target} · ${runs}/${max}`;
      case "refreshing": return `Refreshing expedition page · ${target} · ${runs}/${max}`;
      case "humanizing": return `Preparing Expedition action · ${target} · ${runs}/${max}`;
      case "attacking": return `Expedition started · ${target} · ${runs}/${max}`;
      case "complete": return `Complete · ${runs}/${max}`;
      case "error": return `Stopped: ${state.error || "unexpected state"}`;
      default: return `Running · ${target} · ${runs}/${max}`;
    }
  }

  function isDungeonPage() {
    try {
      const url = new URL(location.href);
      return url.searchParams.get("mod") === "dungeon" && document.body?.id === "dungeonPage";
    } catch (_) { return false; }
  }

  function dungeonLocationIdFromUrl() {
    try { return new URL(location.href).searchParams.get("loc") || null; }
    catch (_) { return null; }
  }

  function dungeonPointsSnapshot() {
    const current = parseLocalizedInteger(document.querySelector("#dungeonpoints_value_point")?.textContent || "");
    const max = parseLocalizedInteger(document.querySelector("#dungeonpoints_value_pointmax")?.textContent || "");
    return { current: Number.isFinite(current) ? current : null, max: Number.isFinite(max) ? max : null };
  }

  function parseNextDungeonPointMs() {
    const tooltip = String(document.querySelector("#icon_dungeonpoints")?.getAttribute("data-tooltip") || "");
    const raw = normalize(tooltip.replace(/&quot;/g, '"'));
    const match = raw.match(/Next point:\s*(?:(\d+):)?(\d{1,2}):(\d{2})/i);
    if (!match) return null;
    return ((Number(match[1] || 0) * 60 + Number(match[2])) * 60 + Number(match[3])) * 1000;
  }

  function parseDungeonGlobalCooldownMs(value) {
    const text = normalize(value || "");
    if (!text) return null;
    if (/^go\s+to\s+dungeon$/i.test(text) || /^(?:ready|available|now)$/i.test(text)) return 0;
    const match = text.match(/^(?:(\d+)\s*:)??(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);
    const seconds = Number(match[3] || 0);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return Number.isFinite(totalSeconds) ? totalSeconds * 1000 : null;
  }

  function readGlobalDungeonCooldownMs() {
    return parseDungeonGlobalCooldownMs(document.querySelector("#cooldown_bar_text_dungeon")?.textContent || "");
  }

  function dungeonPointCooldownMs() {
    const points = dungeonPointsSnapshot();
    if (Number.isFinite(points.current) && points.current > 0) return 0;
    if (points.current === 0) return parseNextDungeonPointMs();
    return null;
  }

  function parseDungeonStartFight(value) {
    const match = String(value || "").match(/startFight\(\s*['"](\d+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/i);
    if (!match) return null;
    return { type: String(match[1]), dungeonId: String(match[2]) };
  }

  function dungeonFightCandidates() {
    if (!isDungeonPage()) return [];
    const currentDungeonId = normalize(document.querySelector('form[action*="cancelDungeon"] input[name="dungeonId"]')?.value || "");
    const grouped = new Map();
    for (const node of [...document.querySelectorAll('[onclick*="startFight("]')]) {
      const fight = parseDungeonStartFight(node.getAttribute("onclick"));
      if (!fight || (currentDungeonId && fight.dungeonId !== currentDungeonId)) continue;
      const labelNode = node.classList?.contains("map_label") ? node : node.parentElement?.querySelector?.('.map_label[onclick*="startFight("]');
      const label = normalize(labelNode?.textContent || node.getAttribute("title") || node.getAttribute("alt") || node.textContent || "");
      // Any valid startFight(...) node is an attackable dungeon encounter.
      // The server exposes additional normal encounter types (for example 1–4)
      // on a freshly created dungeon, so normal-vs-unknown must not depend on a
      // hard-coded list of type IDs. Boss remains explicitly identified by type
      // 7 or its visible Boss label.
      const kind = fight.type === "7" || /\bboss\b/i.test(label) ? "boss" : "normal";
      const priority = node.classList?.contains("map_label") ? 0 : node.tagName === "IMG" ? 1 : 2;
      // The live dungeon DOM can expose the same Boss encounter through more
      // than one startFight(...) element, sometimes with one representation
      // carrying the visible label and another carrying no text at all. Treat
      // those as one logical Boss target so Boss-only cancellation is based on
      // distinct encounters rather than duplicate DOM representations. Normal
      // encounters retain their label-based grouping because multiple normal
      // encounters can legitimately share the same type and dungeon id.
      const key = kind === "boss"
        ? `boss|${fight.dungeonId}`
        : `${fight.type}|${fight.dungeonId}|${label}`;
      const existing = grouped.get(key);
      if (!existing || priority < existing.priority) grouped.set(key, { node, ...fight, label, kind, priority });
    }
    return [...grouped.values()].sort((a, b) => a.kind === b.kind ? a.priority - b.priority : a.kind === "boss" ? -1 : 1);
  }

  function dungeonEntryOptions() {
    if (!isDungeonPage()) return [];
    const rows = [];
    const seen = new Set();
    for (const form of [...document.querySelectorAll('form[action*="mod=dungeon"]')]) {
      const action = form.getAttribute("action") || form.action || "";
      let actionUrl = null;
      try { actionUrl = new URL(action, location.href); } catch (_) {}
      if (!actionUrl || actionUrl.searchParams.get("mod") !== "dungeon") continue;
      const loc = actionUrl.searchParams.get("loc");
      if (loc != null && String(loc) !== String(dungeonLocationIdFromUrl())) continue;
      for (const button of [...form.querySelectorAll('input[type="submit"][name^="dif"], button[type="submit"][name^="dif"]')]) {
        if (button.disabled || button.classList?.contains("disabled")) continue;
        const name = String(button.getAttribute("name") || "");
        const value = normalize(button.value || button.textContent || "");
        if (!/^dif\d+$/i.test(name) || !value) continue;
        const key = `${name}|${value}`;
        if (seen.has(key)) continue;
        seen.add(key);
        rows.push({ difficultyKey: name.toLowerCase(), difficultyLabel: value, button, action: actionUrl.href, locationId: loc != null ? String(loc) : String(dungeonLocationIdFromUrl()) });
      }
    }
    return rows;
  }

  function dungeonEntryState() {
    const options = dungeonEntryOptions();
    const normal = options.find(option => option.difficultyKey === "dif1") || options.find(option => /normal/i.test(option.difficultyLabel || "")) || null;
    return {
      available: !!normal,
      difficulty: normal?.difficultyLabel || null,
      locationId: normal?.locationId || dungeonLocationIdFromUrl(),
      action: normal?.action || null,
      optionCount: options.length,
      options: options.map(option => ({ difficultyKey: option.difficultyKey, difficultyLabel: option.difficultyLabel, locationId: option.locationId }))
    };
  }

  function currentDungeonLocationOptions() {
    const rows = currentExpeditionMenuLocations()
      .filter(row => row.active)
      .map(row => ({ locationId: String(row.locationId), locationName: normalize(row.name || "") }))
      .filter(row => row.locationName);
    const seen = new Set();
    const unique = [];
    for (const row of rows) {
      if (seen.has(row.locationId)) continue;
      seen.add(row.locationId);
      unique.push(row);
    }
    if (autoDungeonState?.locationId && !seen.has(String(autoDungeonState.locationId))) {
      unique.push({ locationId: String(autoDungeonState.locationId), locationName: normalize(autoDungeonState.locationName || "") || `Location ${autoDungeonState.locationId}` });
    }
    return unique;
  }

  function dungeonPageStateSnapshot() {
    const points = dungeonPointsSnapshot();
    const candidates = dungeonFightCandidates();
    const dungeonId = normalize(document.querySelector('form[action*="cancelDungeon"] input[name="dungeonId"]')?.value || "") || null;
    const dungeonName = normalize(document.querySelector(".dungeon_header_open")?.textContent || "") || null;
    const entry = dungeonEntryState();
    return {
      isDungeonPage: isDungeonPage(),
      locationId: dungeonLocationIdFromUrl(),
      dungeonId,
      dungeonName,
      globalCooldownMs: readGlobalDungeonCooldownMs(),
      pointCooldownMs: dungeonPointCooldownMs(),
      entryAvailable: entry.available,
      entryDifficulty: entry.difficulty,
      entryOptions: entry.options,
      points,
      candidates: candidates.map(item => ({ type: item.type, dungeonId: item.dungeonId, label: item.label, kind: item.kind }))
    };
  }

  function dungeonQuestConditionsFulfilled() {
    const conditions = [...document.querySelectorAll(".dungeoncondition_label2")];
    if (!conditions.length) return false;
    return conditions.every(label => !!label.parentElement?.querySelector?.(".dungeoncondition_fulfilled"));
  }

  function autoDungeonStatusText() {
    const state = autoDungeonState;
    const target = state?.dungeonName || state?.locationName || DUNGEON_LOCATION_NAME;
    const battles = Number(state?.completedBattles) || 0;
    const lossStreak = Number(state?.consecutiveLosses) || 0;
    const lossLimit = Math.max(1, Number(settings?.automation?.dungeonConsecutiveLossesBeforeReset) || 2);
    const streakText = lossStreak > 0 ? ` · losses ${lossStreak}/${lossLimit}` : "";
    if (!state?.enabled) return state?.phase === "complete" ? `Complete · ${target} · ${battles} battles` : state?.phase === "error" ? `Stopped: ${state.error || "unexpected state"}` : "Stopped.";
    const encounter = state.pendingEncounterKind === "boss" ? "Boss" : state.pendingEncounterKind === "normal" ? "normal encounter" : "encounter";
    switch (state.phase) {
      case "starting": return `Starting · ${target} · ${battles} battles${streakText}`;
      case "navigating": return `Opening ${target} · ${battles} battles${streakText}`;
      case "entering": return `Entering ${target} · starting new dungeon${streakText}`;
      case "waiting-map": return `Waiting for ${target} map · ${battles} battles${streakText}`;
      case "resetting": return `Resetting ${target} · ${battles} battles${streakText}`;
      case "waiting-report": return `Waiting for battle result · ${encounter} · ${battles} battles${streakText}`;
      case "waiting-cooldown": return `Waiting for dungeon point · ${target} · ${battles} battles${streakText}`;
      case "waiting-other": return `Waiting for dispatcher · ${target} · ${battles} battles${streakText}`;
      case "queued": return `Ready check · ${moduleReadinessLabel("dungeon")} · ${target} · ${battles} battles${streakText}`;
      case "checking": return `Checking Dungeon map · ${target} · ${battles} battles${streakText}`;
      case "humanizing": return `Preparing ${encounter} · ${target}${streakText}`;
      case "attacking": return `Dungeon ${encounter} started · ${target}${streakText}`;
      case "complete": return `Complete · ${target} · ${battles} battles`;
      case "error": return `Stopped: ${state.error || "unexpected state"}`;
      default: return `Running · ${target} · ${battles} battles`;
    }
  }

  async function loadAutoDungeonState() {
    try {
      const result = await storageGet(dungeonAutomationKey());
      const stored = result?.[dungeonAutomationKey()];
      if (stored && typeof stored === "object") {
        autoDungeonState = {
          enabled: !!stored.enabled,
          locationId: stored.locationId != null ? String(stored.locationId) : DUNGEON_LOCATION_ID,
          locationName: normalize(stored.locationName || DUNGEON_LOCATION_NAME) || DUNGEON_LOCATION_NAME,
          dungeonId: stored.dungeonId != null ? String(stored.dungeonId) : null,
          dungeonName: normalize(stored.dungeonName || ""),
          completedBattles: Math.max(0, Number(stored.completedBattles) || 0),
          runComplete: stored.runComplete === true || (stored.phase === "complete" && stored.enabled === false && (Number(stored.completedBattles) || 0) > 0),
          cancelBeforeBoss: !!stored.cancelBeforeBoss,
          pendingEncounterKind: ["normal", "boss"].includes(stored.pendingEncounterKind) ? stored.pendingEncounterKind : null,
          pendingEncounterLabel: normalize(stored.pendingEncounterLabel || ""),
          pendingReportId: stored.pendingReportId ? String(stored.pendingReportId) : null,
          lastReportId: stored.lastReportId ? String(stored.lastReportId) : null,
          noEncounterSince: Number.isFinite(Number(stored.noEncounterSince)) ? Number(stored.noEncounterSince) : null,
          pendingOpponentKey: normalize(stored.pendingOpponentKey || "") || null,
          lossStreakOpponentKey: normalize(stored.lossStreakOpponentKey || "") || null,
          lossStreakOpponentLabel: normalize(stored.lossStreakOpponentLabel || "") || "",
          consecutiveLosses: Math.max(0, Number(stored.consecutiveLosses) || 0),
          pendingRunReset: stored.pendingRunReset === true,
          readiness: stored.readiness === "ready" || stored.readiness === "cooling" ? stored.readiness : "unknown",
          readyAt: Number.isFinite(Number(stored.readyAt)) ? Number(stored.readyAt) : null,
          phase: stored.phase || "stopped",
          startedAt: stored.startedAt || null,
          error: stored.error || null
        };
        return autoDungeonState;
      }
    } catch (_) {}
    autoDungeonState = {
      enabled: false, locationId: DUNGEON_LOCATION_ID, locationName: DUNGEON_LOCATION_NAME, dungeonId: null, dungeonName: "",
      completedBattles: 0, runComplete: false, cancelBeforeBoss: false, pendingEncounterKind: null, pendingEncounterLabel: "", pendingReportId: null, lastReportId: null,
      noEncounterSince: null, pendingOpponentKey: null, lossStreakOpponentKey: null, lossStreakOpponentLabel: "", consecutiveLosses: 0, pendingRunReset: false,
      readiness: "unknown", readyAt: null, phase: "stopped", startedAt: null, error: null
    };
    return autoDungeonState;
  }

  async function saveAutoDungeonState() {
    if (!autoDungeonState) return;
    try { await storageSet({ [dungeonAutomationKey()]: autoDungeonState }); } catch (_) {}
  }

  function stopAutoDungeonTimer() {
    if (autoDungeonTimer) { clearTimeout(autoDungeonTimer); autoDungeonTimer = null; }
  }

  function findDungeonNavigationLink() {
    const expectedLocationId = String(autoDungeonState?.locationId || DUNGEON_LOCATION_ID);
    const candidates = [];
    for (const anchor of [...document.querySelectorAll("a[href]")]) {
      try {
        const href = anchor.href || anchor.getAttribute("href");
        if (!href) continue;
        const url = new URL(href, location.href);
        if (url.origin !== location.origin || url.searchParams.get("mod") !== "dungeon") continue;
        const loc = url.searchParams.get("loc");
        if (loc != null && String(loc) !== expectedLocationId) continue;
        const textValue = normalize(anchor.textContent || anchor.getAttribute("title") || anchor.getAttribute("aria-label") || "");
        candidates.push({ anchor, score: loc != null ? 0 : /dungeon|temple|cave/i.test(textValue) ? 1 : 2 });
      } catch (_) {}
    }
    candidates.sort((a, b) => a.score - b.score);
    return candidates[0]?.anchor || null;
  }

  async function navigateToDungeon() {
    if (!autoDungeonState?.enabled) return false;
    const globalDungeonCooldownMs = readGlobalDungeonCooldownMs();
    if (Number.isFinite(globalDungeonCooldownMs) && globalDungeonCooldownMs > 0) {
      autoDungeonState.phase = "waiting-cooldown";
      autoDungeonState.error = `Waiting for Dungeon availability · ${formatExpeditionCooldown(globalDungeonCooldownMs)}.`;
      setModuleReadiness("dungeon", globalDungeonCooldownMs);
      await saveAutoDungeonState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("dungeon-navigation-blocked-cooldown", {
        cooldownMs: globalDungeonCooldownMs,
        raw: normalize(document.querySelector("#cooldown_bar_text_dungeon")?.textContent || "")
      });
      scheduleAutoCombatResume(Math.max(25, globalDungeonCooldownMs + 25), "dungeon-navigation-cooldown-wait");
      return false;
    }
    if (!beginAutomationNavigation("dungeon")) {
      autoDungeonState.phase = "waiting-other";
      autoDungeonState.error = "Navigation is owned by the active combat job; Dungeon remains queued.";
      await saveAutoDungeonState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("dungeon-navigation-blocked", { owner: automationNavigationOwner });
      return false;
    }
    if (isDungeonPage() && String(dungeonLocationIdFromUrl()) === String(autoDungeonState.locationId)) {
      releaseAutomationNavigation("dungeon");
      return true;
    }
    const link = findDungeonNavigationLink();
    if (!link) {
      releaseAutomationNavigation("dungeon");
      autoDungeonState.enabled = false;
      autoDungeonState.phase = "error";
      autoDungeonState.error = `Server-provided navigation to ${autoDungeonState.locationName || DUNGEON_LOCATION_NAME} was not found; navigation was not attempted.`;
      await saveAutoDungeonState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("dungeon-navigation-link-missing", {});
      return false;
    }
    autoDungeonState.phase = "navigating";
    autoDungeonState.error = `Opening the server-provided ${autoDungeonState.locationName || DUNGEON_LOCATION_NAME} dungeon link.`;
    await saveAutoDungeonState();
    renderAutoCombatUI();
    const href = link.href || link.getAttribute("href") || null;
    logAutoCombatDiagnostic("dungeon-navigation-click-start", { href });
    const clicked = await humanizedClick(link, "dungeon-navigation");
    logAutoCombatDiagnostic("dungeon-navigation-click-result", { clicked, href });
    if (!clicked) {
      releaseAutomationNavigation("dungeon");
      autoDungeonState.phase = "checking";
      autoDungeonState.error = "Dungeon navigation control disappeared before the click could be performed; retrying.";
      await saveAutoDungeonState();
      renderAutoCombatUI();
      scheduleAutoCombatResume(500, "dungeon-navigation-click-retry");
    }
    return false;
  }

  async function stopAutoDungeon() {
    dungeonReportWaitStartedAt = 0;
    stopAutoDungeonTimer();
    releaseAutomationNavigation("dungeon");
    if (!autoDungeonState) await loadAutoDungeonState();
    autoDungeonState.enabled = false;
    autoDungeonState.runComplete = false;
    autoDungeonState.phase = "stopped";
    autoDungeonState.error = null;
    autoDungeonState.readiness = "unknown";
    autoDungeonState.readyAt = null;
    autoDungeonState.pendingEncounterKind = null;
    autoDungeonState.pendingEncounterLabel = "";
    autoDungeonState.pendingReportId = null;
    autoDungeonState.noEncounterSince = null;
    await saveAutoDungeonState();
    renderAutoCombatUI();
    if (!autoCombatEnabledModules().length) { stopAutoCombatDispatcherTimer(); stopAutoCombatCooldownObserver(); }
    else scheduleAutoCombatResume(0, "dungeon-stopped-handoff");
    if (statusEl) statusEl.textContent = "Auto Dungeon stopped.";
  }

  async function startAutoDungeon({ deferScheduler = false } = {}) {
    if (autoDungeonBusy) return;
    autoDungeonBusy = true;
    dungeonReportWaitStartedAt = 0;
    try {
      if (!autoDungeonState) await loadAutoDungeonState();
      const selectedLocationId = String(autoDungeonState.locationId || DUNGEON_LOCATION_ID);
      const selectedLocationName = normalize(autoDungeonState.locationName || "") || DUNGEON_LOCATION_NAME;
      Object.assign(autoDungeonState, {
        enabled: true,
        locationId: selectedLocationId,
        locationName: selectedLocationName,
        dungeonId: null,
        dungeonName: "",
        completedBattles: 0,
        runComplete: false,
        pendingEncounterKind: null,
        pendingEncounterLabel: "",
        pendingReportId: null,
        lastReportId: null,
        noEncounterSince: null,
        pendingOpponentKey: null,
        lossStreakOpponentKey: null,
        lossStreakOpponentLabel: "",
        consecutiveLosses: 0,
        pendingRunReset: false,
        readiness: "unknown",
        readyAt: null,
        phase: "starting",
        startedAt: new Date().toISOString(),
        error: null
      });
      await saveAutoDungeonState();
      renderAutoCombatUI();
      ensureAutoCombatCooldownObserver();
      logAutoCombatDiagnostic("dungeon-start", { locationId: selectedLocationId, locationName: selectedLocationName });
      if (!deferScheduler) scheduleAutoCombatResume(250, "dungeon-start");
    } finally { autoDungeonBusy = false; }
  }


  function findDungeonCancelControl() {
    if (!isDungeonPage()) return null;
    const form = [...document.querySelectorAll("form[action*='cancelDungeon']")].find(node => {
      try {
        const action = new URL(node.getAttribute("action") || node.action || "", location.href);
        return action.origin === location.origin;
      } catch (_) { return false; }
    });
    if (!form) return null;
    const controls = [...form.querySelectorAll("input[type='submit'], button[type='submit']")].filter(node => !node.disabled && !node.classList?.contains("disabled"));
    const preferred = controls.find(node => /cancel|abbrechen|annul/i.test(normalize(node.value || node.textContent || node.getAttribute("title") || "")));
    return preferred || controls[0] || null;
  }

  async function resetDungeonBeforeBoss(candidates, bossTarget) {
    if (!autoDungeonState?.enabled || !autoDungeonState.cancelBeforeBoss) return false;
    if (candidates.length !== 1 || bossTarget?.kind !== "boss") return false;
    const control = findDungeonCancelControl();
    logAutoCombatDiagnostic("dungeon-boss-only-reset-check", {
      cancelBeforeBoss: true,
      candidateCount: candidates.length,
      boss: bossTarget ? { type: bossTarget.type, dungeonId: bossTarget.dungeonId, label: bossTarget.label } : null,
      cancelControlFound: !!control
    });
    if (!control) {
      autoDungeonState.enabled = false;
      autoDungeonState.phase = "error";
      autoDungeonState.error = "Boss is the only remaining Dungeon target, but the server-provided Dungeon reset control was not found. The Boss was not attacked.";
      await saveAutoDungeonState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("dungeon-error", { error: autoDungeonState.error, reason: "boss-only-reset-control-missing" });
      return true;
    }
    autoDungeonState.phase = "resetting";
    autoDungeonState.error = "Boss is the only remaining target; resetting the Dungeon without attacking Boss.";
    autoDungeonState.pendingEncounterKind = "boss";
    autoDungeonState.pendingEncounterLabel = bossTarget.label;
    await saveAutoDungeonState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("dungeon-reset-before-boss-start", {
      type: bossTarget.type, dungeonId: bossTarget.dungeonId, label: bossTarget.label
    });
    const clicked = await humanizedClick(control, "dungeon-reset-before-boss");
    logAutoCombatDiagnostic("dungeon-reset-before-boss-result", { clicked, label: bossTarget.label });
    if (!clicked) {
      autoDungeonState.enabled = false;
      autoDungeonState.phase = "error";
      autoDungeonState.error = "Dungeon reset control disappeared before the reset click could be performed. The Boss was not attacked.";
      await saveAutoDungeonState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("dungeon-error", { error: autoDungeonState.error, reason: "boss-only-reset-click-failed" });
      return true;
    }
    autoDungeonState.dungeonId = null;
    autoDungeonState.dungeonName = "";
    autoDungeonState.pendingEncounterKind = null;
    autoDungeonState.pendingEncounterLabel = "";
    autoDungeonState.pendingReportId = null;
    autoDungeonState.noEncounterSince = null;
    autoDungeonState.readiness = "unknown";
    autoDungeonState.readyAt = null;
    autoDungeonState.phase = "waiting-map";
    autoDungeonState.error = "Dungeon reset; waiting for the selected dungeon entry page.";
    await saveAutoDungeonState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("dungeon-reset-before-boss-complete", {
      completedBattles: autoDungeonState.completedBattles,
      dungeonId: bossTarget.dungeonId,
      nextAction: "re-enter-selected-dungeon"
    });
    return true;
  }

  async function processPendingDungeonRunReset() {
    if (!autoDungeonState?.enabled || !autoDungeonState.pendingRunReset) return false;
    if (!isDungeonPage() || String(dungeonLocationIdFromUrl()) !== String(autoDungeonState.locationId)) return false;
    const control = findDungeonCancelControl();
    logAutoCombatDiagnostic("dungeon-loss-reset-check", {
      pendingRunReset: true,
      opponent: autoDungeonState.lossStreakOpponentLabel || autoDungeonState.pendingOpponentKey || null,
      consecutiveLosses: Number(autoDungeonState.consecutiveLosses) || 0,
      threshold: Math.max(1, Number(settings?.automation?.dungeonConsecutiveLossesBeforeReset) || 2),
      cancelControlFound: !!control
    });
    if (!control) {
      autoDungeonState.enabled = false;
      autoDungeonState.phase = "error";
      autoDungeonState.error = "The configured Dungeon consecutive-loss limit was reached, but the Dungeon reset control was not found. Automation stopped without starting another fight.";
      autoDungeonState.pendingRunReset = false;
      await saveAutoDungeonState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("dungeon-error", { error: autoDungeonState.error, reason: "loss-streak-reset-control-missing" });
      return true;
    }
    autoDungeonState.phase = "resetting";
    autoDungeonState.error = `Resetting Dungeon after ${autoDungeonState.consecutiveLosses} consecutive loss(es) against ${autoDungeonState.lossStreakOpponentLabel || "the same opponent"}.`;
    await saveAutoDungeonState();
    renderAutoCombatUI();
    const clicked = await humanizedClick(control, "dungeon-loss-streak-reset");
    logAutoCombatDiagnostic("dungeon-loss-reset-result", {
      clicked,
      opponent: autoDungeonState.lossStreakOpponentLabel || autoDungeonState.pendingOpponentKey || null,
      consecutiveLosses: Number(autoDungeonState.consecutiveLosses) || 0
    });
    if (!clicked) {
      autoDungeonState.enabled = false;
      autoDungeonState.phase = "error";
      autoDungeonState.error = "The Dungeon reset control disappeared before the reset click could be performed. Automation stopped without starting another fight.";
      autoDungeonState.pendingRunReset = false;
      await saveAutoDungeonState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("dungeon-error", { error: autoDungeonState.error, reason: "loss-streak-reset-click-failed" });
      return true;
    }
    releaseAutomationNavigation("dungeon");
    autoDungeonState.dungeonId = null;
    autoDungeonState.dungeonName = "";
    autoDungeonState.completedBattles = 0;
    autoDungeonState.runComplete = false;
    autoDungeonState.pendingEncounterKind = null;
    autoDungeonState.pendingEncounterLabel = "";
    autoDungeonState.pendingOpponentKey = null;
    autoDungeonState.pendingReportId = null;
    autoDungeonState.noEncounterSince = null;
    autoDungeonState.lossStreakOpponentKey = null;
    autoDungeonState.lossStreakOpponentLabel = "";
    autoDungeonState.consecutiveLosses = 0;
    autoDungeonState.pendingRunReset = false;
    autoDungeonState.readiness = "unknown";
    autoDungeonState.readyAt = null;
    autoDungeonState.phase = "waiting-map";
    autoDungeonState.error = `Dungeon reset after consecutive losses; waiting for the ${autoDungeonState.locationName || DUNGEON_LOCATION_NAME} dungeon map.`;
    await saveAutoDungeonState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("dungeon-loss-streak-reset-complete", {
      completedBattles: 0,
      nextAction: "re-enter-selected-dungeon"
    });
    scheduleAutoCombatResume(750, "dungeon-loss-streak-reset-map-wait");
    return true;
  }

  function dungeonOpponentKeyFromReport(report) {
    const defender = report?.participants?.defenders?.[0] || null;
    const name = normalize(defender?.name || "");
    if (name && !/^defender\s+\d+$/i.test(name) && !/^unknown opponent$/i.test(name)) return name.toLowerCase();
    const pending = normalize(autoDungeonState?.pendingOpponentKey || autoDungeonState?.pendingEncounterLabel || "");
    return pending ? pending.toLowerCase() : null;
  }

  async function markAutoDungeonBattleComplete(reportId, report = null) {
    if (!autoDungeonState?.enabled) return;
    dungeonReportWaitStartedAt = 0;
    const id = reportId ? String(reportId) : null;
    if (!id || id === autoDungeonState.lastReportId) return;
    const completedKind = autoDungeonState.pendingEncounterKind;
    const completedOpponentKey = dungeonOpponentKeyFromReport(report);
    const completedOpponentLabel = normalize(report?.participants?.defenders?.[0]?.name || autoDungeonState.pendingEncounterLabel || "") || "Unknown opponent";
    autoDungeonState.lastReportId = id;
    autoDungeonState.completedBattles = (Number(autoDungeonState.completedBattles) || 0) + 1;
    autoDungeonState.pendingReportId = null;
    autoDungeonState.pendingEncounterKind = null;
    autoDungeonState.pendingEncounterLabel = "";
    autoDungeonState.pendingOpponentKey = null;
    autoDungeonState.noEncounterSince = null;
    if (report?.outcome?.type === "loss") {
      const sameOpponent = !!completedOpponentKey && String(completedOpponentKey).toLowerCase() === String(autoDungeonState.lossStreakOpponentKey || "").toLowerCase();
      autoDungeonState.consecutiveLosses = sameOpponent ? (Number(autoDungeonState.consecutiveLosses) || 0) + 1 : 1;
      autoDungeonState.lossStreakOpponentKey = completedOpponentKey || completedOpponentLabel.toLowerCase();
      autoDungeonState.lossStreakOpponentLabel = completedOpponentLabel;
      const threshold = Math.max(1, Number(settings?.automation?.dungeonConsecutiveLossesBeforeReset) || 2);
      if ((Number(autoDungeonState.consecutiveLosses) || 0) >= threshold) {
        releaseAutomationNavigation("dungeon");
        stopAutoDungeonTimer();
        autoDungeonState.pendingRunReset = true;
        autoDungeonState.phase = "resetting";
        autoDungeonState.error = `Dungeon loss limit reached: ${autoDungeonState.consecutiveLosses} consecutive loss(es) against ${completedOpponentLabel}; resetting the run.`;
        await saveAutoDungeonState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("dungeon-loss-streak-reset-required", {
          reportId: id, outcome: report.outcome, opponentKey: autoDungeonState.lossStreakOpponentKey,
          opponentLabel: completedOpponentLabel, consecutiveLosses: autoDungeonState.consecutiveLosses, threshold
        });
        scheduleAutoCombatResume(0, "dungeon-loss-streak-reset");
        return;
      }
      autoDungeonState.phase = "waiting-cooldown";
      autoDungeonState.error = `Dungeon loss against ${completedOpponentLabel}; continuing after loss ${autoDungeonState.consecutiveLosses}/${threshold}.`;
      const lossCooldownMs = readGlobalDungeonCooldownMs();
      setModuleReadiness("dungeon", Number.isFinite(lossCooldownMs) ? lossCooldownMs : null);
      await saveAutoDungeonState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("dungeon-loss-nonterminal", {
        reportId: id, outcome: report.outcome, opponentKey: autoDungeonState.lossStreakOpponentKey,
        opponentLabel: completedOpponentLabel, consecutiveLosses: autoDungeonState.consecutiveLosses, threshold,
        cooldownMs: Number.isFinite(lossCooldownMs) ? lossCooldownMs : null
      });
      await completeAutoCombatModule("dungeon");
      return;
    }
    // Any successful Dungeon battle breaks the consecutive-loss streak.
    autoDungeonState.lossStreakOpponentKey = null;
    autoDungeonState.lossStreakOpponentLabel = "";
    autoDungeonState.consecutiveLosses = 0;
    autoDungeonState.pendingRunReset = false;
    if (completedKind === "boss") {
      // A successful Boss ends the current Dungeon instance, but it does not
      // end Auto Dungeon. The automation should immediately cycle into a new
      // Dungeon run rather than disabling the module. Losses against the
      // same opponent are the only run-reset condition configured for normal
      // combat failures.
      const previousRunBattles = autoDungeonState.completedBattles;
      releaseAutomationNavigation("dungeon");
      stopAutoDungeonTimer();
      autoDungeonState.dungeonId = null;
      autoDungeonState.dungeonName = "";
      autoDungeonState.completedBattles = 0;
      autoDungeonState.runComplete = false;
      autoDungeonState.pendingEncounterKind = null;
      autoDungeonState.pendingEncounterLabel = "";
      autoDungeonState.pendingOpponentKey = null;
      autoDungeonState.pendingReportId = null;
      autoDungeonState.noEncounterSince = null;
      autoDungeonState.lossStreakOpponentKey = null;
      autoDungeonState.lossStreakOpponentLabel = "";
      autoDungeonState.consecutiveLosses = 0;
      autoDungeonState.pendingRunReset = false;
      autoDungeonState.readiness = "unknown";
      autoDungeonState.readyAt = null;
      autoDungeonState.phase = "waiting-map";
      autoDungeonState.error = "Dungeon Boss defeated; starting a new Dungeon run.";
      await saveAutoDungeonState();
      renderAutoCombatUI();
      if (statusEl) statusEl.textContent = "Auto Dungeon: Boss defeated; starting a new run.";
      logAutoCombatDiagnostic("dungeon-run-cycle", {
        reason: "boss-report-captured",
        reportId: id,
        previousRunBattles,
        nextAction: "start-new-dungeon-run",
        terminalRun: false,
        schedulerExcluded: false
      });
      scheduleAutoCombatResume(0, "dungeon-boss-new-run");
      return;
    }
    // A normal Dungeon battle places only the Dungeon module on its own
    // global cooldown. The dispatcher must immediately reconsider the other
    // enabled modules instead of waiting for the Dungeon cooldown. The
    // Dungeon remains marked as cooling and is re-selected automatically when
    // its own cooldown expires.
    autoDungeonState.phase = "waiting-cooldown";
    autoDungeonState.error = "Dungeon attack is cooling down; scheduler will run other ready modules.";
    const dungeonCooldownMs = readGlobalDungeonCooldownMs();
    setModuleReadiness("dungeon", Number.isFinite(dungeonCooldownMs) ? dungeonCooldownMs : null);
    await saveAutoDungeonState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("dungeon-post-report-handoff", {
      reportId: id,
      completedBattles: autoDungeonState.completedBattles,
      dungeonCooldownMs: Number.isFinite(dungeonCooldownMs) ? dungeonCooldownMs : null,
      action: "scheduler-recheck-other-modules"
    });
    await completeAutoCombatModule("dungeon");
  }

  async function resumeAutoDungeon({ allowBusy = false } = {}) {
    if ((autoDungeonBusy && !allowBusy) || !autoDungeonState?.enabled) return;
    logAutoCombatDiagnostic("dungeon-resume", { reason: allowBusy ? "scheduler" : "direct", phase: autoDungeonState.phase || null });

    if (isCombatReportPage() && dungeonReportDetection().isDungeon) {
      const lootResult = await handlePostBattleLootSearch("dungeon");
      if (lootResult.detected) return;
      logAutoCombatDiagnostic("dungeon-report-detected", { reportId: reportIdFromUrl(), pendingEncounterKind: autoDungeonState.pendingEncounterKind || null });
      dungeonReportWaitStartedAt ||= Date.now();
      const reportId = reportIdFromUrl();
      const result = await captureDungeonCombatReport().catch(error => ({ captured: false, reason: "capture-error", error: error?.message || String(error) }));
      logAutoCombatDiagnostic("dungeon-report-capture-result", result);
      if ((result?.captured || result?.reason === "already-captured") && reportId) {
        if (String(reportId) !== String(autoDungeonState.lastReportId || "")) {
          await markAutoDungeonBattleComplete(reportId, result.report || null);
        } else if (autoDungeonState?.enabled) {
          // Passive capture may already have completed this report. Hand the
          // report page back to the global scheduler instead of re-running a
          // Dungeon-only cooldown wait while the report remains current.
          dungeonReportWaitStartedAt = 0;
          autoDungeonState.phase = "waiting-cooldown";
          autoDungeonState.error = "Dungeon report already completed; scheduler will continue with other ready modules.";
          const dungeonCooldownMs = readGlobalDungeonCooldownMs();
          setModuleReadiness("dungeon", Number.isFinite(dungeonCooldownMs) ? dungeonCooldownMs : null);
          await saveAutoDungeonState();
          renderAutoCombatUI();
          logAutoCombatDiagnostic("dungeon-report-already-completed-handoff", {
            reportId,
            dungeonCooldownMs: Number.isFinite(dungeonCooldownMs) ? dungeonCooldownMs : null,
            action: "scheduler-recheck-other-modules"
          });
          await completeAutoCombatModule("dungeon");
        }
        return;
      }
      if (Date.now() - dungeonReportWaitStartedAt > 15000) {
        autoDungeonState.enabled = false;
        autoDungeonState.phase = "error";
        autoDungeonState.error = "Dungeon combat report capture timed out after 15 seconds.";
        dungeonReportWaitStartedAt = 0;
        await saveAutoDungeonState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("dungeon-error", { error: autoDungeonState.error });
        return;
      }
      autoDungeonState.phase = "waiting-report";
      autoDungeonState.error = result?.reason === "report-not-ready" ? "Waiting briefly for the dungeon battle report to finish loading." : "Capturing dungeon combat report.";
      await saveAutoDungeonState();
      renderAutoCombatUI();
      scheduleAutoCombatResume(350, "dungeon-report-capture-retry");
      return;
    }

    if (!isDungeonPage() || String(dungeonLocationIdFromUrl()) !== String(autoDungeonState.locationId)) {
      autoDungeonState.phase = "navigating";
      autoDungeonState.error = `Opening ${autoDungeonState.locationName || DUNGEON_LOCATION_NAME}.`;
      await saveAutoDungeonState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("dungeon-navigation-needed", { currentLocationId: dungeonLocationIdFromUrl(), targetLocationId: autoDungeonState.locationId });
      const opened = await navigateToDungeon();
      if (opened && autoDungeonState.enabled) scheduleAutoCombatResume(50, "dungeon-page-ready");
      return;
    }

    if (autoDungeonState.pendingRunReset) {
      if (await processPendingDungeonRunReset()) return;
    }

    const pageState = dungeonPageStateSnapshot();
    autoDungeonState.dungeonId = pageState.dungeonId || autoDungeonState.dungeonId;
    autoDungeonState.dungeonName = pageState.dungeonName || autoDungeonState.dungeonName || DUNGEON_LOCATION_NAME;
    logAutoCombatDiagnostic("dungeon-page-state", pageState);
    const entry = dungeonEntryState();
    logAutoCombatDiagnostic("dungeon-entry-state", entry);

    // Dungeon has a global action cooldown that applies after every fight.
    // Dungeon points are a separate resource and must not be used as a proxy
    // for this cooldown. Never start or attack another encounter while the
    // global Dungeon cooldown is active, even when the scheduler is resuming
    // an in-flight navigation continuation.
    const globalDungeonCooldownMs = readGlobalDungeonCooldownMs();
    if (Number.isFinite(globalDungeonCooldownMs) && globalDungeonCooldownMs > 0) {
      autoDungeonState.phase = "waiting-cooldown";
      autoDungeonState.error = `Waiting for Dungeon availability · ${formatExpeditionCooldown(globalDungeonCooldownMs)}.`;
      setModuleReadiness("dungeon", globalDungeonCooldownMs);
      await saveAutoDungeonState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("dungeon-global-cooldown-wait", {
        cooldownMs: globalDungeonCooldownMs,
        raw: normalize(document.querySelector("#cooldown_bar_text_dungeon")?.textContent || ""),
        points: pageState.points || null
      });
      scheduleAutoCombatResume(Math.max(25, globalDungeonCooldownMs + 25), "dungeon-global-cooldown-wait");
      return;
    }

    if (!pageState.dungeonId && entry.available) {
      autoDungeonState.phase = "entering";
      autoDungeonState.error = `Starting a new ${autoDungeonState.locationName || DUNGEON_LOCATION_NAME} dungeon on Normal difficulty.`;
      autoDungeonState.pendingEncounterKind = null;
      autoDungeonState.pendingEncounterLabel = "";
      autoDungeonState.pendingReportId = null;
      autoDungeonState.noEncounterSince = null;
      setModuleReadiness("dungeon", null);
      await saveAutoDungeonState();
      renderAutoCombatUI();
      const options = dungeonEntryOptions();
      const button = options.find(option => option.difficultyKey === "dif1")?.button || options.find(option => /normal/i.test(option.difficultyLabel || ""))?.button || null;
      if (!button) {
        autoDungeonState.phase = "checking";
        autoDungeonState.error = "Dungeon entry became unavailable before the Normal button could be clicked; retrying.";
        await saveAutoDungeonState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(500, "dungeon-entry-button-retry");
        return;
      }
      logAutoCombatDiagnostic("dungeon-entry-click-start", { locationId: autoDungeonState.locationId, locationName: autoDungeonState.locationName, difficulty: entry.difficulty });
      const clicked = await humanizedClick(button, "dungeon-entry");
      logAutoCombatDiagnostic("dungeon-entry-click-result", { clicked, locationId: autoDungeonState.locationId, difficulty: entry.difficulty });
      if (clicked) {
        autoDungeonState.phase = "waiting-map";
        autoDungeonState.error = `Waiting for the ${autoDungeonState.locationName || DUNGEON_LOCATION_NAME} dungeon map to initialize.`;
        await saveAutoDungeonState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(750, "dungeon-entry-map-wait");
      } else {
        autoDungeonState.phase = "checking";
        autoDungeonState.error = "Dungeon entry control disappeared before the click could be performed; retrying.";
        await saveAutoDungeonState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(500, "dungeon-entry-click-retry");
      }
      return;
    }

    const points = pageState.points?.current;
    if (!(Number(points) > 0)) {
      const cooldownMs = dungeonPointCooldownMs();
      autoDungeonState.phase = "waiting-cooldown";
      autoDungeonState.error = Number.isFinite(cooldownMs) ? `Waiting for next dungeon point · ${formatExpeditionCooldown(cooldownMs)}.` : "Dungeon points are unavailable; waiting for the dungeon point counter.";
      setModuleReadiness("dungeon", cooldownMs);
      await saveAutoDungeonState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("dungeon-no-points", { points, pointCooldownMs: cooldownMs });
      scheduleAutoCombatResume(Number.isFinite(cooldownMs) ? Math.max(25, cooldownMs + 25) : 1000, "dungeon-point-wait");
      return;
    }

    const candidates = dungeonFightCandidates();
    const bossTarget = candidates.find(item => item.kind === "boss") || null;
    const target = bossTarget || candidates.find(item => item.kind === "normal") || null;
    logAutoCombatDiagnostic("dungeon-target-selection", {
      selected: target ? { type: target.type, dungeonId: target.dungeonId, label: target.label, kind: target.kind } : null,
      logicalCandidateCount: candidates.length,
      candidateCount: candidates.length,
      normalCandidateCount: candidates.filter(item => item.kind === "normal").length,
      bossCandidateCount: candidates.filter(item => item.kind === "boss").length,
      unknownCandidateCount: candidates.filter(item => item.kind === "unknown").length,
      candidates: candidates.map(item => ({ type: item.type, dungeonId: item.dungeonId, label: item.label, kind: item.kind })),
      questConditionsFulfilled: dungeonQuestConditionsFulfilled()
    });
    if (await resetDungeonBeforeBoss(candidates, bossTarget)) return;

    if (!target) {
      autoDungeonState.noEncounterSince ||= Date.now();
      const elapsed = Date.now() - autoDungeonState.noEncounterSince;
      autoDungeonState.phase = "checking";
      autoDungeonState.error = dungeonQuestConditionsFulfilled() ? "All dungeon quest conditions are fulfilled and no active fight node is exposed; waiting for the map to settle." : "No active dungeon fight node is exposed yet; waiting for the live map to update.";
      await saveAutoDungeonState();
      renderAutoCombatUI();
      if (elapsed > 15000) {
        autoDungeonState.enabled = false;
        autoDungeonState.phase = "error";
        autoDungeonState.error = "No active Dungeon fight node appeared within 15 seconds.";
        await saveAutoDungeonState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("dungeon-error", { error: autoDungeonState.error, pageState });
        return;
      }
      scheduleAutoCombatResume(350, "dungeon-map-update-wait");
      return;
    }

    autoDungeonState.noEncounterSince = null;
    autoDungeonState.pendingEncounterKind = target.kind;
    autoDungeonState.pendingEncounterLabel = target.label;
    autoDungeonState.pendingOpponentKey = normalize(target.label || `type:${target.type}`) || `type:${target.type}`;
    autoDungeonState.pendingReportId = null;
    autoDungeonState.phase = "humanizing";
    autoDungeonState.error = null;
    setModuleReadiness("dungeon", null);
    await saveAutoDungeonState();
    renderAutoCombatUI();
    const context = target.kind === "boss" ? "dungeon-boss" : "dungeon-encounter";
    logAutoCombatDiagnostic("dungeon-click-fight-start", { context, type: target.type, dungeonId: target.dungeonId, label: target.label, kind: target.kind });
    dungeonReportWaitStartedAt = Date.now();
    const clicked = await humanizedClick(target.node, context, { beforeClick: () => ensureAutoCombatHpSafety("dungeon", "fight-click") });
    logAutoCombatDiagnostic("dungeon-click-fight-result", { clicked, kind: target.kind, label: target.label });
    if (!clicked || !autoDungeonState?.enabled) {
      if (autoHealingState?.active) {
        autoDungeonState.phase = "queued";
        autoDungeonState.error = "HP is below the configured threshold; healing before the Dungeon battle.";
        await saveAutoDungeonState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(0, "dungeon-waiting-healing");
        return;
      }
      autoDungeonState.phase = "checking";
      autoDungeonState.error = "Dungeon fight control disappeared before the click could be performed; retrying.";
      await saveAutoDungeonState();
      renderAutoCombatUI();
      scheduleAutoCombatResume(500, "dungeon-click-retry");
      return;
    }
    autoDungeonState.phase = "waiting-report";
    autoDungeonState.pendingReportId = null;
    await saveAutoDungeonState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("dungeon-action-fired", { kind: target.kind, label: target.label });
  }

  async function loadAutoExpeditionState() {
    try {
      const result = await storageGet(autoExpeditionKey());
      const stored = result?.[autoExpeditionKey()];
      if (stored && typeof stored === "object") {
        autoExpeditionState = {
          enabled: !!stored.enabled,
          countryKey: stored.countryKey ? String(stored.countryKey) : null,
          countryName: normalize(stored.countryName || ""),
          locationId: stored.locationId != null ? String(stored.locationId) : null,
          locationName: normalize(stored.locationName || ""),
          targetId: Number.isFinite(Number(stored.targetId)) ? Number(stored.targetId) : null,
          targetName: normalize(stored.targetName || ""),
          maxRuns: Math.max(1, Math.min(AUTO_EXPEDITION_MAX_RUNS, Number(stored.maxRuns) || 100)),
          completedRuns: Math.max(0, Number(stored.completedRuns) || 0),
          lastReportId: stored.lastReportId ? String(stored.lastReportId) : null,
          cooldownUntil: Number.isFinite(Number(stored.cooldownUntil)) ? Number(stored.cooldownUntil) : null,
          lastKnownCooldownMs: Number.isFinite(Number(stored.lastKnownCooldownMs)) ? Number(stored.lastKnownCooldownMs) : null,
          readiness: stored.readiness === "ready" || stored.readiness === "cooling" ? stored.readiness : "unknown",
          readyAt: Number.isFinite(Number(stored.readyAt)) ? Number(stored.readyAt) : null,
          phase: stored.phase || "stopped",
          startedAt: stored.startedAt || null,
          error: stored.error || null
        };
        return autoExpeditionState;
      }
    } catch (_) {}
    autoExpeditionState = {
      enabled: false,
      countryKey: null,
      countryName: "",
      locationId: null,
      locationName: "",
      targetId: null,
      targetName: "",
      maxRuns: 100,
      completedRuns: 0,
      lastReportId: null,
      cooldownUntil: null,
      lastKnownCooldownMs: null,
      readiness: "unknown",
      readyAt: null,
      phase: "stopped",
      startedAt: null,
      error: null
    };
    return autoExpeditionState;
  }

  async function saveAutoExpeditionState() {
    if (!autoExpeditionState) return;
    try { await storageSet({ [autoExpeditionKey()]: autoExpeditionState }); } catch (_) {}
  }

  function stopAutoExpeditionTimer() {
    if (autoExpeditionTimer) { clearTimeout(autoExpeditionTimer); autoExpeditionTimer = null; }
  }

  function currentExpeditionLocationName() {
    const id = currentExpeditionLocationId();
    if (id == null) return "";
    return normalize(currentExpeditionMenuLocations().find(row => String(row.locationId) === String(id))?.name || "");
  }

  function findServerGeneratedGameLink(matchFn) {
    if (typeof matchFn !== "function") return null;
    const anchors = [...document.querySelectorAll("a[href]")];
    for (const anchor of anchors) {
      try {
        const href = anchor.href || anchor.getAttribute("href");
        if (!href) continue;
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) continue;
        if (matchFn(url, anchor)) return anchor;
      } catch (_) {}
    }
    return null;
  }

  function countryMapLink() {
    return findServerGeneratedGameLink((url) =>
      url.searchParams.get("mod") === "map" &&
      url.searchParams.get("submod") === "country"
    );
  }

  function selectedLocationLink(locationId) {
    const expectedLocationId = String(locationId);
    if (!expectedLocationId) return null;
    const expectedName = normalizeExpeditionLocationName(autoExpeditionState?.locationName || "");
    const candidates = [
      ...document.querySelectorAll(".map_clickareas a.map_link[href*='mod=location'][href*='loc='], #submenu2 a[href*='mod=location'][href*='loc=']"),
      ...document.querySelectorAll("a[href*='mod=location'][href*='loc=']")
    ];
    const seen = new Set();

    for (const anchor of candidates) {
      if (seen.has(anchor)) continue;
      seen.add(anchor);
      try {
        const href = anchor.href || anchor.getAttribute("href");
        if (!href) continue;
        const url = new URL(href, location.href);
        if (url.origin !== location.origin) continue;
        if (url.searchParams.get("mod") !== "location") continue;
        if (url.searchParams.get("loc") !== expectedLocationId) continue;

        const anchorName = normalizeExpeditionLocationName(
          anchor.getAttribute("title") || anchor.getAttribute("alt") || anchor.textContent || ""
        );
        if (expectedName && anchorName && expectedName !== anchorName) continue;
        return anchor;
      } catch (_) {}
    }
    return null;
  }

  function setModuleReadiness(module, cooldownMs) {
    const state = autoCombatModuleState(module);
    if (!state) return "unknown";
    const ms = Number(cooldownMs);
    if (!Number.isFinite(ms) || ms < 0) {
      state.readiness = "unknown";
      state.readyAt = null;
      if (module === "expedition") {
        state.cooldownUntil = null;
        state.lastKnownCooldownMs = null;
      }
      return state.readiness;
    }
    if (ms <= 0) {
      state.readiness = "ready";
      state.readyAt = Date.now();
      if (module === "expedition") {
        state.cooldownUntil = state.readyAt;
        state.lastKnownCooldownMs = 0;
      }
    } else {
      state.readiness = "cooling";
      state.readyAt = Date.now() + ms;
      if (module === "expedition") {
        state.cooldownUntil = state.readyAt;
        state.lastKnownCooldownMs = ms;
      }
    }
    return state.readiness;
  }

  function moduleReadinessLabel(module) {
    const state = autoCombatModuleState(module);
    if (!state) return "UNKNOWN";
    if (state.readiness === "cooling") {
      const remaining = Math.max(0, Number(state.readyAt || 0) - Date.now());
      if (remaining <= 0) {
        state.readiness = "ready";
        state.readyAt = Date.now();
      }
    }
    if (state.readiness === "ready") return "READY";
    if (state.readiness === "cooling") return `COOLING · ${formatExpeditionCooldown(Math.max(0, Number(state.readyAt || 0) - Date.now()))}`;
    return "UNKNOWN";
  }


  function autoCombatDiagnosticSnapshot() {
    const safeRead = (fn) => { try { return fn(); } catch (error) { return `ERROR: ${error?.message || String(error)}`; } };
    const expeditionRaw = safeRead(() => normalize(document.querySelector("#cooldown_bar_text_expedition")?.textContent || ""));
    const dungeonRaw = safeRead(() => normalize(document.querySelector("#cooldown_bar_text_dungeon")?.textContent || ""));
    const arenaRaw = safeRead(() => normalize(document.querySelector("#cooldown_bar_text_arena")?.textContent || ""));
    const provinRaw = safeRead(() => normalize(document.querySelector("#cooldown_bar_text_ct")?.textContent || ""));
    const snapshot = {
      at: new Date().toISOString(),
      url: location.href,
      pathname: location.pathname,
      pageBodyId: document.body?.id || "",
      page: {
        arenaPage: safeRead(() => isProvinciarumArenaPage()),
        expeditionPage: safeRead(() => isExpeditionLocationPage()),
        dungeonPage: safeRead(() => isDungeonPage()),
        combatReport: safeRead(() => isCombatReportPage()),
        combatReportType: safeRead(() => combatReportTypeFromUrl()),
        arenaReport: safeRead(() => isCombatReportPage() && arenaReportDetection().isArena),
        provinciarumPage: safeRead(() => isCircusProvinciarumPage()),
        circusReport: safeRead(() => isCombatReportPage() && circusReportDetection().isCircus),
        dungeonReport: safeRead(() => isCombatReportPage() && dungeonReportDetection().isDungeon),
        expeditionReport: safeRead(() => isCombatReportPage() && expeditionReportDetection().isExpedition)
      },
      globalCooldowns: {
        arenaRaw,
        arenaMs: arenaCooldownMs(),
        provinciarumRaw: provinRaw,
        provinciarumMs: circusProvinciarumCooldownMs(),
        dungeonRaw,
        dungeonMs: readGlobalDungeonCooldownMs(),
        expeditionRaw,
        expeditionMs: parseExpeditionCooldownMs(expeditionRaw)
      },
      dispatcher: {
        busy: !!autoCombatSchedulerBusy,
        timerActive: !!autoCombatSchedulerTimer,
        lastModule: autoCombatDispatcherState.lastModule || null,
        configuredRoutine: Array.isArray(settings?.routine) ? [...settings.routine] : [],
        effectiveOrder: safeRead(() => autoCombatDispatchOrder(autoCombatEnabledModules())),
        navigationOwner: automationNavigationOwner || null
      },
      arena: arenaAutomationState ? {
        enabled: !!arenaAutomationState.enabled,
        phase: arenaAutomationState.phase || null,
        readiness: arenaAutomationState.readiness || null,
        readyAt: arenaAutomationState.readyAt || null,
        completedRuns: arenaAutomationState.completedRuns || 0,
        maxRuns: arenaAutomationState.maxRuns || 0,
        pendingTargetKey: arenaAutomationState.pendingTargetKey || null,
        pendingTargetName: arenaAutomationState.pendingTargetName || "",
        opponentSearches: arenaAutomationState.opponentSearches || 0,
        bestObservedWinRate: Number.isFinite(Number(arenaAutomationState.bestObservedWinRate)) ? Number(arenaAutomationState.bestObservedWinRate) : null,
        lastBattle: arenaAutomationState.lastBattle || null,
        error: arenaAutomationState.error || null
      } : null,
      provinciarum: circusProvinciarumAutomationState ? {
        enabled: !!circusProvinciarumAutomationState.enabled,
        phase: circusProvinciarumAutomationState.phase || null,
        readiness: circusProvinciarumAutomationState.readiness || null,
        readyAt: circusProvinciarumAutomationState.readyAt || null,
        completedRuns: circusProvinciarumAutomationState.completedRuns || 0,
        maxRuns: circusProvinciarumAutomationState.maxRuns || 0,
        pendingTargetKey: circusProvinciarumAutomationState.pendingTargetKey || null,
        pendingTargetName: circusProvinciarumAutomationState.pendingTargetName || "",
        opponentSearches: circusProvinciarumAutomationState.opponentSearches || 0,
        bestObservedWinRate: Number.isFinite(Number(circusProvinciarumAutomationState.bestObservedWinRate)) ? Number(circusProvinciarumAutomationState.bestObservedWinRate) : null,
        lastBattle: circusProvinciarumAutomationState.lastBattle || null,
        pendingReportId: circusProvinciarumAutomationState.pendingReportId || null,
        lastProcessedReportId: circusProvinciarumAutomationState.lastProcessedReportId || null,
        reportWaitReportId: circusProvinciarumAutomationState.reportWaitReportId || null,
        reportWaitStartedAt: circusProvinciarumAutomationState.reportWaitStartedAt || null,
        reportWaitAttempts: circusProvinciarumAutomationState.reportWaitAttempts || 0,
        reportCaptureInFlight: !!combatCaptureInFlight,
        unavailableOpponents: Object.entries(circusProvinciarumAutomationState.unavailableOpponents || {}).map(([key, value]) => ({ key, name: value?.name || null, playerId: value?.playerId || null, error: value?.error || null, capturedDollIds: value?.capturedDollIds || [], retrySummary: value?.retrySummary || null })),
        error: circusProvinciarumAutomationState.error || null
      } : null,
      expedition: autoExpeditionState ? {
        enabled: !!autoExpeditionState.enabled,
        phase: autoExpeditionState.phase || null,
        readiness: autoExpeditionState.readiness || null,
        readyAt: autoExpeditionState.readyAt || null,
        completedRuns: autoExpeditionState.completedRuns || 0,
        maxRuns: autoExpeditionState.maxRuns || 0,
        countryKey: autoExpeditionState.countryKey || null,
        locationId: autoExpeditionState.locationId || null,
        locationName: autoExpeditionState.locationName || "",
        targetId: autoExpeditionState.targetId || null,
        targetName: autoExpeditionState.targetName || "",
        error: autoExpeditionState.error || null
      } : null,
      dungeon: autoDungeonState ? {
        enabled: !!autoDungeonState.enabled,
        phase: autoDungeonState.phase || null,
        readiness: autoDungeonState.readiness || null,
        readyAt: autoDungeonState.readyAt || null,
        completedBattles: autoDungeonState.completedBattles || 0,
        runComplete: !!autoDungeonState.runComplete,
        locationId: autoDungeonState.locationId || null,
        locationName: autoDungeonState.locationName || "",
        dungeonId: autoDungeonState.dungeonId || null,
        dungeonName: autoDungeonState.dungeonName || "",
        cancelBeforeBoss: !!autoDungeonState.cancelBeforeBoss,
        pendingEncounterKind: autoDungeonState.pendingEncounterKind || null,
        pendingEncounterLabel: autoDungeonState.pendingEncounterLabel || "",
        pendingReportId: autoDungeonState.pendingReportId || null,
        lastReportId: autoDungeonState.lastReportId || null,
        error: autoDungeonState.error || null,
        page: safeRead(() => dungeonPageStateSnapshot())
      } : null,
      hpSafety: {
        currentHp: safeRead(() => readLiveHpSnapshot()?.current ?? null),
        maxHp: safeRead(() => readLiveHpSnapshot()?.max ?? null),
        percent: safeRead(() => { const hp = readLiveHpSnapshot(); return hp ? hp.percent : null; }),
        thresholdPercent: currentHpThresholdPercent(),
        healingBagNumber: configuredHealingBagNumber()
      },
      healing: autoHealingState ? {
        active: !!autoHealingState.active,
        phase: autoHealingState.phase || null,
        error: autoHealingState.error || null,
        currentHp: autoHealingState.currentHp ?? null,
        maxHp: autoHealingState.maxHp ?? null,
        thresholdPercent: autoHealingState.thresholdPercent ?? null,
        bagNumber: autoHealingState.bagNumber ?? null,
        totalHeals: autoHealingState.totalHeals || 0,
        lastHeal: autoHealingState.lastHeal || null,
        plannedCount: Array.isArray(autoHealingState.selectedItems) ? autoHealingState.selectedItems.length : 0
      } : null
    };
    return snapshot;
  }

  async function loadAutoCombatDiagnostics() {
    try {
      const result = await storageGet(autoCombatDiagnosticKey());
      const stored = result?.[autoCombatDiagnosticKey()];
      if (stored && typeof stored === "object") {
        autoCombatDiagnostics = {
          schemaVersion: 1,
          updatedAt: stored.updatedAt || null,
          events: Array.isArray(stored.events) ? stored.events.slice(0, AUTO_COMBAT_DIAGNOSTIC_MAX_EVENTS) : []
        };
      }
    } catch (_) {}
    renderAutoCombatDiagnostics();
    return autoCombatDiagnostics;
  }

  async function saveAutoCombatDiagnostics() {
    try { await storageSet({ [autoCombatDiagnosticKey()]: autoCombatDiagnostics }); } catch (_) {}
  }

  function renderAutoCombatDiagnostics() {
    const el = shadow?.querySelector("#ga-auto-combat-diagnostic-text");
    if (!el) return;
    if (!autoCombatDiagnostics?.events?.length) {
      el.textContent = "No Auto Combat diagnostic events recorded yet.";
      return;
    }
    el.textContent = autoCombatDiagnostics.events.map((event, index) =>
      JSON.stringify({ index: autoCombatDiagnostics.events.length - index, ...event }, null, 2)
    ).join("\n\n");
  }

  async function appendAutoCombatDiagnostic(event, details = {}) {
    if (!diagnosticCaptureEnabled()) return false;
    const record = {
      at: new Date().toISOString(),
      event: String(event || "event"),
      details: details && typeof details === "object" ? details : { value: details },
      snapshot: autoCombatDiagnosticSnapshot()
    };
    autoCombatDiagnostics.events = [record, ...(autoCombatDiagnostics.events || [])].slice(0, AUTO_COMBAT_DIAGNOSTIC_MAX_EVENTS);
    autoCombatDiagnostics.updatedAt = record.at;
    renderAutoCombatDiagnostics();
    autoCombatDiagnosticWriteChain = autoCombatDiagnosticWriteChain.then(() => saveAutoCombatDiagnostics()).catch(() => {});
    await autoCombatDiagnosticWriteChain;
    return true;
  }

  function logAutoCombatDiagnostic(event, details = {}) {
    if (!diagnosticCaptureEnabled()) return;
    void appendAutoCombatDiagnostic(event, details);
  }

  async function clearAutoCombatDiagnostics() {
    autoCombatDiagnostics = { schemaVersion: 1, updatedAt: null, events: [] };
    try { await storageRemove(autoCombatDiagnosticKey()); } catch (_) {}
    renderAutoCombatDiagnostics();
  }

  async function copyAutoCombatDiagnostics(event) {
    const button = event?.currentTarget || shadow?.querySelector("#ga-copy-auto-combat-diagnostics");
    await copyTextWithButton(JSON.stringify(autoCombatDiagnostics, null, 2), button, "Copy diagnostics");
  }

  function currentCountryFromPageOrSaved() {
    const detected = detectCurrentExpeditionCountry();
    if (detected) return { ...detected, source: "page-menu" };
    const savedKey = autoExpeditionState?.countryKey ? String(autoExpeditionState.countryKey) : "";
    const savedCountry = savedKey ? EXPEDITION_COUNTRIES[savedKey] : null;
    return savedCountry ? {
      countryKey: savedKey,
      countryName: savedCountry.name,
      matched: 0,
      menuLocations: [],
      source: "saved-state"
    } : null;
  }

  function expeditionTargetCatalog(countryKey) {
    const country = EXPEDITION_COUNTRIES[countryKey];
    const fightMap = EXPEDITION_FIGHTS[countryKey];
    if (!country || !fightMap) return [];
    const rows = [];
    for (const [locationId, locationName] of country.locations) {
      const fights = Array.isArray(fightMap[String(locationId)]) ? fightMap[String(locationId)] : [];
      fights.forEach((name, index) => {
        rows.push({
          countryKey,
          countryName: country.name,
          locationId: String(locationId),
          locationName,
          targetId: index + 1,
          targetName: name,
          boss: index === 3,
          value: `${locationId}|${index + 1}`
        });
      });
    }
    return rows;
  }

  function expeditionTargetCatalogEntry(countryKey, value) {
    const normalized = String(value || "");
    return expeditionTargetCatalog(countryKey).find(row => row.value === normalized) || null;
  }

  function renderAutoExpeditionUI() {
    const root = shadow?.querySelector("#ga-auto-expedition");
    if (!root) return;
    const detectedCountry = currentCountryFromPageOrSaved();
    const state = autoExpeditionState || {
      enabled: false, countryKey: null, countryName: "", locationId: null, locationName: "",
      targetId: null, targetName: "", maxRuns: 100, completedRuns: 0, phase: "stopped", error: null
    };
    const countryKey = detectedCountry?.countryKey || state.countryKey || null;
    const catalog = countryKey ? expeditionTargetCatalog(countryKey) : [];
    const currentValue = state.locationId != null && state.targetId != null
      ? `${state.locationId}|${state.targetId}`
      : "";
    const selectedExists = !!catalog.find(row => row.value === currentValue);
    const targetOptions = catalog.length
      ? catalog.map(row => `<option value="${esc(row.value)}"${selectedExists && row.value === currentValue ? " selected" : ""}>${esc(row.locationName)} — ${esc(row.targetName)}${row.boss ? " (Boss)" : ""}</option>`).join("")
      : `<option value="">${countryKey ? "No expedition targets known for this country" : "Current country could not be detected"}</option>`;
    const canStart = !state.enabled && catalog.length > 0 && !!countryKey && !!root.querySelector("#ga-auto-expedition-target")?.value;
    const detectedLabel = detectedCountry?.countryName || state.countryName || "Unknown";
    root.innerHTML = `
      <div class="ga-card-head">
        <div><h2>Auto Expedition</h2><div class="ga-muted">Development-only data collection. Targets come from the known expedition dataset; availability is verified on the live expedition page before attacking.</div></div>
        <div class="ga-statusline" id="ga-auto-expedition-status">${esc(autoExpeditionStatusText())}</div>
      </div>
      <div class="ga-auto-expedition-grid">
        <label><span>Target</span><select id="ga-auto-expedition-target" ${state.enabled ? "disabled" : ""}>${targetOptions}</select></label>
        <label><span>Runs</span><input id="ga-auto-expedition-runs" type="number" min="1" max="${AUTO_EXPEDITION_MAX_RUNS}" value="${esc(String(state.maxRuns || 100))}" ${state.enabled ? "disabled" : ""}></label>
      </div>
      <div class="ga-muted" style="margin-top:6px">Detected country: ${esc(detectedLabel)}${state.locationName && state.targetName ? ` · Saved target: ${esc(state.locationName)} — ${esc(state.targetName)}` : ""}</div>
      <div class="ga-actions-row" style="margin-top:7px">
        <button class="ga-primary" id="ga-auto-expedition-start" type="button" ${canStart ? "" : "disabled"}>Start</button>
        <button class="ga-secondary" id="ga-auto-expedition-stop" type="button" ${state.enabled ? "" : "disabled"}>Stop</button>
        <button class="ga-secondary" id="ga-auto-expedition-refresh" type="button">Refresh targets</button>
      </div>
      ${state.enabled ? `<div class="ga-muted" style="margin-top:6px">Progress: ${state.completedRuns || 0}/${state.maxRuns || 0}${state.locationName ? ` · ${esc(state.locationName)}` : ""}</div>` : ""}`;

    const targetSelect = root.querySelector("#ga-auto-expedition-target");
    if (targetSelect && selectedExists) targetSelect.value = currentValue;
    targetSelect?.addEventListener("change", async event => {
      if (!autoExpeditionState) await loadAutoExpeditionState();
      const detected = currentCountryFromPageOrSaved();
      const match = detected ? expeditionTargetCatalogEntry(detected.countryKey, event.target.value) : null;
      if (!match || !detected) return;
      autoExpeditionState.countryKey = detected.countryKey;
      autoExpeditionState.countryName = detected.countryName;
      autoExpeditionState.locationId = String(match.locationId);
      autoExpeditionState.locationName = match.locationName;
      autoExpeditionState.targetId = Number(match.targetId);
      autoExpeditionState.targetName = match.targetName;
      autoExpeditionState.error = null;
      await saveAutoExpeditionState();
      renderAutoCombatUI();
    });

    const runsInput = root.querySelector("#ga-auto-expedition-runs");
    const startButton = root.querySelector("#ga-auto-expedition-start");
    const stopButton = root.querySelector("#ga-auto-expedition-stop");
    const refreshButton = root.querySelector("#ga-auto-expedition-refresh");
    startButton?.addEventListener("click", startAutoExpedition);
    stopButton?.addEventListener("click", stopAutoExpedition);
    refreshButton?.addEventListener("click", () => renderAutoExpeditionUI());
    runsInput?.addEventListener("change", async event => {
      if (!autoExpeditionState || autoExpeditionState.enabled) return;
      const value = Math.max(1, Math.min(AUTO_EXPEDITION_MAX_RUNS, Number(event.target.value) || 100));
      autoExpeditionState.maxRuns = value;
      await saveAutoExpeditionState();
      renderAutoCombatUI();
    });
  }

  async function navigateToSelectedExpeditionLocation() {
    if (!autoExpeditionState?.locationId) return false;
    if (!beginAutomationNavigation("expedition")) {
      logAutoCombatDiagnostic("expedition-navigation-blocked", { owner: automationNavigationOwner });
      autoExpeditionState.phase = "queued";
      autoExpeditionState.error = "Navigation is owned by the active combat job; this job remains queued.";
      await saveAutoExpeditionState();
      renderAutoCombatUI();
      return false;
    }
    const currentLoc = currentExpeditionLocationId();
    if (isExpeditionLocationPage() && String(currentLoc) === String(autoExpeditionState.locationId)) {
      releaseAutomationNavigation("expedition");
      return true;
    }

    let link = selectedLocationLink(autoExpeditionState.locationId);
    let usedCountryMapFallback = false;
    if (!link) {
      // Some report pages expose the country-map link but not the expedition
      // location links themselves. This fallback is only reached after the
      // cooldown has been established as ready, so entering the map cannot
      // cause a cooldown-time navigation.
      link = countryMapLink();
      usedCountryMapFallback = !!link;
    }
    if (!link) {
      logAutoCombatDiagnostic("expedition-navigation-link-missing", { locationId: autoExpeditionState.locationId, locationName: autoExpeditionState.locationName });
      releaseAutomationNavigation("expedition");
      autoExpeditionState.enabled = false;
      autoExpeditionState.phase = "error";
      autoExpeditionState.error = `Server-provided navigation for ${autoExpeditionState.locationName || `location ${autoExpeditionState.locationId}`} is not present; navigation was not attempted.`;
      await saveAutoExpeditionState();
      renderAutoCombatUI();
      return false;
    }

    stopAutoExpeditionTimer();
    autoExpeditionState.phase = "navigating";
    autoExpeditionState.error = usedCountryMapFallback
      ? "Opening the server-provided country map link before selecting the expedition location."
      : "Opening server-provided expedition location link.";
    await saveAutoExpeditionState();
    logAutoCombatDiagnostic("expedition-navigation-click-start", { href: link.href || link.getAttribute("href") || null, usedCountryMapFallback });
    const clicked = await humanizedClick(link, usedCountryMapFallback ? "expedition-country-map-navigation" : "expedition-location-navigation");
    logAutoCombatDiagnostic("expedition-navigation-click-result", { clicked, href: link.href || link.getAttribute("href") || null, usedCountryMapFallback });
    if (!clicked) {
      releaseAutomationNavigation("expedition");
      autoExpeditionState.phase = "checking";
      autoExpeditionState.error = "Expedition navigation control disappeared before the click could be performed; retrying.";
      await saveAutoExpeditionState();
      renderAutoCombatUI();
      scheduleAutoCombatResume(500, "expedition-navigation-click-retry");
    }
    return false;
  }

  async function stopAutoExpedition() {
    expeditionReportWaitStartedAt = 0;
    stopAutoExpeditionTimer();
    releaseAutomationNavigation("expedition");
    if (!autoExpeditionState) await loadAutoExpeditionState();
    autoExpeditionState.enabled = false;
    autoExpeditionState.phase = "stopped";
    autoExpeditionState.error = null;
    autoExpeditionState.readiness = "unknown";
    autoExpeditionState.readyAt = null;
    autoExpeditionState.cooldownUntil = null;
    await saveAutoExpeditionState();
    renderAutoCombatUI();
    if (!autoCombatEnabledModules().length) { stopAutoCombatDispatcherTimer(); stopAutoCombatCooldownObserver(); }
    else scheduleAutoCombatResume(0, "expedition-stopped-handoff");
    if (statusEl) statusEl.textContent = "Auto Expedition stopped.";
  }

  async function startAutoExpedition({ deferScheduler = false } = {}) {
    if (autoExpeditionBusy) return;
    expeditionReportWaitStartedAt = 0;
    autoExpeditionBusy = true;
    try {
      if (!autoExpeditionState) await loadAutoExpeditionState();
      const detectedCountry = currentCountryFromPageOrSaved();
      if (!detectedCountry) {
        autoExpeditionState.error = "Current country could not be detected.";
        await saveAutoExpeditionState();
        renderAutoCombatUI();
        return;
      }

      const targetSelect = shadow?.querySelector("#ga-auto-expedition-target");
      const selectedValue = targetSelect?.value || "";
      const selectedTarget = expeditionTargetCatalogEntry(detectedCountry.countryKey, selectedValue);
      if (!selectedTarget) {
        autoExpeditionState.error = "Selected expedition target is not available in the detected country dataset.";
        await saveAutoExpeditionState();
        renderAutoCombatUI();
        return;
      }

      autoExpeditionState.countryKey = detectedCountry.countryKey;
      autoExpeditionState.countryName = detectedCountry.countryName;
      autoExpeditionState.locationId = String(selectedTarget.locationId);
      autoExpeditionState.locationName = selectedTarget.locationName;
      autoExpeditionState.targetId = Number(selectedTarget.targetId);
      autoExpeditionState.targetName = selectedTarget.targetName;

      const runsInput = shadow?.querySelector("#ga-auto-expedition-runs");
      const maxRuns = Math.max(1, Math.min(AUTO_EXPEDITION_MAX_RUNS, Number(runsInput?.value) || autoExpeditionState.maxRuns || 100));
      autoExpeditionState.enabled = true;
      autoExpeditionState.phase = "starting";
      autoExpeditionState.maxRuns = maxRuns;
      autoExpeditionState.completedRuns = 0;
      autoExpeditionState.lastReportId = null;
        autoExpeditionState.cooldownUntil = null;
      autoExpeditionState.lastKnownCooldownMs = null;
      autoExpeditionState.readiness = "unknown";
      autoExpeditionState.readyAt = null;
      autoExpeditionState.error = null;
      autoExpeditionState.startedAt = new Date().toISOString();
      await saveAutoExpeditionState();
      renderAutoCombatUI();
      ensureAutoCombatCooldownObserver();
      if (!deferScheduler) scheduleAutoCombatResume(250);
    } finally {
      autoExpeditionBusy = false;
    }
  }

  async function markAutoExpeditionRunComplete(reportId) {
    if (!autoExpeditionState?.enabled) return;
    expeditionReportWaitStartedAt = 0;
    const id = reportId ? String(reportId) : null;
    if (!id || id === autoExpeditionState.lastReportId) return;
    autoExpeditionState.lastReportId = id;
    postBattleLootLifecycle.expedition = null;
    autoExpeditionState.completedRuns = Math.min(autoExpeditionState.maxRuns, (Number(autoExpeditionState.completedRuns) || 0) + 1);
    if (autoExpeditionState.completedRuns >= autoExpeditionState.maxRuns) {
      releaseAutomationNavigation("expedition");
      stopAutoExpeditionTimer();
      autoExpeditionState.enabled = false;
      autoExpeditionState.phase = "complete";
      await saveAutoExpeditionState();
      renderAutoCombatUI();
      if (statusEl) statusEl.textContent = `Auto Expedition complete · ${autoExpeditionState.completedRuns} runs.`;
      logAutoCombatDiagnostic("expedition-complete", { reason: "max-runs", completedRuns: autoExpeditionState.completedRuns, remainingModules: autoCombatEnabledModules() });
      if (autoCombatEnabledModules().length) scheduleAutoCombatResume(0, "expedition-max-runs-handoff");
      else { stopAutoCombatDispatcherTimer(); stopAutoCombatCooldownObserver(); }
      return;
    }
    autoExpeditionState.phase = "queued";
    autoExpeditionState.error = null;
    await saveAutoExpeditionState();
    renderAutoCombatUI();
    await completeAutoCombatModule("expedition");
  }

  async function resumeAutoExpedition({ allowBusy = false } = {}) {
    if ((autoExpeditionBusy && !allowBusy) || !autoExpeditionState?.enabled) return;
    logAutoCombatDiagnostic("expedition-resume", { reason: allowBusy ? "scheduler" : "direct" });

    if (autoExpeditionState.completedRuns >= autoExpeditionState.maxRuns) {
      autoExpeditionState.enabled = false;
      autoExpeditionState.phase = "complete";
      setModuleReadiness("expedition", null);
      await saveAutoExpeditionState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("expedition-complete", { reason: "max-runs" });
      return;
    }

    if (isCombatReportPage() && expeditionReportDetection().isExpedition) {
      const reportId = reportIdFromUrl();
      // The browser may remain on the last combat report while the Expedition
      // cooldown expires. A report already credited to this run is stale and
      // must not be treated as another battle. Fall through to normal location
      // navigation so the next Expedition can actually start.
      if (reportId && autoExpeditionState.lastReportId && String(reportId) === String(autoExpeditionState.lastReportId)) {
        expeditionReportWaitStartedAt = 0;
        postBattleLootLifecycle.expedition = null;
        logAutoCombatDiagnostic("expedition-stale-report", {
          reportId,
          lastReportId: autoExpeditionState.lastReportId,
          action: "continue-navigation"
        });
      } else {
        const lootResult = await handlePostBattleLootSearch("expedition");
        if (lootResult.detected) return;
        logAutoCombatDiagnostic("expedition-report-detected", { reportId });
        expeditionReportWaitStartedAt ||= Date.now();
        const result = await captureExpeditionCombatReport().catch((error) => ({ captured: false, reason: "capture-error", error: error?.message || String(error) }));
        logAutoCombatDiagnostic("expedition-report-capture-result", result);
        if ((result?.captured || result?.reason === "already-captured") && reportId) {
          await markAutoExpeditionRunComplete(reportId);
          expeditionReportWaitStartedAt = 0;
          return;
        }
        if (Date.now() - expeditionReportWaitStartedAt > 15000) {
          autoExpeditionState.enabled = false;
          autoExpeditionState.phase = "error";
          autoExpeditionState.error = "Expedition combat report capture timed out after 15 seconds.";
          expeditionReportWaitStartedAt = 0;
          await saveAutoExpeditionState();
          renderAutoCombatUI();
          logAutoCombatDiagnostic("expedition-error", { error: autoExpeditionState.error });
          return;
        }
        autoExpeditionState.phase = "waiting-report";
        autoExpeditionState.error = result?.reason === "report-not-ready"
          ? "Waiting briefly for the battle report to finish loading."
          : "Capturing expedition combat report.";
        await saveAutoExpeditionState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(350);
        return;
      }
    }

    // The scheduler has already established Expedition's global cooldown as READY.
    // Navigation is therefore the first Expedition-specific operation.
    const onSelectedPage = isExpeditionLocationPage() && String(currentExpeditionLocationId()) === String(autoExpeditionState.locationId);
    if (!onSelectedPage) {
      autoExpeditionState.phase = "navigating";
      autoExpeditionState.error = "Opening the selected expedition location.";
      await saveAutoExpeditionState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("expedition-navigation-needed", {
        currentLocationId: currentExpeditionLocationId(),
        targetLocationId: autoExpeditionState.locationId,
        targetLocationName: autoExpeditionState.locationName
      });
      const opened = await navigateToSelectedExpeditionLocation();
      logAutoCombatDiagnostic("expedition-navigation-dispatched", { opened });
      if (opened && autoExpeditionState.enabled) scheduleAutoCombatResume(50);
      return;
    }

    logAutoCombatDiagnostic("expedition-page-ready", { locationId: currentExpeditionLocationId(), targetLocationId: autoExpeditionState.locationId });
    const targets = getExpeditionTargets();
    const target = targets.find(item => Number(item.targetId) === Number(autoExpeditionState.targetId) && String(item.locationId) === String(autoExpeditionState.locationId));
    logAutoCombatDiagnostic("expedition-target-selection", {
      selected: target ? { id: target.targetId, locationId: target.locationId, name: target.name, disabled: !!target.disabled, available: !!target.available, cooldownActive: !!target.cooldownActive, cooldownFlag: target.cooldownFlag ?? null, cooldownSkipCostVisible: !!target.cooldownSkipCostVisible } : null,
      points: parseLocalizedInteger(document.querySelector("#expeditionpoints_value_point")?.textContent || "")
    });
    if (!target) {
      autoExpeditionState.enabled = false;
      autoExpeditionState.phase = "error";
      autoExpeditionState.error = "Selected expedition target was not found on the current page.";
      await saveAutoExpeditionState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("expedition-error", { error: autoExpeditionState.error });
      return;
    }

    if (target.disabled || target.cooldownActive || !target.available || target.cooldownSkipCostVisible) {
      autoExpeditionState.phase = "checking";
      autoExpeditionState.error = target.cooldownSkipCostVisible
        ? "Ruby cooldown-reduction cost detected. Waiting without clicking."
        : target.cooldownFlag != null && target.cooldownFlag !== 0
          ? `Target cooldown active: attack mode ${target.cooldownFlag}. Waiting without clicking.`
          : target.disabled
            ? "Attack button disabled; waiting for the page action control."
            : "Waiting for target availability.";
      await saveAutoExpeditionState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("expedition-target-not-actionable", {
        disabled: !!target.disabled, available: !!target.available, cooldownActive: !!target.cooldownActive, cooldownFlag: target.cooldownFlag ?? null, cooldownSkipCostVisible: !!target.cooldownSkipCostVisible
      });
      scheduleAutoCombatResume(350);
      return;
    }

    const point = parseLocalizedInteger(document.querySelector("#expeditionpoints_value_point")?.textContent || "");
    if (!(Number(point) > 0)) {
      autoExpeditionState.phase = "checking";
      autoExpeditionState.error = "No expedition points available.";
      await saveAutoExpeditionState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("expedition-no-points", { points: point });
      scheduleAutoCombatResume(1000);
      return;
    }

    // No second global cooldown authority check here. The dispatcher owns
    // cooldown selection; this module only verifies its page-local action controls.
    autoExpeditionState.phase = "humanizing";
    autoExpeditionState.error = null;
    autoExpeditionState.targetName = target.name;
    setModuleReadiness("expedition", null);
    await saveAutoExpeditionState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("expedition-click-attack-start", { target: target.name, targetId: target.targetId, locationId: target.locationId });
    expeditionReportWaitStartedAt = Date.now();
    const clicked = await humanizedClick(target.button, "expedition-attack", { beforeClick: () => ensureAutoCombatHpSafety("expedition", "attack-click") });
    logAutoCombatDiagnostic("expedition-click-attack-result", { clicked });
    if (!clicked || !autoExpeditionState?.enabled) {
      if (autoHealingState?.active) {
        autoExpeditionState.phase = "queued";
        autoExpeditionState.error = "HP is below the configured threshold; healing before the Expedition battle.";
        await saveAutoExpeditionState();
        renderAutoCombatUI();
        scheduleAutoCombatResume(0, "expedition-waiting-healing");
        return;
      }
      autoExpeditionState.phase = "checking";
      autoExpeditionState.error = "Expedition attack control disappeared before the click could be performed; retrying.";
      await saveAutoExpeditionState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("expedition-error", { error: autoExpeditionState.error });
      scheduleAutoCombatResume(500);
      return;
    }
    autoExpeditionState.phase = "waiting-report";
    await saveAutoExpeditionState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("expedition-action-fired", { target: target.name });
  }

  function auctionDelayWithJitter(baseMs, jitterMs) {
    const base = Math.max(0, Number(baseMs) || 0);
    const jitter = Math.max(0, Number(jitterMs) || 0);
    return new Promise(resolve => setTimeout(resolve, base + (jitter ? Math.floor(Math.random() * (jitter + 1)) : 0)));
  }

  function auctionPageSnapshot() {
    const category = getCurrentAuctionCategory();
    const listings = Array.from(document.querySelectorAll('.auction_item_div'));
    const first = listings.slice(0, 2).map(node => normalize(node.getAttribute('data-id') || node.textContent).slice(0, 120)).join("|");
    const last = listings.slice(-2).map(node => normalize(node.getAttribute('data-id') || node.textContent).slice(0, 120)).join("|");
    return `${category.value}|${listings.length}|${first}|${last}`;
  }

  async function waitForAuctionPageStable(targetValue, { timeoutMs = 6000, stableSamples = 2 } = {}) {
    const started = Date.now();
    let previous = null;
    let stable = 0;
    while (Date.now() - started < timeoutMs) {
      const current = getCurrentAuctionCategory();
      if (!current.select || String(current.value) !== String(targetValue)) return false;
      const snapshot = auctionPageSnapshot();
      if (snapshot === previous) stable += 1;
      else stable = 0;
      if (stable >= stableSamples) {
        await auctionDelayWithJitter(80, AUCTION_TIMING.domJitterMs);
        return true;
      }
      previous = snapshot;
      await new Promise(resolve => setTimeout(resolve, AUCTION_TIMING.domSampleMs));
    }
    return false;
  }

  function defaultSettings() {
    return {
      simulationCount: 50,
      stats: { level: 33, strength: 89, dexterity: 114, agility: 136, constitution: 66, charisma: 61, intelligence: 50, armour: 1763, damage: 122 },
      automation: { preActionDelayMinMs: 342, preActionDelayMaxMs: 1967, minimumHpThresholdPercent: 30, minimumOpponentWinRatePercent: 50, healingBagNumber: 514, avoidHealingOverheal: true, postBattleLootAction: "thorough", dungeonConsecutiveLossesBeforeReset: 2 },
      itemComparison: { opponentMode: "player-clone", expeditionEnemyKey: "germania:germania-expeditions/cave-temple:Legionnaire" },
      routine: ["expedition", "dungeon", "circus"],
      diagnosticCaptureEnabled: false,
      targets: [
        { name: "Tax Collector", activity: "expedition", enemy: { level: 35, agility: 99, dexterity: 71, intelligence: 50, armour: 1344, damageMin: 37, damageMax: 46 }, goldMin: 1049, goldMax: 1728, expectedHpLoss: 120, itemLevelMin: 28, itemLevelMax: 43, notes: "Safe current farm baseline." },
        { name: "Blood Wolf", activity: "expedition", enemy: { level: 40, agility: 128, dexterity: 111, intelligence: 50, armour: 1527, damageMin: 67, damageMax: 83 }, goldMin: 1237, goldMax: 2012, expectedHpLoss: 620, itemLevelMin: 38, itemLevelMax: 48, notes: "Higher gold/item level; test at level 35+." }
      ]
    };
  }

  function normalizeAutomationSettings(rawAutomation = {}) {
    const defaults = { preActionDelayMinMs: 342, preActionDelayMaxMs: 1967, minimumHpThresholdPercent: 30, minimumOpponentWinRatePercent: 50, healingBagNumber: 514, avoidHealingOverheal: true, avoidHealingOverhealExplicit: false, postBattleLootAction: "thorough", dungeonConsecutiveLossesBeforeReset: 2 };
    const rawMin = Number(rawAutomation?.preActionDelayMinMs);
    const rawMax = Number(rawAutomation?.preActionDelayMaxMs);
    const rawThreshold = Number(rawAutomation?.minimumHpThresholdPercent);
    const rawOpponentWinRate = Number(rawAutomation?.minimumOpponentWinRatePercent);
    const rawBag = Number(rawAutomation?.healingBagNumber);
    const rawDungeonLossReset = Number(rawAutomation?.dungeonConsecutiveLossesBeforeReset);
    const rawLootAction = String(rawAutomation?.postBattleLootAction || "").toLowerCase().trim();
    const dungeonConsecutiveLossesBeforeReset = Number.isFinite(rawDungeonLossReset)
      ? Math.max(1, Math.min(10, Math.trunc(rawDungeonLossReset)))
      : defaults.dungeonConsecutiveLossesBeforeReset;
    const postBattleLootAction = ["return", "quick", "thorough"].includes(rawLootAction) ? rawLootAction : defaults.postBattleLootAction;
    const explicitPreference = rawAutomation?.avoidHealingOverhealExplicit === true || String(rawAutomation?.avoidHealingOverhealExplicit).toLowerCase() === "true";
    const rawAvoidOverheal = rawAutomation?.avoidHealingOverheal;
    const rawAvoidOverhealPresent = rawAvoidOverheal !== undefined && rawAvoidOverheal !== null;
    const requestedAvoidOverheal = rawAvoidOverheal === true || String(rawAvoidOverheal).toLowerCase() === "true";
    // v0.5.24: true is the default. A legacy stored false that was not explicitly
    // chosen by the user must not defeat the new default. Once the checkbox is
    // changed (or saved) we record that the preference is explicit and preserve it.
    const avoidHealingOverheal = explicitPreference
      ? requestedAvoidOverheal
      : (rawAvoidOverhealPresent && requestedAvoidOverheal ? true : defaults.avoidHealingOverheal);
    const min = Number.isFinite(rawMin) ? Math.max(0, Math.min(60000, Math.trunc(rawMin))) : defaults.preActionDelayMinMs;
    const max = Number.isFinite(rawMax) ? Math.max(0, Math.min(60000, Math.trunc(rawMax))) : defaults.preActionDelayMaxMs;
    const minimumHpThresholdPercent = Number.isFinite(rawThreshold) ? Math.max(0, Math.min(100, Math.trunc(rawThreshold))) : defaults.minimumHpThresholdPercent;
    const minimumOpponentWinRatePercent = Number.isFinite(rawOpponentWinRate) ? Math.max(0, Math.min(100, Math.trunc(rawOpponentWinRate))) : defaults.minimumOpponentWinRatePercent;
    const healingBagNumber = Number.isFinite(rawBag) ? Math.max(1, Math.min(AUTO_HEALING_MAX_BAG_NUMBER, Math.trunc(rawBag))) : defaults.healingBagNumber;
    const normalized = { preActionDelayMinMs: min, preActionDelayMaxMs: max, minimumHpThresholdPercent, minimumOpponentWinRatePercent, healingBagNumber, avoidHealingOverheal, avoidHealingOverhealExplicit: explicitPreference, postBattleLootAction, dungeonConsecutiveLossesBeforeReset };
    if (min > max) {
      normalized.preActionDelayMinMs = max;
      normalized.preActionDelayMaxMs = min;
    }
    return normalized;
  }

  function expeditionEnemyCatalog() {
    const countries = globalThis.GladiatusExpeditionEnemyDatabase?.countries;
    if (!countries || typeof countries !== "object") return [];
    const rows = [];
    for (const [countryKey, country] of Object.entries(countries)) {
      for (const expedition of (Array.isArray(country?.expeditions) ? country.expeditions : [])) {
        for (const enemy of (Array.isArray(expedition?.es) ? expedition.es : [])) {
          const key = `${countryKey}:${String(expedition.s || "").trim()}:${String(enemy.n || "").trim()}`;
          if (!enemy.n || !expedition.s) continue;
          rows.push({ key, countryKey, countryName: country?.name || countryKey, expeditionName: expedition.n || expedition.s, expeditionSlug: expedition.s, name: enemy.n, isBoss: !!enemy.b, enemy });
        }
      }
    }
    return rows;
  }

  function defaultExpeditionEnemyKey() {
    const catalog = expeditionEnemyCatalog();
    const preferred = catalog.find(row => row.countryKey === "germania" && row.expeditionSlug === "germania-expeditions/cave-temple" && row.name === "Legionnaire");
    return preferred?.key || catalog[0]?.key || "";
  }

  function normalizeItemComparisonSettings(rawComparison = {}) {
    const rawMode = String(rawComparison?.opponentMode || "").trim().toLowerCase();
    const opponentMode = rawMode === "expedition-enemy" ? "expedition-enemy" : "player-clone";
    const catalog = expeditionEnemyCatalog();
    const requestedKey = String(rawComparison?.expeditionEnemyKey || "").trim();
    const fallbackKey = defaultExpeditionEnemyKey();
    const expeditionEnemyKey = catalog.some(row => row.key === requestedKey) ? requestedKey : fallbackKey;
    return { opponentMode, expeditionEnemyKey };
  }

  function normalizeSettings(rawSettings = null) {
    const defaults = defaultSettings();
    const raw = rawSettings && typeof rawSettings === "object" ? rawSettings : {};
    const rawSimulationCount = Number(raw.simulationCount);
    const simulationCount = Number.isFinite(rawSimulationCount)
      ? Math.max(1, Math.min(10000, Math.trunc(rawSimulationCount)))
      : defaults.simulationCount;
    return {
      ...defaults,
      ...raw,
      simulationCount,
      stats: { ...defaults.stats, ...(raw.stats || {}) },
      automation: normalizeAutomationSettings(raw.automation),
      itemComparison: normalizeItemComparisonSettings(raw.itemComparison),
      routine: Array.isArray(raw.routine) ? [...raw.routine] : [...defaults.routine],
      diagnosticCaptureEnabled: raw.diagnosticCaptureEnabled === true || String(raw.diagnosticCaptureEnabled).toLowerCase() === "true"
    };
  }

  async function loadSettings() {
    const result = await storageGet("settings");
    if (result?.settings) {
      settings = normalizeSettings(result.settings);
      return settings;
    }
    settings = normalizeSettings();
    await storageSet({ settings });
    return settings;
  }

  function currentPreActionDelayRange() {
    return normalizeAutomationSettings(settings?.automation);
  }

  function globalSimulationCount() {
    const n = Number(settings?.simulationCount);
    return Math.max(1, Math.min(10000, Number.isFinite(n) ? Math.trunc(n) : 50));
  }

  function minimumOpponentWinRateThresholdPercent() {
    const n = Number(settings?.automation?.minimumOpponentWinRatePercent);
    return Math.max(0, Math.min(100, Number.isFinite(n) ? n : 50));
  }

  function diagnosticCaptureEnabled() {
    return settings?.diagnosticCaptureEnabled === true;
  }

  function currentPostBattleLootAction() {
    const value = String(settings?.automation?.postBattleLootAction || "thorough").toLowerCase().trim();
    return ["return", "quick", "thorough"].includes(value) ? value : "thorough";
  }

  function randomIntegerInclusive(min, max) {
    const lo = Math.max(0, Math.min(60000, Math.trunc(Number(min) || 0)));
    const hi = Math.max(lo, Math.min(60000, Math.trunc(Number(max) || 0)));
    return lo + Math.floor(Math.random() * (hi - lo + 1));
  }

  async function waitForPreActionHumanization() {
    const range = currentPreActionDelayRange();
    const delayMs = randomIntegerInclusive(range.preActionDelayMinMs, range.preActionDelayMaxMs);
    if (delayMs <= 0) return 0;
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return delayMs;
  }

  async function humanizedClick(element, context = "unknown", options = {}) {
    if (!element) {
      logAutoCombatDiagnostic("click-skip-no-element", { context });
      return false;
    }
    const range = currentPreActionDelayRange();
    const delayMs = randomIntegerInclusive(range.preActionDelayMinMs, range.preActionDelayMaxMs);
    logAutoCombatDiagnostic("humanization-start", { context, minMs: range.preActionDelayMinMs, maxMs: range.preActionDelayMaxMs, chosenDelayMs: delayMs, target: normalize(element.textContent || element.getAttribute("aria-label") || element.getAttribute("title") || element.id || "element").slice(0, 160) });
    if (delayMs > 0) await new Promise(resolve => setTimeout(resolve, delayMs));
    if (!element.isConnected) {
      logAutoCombatDiagnostic("click-skip-disconnected", { context });
      return false;
    }
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden") {
      logAutoCombatDiagnostic("click-skip-hidden", { context });
      return false;
    }
    if (typeof options?.beforeClick === "function") {
      let allowed = false;
      try { allowed = await options.beforeClick(); } catch (error) {
        logAutoCombatDiagnostic("click-guard-error", { context, error: error?.message || String(error) });
        return false;
      }
      if (!allowed) {
        logAutoCombatDiagnostic("click-blocked-by-guard", { context });
        return false;
      }
    }
    logAutoCombatDiagnostic("click-perform", { context });
    element.click();
    return true;
  }


  function currentHpThresholdPercent() {
    const value = Number(currentPreActionDelayRange().minimumHpThresholdPercent);
    return Number.isFinite(value) ? Math.max(0, Math.min(100, Math.trunc(value))) : 30;
  }

  function configuredHealingBagNumber() {
    const value = Number(currentPreActionDelayRange().healingBagNumber);
    return Number.isFinite(value) ? Math.max(1, Math.min(AUTO_HEALING_MAX_BAG_NUMBER, Math.trunc(value))) : 514;
  }

  function readLiveHpSnapshot() {
    const bar = document.querySelector("#header_values_hp_bar");
    if (!bar) return null;
    const current = Number(bar.getAttribute("data-value"));
    const max = Number(bar.getAttribute("data-max-value"));
    if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 0 || current < 0) return null;
    return { current, max, percent: (current / max) * 100 };
  }

  function autoHealingStatusText() {
    const threshold = currentHpThresholdPercent();
    const hp = readLiveHpSnapshot();
    const hpText = hp ? `HP ${hp.current}/${hp.max} (${hp.percent.toFixed(1)}%)` : "HP unreadable";
    const noOverheal = !!currentPreActionDelayRange().avoidHealingOverheal;
    const modeText = noOverheal ? " · no-overheal" : "";
    const plan = autoHealingState?.active && Number.isFinite(Number(autoHealingState.planDeficit))
      ? ` · plan ${Math.max(0, Number(autoHealingState.planTotalHeal) || 0)} HP → ${Math.max(0, Number(autoHealingState.planExpectedHp) || 0)}/${Math.max(1, Number(autoHealingState.maxHp) || hp?.max || 1)} · waste ${Math.max(0, Number(autoHealingState.planOverheal) || 0)}`
      : "";
    if (!autoHealingState) return `${hpText} · threshold ${threshold}% · healing bag ${configuredHealingBagNumber()}${modeText}`;
    if (autoHealingState.active) {
      const label = autoHealingState.phase === "healing" ? "Healing" : autoHealingState.phase === "starting" ? "Starting healing" : "Healing required";
      return `${label} · ${hpText} · threshold ${threshold}% · bag ${configuredHealingBagNumber()}${modeText}${plan}`;
    }
    if (autoHealingState.phase === "error") return `${hpText} · HP safety stopped: ${autoHealingState.error || "healing failed"}`;
    return `${hpText} · threshold ${threshold}% · healing bag ${configuredHealingBagNumber()}${modeText}`;
  }

  async function loadAutoHealingState() {
    try {
      const result = await storageGet(autoHealingKey());
      const stored = result?.[autoHealingKey()];
      if (stored && typeof stored === "object") {
        autoHealingState = {
          active: !!stored.active,
          phase: stored.phase || "idle",
          error: stored.error || null,
          startedAt: stored.startedAt || null,
          currentHp: Number.isFinite(Number(stored.currentHp)) ? Number(stored.currentHp) : null,
          maxHp: Number.isFinite(Number(stored.maxHp)) ? Number(stored.maxHp) : null,
          thresholdPercent: Number.isFinite(Number(stored.thresholdPercent)) ? Number(stored.thresholdPercent) : null,
          bagNumber: Number.isFinite(Number(stored.bagNumber)) ? Number(stored.bagNumber) : configuredHealingBagNumber(),
          selectedItems: Array.isArray(stored.selectedItems) ? stored.selectedItems : [],
          planDeficit: Number.isFinite(Number(stored.planDeficit)) ? Number(stored.planDeficit) : null,
          planTotalHeal: Number.isFinite(Number(stored.planTotalHeal)) ? Number(stored.planTotalHeal) : null,
          planExpectedHp: Number.isFinite(Number(stored.planExpectedHp)) ? Number(stored.planExpectedHp) : null,
          planOverheal: Number.isFinite(Number(stored.planOverheal)) ? Number(stored.planOverheal) : null,
          usedBySourceKey: stored.usedBySourceKey && typeof stored.usedBySourceKey === "object" ? { ...stored.usedBySourceKey } : {},
          totalHeals: Math.max(0, Number(stored.totalHeals) || 0),
          lastHeal: stored.lastHeal && typeof stored.lastHeal === "object" ? { ...stored.lastHeal } : null
        };
        return autoHealingState;
      }
    } catch (_) {}
    autoHealingState = {
      active: false,
      phase: "idle",
      error: null,
      startedAt: null,
      currentHp: null,
      maxHp: null,
      thresholdPercent: null,
      bagNumber: configuredHealingBagNumber(),
      selectedItems: [],
      planDeficit: null,
      planTotalHeal: null,
      planExpectedHp: null,
      planOverheal: null,
      usedBySourceKey: {},
      totalHeals: 0,
      lastHeal: null
    };
    return autoHealingState;
  }

  async function saveAutoHealingState() {
    if (!autoHealingState) return;
    try { await storageSet({ [autoHealingKey()]: autoHealingState }); } catch (_) {}
  }

  function parseHealingAmountFromTooltip(rawTooltip) {
    const text = normalize(String(rawTooltip || "").replace(/&quot;/g, '"'));
    const match = text.match(/Heals\s+([\d.,]+)\s+of\s+life/i);
    return match ? parseLocalizedInteger(match[1]) : null;
  }

  function parseHealingAmountFromResponse(rawResponse) {
    const text = normalize(String(rawResponse || ""));
    const match = text.match(/\+([\d.,]+)\s+Life points/i);
    return match ? parseLocalizedInteger(match[1]) : null;
  }

  function healingSourceKey(item) {
    return `${String(item?.bagNumber ?? "")}|${String(item?.itemId ?? "")}|${String(item?.x ?? "")}|${String(item?.y ?? "")}`;
  }

  function parseHealingInventoryItems(bagNumber = configuredHealingBagNumber()) {
    const bag = String(bagNumber);
    const nodes = [...document.querySelectorAll(`#inv [data-container-number="${CSS.escape(bag)}"][data-content-type="64"]`)];
    return nodes.map((node, index) => {
      const itemId = node.getAttribute("data-item-id");
      const x = Number(node.getAttribute("data-position-x"));
      const y = Number(node.getAttribute("data-position-y"));
      const amount = Math.max(1, Number(node.getAttribute("data-amount")) || 1);
      const heal = parseHealingAmountFromTooltip(node.getAttribute("data-tooltip"));
      if (!itemId || !Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(heal) || heal <= 0) return null;
      return {
        index,
        itemId: String(itemId),
        bagNumber: Number(bagNumber),
        x,
        y,
        amount,
        heal,
        sourceKey: healingSourceKey({ bagNumber, itemId, x, y }),
        element: node
      };
    }).filter(Boolean);
  }

  function availableHealingUnits(items) {
    return items.flatMap(item => {
      const alreadyUsed = Math.max(0, Number(autoHealingState?.usedBySourceKey?.[item.sourceKey]) || 0);
      const remaining = Math.max(0, Math.trunc(item.amount) - alreadyUsed);
      return Array.from({ length: remaining }, (_, unitIndex) => ({ ...item, unitIndex }));
    });
  }

  function selectHealingCombination(deficit, items, { avoidOverheal = false } = {}) {
    const target = Math.max(0, Math.ceil(Number(deficit) || 0));
    if (target <= 0) return { picks: [], totalHeal: 0, overheal: 0, reachesFull: true };
    const units = availableHealingUnits(items);
    if (!units.length) return null;

    const maxHeal = Math.max(...units.map(unit => unit.heal));
    const cap = Math.max(target + maxHeal, maxHeal);
    let dp = new Map([[0, { count: 0, picks: [] }]]);
    for (const unit of units) {
      const next = new Map(dp);
      for (const [sum, state] of dp.entries()) {
        const nextSum = sum + unit.heal;
        if (nextSum > cap) continue;
        const candidate = { count: state.count + 1, picks: [...state.picks, unit] };
        const existing = next.get(nextSum);
        if (!existing || candidate.count < existing.count) next.set(nextSum, candidate);
      }
      dp = next;
    }

    const sums = [...dp.keys()].filter(sum => sum > 0);
    if (!avoidOverheal) {
      const reaching = sums.filter(sum => sum >= target).sort((a, b) => a - b);
      if (reaching.length) {
        const totalHeal = reaching[0];
        const state = dp.get(totalHeal);
        return { picks: state.picks, totalHeal, overheal: totalHeal - target, reachesFull: true };
      }
    }

    // With avoid-overheal enabled, only combinations at or below the deficit
    // are legal. Otherwise use the maximum available healing below the target.
    // In either case, ties prefer fewer items.
    const belowTarget = sums.filter(sum => sum <= target).sort((a, b) => {
      if (b !== a) return b - a;
      return (dp.get(a)?.count || Infinity) - (dp.get(b)?.count || Infinity);
    });
    const bestBelow = belowTarget[0];
    if (avoidOverheal && !Number.isFinite(bestBelow)) return null;
    if (!Number.isFinite(bestBelow)) return null;
    const state = dp.get(bestBelow);
    return { picks: state.picks, totalHeal: bestBelow, overheal: 0, reachesFull: bestBelow >= target };
  }

  function updateLiveHpDomFromServer(health) {
    const current = Number(health?.current);
    const max = Number(health?.max);
    if (!Number.isFinite(current) || !Number.isFinite(max) || max <= 0) return;
    const bar = document.querySelector("#header_values_hp_bar");
    if (bar) {
      bar.setAttribute("data-value", String(current));
      bar.setAttribute("data-max-value", String(max));
    }
    const fill = document.querySelector("#header_values_hp_bar_fill");
    if (fill) fill.style.width = `${Math.max(0, Math.min(100, (current / max) * 100))}%`;
    const percent = document.querySelector("#header_values_hp_percent");
    if (percent) percent.textContent = `${Math.round((current / max) * 100)}%`;
  }

  function currentSecureHash() {
    const direct = typeof globalThis.secureHash === "string" ? globalThis.secureHash : "";
    if (direct) return direct;
    try { return new URL(location.href).searchParams.get("sh") || ""; } catch (_) { return ""; }
  }

  function currentCsrfToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
  }

  function findOverviewNavigationLink() {
    const preferredSelectors = [
      '#mainmenu a.menuitem[href][title="Overview"][target="_self"]',
      '#mainmenu a.menuitem[href*="mod=overview"][target="_self"]',
      '#mainnav a.awesome-tabs[href*="mod=overview"]:not([href*="submod="])'
    ];

    for (const selector of preferredSelectors) {
      const anchor = document.querySelector(selector);
      if (!anchor) continue;
      try {
        const url = new URL(anchor.href || anchor.getAttribute("href"), location.href);
        if (url.origin !== location.origin) continue;
        if (url.searchParams.get("mod") !== "overview") continue;
        if (url.searchParams.get("submod")) continue;
        return anchor;
      } catch (_) {}
    }

    // Never fall back to a page-wide href scan here. The chat control is a
    // separate interactive element, and a broad scan can select an unrelated
    // control on pages with dynamic/hidden navigation.
    return null;
  }

  function isOverviewPage() {
    try { return new URL(location.href).searchParams.get("mod") === "overview"; } catch (_) { return document.body?.id === "overviewPage"; }
  }

  function isCharacterOverviewPage() {
    try {
      const url = new URL(location.href);
      return url.searchParams.get("mod") === "overview" && !url.searchParams.get("submod");
    } catch (_) {
      return document.body?.id === "overviewPage" && !/submod=/.test(location.search);
    }
  }

  async function triggerAutoHealing(reason = "hp-threshold") {
    if (!autoHealingState) await loadAutoHealingState();
    if (autoHealingState.active) {
      logAutoCombatDiagnostic("healing-already-active", { reason });
      return false;
    }

    // HP safety can trigger while Arena/Expedition still owns the automation
    // navigation lock. Healing needs to take that lock so it can navigate to
    // Character Overview. Hand the lock over before starting the healing job.
    const previousNavigationOwner = automationNavigationOwner;
    if (previousNavigationOwner && previousNavigationOwner !== "healing") {
      logAutoCombatDiagnostic("hp-safety-navigation-handoff", {
        reason,
        from: previousNavigationOwner,
        to: "healing"
      });
      releaseAutomationNavigation(previousNavigationOwner);
    }
    const hp = readLiveHpSnapshot();
    autoHealingState.active = true;
    autoHealingState.phase = "starting";
    autoHealingState.error = null;
    autoHealingState.startedAt = new Date().toISOString();
    autoHealingState.currentHp = hp?.current ?? null;
    autoHealingState.maxHp = hp?.max ?? null;
    autoHealingState.thresholdPercent = currentHpThresholdPercent();
    autoHealingState.bagNumber = configuredHealingBagNumber();
    autoHealingState.selectedItems = [];
    autoHealingState.planDeficit = null;
    autoHealingState.planTotalHeal = null;
    autoHealingState.planExpectedHp = null;
    autoHealingState.planOverheal = null;
    autoHealingState.usedBySourceKey = {};
    autoHealingState.totalHeals = 0;
    autoHealingState.lastHeal = null;
    await saveAutoHealingState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("healing-start", { reason, hp, thresholdPercent: autoHealingState.thresholdPercent, bagNumber: autoHealingState.bagNumber });
    if (!autoHealingBusy) void resumeAutoHealing({ allowBusy: true });
    return true;
  }

  async function stopAutoHealing() {
    if (!autoHealingState) await loadAutoHealingState();
    autoHealingState.active = false;
    autoHealingState.phase = "idle";
    autoHealingState.error = null;
    autoHealingState.currentHp = null;
    autoHealingState.maxHp = null;
    autoHealingState.selectedItems = [];
    autoHealingState.planDeficit = null;
    autoHealingState.planTotalHeal = null;
    autoHealingState.planExpectedHp = null;
    autoHealingState.planOverheal = null;
    autoHealingState.usedBySourceKey = {};
    autoHealingState.totalHeals = 0;
    autoHealingState.lastHeal = null;
    await saveAutoHealingState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("healing-stopped", {});
  }

  async function stopAutoCombatForHealingFailure(errorMessage) {
    const message = String(errorMessage || "Auto healing failed.");
    if (arenaAutomationState) {
      arenaAutomationState.enabled = false;
      arenaAutomationState.phase = "error";
      arenaAutomationState.error = message;
      arenaAutomationState.readiness = "unknown";
      arenaAutomationState.readyAt = null;
      await saveArenaAutomationState();
    }
    if (autoExpeditionState) {
      autoExpeditionState.enabled = false;
      autoExpeditionState.phase = "error";
      autoExpeditionState.error = message;
      autoExpeditionState.readiness = "unknown";
      autoExpeditionState.readyAt = null;
      await saveAutoExpeditionState();
    }
    if (autoDungeonState) {
      autoDungeonState.enabled = false;
      autoDungeonState.phase = "error";
      autoDungeonState.error = message;
      autoDungeonState.readiness = "unknown";
      autoDungeonState.readyAt = null;
      await saveAutoDungeonState();
    }
    if (circusProvinciarumAutomationState) {
      circusProvinciarumAutomationState.enabled = false;
      circusProvinciarumAutomationState.phase = "error";
      circusProvinciarumAutomationState.error = message;
      circusProvinciarumAutomationState.readiness = "unknown";
      circusProvinciarumAutomationState.readyAt = null;
      await saveCircusProvinciarumAutomationState();
    }
    releaseAutomationNavigation();
    stopAutoCombatDispatcherTimer();
    stopAutoCombatCooldownObserver();
    if (autoHealingState) {
      autoHealingState.active = false;
      autoHealingState.phase = "error";
      autoHealingState.error = message;
      await saveAutoHealingState();
    }
    renderAutoCombatUI();
    if (statusEl) statusEl.textContent = `Auto Combat stopped: ${message}`;
    logAutoCombatDiagnostic("healing-error", { error: message, safetyStop: true });
  }

  async function waitForHealingBagReady(bagNumber, timeoutMs = 5000) {
    const selector = `#inventory_nav a[data-bag-number="${CSS.escape(String(bagNumber))}"]`;
    const isReady = () => {
      const tab = document.querySelector(selector);
      if (!tab) return false;
      if (String(tab.dataset.available) === "false" || tab.classList.contains("inactive")) return false;
      if (!tab.classList.contains("current")) return false;
      return parseHealingInventoryItems(bagNumber).length > 0;
    };
    if (isReady()) return true;
    const inv = document.querySelector("#inv");
    const nav = document.querySelector("#inventory_nav");
    if (!inv && !nav) return false;
    return new Promise(resolve => {
      let done = false;
      const observer = typeof MutationObserver === "undefined" ? null : new MutationObserver(() => {
        if (isReady()) finish(true);
      });
      const finish = (value) => {
        if (done) return;
        done = true;
        observer?.disconnect();
        clearTimeout(timer);
        resolve(value);
      };
      const timer = setTimeout(() => finish(isReady()), timeoutMs);
      observer?.observe(inv || nav, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "data-bag-number"] });
      if (isReady()) finish(true);
    });
  }

  async function ensureHealingOverview() {
    if (isCharacterOverviewPage()) return true;
    if (!beginAutomationNavigation("healing")) {
      logAutoCombatDiagnostic("healing-navigation-blocked", { owner: automationNavigationOwner });
      return false;
    }
    const link = findOverviewNavigationLink();
    if (!link) {
      releaseAutomationNavigation("healing");
      await stopAutoCombatForHealingFailure("Main Character Overview navigation link was not found in the game menu.");
      return false;
    }
    const href = link.href || link.getAttribute("href") || null;
    const elementDetails = {
      href,
      id: link.id || null,
      className: typeof link.className === "string" ? link.className : null,
      title: link.getAttribute("title") || null,
      text: normalize(link.textContent || ""),
      selectorSource: link.closest("#mainmenu") ? "#mainmenu" : (link.closest("#mainnav") ? "#mainnav" : "unknown")
    };
    autoHealingState.phase = "navigating";
    autoHealingState.error = "Opening Character Overview for HP safety.";
    await saveAutoHealingState();
    renderAutoCombatUI();
    logAutoCombatDiagnostic("healing-overview-navigation", elementDetails);
    const clicked = await humanizedClick(link, "healing-overview-navigation");
    logAutoCombatDiagnostic("healing-overview-navigation-result", { ...elementDetails, clicked });
    if (!clicked) {
      releaseAutomationNavigation("healing");
      await stopAutoCombatForHealingFailure("Character Overview navigation control disappeared before the click.");
    }
    return false;
  }

  async function ensureMainCharacterSelectedForHealing() {
    const doll = document.querySelector("#plDoll");
    const selectedDoll = String(doll?.value || "");
    if (selectedDoll === AUTO_HEALING_MAIN_DOLL) {
      logAutoCombatDiagnostic("healing-main-character-check", { selectedDoll, mainCharacterSelected: true });
      return true;
    }
    const mainSelector = document.querySelector('.charmercsel[onclick*="doll=1"]');
    if (!mainSelector) {
      await stopAutoCombatForHealingFailure("Main character selector (doll=1) was not found on Character Overview.");
      return false;
    }
    logAutoCombatDiagnostic("healing-main-character-check", { selectedDoll, mainCharacterSelected: false, action: "select-doll-1" });
    const clicked = await humanizedClick(mainSelector, "healing-main-character-select");
    if (!clicked) {
      await stopAutoCombatForHealingFailure("Main character selector disappeared before doll=1 could be selected.");
      return false;
    }
    return false;
  }

  async function ensureHealingBagSelected() {
    const bag = configuredHealingBagNumber();
    const tab = document.querySelector(`#inventory_nav a[data-bag-number="${CSS.escape(String(bag))}"]`);
    if (!tab) {
      await stopAutoCombatForHealingFailure(`Configured healing inventory bag ${bag} is not present.`);
      return false;
    }
    if (String(tab.dataset.available) === "false" || tab.classList.contains("inactive")) {
      await stopAutoCombatForHealingFailure(`Configured healing inventory bag ${bag} is unavailable.`);
      return false;
    }
    if (!tab.classList.contains("current")) {
      autoHealingState.phase = "navigating";
      autoHealingState.error = `Opening healing inventory bag ${bag}.`;
      await saveAutoHealingState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("healing-bag-select", { bagNumber: bag });
      const clicked = await humanizedClick(tab, "healing-inventory-bag");
      if (!clicked) {
        await stopAutoCombatForHealingFailure("Healing inventory bag control disappeared before selection.");
        return false;
      }
    }
    const ready = await waitForHealingBagReady(bag);
    logAutoCombatDiagnostic("healing-inventory-ready", { bagNumber: bag, ready });
    if (!ready) {
      await stopAutoCombatForHealingFailure(`Healing inventory bag ${bag} did not finish loading.`);
      return false;
    }
    return true;
  }

  async function performDirectHeal(item, { avoidOverheal = false } = {}) {
    const csrf = currentCsrfToken();
    const sh = currentSecureHash();
    if (!csrf) throw new Error("CSRF token is unavailable on the current page.");
    if (!sh) throw new Error("secureHash is unavailable on the current page.");
    const params = new URLSearchParams({
      mod: "inventory",
      submod: "move",
      from: String(item.bagNumber),
      fromX: String(item.x),
      fromY: String(item.y),
      to: AUTO_HEALING_TARGET_CONTAINER,
      toX: AUTO_HEALING_TARGET_X,
      toY: AUTO_HEALING_TARGET_Y,
      amount: "1",
      doll: AUTO_HEALING_MAIN_DOLL
    });
    const endpoint = `${location.origin}/game/ajax.php?${params.toString()}`;
    const body = new URLSearchParams({ a: String(Date.now()), sh });
    const range = currentPreActionDelayRange();
    const delayMs = randomIntegerInclusive(range.preActionDelayMinMs, range.preActionDelayMaxMs);
    logAutoCombatDiagnostic("healing-humanization-start", { minMs: range.preActionDelayMinMs, maxMs: range.preActionDelayMaxMs, chosenDelayMs: delayMs, itemId: item.itemId, heal: item.heal });
    if (delayMs > 0) await new Promise(resolve => setTimeout(resolve, delayMs));

    const before = readLiveHpSnapshot();
    if (!before) throw new Error("HP became unreadable before the healing request.");
    if (before.current >= before.max) return { skipped: true, reason: "already-full", before, after: before, healText: null };
    const deficit = Math.max(0, before.max - before.current);
    const nominalHeal = Number(item?.heal);
    if (avoidOverheal) {
      if (!Number.isFinite(nominalHeal) || nominalHeal <= 0) return { skipped: true, reason: "invalid-heal-value", before, after: before, healText: null };
      if (nominalHeal > deficit) {
        logAutoCombatDiagnostic("healing-click-blocked-overheal", { itemId: item.itemId, nominalHeal, deficit, before });
        return { skipped: true, replan: true, reason: "would-overheal-at-click", before, after: before, healText: null, nominalHeal, deficit };
      }
    }
    logAutoCombatDiagnostic("healing-preclick-guard", { itemId: item.itemId, avoidOverheal, nominalHeal, deficit, before });
    logAutoCombatDiagnostic("healing-request", { itemId: item.itemId, heal: item.heal, from: item.bagNumber, fromX: item.x, fromY: item.y, to: AUTO_HEALING_TARGET_CONTAINER, toX: AUTO_HEALING_TARGET_X, toY: AUTO_HEALING_TARGET_Y, doll: AUTO_HEALING_MAIN_DOLL });

    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-CSRF-Token": csrf,
        "X-Requested-With": "XMLHttpRequest"
      },
      body: body.toString()
    });
    if (!response.ok) throw new Error(`Healing request returned HTTP ${response.status}.`);
    let payload = null;
    try { payload = await response.json(); } catch (_) { throw new Error("Healing request did not return valid JSON."); }

    const responseHealth = payload?.header?.health && Number.isFinite(Number(payload.header.health.value)) && Number.isFinite(Number(payload.header.health.maxValue))
      ? { current: Number(payload.header.health.value), max: Number(payload.header.health.maxValue), percent: (Number(payload.header.health.value) / Number(payload.header.health.maxValue)) * 100 }
      : null;
    const healText = typeof payload?.heal === "string" ? payload.heal : "";
    const healedAmount = parseHealingAmountFromResponse(healText);
    logAutoCombatDiagnostic("healing-response", { status: response.status, healText: healText.slice(0, 120), healedAmount, responseHp: responseHealth });
    if (!healText || !/life points/i.test(healText)) throw new Error("Healing response did not confirm a Life points heal.");
    if (!responseHealth) throw new Error("Healing response did not contain updated HP values.");
    if (responseHealth.current <= before.current) throw new Error(`Healing response did not increase HP (${before.current} → ${responseHealth.current}).`);
    updateLiveHpDomFromServer(responseHealth);
    const effectiveHeal = responseHealth.current - before.current;
    const creditedHeal = Number.isFinite(Number(healedAmount)) && Number(healedAmount) > 0 ? Number(healedAmount) : nominalHeal;
    const actualOverheal = Math.max(0, before.current + creditedHeal - responseHealth.max);
    if (avoidOverheal && actualOverheal > 0) {
      logAutoCombatDiagnostic("healing-overheal-detected", { itemId: item.itemId, before, after: responseHealth, nominalHeal, healedAmount, creditedHeal, effectiveHeal, actualOverheal });
    }
    return { skipped: false, before, after: responseHealth, healText, healedAmount, creditedHeal, effectiveHeal, actualOverheal };
  }

  async function resumeAutoHealing({ allowBusy = false } = {}) {
    if ((autoHealingBusy && !allowBusy) || !autoHealingState?.active) return;
    if (autoHealingBusy && allowBusy) return;
    autoHealingBusy = true;
    try {
      const threshold = currentHpThresholdPercent();
      const hp = readLiveHpSnapshot();
      logAutoCombatDiagnostic("hp-check", { context: "healing-resume", hp, thresholdPercent: threshold });
      if (!hp) {
        await stopAutoCombatForHealingFailure("Current/max HP could not be read from the global game header.");
        return;
      }
      autoHealingState.currentHp = hp.current;
      autoHealingState.maxHp = hp.max;
      autoHealingState.thresholdPercent = threshold;
      autoHealingState.bagNumber = configuredHealingBagNumber();

      if (hp.current >= hp.max) {
        autoHealingState.active = false;
        autoHealingState.phase = "idle";
        autoHealingState.error = null;
        await saveAutoHealingState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("healing-complete", { reason: "already-full", hp });
        scheduleAutoCombatResume(0, "healing-complete");
        return;
      }

      if (!isOverviewPage()) {
        autoHealingState.phase = "navigating";
        await saveAutoHealingState();
        renderAutoCombatUI();
        await ensureHealingOverview();
        return;
      }
      releaseAutomationNavigation("healing");

      if (!(await ensureMainCharacterSelectedForHealing())) return;
      const freshHp = readLiveHpSnapshot();
      if (!freshHp) {
        await stopAutoCombatForHealingFailure("HP could not be read after selecting the main character.");
        return;
      }
      autoHealingState.currentHp = freshHp.current;
      autoHealingState.maxHp = freshHp.max;
      if (freshHp.current >= freshHp.max) {
        autoHealingState.active = false;
        autoHealingState.phase = "idle";
        autoHealingState.error = null;
        await saveAutoHealingState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("healing-complete", { reason: "regeneration-reached-full", hp: freshHp });
        scheduleAutoCombatResume(0, "healing-complete");
        return;
      }

      if (!(await ensureHealingBagSelected())) return;
      const items = parseHealingInventoryItems(configuredHealingBagNumber());
      logAutoCombatDiagnostic("healing-candidates", { bagNumber: configuredHealingBagNumber(), count: items.length, candidates: items.map(item => ({ itemId: item.itemId, x: item.x, y: item.y, amount: item.amount, heal: item.heal, sourceKey: item.sourceKey })) });
      const deficit = Math.max(0, freshHp.max - freshHp.current);
      const avoidOverheal = !!currentPreActionDelayRange().avoidHealingOverheal;
      const plan = selectHealingCombination(deficit, items, { avoidOverheal });
      if (!plan || !plan.picks.length) {
        if ((freshHp.current / freshHp.max) * 100 >= threshold) {
          autoHealingState.active = false;
          autoHealingState.phase = "idle";
          autoHealingState.error = "No healing items are available; current HP is above the configured threshold.";
          await saveAutoHealingState();
          renderAutoCombatUI();
          logAutoCombatDiagnostic("healing-complete", { reason: "no-items-but-above-threshold", hp: freshHp, thresholdPercent: threshold });
          scheduleAutoCombatResume(0, "healing-complete");
          return;
        }
        const avoidOverheal = !!currentPreActionDelayRange().avoidHealingOverheal;
        const reason = avoidOverheal
          ? `No combination of available healing items can restore HP without overhealing. Auto Combat stopped at ${freshHp.current}/${freshHp.max}.`
          : `No usable healing items are available in bag ${configuredHealingBagNumber()} while HP is below ${threshold}%.`;
        await stopAutoCombatForHealingFailure(reason);
        return;
      }

      autoHealingState.selectedItems = plan.picks.map(item => ({ itemId: item.itemId, bagNumber: item.bagNumber, x: item.x, y: item.y, heal: item.heal, sourceKey: item.sourceKey }));
      autoHealingState.planDeficit = deficit;
      autoHealingState.planTotalHeal = plan.totalHeal;
      autoHealingState.planExpectedHp = Math.min(freshHp.max, freshHp.current + plan.totalHeal);
      autoHealingState.planOverheal = Math.max(0, Number(plan.overheal) || 0);
      autoHealingState.phase = "healing";
      autoHealingState.error = plan.reachesFull
        ? `Healing to full · ${plan.totalHeal} planned · ${plan.overheal} overheal.`
        : (avoidOverheal
          ? `Healing without overheal · ${plan.totalHeal} HP planned.`
          : `Healing as much as possible · ${plan.totalHeal} available from current bag.`);
      await saveAutoHealingState();
      renderAutoCombatUI();
      logAutoCombatDiagnostic("healing-selection", { avoidOverheal, deficit, totalHeal: plan.totalHeal, overheal: plan.overheal, reachesFull: plan.reachesFull, count: plan.picks.length, picks: plan.picks.map(item => ({ itemId: item.itemId, x: item.x, y: item.y, heal: item.heal, sourceKey: item.sourceKey })) });

      const planned = plan.picks[0];
      const liveItem = parseHealingInventoryItems(configuredHealingBagNumber()).find(item => item.itemId === planned.itemId && item.sourceKey === planned.sourceKey)
        || parseHealingInventoryItems(configuredHealingBagNumber()).find(item => item.itemId === planned.itemId);
      if (!liveItem) {
        await stopAutoCombatForHealingFailure(`Selected healing item ${planned.itemId} is no longer present in bag ${configuredHealingBagNumber()}.`);
        return;
      }

      const result = await performDirectHeal(liveItem, { avoidOverheal });
      if (result?.replan) {
        autoHealingState.currentHp = result.before?.current ?? null;
        autoHealingState.maxHp = result.before?.max ?? null;
        autoHealingState.phase = "starting";
        autoHealingState.error = "HP changed before the healing click; recalculating the no-overheal plan.";
        autoHealingState.selectedItems = [];
        autoHealingState.planDeficit = null;
        autoHealingState.planTotalHeal = null;
        autoHealingState.planExpectedHp = null;
        autoHealingState.planOverheal = null;
        await saveAutoHealingState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("healing-replan-before-click", { reason: result.reason, hp: result.before, itemId: liveItem.itemId, nominalHeal: liveItem.heal });
        scheduleAutoCombatResume(0, "healing-replan-before-click");
        return;
      }

      if (result?.skipped) {
        autoHealingState.currentHp = result.after.current;
        autoHealingState.maxHp = result.after.max;
        autoHealingState.active = false;
        autoHealingState.phase = "idle";
        autoHealingState.error = null;
        autoHealingState.planDeficit = null;
        autoHealingState.planTotalHeal = null;
        autoHealingState.planExpectedHp = null;
        autoHealingState.planOverheal = null;
        await saveAutoHealingState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("healing-complete", { reason: result.reason || "already-full-after-delay", hp: result.after });
        scheduleAutoCombatResume(0, "healing-complete");
        return;
      }

      const sourceKey = healingSourceKey(liveItem);
      autoHealingState.usedBySourceKey[sourceKey] = Math.max(0, Number(autoHealingState.usedBySourceKey[sourceKey]) || 0) + 1;
      autoHealingState.totalHeals = Math.max(0, Number(autoHealingState.totalHeals) || 0) + 1;
      autoHealingState.currentHp = result.after.current;
      autoHealingState.maxHp = result.after.max;
      autoHealingState.lastHeal = {
        at: new Date().toISOString(),
        itemId: liveItem.itemId,
        heal: result.healedAmount ?? liveItem.heal,
        before: result.before.current,
        after: result.after.current,
        sourceKey,
        creditedHeal: result.creditedHeal ?? null,
        actualOverheal: Number(result.actualOverheal) || 0
      };
      const delta = result.after.current - result.before.current;
      logAutoCombatDiagnostic("healing-verify", { itemId: liveItem.itemId, before: result.before.current, after: result.after.current, delta, max: result.after.max, healText: result.healText });
      if (!(delta > 0)) {
        await stopAutoCombatForHealingFailure(`Healing item ${liveItem.itemId} produced no HP increase.`);
        return;
      }
      if (avoidOverheal && Number(result.actualOverheal) > 0) {
        await stopAutoCombatForHealingFailure(`Unexpected healing overheal detected (${Math.round(Number(result.actualOverheal))} HP). Auto Combat stopped to prevent further healing waste.`);
        return;
      }

      if (!plan.reachesFull && (result.after.current / result.after.max) * 100 >= threshold) {
        autoHealingState.active = false;
        autoHealingState.phase = "idle";
        autoHealingState.error = null;
        autoHealingState.selectedItems = [];
        autoHealingState.planDeficit = null;
        autoHealingState.planTotalHeal = null;
        autoHealingState.planExpectedHp = null;
        autoHealingState.planOverheal = null;
        await saveAutoHealingState();
        renderAutoCombatUI();
        logAutoCombatDiagnostic("healing-complete", { reason: "best-effort-above-threshold", hp: result.after, thresholdPercent: threshold });
        scheduleAutoCombatResume(0, "healing-complete-best-effort");
        return;
      }

      await saveAutoHealingState();
      renderAutoCombatUI();
      // Re-enter through the scheduler so HP, regeneration, inventory stock, and
      // the optimal combination are all recalculated after every successful heal.
      scheduleAutoCombatResume(0, "healing-recalculate-after-success");
    } catch (error) {
      await stopAutoCombatForHealingFailure(error?.message || String(error));
    } finally {
      autoHealingBusy = false;
    }
  }

  async function ensureAutoCombatHpSafety(module, context) {
    const threshold = currentHpThresholdPercent();
    const hp = readLiveHpSnapshot();
    logAutoCombatDiagnostic("hp-check", { context, module, hp, thresholdPercent: threshold });
    if (!hp) {
      await stopAutoCombatForHealingFailure("Current/max HP could not be read immediately before the automated battle action.");
      return false;
    }
    autoHealingState.currentHp = hp.current;
    autoHealingState.maxHp = hp.max;
    autoHealingState.thresholdPercent = threshold;
    if (threshold <= 0 || (hp.current / hp.max) * 100 >= threshold) return true;
    logAutoCombatDiagnostic("hp-threshold-trigger", { context, module, hp, thresholdPercent: threshold });
    await triggerAutoHealing(`before-${module}-${context}`);
    return false;
  }

  function mergeStats() { return { ...(settings?.stats || {}), ...(latestParsedState || {}) }; }

  async function loadOverlayState() {
    const result = await storageGet(overlayStateKey());
    if (result?.[overlayStateKey()]) overlayState = { ...overlayState, ...result[overlayStateKey()] };
  }

  async function saveOverlayState() {
    try { await storageSet({ [overlayStateKey()]: overlayState }); } catch (_) {}
  }

  function normalize(value) {
    return String(value ?? "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function esc(text) {
    return String(text ?? "").replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  function fmtNum(value) {
    const n = Number(value);
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  }

  function normalizeColor(value) {
    const raw = String(value || "").trim().split(";")[0].trim();
    if (!raw) return null;
    if (/^#[0-9a-f]{3,8}$/i.test(raw)) return raw;
    if (/^rgba?\(/i.test(raw)) return raw;
    if (/^[a-z]+$/i.test(raw)) return raw.toLowerCase();
    return null;
  }

  function qualityLabel(q) { return QUALITY_NAMES[String(q || "unknown").toLowerCase()] || QUALITY_NAMES.unknown; }

  function qualityColor(item) {
    const q = String(item?.quality || "unknown").toLowerCase();
    const raw = normalizeColor(item?.nameColor);
    if (raw && !/^black$|^#000(?:000)?$/i.test(raw)) return raw;
    return QUALITY_FALLBACK_COLORS[q] || QUALITY_FALLBACK_COLORS.unknown;
  }

  function getItemMeasurement(item) {
    const x = Number(item?.measurementX ?? item?.measurement?.x ?? 0);
    const y = Number(item?.measurementY ?? item?.measurement?.y ?? 0);
    return { x: Number.isFinite(x) && x > 0 ? x : null, y: Number.isFinite(y) && y > 0 ? y : null };
  }

  function gridFootprint(slot) {
    if (["amulet", "ring1", "ring2"].includes(slot)) return { x: 1, y: 1 };
    if (["weapon", "chest", "shield"].includes(slot)) return { x: 2, y: 3 };
    return { x: 2, y: 2 };
  }

  function iconDisplaySize(item, slot) {
    const r = item?.iconCapture;
    const actual = getItemMeasurement(item);
    const grid = gridFootprint(slot);
    const CELL = 52;
    const pad = 4;
    const slotW = grid.x * CELL + (grid.x - 1) * 6;
    const slotH = grid.y * CELL + (grid.y - 1) * 6;
    const actualW = actual.x ? actual.x * CELL : (r?.width || CELL);
    const actualH = actual.y ? actual.y * CELL : (r?.height || CELL);
    const maxW = Math.max(20, slotW - pad * 2);
    const maxH = Math.max(20, slotH - pad * 2);
    let w = Math.max(20, Math.min(actualW - pad, maxW));
    let h = Math.max(20, Math.min(actualH - pad, maxH));
    if (r?.width && r?.height) {
      const ratio = Number(r.width) / Number(r.height);
      if (Number.isFinite(ratio) && ratio > 0) {
        if (w / h > ratio) w = h * ratio;
        else h = w / ratio;
      }
    }
    return { width: Math.round(w), height: Math.round(h) };
  }

  function modifiers(obj) {
    const names = { damage: "Damage", strength: "STR", dexterity: "DEX", agility: "AGI", constitution: "CON", charisma: "CHA", intelligence: "INT", armour: "Armour", health: "HP", criticalAttack: "Crit", blockValue: "Block", hardening: "Hardening", healing: "Healing" };
    const out = [];
    for (const [key, value] of Object.entries(obj || {})) {
      if (!value) continue;
      if (key === "damage" && value.min != null && value.max != null) out.push(`${names[key]} ${fmtNum(value.min)}–${fmtNum(value.max)}`);
      else if (value.flat) out.push(`${names[key] || key} ${Number(value.flat) > 0 ? "+" : ""}${fmtNum(value.flat)}`);
      if (value.percent) out.push(`${names[key] || key} ${Number(value.percent) > 0 ? "+" : ""}${fmtNum(value.percent)}%`);
    }
    return out;
  }

  function normalizeHoverTooltipRows(item) {
    if (Array.isArray(item?.statDisplayRows) && item.statDisplayRows.length) {
      return item.statDisplayRows
        .filter(row => row?.key && row?.baseText)
        .map(row => ({ key: String(row.key), baseText: normalize(row.baseText), throughText: row.throughText == null ? null : normalize(row.throughText) }));
    }

    const raw = item?.rawTooltipJson;
    if (!raw) return [];
    let data;
    try { data = typeof raw === "string" ? JSON.parse(raw) : raw; } catch (_) { return []; }

    // Equipment tooltips are wrapped as [rows], while auction items in v0.3.3
    // persist the first tooltip group directly as rows. Normalize both shapes.
    let group = data;
    if (Array.isArray(item?.categoryValue) === false && Array.isArray(data?.[0]) && Array.isArray(data?.[0]?.[0])) {
      group = data[0];
    }
    if (!Array.isArray(group)) return [];

    const statAliases = [
      ["strength", /^(?:strength)\b/i], ["dexterity", /^(?:dexterity)\b/i],
      ["agility", /^(?:agility)\b/i], ["constitution", /^(?:constitution)\b/i],
      ["charisma", /^(?:charisma)\b/i], ["intelligence", /^(?:intelligence)\b/i],
      ["armour", /^(?:armour|armor)\b/i], ["health", /^(?:health|life points|hp)\b/i],
      ["damage", /^(?:damage|dmg)\b/i], ["criticalAttack", /^(?:critical attack(?: value)?|crit(?:ical)?)\b/i],
      ["blockValue", /^(?:block(?: value)?)\b/i], ["hardening", /^(?:hardening|resilience)\b/i],
      ["healing", /^(?:healing)\b/i]
    ];
    const canonical = text => {
      for (const [key, pattern] of statAliases) if (pattern.test(String(text || ""))) return key;
      return null;
    };
    const collect = (value, out = []) => {
      if (typeof value === "string" || typeof value === "number") {
        const text = String(value).replace(/<[^>]*>/g, " ").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
        if (text) out.push(text);
      } else if (Array.isArray(value)) {
        value.forEach(v => collect(v, out));
      } else if (value && typeof value === "object") {
        Object.values(value).forEach(v => collect(v, out));
      }
      return out;
    };

    const result = [];
    for (const entry of group) {
      const cells = [...new Set(collect(entry?.[0] ?? entry))].filter(Boolean);
      if (!cells.length) continue;
      if (/^through durability$/i.test(cells.join(" "))) continue;
      if (/^(?:level|value|durability|conditioning|soul bound to)\b/i.test(cells.join(" "))) continue;
      const key = canonical(cells[0]);
      if (!key || result.some(row => row.key === key)) continue;
      result.push({ key, baseText: cells[0], throughText: cells.length > 1 ? cells[1] : null });
    }
    return result;
  }

  function displayStatBaseText(item, row) {
    if (!row) return "";
    if (row.key === "damage" && item?.raw?.damage?.min != null && item?.raw?.damage?.max != null) {
      return `Damage ${fmtNum(item.raw.damage.min)}–${fmtNum(item.raw.damage.max)}`;
    }
    return row.baseText || "";
  }

  function displayThroughText(item, row) {
    if (!row) return "0";
    if (row.throughText != null && row.throughText !== "") return row.throughText;
    const value = item?.throughDurability?.[row.key];
    if (value?.percent) return `${Number(value.percent) > 0 ? "+" : ""}${fmtNum(value.percent)}%`;
    if (value?.flat) return `${Number(value.flat) > 0 ? "+" : ""}${fmtNum(value.flat)}`;
    return "0";
  }

  function createHoverTooltip(item, slot, target) {
    removeHoverTooltip();
    const tip = document.createElement("div");
    tip.className = "ga-hover-tooltip";
    tip.setAttribute("role", "tooltip");
    const img = item?.iconDataUrl || item?.iconUrl || "";
    const statRows = normalizeHoverTooltipRows(item);
    const statTable = statRows.length
      ? `<div class="ga-hover-section ga-hover-stat-table-section">
          <div class="ga-hover-stat-table">
            <div class="ga-hover-stat-table-header"><span></span><span>Through durability</span></div>
            ${statRows.map(row => `<div class="ga-hover-stat-table-row"><span>${esc(displayStatBaseText(item, row))}</span><span>${esc(displayThroughText(item, row))}</span></div>`).join("")}
          </div>
        </div>`
      : `<div class="ga-hover-section"><div class="ga-hover-stats"><span class="ga-hover-muted">None</span></div></div>`;
    tip.innerHTML = `
      <div class="ga-hover-head">
        ${img ? `<img class="ga-hover-icon" src="${esc(img)}" alt="">` : `<div class="ga-hover-icon ga-missing">?</div>`}
        <div class="ga-hover-title">
          <div class="ga-hover-name">${esc(item?.name || "Unknown item")}</div>
          <div class="ga-hover-meta">${esc(slot ? SLOT_LABELS[slot] : (item?.categoryLabel || "Auction item"))} · Lv ${esc(item?.level ?? "—")} · ${esc(qualityLabel(item?.quality))}</div>
        </div>
        ${slot && item?.fitTier ? `<span class="ga-tier">${esc(item.fitTier)}</span>` : ""}
      </div>
      ${statTable}
      <div class="ga-hover-grid">
        ${item?.auctionPrice != null ? `<div><span>Auction price</span><strong>${formatGold(item.auctionPrice)}</strong></div>` : ""}
        <div><span>Value</span><strong>${item?.value == null ? "—" : Number(item.value).toLocaleString()}</strong></div>
        <div><span>Durability</span><strong>${item?.durability?.percent == null ? "—" : `${item.durability.percent}%`}</strong></div>
        <div><span>Conditioning</span><strong>${item?.conditioning?.percent == null ? "—" : `${item.conditioning.percent}%`}</strong></div>
      </div>
      ${item?.categoryValue ? (() => {
        const cmp = getAuctionComparison(item);
        if (!cmp) return auctionCandidateSlot(item) ? `<div class="ga-hover-section"><div class="ga-hover-section-title">Equipment comparison</div><div class="ga-comparison-status ga-comparison-pending">${esc(auctionComparisonPendingLabel())}</div></div>` : "";
        if (cmp.status === "error") return `<div class="ga-hover-section"><div class="ga-hover-section-title">Equipment comparison</div><div class="ga-comparison-status ga-comparison-error">${esc(cmp.statusLabel)}</div><div class="ga-hover-muted" style="margin-top:4px">${esc(cmp.error || "Comparison unavailable.")}</div></div>`;
        const relativeText = cmp.relativeChange == null ? "—" : `${cmp.relativeChange >= 0 ? "+" : "−"}${Math.abs(cmp.relativeChange).toFixed(2)}%`;
        return `<div class="ga-hover-section"><div class="ga-hover-section-title">Equipment comparison</div>
          <div class="ga-comparison-status ga-comparison-${esc(cmp.status)}">${esc(cmp.status === "upgrade" ? "↑ Upgrade" : cmp.status === "worse" ? "↓ Worse" : "↔ Sidegrade")} · compares with ${esc(cmp.slotLabel)}</div>
          ${cmp.currentItem ? `<div class="ga-hover-muted" style="margin-top:4px">Current: ${esc(cmp.currentItem.name || "Unknown item")}</div>` : `<div class="ga-hover-muted" style="margin-top:4px">Current: No item equipped</div>`}
          <div class="ga-hover-grid" style="margin-top:6px">
            <div><span>Current win rate</span><strong>${cmp.baselineWinRate.toFixed(2)}%</strong></div>
            <div><span>New win rate</span><strong>${cmp.candidateWinRate.toFixed(2)}%</strong></div>
            <div><span>Change</span><strong>${statPriorityFormatDelta(cmp.deltaWinRate, 2)} pp</strong></div>
            <div><span>Relative</span><strong>${relativeText}</strong></div>
          </div>
          ${cmp.statDifferences?.length ? `<div class="ga-hover-stats" style="margin-top:4px">${cmp.statDifferences.map(r => `<div class="ga-hover-stat">${esc(r)}</div>`).join("")}</div>` : ""}
          <div class="ga-hover-muted" style="margin-top:4px">${fmtNum(cmp.simulations)} simulations · seed ${fmtNum(cmp.seed)}</div>
        </div>`;
      })() : ""}`;
    const name = tip.querySelector(".ga-hover-name");
    if (name) name.style.setProperty("color", qualityColor(item), "important");
    shadow.appendChild(tip);
    positionHoverTooltip(tip, target);
  }

  function positionHoverTooltip(tip, target) {
    const margin = 8;
    tip.style.left = "0px";
    tip.style.top = "0px";
    const rect = target.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tr = tip.getBoundingClientRect();
    let left = rect.right + margin;
    if (left + tr.width > vw - margin) left = rect.left - tr.width - margin;
    left = Math.max(margin, Math.min(left, vw - tr.width - margin));
    let top = rect.top;
    if (top + tr.height > vh - margin) top = rect.bottom - tr.height;
    top = Math.max(margin, Math.min(top, vh - tr.height - margin));
    tip.style.left = `${Math.round(left)}px`;
    tip.style.top = `${Math.round(top)}px`;
  }

  function removeHoverTooltip() { shadow?.querySelectorAll(".ga-hover-tooltip, .ga-stat-tooltip")?.forEach(el => el.remove()); }

  function renderItem(slot, item, cell) {
    cell.replaceChildren();
    if (!item) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ga-item-visual";
    btn.setAttribute("aria-label", `${SLOT_LABELS[slot]}: ${item.name || "Unknown item"}`);
    const size = iconDisplaySize(item, slot);
    const img = document.createElement("img");
    img.className = "ga-item-icon";
    img.alt = "";
    img.src = item.iconDataUrl || item.iconUrl || "";
    img.style.width = `${size.width}px`;
    img.style.height = `${size.height}px`;
    img.style.setProperty("object-fit", "contain", "important");
    if (!img.src) {
      img.replaceWith(Object.assign(document.createElement("span"), { className: "ga-missing", textContent: "?" }));
    }
    btn.appendChild(img);
    btn.addEventListener("mouseenter", () => createHoverTooltip(item, slot, btn));
    btn.addEventListener("mouseleave", removeHoverTooltip);
    btn.addEventListener("focus", () => createHoverTooltip(item, slot, btn));
    btn.addEventListener("blur", removeHoverTooltip);
    cell.appendChild(btn);
  }

  function renderEquipment(equipment) {
    currentEquipment = equipment || {};
    for (const slot of SLOT_ORDER) {
      const cell = shadow?.querySelector(`[data-slot="${slot}"]`);
      if (cell) renderItem(slot, currentEquipment?.[slot] || null, cell);
    }
    removeHoverTooltip();
  }

  function renderSelectedCharacterProfile() {
    const profile = selectedCharacterProfile();
    renderCharacterSelectors();
    renderEquipment(profile?.equipment || {});
    const equipmentStatus = shadow?.querySelector("#ga-equipment-status");
    const statsStatus = shadow?.querySelector("#ga-character-stats-status");
    if (profile) {
      const itemCount = Object.values(profile.equipment || {}).filter(Boolean).length;
      const updated = profile.equipmentUpdatedAt || profile.statsUpdatedAt || profile.capturedAt;
      const timestamp = updated ? new Date(updated).toLocaleString() : "never";
      const live = String(profile.dollId) === String(currentPageDollId()) ? " · Live page" : "";
      if (equipmentStatus) equipmentStatus.textContent = `${characterDisplayName(profile)} · ${itemCount}/9 equipped items · ${timestamp}${live}`;
      if (statsStatus) {
        const statsUpdated = profile.statsUpdatedAt ? new Date(profile.statsUpdatedAt).toLocaleString() : "never";
        statsStatus.textContent = `${characterDisplayName(profile)} · Last saved stats: ${statsUpdated}${live}`;
      }
    } else {
      if (equipmentStatus) equipmentStatus.textContent = "No captured character profiles yet.";
      if (statsStatus) statsStatus.textContent = "No captured character profiles yet.";
    }
    renderStats();
    renderDiagnostics(profile?.diagnostics || null, false);
  }

  const TRAINABLE_STAT_KEYS = ["strength", "dexterity", "agility", "constitution", "charisma", "intelligence"];
  const SPECIAL_STAT_KEYS = ["armour", "damage", "health"];

  const STAT_DISPLAY_NAMES = Object.freeze({
    strength: "Strength",
    dexterity: "Dexterity",
    agility: "Agility",
    constitution: "Constitution",
    charisma: "Charisma",
    intelligence: "Intelligence",
    armour: "Armour",
    damage: "Damage",
    health: "Life Points"
  });

  function statDetails(key, stats) {
    const currentRaw = stats?.[key];
    const current = Number(currentRaw);
    const live = stats?.statDetails?.[key] || {};
    const base = Number.isFinite(Number(live.base)) ? Number(live.base) : null;
    const max = Number.isFinite(Number(live.max)) ? Number(live.max) : null;
    return {
      current: Number.isFinite(current) ? current : (currentRaw ?? null),
      base,
      max
    };
  }

  function addTooltipRow(container, label, value) {
    if (value == null || value === "") return;
    const row = document.createElement("div");
    row.className = "ga-stat-tooltip-row";
    const left = document.createElement("span");
    left.textContent = label;
    const right = document.createElement("strong");
    right.textContent = String(value);
    row.append(left, right);
    container.appendChild(row);
  }

  function createStatTooltip(key, target) {
    removeHoverTooltip();
    const stats = selectedCharacterStats();
    const tip = document.createElement("div");
    tip.className = "ga-stat-tooltip";
    tip.setAttribute("role", "tooltip");
    const name = STAT_DISPLAY_NAMES[key] || key;
    const title = document.createElement("div");
    title.className = "ga-stat-tooltip-title";
    title.textContent = name;
    tip.appendChild(title);

    if (TRAINABLE_STAT_KEYS.includes(key)) {
      const details = statDetails(key, stats);
      addTooltipRow(tip, "Base", details.base);
      addTooltipRow(tip, "Max", details.max);
      if (details.base == null || details.max == null) {
        const note = document.createElement("div");
        note.className = "ga-stat-tooltip-note";
        note.textContent = "Captured stat details unavailable for this character.";
        tip.appendChild(note);
      }
    } else if (key === "damage") {
      const d = stats?.combatDetails?.damage || {};
      addTooltipRow(tip, "Current", d.current);
      addTooltipRow(tip, "Basic", d.basic);
      addTooltipRow(tip, "Through items", d.throughItems);
      addTooltipRow(tip, "Through strength", d.throughStrength);
      addTooltipRow(tip, "Through reinforcement", d.throughReinforcement);
      addTooltipRow(tip, "Critical damage", d.criticalDamage);
      addTooltipRow(tip, "Crit through items", d.criticalThroughItems);
      addTooltipRow(tip, "Crit through dexterity", d.criticalThroughDexterity);
      addTooltipRow(tip, "Critical chance", d.criticalChance);
    } else if (key === "armour") {
      const a = stats?.combatDetails?.armour || {};
      addTooltipRow(tip, "Current", a.current);
      addTooltipRow(tip, "Absorbs damage", a.absorbsDamage);
      addTooltipRow(tip, "Resilience", a.resilience);
      addTooltipRow(tip, "Through items", a.resilienceThroughItems);
      addTooltipRow(tip, "Through agility", a.resilienceThroughAgility);
      addTooltipRow(tip, "Avoid critical hits", a.avoidCriticalChance);
      addTooltipRow(tip, "Blocking value", a.blockingValue);
      addTooltipRow(tip, "Block through items", a.blockingThroughItems);
      addTooltipRow(tip, "Block through strength", a.blockingThroughStrength);
      addTooltipRow(tip, "Block chance", a.blockChance);
    } else if (key === "health") {
      const h = stats?.combatDetails?.health || {};
      addTooltipRow(tip, "Current / Maximum", h.current);
      addTooltipRow(tip, "Life on level", h.lifeOnLevel);
      addTooltipRow(tip, "Through items", h.throughItems);
      addTooltipRow(tip, "Through reinforcement", h.throughReinforcement);
      addTooltipRow(tip, "Through Constitution", h.bonusThroughConstitution);
      addTooltipRow(tip, "Regeneration", h.regeneration);
      addTooltipRow(tip, "Through Constitution", h.regenerationThroughConstitution);
      addTooltipRow(tip, "By level", h.regenerationByLevel);
      addTooltipRow(tip, "Through guild", h.regenerationThroughGuild);
      addTooltipRow(tip, "Through pact", h.regenerationThroughPact);
      addTooltipRow(tip, "By costumes", h.regenerationByCostumes);
      addTooltipRow(tip, "From blessing", h.regenerationFromBlessing);
    }

    shadow.appendChild(tip);
    positionHoverTooltip(tip, target);
  }

  function statDisplayValue(key, stats) {
    if (key === "damage") {
      const current = stats?.combatDetails?.damage?.current;
      if (current != null && current !== "") return current;
      const min = stats?.damageMin;
      const max = stats?.damageMax;
      if (min != null && max != null) return `${min}-${max}`;
      if (stats?.damage != null) return stats.damage;
      return "—";
    }
    if (key === "armour") {
      const current = stats?.combatDetails?.armour?.current;
      if (current != null && current !== "") return current;
      return stats?.armour ?? "—";
    }
    return stats?.[key] ?? "—";
  }

  function renderStats() {
    const stats = selectedCharacterStats();
    const el = shadow?.querySelector("#ga-stats-grid");
    if (!el) return;
    el.innerHTML = Object.entries(LABELS).map(([key, label]) => {
      const hoverable = TRAINABLE_STAT_KEYS.includes(key) || SPECIAL_STAT_KEYS.includes(key);
      return `<div class="ga-stat${hoverable ? " ga-stat-hoverable" : ""}"${hoverable ? ` data-stat-key="${esc(key)}" tabindex="0" aria-label="${esc(label)}"` : ""}><span>${esc(label)}</span><strong>${esc(statDisplayValue(key, stats))}</strong></div>`;
    }).join("");
    el.querySelectorAll(".ga-stat-hoverable").forEach(statEl => {
      const key = statEl.dataset.statKey;
      statEl.addEventListener("mouseenter", () => createStatTooltip(key, statEl));
      statEl.addEventListener("mouseleave", removeHoverTooltip);
      statEl.addEventListener("focus", () => createStatTooltip(key, statEl));
      statEl.addEventListener("blur", removeHoverTooltip);
    });
  }

  function masterDiagnosticCombatStoreSummary(store) {
    const reports = Array.isArray(store?.reports) ? store.reports : [];
    const latest = reports[0] || null;
    return {
      updatedAt: store?.updatedAt || null,
      reportCount: reports.length,
      latest: latest ? {
        reportId: latest.reportId || null,
        capturedAt: latest.capturedAt || null,
        updatedAt: latest.updatedAt || null,
        reportType: latest.reportType || null,
        combatFormat: latest.combatFormat || null,
        arenaType: latest.arenaType || null,
        totalEvents: latest.totalEvents ?? null,
        outcome: latest.outcome || null,
        captureDiagnostics: latest.captureDiagnostics || null
      } : null
    };
  }

  function masterDiagnosticCharacterProfiles() {
    const profiles = characterProfileStore?.characters || {};
    return Object.fromEntries(Object.entries(profiles).map(([dollId, profile]) => [String(dollId), {
      dollId: profile?.dollId ?? dollId,
      name: profile?.name || null,
      className: profile?.className || null,
      roleKey: profile?.roleKey || null,
      capturedAt: profile?.capturedAt || null,
      statsUpdatedAt: profile?.statsUpdatedAt || null,
      equipmentUpdatedAt: profile?.equipmentUpdatedAt || null,
      diagnostics: profile?.diagnostics || null
    }]));
  }

  function masterDiagnosticPreviewEvent(event) {
    const details = event?.details;
    let detailPreview = null;
    if (details !== undefined) {
      try {
        const text = JSON.stringify(details);
        detailPreview = text && text.length > 900 ? `${text.slice(0, 900)}…` : text;
      } catch (_) { detailPreview = String(details); }
    }
    return {
      at: event?.at || null,
      source: event?.source || null,
      event: event?.event || null,
      details: detailPreview
    };
  }

  function masterDiagnosticSourcePreview(value) {
    if (!value || typeof value !== "object") return value ?? null;
    if (Array.isArray(value)) return { type: "array", count: value.length };
    return {
      type: "object",
      keys: Object.keys(value).slice(0, 40),
      keyCount: Object.keys(value).length
    };
  }

  async function buildMasterDiagnostics({ full = false } = {}) {
    const allEvents = [
      ...(autoCombatDiagnostics?.events || []).map(event => ({ source: "auto-combat", ...event })),
      ...(statPriorityDiagnostics?.events || []).map(event => ({ source: "stat-priority", ...event })),
      ...(auctionComparisonDiagnostics?.events || []).map(event => ({ source: "auction-comparison", ...event }))
    ].sort((a, b) => String(b?.at || "").localeCompare(String(a?.at || ""))).slice(0, MASTER_DIAGNOSTIC_MAX_EVENTS);

    let storedEquipmentDiagnostic = latestEquipmentDiagnostic;
    if (full && !storedEquipmentDiagnostic) storedEquipmentDiagnostic = await loadLastDiagnostic();

    const equipmentSource = {
      characterCapture: storedEquipmentDiagnostic,
      visibleComparisonCapture: auctionComparisonDiagnostics?.lastVisibleEquipmentScan || null
    };

    const allCharacters = masterDiagnosticCharacterProfiles();
    const fullSources = {
      equipment: equipmentSource,
      auctionScan: latestAuctionDiagnostic || currentAuctionScan?.diagnostics || null,
      characterProfiles: allCharacters,
      expeditionCombat: masterDiagnosticCombatStoreSummary(combatCaptureStore),
      arenaCombat: masterDiagnosticCombatStoreSummary(arenaCombatStore),
      circusCombat: masterDiagnosticCombatStoreSummary(circusCombatStore),
      dungeonCombat: masterDiagnosticCombatStoreSummary(dungeonCombatStore),
      autoCombat: {
        updatedAt: autoCombatDiagnostics?.updatedAt || null,
        eventCount: Array.isArray(autoCombatDiagnostics?.events) ? autoCombatDiagnostics.events.length : 0
      },
      statPriority: {
        updatedAt: statPriorityDiagnostics?.updatedAt || null,
        eventCount: Array.isArray(statPriorityDiagnostics?.events) ? statPriorityDiagnostics.events.length : 0
      },
      auctionComparison: {
        updatedAt: auctionComparisonDiagnostics?.updatedAt || null,
        active: auctionComparisonDiagnostics?.active || null,
        lastCompleted: auctionComparisonDiagnostics?.lastCompleted || null,
        eventCount: Array.isArray(auctionComparisonDiagnostics?.events) ? auctionComparisonDiagnostics.events.length : 0
      }
    };

    const sources = full ? fullSources : {
      equipment: masterDiagnosticSourcePreview(equipmentSource),
      auctionScan: masterDiagnosticSourcePreview(latestAuctionDiagnostic || currentAuctionScan?.diagnostics || null),
      characterProfiles: { count: Object.keys(allCharacters).length, dollIds: Object.keys(allCharacters) },
      expeditionCombat: fullSources.expeditionCombat,
      arenaCombat: fullSources.arenaCombat,
      circusCombat: fullSources.circusCombat,
      dungeonCombat: fullSources.dungeonCombat,
      autoCombat: fullSources.autoCombat,
      statPriority: fullSources.statPriority,
      auctionComparison: fullSources.auctionComparison
    };

    return {
      schemaVersion: 2,
      mode: full ? "full" : "preview",
      at: new Date().toISOString(),
      extensionVersion: VERSION,
      diagnosticCaptureEnabled: diagnosticCaptureEnabled(),
      page: {
        url: location.href,
        pathname: location.pathname,
        hostname: location.hostname,
        title: document.title || "",
        bodyId: document.body?.id || "",
        activeTab
      },
      settings: {
        simulationCount: globalSimulationCount(),
        routine: Array.isArray(settings?.routine) ? [...settings.routine] : [],
        automation: settings?.automation ? { ...settings.automation } : null,
        diagnosticCaptureEnabled: diagnosticCaptureEnabled()
      },
      runtimeSnapshot: full ? (() => {
        try { return autoCombatDiagnosticSnapshot(); } catch (error) { return { error: error?.message || String(error) }; }
      })() : { summary: "Full runtime snapshot is included in Copy master diagnostic output." },
      sources,
      eventTimeline: full
        ? allEvents
        : allEvents.slice(0, MASTER_DIAGNOSTIC_PREVIEW_EVENTS).map(masterDiagnosticPreviewEvent)
    };
  }

  async function refreshMasterDiagnostics() {
    if (masterDiagnosticRefreshPromise) return masterDiagnosticRefreshPromise;
    masterDiagnosticRefreshPromise = (async () => {
      const el = shadow?.querySelector("#ga-master-diagnostic-text");
      if (el) el.textContent = "Refreshing master diagnostic preview…";
      try {
        const snapshot = await buildMasterDiagnostics({ full: false });
        const previewText = JSON.stringify(snapshot, null, 2);
        if (el) el.textContent = previewText;
        const status = shadow?.querySelector("#ga-master-diagnostic-status");
        if (status) {
          const autoCount = autoCombatDiagnostics?.events?.length || 0;
          const statCount = statPriorityDiagnostics?.events?.length || 0;
          const auctionCount = auctionComparisonDiagnostics?.events?.length || 0;
          status.textContent = `Updated ${new Date().toLocaleTimeString()} · ${autoCount + statCount + auctionCount} timeline events · showing latest ${Math.min(MASTER_DIAGNOSTIC_PREVIEW_EVENTS, autoCount + statCount + auctionCount)} · Capture ${diagnosticCaptureEnabled() ? "ON" : "OFF"}`;
        }
        return previewText;
      } finally {
        masterDiagnosticRefreshPromise = null;
      }
    })();
    return masterDiagnosticRefreshPromise;
  }

  function renderDiagnosticCaptureControls() {
    const button = shadow?.querySelector("#ga-toggle-diagnostic-capture");
    const status = shadow?.querySelector("#ga-diagnostic-capture-state");
    const text = shadow?.querySelector("#ga-master-diagnostic-text");
    const masterStatus = shadow?.querySelector("#ga-master-diagnostic-status");
    const enabled = diagnosticCaptureEnabled();
    if (button) {
      button.textContent = enabled ? "Diagnostic Capture: ON" : "Diagnostic Capture: OFF";
      button.setAttribute("aria-pressed", String(enabled));
      button.classList.toggle("ga-primary", enabled);
      button.classList.toggle("ga-secondary", !enabled);
    }
    if (status) status.textContent = enabled
      ? "All diagnostic collectors are active."
      : "Diagnostic capture is disabled; existing diagnostics are preserved and no new diagnostic events are recorded.";
    if (text && !masterDiagnosticRefreshPromise && !masterDiagnosticText) {
      text.textContent = "Master diagnostic is not rendered yet. Click Refresh to build the lightweight preview or Copy to export the full diagnostic.";
    }
    if (masterStatus && !masterDiagnosticText && !masterStatus.textContent) masterStatus.textContent = "Not refreshed yet.";
  }

  async function toggleDiagnosticCapture() {
    settings = normalizeSettings(settings || defaultSettings());
    settings.diagnosticCaptureEnabled = !diagnosticCaptureEnabled();
    if (!settings.diagnosticCaptureEnabled) {
      auctionComparisonDiagnostics.active = null;
    }
    await storageSet({ settings });
    renderDiagnosticCaptureControls();
  }

  async function clearMasterDiagnostics() {
    const keys = [
      diagnosticKey(),
      autoCombatDiagnosticKey(),
      statPriorityDiagnosticKey(),
      auctionDiagnosticKey(),
      auctionComparisonDiagnosticKey()
    ];
    await Promise.all(keys.map(key => storageRemove(key).catch(() => {})));
    autoCombatDiagnostics = { schemaVersion: 1, updatedAt: null, events: [] };
    statPriorityDiagnostics = { schemaVersion: 1, updatedAt: null, events: [] };
    auctionComparisonDiagnostics = { schemaVersion: 1, updatedAt: null, active: null, lastCompleted: null, events: [] };
    latestEquipmentDiagnostic = null;
    latestAuctionDiagnostic = null;
    if (characterProfileStore?.characters) {
      for (const profile of Object.values(characterProfileStore.characters)) delete profile.diagnostics;
      await saveCharacterProfileStore();
    }
    if (currentAuctionStore?.categories) {
      for (const snapshot of Object.values(currentAuctionStore.categories)) {
        if (snapshot && typeof snapshot === "object") delete snapshot.diagnostics;
      }
      await storageSet({ [auctionKey()]: currentAuctionStore });
    }
    masterDiagnosticText = "";
    const text = shadow?.querySelector("#ga-master-diagnostic-text");
    const status = shadow?.querySelector("#ga-master-diagnostic-status");
    if (text) text.textContent = "Diagnostics cleared. Click Refresh to build a new master diagnostic preview.";
    if (status) status.textContent = `Cleared ${new Date().toLocaleTimeString()} · Capture ${diagnosticCaptureEnabled() ? "ON" : "OFF"}`;
    renderAutoCombatDiagnostics();
    renderStatPriorityDiagnostics();
    renderAuctionComparisonDiagnostics();
    renderAuctionDiagnostics(null);
  }

  async function copyMasterDiagnostics(event) {
    const button = event?.currentTarget || shadow?.querySelector("#ga-copy-master-diagnostics");
    try {
      const fullSnapshot = await buildMasterDiagnostics({ full: true });
      const text = JSON.stringify(fullSnapshot, null, 2);
      masterDiagnosticText = text;
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement("textarea");
        area.value = text; area.readOnly = true; area.style.position = "fixed"; area.style.left = "-9999px";
        document.body.appendChild(area); area.select();
        if (!document.execCommand("copy")) throw new Error("Copy failed");
        area.remove();
      }
      const status = shadow?.querySelector("#ga-master-diagnostic-status");
      if (status) status.textContent = `Copied ${new Date().toLocaleTimeString()} · full master diagnostic · ${fullSnapshot.eventTimeline.length} timeline events · Capture ${diagnosticCaptureEnabled() ? "ON" : "OFF"}`;
      if (button) {
        button.textContent = "Copied!";
        setTimeout(() => { if (button.isConnected) button.textContent = "Copy master diagnostic"; }, 1200);
      }
    } catch (error) {
      if (button) {
        button.textContent = "Copy failed";
        setTimeout(() => { if (button.isConnected) button.textContent = "Copy master diagnostic"; }, 1400);
      }
    }
  }

  function renderDiagnostics(d = null, changed = null) {
    const pillsEl = shadow?.querySelector("#ga-diagnostics-pills");
    const textEl = shadow?.querySelector("#ga-diagnostic-text");
    const previewEl = shadow?.querySelector("#ga-icon-preview");
    if (!pillsEl || !textEl || !previewEl) return;
    if (!d) {
      pillsEl.innerHTML = "";
      textEl.textContent = "No scan yet.";
      previewEl.innerHTML = "";
      return;
    }
    const pills = [
      ["slots", `${d.slotsDetected ?? 0}/9`], ["items", `${d.acceptedTooltips ?? 0}`], ["icons", `${d.iconsFound ?? 0}`],
      ["PNG", `${d.iconPngCached ?? 0}`], ["unique crops", `${d.iconCaptureUniqueRects ?? 0}/${d.iconScreenshotReady ?? 0}`],
      ["duplicate crops", `${d.duplicateIconRects?.length ?? 0}`], ["PNG duplicates", `${d.duplicateIconPngs?.length ?? 0}`],
      ["quality", `${d.qualitiesDetected ?? 0}`], ["% stats", `${d.rawPercentStatsDetected ?? 0}`],
      ["through durability", `${d.throughDurabilityDetected ?? 0}`], ["durability", `${d.durabilityDetected ?? 0}`],
      ["conditioning", `${d.conditioningDetected ?? 0}`], ["value", `${d.valuesDetected ?? 0}`]
    ];
    pillsEl.innerHTML = pills.map(([k, v]) => `<span class="ga-diag-pill"><b>${esc(k)}</b>: ${esc(v)}</span>`).join("");
    textEl.textContent = JSON.stringify({ ...d, equipmentChanged: changed }, null, 2);
    const bySlot = currentEquipment || {};
    previewEl.innerHTML = SLOT_ORDER.map(slot => {
      const item = bySlot?.[slot];
      if (!item) return `<div class="ga-preview"><div class="ga-preview-slot">${esc(SLOT_LABELS[slot])}</div><div class="ga-preview-missing">—</div></div>`;
      const src = item.iconDataUrl || item.iconUrl || "";
      return `<div class="ga-preview"><div class="ga-preview-slot">${esc(SLOT_LABELS[slot])}</div>${src ? `<img src="${esc(src)}" alt="">` : `<div class="ga-preview-missing">?</div>`}</div>`;
    }).join("");
  }

  async function copyDiagnostics() {
    const el = shadow?.querySelector("#ga-copy-diagnostics");
    const text = shadow?.querySelector("#ga-diagnostic-text")?.textContent || "";
    if (!text.trim() || text.trim() === "No scan yet.") {
      if (el) {
        el.textContent = "Nothing to copy";
        setTimeout(() => { el.textContent = "Copy diagnostics"; }, 1200);
      }
      return;
    }
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement("textarea");
        area.value = text; area.readOnly = true; area.style.position = "fixed"; area.style.left = "-9999px";
        document.body.appendChild(area); area.select();
        if (!document.execCommand("copy")) throw new Error("Copy failed");
        area.remove();
      }
      if (el) {
        el.textContent = "Copied!";
        setTimeout(() => { el.textContent = "Copy diagnostics"; }, 1200);
      }
    } catch (_) {
      if (el) {
        el.textContent = "Copy failed";
        setTimeout(() => { el.textContent = "Copy diagnostics"; }, 1400);
      }
    }
  }

  const SETTINGS_STAT_KEYS = ["level", "strength", "dexterity", "agility", "constitution", "charisma", "intelligence", "armour", "damage"];

  function healingInventoryOptions() {
    const fallback = [
      [512, "Inventory I"],
      [513, "Inventory II"],
      [514, "Inventory III"],
      [515, "Inventory IV"],
      [516, "Inventory V"],
      [517, "Inventory VI"],
      [518, "Inventory VII"],
      [519, "Inventory VIII"]
    ];

    const tabs = [...document.querySelectorAll('#inventory_nav a[data-bag-number]')];
    if (!tabs.length) return fallback;

    const romanByIndex = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
    return tabs.map((tab, index) => {
      const bag = Number(tab.dataset.bagNumber);
      const label = `Inventory ${romanByIndex[index] || String(index + 1)}`;
      return {
        value: bag,
        label,
        available: String(tab.dataset.available) !== "false" && !tab.classList.contains("inactive")
      };
    }).filter(option => Number.isFinite(option.value));
  }

  function renderHealingInventorySelect() {
    const bagSelect = shadow?.querySelector('[data-auto-setting="healingBagNumber"]');
    if (!bagSelect) return;
    const current = configuredHealingBagNumber();
    const options = healingInventoryOptions();
    const values = new Set(options.map(option => Number(option.value)));
    if (!values.has(current)) {
      options.push({ value: current, label: `Inventory (${current})`, available: true });
    }
    bagSelect.innerHTML = options.map(option =>
      `<option value="${esc(option.value)}"${option.available === false ? " disabled" : ""}>${esc(option.label)}</option>`
    ).join("");
    bagSelect.value = String(current);
  }

  function renderItemComparisonSettings() {
    const modeInput = shadow?.querySelector('[data-comparison-setting="opponentMode"]');
    const enemyInput = shadow?.querySelector('[data-comparison-setting="expeditionEnemyKey"]');
    if (!modeInput || !enemyInput) return;
    const comparison = normalizeItemComparisonSettings(settings?.itemComparison);
    modeInput.value = comparison.opponentMode;
    const catalog = expeditionEnemyCatalog();
    const grouped = new Map();
    for (const row of catalog) {
      if (!grouped.has(row.countryName)) grouped.set(row.countryName, []);
      grouped.get(row.countryName).push(row);
    }
    enemyInput.innerHTML = Array.from(grouped.entries()).map(([countryName, rows]) => {
      const options = rows.map(row => `<option value="${esc(row.key)}">${esc(row.expeditionName)} — ${esc(row.name)}${row.isBoss ? " ★" : ""}</option>`).join("");
      return `<optgroup label="${esc(countryName)}">${options}</optgroup>`;
    }).join("");
    enemyInput.value = comparison.expeditionEnemyKey;
    enemyInput.disabled = comparison.opponentMode !== "expedition-enemy";
  }

  function currentItemComparisonSettings() {
    return normalizeItemComparisonSettings(settings?.itemComparison);
  }

  function renderSettings() {
    const globalSimulationInput = shadow?.querySelector('[data-setting="simulationCount"]');
    if (globalSimulationInput) globalSimulationInput.value = String(globalSimulationCount());
    renderItemComparisonSettings();
    const stats = shadow?.querySelector("#ga-settings-stats");
    if (!stats) return;
    stats.innerHTML = SETTINGS_STAT_KEYS.map(key => {
      const label = LABELS[key] || key;
      return `<label class="ga-field"><span>${esc(label)}</span><input data-setting-stat="${esc(key)}" type="number" value="${esc(settings?.stats?.[key] ?? 0)}"></label>`;
    }).join("");
    const automation = shadow.querySelector("#ga-settings-automation");
    if (automation) {
      const range = currentPreActionDelayRange();
      const minInput = automation.querySelector('[data-auto-setting="preActionDelayMinMs"]');
      const maxInput = automation.querySelector('[data-auto-setting="preActionDelayMaxMs"]');
      const hpInput = automation.querySelector('[data-auto-setting="minimumHpThresholdPercent"]');
      const opponentWinRateInput = automation.querySelector('[data-auto-setting="minimumOpponentWinRatePercent"]');
      const bagInput = automation.querySelector('[data-auto-setting="healingBagNumber"]');
      const lootActionInput = automation.querySelector('[data-auto-setting="postBattleLootAction"]');
      const noOverhealInput = automation.querySelector('[data-auto-setting="avoidHealingOverheal"]');
      const dungeonLossResetInput = automation.querySelector('[data-auto-setting="dungeonConsecutiveLossesBeforeReset"]');
      if (minInput) minInput.value = range.preActionDelayMinMs;
      if (maxInput) maxInput.value = range.preActionDelayMaxMs;
      if (hpInput) hpInput.value = range.minimumHpThresholdPercent;
      if (opponentWinRateInput) opponentWinRateInput.value = range.minimumOpponentWinRatePercent;
      if (bagInput) bagInput.value = range.healingBagNumber;
      if (lootActionInput) lootActionInput.value = range.postBattleLootAction;
      if (noOverhealInput) noOverhealInput.checked = !!range.avoidHealingOverheal;
      if (dungeonLossResetInput) dungeonLossResetInput.value = range.dungeonConsecutiveLossesBeforeReset;
      renderHealingInventorySelect();
    }
  }

  async function saveAvoidOverhealSettingFromUi() {
    const input = shadow?.querySelector('[data-auto-setting="avoidHealingOverheal"]');
    if (!input) return;
    settings = normalizeSettings(settings || defaultSettings());
    settings.automation = normalizeAutomationSettings({
      ...settings.automation,
      avoidHealingOverheal: !!input.checked,
      avoidHealingOverhealExplicit: true
    });
    try {
      await storageSet({ settings });
      const status = shadow?.querySelector("#ga-settings-status");
      if (status) {
        status.textContent = input.checked ? "Avoid overheal enabled." : "Avoid overheal disabled.";
        setTimeout(() => { if (status.textContent === (input.checked ? "Avoid overheal enabled." : "Avoid overheal disabled.")) status.textContent = ""; }, 1400);
      }
    } catch (error) {
      const status = shadow?.querySelector("#ga-settings-status");
      if (status) status.textContent = `Save failed: ${error?.message || String(error)}`;
    }
  }

  async function saveSettingsFromUi() {
    settings = normalizeSettings(settings || defaultSettings());
    const previousSimulationCount = globalSimulationCount();
    const previousItemComparison = JSON.stringify(currentItemComparisonSettings());
    const simulationInput = shadow.querySelector('[data-setting="simulationCount"]');
    settings.simulationCount = Math.max(1, Math.min(10000, Math.trunc(Number(simulationInput?.value) || 50)));
    settings.stats = settings.stats || {};
    for (const key of Object.keys(LABELS)) {
      const input = shadow.querySelector(`[data-setting-stat="${key}"]`);
      if (input) settings.stats[key] = Number(input.value || 0);
    }
    settings.itemComparison = normalizeItemComparisonSettings({
      opponentMode: String(shadow.querySelector('[data-comparison-setting="opponentMode"]')?.value || "player-clone"),
      expeditionEnemyKey: String(shadow.querySelector('[data-comparison-setting="expeditionEnemyKey"]')?.value || "")
    });
    settings.automation = normalizeAutomationSettings({
      preActionDelayMinMs: Number(shadow.querySelector('[data-auto-setting="preActionDelayMinMs"]')?.value),
      preActionDelayMaxMs: Number(shadow.querySelector('[data-auto-setting="preActionDelayMaxMs"]')?.value),
      minimumHpThresholdPercent: Number(shadow.querySelector('[data-auto-setting="minimumHpThresholdPercent"]')?.value),
      minimumOpponentWinRatePercent: Number(shadow.querySelector('[data-auto-setting="minimumOpponentWinRatePercent"]')?.value),
      healingBagNumber: Number(shadow.querySelector('[data-auto-setting="healingBagNumber"]')?.value),
      avoidHealingOverheal: !!shadow.querySelector('[data-auto-setting="avoidHealingOverheal"]')?.checked,
      avoidHealingOverhealExplicit: true,
      postBattleLootAction: String(shadow.querySelector('[data-auto-setting="postBattleLootAction"]')?.value || "thorough"),
      dungeonConsecutiveLossesBeforeReset: Number(shadow.querySelector('[data-auto-setting="dungeonConsecutiveLossesBeforeReset"]')?.value)
    });
    await storageSet({ settings });
    const itemComparisonChanged = previousItemComparison !== JSON.stringify(settings.itemComparison);
    if (previousSimulationCount !== settings.simulationCount) {
      auctionComparisonCurrentPlayerFingerprint = null;
      invalidateAuctionComparisons("global-simulation-count-changed");
      scheduleNativeEquipmentComparisonScan(60);
      statPriorityState.simulations = globalSimulationCount();
      statPriorityState.result = null;
      statPriorityState.manualResult = null;
      statPriorityState.training = null;
      void saveStatPriorityState("global-simulation-count-changed");
    }
    if (itemComparisonChanged && previousSimulationCount === settings.simulationCount) {
      auctionComparisonCurrentPlayerFingerprint = null;
      invalidateAuctionComparisons("item-comparison-settings-changed");
      scheduleNativeEquipmentComparisonScan(60);
    }
    renderItemComparisonSettings();
    renderStats(); renderTargets(); renderTraining();
    renderStatPriorityTab();
    renderNativeOpponentWinRateBadges();
    scheduleNativeOpponentWinRateAutoAnalysis();
    const status = shadow.querySelector("#ga-settings-status");
    if (status) { status.textContent = "Saved."; setTimeout(() => { status.textContent = ""; }, 1400); }
  }

  function currentAuctionPlayerFingerprintForStats(stats) {
    const engine = simulatorEngine();
    const equipment = statPriorityPlayerEquipment();
    if (!engine || !stats || !Object.keys(equipment || {}).length) return null;
    const comparisonSettings = auctionComparisonSettings();
    return auctionComparisonPlayerFingerprint(stats, equipment, engine, comparisonSettings.simulations, comparisonSettings.seed, comparisonSettings);
  }

  async function refreshStats({ passive = false, silent = false } = {}) {
    if (passive && characterCaptureBusy) return false;
    try {
      const response = await runtimeSend({ type: "PING" });
      const character = response?.character || null;
      const pageDollId = String(currentPageDollId() || "1");
      const reportedDollId = character?.dollId != null ? String(character.dollId) : null;
      if (reportedDollId && reportedDollId !== pageDollId) {
        if (!silent && statusEl) statusEl.textContent = "Live stats refresh rejected: page character identity changed.";
        return false;
      }
      const liveDollId = pageDollId;
      if (passive && !character?.statsPanelAvailable && !Object.keys(response?.state || {}).length) return false;
      let comparisonPlayerFingerprint = null;
      if (response?.state && Object.keys(response.state).length) {
        const liveState = augmentLiveStatsFromCurrentCombatReport(response.state);
        await acceptCurrentStatsState(liveState, { ...character, dollId: liveDollId });
        comparisonPlayerFingerprint = currentAuctionPlayerFingerprintForStats(liveState);
      }
      // The refresh target is always the character represented by the live page.
      // The selected UI character is never used as the storage key.
      renderCharacterSelectors();
      renderStats();
      if (comparisonPlayerFingerprint) {
        const previousFingerprint = auctionComparisonCurrentPlayerFingerprint;
        auctionComparisonCurrentPlayerFingerprint = comparisonPlayerFingerprint;
        if (!passive && previousFingerprint && previousFingerprint !== comparisonPlayerFingerprint) {
          invalidateAuctionComparisons("live-stats-refresh");
        }
      }
      renderAuctionList();
      if (!silent && statusEl) {
        const refreshedProfile = characterProfileStore.characters?.[liveDollId];
        const label = characterDisplayName(refreshedProfile || character || { dollId: liveDollId });
        statusEl.textContent = refreshedProfile && currentStatsAreComplete(refreshedProfile.stats)
          ? `Live stats refreshed for ${label}.`
          : `Live stats refreshed for ${label}; some profile values are not available on this page.`;
      }
      return true;
    } catch (_) {
      if (!passive && !silent && statusEl) statusEl.textContent = "Could not read live character stats.";
      return false;
    }
  }

  function startPassiveCharacterStatsRefresh() {
    if (characterStatsRefreshTimer) clearInterval(characterStatsRefreshTimer);
    characterStatsRefreshTimer = setInterval(() => { void refreshStats({ passive: true, silent: true }); }, CHARACTER_STATS_REFRESH_MS);
  }

  function baseFailureDiagnostics(stage, error) {
    return {
      scanStatus: "failed",
      failedStage: stage,
      tooltipCandidates: 0,
      acceptedTooltips: 0,
      rejectedSlotChar: 0,
      slotsDetected: 0,
      iconsFound: 0,
      iconScreenshotReady: 0,
      qualitiesDetected: 0,
      durabilityDetected: 0,
      conditioningDetected: 0,
      valuesDetected: 0,
      rawPercentStatsDetected: 0,
      throughDurabilityDetected: 0,
      itemIdsDetected: 0,
      itemHashesDetected: 0,
      itemMeasurementsDetected: 0,
      slotDomIds: [],
      itemDomClasses: [],
      iconCaptureRects: {},
      iconCaptureUniqueRects: 0,
      duplicateIconRects: [],
      duplicateIconPngs: [],
      viewport: { width: window.innerWidth, height: window.innerHeight, devicePixelRatio: window.devicePixelRatio || 1 },
      errors: [error?.message || String(error)]
    };
  }

  async function saveLastDiagnostic(diagnostic) {
    if (!diagnosticCaptureEnabled()) return false;
    latestEquipmentDiagnostic = diagnostic || null;
    try { await storageSet({ [diagnosticKey()]: diagnostic }); } catch (_) {}
    return true;
  }

  async function loadLastDiagnostic() {
    try {
      const result = await storageGet(diagnosticKey());
      return result?.[diagnosticKey()] || null;
    } catch (_) { return null; }
  }

  async function loadCharacterCaptureWorkflow() {
    try { return (await storageGet(characterCaptureWorkflowKey()))?.[characterCaptureWorkflowKey()] || null; } catch (_) { return null; }
  }

  async function saveCharacterCaptureWorkflow(workflow) { await storageSet({ [characterCaptureWorkflowKey()]: workflow }); }
  async function clearCharacterCaptureWorkflow() { try { await storageRemove(characterCaptureWorkflowKey()); } catch (_) {} }

  function updateCharacterCaptureStatus(text) {
    const status = shadow?.querySelector("#ga-equipment-status");
    if (status) status.textContent = text;
    if (statusEl && text) statusEl.textContent = text;
  }

  async function captureCurrentCharacterWithIcons() {
    const result = await runtimeSend({ type: "CAPTURE_CHARACTER_PROFILE" });
    if (!result || typeof result !== "object") throw new Error("The character profile service returned no response.");
    if (!result.ok && !result.character) throw new Error(result.error || "Character profile capture failed.");
    result.diagnostics = result.equipmentDiagnostics || baseFailureDiagnostics("parser", "Parser returned no diagnostics.");
    result.diagnostics.scanStatus = result.ok ? "success" : "failed";
    const rects = result.capture?.rects || {};
    if (Object.keys(rects).length && result.equipment) {
      try {
        const shot = await requestScreenshot();
        const viewport = result.capture?.viewport || result.diagnostics.viewport;
        const pngGroups = new Map();
        let captured = 0;
        for (const slot of SLOT_ORDER) {
          const item = result.equipment?.[slot];
          const rect = rects?.[slot];
          if (!item || !rect) continue;
          try {
            const png = await cropScreenshot(shot, rect, viewport);
            if (!png) continue;
            item.iconDataUrl = png;
            item.iconSource = "screenshot";
            captured++;
            if (!pngGroups.has(png)) pngGroups.set(png, []);
            pngGroups.get(png).push(slot);
          } catch (error) {
            result.diagnostics.errors = Array.isArray(result.diagnostics.errors) ? result.diagnostics.errors : [];
            result.diagnostics.errors.push(`${slot} icon crop: ${error?.message || String(error)}`);
          }
        }
        result.diagnostics.iconScreenshotCaptured = captured;
        result.diagnostics.iconScreenshotAttempted = Object.keys(rects).length;
        result.diagnostics.duplicateIconPngs = [...pngGroups.values()].filter(v => v.length > 1);
      } catch (error) {
        result.diagnostics.errors = Array.isArray(result.diagnostics.errors) ? result.diagnostics.errors : [];
        result.diagnostics.errors.push(`icon capture: ${error?.message || String(error)}`);
      }
    }
    return result;
  }

  async function persistCapturedCharacter(result) {
    const character = result.character || { dollId: currentPageDollId(), name: null };
    const dollId = String(character.dollId || currentPageDollId() || "1");
    await loadCharacterProfileStore();
    const previous = characterProfileStore.characters?.[dollId] || { schemaVersion: 1, dollId };
    const now = new Date().toISOString();
    const profile = {
      ...previous,
      schemaVersion: 1,
      dollId,
      name: character.name || previous.name || null,
      className: character.className || previous.className || null,
      roleKey: character.roleKey || previous.roleKey || null,
      roleRaw: character.roleRaw || previous.roleRaw || null,
      roleTooltip: character.roleTooltip || previous.roleTooltip || null,
      url: character.url || previous.url || location.href,
      stats: { ...(previous.stats || {}), ...(result.stats || {}) },
      statsUpdatedAt: now,
      equipment: result.equipment || previous.equipment || {},
      equipmentUpdatedAt: now,
      quickSignature: result.quickSignature || previous.quickSignature || null,
      fingerprint: result.fingerprint || previous.fingerprint || null,
      diagnostics: diagnosticCaptureEnabled() ? (result.diagnostics || previous.diagnostics || null) : (previous.diagnostics || null),
      capturedAt: now
    };
    characterProfileStore.characters[dollId] = profile;
    if (!(await saveCharacterProfileStore())) throw new Error("Could not save the character profile locally.");
    if (String(dollId) === String(currentPageDollId())) latestParsedState = profile.stats || latestParsedState;
    renderSelectedCharacterProfile();
    return profile;
  }

  async function startCharacterProfileCapture() {
    if (characterCaptureBusy) return;
    const existing = await loadCharacterCaptureWorkflow();
    if (existing?.active) { updateCharacterCaptureStatus("Character profile capture is already in progress…"); return; }
    characterCaptureBusy = true;
    try {
      const overview = currentOverviewHref();
      const workflow = { version: 1, active: true, phase: "navigate-overview", sourceUrl: location.href, dolls: [], index: 0, startedAt: new Date().toISOString() };
      await saveCharacterCaptureWorkflow(workflow);
      updateCharacterCaptureStatus("Opening Character Overview for full profile capture…");
      if (overview && overview !== location.href) location.href = overview;
      else {
        characterCaptureBusy = false;
        await resumeCharacterProfileCapture();
      }
    } catch (error) {
      await clearCharacterCaptureWorkflow();
      updateCharacterCaptureStatus(`Character capture failed: ${error?.message || String(error)}`);
    } finally { characterCaptureBusy = false; }
  }

  async function resumeCharacterProfileCapture() {
    if (characterCaptureBusy) return false;
    const workflow = await loadCharacterCaptureWorkflow();
    if (!workflow?.active) return false;
    characterCaptureBusy = true;
    try {
      if (workflow.phase === "navigate-overview") {
        const discovered = await runtimeSend({ type: "DISCOVER_CHARACTER_DOLLS" });
        if (!discovered?.dolls?.length) throw new Error("No character/doll selectors were found on the Character Overview.");
        workflow.dolls = discovered.dolls;
        workflow.phase = "capture";
        workflow.index = 0;
        await saveCharacterCaptureWorkflow(workflow);
      }
      const target = workflow.dolls?.[workflow.index];
      if (!target) {
        const sourceUrl = workflow.sourceUrl;
        await clearCharacterCaptureWorkflow();
        updateCharacterCaptureStatus(`Character capture complete · ${workflow.dolls?.length || 0} profiles.`);
        if (sourceUrl && sourceUrl !== location.href) location.href = sourceUrl;
        return true;
      }
      const currentDoll = currentPageDollId();
      if (currentDoll !== String(target.dollId)) {
        updateCharacterCaptureStatus(`Capturing ${workflow.index + 1}/${workflow.dolls.length}: ${target.className || target.dollId}…`);
        location.href = target.url;
        return true;
      }
      updateCharacterCaptureStatus(`Capturing ${workflow.index + 1}/${workflow.dolls.length}: ${target.className || target.dollId}…`);
      await new Promise(resolve => setTimeout(resolve, 120));
      const result = await captureCurrentCharacterWithIcons();
      await persistCapturedCharacter(result);
      workflow.index += 1;
      await saveCharacterCaptureWorkflow(workflow);
      const next = workflow.dolls?.[workflow.index];
      if (next) { location.href = next.url; return true; }
      const sourceUrl = workflow.sourceUrl;
      await clearCharacterCaptureWorkflow();
      updateCharacterCaptureStatus(`Character capture complete · ${workflow.dolls.length} profiles.`);
      if (sourceUrl && sourceUrl !== location.href) location.href = sourceUrl;
      return true;
    } catch (error) {
      const message = error?.message || String(error);
      await saveCharacterCaptureWorkflow({ ...(workflow || {}), active: false, phase: "error", error: message });
      updateCharacterCaptureStatus(`Character capture failed: ${message}`);
      return true;
    } finally { characterCaptureBusy = false; }
  }

  async function loadSavedEquipment() {
    await loadCharacterProfileStore();
    await loadCharacterSelection();
    const lastDiagnostic = await loadLastDiagnostic();
    latestEquipmentDiagnostic = lastDiagnostic || latestEquipmentDiagnostic || null;
    const mainProfile = characterProfileStore.characters?.["1"] || null;
    const profile = selectedCharacterProfile();
    const previousEquipmentFingerprint = savedEquipment?.equipment ? auctionComparisonEquipmentFingerprint(savedEquipment.equipment) : null;
    if (mainProfile?.equipment) {
      // Keep the simulator's baseline tied to the main character. The selector
      // only changes the visible equipment profile.
      savedEquipment = { ...mainProfile, equipment: mainProfile.equipment, scannedAt: mainProfile.equipmentUpdatedAt || mainProfile.capturedAt, savedAt: mainProfile.equipmentUpdatedAt || mainProfile.capturedAt };
    } else {
      savedEquipment = null;
    }
    const nextEquipmentFingerprint = savedEquipment?.equipment ? auctionComparisonEquipmentFingerprint(savedEquipment.equipment) : null;
    if (previousEquipmentFingerprint && !auctionComparisonFingerprintsMatch(previousEquipmentFingerprint, nextEquipmentFingerprint)) {
      invalidateAuctionComparisons("equipment-storage-change");
      scheduleNativeEquipmentComparisonScan(80);
    }
    if (profile) {
      renderSelectedCharacterProfile();
      renderAuctionList();
    } else {
      currentEquipment = {};
      renderSelectedCharacterProfile();
      const status = shadow.querySelector("#ga-equipment-status");
      if (status) status.textContent = lastDiagnostic?.scanStatus === "failed" ? "Last character profile capture failed." : "No saved character profile yet.";
      renderDiagnostics(lastDiagnostic);
    }
  }

  async function requestScreenshot() {
    const response = await runtimeSend({ type: "CAPTURE_VISIBLE_TAB" });
    if (!response?.ok || !response.dataUrl) throw new Error(response?.error || "Could not capture the Gladiatus tab.");
    return response.dataUrl;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Screenshot image could not be decoded."));
      img.src = src;
    });
  }

  async function cropScreenshot(dataUrl, rect, viewport) {
    if (!dataUrl || !rect || !viewport?.width || !viewport?.height) return null;
    const img = await loadImage(dataUrl);
    const scaleX = img.naturalWidth / viewport.width;
    const scaleY = img.naturalHeight / viewport.height;
    const left = Math.max(0, rect.left * scaleX);
    const top = Math.max(0, rect.top * scaleY);
    const right = Math.min(img.naturalWidth, (rect.left + rect.width) * scaleX);
    const bottom = Math.min(img.naturalHeight, (rect.top + rect.height) * scaleY);
    const width = Math.max(1, Math.round(right - left));
    const height = Math.max(1, Math.round(bottom - top));
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, Math.round(left), Math.round(top), width, height, 0, 0, width, height);
    return canvas.toDataURL("image/png");
  }

  function getCurrentAuctionCategory() {
    const select = document.querySelector('select[name="itemType"]');
    if (!select) return { value: null, label: null, select: null };
    const value = String(select.value ?? "0");
    const option = select.selectedOptions?.[0];
    const label = (option?.textContent || AUCTION_CATEGORY_MAP[value] || (value === "0" ? "All" : `Category ${value}`)).trim();
    return { value, label, select };
  }

  function auctionFilterLabel(value) {
    const key = String(value ?? "all");
    if (key === "all") return "All Items";
    if (key === "status:upgrade") return "Upgrades Only";
    if (key === "status:sidegrade") return "Sidegrades Only";
    if (key === "status:worse") return "Worse Items Only";
    return AUCTION_CATEGORY_MAP[key] || "Unknown";
  }

  function getAuctionFilterButton() {
    return document.querySelector('input[type="submit"][value="Filter"], input.awesome-button[type="submit"][value="Filter"]');
  }

  async function setAuctionCategoryAndFilter(value) {
    const select = document.querySelector('select[name="itemType"]');
    const filter = getAuctionFilterButton();
    if (!select) throw new Error("Auction category selector (itemType) was not found.");
    if (!filter) throw new Error("Auction Filter button was not found.");
    const target = String(value);
    if (String(select.value) === target) {
      await resumeAuctionWorkflow();
      return;
    }
    select.value = target;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await auctionDelayWithJitter(60, 40);
    filter.click();
    // If Gladiatus handles the filter without a full navigation, resume the
    // persisted workflow after the listing DOM has had time to refresh. If the
    // page navigates, this timer is discarded with the old document and the new
    // content script resumes the workflow from storage instead.
    const resumeDelay = AUCTION_TIMING.categorySettleMs + Math.floor(Math.random() * (AUCTION_TIMING.categoryJitterMs + 1));
    setTimeout(() => { resumeAuctionWorkflow().catch(() => {}); }, resumeDelay);
  }

  function currentAuctionStoreEmpty() {
    return { schemaVersion: 2, savedAt: new Date().toISOString(), categories: {}, nextScanSequence: 1, lastScannedCategory: null };
  }

  async function loadAuctionStoreRaw() {
    const current = await storageGet(auctionKey());
    if (current?.[auctionKey()]) {
      const store = current[auctionKey()];
      if (store?.categories && typeof store.categories === "object") {
        for (const [categoryValue, snapshot] of Object.entries(store.categories)) {
          if (!snapshot || !Array.isArray(snapshot.items)) continue;
          snapshot.items = snapshot.items.map(item => repairAuctionItemIdentity({ ...item }, categoryValue));
        }
      }
      // Loading auction data must be read-only. Writing the store here causes
      // browser.storage.onChanged to fire again, which can recursively reload
      // the auction store while the comparison queue is active.
      return store;
    }
    const legacy = await storageGet(legacyAuctionKey());
    if (legacy?.[legacyAuctionKey()]) {
      const old = legacy[legacyAuctionKey()];
      const value = String(old?.categoryValue ?? "legacy");
      const label = old?.categoryLabel || "Previously scanned";
      const migrated = {
        schemaVersion: 2,
        savedAt: new Date().toISOString(),
        categories: {
          [value]: {
            ...old,
            categoryValue: value,
            categoryLabel: label,
            scanSequence: 1,
            items: Array.isArray(old?.items) ? old.items.map((item, index) => repairAuctionItemIdentity({ ...item, categoryValue: value, categoryLabel: label, auctionIndex: index }, value)) : [],
            itemCount: Array.isArray(old?.items) ? old.items.length : 0
          }
        },
        nextScanSequence: 2,
        lastScannedCategory: value
      };
      try { await storageSet({ [auctionKey()]: migrated }); } catch (_) {}
      return migrated;
    }
    return null;
  }

  function normalizeAuctionStore(store) {
    if (store?.categories && typeof store.categories === "object") {
      return { ...currentAuctionStoreEmpty(), ...store, categories: { ...store.categories } };
    }
    return currentAuctionStoreEmpty();
  }

  function combinedAuctionItems(store = currentAuctionStore) {
    // The category bucket itself is the authoritative identity. Older saved
    // auction snapshots may contain an item.categoryValue that was copied from
    // another page/category, while the item is correctly stored under the
    // intended category bucket. Always canonicalize from the bucket so the
    // renderer, slot mapping, comparison fingerprints, and filtering agree.
    const categories = Object.entries(store?.categories || {})
      .filter(([, snapshot]) => snapshot && typeof snapshot === "object")
      .sort(([, a], [, b]) => Number(a.scanSequence || 0) - Number(b.scanSequence || 0));
    const items = [];
    for (const [bucketCategoryValue, snapshot] of categories) {
      const categoryValue = String(bucketCategoryValue ?? "0");
      const categoryLabel = snapshot.categoryLabel || AUCTION_CATEGORY_MAP[categoryValue] || (categoryValue === "0" ? "All" : `Category ${categoryValue}`);
      for (const rawItem of snapshot.items || []) {
        if (!rawItem || typeof rawItem !== "object") continue;
        const item = repairAuctionItemIdentity({ ...rawItem }, categoryValue);
        item.categoryValue = categoryValue;
        item.auctionCategoryValue = categoryValue;
        item.categoryLabel = categoryLabel;
        parseAuctionAffixes(item);
        items.push(item);
      }
    }
    return items;
  }

  async function loadAuctionSelection() {
    try {
      const result = await storageGet(auctionSelectionKey());
      const values = result?.[auctionSelectionKey()];
      if (Array.isArray(values)) return values.map(String).filter(v => AUCTION_CATEGORY_MAP[v]);
    } catch (_) {}
    return AUCTION_CATEGORIES.map(x => x.value);
  }

  async function saveAuctionSelection(values) {
    const valid = [...new Set((values || []).map(String).filter(v => AUCTION_CATEGORY_MAP[v]))];
    await storageSet({ [auctionSelectionKey()]: valid });
  }

  async function renderAuctionScanMenu() {
    const menu = shadow?.querySelector("#ga-auction-scan-menu");
    const button = shadow?.querySelector("#ga-select-scan-auction");
    if (!menu) return;
    menu.hidden = !auctionScanMenuOpen;
    if (button) button.setAttribute("aria-expanded", String(auctionScanMenuOpen));
    if (!auctionScanMenuOpen) return;
    const values = await loadAuctionSelection();
    if (!menu.isConnected || !auctionScanMenuOpen) return;
    for (const input of menu.querySelectorAll('input[data-auction-category]')) input.checked = values.includes(String(input.value));
  }

  function auctionScanSelectionFromUi() {
    return [...(shadow?.querySelectorAll('#ga-auction-scan-menu input[data-auction-category]:checked') || [])].map(x => String(x.value));
  }

  async function startSelectedAuctionScan() {
    const selected = auctionScanSelectionFromUi();
    if (!selected.length) {
      const status = shadow?.querySelector("#ga-auction-status");
      if (status) status.textContent = "Select at least one category.";
      return;
    }
    await saveAuctionSelection(selected);
    const current = getCurrentAuctionCategory();
    const state = {
      active: true,
      selectedValues: selected,
      index: 0,
      originalValue: current.value ?? "0",
      originalLabel: current.label || "All",
      stopRequested: false,
      readyRetries: 0,
      returning: false,
      originalScrollX: Number(window.scrollX || 0),
      originalScrollY: Number(window.scrollY || 0),
      startedAt: new Date().toISOString()
    };
    await storageSet({ [auctionWorkflowKey()]: state });
    auctionScanMenuOpen = false;
    await refreshAuctionControlState();
    await renderAuctionScanMenu();
    await resumeAuctionWorkflow();
  }

  async function getAuctionWorkflow() {
    try {
      const result = await storageGet(auctionWorkflowKey());
      return result?.[auctionWorkflowKey()] || null;
    } catch (_) { return null; }
  }

  async function clearAuctionWorkflow() {
    try { await storageRemove(auctionWorkflowKey()); } catch (_) {}
  }

  async function finishAuctionWorkflow(state, stopped = false) {
    const current = getCurrentAuctionCategory();
    const comparisonReady = !!state.comparisonReady && !stopped;
    state.active = false;
    state.returning = String(current.value ?? "0") !== String(state.originalValue ?? "0");
    await storageSet({ [auctionWorkflowKey()]: state });
    if (state.returning) {
      const status = shadow?.querySelector("#ga-auction-status");
      if (status) status.textContent = stopped ? "Stopping and returning to the original category…" : "Scan complete; returning to the original category…";
      await setAuctionCategoryAndFilter(state.originalValue || "0");
      return;
    }
    await clearAuctionWorkflow();
    window.scrollTo({ left: Number(state.originalScrollX || 0), top: Number(state.originalScrollY || 0), behavior: "auto" });
    await refreshAuctionControlState();
    const status = shadow?.querySelector("#ga-auction-status");
    if (status) status.textContent = stopped ? "Selected-category scan stopped." : "Selected categories scanned.";
    if (comparisonReady) queueAuctionComparisonsAfterCompletedScan();
  }

  async function stopAuctionWorkflow() {
    const state = await getAuctionWorkflow();
    const status = shadow?.querySelector("#ga-auction-status");
    if (state?.active) {
      state.stopRequested = true;
      await storageSet({ [auctionWorkflowKey()]: state });
      if (status) status.textContent = auctionScanInFlight ? "Stopping after the current category…" : "Stopping scan…";
      if (!auctionScanInFlight) await finishAuctionWorkflow(state, true);
      return;
    }
    if (auctionScanInFlight) {
      auctionScanStopRequested = true;
      if (status) status.textContent = "Stopping scan…";
    }
  }

  async function advanceAuctionWorkflow() {
    const state = await getAuctionWorkflow();
    if (!state?.active) return;
    if (state.stopRequested || state.index + 1 >= state.selectedValues.length) {
      if (!state.stopRequested) {
        state.comparisonReady = true;
        await storageSet({ [auctionWorkflowKey()]: state });
      }
      await finishAuctionWorkflow(state, !!state.stopRequested);
      return;
    }
    state.index += 1;
    await storageSet({ [auctionWorkflowKey()]: state });
    const nextValue = state.selectedValues[state.index];
    const status = shadow?.querySelector("#ga-auction-status");
    if (status) status.textContent = `Loading ${auctionFilterLabel(nextValue)}…`;
    await setAuctionCategoryAndFilter(nextValue);
  }

  async function resumeAuctionWorkflow() {
    if (auctionWorkflowResumeTimer) clearTimeout(auctionWorkflowResumeTimer);
    const state = await getAuctionWorkflow();
    if (!state) return;
    // A completed/stopped workflow may have returned to the original category
    // using a final filter submission. Clear that short-lived return marker when
    // the new page loads.
    if (!state.active && state.returning) {
      await new Promise(resolve => setTimeout(resolve, 300));
      window.scrollTo({ left: Number(state.originalScrollX || 0), top: Number(state.originalScrollY || 0), behavior: "auto" });
      const comparisonReady = !!state.comparisonReady && !state.stopRequested;
      await clearAuctionWorkflow();
      if (comparisonReady) queueAuctionComparisonsAfterCompletedScan();
      return;
    }
    if (!state.active) return;
    if (!document.querySelector('select[name="itemType"]')) return;
    if (state.stopRequested) {
      await finishAuctionWorkflow(state, true);
      return;
    }
    const current = getCurrentAuctionCategory();
    const target = String(state.selectedValues?.[state.index] ?? "");
    if (!target) {
      await clearAuctionWorkflow();
      return;
    }
    if (String(current.value) !== target) {
      auctionWorkflowResumeTimer = setTimeout(() => setAuctionCategoryAndFilter(target).catch(() => {}), 150);
      return;
    }
    const label = current.label || auctionFilterLabel(target);
    const progress = shadow?.querySelector("#ga-auction-progress");
    if (progress) { progress.hidden = false; progress.textContent = `Category ${state.index + 1}/${state.selectedValues.length}: ${label}`; }
    auctionWorkflowResumeTimer = setTimeout(async () => {
      auctionWorkflowResumeTimer = null;
      if (auctionScanInFlight) return;
      const ready = await waitForAuctionPageStable(target);
      if (!ready) {
        const retryCount = Number(state.readyRetries || 0);
        if (retryCount >= 2) {
          state.stopRequested = true;
          await storageSet({ [auctionWorkflowKey()]: state });
          const status = shadow?.querySelector("#ga-auction-status");
          if (status) status.textContent = `Could not confirm ${label} finished loading; stopping bulk scan.`;
          await finishAuctionWorkflow(state, true);
          return;
        }
        state.readyRetries = retryCount + 1;
        await storageSet({ [auctionWorkflowKey()]: state });
        const status = shadow?.querySelector("#ga-auction-status");
        if (status) status.textContent = `Waiting for ${label} to finish loading…`;
        const retryDelay = 700 + Math.floor(Math.random() * 301);
        auctionWorkflowResumeTimer = setTimeout(() => { resumeAuctionWorkflow().catch(() => {}); }, retryDelay);
        return;
      }
      if (state.readyRetries) {
        state.readyRetries = 0;
        await storageSet({ [auctionWorkflowKey()]: state });
      }
      await auctionDelayWithJitter(AUCTION_TIMING.domSampleMs, AUCTION_TIMING.domJitterMs);
      if (auctionScanInFlight) return;
      await scanAuction({ fromWorkflow: true });
    }, AUCTION_TIMING.domSampleMs);
  }

  function auctionItemImageSize(item) {
    const measurement = getItemMeasurement(item);
    const boxW = 72;
    const boxH = 72;
    const base = measurement.x && measurement.y ? {
      width: Math.max(18, measurement.x * 24),
      height: Math.max(18, measurement.y * 24)
    } : { width: 48, height: 48 };
    const ratio = base.width / Math.max(1, base.height);
    let width = Math.min(base.width, boxW);
    let height = Math.min(base.height, boxH);
    if (width / height > ratio) width = height * ratio;
    else height = width / ratio;
    return { width: Math.round(width), height: Math.round(height) };
  }

  function formatGold(value) {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return Math.round(n).toLocaleString();
  }


  const AUCTION_EQUIPMENT_CATEGORY_TO_SLOT = Object.freeze({
    "1": "weapon", "2": "shield", "3": "chest", "4": "helmet", "5": "gloves",
    "8": "boots", "6": "ring", "9": "amulet"
  });
  const AUCTION_COMPARISON_LABELS = Object.freeze({
    weapon: "Weapon", shield: "Shield", chest: "Chest Armour", helmet: "Helmet",
    gloves: "Gloves", boots: "Shoes", amulet: "Amulet", ring1: "Ring 1", ring2: "Ring 2"
  });

  function auctionCandidateSlot(item) {
    const mappedSlots = Array.isArray(item?.comparisonSlots)
      ? [...new Set(item.comparisonSlots.map(slot => String(slot || "").trim()).filter(Boolean))]
      : [];
    if (mappedSlots.length) {
      if (mappedSlots.every(slot => /^ring[12]$/.test(slot))) return "ring";
      if (mappedSlots.length === 1) return mappedSlots[0];
      return null;
    }
    return AUCTION_EQUIPMENT_CATEGORY_TO_SLOT[String(item?.categoryValue ?? item?.auctionCategoryValue ?? "")] || null;
  }

  function auctionComparisonItemFingerprint(item) {
    if (!item) return null;
    // Source-independent identity: the same equipment item may be encountered
    // in Auction, Inventory, dungeon/expedition rewards, or another item view.
    // Listing/category metadata is intentionally excluded so those surfaces share
    // the same persisted comparison result.
    return {
      itemId: item.itemId ?? null,
      itemHash: item.itemHash ?? null,
      itemLevel: item.itemLevel ?? item.level ?? null,
      raw: item.raw || null
    };
  }

  function auctionComparisonEquipmentFingerprint(equipment) {
    return Object.fromEntries(Object.keys(SLOT_TO_CONTAINER).map(slot => [slot, auctionComparisonItemFingerprint(equipment?.[slot] || null)]));
  }

  function auctionComparisonPlayerFingerprint(stats, equipment, engine, simulations, seed, comparisonSettings = null) {
    const fields = [
      "level", "strength", "dexterity", "agility", "constitution", "charisma", "intelligence",
      "armour", "damageMin", "damageMax", "lifeMax", "healthMax"
    ];
    const comparison = normalizeItemComparisonSettings(comparisonSettings || settings?.itemComparison);
    return JSON.stringify({
      engine: engine?.VERSION || "unknown",
      simulations,
      seed,
      stats: Object.fromEntries(fields.map(key => [key, stats?.[key] ?? null])),
      equipment: auctionComparisonEquipmentFingerprint(equipment),
      comparisonOpponent: { opponentMode: comparison.opponentMode, expeditionEnemyKey: comparison.expeditionEnemyKey }
    });
  }

  function auctionComparisonReasonAffectsPlayer(reason) {
    const value = String(reason || "");
    return /stat-priority|live-stats|equipment|general-state-change|global-simulation-count/.test(value) && !/auction/.test(value);
  }

  function invalidateAuctionComparisons(reason = "unspecified") {
    const normalizedReason = String(reason || "unspecified");
    // Comparison results are now shared across Auction and all other visible
    // equipment sources. Refreshing an auction listing set must therefore not
    // invalidate a universal item comparison that another screen/component may
    // still be consuming. Individual new/changed items receive their own keys.
    if (["auction-scan-start", "auction-store-storage-change", "auction-gold-icon-storage-change"].includes(normalizedReason)) {
      recordAuctionComparisonDiagnostic("invalidation-skipped-source-refresh", { reason: normalizedReason }, { persist: true });
      return false;
    }
    const state = auctionComparisonState;
    const active = !!state?.running || state?.inFlight?.size > 0 || state?.queue?.length > 0;
    if (active) {
      state.pendingInvalidation = true;
      if (auctionComparisonDiagnostics?.active) auctionComparisonDiagnostics.active.pendingInvalidation = true;
      if (!(state.pendingInvalidationReasons instanceof Set)) state.pendingInvalidationReasons = new Set();
      state.pendingInvalidationReasons.add(normalizedReason);
      state.forceResimulation = state.forceResimulation || auctionComparisonReasonAffectsPlayer(normalizedReason);
      recordAuctionComparisonDiagnostic("invalidation-deferred", {
        reason: normalizedReason,
        generation: state.generation,
        running: !!state.running,
        inFlight: state.inFlight.size,
        queued: state.queue.length
      }, { persist: true });
      return false;
    }

    state.generation += 1;
    state.context = null;
    state.contextPromise = null;
    state.cache = new Map();
    state.inFlight = new Map();
    state.queue = [];
    state.queued = new Set();
    state.running = false;
    state.pendingInvalidation = false;
    state.pendingInvalidationReasons = new Set();
    state.forceResimulation = auctionComparisonReasonAffectsPlayer(reason);
    recordAuctionComparisonDiagnostic("invalidation-applied", {
      reason: normalizedReason,
      generation: state.generation
    }, { persist: true });
    return true;
  }

  function applyPendingAuctionComparisonInvalidation(state) {
    if (!state?.pendingInvalidation) return false;
    const reasons = Array.from(state.pendingInvalidationReasons || []);
    const forceResimulation = reasons.some(auctionComparisonReasonAffectsPlayer);
    state.pendingInvalidation = false;
    state.pendingInvalidationReasons = new Set();
    if (auctionComparisonDiagnostics?.active) auctionComparisonDiagnostics.active.pendingInvalidation = false;
    state.generation += 1;
    state.context = null;
    state.contextPromise = null;
    state.cache = new Map();
    state.inFlight = new Map();
    state.queue = [];
    state.queued = new Set();
    state.forceResimulation = forceResimulation;
    recordAuctionComparisonDiagnostic("invalidation-applied-after-active-job", {
      reasons,
      generation: state.generation
    }, { persist: true });
    return true;
  }

  function auctionComparisonSettings() {
    const comparison = normalizeItemComparisonSettings(settings?.itemComparison);
    return {
      simulations: globalSimulationCount(),
      seed: Math.max(1, Math.floor(Number(statPriorityState.seed) || 1)),
      opponentMode: comparison.opponentMode,
      expeditionEnemyKey: comparison.expeditionEnemyKey
    };
  }

  function auctionComparisonRollInt(rng, range) {
    const min = Math.trunc(Number(Array.isArray(range) ? range[0] : 0));
    const max = Math.trunc(Number(Array.isArray(range) ? range[1] : min));
    if (!Number.isFinite(min)) return 0;
    if (!Number.isFinite(max) || max <= min) return min;
    return min + Math.floor(rng() * (max - min + 1));
  }

  function buildExpeditionEnemyProfile(engine, source, seed) {
    if (!source || !engine) throw new Error("Expedition comparison enemy data is unavailable.");
    const rng = engine.createSeededRng(seed);
    const level = auctionComparisonRollInt(rng, source.l);
    const strength = auctionComparisonRollInt(rng, source.str);
    const dexterity = auctionComparisonRollInt(rng, source.dex);
    const agility = auctionComparisonRollInt(rng, source.agi);
    const constitution = auctionComparisonRollInt(rng, source.con);
    const charisma = auctionComparisonRollInt(rng, source.cha);
    const intelligence = auctionComparisonRollInt(rng, source.int);
    const armour = auctionComparisonRollInt(rng, source.a);
    const damageMin = auctionComparisonRollInt(rng, source.dmin);
    const damageMax = Math.max(damageMin, auctionComparisonRollInt(rng, source.dmax));
    const lifeMax = Math.max(1, auctionComparisonRollInt(rng, source.hp));
    const critical = Math.max(0, Math.trunc(Number(source.cr) || 0));
    const block = Math.max(0, Math.trunc(Number(source.bl) || 0));
    const avoidCritical = Math.max(0, Math.trunc(Number(source.ac) || 0));
    const profile = engine.buildProfile({
      equipmentSnapshot: {},
      stats: {
        level, strength, dexterity, agility, constitution, charisma, intelligence,
        armour, damageMin, damageMax, lifeMax, lifeCurrent: lifeMax,
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

  function buildAuctionComparisonExpeditionSamples(engine, settingsSnapshot) {
    const catalog = expeditionEnemyCatalog();
    const selected = catalog.find(row => row.key === settingsSnapshot.expeditionEnemyKey);
    if (!selected) throw new Error("Selected Expedition comparison enemy is unavailable in the bundled database.");
    const count = Math.max(1, Math.trunc(Number(settingsSnapshot.simulations) || 50));
    const baseSeed = Math.max(1, Math.trunc(Number(settingsSnapshot.seed) || 1));
    const enemies = new Array(count);
    for (let i = 0; i < count; i++) {
      // A separate seeded enemy profile is generated for every simulation. The
      // exact same profile object is then shared by baseline and every candidate.
      enemies[i] = buildExpeditionEnemyProfile(engine, selected.enemy, baseSeed + ((i + 1) * 0x9E3779B1));
    }
    return { enemies, selected };
  }

  function auctionComparisonOpponentLabel(settingsSnapshot) {
    if (settingsSnapshot?.opponentMode !== "expedition-enemy") return "Player Clone";
    const row = expeditionEnemyCatalog().find(entry => entry.key === settingsSnapshot.expeditionEnemyKey);
    return row ? `${row.countryName} — ${row.expeditionName} — ${row.name}` : "Expedition Enemy";
  }

  function auctionComparisonLegacyResultKey(item) {
    return String(item?.listingId || item?.contentFingerprint || item?.itemHash || item?.itemId || `${item?.categoryValue || "x"}:${item?.auctionIndex ?? "x"}`);
  }

  function auctionComparisonResultKey(item) {
    const hash = String(item?.itemHash || "").trim();
    if (hash) return `equipment:${hostnameKey()}:hash:${hash}`;
    const itemId = String(item?.itemId || "").trim();
    if (itemId) return `equipment:${hostnameKey()}:id:${itemId}`;
    const fingerprint = auctionComparisonItemFingerprint(item);
    if (fingerprint && (fingerprint.itemLevel != null || fingerprint.categoryValue != null || fingerprint.raw)) {
      try {
        return `equipment:${hostnameKey()}:fp:${JSON.stringify(fingerprint)}`;
      } catch (_) {}
    }
    return auctionComparisonLegacyResultKey(item);
  }

  function auctionComparisonRelativeDelta(delta, baseline) {
    const base = Number(baseline);
    const change = Number(delta);
    if (!Number.isFinite(base) || base === 0 || !Number.isFinite(change)) return null;
    return change / base * 100;
  }

  function auctionComparisonStatus(delta) {
    const value = Number(delta);
    if (!Number.isFinite(value)) return "error";
    if (value > 1e-9) return "upgrade";
    if (value < -1e-9) return "worse";
    return "sidegrade";
  }

  function auctionComparisonStatusLabel(status, delta, relative) {
    if (status === "upgrade") return `↑ Upgrade · ${statPriorityFormatDelta(delta, 2)} pp${relative == null ? "" : ` · +${Math.abs(relative).toFixed(2)}%`}`;
    if (status === "worse") return `↓ Worse · ${statPriorityFormatDelta(delta, 2)} pp${relative == null ? "" : ` · −${Math.abs(relative).toFixed(2)}%`}`;
    if (status === "sidegrade") return "↔ Sidegrade · 0.00 pp · 0.00%";
    return "⚠ Unavailable";
  }

  function auctionComparisonPendingLabel() { return auctionScanInFlight ? "⏳ Waiting for scan" : "⏳ Awaiting completed scan"; }

  function nativeAuctionComparisonDisplay(comparison) {
    if (!comparison) return null;
    const delta = Number(comparison.deltaWinRate);
    const relative = Number(comparison.relativeChange);
    const status = String(comparison.status || "").trim();
    const absoluteText = Number.isFinite(delta)
      ? `${delta > 0 ? "+" : delta < 0 ? "−" : ""}${Math.abs(delta).toFixed(2)} percentage points`
      : "an unavailable absolute change";
    const relativeText = Number.isFinite(relative)
      ? `${relative > 0 ? "+" : relative < 0 ? "−" : ""}${Math.abs(relative).toFixed(2)}% relative`
      : "a percentage-point change";
    const baselineText = Number.isFinite(Number(comparison.baselineWinRate)) ? Number(comparison.baselineWinRate).toFixed(1) : "—";
    const candidateText = Number.isFinite(Number(comparison.candidateWinRate)) ? Number(comparison.candidateWinRate).toFixed(1) : "—";
    if (status === "sidegrade") {
      const displayChange = Number.isFinite(relative) ? relative : (Number.isFinite(delta) ? delta : 0);
      return {
        arrow: "sidegrade",
        value: `Sidegrade · ${Math.abs(displayChange).toFixed(1)}%`,
        state: "sidegrade",
        color: "#a16207",
        title: `Simulated win-rate sidegrade: ${absoluteText} (${relativeText}). Baseline ${baselineText}% → candidate ${candidateText}%.`
      };
    }
    if (status !== "upgrade" && status !== "worse") return null;
    const upgrade = status === "upgrade";
    const displayChange = Number.isFinite(relative) ? relative : delta;
    if (!Number.isFinite(displayChange) || Math.abs(displayChange) < 1e-9) return null;
    const signed = `${upgrade ? "+" : "−"}${Math.abs(displayChange).toFixed(1)}%`;
    return {
      arrow: upgrade ? "up" : "down",
      value: signed,
      state: upgrade ? "upgrade" : "downgrade",
      color: upgrade ? "#16a34a" : "#dc2626",
      title: `Simulated win-rate change: ${absoluteText} (${relativeText}). Baseline ${baselineText}% → candidate ${candidateText}%.`
    };
  }

  function nativeAuctionListingItem(listing, index, categoryValue, byListingId, byHash) {
    if (!listing) return null;
    const listingId = auctionListingId(categoryValue, index);
    const indexed = byListingId.get(listingId) || null;
    const itemElement = listing.querySelector('[data-tooltip][data-item-id], [data-tooltip][data-hash], [data-tooltip][class*="item-i-"]');
    const domHash = String(itemElement?.getAttribute("data-hash") || "").trim();
    if (indexed) {
      const storedHash = String(indexed.itemHash || "").trim();
      if (!domHash || !storedHash || domHash === storedHash) return indexed;
    }
    if (domHash) {
      const matches = byHash.get(domHash) || [];
      if (matches.length === 1) return matches[0];
    }
    const autoCandidates = Array.from(nativeEquipmentComparisonCandidates?.values?.() || []).filter(candidate => candidate?.listingId);
    const autoByListingId = autoCandidates.find(candidate => String(candidate.listingId) === listingId);
    if (autoByListingId) return autoByListingId;
    if (domHash) {
      const autoByHash = autoCandidates.filter(candidate => String(candidate.itemHash || "").trim() === domHash);
      if (autoByHash.length === 1) return autoByHash[0];
    }
    return indexed || null;
  }

  function findNativeAuctionBidControl(listing) {
    if (!listing) return null;
    // The game's auction markup keeps .auction_bid_div next to .auction_item_div
    // under the same wrapper, rather than inside the item grid itself.
    const parent = listing.parentElement;
    const bidRoot =
      (listing.nextElementSibling?.matches?.('.auction_bid_div') ? listing.nextElementSibling : null) ||
      (parent ? Array.from(parent.children).find(el => el !== listing && el.classList?.contains('auction_bid_div')) : null) ||
      listing.querySelector('.auction_bid_div');
    if (!bidRoot) return null;
    const controls = Array.from(bidRoot.querySelectorAll('button, input[type="button"], input[type="submit"], a'))
      .filter(el => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && (rect.width || rect.height);
      });
    const bid = controls.find(el => {
      const label = String(el.value || el.textContent || el.getAttribute('aria-label') || el.title || '').trim();
      return /^bid$/i.test(label);
    });
    if (bid) return bid;
    // The native auction markup has historically kept the bid submit control
    // as the fourth child of .auction_bid_div. Keep that as a narrow fallback
    // for servers where the control text is rendered indirectly.
    const legacyCandidate = bidRoot.children?.[3];
    return legacyCandidate instanceof HTMLElement ? legacyCandidate : null;
  }

  function positionNativeAuctionComparisonIndicator(indicator, listing, anchor) {
    if (!indicator || !listing) return;
    const listingRect = listing.getBoundingClientRect();
    if (!listingRect.width && !listingRect.height) return;
    const anchorRect = anchor?.getBoundingClientRect?.();
    let left;
    let top;
    if (anchorRect && (anchorRect.width || anchorRect.height)) {
      left = anchorRect.right + 7;
      top = anchorRect.top + anchorRect.height / 2;
      indicator.dataset.position = "bid";
    } else {
      left = Math.max(listingRect.left + 8, listingRect.right - 92);
      top = listingRect.bottom - 9;
      indicator.dataset.position = "fallback";
    }
    indicator.style.left = `${Math.round(left)}px`;
    indicator.style.top = `${Math.round(top)}px`;

    const source = anchor || listing;
    try {
      const sourceStyle = getComputedStyle(source);
      indicator.style.fontFamily = sourceStyle.fontFamily;
      indicator.style.fontSize = sourceStyle.fontSize;
      indicator.style.fontWeight = "700";
      indicator.style.lineHeight = sourceStyle.lineHeight;
      indicator.style.letterSpacing = sourceStyle.letterSpacing;
    } catch (_) {}
  }

  function renderNativeAuctionComparisonIndicators() {
    const listings = Array.from(document.querySelectorAll(".auction_item_div"));
    const category = getCurrentAuctionCategory();
    const isAuctionPage = !!category.select || listings.length > 0;
    if (!isAuctionPage) {
      document.querySelectorAll(".ga-native-auction-compare").forEach(el => el.remove());
      return;
    }

    const categoryValue = String(category.value ?? "0");
    const items = combinedAuctionItems().filter(item => String(item?.categoryValue ?? item?.auctionCategoryValue ?? "") === categoryValue);
    const byListingId = new Map(items.map(item => [String(item.listingId || auctionListingId(categoryValue, item.auctionIndex)), item]));
    const byHash = new Map();
    for (const item of items) {
      const hash = String(item?.itemHash || "").trim();
      if (!hash) continue;
      if (!byHash.has(hash)) byHash.set(hash, []);
      byHash.get(hash).push(item);
    }

    const activeIds = new Set();
    for (let index = 0; index < listings.length; index++) {
      const listing = listings[index];
      const item = nativeAuctionListingItem(listing, index, categoryValue, byListingId, byHash);
      if (!item) continue;
      const comparison = getAuctionComparison(item);
      const display = nativeAuctionComparisonDisplay(comparison);
      if (!display) continue;
      const listingId = String(item.listingId || auctionListingId(categoryValue, index));
      activeIds.add(listingId);

      let indicator = document.querySelector(`.ga-native-auction-compare[data-listing-id="${CSS.escape(listingId)}"]`);
      if (!indicator) {
        indicator = document.createElement("span");
        indicator.className = "ga-native-auction-compare";
        indicator.dataset.listingId = listingId;
        const arrow = document.createElement("span");
        arrow.className = "ga-native-auction-compare-arrow";
        const value = document.createElement("span");
        value.className = "ga-native-auction-compare-value";
        indicator.append(arrow, value);
        (document.body || document.documentElement).appendChild(indicator);
      }

      const anchor = findNativeAuctionBidControl(listing);
      const arrow = indicator.querySelector(".ga-native-auction-compare-arrow");
      const value = indicator.querySelector(".ga-native-auction-compare-value");
      if (arrow) {
        arrow.textContent = "";
        arrow.classList.toggle("ga-native-auction-compare-arrow-up", display.state === "upgrade");
        arrow.classList.toggle("ga-native-auction-compare-arrow-down", display.state === "downgrade");
        arrow.classList.toggle("ga-native-auction-compare-arrow-sidegrade", display.state === "sidegrade");
        arrow.style.color = display.color;
        arrow.setAttribute("aria-label", display.state === "upgrade" ? "Upgrade" : display.state === "downgrade" ? "Downgrade" : "Sidegrade");
      }
      if (value) {
        value.textContent = display.value;
        value.style.color = "#000";
      }
      indicator.dataset.state = display.state;
      indicator.title = display.title;
      positionNativeAuctionComparisonIndicator(indicator, listing, anchor);
      applyNativeComparisonOcclusion(indicator);
    }

    document.querySelectorAll(".ga-native-auction-compare").forEach(indicator => {
      if (!activeIds.has(String(indicator.dataset.listingId || ""))) indicator.remove();
    });
  }

  function scheduleNativeAuctionComparisonRender() {
    if (nativeAuctionComparisonRenderTimer) return;
    nativeAuctionComparisonRenderTimer = setTimeout(() => {
      nativeAuctionComparisonRenderTimer = null;
      renderNativeAuctionComparisonIndicators();
    }, 0);
  }

  function initializeNativeAuctionComparisonDisplay() {
    if (!nativeAuctionComparisonListenersReady) {
      document.addEventListener("change", event => {
        if (event.target?.matches?.('select[name="itemType"]')) scheduleNativeAuctionComparisonRender();
      }, true);
      document.addEventListener("scroll", () => scheduleNativeAuctionComparisonRender(), true);
      window.addEventListener("resize", () => scheduleNativeAuctionComparisonRender(), { passive: true });
      nativeAuctionComparisonListenersReady = true;
    }
    if (typeof MutationObserver === "undefined" || !document.body) {
      renderNativeAuctionComparisonIndicators();
      return;
    }
    if (!nativeAuctionComparisonObserver) {
      nativeAuctionComparisonObserver = new MutationObserver(records => {
        if (!getCurrentAuctionCategory().select && !document.querySelector(".auction_item_div")) return;
        const relevant = records.some(record => {
          if (record.type !== "childList") return false;
          const nodes = [...record.addedNodes, ...record.removedNodes];
          return nodes.some(node => {
            if (node.nodeType !== 1) return false;
            if (node.classList?.contains("ga-native-auction-compare")) return false;
            return true;
          });
        });
        if (relevant) scheduleNativeAuctionComparisonRender();
      });
      nativeAuctionComparisonObserver.observe(document.body, { childList: true, subtree: true });
    }
    scheduleNativeAuctionComparisonRender();
  }


  function nativeEquipmentComparisonSavedTypeMap() {
    const map = {};
    const profiles = characterProfileStore?.characters || {};
    const preferred = profiles?.["1"] || selectedCharacterProfile?.();
    const sources = [preferred, ...Object.values(profiles || {})];
    for (const profile of sources) {
      for (const [slot, item] of Object.entries(profile?.equipment || {})) {
        const type = String(item?.contentType || "").trim();
        if (!type || !SLOT_TO_CONTAINER[slot]) continue;
        if (!map[type]) map[type] = [];
        if (!map[type].includes(slot)) map[type].push(slot);
      }
    }
    return map;
  }

  function nativeEquipmentComparisonSlots(item, parserTypeMap = null) {
    const auctionCategorySlot = AUCTION_EQUIPMENT_CATEGORY_TO_SLOT[String(item?.categoryValue ?? item?.auctionCategoryValue ?? "")];
    if (item?.listingId && auctionCategorySlot) return [auctionCategorySlot === "ring" ? "ring1" : auctionCategorySlot];
    const direct = Array.isArray(item?.comparisonSlots)
      ? [...new Set(item.comparisonSlots.map(slot => String(slot || "").trim()).filter(Boolean))]
      : [];
    const type = String(item?.contentType || "").trim();
    const mapped = [...new Set([
      ...(Array.isArray(parserTypeMap?.[type]) ? parserTypeMap[type] : []),
      ...(Array.isArray(nativeEquipmentComparisonSavedTypeMap()?.[type]) ? nativeEquipmentComparisonSavedTypeMap()[type] : [])
    ].map(slot => String(slot || "").trim()).filter(Boolean))];
    const slots = direct.length ? direct : mapped;
    if (slots.length) {
      const unique = [...new Set(slots)];
      if (unique.every(slot => /^ring[12]$/.test(slot))) return ["ring1", "ring2"];
      if (unique.length === 1) return unique;
    }
    const auctionSlot = AUCTION_EQUIPMENT_CATEGORY_TO_SLOT[String(item?.categoryValue ?? item?.auctionCategoryValue ?? "")];
    return auctionSlot ? [auctionSlot === "ring" ? "ring1" : auctionSlot] : [];
  }

  function nativeVisibleEquipmentSourceKey(node) {
    if (!node) return "";
    return [
      node.closest?.("#packages, #inventory, #inv, .inventory_box, .packageItem, #content, #center, body")?.id || "",
      node.getAttribute?.("data-container-number") || "",
      node.getAttribute?.("data-position-x") || "",
      node.getAttribute?.("data-position-y") || "",
      node.getAttribute?.("data-item-id") || "",
      node.getAttribute?.("data-hash") || ""
    ].join("|");
  }

  function nativeEquipmentAllElements() {
    return Array.from(document.querySelectorAll('[data-item-id][class*="item-i-"], [data-hash][class*="item-i-"]')).filter(node => !node.closest?.("#char, .auction_item_div, .ga-host, #gladiatus-assistant"));
  }

  function nativeVisibleEquipmentElements() {
    // Used only for viewport preflight diagnostics. Candidate lookup itself uses
    // the full DOM so scrolling cannot discard comparisons merely because an item
    // is temporarily outside the viewport.
    return nativeEquipmentAllElements().filter(node => {
      const rect = node.getBoundingClientRect?.();
      if (!rect || rect.width <= 0 || rect.height <= 0) return false;
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
      return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
    });
  }

  function findNativeEquipmentElementForComparison(item) {
    const nodes = nativeEquipmentAllElements();
    if (!nodes.length) return null;
    const sourceKey = String(item?.sourceKey || "");
    if (sourceKey) {
      const exact = nodes.find(node => nativeVisibleEquipmentSourceKey(node) === sourceKey);
      if (exact) return exact;
    }
    const itemId = String(item?.itemId || "").trim();
    const itemHash = String(item?.itemHash || "").trim();
    const candidates = nodes.filter(node => {
      const id = String(node.getAttribute("data-item-id") || "").trim();
      const hash = String(node.getAttribute("data-hash") || "").trim();
      if (itemHash && hash) return hash === itemHash && (!itemId || id === itemId);
      return itemId && id === itemId;
    });
    if (candidates.length === 1) return candidates[0];
    const posX = String(item?.positionX ?? "").trim();
    const posY = String(item?.positionY ?? "").trim();
    if (candidates.length > 1 && (posX || posY)) {
      return candidates.find(node => String(node.getAttribute("data-position-x") || "").trim() === posX && String(node.getAttribute("data-position-y") || "").trim() === posY) || candidates[0];
    }
    return candidates[0] || null;
  }

  function nativeComparisonIndicatorOccluded(indicator) {
    if (!indicator?.isConnected) return false;
    const rect = indicator.getBoundingClientRect?.();
    if (!rect || rect.width <= 0 || rect.height <= 0) return false;
    const overlayLike = element => {
      if (!element?.matches) return false;
      const token = `${String(element.id || "")} ${String(element.className || "")}`.toLowerCase();
      return element.getAttribute?.("role") === "tooltip" ||
        element.getAttribute?.("role") === "dialog" ||
        /(?:^|[-_ ])(?:tooltip|ui-tooltip|popup|dialog|blackoutdialog|modal)(?:$|[-_ ])/i.test(token);
    };
    const visiblyCovers = element => {
      if (!element || element === indicator || indicator.contains(element)) return false;
      const style = getComputedStyle(element);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
      const r = element.getBoundingClientRect?.();
      if (!r || r.width <= 0 || r.height <= 0) return false;
      return r.right > rect.left && r.left < rect.right && r.bottom > rect.top && r.top < rect.bottom;
    };
    // First use hit-testing. This catches the actual native overlay that is
    // painted above the indicator without requiring knowledge of its z-index.
    const points = [
      [rect.left + rect.width / 2, rect.top + rect.height / 2],
      [rect.left + Math.min(5, rect.width / 2), rect.top + rect.height / 2]
    ];
    if (points.some(([x, y]) => {
      if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) return false;
      const hit = document.elementFromPoint(x, y);
      if (!hit || hit === indicator || indicator.contains(hit)) return false;
      let el = hit;
      for (let i = 0; el && i < 8; i++, el = el.parentElement) {
        if (overlayLike(el)) return true;
      }
      return false;
    })) return true;

    // Also detect overlapping tooltip/popup elements even when an unusual
    // stacking context prevents elementFromPoint() from exposing them.
    const overlays = document.querySelectorAll('[role="tooltip"], [role="dialog"], [class*="tooltip"], [id*="tooltip"], [class*="popup"], [id*="popup"], [class*="blackoutdialog"], [id*="blackoutdialog"], [class*="modal"], [id*="modal"]');
    for (const overlay of overlays) {
      if (overlay === indicator || indicator.contains(overlay) || !overlayLike(overlay)) continue;
      if (visiblyCovers(overlay)) return true;
    }
    return false;
  }

  function applyNativeComparisonOcclusion(indicator) {
    if (!indicator) return;
    indicator.style.display = nativeComparisonIndicatorOccluded(indicator) ? "none" : "inline-flex";
  }

  function positionNativeEquipmentComparisonIndicator(indicator, itemElement) {
    if (!indicator || !itemElement) return false;
    const rect = itemElement.getBoundingClientRect();
    if (!rect.width && !rect.height) return false;
    const gap = 7;
    const width = indicator.offsetWidth || 60;
    let left = rect.right + gap;
    if (left + width > innerWidth - 4) left = Math.max(4, rect.left - width - gap);
    indicator.style.left = `${Math.round(left)}px`;
    indicator.style.top = `${Math.round(rect.top + rect.height / 2)}px`;
    try {
      const style = getComputedStyle(itemElement);
      indicator.style.fontFamily = style.fontFamily;
      indicator.style.fontSize = style.fontSize;
      indicator.style.fontWeight = "700";
      indicator.style.lineHeight = style.lineHeight;
      indicator.style.letterSpacing = style.letterSpacing;
    } catch (_) {}
    indicator.dataset.anchor = "equipment";
    return true;
  }

  function createNativeEquipmentComparisonIndicator(key) {
    const selector = `.ga-native-equipment-compare[data-equipment-key="${CSS.escape(key)}"]`;
    let indicator = document.querySelector(selector);
    if (indicator) return indicator;
    indicator = document.createElement("span");
    indicator.className = "ga-native-equipment-compare";
    indicator.dataset.equipmentKey = key;
    const arrow = document.createElement("span");
    arrow.className = "ga-native-equipment-compare-arrow";
    const value = document.createElement("span");
    value.className = "ga-native-equipment-compare-value";
    indicator.append(arrow, value);
    (document.body || document.documentElement).appendChild(indicator);
    return indicator;
  }

  function nativeAuctionComparisonCandidateForElement(element) {
    if (!element) return null;
    const listing = element.closest?.(".auction_item_div") || element;
    if (!listing?.matches?.(".auction_item_div")) return null;
    const listings = Array.from(document.querySelectorAll(".auction_item_div"));
    const index = listings.indexOf(listing);
    if (index < 0) return null;
    const category = getCurrentAuctionCategory();
    const categoryValue = String(category.value ?? "0");
    const listingId = auctionListingId(categoryValue, index);
    const itemElement = element.closest?.('[data-tooltip][data-item-id], [data-tooltip][data-hash], [data-tooltip][class*="item-i-"]') || listing.querySelector('[data-tooltip][data-item-id], [data-tooltip][data-hash], [data-tooltip][class*="item-i-"]');
    const itemHash = String(itemElement?.getAttribute("data-hash") || "").trim();
    const itemId = String(itemElement?.getAttribute("data-item-id") || "").trim();
    let fallback = null;
    for (const [key, item] of nativeEquipmentComparisonCandidates.entries()) {
      if (!item?.listingId) continue;
      if (String(item.listingId) === listingId) return { key, item };
      const candidateHash = String(item.itemHash || "").trim();
      const candidateId = String(item.itemId || "").trim();
      if (!fallback && itemHash && candidateHash && itemHash === candidateHash && (!itemId || !candidateId || itemId === candidateId)) {
        fallback = { key, item };
      }
    }
    return fallback;
  }

  function nativeEquipmentComparisonCandidateForElement(element) {
    if (!element) return null;
    const sourceKey = nativeVisibleEquipmentSourceKey(element);
    const itemId = String(element.getAttribute?.("data-item-id") || "").trim();
    const itemHash = String(element.getAttribute?.("data-hash") || "").trim();
    let fallback = null;
    for (const [key, item] of nativeEquipmentComparisonCandidates.entries()) {
      if (!item || item?.listingId) continue;
      if (sourceKey && String(item?.sourceKey || "") === sourceKey) return { key, item };
      const candidateId = String(item?.itemId || "").trim();
      const candidateHash = String(item?.itemHash || "").trim();
      if (itemHash && candidateHash && itemHash === candidateHash && (!itemId || !candidateId || itemId === candidateId)) {
        if (!fallback) fallback = { key, item };
      } else if (itemId && candidateId && itemId === candidateId && !fallback) {
        fallback = { key, item };
      }
    }
    return fallback;
  }

  function nativeItemTooltipVisible(element) {
    if (!element || element === document.body || element === document.documentElement) return false;
    const style = getComputedStyle(element);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
    const rect = element.getBoundingClientRect?.();
    return !!rect && rect.width > 0 && rect.height > 0 && rect.right > 0 && rect.bottom > 0 && rect.left < innerWidth && rect.top < innerHeight;
  }

  function nativeItemTooltipLike(element) {
    if (!element?.matches) return false;
    const token = `${String(element.id || "")} ${String(element.className || "")}`.toLowerCase();
    const role = String(element.getAttribute?.("role") || "").toLowerCase();
    if (role === "tooltip") return true;
    if (/(^|[-_ ])(?:tooltip|ui-tooltip|tip|tip-wrap|item-tooltip)(?:$|[-_ ])/i.test(token)) return true;
    return token.includes("tooltip") || token.includes("tip-wrap");
  }

  function nativeItemTooltipTextMatches(element, itemName) {
    if (!element || !itemName) return false;
    const text = normalize(element.innerText || element.textContent || "").toLowerCase();
    const name = normalize(itemName).toLowerCase();
    return !!name && text.includes(name);
  }

  function nativeItemTooltipScore(element, itemName) {
    const rect = element.getBoundingClientRect?.();
    const style = getComputedStyle(element);
    let score = 0;
    if (nativeItemTooltipLike(element)) score += 1000;
    if (["absolute", "fixed"].includes(style.position)) score += 150;
    if (nativeItemTooltipTextMatches(element, itemName)) score += 500;
    if (rect && rect.width > 120 && rect.height > 20) score += 25;
    if (rect) score -= Math.min(100, (rect.width * rect.height) / 50000);
    return score;
  }

  function findNativeItemTooltip(_item) {
    // Gladiatus uses a single live native tooltip container. We have verified
    // that appending directly to section.tooltips is visible in-game, so do not
    // require tooltip text, class heuristics, or a candidate ranking here.
    const tooltip = document.querySelector("section.tooltips");
    if (!tooltip || tooltip.closest?.("#gladiatus-assistant")) return null;
    return nativeItemTooltipVisible(tooltip) ? tooltip : null;
  }

  function comparisonTooltipText(display) {
    if (!display) return null;
    if (display.state === "upgrade") return `↑ Upgrade · ${display.value}`;
    if (display.state === "downgrade") return `↓ Worse · ${display.value}`;
    if (display.state === "sidegrade") return `↔ Sidegrade · ${String(display.value || "").replace(/^Sidegrade\s*·\s*/i, "")}`;
    return null;
  }

  function nativeTooltipComparisonContainer(tooltip) {
    if (!tooltip) return null;
    // Match the exact DOM path proven by the manual layering test.
    return tooltip.firstElementChild || tooltip;
  }

  function removeNativeItemTooltipComparisonRows(exceptTooltip = null) {
    document.querySelectorAll(".ga-native-item-tooltip-compare").forEach(row => {
      const owner = row.closest?.(".tooltips");
      if (exceptTooltip && owner === exceptTooltip) return;
      row.remove();
    });
  }

  function appendNativeItemTooltipComparisonRow(item, display) {
    const tooltip = findNativeItemTooltip(item);
    if (!tooltip) return false;
    const text = comparisonTooltipText(display);
    if (!text) return false;

    const container = nativeTooltipComparisonContainer(tooltip);
    if (!container) return false;

    removeNativeItemTooltipComparisonRows(tooltip);
    let row = container.querySelector(":scope > .ga-native-item-tooltip-compare");
    if (!row) {
      row = document.createElement("p");
      row.className = "ga-native-item-tooltip-compare";
      container.appendChild(row);
    }
    row.textContent = text;
    row.style.color = display.color || "#DDDDDD";
    row.style.fontWeight = "700";
    row.style.margin = "2px 0 0";
    row.style.padding = "0";
    row.title = display.title || "";
    row.dataset.state = display.state || "";
    // The native tooltip can keep an inline height based on its original
    // content. Add a modest fixed amount of room once for this tooltip node so
    // the injected comparison row is fully visible without repeatedly growing
    // the tooltip on every MutationObserver pass.
    try {
      if (tooltip.dataset.gaComparisonHeightApplied !== "1") {
        tooltip.style.maxHeight = "none";
        tooltip.style.overflow = "visible";
        const current = tooltip.getBoundingClientRect().height || parseFloat(getComputedStyle(tooltip).height) || 0;
        const extra = Math.max(28, Math.ceil(row.getBoundingClientRect().height || 16) + 10);
        tooltip.style.height = `${Math.ceil(current + extra)}px`;
        tooltip.dataset.gaComparisonHeightApplied = "1";
      }
    } catch (_) {}

    try {
      recordAuctionComparisonDiagnostic("native-tooltip-comparison-rendered", {
        itemName: String(item?.name || ""),
        itemId: item?.itemId ?? null,
        itemHash: item?.itemHash ?? null,
        tooltipTag: tooltip.tagName,
        tooltipId: tooltip.id || "",
        tooltipClass: typeof tooltip.className === "string" ? tooltip.className : "",
        tooltipZIndex: getComputedStyle(tooltip).zIndex,
        rowText: text,
        rowColor: row.style.color
      }, { persist: true });
    } catch (_) {}
    return true;
  }

  function renderNativeItemTooltipComparison() {
    let element = nativeItemTooltipHoveredElement;
    if (!element?.isConnected && nativeItemTooltipLastPointerItem?.isConnected) {
      element = nativeItemTooltipLastPointerItem;
      nativeItemTooltipHoveredElement = element;
      const recovered = nativeEquipmentComparisonCandidateForElement(element);
      nativeItemTooltipHoveredKey = recovered?.key || nativeItemTooltipHoveredKey || "";
      try {
        recordAuctionComparisonDiagnostic("native-tooltip-hover-recovered", {
          itemId: element.getAttribute("data-item-id") || null,
          itemHash: element.getAttribute("data-hash") || null,
          candidateKey: recovered?.key || null
        }, { persist: true });
      } catch (_) {}
    }
    if (!element?.isConnected) {
      removeNativeItemTooltipComparisonRows();
      return;
    }
    let candidate = null;
    const mappedItem = nativeEquipmentComparisonCandidates.get(nativeItemTooltipHoveredKey);
    if (mappedItem) candidate = { key: nativeItemTooltipHoveredKey, item: mappedItem };
    if (!candidate) {
      candidate = element.closest?.(".auction_item_div")
        ? nativeAuctionComparisonCandidateForElement(element)
        : nativeEquipmentComparisonCandidateForElement(element);
    }
    if (!candidate && nativeItemTooltipLastPointerItem === element) {
      candidate = element.closest?.(".auction_item_div")
        ? nativeAuctionComparisonCandidateForElement(element)
        : nativeEquipmentComparisonCandidateForElement(element);
    }
    if (!candidate) {
      try {
        recordAuctionComparisonDiagnostic("native-tooltip-render-no-candidate", {
          itemId: element.getAttribute("data-item-id") || null,
          itemHash: element.getAttribute("data-hash") || null,
          candidateCount: nativeEquipmentComparisonCandidates.size
        }, { persist: true });
      } catch (_) {}
      return;
    }
    if (!nativeItemTooltipHoveredKey) nativeItemTooltipHoveredKey = candidate.key;
    const comparison = getAuctionComparison(candidate.item);
    const display = nativeAuctionComparisonDisplay(comparison);
    if (!display) {
      try {
        recordAuctionComparisonDiagnostic("native-tooltip-render-no-display", {
          itemId: candidate.item?.itemId ?? null,
          itemName: candidate.item?.name || "",
          key: candidate.key || null,
          comparisonState: auctionComparisonState.forceResimulation ? "force-resimulation" : (comparison ? "result-unusable" : "comparison-not-ready"),
          comparisonStatus: comparison?.status || null
        }, { persist: true });
      } catch (_) {}
      removeNativeItemTooltipComparisonRows();
      return;
    }
    try {
      recordAuctionComparisonDiagnostic("native-tooltip-render-attempt", {
        itemId: candidate.item?.itemId ?? null,
        itemName: candidate.item?.name || "",
        key: candidate.key || null,
        tooltipExists: !!document.querySelector("section.tooltips")
      }, { persist: true });
    } catch (_) {}
    appendNativeItemTooltipComparisonRow(candidate.item, display);
  }

  function scheduleNativeItemTooltipComparisonRender(delay = 40) {
    if (nativeItemTooltipRenderTimer) clearTimeout(nativeItemTooltipRenderTimer);
    nativeItemTooltipRenderTimer = setTimeout(() => {
      nativeItemTooltipRenderTimer = null;
      renderNativeItemTooltipComparison();
    }, Math.max(0, Number(delay) || 0));
  }

  function renderNativeEquipmentComparisonIndicators() {
    // Generic equipment comparisons are rendered directly into the native
    // Gladiatus tooltip DOM. This avoids a separate Assistant layer competing
    // with the game's tooltip stacking context.
    document.querySelectorAll(".ga-native-equipment-compare").forEach(indicator => indicator.remove());
    const liveElements = new Set();
    for (const [key, candidate] of nativeEquipmentComparisonCandidates.entries()) {
      if (!candidate?.item || candidate?.listingId) continue;
      const comparison = getAuctionComparison(candidate.item);
      const display = nativeAuctionComparisonDisplay(comparison);
      const liveElement = findNativeEquipmentElementForComparison(candidate.item);
      if (!liveElement) continue;
      liveElements.add(liveElement);
      if (!display) continue;
      // Only append to an actually open native tooltip. The mouseover path will
      // call this again as soon as Gladiatus creates the popup.
      if (liveElement === nativeItemTooltipHoveredElement) appendNativeItemTooltipComparisonRow(candidate.item, display);
    }
    scheduleNativeItemTooltipComparisonRender(0);
  }

  function scheduleNativeEquipmentComparisonRender() {
    if (nativeAuctionComparisonRenderTimer) return;
    nativeAuctionComparisonRenderTimer = setTimeout(() => {
      nativeAuctionComparisonRenderTimer = null;
      renderNativeAuctionComparisonIndicators();
      renderNativeEquipmentComparisonIndicators();
    }, 0);
  }

  function nativeEquipmentComparisonScanInputItems(result) {
    const parserTypeMap = result?.typeMap || {};
    const out = [];
    for (const raw of Array.isArray(result?.items) ? result.items : []) {
      if (!raw || typeof raw !== "object") continue;
      const source = raw?.listingId ? "auction" : "generic-visible";
      const slots = nativeEquipmentComparisonSlots(raw, parserTypeMap);
      if (!slots.length) continue;
      const item = { ...raw, comparisonSlots: slots };
      if (source === "auction") item.comparisonSlot = slots[0];
      else item.comparisonSlot = slots.length === 2 && slots.every(slot => /^ring[12]$/.test(slot)) ? "ring" : slots[0];
      item.nativeSource = source;
      out.push(item);
    }
    return out;
  }

  function nativeEquipmentDisplayKey(item) {
    const universalKey = auctionComparisonResultKey(item);
    const sourceKey = String(item?.listingId || item?.sourceKey || "").trim();
    return `${universalKey}::${sourceKey || "source"}`;
  }

  function shouldRunNativeEquipmentComparisonScan() {
    if (!document.body) return false;
    const directItems = document.querySelectorAll('[data-item-id][class*="item-i-"], [data-hash][class*="item-i-"]');
    if (directItems.length) return true;
    if (document.querySelector('.auction_item_div, #char, #inventory, #warehouse, [class*="item-i-"]')) return true;
    const bodyId = String(document.body.id || "");
    return ["locationPage", "reportsPage", "auctionPage", "inventoryPage", "warehousePage"].includes(bodyId);
  }

  async function runNativeEquipmentComparisonScan() {
    if (!statPriorityStateLoaded || nativeEquipmentComparisonScanInFlight) return;
    if (!shouldRunNativeEquipmentComparisonScan()) return;
    if (!document.body) return;
    nativeEquipmentComparisonScanInFlight = true;
    const scanGeneration = ++nativeEquipmentComparisonScanGeneration;
    const scanStartedAt = new Date().toISOString();
    const preflightItemNodes = Array.from(document.querySelectorAll('[data-item-id][class*="item-i-"], [data-hash][class*="item-i-"]'));
    const preflightTooltipNodes = Array.from(document.querySelectorAll('[data-tooltip]'));
    recordAuctionComparisonDiagnostic("generic-visible-capture-start", {
      generation: scanGeneration,
      page: {
        url: location.href,
        pathname: location.pathname,
        bodyId: document.body?.id || ""
      },
      directItemNodes: preflightItemNodes.length,
      tooltipNodes: preflightTooltipNodes.length,
      visibleDirectItemNodes: preflightItemNodes.filter(node => {
        const rect = node.getBoundingClientRect?.();
        if (!rect || rect.width <= 0 || rect.height <= 0) return false;
        const style = getComputedStyle(node);
        return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
      }).length
    }, { persist: true });
    try {
      const result = await runtimeSend({ type: "SCAN_VISIBLE_EQUIPMENT_COMPARISON" });
      if (scanGeneration !== nativeEquipmentComparisonScanGeneration) return;
      const captureDiagnostic = {
        ...result?.captureDiagnostics,
        receivedAt: new Date().toISOString(),
        startedAt: scanStartedAt,
        generation: scanGeneration,
        overlayPreflight: {
          directItemNodes: preflightItemNodes.length,
          tooltipNodes: preflightTooltipNodes.length,
          visibleDirectItemNodes: preflightItemNodes.filter(node => {
            const rect = node.getBoundingClientRect?.();
            if (!rect || rect.width <= 0 || rect.height <= 0) return false;
            const style = getComputedStyle(node);
            return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
          }).length
        },
        parserResult: {
          examined: Number(result?.examined) || 0,
          genericCount: Number(result?.genericCount) || 0,
          auctionCount: Number(result?.auctionCount) || 0,
          returnedItems: Array.isArray(result?.items) ? result.items.length : 0,
          genericTypeMapKeys: Object.keys(result?.typeMap || {}).length
        }
      };
      auctionComparisonDiagnostics.lastVisibleEquipmentScan = captureDiagnostic;
      recordAuctionComparisonDiagnostic("generic-visible-scan", captureDiagnostic, { persist: true });
      const items = nativeEquipmentComparisonScanInputItems(result);
      const seen = new Set();
      for (const item of items) {
        const key = nativeEquipmentDisplayKey(item);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        nativeEquipmentComparisonCandidates.set(key, item);
        scheduleAuctionComparison(item);
      }
      for (const [key, item] of nativeEquipmentComparisonCandidates.entries()) {
        if (item?.listingId) {
          const index = Number(item.auctionIndex);
          const listings = document.querySelectorAll?.(".auction_item_div") || [];
          if (!listings.length || (Number.isFinite(index) && !listings[index])) nativeEquipmentComparisonCandidates.delete(key);
          continue;
        }
        const liveElement = findNativeEquipmentElementForComparison(item);
        if (!liveElement) nativeEquipmentComparisonCandidates.delete(key);
      }
      if (items.length) auctionComparisonState.forceResimulation = false;
      scheduleNativeEquipmentComparisonRender();
    } catch (error) {
      const failureDiagnostic = {
        receivedAt: new Date().toISOString(),
        startedAt: scanStartedAt,
        generation: scanGeneration,
        error: {
          message: error?.message || String(error),
          name: error?.name || null,
          stack: error?.stack || null
        },
        overlayPreflight: {
          directItemNodes: preflightItemNodes.length,
          tooltipNodes: preflightTooltipNodes.length,
          visibleDirectItemNodes: preflightItemNodes.filter(node => {
            const rect = node.getBoundingClientRect?.();
            if (!rect || rect.width <= 0 || rect.height <= 0) return false;
            const style = getComputedStyle(node);
            return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) !== 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
          }).length
        }
      };
      auctionComparisonDiagnostics.lastVisibleEquipmentScan = failureDiagnostic;
      recordAuctionComparisonDiagnostic("generic-visible-capture-error", failureDiagnostic, { persist: true });
      // A transient page transition can tear down the parser listener. The observer
      // will retry when the page settles; surface the failure in master diagnostics.
    } finally {
      nativeEquipmentComparisonScanInFlight = false;
    }
  }

  function scheduleNativeEquipmentComparisonScan(delay = 120) {
    if (!statPriorityStateLoaded) return;
    if (nativeEquipmentComparisonScanTimer) clearTimeout(nativeEquipmentComparisonScanTimer);
    nativeEquipmentComparisonScanTimer = setTimeout(() => {
      nativeEquipmentComparisonScanTimer = null;
      void runNativeEquipmentComparisonScan();
    }, Math.max(0, Number(delay) || 0));
  }

  function initializeNativeEquipmentComparisonDisplay() {
    if (!nativeEquipmentComparisonListenersReady) {
      document.addEventListener("scroll", () => {
        scheduleNativeEquipmentComparisonScan(160);
        scheduleNativeEquipmentComparisonRender();
      }, true);
      document.addEventListener("mousemove", event => {
        const itemElement = event.target?.closest?.('[data-item-id][class*="item-i-"], [data-hash][class*="item-i-"]');
        if (!itemElement || itemElement.closest?.("#char, .ga-host, #gladiatus-assistant")) return;
        nativeItemTooltipLastPointerItem = itemElement;
        nativeItemTooltipLastPointerAt = Date.now();
      }, true);
      document.addEventListener("mouseover", event => {
        const itemElement = event.target?.closest?.('[data-item-id][class*="item-i-"], [data-hash][class*="item-i-"]');
        if (!itemElement || itemElement.closest?.("#char, .ga-host, #gladiatus-assistant")) return;
        nativeItemTooltipLastPointerItem = itemElement;
        nativeItemTooltipLastPointerAt = Date.now();
        if (nativeItemTooltipHoveredElement === itemElement) {
          scheduleNativeItemTooltipComparisonRender(70);
          return;
        }
        nativeItemTooltipHoveredElement = itemElement;
        const candidate = itemElement.closest?.(".auction_item_div")
          ? nativeAuctionComparisonCandidateForElement(itemElement)
          : nativeEquipmentComparisonCandidateForElement(itemElement);
        nativeItemTooltipHoveredKey = candidate?.key || "";
        scheduleNativeItemTooltipComparisonRender(20);
      }, true);
      document.addEventListener("mouseout", event => {
        const itemElement = event.target?.closest?.('[data-item-id][class*="item-i-"], [data-hash][class*="item-i-"]');
        if (!itemElement || itemElement !== nativeItemTooltipHoveredElement) return;
        const related = event.relatedTarget;
        if (related && itemElement.contains?.(related)) return;
        nativeItemTooltipHoveredElement = null;
        nativeItemTooltipHoveredKey = "";
        removeNativeItemTooltipComparisonRows();
        scheduleNativeItemTooltipComparisonRender(50);
      }, true);
      window.addEventListener("resize", () => scheduleNativeEquipmentComparisonRender(), { passive: true });
      nativeEquipmentComparisonListenersReady = true;
    }
    if (!nativeEquipmentComparisonObserver && typeof MutationObserver !== "undefined" && document.body) {
      nativeEquipmentComparisonObserver = new MutationObserver(records => {
        let needsScan = false;
        let needsRender = false;
        const looksLikeOverlayNode = node => {
          if (!node?.matches) return false;
          const token = `${String(node.id || "")} ${String(node.className || "")}`.toLowerCase();
          return node.getAttribute?.("role") === "tooltip" || node.getAttribute?.("role") === "dialog" || token.includes("tooltip") || /(?:^|[-_ ])(?:popup|dialog|blackoutdialog)(?:$|[-_ ])/i.test(token);
        };
        const containsEquipmentNode = node => {
          if (node.nodeType !== 1) return false;
          if (node.closest?.("#gladiatus-assistant")) return false;
          if (node.matches?.('[data-tooltip], [data-item-id][class*="item-i-"], [data-hash][class*="item-i-"], .auction_item_div')) return true;
          return !!node.querySelector?.('[data-tooltip], [data-item-id][class*="item-i-"], [data-hash][class*="item-i-"], .auction_item_div');
        };
        for (const record of records) {
          if (record.type === "attributes") {
            if (record.target?.closest?.("#gladiatus-assistant")) continue;
            if (record.attributeName === "data-tooltip" && record.target?.getAttribute?.("data-ga-comparison-tooltip-active") === "1") {
              continue;
            }
            if (["data-item-id", "data-tooltip", "data-hash"].includes(record.attributeName)) needsScan = true;
            else if (record.attributeName === "class" && record.target?.matches?.('[data-item-id][class*="item-i-"], [data-hash][class*="item-i-"], .auction_item_div, [data-tooltip]')) needsScan = true;
            continue;
          }
          if (record.type !== "childList") continue;
          const nodes = [...record.addedNodes, ...record.removedNodes].filter(node => node.nodeType === 1);
          for (const node of nodes) {
            if (node.classList?.contains("ga-native-auction-compare") || node.classList?.contains("ga-native-equipment-compare")) continue;
            if (node.closest?.("#gladiatus-assistant")) continue;
            if (looksLikeOverlayNode(node)) { needsRender = true; continue; }
            if (containsEquipmentNode(node)) needsScan = true;
          }
        }
        if (needsScan) scheduleNativeEquipmentComparisonScan(180);
        if (needsScan || needsRender) scheduleNativeEquipmentComparisonRender();
        const tooltipCreated = records.some(record => {
          if (record.type !== "childList") return false;
          return [...record.addedNodes].some(node => node.nodeType === 1 && (node.matches?.("section.tooltips") || node.querySelector?.("section.tooltips")));
        });
        if (tooltipCreated) {
          try {
            recordAuctionComparisonDiagnostic("native-tooltip-created-observed", {
              lastPointerItemId: nativeItemTooltipLastPointerItem?.getAttribute?.("data-item-id") || null,
              lastPointerItemHash: nativeItemTooltipLastPointerItem?.getAttribute?.("data-hash") || null,
              lastPointerAgeMs: nativeItemTooltipLastPointerAt ? Date.now() - nativeItemTooltipLastPointerAt : null
            }, { persist: true });
          } catch (_) {}
          if (!nativeItemTooltipHoveredElement?.isConnected && nativeItemTooltipLastPointerItem?.isConnected) {
            nativeItemTooltipHoveredElement = nativeItemTooltipLastPointerItem;
            const recovered = nativeEquipmentComparisonCandidateForElement(nativeItemTooltipLastPointerItem);
            nativeItemTooltipHoveredKey = recovered?.key || "";
          }
          scheduleNativeItemTooltipComparisonRender(0);
        } else if (nativeItemTooltipHoveredElement && (needsRender || needsScan || records.some(record => record.type === "characterData" || record.type === "childList"))) {
          scheduleNativeItemTooltipComparisonRender(30);
        }
      });
      nativeEquipmentComparisonObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-item-id", "data-tooltip", "data-hash", "class"] });
    }
    scheduleNativeEquipmentComparisonScan(60);
    scheduleNativeEquipmentComparisonRender();
  }

  function auctionComparisonStatDifferences(candidate, current) {
    const labels = {
      strength: "STR", dexterity: "DEX", agility: "AGI", constitution: "CON", charisma: "CHA", intelligence: "INT",
      armour: "Armour", health: "HP", criticalAttack: "Crit", blockValue: "Block", hardening: "Hardening"
    };
    const out = [];
    for (const key of Object.keys(labels)) {
      const a = Number(candidate?.raw?.[key]?.flat || 0);
      const b = Number(current?.raw?.[key]?.flat || 0);
      const ap = Number(candidate?.raw?.[key]?.percent || 0);
      const bp = Number(current?.raw?.[key]?.percent || 0);
      const flatDelta = a - b;
      const percentDelta = ap - bp;
      if (Math.abs(flatDelta) >= 0.05) out.push(`${labels[key]} ${flatDelta > 0 ? "+" : "−"}${fmtNum(Math.abs(flatDelta))}`);
      if (Math.abs(percentDelta) >= 0.05) out.push(`${labels[key]} ${percentDelta > 0 ? "+" : "−"}${fmtNum(Math.abs(percentDelta))}%`);
    }
    const candidateDamage = candidate?.raw?.damage;
    const currentDamage = current?.raw?.damage;
    if (candidateDamage?.min != null && candidateDamage?.max != null && currentDamage?.min != null && currentDamage?.max != null) {
      const dmin = Number(candidateDamage.min) - Number(currentDamage.min);
      const dmax = Number(candidateDamage.max) - Number(currentDamage.max);
      if (Math.abs(dmin) >= 0.05 || Math.abs(dmax) >= 0.05) out.push(`Damage ${dmin >= 0 ? "+" : "−"}${fmtNum(Math.abs(dmin))}–${dmax >= 0 ? "+" : "−"}${fmtNum(Math.abs(dmax))}`);
    }
    return out.slice(0, 6);
  }

  async function buildAuctionComparisonContext() {
    const settingsSnapshot = auctionComparisonSettings();
    const generation = auctionComparisonState.generation;
    const engine = simulatorEngine();
    if (!engine) throw new Error("Combat simulator engine unavailable.");
    await loadCharacterProfileStore();
    const mainProfile = characterProfileStore.characters?.["1"] || null;
    const missingMainData = characterProfileMissingSimulationData(mainProfile);
    if (!mainProfile || missingMainData.length) throw new Error(`Saved main-character profile is unavailable or incomplete. Missing: ${missingMainData.join(", ") || "saved profile"}. Capture All Characters again to refresh it.`);
    const currentStats = { ...(mainProfile.stats || {}), name: mainProfile.name || mainProfile.stats?.name || "Main Character" };
    const equipment = mainProfile.equipment || {};

    const key = auctionComparisonPlayerFingerprint(currentStats, equipment, engine, settingsSnapshot.simulations, settingsSnapshot.seed, settingsSnapshot);
    auctionComparisonCurrentPlayerFingerprint = key;
    if (auctionComparisonState.context?.key === key) return auctionComparisonState.context;

    const basePlayer = engine.projectEquipment({
      currentEquipmentSnapshot: equipment,
      hypotheticalEquipmentSnapshot: equipment,
      liveStats: currentStats,
      opponentStats: currentStats
    });
    basePlayer.name = currentStats.name || "Main Character";
    basePlayer.lifeCurrent = basePlayer.lifeMax;

    const dummy = engine.buildProfile({
      equipmentSnapshot: equipment,
      stats: statPriorityDummyRawStats(basePlayer),
      opponentStats: basePlayer,
      explicitLifeMax: basePlayer.lifeMax,
      explicitArmour: basePlayer.armour,
      explicitDamageRange: `${basePlayer.damageMin}-${basePlayer.damageMax}`,
      recalculateDerived: true,
      name: "Auction Comparison Dummy"
    });
    dummy.lifeCurrent = dummy.lifeMax;

    let opponentSamples = null;
    let selectedExpeditionEnemy = null;
    if (settingsSnapshot.opponentMode === "expedition-enemy") {
      const sampled = buildAuctionComparisonExpeditionSamples(engine, settingsSnapshot);
      opponentSamples = sampled.enemies;
      selectedExpeditionEnemy = sampled.selected;
    }
    const comparisonEnemy = opponentSamples?.[0] || dummy;
    const options = { simulations: settingsSnapshot.simulations, seed: settingsSnapshot.seed, lifeMode: "full", maxRounds: ARENA_SIMULATION_ROUNDS };
    setAuctionComparisonDiagnosticStage("context-built", { equipmentSlots: Object.keys(equipment).length, simulationCount: settingsSnapshot.simulations, seed: settingsSnapshot.seed, opponentMode: settingsSnapshot.opponentMode, opponent: auctionComparisonOpponentLabel(settingsSnapshot), sampledEnemies: opponentSamples?.length || 0 }, true);
    setAuctionComparisonDiagnosticStage("baseline-start", { simulations: settingsSnapshot.simulations, chunkSize: 25, seed: settingsSnapshot.seed, opponentMode: settingsSnapshot.opponentMode }, true);
    const baseline = await engine.simulateBatchAsync({
      player: basePlayer,
      enemy: comparisonEnemy,
      enemies: opponentSamples,
      ...options,
      chunkSize: 25,
      onProgress: info => noteAuctionComparisonSimulationProgress("baseline-progress", info),
      onYield: info => recordAuctionComparisonDiagnostic("baseline-yield", info, { persist: true })
    });
    setAuctionComparisonDiagnosticStage("baseline-complete", { simulations: baseline?.simulations, winRate: baseline?.rates?.win }, true);
    const context = { generation, key, engine, settings: settingsSnapshot, equipment, currentStats, basePlayer, dummy, opponentSamples, selectedExpeditionEnemy, baseline, baselineWinRate: Number(baseline?.rates?.win || 0), opponentLabel: auctionComparisonOpponentLabel(settingsSnapshot) };
    if (generation === auctionComparisonState.generation) {
      auctionComparisonState.context = context;
      auctionComparisonState.contextPromise = null;
    }
    return context;
  }

  function auctionComparisonContextPromise() {
    if (auctionComparisonState.contextPromise) return auctionComparisonState.contextPromise;
    const generation = auctionComparisonState.generation;
    auctionComparisonState.contextPromise = buildAuctionComparisonContext().catch(error => {
      if (generation === auctionComparisonState.generation) auctionComparisonState.contextPromise = null;
      throw error;
    });
    return auctionComparisonState.contextPromise;
  }

  async function simulateAuctionComparison(item) {
    const slotKey = auctionCandidateSlot(item);
    if (!slotKey) return null;
    const generation = auctionComparisonState.generation;
    if (!auctionComparisonDiagnostics.active || auctionComparisonDiagnostics.active.itemKey !== auctionComparisonResultKey(item)) {
      beginAuctionComparisonDiagnostic(item, generation);
    }
    setAuctionComparisonDiagnosticStage("context-start", { slotKey }, true);
    const context = await auctionComparisonContextPromise();
    setAuctionComparisonDiagnosticStage("context-complete", { baselineWinRate: context?.baselineWinRate, simulations: context?.settings?.simulations }, true);
    const { engine, equipment, dummy, opponentSamples, baseline, settings } = context;
    const targets = slotKey === "ring"
      ? [{ slot: "ring1", item: equipment?.ring1 || null }, { slot: "ring2", item: equipment?.ring2 || null }]
      : [{ slot: slotKey, item: equipment?.[slotKey] || null }];

    let best = null;
    for (const target of targets) {
      setAuctionComparisonDiagnosticStage("candidate-start", {
        slot: target.slot,
        currentItemId: target.item?.itemId ?? null,
        currentItemName: target.item?.name || null,
        candidateItemId: item?.itemId ?? null,
        candidateItemName: item?.name || null
      }, true);
      const hypotheticalEquipment = engine.prepareHypotheticalEquipment({ currentEquipment: equipment, replacements: { [target.slot]: item } });
      setAuctionComparisonDiagnosticStage("candidate-equipment-prepared", { slot: target.slot }, false);
      const candidateProfile = engine.projectEquipment({
        currentEquipmentSnapshot: equipment,
        hypotheticalEquipmentSnapshot: hypotheticalEquipment,
        liveStats: context.currentStats,
        opponentStats: opponentSamples?.[0] || dummy
      });
      candidateProfile.name = context.basePlayer.name;
      candidateProfile.lifeCurrent = candidateProfile.lifeMax;
      if (!Number.isFinite(candidateProfile.damageMin) || !Number.isFinite(candidateProfile.damageMax) || candidateProfile.damageMax < candidateProfile.damageMin) throw new Error(`Candidate item produced an invalid damage range (${candidateProfile.damageMin}–${candidateProfile.damageMax}).`);
      setAuctionComparisonDiagnosticStage("candidate-profile-built", {
        slot: target.slot,
        damageMin: candidateProfile.damageMin,
        damageMax: candidateProfile.damageMax,
        armour: candidateProfile.armour,
        lifeMax: candidateProfile.lifeMax
      }, false);
      setAuctionComparisonDiagnosticStage("candidate-simulation-start", { slot: target.slot, simulations: settings.simulations, chunkSize: 25, seed: settings.seed }, true);
      const test = await engine.simulateBatchAsync({
        player: candidateProfile,
        enemy: opponentSamples?.[0] || dummy,
        enemies: opponentSamples,
        simulations: settings.simulations,
        seed: settings.seed,
        lifeMode: "full",
        maxRounds: ARENA_SIMULATION_ROUNDS,
        chunkSize: 25,
        onProgress: info => noteAuctionComparisonSimulationProgress(`candidate-progress-${target.slot}`, { slot: target.slot, ...info }),
        onYield: info => recordAuctionComparisonDiagnostic(`candidate-yield-${target.slot}`, { slot: target.slot, ...info }, { persist: true })
      });
      setAuctionComparisonDiagnosticStage("candidate-simulation-complete", { slot: target.slot, simulations: test?.simulations, winRate: test?.rates?.win }, true);
      const winRate = Number(test?.rates?.win || 0);
      const delta = winRate - Number(baseline?.rates?.win || 0);
      if (!best || winRate > best.winRate) best = { slot: target.slot, currentItem: target.item, candidateProfile, test, winRate, delta };
    }
    if (!best) return null;
    const relative = auctionComparisonRelativeDelta(best.delta, baseline?.rates?.win);
    const status = auctionComparisonStatus(best.delta);
    const output = {
      status,
      statusLabel: auctionComparisonStatusLabel(status, best.delta, relative),
      slot: best.slot,
      slotLabel: AUCTION_COMPARISON_LABELS[best.slot] || SLOT_LABELS[best.slot] || slotKey,
      currentItem: best.currentItem,
      baselineWinRate: Number(baseline?.rates?.win || 0),
      candidateWinRate: best.winRate,
      deltaWinRate: best.delta,
      relativeChange: relative,
      simulations: settings.simulations,
      seed: settings.seed,
      comparisonOpponent: context.opponentLabel,
      comparisonOpponentMode: settings.opponentMode,
      statDifferences: auctionComparisonStatDifferences(item, best.currentItem),
      candidateProfile: best.candidateProfile,
      playerFingerprint: context.key,
      itemFingerprint: auctionComparisonItemFingerprint(item)
    };
    await finishAuctionComparisonDiagnostic("complete", {
      slot: best.slot,
      baselineWinRate: output.baselineWinRate,
      candidateWinRate: output.candidateWinRate,
      deltaWinRate: output.deltaWinRate,
      simulations: output.simulations
    });
    return output;
  }

  function auctionComparisonFingerprintsMatch(a, b) {
    try {
      const normalize = value => {
        if (!value || typeof value !== "object") return value ?? null;
        const out = { ...value };
        delete out.categoryValue;
        delete out.auctionCategoryValue;
        return out;
      };
      return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
    } catch (_) { return false; }
  }

  function auctionComparisonPersistentEntry(item, { ignorePlayerFingerprint = false } = {}) {
    const key = auctionComparisonResultKey(item);
    const legacyKey = auctionComparisonLegacyResultKey(item);
    const entry = auctionComparisonPersistentResults.get(key)
      || (legacyKey !== key ? auctionComparisonPersistentResults.get(legacyKey) : null);
    if (!entry || !entry.result) return null;
    const currentFingerprint = auctionComparisonItemFingerprint(item);
    if (!auctionComparisonFingerprintsMatch(entry.itemFingerprint, currentFingerprint)) return null;
    if (!ignorePlayerFingerprint && auctionComparisonCurrentPlayerFingerprint && entry.playerFingerprint
      && !auctionComparisonFingerprintsMatch(entry.playerFingerprint, auctionComparisonCurrentPlayerFingerprint)) return null;
    return entry;
  }

  function normalizeAuctionMaxPrice(value) {
    if (value == null) return null;
    const text = String(value).trim();
    if (!text) return null;
    const numeric = Number(text);
    return Number.isFinite(numeric) && numeric >= 0 ? numeric : null;
  }

  function auctionAffixNormalizeName(value) {
    return normalize(value).normalize("NFC").replace(/\s+/g, " ").trim();
  }

  function auctionAffixKey(value) {
    return auctionAffixNormalizeName(value).toLowerCase();
  }

  function uniqueAuctionAffixNames(values) {
    const seen = new Map();
    for (const value of values || []) {
      const name = auctionAffixNormalizeName(value);
      if (!name) continue;
      const key = auctionAffixKey(name);
      if (!seen.has(key)) seen.set(key, name);
    }
    return [...seen.values()].sort((a, b) => {
      const lengthOrder = b.length - a.length;
      return lengthOrder || a.localeCompare(b, undefined, { sensitivity: "base" });
    });
  }

  function auctionAffixDisplayName(value, kind) {
    const name = auctionAffixNormalizeName(value);
    if (kind !== "suffix") return name;
    return name.replace(/^of\s+the\s+/i, "").replace(/^of\s+/i, "").trim() || name;
  }

  function auctionAffixFilterValues(kind) {
    return auctionAffixCatalogFor(kind).slice().sort((a, b) => {
      const ad = auctionAffixDisplayName(a, kind);
      const bd = auctionAffixDisplayName(b, kind);
      return ad.localeCompare(bd, undefined, { sensitivity: "base", numeric: true }) || a.localeCompare(b, undefined, { sensitivity: "base", numeric: true });
    });
  }

  function normalizeAuctionAffixCatalogPayload(payload) {
    const extractNames = source => {
      if (!Array.isArray(source)) return [];
      return source.map(entry => typeof entry === "string" ? entry : entry?.name).filter(Boolean);
    };
    return {
      schemaVersion: 1,
      prefixes: uniqueAuctionAffixNames(extractNames(payload?.prefixes)),
      suffixes: uniqueAuctionAffixNames(extractNames(payload?.suffixes)),
      updatedAt: payload?.updatedAt || new Date().toISOString(),
      source: payload?.source || "fansite-github",
      error: payload?.error || null
    };
  }

  async function loadAuctionAffixCatalog({ force = false } = {}) {
    if (auctionAffixCatalogLoaded && !force) return auctionAffixCatalog;
    if (auctionAffixCatalogPromise && !force) return auctionAffixCatalogPromise;
    auctionAffixCatalogPromise = (async () => {
      let cached = null;
      try {
        const stored = (await storageGet(AUCTION_AFFIX_CATALOG_STORAGE_KEY))?.[AUCTION_AFFIX_CATALOG_STORAGE_KEY];
        if (stored && typeof stored === "object") cached = normalizeAuctionAffixCatalogPayload(stored);
      } catch (_) {}
      const cachedAt = cached?.updatedAt ? Date.parse(cached.updatedAt) : NaN;
      const cacheFresh = Number.isFinite(cachedAt) && (Date.now() - cachedAt) < AUCTION_AFFIX_CATALOG_MAX_AGE_MS
        && cached.prefixes.length > 0 && cached.suffixes.length > 0;
      if (!force && cacheFresh) {
        auctionAffixCatalog = { ...cached, source: cached.source || "cached" };
        auctionAffixCatalogLoaded = true;
        return auctionAffixCatalog;
      }
      try {
        const response = await promiseWithTimeout(
          runtimeSend({ type: "FETCH_AFFIX_CATALOG", urls: AUCTION_AFFIX_CATALOG_URLS }),
          12000,
          "Auction affix catalog request"
        );
        if (!response?.ok) throw new Error(response?.error || "Auction affix catalog request failed.");
        const next = normalizeAuctionAffixCatalogPayload({
          prefixes: response.prefixes,
          suffixes: response.suffixes,
          updatedAt: new Date().toISOString(),
          source: "fansite-github"
        });
        if (!next.prefixes.length || !next.suffixes.length) throw new Error("Fansite affix catalog returned an empty prefix or suffix list.");
        auctionAffixCatalog = next;
        auctionAffixCatalogLoaded = true;
        try { await storageSet({ [AUCTION_AFFIX_CATALOG_STORAGE_KEY]: next }); } catch (_) {}
        return auctionAffixCatalog;
      } catch (error) {
        const message = error?.message || String(error);
        if (cached?.prefixes.length || cached?.suffixes.length) {
          auctionAffixCatalog = { ...cached, source: "stale-cache", error: message };
        } else {
          auctionAffixCatalog = { schemaVersion: 1, prefixes: [], suffixes: [], updatedAt: null, source: "unavailable", error: message };
        }
        auctionAffixCatalogLoaded = true;
        return auctionAffixCatalog;
      } finally {
        auctionAffixCatalogPromise = null;
      }
    })();
    return auctionAffixCatalogPromise;
  }

  function savedAuctionAffixValues(kind) {
    const field = kind === "prefix" ? "prefix" : "suffix";
    const values = [];
    for (const snapshot of Object.values(currentAuctionStore?.categories || {})) {
      for (const item of snapshot?.items || []) {
        const value = auctionAffixNormalizeName(item?.[field]);
        if (value) values.push(value);
      }
    }
    return uniqueAuctionAffixNames(values);
  }

  function auctionAffixCatalogFor(kind) {
    const catalogValues = kind === "prefix" ? auctionAffixCatalog.prefixes : auctionAffixCatalog.suffixes;
    return uniqueAuctionAffixNames([...(catalogValues || []), ...savedAuctionAffixValues(kind)]);
  }

  function parseAuctionAffixes(item) {
    if (!item || typeof item !== "object") return item;
    const fullName = auctionAffixNormalizeName(item.name);
    if (!fullName) {
      item.prefix = null;
      item.baseItemName = "";
      item.suffix = null;
      item.affixParseSource = "no-item-name";
      return item;
    }
    const source = auctionAffixCatalog.source || "unavailable";
    if (!auctionAffixCatalog.prefixes.length && !auctionAffixCatalog.suffixes.length) {
      item.prefix = item.prefix ? auctionAffixNormalizeName(item.prefix) : null;
      item.baseItemName = item.baseItemName ? auctionAffixNormalizeName(item.baseItemName) : fullName;
      item.suffix = item.suffix ? auctionAffixNormalizeName(item.suffix) : null;
      item.affixParseSource = item.prefix || item.suffix ? "saved-fallback" : source;
      return item;
    }
    let remaining = fullName;
    let suffix = null;
    for (const candidate of auctionAffixCatalog.suffixes) {
      const candidateName = auctionAffixNormalizeName(candidate);
      const candidateKey = auctionAffixKey(candidateName);
      const remainingKey = auctionAffixKey(remaining);
      if (remainingKey.length <= candidateKey.length) continue;
      if (remainingKey.endsWith(` ${candidateKey}`)) {
        suffix = candidateName;
        remaining = remaining.slice(0, remaining.length - candidateName.length).trim();
        break;
      }
    }
    let prefix = null;
    for (const candidate of auctionAffixCatalog.prefixes) {
      const candidateName = auctionAffixNormalizeName(candidate);
      const candidateKey = auctionAffixKey(candidateName);
      const remainingKey = auctionAffixKey(remaining);
      if (remainingKey.length <= candidateKey.length) continue;
      if (remainingKey.startsWith(`${candidateKey} `)) {
        prefix = candidateName;
        remaining = remaining.slice(candidateName.length).trim();
        break;
      }
    }
    item.prefix = prefix;
    item.baseItemName = remaining || fullName;
    item.suffix = suffix;
    item.affixParseSource = source;
    return item;
  }

  function applyAuctionAffixes(items) {
    for (const item of items || []) parseAuctionAffixes(item);
    return items || [];
  }

  function auctionAffixMatches(item, selected, kind) {
    if (!selected?.length) return true;
    const field = kind === "prefix" ? item?.prefix : item?.suffix;
    if (selected.includes(AUCTION_AFFIX_NONE_TOKEN)) {
      return !field;
    }
    return !!field && selected.some(value => auctionAffixKey(value) === auctionAffixKey(field));
  }

  function auctionAffixSummary(selected, kind) {
    const label = kind === "prefix" ? "Prefix" : "Suffix";
    if (!selected?.length) return `${label}: Any`;
    const named = selected.filter(value => value !== AUCTION_AFFIX_NONE_TOKEN);
    if (selected.length === 1 && selected[0] === AUCTION_AFFIX_NONE_TOKEN) return `${label}: None`;
    if (selected.length === 1 && named.length === 1) return `${label}: ${auctionAffixDisplayName(named[0], kind)}`;
    return `${label}: ${selected.length} selected`;
  }

  function updateAuctionAffixButtons() {
    for (const kind of ["prefix", "suffix"]) {
      const button = shadow?.querySelector(`[data-auction-affix-toggle="${kind}"]`);
      if (!button) continue;
      button.textContent = `${auctionAffixSummary(kind === "prefix" ? auctionResultPrefixes : auctionResultSuffixes, kind)} ▾`;
      button.setAttribute("aria-expanded", String(auctionAffixMenuOpen === kind));
    }
    shadow?.querySelectorAll("[data-auction-affix-menu]").forEach(menu => {
      const kind = String(menu.dataset.auctionAffixMenu || "");
      menu.hidden = auctionAffixMenuOpen !== kind;
    });
  }

  function renderAuctionAffixOptions(kind) {
    const menu = shadow?.querySelector(`[data-auction-affix-menu="${kind}"]`);
    if (!menu) return;
    const list = menu.querySelector("[data-auction-affix-options]");
    if (!list) return;
    const search = auctionAffixKey(auctionAffixSearch[kind] || "");
    const values = auctionAffixFilterValues(kind).filter(value => !search || auctionAffixKey(value).includes(search) || auctionAffixKey(auctionAffixDisplayName(value, kind)).includes(search));
    const selected = kind === "prefix" ? auctionResultPrefixes : auctionResultSuffixes;
    const noneLabel = kind === "prefix" ? "No Prefix" : "No Suffix";
    list.innerHTML = [
      `<label class="ga-auction-affix-option"><input type="checkbox" data-auction-affix-input="${kind}" value="${AUCTION_AFFIX_NONE_TOKEN}" ${selected.includes(AUCTION_AFFIX_NONE_TOKEN) ? "checked" : ""}><span>${noneLabel}</span></label>`,
      ...values.map(value => `<label class="ga-auction-affix-option"><input type="checkbox" data-auction-affix-input="${kind}" value="${esc(value)}" ${selected.some(v => auctionAffixKey(v) === auctionAffixKey(value)) ? "checked" : ""}><span>${esc(auctionAffixDisplayName(value, kind))}</span></label>`)
    ].join("");
    const status = menu.querySelector("[data-auction-affix-count]");
    if (status) status.textContent = `${values.length} ${kind}${values.length === 1 ? "" : "es"} available`;
  }

  function toggleAuctionAffixMenu(kind) {
    if (kind !== "prefix" && kind !== "suffix") return;
    auctionAffixMenuOpen = auctionAffixMenuOpen === kind ? null : kind;
    updateAuctionAffixButtons();
    if (auctionAffixMenuOpen === kind) {
      renderAuctionAffixOptions(kind);
      shadow?.querySelector(`[data-auction-affix-search="${kind}"]`)?.focus();
    }
  }

  function closeAuctionAffixMenu() {
    auctionAffixMenuOpen = null;
    updateAuctionAffixButtons();
  }

  async function loadAuctionResultViewState() {
    if (auctionResultViewStateLoaded) return;
    try {
      const key = auctionResultViewStateKey();
      const stored = (await storageGet(key))?.[key];
      const filterValues = new Set(AUCTION_RESULTS_FILTERS.map(x => String(x.value)));
      const sortValues = new Set(AUCTION_RESULTS_SORTS.map(x => String(x.value)));
      if (stored && typeof stored === "object") {
        if (filterValues.has(String(stored.filter))) auctionResultFilter = String(stored.filter);
        if (sortValues.has(String(stored.sort))) auctionResultSort = String(stored.sort);
        const minImprovement = Number(stored.minImprovement);
        const maxPrice = normalizeAuctionMaxPrice(stored.maxPrice);
        if (Number.isFinite(minImprovement)) auctionResultMinImprovement = Math.max(0, minImprovement);
        auctionResultMaxPrice = maxPrice;
        if (Array.isArray(stored.prefixes)) auctionResultPrefixes = [...new Set(stored.prefixes.map(String).filter(Boolean))];
        if (Array.isArray(stored.suffixes)) auctionResultSuffixes = [...new Set(stored.suffixes.map(String).filter(Boolean))];
        if (typeof stored.combineAffixes === "boolean") auctionResultCombineAffixes = stored.combineAffixes;
      }
    } catch (_) {}
    auctionResultViewStateLoaded = true;
  }

  async function saveAuctionResultViewState() {
    if (!auctionResultViewStateLoaded) return;
    try {
      const key = auctionResultViewStateKey();
      await storageSet({ [key]: { schemaVersion: 5, filter: auctionResultFilter, sort: auctionResultSort, minImprovement: auctionResultMinImprovement, maxPrice: auctionResultMaxPrice, prefixes: auctionResultPrefixes, suffixes: auctionResultSuffixes, combineAffixes: auctionResultCombineAffixes, updatedAt: new Date().toISOString() } });
    } catch (_) {}
  }

  async function loadAuctionComparisonResults() {
    try {
      const stored = (await storageGet(auctionComparisonStorageKey()))?.[auctionComparisonStorageKey()];
      const entries = stored?.results && typeof stored.results === "object" ? stored.results : {};
      auctionComparisonPersistentResults = new Map(Object.entries(entries).filter(([key, entry]) => key && entry && typeof entry === "object" && entry.result));
    } catch (_) {
      auctionComparisonPersistentResults = new Map();
    }
    renderAuctionList();
    return auctionComparisonPersistentResults;
  }

  async function persistAuctionComparisonResult(item, result, playerFingerprint = null) {
    const key = auctionComparisonResultKey(item);
    if (!key || !result) return;
    const persistedResult = { ...result };
    delete persistedResult.candidateProfile;
    const entry = {
      schemaVersion: 1,
      updatedAt: new Date().toISOString(),
      result: persistedResult,
      itemFingerprint: auctionComparisonItemFingerprint(item),
      playerFingerprint: playerFingerprint || result?.playerFingerprint || null
    };
    auctionComparisonPersistentResults.set(key, entry);
    try {
      const results = Object.fromEntries(auctionComparisonPersistentResults.entries());
      await storageSet({ [auctionComparisonStorageKey()]: { schemaVersion: 1, updatedAt: entry.updatedAt, results } });
    } catch (_) {}
  }

  function auctionComparisonIsPending(item) {
    const key = auctionComparisonResultKey(item);
    return auctionComparisonState.inFlight.has(key) || auctionComparisonState.queued.has(key);
  }

  function auctionComparisonIsStale(item) {
    if (!item) return false;
    if (auctionComparisonIsPending(item)) return false;
    const entry = auctionComparisonPersistentEntry(item, { ignorePlayerFingerprint: true });
    if (!entry) return false;
    const playerMismatch = !!(auctionComparisonCurrentPlayerFingerprint && entry.playerFingerprint
      && !auctionComparisonFingerprintsMatch(entry.playerFingerprint, auctionComparisonCurrentPlayerFingerprint));
    return playerMismatch || !!auctionComparisonState.forceResimulation || !!auctionComparisonState.pendingInvalidation;
  }

  function getAuctionComparison(item) {
    const key = auctionComparisonResultKey(item);
    if (auctionComparisonIsPending(item) || auctionComparisonState.forceResimulation) return null;
    const cached = auctionComparisonState.cache.get(key) || null;
    if (cached) return cached;
    const entry = auctionComparisonPersistentEntry(item);
    if (!entry) return null;
    auctionComparisonState.cache.set(key, entry.result);
    return entry.result;
  }

  async function pumpAuctionComparisonQueue(state) {
    if (!state || state.running) return;
    state.running = true;
    try {
      while (state.queue.length && state === auctionComparisonState) {
        const job = state.queue.shift();
        if (!job) continue;
        state.queued.delete(job.key);
        if (state.cache.has(job.key)) continue;
        state.inFlight.set(job.key, true);
        try {
          beginAuctionComparisonDiagnostic(job.item, job.generation);
          setAuctionComparisonDiagnosticStage("queue-job-start", { queueRemaining: state.queue.length, inFlight: state.inFlight.size }, true);
          const result = await simulateAuctionComparison(job.item);
          if (state !== auctionComparisonState || state.generation !== job.generation) break;
          const finalResult = result || { status: "error", statusLabel: "⚠ Unavailable", error: "No comparison result." };
          state.cache.set(job.key, finalResult);
          if (result) await persistAuctionComparisonResult(job.item, finalResult, result.playerFingerprint || null);
        } catch (error) {
          if (state !== auctionComparisonState || state.generation !== job.generation) break;
          state.cache.set(job.key, { status: "error", statusLabel: "⚠ Unavailable", error: error?.message || String(error) });
          scheduleNativeEquipmentComparisonRender();
          setAuctionComparisonDiagnosticStage("comparison-error", {
            name: error?.name || null,
            message: error?.message || String(error),
            stack: error?.stack || null,
            queueRemaining: state.queue.length
          }, true);
          await finishAuctionComparisonDiagnostic("error", { error: error?.message || String(error), name: error?.name || null });
        } finally {
          state.inFlight.delete(job.key);
        }
        if (state !== auctionComparisonState) break;
        if (applyPendingAuctionComparisonInvalidation(state)) {
          renderAuctionList();
          await new Promise(resolve => requestAnimationFrame(resolve));
          continue;
        }
        renderAuctionList();
        scheduleNativeEquipmentComparisonRender();
        setAuctionComparisonDiagnosticStage("queue-job-complete", { queueRemaining: state.queue.length, cacheSize: state.cache.size, inFlight: state.inFlight.size }, false);
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
    } finally {
      state.running = false;
    }
  }

  function scheduleAuctionComparison(item) {
    if (!statPriorityStateLoaded || !auctionCandidateSlot(item)) return;
    const key = auctionComparisonResultKey(item);
    const state = auctionComparisonState;
    const hasStored = !!getAuctionComparison(item);
    if (hasStored || state.inFlight.has(key) || state.queued.has(key)) return;
    if (state.forceResimulation) state.cache.delete(key);
    state.queued.add(key);
    state.queue.push({ key, item, generation: state.generation });
    void pumpAuctionComparisonQueue(state);
  }

  function queueAuctionComparisonsAfterCompletedScan() {
    if (!statPriorityStateLoaded) return;
    const items = combinedAuctionItems();
    if (!items.length) return;
    items.forEach(scheduleAuctionComparison);
    auctionComparisonState.forceResimulation = false;
    renderAuctionList();
  }

  function renderAuctionList() {
    renderNativeAuctionComparisonIndicators();
    const el = shadow?.querySelector("#ga-auction-list");
    const status = shadow?.querySelector("#ga-auction-status");
    const filter = shadow?.querySelector("#ga-auction-results-filter");
    const sort = shadow?.querySelector("#ga-auction-results-sort");
    const minImprovementInput = shadow?.querySelector("#ga-auction-min-improvement");
    const maxPriceInput = shadow?.querySelector("#ga-auction-max-price");
    if (!el || !status) return;
    updateAuctionAffixButtons();
    const allItems = combinedAuctionItems();
    const filterValue = auctionResultFilter;
    const minImprovement = Math.max(0, Number(auctionResultMinImprovement) || 0);
    const maxPrice = normalizeAuctionMaxPrice(auctionResultMaxPrice);
    const filteredItems = allItems.filter(item => {
      const itemCategoryValue = String(item?.categoryValue ?? item?.auctionCategoryValue ?? "");
      if (filterValue !== "all") {
        if (filterValue.startsWith("status:")) {
          if (getAuctionComparison(item)?.status !== filterValue.slice(7)) return false;
        } else if (itemCategoryValue !== filterValue) return false;
      }
      const comparison = getAuctionComparison(item);
      const delta = Number(comparison?.deltaWinRate);
      if (minImprovement > 0 && (!Number.isFinite(delta) || delta < minImprovement)) return false;
      if (maxPrice != null && Number(item.auctionPrice) > maxPrice) return false;
      const hasPrefixFilter = auctionResultPrefixes.length > 0;
      const hasSuffixFilter = auctionResultSuffixes.length > 0;
      if (hasPrefixFilter && hasSuffixFilter && auctionResultCombineAffixes) {
        if (!auctionAffixMatches(item, auctionResultPrefixes, "prefix")) return false;
        if (!auctionAffixMatches(item, auctionResultSuffixes, "suffix")) return false;
      } else if (hasPrefixFilter || hasSuffixFilter) {
        const prefixMatch = hasPrefixFilter && auctionAffixMatches(item, auctionResultPrefixes, "prefix");
        const suffixMatch = hasSuffixFilter && auctionAffixMatches(item, auctionResultSuffixes, "suffix");
        if (!(prefixMatch || suffixMatch)) return false;
      }
      return true;
    });
    const indexedItems = filteredItems.map((item, index) => ({ item, index }));
    if (auctionResultSort !== "scan") {
      indexedItems.sort((a, b) => {
        const ca = getAuctionComparison(a.item);
        const cb = getAuctionComparison(b.item);
        const da = Number(ca?.deltaWinRate);
        const db = Number(cb?.deltaWinRate);
        const readyA = Number.isFinite(da);
        const readyB = Number.isFinite(db);
        if (["improvement-desc", "improvement-asc", "efficiency-desc"].includes(auctionResultSort) && readyA !== readyB) return readyA ? -1 : 1;
        if (auctionResultSort === "price-asc" || auctionResultSort === "price-desc") {
          const pa = Number(a.item.auctionPrice);
          const pb = Number(b.item.auctionPrice);
          const av = Number.isFinite(pa) ? pa : Infinity;
          const bv = Number.isFinite(pb) ? pb : Infinity;
          const order = auctionResultSort === "price-asc" ? av - bv : bv - av;
          return order || (a.index - b.index);
        }
        if (!readyA) return a.index - b.index;
        let order = 0;
        if (auctionResultSort === "improvement-desc") order = db - da;
        else if (auctionResultSort === "improvement-asc") order = da - db;
        else if (auctionResultSort === "efficiency-desc") {
          const pa = Number(a.item.auctionPrice);
          const pb = Number(b.item.auctionPrice);
          const ea = Number.isFinite(pa) && pa > 0 ? da / pa * 1000 : -Infinity;
          const eb = Number.isFinite(pb) && pb > 0 ? db / pb * 1000 : -Infinity;
          order = eb - ea;
        }
        return order || (a.index - b.index);
      });
    }
    const items = indexedItems.map(entry => entry.item);
    const lastScanAt = currentAuctionStore?.savedAt || currentAuctionScan?.scannedAt || currentAuctionScan?.savedAt;
    const partial = Object.values(currentAuctionStore?.categories || {}).some(x => x?.diagnostics?.scanStatus === "partial");
    const comparableCount = allItems.filter(item => !!auctionCandidateSlot(item)).length;
    const readyComparisonCount = allItems.filter(item => !!auctionCandidateSlot(item) && !!getAuctionComparison(item)).length;
    const staleComparisonCount = allItems.filter(item => !!auctionCandidateSlot(item) && auctionComparisonIsStale(item)).length;
    status.textContent = allItems.length
      ? `${partial ? "Partial data · " : ""}${items.length}/${allItems.length} displayed · comparisons ${readyComparisonCount}/${comparableCount}${staleComparisonCount ? ` · stale ${staleComparisonCount}` : ""}${minImprovement > 0 ? ` · ≥${minImprovement.toFixed(2)} pp` : ""}${maxPrice != null ? ` · ≤${formatGold(maxPrice)}` : ""}${auctionScanInFlight ? " · comparison starts after scan" : ""}${lastScanAt ? ` · ${new Date(lastScanAt).toLocaleString()}` : ""}`
      : (currentAuctionScan?.diagnostics?.scanStatus === "failed" ? "Last scan failed." : "No auction scan yet.");
    if (filter) filter.value = filterValue;
    if (sort) sort.value = auctionResultSort;
    if (minImprovementInput) minImprovementInput.value = minImprovement > 0 ? String(minImprovement) : "";
    if (maxPriceInput) maxPriceInput.value = maxPrice != null ? String(maxPrice) : "";
    const combineAffixesInput = shadow?.querySelector("#ga-auction-combine-affixes");
    if (combineAffixesInput) combineAffixesInput.checked = auctionResultCombineAffixes;
    if (!items.length) {
      el.innerHTML = `<div class="ga-muted ga-auction-empty">${allItems.length ? `No saved items match <b>${esc(auctionFilterLabel(filterValue))}</b>.` : `No saved auction scan yet. Use <b>Scan Current</b> or <b>Select &amp; Scan</b>.`}</div>`;
      return;
    }
    el.innerHTML = items.map((item, index) => {
      const src = item.iconDataUrl || item.iconUrl || "";
      const size = auctionItemImageSize(item);
      const border = qualityColor(item);
      const comparison = getAuctionComparison(item);
      const stale = !comparison && auctionComparisonIsStale(item);
      const fallbackId = `${item.categoryValue || "?"}:${item.auctionIndex ?? index}:${item.itemHash || "nohash"}:${item.listingId || ""}`;
      const badge = comparison
        ? `<span class="ga-auction-compare-badge ga-auction-compare-${esc(comparison.status)}">${esc(comparison.statusLabel)}</span>`
        : (stale
          ? `<span class="ga-auction-compare-badge ga-auction-compare-stale">↻ Stale result</span>`
          : (auctionCandidateSlot(item) ? `<span class="ga-auction-compare-badge ga-auction-compare-pending">${esc(auctionComparisonPendingLabel())}</span>` : ""));
      const improvementTitle = comparison && Number.isFinite(Number(comparison.deltaWinRate))
        ? `Win-rate change ${statPriorityFormatDelta(comparison.deltaWinRate, 2)} pp`
        : "";
      return `<button class="ga-auction-row" type="button" data-auction-listing-id="${esc(item.listingId || fallbackId)}"${improvementTitle ? ` title="${esc(improvementTitle)}"` : ""} style="--ga-quality-color:${esc(border)}">
        <span class="ga-auction-thumb">${src ? `<img src="${esc(src)}" alt="" style="width:${size.width}px;height:${size.height}px">` : `<span class="ga-missing">?</span>`}</span>
        <span class="ga-auction-row-main">${badge}<span class="ga-auction-price"><span class="ga-auction-gold">${auctionGoldIconDataUrl ? `<img src="${esc(auctionGoldIconDataUrl)}" alt="">` : `<img src="${esc(auctionGoldIconUrl())}" alt="">`}</span><strong>${formatGold(item.auctionPrice)}</strong></span></span>
      </button>`;
    }).join("");
    // Bind each rendered row directly to the item used to create it. Looking the
    // item back up by listingId is unsafe for older scans and for any duplicated
    // or migrated data, and was the cause of unrelated tooltip data appearing
    // when hovering later auction entries.
    el.querySelectorAll(".ga-auction-row").forEach((row, index) => {
      const item = items[index] || null;
      if (!item) return;
      row.addEventListener("mouseenter", () => createHoverTooltip(item, null, row));
      row.addEventListener("mouseleave", removeHoverTooltip);
      row.addEventListener("focus", () => createHoverTooltip(item, null, row));
      row.addEventListener("blur", removeHoverTooltip);
    });
  }

  function auctionGoldIconUrl() {
    try { return new URL(AUCTION_GOLD_ICON_PATH, location.href).href; }
    catch (_) { return AUCTION_GOLD_ICON_PATH; }
  }

  async function ensureAuctionGoldIcon() {
    if (auctionGoldIconDataUrl) return auctionGoldIconDataUrl;
    const url = auctionGoldIconUrl();
    try {
      const cached = await storageGet(auctionGoldIconKey());
      if (cached?.[auctionGoldIconKey()]) {
        auctionGoldIconDataUrl = cached[auctionGoldIconKey()];
        return auctionGoldIconDataUrl;
      }
    } catch (_) {}
    try {
      const response = await fetch(url, { credentials: "same-origin", cache: "force-cache" });
      if (response.ok) {
        const blob = await response.blob();
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(reader.error || new Error("Gold icon read failed."));
          reader.readAsDataURL(blob);
        });
        auctionGoldIconDataUrl = String(dataUrl);
        await storageSet({ [auctionGoldIconKey()]: auctionGoldIconDataUrl });
        return auctionGoldIconDataUrl;
      }
    } catch (_) {}
    auctionGoldIconDataUrl = url;
    return auctionGoldIconDataUrl;
  }

  function renderAuctionDiagnostics(diagnostic = null) {
    const el = shadow?.querySelector("#ga-auction-diagnostic-text");
    if (!el) return;
    el.textContent = diagnostic ? JSON.stringify(diagnostic, null, 2) : "No auction scan yet.";
  }

  async function copyAuctionDiagnostics() {
    const button = shadow?.querySelector("#ga-copy-auction-diagnostics");
    const text = shadow?.querySelector("#ga-auction-diagnostic-text")?.textContent || "";
    if (!text.trim() || text.trim() === "No auction scan yet.") {
      if (button) {
        button.textContent = "Nothing to copy";
        setTimeout(() => { button.textContent = "Copy auction diagnostics"; }, 1200);
      }
      return;
    }
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement("textarea");
        area.value = text; area.readOnly = true; area.style.position = "fixed"; area.style.left = "-9999px";
        document.body.appendChild(area); area.select();
        if (!document.execCommand("copy")) throw new Error("Copy failed");
        area.remove();
      }
      if (button) {
        button.textContent = "Copied!";
        setTimeout(() => { button.textContent = "Copy auction diagnostics"; }, 1200);
      }
    } catch (_) {
      if (button) {
        button.textContent = "Copy failed";
        setTimeout(() => { button.textContent = "Copy auction diagnostics"; }, 1400);
      }
    }
  }

  async function loadSavedAuction({ invalidate = true, invalidationReason = "auction-store-load" } = {}) {
    await loadAuctionResultViewState();
    await loadAuctionAffixCatalog();
    try {
      currentAuctionStore = normalizeAuctionStore(await loadAuctionStoreRaw());
      const last = currentAuctionStore.lastScannedCategory;
      currentAuctionScan = last != null ? currentAuctionStore.categories?.[String(last)] || null : null;
    } catch (_) {
      currentAuctionStore = currentAuctionStoreEmpty();
      currentAuctionScan = null;
    }
    await ensureAuctionGoldIcon();
    await loadAuctionComparisonDiagnostics();
    await loadAuctionComparisonResults();
    if (invalidate) invalidateAuctionComparisons(invalidationReason);
    latestAuctionDiagnostic = currentAuctionScan?.diagnostics || latestAuctionDiagnostic || null;
    renderAuctionList();
    renderAuctionDiagnostics(currentAuctionScan?.diagnostics || null);
    await renderAuctionScanMenu();
    await refreshAuctionControlState();
  }


  async function refreshAuctionControlState() {
    const state = await getAuctionWorkflow();
    const running = !!state?.active;
    const scanButton = shadow?.querySelector("#ga-scan-auction");
    const selectButton = shadow?.querySelector("#ga-select-scan-auction");
    const stopButton = shadow?.querySelector("#ga-stop-auction");
    if (scanButton) scanButton.disabled = running || auctionScanInFlight;
    if (selectButton) selectButton.disabled = running || auctionScanInFlight;
    if (stopButton) stopButton.hidden = !(running || auctionScanInFlight);
  }

  async function saveAuctionDiagnostic(diagnostic) {
    if (!diagnosticCaptureEnabled()) return false;
    latestAuctionDiagnostic = diagnostic || null;
    try { await storageSet({ [auctionDiagnosticKey()]: diagnostic }); } catch (_) {}
    return true;
  }

  async function loadAuctionComparisonDiagnostics() {
    try {
      const result = await storageGet(auctionComparisonDiagnosticKey());
      const stored = result?.[auctionComparisonDiagnosticKey()];
      if (stored && typeof stored === "object") auctionComparisonDiagnostics = stored;
    } catch (_) {}
    renderAuctionComparisonDiagnostics();
    return auctionComparisonDiagnostics;
  }

  function renderAuctionComparisonDiagnostics() {
    const el = shadow?.querySelector("#ga-auction-comparison-diagnostic-text");
    if (!el) return;
    el.textContent = JSON.stringify(auctionComparisonDiagnostics || { schemaVersion: 1, events: [] }, null, 2);
  }

  function queueAuctionComparisonDiagnosticSave() {
    if (auctionComparisonDiagnosticSaveTimer) return;
    auctionComparisonDiagnosticSaveTimer = setTimeout(() => {
      auctionComparisonDiagnosticSaveTimer = null;
      const snapshot = JSON.parse(JSON.stringify(auctionComparisonDiagnostics || {}));
      auctionComparisonDiagnosticWriteChain = auctionComparisonDiagnosticWriteChain
        .then(() => storageSet({ [auctionComparisonDiagnosticKey()]: snapshot }))
        .catch(() => {});
    }, 100);
  }

  async function flushAuctionComparisonDiagnosticSave() {
    if (auctionComparisonDiagnosticSaveTimer) {
      clearTimeout(auctionComparisonDiagnosticSaveTimer);
      auctionComparisonDiagnosticSaveTimer = null;
    }
    const snapshot = JSON.parse(JSON.stringify(auctionComparisonDiagnostics || {}));
    auctionComparisonDiagnosticWriteChain = auctionComparisonDiagnosticWriteChain
      .then(() => storageSet({ [auctionComparisonDiagnosticKey()]: snapshot }))
      .catch(() => {});
    await auctionComparisonDiagnosticWriteChain;
  }

  function recordAuctionComparisonDiagnostic(stage, details = {}, { persist = false } = {}) {
    if (!diagnosticCaptureEnabled()) return null;
    const now = performance.now();
    const active = auctionComparisonDiagnostics?.active;
    const event = {
      at: new Date().toISOString(),
      stage,
      elapsedMs: active?.startedPerf != null ? Math.round(now - active.startedPerf) : null,
      details
    };
    auctionComparisonDiagnostics.events = [event, ...(auctionComparisonDiagnostics.events || [])].slice(0, AUCTION_COMPARISON_DIAGNOSTIC_MAX_EVENTS);
    auctionComparisonDiagnostics.updatedAt = event.at;
    if (persist) queueAuctionComparisonDiagnosticSave();
    renderAuctionComparisonDiagnostics();
    return event;
  }

  function beginAuctionComparisonDiagnostic(item, generation) {
    if (!diagnosticCaptureEnabled()) return;
    const startedPerf = performance.now();
    const startedAt = new Date().toISOString();
    auctionComparisonDiagnostics.active = {
      generation,
      startedAt,
      startedPerf,
      itemKey: auctionComparisonResultKey(item),
      itemId: item?.itemId ?? null,
      itemName: item?.name || null,
      listingId: item?.listingId || null,
      categoryValue: item?.categoryValue ?? item?.auctionCategoryValue ?? null,
      categoryLabel: item?.categoryLabel || null,
      candidateSlot: auctionCandidateSlot(item),
      simulations: globalSimulationCount(),
      currentStage: "starting",
      lastProgress: null,
      pendingInvalidation: false
    };
    recordAuctionComparisonDiagnostic("comparison-start", {
      generation,
      itemKey: auctionComparisonDiagnostics.active.itemKey,
      itemId: auctionComparisonDiagnostics.active.itemId,
      itemName: auctionComparisonDiagnostics.active.itemName,
      listingId: auctionComparisonDiagnostics.active.listingId,
      candidateSlot: auctionComparisonDiagnostics.active.candidateSlot,
      simulations: auctionComparisonDiagnostics.active.simulations
    }, { persist: true });
  }

  function setAuctionComparisonDiagnosticStage(stage, details = {}, persist = false) {
    if (!diagnosticCaptureEnabled()) return;
    if (auctionComparisonDiagnostics.active) auctionComparisonDiagnostics.active.currentStage = stage;
    recordAuctionComparisonDiagnostic(stage, details, { persist });
  }

  function noteAuctionComparisonSimulationProgress(stage, info = {}) {
    if (!diagnosticCaptureEnabled()) return;
    const active = auctionComparisonDiagnostics.active;
    if (active) {
      active.lastProgress = {
        stage,
        completed: Number(info.completed) || 0,
        total: Number(info.total) || 0,
        chunkSize: Number(info.chunkSize) || 0,
        chunkElapsedMs: Number(info.chunkElapsedMs) || null,
        totalElapsedMs: Number(info.totalElapsedMs) || null,
        completedAt: new Date().toISOString()
      };
      active.currentStage = stage;
    }
    recordAuctionComparisonDiagnostic(stage, info, { persist: true });
  }

  async function finishAuctionComparisonDiagnostic(status, details = {}) {
    if (!diagnosticCaptureEnabled()) return;
    if (!auctionComparisonDiagnostics.active) return;
    const active = auctionComparisonDiagnostics.active;
    const completedAt = new Date().toISOString();
    const completed = { ...active, startedPerf: undefined, finishedAt: completedAt, status, elapsedMs: Math.round(performance.now() - active.startedPerf), ...details };
    delete completed.startedPerf;
    recordAuctionComparisonDiagnostic(`comparison-${status}`, details, { persist: true });
    auctionComparisonDiagnostics.lastCompleted = completed;
    auctionComparisonDiagnostics.active = null;
    renderAuctionComparisonDiagnostics();
    await flushAuctionComparisonDiagnosticSave();
  }

  async function copyAuctionComparisonDiagnostics(event) {
    const button = event?.currentTarget || shadow?.querySelector("#ga-copy-auction-comparison-diagnostics");
    const text = JSON.stringify(auctionComparisonDiagnostics || { schemaVersion: 1, events: [] }, null, 2);
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement("textarea");
        area.value = text; area.readOnly = true; area.style.position = "fixed"; area.style.left = "-9999px";
        document.body.appendChild(area); area.select();
        if (!document.execCommand("copy")) throw new Error("Copy failed");
        area.remove();
      }
      if (button) {
        button.textContent = "Copied!";
        setTimeout(() => { button.textContent = "Copy"; }, 1200);
      }
    } catch (_) {
      if (button) {
        button.textContent = "Copy failed";
        setTimeout(() => { button.textContent = "Copy"; }, 1400);
      }
    }
  }

  async function captureCleanScreenshot() {
    const wasHidden = host?.style.visibility === "hidden";
    if (host) host.style.visibility = "hidden";
    try {
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return await requestScreenshot();
    } finally {
      if (host && !wasHidden) host.style.visibility = "visible";
    }
  }


  function auctionVisibleListingIndices() {
    return Array.from(document.querySelectorAll('.auction_item_div')).map((listing, index) => {
      const rect = listing.getBoundingClientRect();
      const style = getComputedStyle(listing);
      const visible = rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden'
        && rect.top >= 0 && rect.bottom <= window.innerHeight && rect.left >= 0 && rect.right <= window.innerWidth;
      return visible ? index : null;
    }).filter(index => index != null);
  }

  function auctionListingScrollTarget(processed) {
    const listings = Array.from(document.querySelectorAll('.auction_item_div'));
    return listings.find((_, index) => !processed.has(index)) || null;
  }

  async function waitAfterAuctionScroll() {
    await auctionDelayWithJitter(AUCTION_TIMING.scrollSettleMs, AUCTION_TIMING.scrollJitterMs);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  async function scanAuctionViewport() {
    const result = await runtimeSend({ type: "SCAN_AUCTION" });
    if (!result || typeof result !== "object") throw new Error("The auction scan service returned no response.");
    const diagnostics = result.diagnostics || {};
    if (!result.ok && Array.isArray(result.items) && result.items.length === 0 && !diagnostics.pageDetected) {
      throw new Error(result.error || "Auction page was not detected.");
    }
    const viewport = result.capture?.viewport || diagnostics.viewport || { width: window.innerWidth, height: window.innerHeight, devicePixelRatio: window.devicePixelRatio || 1 };
    const rects = result.capture?.itemRects || {};
    let shot = null;
    const errors = [];
    try { shot = await captureCleanScreenshot(); }
    catch (error) { errors.push(`Screenshot capture: ${error?.message || String(error)}`); }
    let captured = 0;
    const pngGroups = new Map();
    if (shot) {
      for (const item of result.items || []) {
        const index = Number(item.auctionIndex);
        const rect = rects?.[String(index)] || rects?.[String(result.items.indexOf(item))] || null;
        if (!rect) { errors.push(`listing ${index + 1}: no visible icon crop rectangle.`); continue; }
        try {
          const png = await cropScreenshot(shot, rect, viewport);
          if (!png) throw new Error("Icon crop returned no PNG.");
          item.iconDataUrl = png;
          item.iconSource = "screenshot";
          captured++;
          if (!pngGroups.has(png)) pngGroups.set(png, []);
          pngGroups.get(png).push(index);
        } catch (error) {
          errors.push(`listing ${index + 1} icon crop: ${error?.message || String(error)}`);
        }
      }
    }
    return { result, captured, errors, pngGroups };
  }

  function aggregateAuctionDiagnostics(base, items, errors, processedCount, totalListings, iterations, duplicatePngs) {
    const unique = items;
    const d = { ...(base || {}) };
    d.scanStatus = errors.length || unique.some(item => !item.iconDataUrl) || processedCount < totalListings ? "partial" : "success";
    d.failedStage = d.scanStatus === "partial" ? (errors.some(e => /screenshot|icon/i.test(e)) ? "icon_capture" : "scroll_capture") : null;
    d.listingsFound = totalListings;
    d.itemsAccepted = unique.length;
    d.itemsParsed = unique.length;
    d.itemsWithPrice = unique.filter(i => i.auctionPrice != null).length;
    d.itemsWithIcons = unique.filter(i => i.iconDataUrl || i.iconCapture).length;
    d.itemRectsDetected = unique.filter(i => i.iconCapture).length;
    d.qualitiesDetected = unique.filter(i => i.quality && i.quality !== "unknown").length;
    d.durabilityDetected = unique.filter(i => i.durability?.percent != null).length;
    d.conditioningDetected = unique.filter(i => i.conditioning?.percent != null).length;
    d.valuesDetected = unique.filter(i => i.value != null).length;
    d.rawPercentStatsDetected = unique.filter(i => Object.values(i.raw || {}).some(v => v && v.percent)).length;
    d.throughDurabilityDetected = unique.filter(i => Object.values(i.throughDurability || {}).some(v => v && (v.flat || v.percent))).length;
    d.itemHashesDetected = unique.filter(i => i.itemHash).length;
    d.itemMeasurementsDetected = unique.filter(i => i.measurementX && i.measurementY).length;
    d.iconScreenshotReady = unique.filter(i => i.iconCapture).length;
    d.iconsFound = d.itemsWithIcons;
    d.iconScreenshotAttempted = unique.length;
    d.iconScreenshotCaptured = unique.filter(i => i.iconDataUrl).length;
    d.iconPngCached = d.iconScreenshotCaptured;
    d.itemRects = d.itemRectsDetected;
    d.duplicateIconPngs = duplicatePngs;
    d.scrollIterations = iterations;
    d.listingsProcessed = processedCount;
    d.totalListings = totalListings;
    d.errors = [...new Set([...(d.errors || []), ...errors])];
    d.goldIconSource = auctionGoldIconDataUrl?.startsWith("data:") ? "hardcoded+local-cache" : "hardcoded-url";
    d.goldIconLoaded = auctionGoldIconDataUrl ? 1 : 0;
    d.prefixesDetected = unique.filter(i => !!i.prefix).length;
    d.suffixesDetected = unique.filter(i => !!i.suffix).length;
    d.itemsWithAffixes = unique.filter(i => !!i.prefix || !!i.suffix).length;
    d.auctionAffixCatalog = { source: auctionAffixCatalog.source, updatedAt: auctionAffixCatalog.updatedAt, prefixes: auctionAffixCatalog.prefixes.length, suffixes: auctionAffixCatalog.suffixes.length, error: auctionAffixCatalog.error || null };
    d.auctionAffixFilters = { prefixes: [...auctionResultPrefixes], suffixes: [...auctionResultSuffixes], combineAffixes: !!auctionResultCombineAffixes };
    d.affixSamples = unique.slice(0, 12).map(item => ({ listingId: item.listingId || null, name: item.name || null, prefix: item.prefix || null, baseItemName: item.baseItemName || null, suffix: item.suffix || null, suffixDisplay: item.suffix ? auctionAffixDisplayName(item.suffix, "suffix") : null, source: item.affixParseSource || null }));
    return d;
  }

  async function scanAuction({ fromWorkflow = false } = {}) {
    if (auctionScanInFlight) return false;
    const status = shadow?.querySelector("#ga-auction-status");
    const progress = shadow?.querySelector("#ga-auction-progress");
    auctionScanInFlight = true;
    auctionScanStopRequested = false;
    invalidateAuctionComparisons("auction-scan-start");
    const originalScroll = { x: Number(window.scrollX || 0), y: Number(window.scrollY || 0) };
    const byIndex = new Map();
    const processed = new Set();
    const rejected = new Set();
    const errors = [];
    const duplicatePngMap = new Map();
    let totalListings = 0;
    let iterations = 0;
    let lastDiagnostics = {};
    let stopped = false;
    try {
      const category = getCurrentAuctionCategory();
      if (!category.select) throw new Error("Auction category selector was not found.");
      if (status) status.textContent = `Scanning ${category.label || "current category"}…`;
      if (progress) { progress.hidden = false; progress.textContent = "Preparing auction listings…"; }
      await loadAuctionAffixCatalog();
      const pageReady = await waitForAuctionPageStable(category.value);
      let scanIncomplete = false;
      if (!pageReady) {
        errors.push(`Auction category ${category.label || category.value || "current"} did not reach a stable page state before scanning.`);
        scanIncomplete = true;
      }
      let stalledIterations = 0;
      while (!scanIncomplete && iterations < 200) {
        iterations++;
        const listings = Array.from(document.querySelectorAll('.auction_item_div'));
        totalListings = Math.max(totalListings, listings.length);
        if (!listings.length) {
          const result = await scanAuctionViewport();
          lastDiagnostics = result.result.diagnostics || lastDiagnostics;
          if (!result.result.items?.length && result.result.diagnostics?.pageDetected) break;
        }
        const targetIndex = listings.findIndex((_, index) => !processed.has(index));
        if (targetIndex < 0) {
          const currentCount = listings.length;
          if (currentCount > totalListings) { totalListings = currentCount; continue; }
          break;
        }
        const processedBefore = processed.size;
        const target = listings[targetIndex];
        target.scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" });
        await waitAfterAuctionScroll();

        const readyAfterScroll = await waitForAuctionPageStable(category.value, { timeoutMs: 2500, stableSamples: 1 });
        if (!readyAfterScroll) {
          stalledIterations += 1;
          if (stalledIterations >= AUCTION_TIMING.maxStalledIterations) {
            errors.push("Auction scan stopped after repeated unstable viewport states.");
            scanIncomplete = true;
            break;
          }
          continue;
        }

        const visibleIndices = new Set(auctionVisibleListingIndices());
        const viewportResult = await scanAuctionViewport();
        lastDiagnostics = viewportResult.result.diagnostics || lastDiagnostics;
        totalListings = Math.max(totalListings, Number(viewportResult.result.diagnostics?.listingsFound || 0), document.querySelectorAll('.auction_item_div').length);

        for (const item of viewportResult.result.items || []) {
          const idx = Number(item.auctionIndex);
          if (!Number.isFinite(idx) || !visibleIndices.has(idx)) continue;
          item.auctionIndex = idx;
          item.categoryValue = String(category.value ?? item.categoryValue ?? "0");
          item.categoryLabel = category.label || item.categoryLabel || "All";
          item.listingId = auctionListingId(category.value, idx);
          const previous = byIndex.get(idx);
          if (!previous || (item.iconDataUrl && !previous.iconDataUrl)) byIndex.set(idx, item);
          processed.add(idx);
          if (item.iconDataUrl) {
            if (!duplicatePngMap.has(item.iconDataUrl)) duplicatePngMap.set(item.iconDataUrl, new Set());
            duplicatePngMap.get(item.iconDataUrl).add(idx);
          }
        }
        // Any listing that was visible to us has now been given a chance to parse;
        // mark missing/invalid entries as rejected so a malformed listing cannot trap the scroll loop.
        for (const idx of visibleIndices) {
          if (!processed.has(idx)) { processed.add(idx); rejected.add(idx); }
        }

        if (processed.size > processedBefore) {
          stalledIterations = 0;
        } else {
          stalledIterations += 1;
          if (stalledIterations >= AUCTION_TIMING.maxStalledIterations) {
            errors.push("Auction scan stopped after repeated viewport attempts made no progress.");
            scanIncomplete = true;
            break;
          }
        }

        for (const e of viewportResult.errors) errors.push(e);
        if (viewportResult.result.diagnostics?.errors) errors.push(...viewportResult.result.diagnostics.errors);
        if (progress) progress.hidden = false;
        if (progress) progress.textContent = `Scanning ${category.label || "category"}… ${Math.min(processed.size, totalListings)}/${totalListings || "?"} listings`;
        if (status) status.textContent = `Scanning ${category.label || "current category"}…`;

        const workflow = await getAuctionWorkflow();
        if (auctionScanStopRequested || workflow?.stopRequested) {
          stopped = true;
          break;
        }
      }

      const items = [...byIndex.values()].sort((a, b) => Number(a.auctionIndex || 0) - Number(b.auctionIndex || 0));
      applyAuctionAffixes(items);
      const duplicatePngs = [...duplicatePngMap.values()].map(group => [...group]).filter(group => group.length > 1);
      const diagnostics = aggregateAuctionDiagnostics(lastDiagnostics, items, errors, processed.size, totalListings, iterations, duplicatePngs);
      if (scanIncomplete && diagnostics.scanStatus === "success") {
        diagnostics.scanStatus = "partial";
        diagnostics.failedStage = diagnostics.failedStage || "scan_progress";
      }
      diagnostics.rejectedListings = rejected.size;
      diagnostics.acceptedCoverage = totalListings > 0 ? `${Math.min(items.length + rejected.size, totalListings)}/${totalListings}` : "0/0";
      diagnostics.stopRequested = stopped;
      diagnostics.categoryValue = category.value;
      diagnostics.categoryLabel = category.label;
      const categoryValue = String(category.value ?? "0");
      const categoryLabel = category.label || "All";
      currentAuctionStore = normalizeAuctionStore(currentAuctionStore);
      const previousSnapshot = currentAuctionStore.categories[categoryValue];
      const sequence = Number(previousSnapshot?.scanSequence || currentAuctionStore.nextScanSequence || 1);
      const snapshot = {
        schemaVersion: 2,
        savedAt: new Date().toISOString(),
        scannedAt: new Date().toISOString(),
        pageDetected: !!diagnostics.pageDetected,
        diagnostics: diagnosticCaptureEnabled() ? diagnostics : null,
        categoryValue,
        categoryLabel,
        scanSequence: sequence,
        items,
        itemCount: items.length
      };
      currentAuctionStore.categories[categoryValue] = snapshot;
      currentAuctionStore.nextScanSequence = Math.max(Number(currentAuctionStore.nextScanSequence || 1), sequence + 1);
      currentAuctionStore.lastScannedCategory = categoryValue;
      currentAuctionStore.savedAt = new Date().toISOString();
      currentAuctionScan = snapshot;
      await storageSet({ [auctionKey()]: currentAuctionStore });
      await saveAuctionDiagnostic(diagnostics);
      renderAuctionList();
      renderAuctionDiagnostics(diagnostics);
      if (progress) progress.hidden = true;
      if (!fromWorkflow && diagnostics.scanStatus === "success" && !stopped) queueAuctionComparisonsAfterCompletedScan();
      const outcome = stopped ? "stopped" : (diagnostics.scanStatus === "partial" ? "partially scanned" : "scanned");
      if (status) status.textContent = `${items.length} ${categoryLabel} item${items.length === 1 ? "" : "s"} ${outcome}.`;
      if (fromWorkflow) {
        if (diagnostics.scanStatus === "success" && !stopped) {
          await advanceAuctionWorkflow();
        } else {
          const workflowState = await getAuctionWorkflow();
          if (workflowState?.active) {
            workflowState.stopRequested = true;
            await storageSet({ [auctionWorkflowKey()]: workflowState });
            await finishAuctionWorkflow(workflowState, true);
          }
        }
      }
      return diagnostics.scanStatus === "success";
    } catch (error) {
      const partialItems = [...byIndex.values()].sort((a, b) => Number(a.auctionIndex || 0) - Number(b.auctionIndex || 0));
      applyAuctionAffixes(partialItems);
      const diagnostics = aggregateAuctionDiagnostics(lastDiagnostics, partialItems, [...errors, error?.message || String(error)], processed.size, totalListings, iterations, [...duplicatePngMap.values()].map(group => [...group]).filter(group => group.length > 1));
      diagnostics.scanStatus = "failed";
      diagnostics.failedStage = diagnostics.failedStage || "scroll_capture";
      diagnostics.rejectedListings = rejected.size;
      diagnostics.acceptedCoverage = totalListings > 0 ? `${Math.min(byIndex.size + rejected.size, totalListings)}/${totalListings}` : "0/0";
      diagnostics.errors = [...new Set([...(diagnostics.errors || []), error?.message || String(error)])];
      const category = getCurrentAuctionCategory();
      diagnostics.categoryValue = category.value;
      diagnostics.categoryLabel = category.label;
      currentAuctionScan = { schemaVersion: 2, savedAt: new Date().toISOString(), scannedAt: new Date().toISOString(), diagnostics: diagnosticCaptureEnabled() ? diagnostics : null, items: partialItems };
      try {
        currentAuctionStore = normalizeAuctionStore(currentAuctionStore);
        const previousSnapshot = currentAuctionStore.categories[String(category.value ?? "0")];
        const sequence = Number(previousSnapshot?.scanSequence || currentAuctionStore.nextScanSequence || 1);
        currentAuctionStore.categories[String(category.value ?? "0")] = {
          schemaVersion: 2,
          savedAt: new Date().toISOString(),
          scannedAt: new Date().toISOString(),
          pageDetected: !!diagnostics.pageDetected,
          diagnostics,
          categoryValue: String(category.value ?? "0"),
          categoryLabel: category.label || "All",
          scanSequence: sequence,
          items: partialItems,
          itemCount: partialItems.length
        };
        currentAuctionStore.nextScanSequence = Math.max(Number(currentAuctionStore.nextScanSequence || 1), sequence + 1);
        currentAuctionStore.lastScannedCategory = String(category.value ?? "0");
        currentAuctionStore.savedAt = new Date().toISOString();
        await storageSet({ [auctionKey()]: currentAuctionStore });
      } catch (storageError) {
        diagnostics.errors = [...new Set([...(diagnostics.errors || []), `Partial auction storage failed: ${storageError?.message || String(storageError)}`])];
      }
      await saveAuctionDiagnostic(diagnostics);
      renderAuctionList();
      renderAuctionDiagnostics(diagnostics);
      if (status) status.textContent = "Auction scan failed; partial results and diagnostics preserved.";
      if (fromWorkflow) {
        const workflowState = await getAuctionWorkflow();
        if (workflowState?.active) {
          workflowState.stopRequested = true;
          await storageSet({ [auctionWorkflowKey()]: workflowState });
          await finishAuctionWorkflow(workflowState, true);
        }
      }
      return false;
    } finally {
      window.scrollTo({ left: originalScroll.x, top: originalScroll.y, behavior: "auto" });
      auctionScanInFlight = false;
      auctionScanStopRequested = false;
      await refreshAuctionControlState();
    }
  }

  async function clearAuction() {
    await clearAuctionWorkflow();
    await storageRemove(auctionKey());
    try { await storageRemove(legacyAuctionKey()); } catch (_) {}
    try { await storageRemove(auctionComparisonStorageKey()); } catch (_) {}
    auctionComparisonPersistentResults = new Map();
    currentAuctionStore = currentAuctionStoreEmpty();
    currentAuctionScan = null;
    auctionResultFilter = "all";
    auctionResultPrefixes = [];
    auctionResultSuffixes = [];
    auctionResultCombineAffixes = false;
    auctionAffixSearch = { prefix: "", suffix: "" };
    void saveAuctionResultViewState();
    closeAuctionAffixMenu();
    invalidateAuctionComparisons("general-state-change");
    renderAuctionList();
    renderAuctionDiagnostics(null);
    await refreshAuctionControlState();
    const status = shadow?.querySelector("#ga-auction-status");
    if (status) status.textContent = "Saved auction data cleared.";
  }

  async function clearEquipment() {
    await loadCharacterProfileStore();
    for (const profile of Object.values(characterProfileStore.characters || {})) {
      profile.equipment = {};
      profile.equipmentUpdatedAt = null;
      profile.quickSignature = null;
      profile.fingerprint = null;
    }
    await saveCharacterProfileStore();
    try { await storageRemove(equipmentKey()); } catch (_) {}
    savedEquipment = null;
    currentEquipment = {};
    invalidateAuctionComparisons("equipment-cleared");
    renderEquipment({});
    renderDiagnostics(null);
    shadow.querySelector("#ga-equipment-status").textContent = "Saved equipment cleared.";
  }

  function switchTab(name) {
    if (!VALID_TABS.has(name)) return;
    removeHoverTooltip();
    if (auctionScanMenuOpen) { auctionScanMenuOpen = false; void renderAuctionScanMenu(); }
    closeAuctionAffixMenu();
    activeTab = name;
    void saveActiveTab(name);
    shadow.querySelectorAll(".ga-tab").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === name));
    shadow.querySelectorAll(".ga-tab-panel").forEach(section => section.classList.toggle("active", section.dataset.panel === name));
    if (name === "stat-priority") renderStatPriorityTab();
    if (name === "diagnostics") renderDiagnosticCaptureControls();
  }

  function applyVisibility() {
    if (!host) return;
    host.style.display = overlayState.visible ? "block" : "none";
    if (!overlayState.visible) removeHoverTooltip();
  }

  function setVisible(visible, persist = true) {
    overlayState.visible = !!visible;
    applyVisibility();
    if (persist) saveOverlayState();
  }

  function applyMinimized() {
    if (!body || !panel) return;
    body.style.display = overlayState.minimized ? "none" : "block";
    panel.classList.toggle("ga-minimized", overlayState.minimized);
    applySize();
    const btn = shadow.querySelector("#ga-minimize");
    if (btn) btn.textContent = overlayState.minimized ? "+" : "−";
  }

  function setMinimized(minimized, persist = true) {
    overlayState.minimized = !!minimized;
    applyMinimized();
    if (persist) saveOverlayState();
  }

  function clampSize(width, height) {
    const maxWidth = Math.max(260, window.innerWidth - 18);
    const maxHeight = Math.max(260, window.innerHeight - 18);
    const minWidth = Math.min(420, maxWidth);
    const minHeight = Math.min(420, maxHeight);
    const w = Number(width);
    const h = Number(height);
    return {
      width: Math.max(minWidth, Math.min(Number.isFinite(w) ? w : 600, maxWidth)),
      height: Math.max(minHeight, Math.min(Number.isFinite(h) ? h : 650, maxHeight))
    };
  }

  function applySize() {
    if (!panel) return;
    if (overlayState.minimized) {
      panel.style.width = "220px";
      panel.style.height = "auto";
      return;
    }
    const hasWidth = Number.isFinite(Number(overlayState.width));
    const hasHeight = Number.isFinite(Number(overlayState.height));
    if (!hasWidth && !hasHeight) return;
    const size = clampSize(
      hasWidth ? overlayState.width : 600,
      hasHeight ? overlayState.height : Math.min(650, window.innerHeight - 18)
    );
    panel.style.width = `${Math.round(size.width)}px`;
    panel.style.height = `${Math.round(size.height)}px`;
  }

  function scheduleSaveResize() {
    if (overlayState.minimized || !panel) return;
    if (resizeSaveTimer) clearTimeout(resizeSaveTimer);
    resizeSaveTimer = setTimeout(() => {
      const rect = panel.getBoundingClientRect();
      overlayState.width = Math.round(rect.width);
      overlayState.height = Math.round(rect.height);
      saveOverlayState();
    }, 250);
  }

  function watchResize() {
    if (!panel || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => scheduleSaveResize());
    observer.observe(panel);
  }

  function clampPosition(left, top) {
    const width = panel?.getBoundingClientRect().width || 570;
    const height = panel?.getBoundingClientRect().height || 650;
    return {
      left: Math.max(6, Math.min(Number(left), Math.max(6, window.innerWidth - width - 6))),
      top: Math.max(6, Math.min(Number(top), Math.max(6, window.innerHeight - height - 6)))
    };
  }

  function applyPosition() {
    if (Number.isFinite(Number(overlayState.left)) && Number.isFinite(Number(overlayState.top))) {
      const p = clampPosition(overlayState.left, overlayState.top);
      host.style.left = `${Math.round(p.left)}px`;
      host.style.top = `${Math.round(p.top)}px`;
      host.style.right = "auto";
    } else {
      host.style.right = "18px";
      host.style.top = "18px";
      host.style.left = "auto";
    }
  }

  function makeDraggable() {
    const handle = shadow.querySelector(".ga-header");
    let dragging = false;
    let startX = 0, startY = 0, startLeft = 0, startTop = 0;
    handle.addEventListener("pointerdown", event => {
      if (event.target.closest("button")) return;
      dragging = true;
      handle.setPointerCapture?.(event.pointerId);
      const rect = host.getBoundingClientRect();
      startX = event.clientX; startY = event.clientY; startLeft = rect.left; startTop = rect.top;
      host.style.left = `${rect.left}px`; host.style.top = `${rect.top}px`; host.style.right = "auto";
      event.preventDefault();
    });
    handle.addEventListener("pointermove", event => {
      if (!dragging) return;
      const p = clampPosition(startLeft + event.clientX - startX, startTop + event.clientY - startY);
      host.style.left = `${p.left}px`; host.style.top = `${p.top}px`;
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      const rect = host.getBoundingClientRect();
      overlayState.left = rect.left; overlayState.top = rect.top;
      saveOverlayState();
    };
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  }

  function itemGridCss() {
    return `
      .ga-paper{position:relative;display:grid;grid-template-columns:repeat(6,52px);grid-template-rows:repeat(7,52px);gap:6px;padding:8px;background:#151e2d;border:1px solid #475569;border-radius:10px;overflow:hidden;justify-content:center;}
      .ga-slot{position:relative;min-width:0;min-height:0;overflow:hidden;display:flex;align-items:center;justify-content:center;}
      .ga-helmet{grid-column:3 / span 2;grid-row:1 / span 2}.ga-amulet{grid-column:5;grid-row:1}.ga-weapon{grid-column:1 / span 2;grid-row:3 / span 3}.ga-chest{grid-column:3 / span 2;grid-row:3 / span 3}.ga-shield{grid-column:5 / span 2;grid-row:3 / span 3}.ga-gloves{grid-column:1 / span 2;grid-row:6 / span 2}.ga-boots{grid-column:3 / span 2;grid-row:6 / span 2}.ga-ring1{grid-column:5;grid-row:6}.ga-ring2{grid-column:6;grid-row:6}
      .ga-item-visual{width:100%;height:100%;border:1px solid #334155;border-radius:7px;background:transparent;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;overflow:hidden;}
      .ga-item-visual:hover,.ga-item-visual:focus-visible{border-color:#64748b;background:#111827;outline:none;}
      .ga-item-icon{display:block;max-width:100%;max-height:100%;object-fit:contain;border-radius:4px;image-rendering:auto;}
    `;
  }

  function ensureNativeOpponentWinRateStyles() {
    const styleId = "ga-native-opponent-winrate-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .ga-native-winrate-host{position:relative!important;overflow:visible!important}
      .ga-native-winrate-badge{
        position:absolute!important;display:inline-flex!important;align-items:center!important;gap:4px!important;
        margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;
        pointer-events:none!important;white-space:nowrap!important;z-index:20!important;
        color:#000!important;font:inherit!important;
        transform:translateY(-50%)!important;box-shadow:none!important;
      }
      .ga-native-winrate-text{color:#000!important}
      .ga-native-winrate-dot{
        display:inline-block!important;width:7px!important;height:7px!important;min-width:7px!important;
        border-radius:50%!important;background:#9ca3af!important;vertical-align:middle!important;
        box-shadow:none!important;
      }
      .ga-native-winrate-dot[data-light="good"]{background:#16a34a!important}
      .ga-native-winrate-dot[data-light="warn"]{background:#eab308!important}
      .ga-native-winrate-dot[data-light="bad"],.ga-native-winrate-dot[data-light="error"]{background:#dc2626!important}
      .ga-native-auction-compare{position:fixed!important;display:inline-flex!important;align-items:center!important;gap:2px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;pointer-events:none!important;white-space:nowrap!important;z-index:100!important;transform:translateY(-50%)!important;box-shadow:none!important;color:#000!important;font:inherit!important}
      .ga-native-auction-compare-arrow{display:inline-block!important;flex:0 0 10px!important;width:10px!important;height:13px!important;margin:0 1px 0 0!important;background:currentColor!important;clip-path:polygon(50% 0,100% 50%,65% 50%,65% 100%,35% 100%,35% 50%,0 50%)!important;vertical-align:middle!important}
      .ga-native-auction-compare-arrow.ga-native-auction-compare-arrow-down{clip-path:polygon(35% 0,65% 0,65% 50%,100% 50%,50% 100%,0 50%,35% 50%)!important}
      .ga-native-auction-compare-arrow.ga-native-auction-compare-arrow-sidegrade{height:10px!important;background:currentColor!important;clip-path:polygon(0 50%,35% 0,35% 35%,65% 35%,65% 0,100% 50%,65% 100%,65% 65%,35% 65%,35% 100%)!important}
      .ga-native-auction-compare-value{color:#000!important;font:inherit!important;line-height:1!important}
      .ga-native-equipment-compare{position:fixed!important;display:inline-flex!important;align-items:center!important;gap:2px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;pointer-events:none!important;white-space:nowrap!important;z-index:100!important;transform:translateY(-50%)!important;box-shadow:none!important;color:#000!important;font:inherit!important}
      .ga-native-equipment-compare-arrow{display:inline-block!important;flex:0 0 10px!important;width:10px!important;height:13px!important;margin:0 1px 0 0!important;background:currentColor!important;clip-path:polygon(50% 0,100% 50%,65% 50%,65% 100%,35% 100%,35% 50%,0 50%)!important;vertical-align:middle!important}
      .ga-native-equipment-compare-arrow.ga-native-auction-compare-arrow-down{clip-path:polygon(35% 0,65% 0,65% 50%,100% 50%,50% 100%,0 50%,35% 50%)!important}
      .ga-native-equipment-compare-arrow.ga-native-auction-compare-arrow-sidegrade{height:10px!important;background:currentColor!important;clip-path:polygon(0 50%,35% 0,35% 35%,65% 35%,65% 0,100% 50%,65% 100%,65% 65%,35% 65%,35% 100%)!important}
      .ga-native-equipment-compare-value{color:#000!important;font:inherit!important;font-weight:700!important;line-height:1!important}
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  async function createOverlay() {
    if (host) return;
    host = document.createElement("div");
    host.id = "gladiatus-assistant-overlay";
    host.style.cssText = "position:fixed;z-index:2147483647;pointer-events:none;inset:auto;";
    shadow = host.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      :host,*{box-sizing:border-box}.ga-panel{position:relative;width:600px;min-width:420px;min-height:420px;max-width:calc(100vw - 18px);max-height:calc(100vh - 18px);resize:both;overflow:auto;pointer-events:auto;color:#f3f4f6;font:12px system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#111827;border:1px solid #475569;border-radius:12px;box-shadow:0 14px 40px rgba(0,0,0,.45)}
      .ga-header{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:9px 10px;background:#1f2937;border-radius:11px 11px 0 0;cursor:move;position:sticky;top:0;z-index:5}.ga-title{font-size:14px;font-weight:800}.ga-status{color:#94a3b8;font-size:9px;margin-top:2px}.ga-actions{display:flex;gap:4px}.ga-btn{border:1px solid #475569;background:#374151;color:#e5e7eb;border-radius:6px;min-width:24px;height:24px;cursor:pointer;font-weight:800}.ga-btn:hover{background:#4b5563}.ga-body{padding:10px}.ga-panel.ga-minimized{width:220px;min-width:220px;min-height:0;height:auto;resize:none}.ga-panel.ga-minimized .ga-header{border-radius:11px}
      .ga-tabs{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:4px;margin-bottom:9px;padding:4px;background:#1f2937;border-radius:9px}.ga-tab{border:0;background:transparent;color:#9ca3af;border-radius:7px;padding:7px 6px;cursor:pointer;font-weight:700;font-size:10px}.ga-tab:hover{background:#374151;color:#e5e7eb}.ga-tab.active{background:#d1d5db;color:#111827}.ga-tab-panel{display:none}.ga-tab-panel.active{display:block}
      .ga-card{background:#1f2937;border-radius:10px;padding:10px;margin-top:9px}.ga-card:first-child{margin-top:0}.ga-card-head{display:flex;justify-content:space-between;gap:8px;align-items:flex-start}.ga-card h2{font-size:13px;margin:0 0 7px}.ga-actions-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.ga-secondary,.ga-primary{border:1px solid #475569;border-radius:7px;padding:6px 8px;cursor:pointer;font-weight:700;font-size:10px}.ga-primary{background:#d1d5db;color:#111827}.ga-secondary{background:#374151;color:#e5e7eb}.ga-secondary:hover{background:#4b5563}.ga-muted{color:#94a3b8;font-size:10px}.ga-statusline{margin-bottom:7px;color:#94a3b8;font-size:9px}.ga-character-switcher{display:grid;grid-template-columns:34px minmax(0,1fr) 34px;gap:5px;align-items:center;margin:8px 0}.ga-character-cycle{height:28px;min-width:34px;padding:4px 6px;border:1px solid #475569;border-radius:7px;background:#374151;color:#e5e7eb;cursor:pointer;font-weight:900;font-size:14px;line-height:1}.ga-character-cycle:hover:not(:disabled){background:#4b5563}.ga-character-cycle:disabled{opacity:.4;cursor:default}.ga-character-current{min-width:0;padding:6px 8px;border:1px solid #334155;border-radius:7px;background:#111827;text-align:center;color:#e5e7eb;font-size:10px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ga-stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.ga-subsection-title{font-size:12px;margin:10px 0 7px;color:#e5e7eb}.ga-auto-module{border-top:1px solid #374151;padding:8px 0}.ga-auto-module:first-of-type{border-top:0}.ga-auto-module-head{display:flex;align-items:center;justify-content:space-between;gap:8px}.ga-check{display:flex;align-items:center;gap:7px;color:#e5e7eb;font-size:12px}.ga-check input{width:14px;height:14px}.ga-auto-combat-options{display:grid;grid-template-columns:110px 1fr 110px;gap:7px}.ga-auto-combat-options label{display:flex;flex-direction:column;gap:4px;color:#cbd5e1;font-size:10px;font-weight:700}.ga-auto-combat-options select,.ga-auto-combat-options input{width:100%;border:1px solid #475569;border-radius:7px;background:#111827;color:#e5e7eb;padding:6px 7px;font:inherit} .ga-auto-expedition-grid{display:grid;grid-template-columns:1fr 110px;gap:7px;margin-top:8px}.ga-auto-expedition-grid label{display:flex;flex-direction:column;gap:4px;color:#cbd5e1;font-size:10px;font-weight:700}.ga-auto-expedition-grid select,.ga-auto-expedition-grid input{width:100%;border:1px solid #475569;border-radius:7px;background:#111827;color:#e5e7eb;padding:6px 7px;font:inherit}.ga-stat{background:#111827;border-radius:7px;padding:7px 8px;display:flex;justify-content:space-between;gap:8px}.ga-stat strong{font-weight:800}.ga-target:first-child{border-top:0;padding-top:0}.ga-target-title{font-weight:800;margin-bottom:5px}.ga-row{display:flex;justify-content:space-between;gap:8px;font-size:10px;margin:3px 0}.ga-arena-analysis-list{border:1px solid #334155;border-radius:7px;overflow:hidden}.ga-arena-analysis-row{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;padding:6px 7px;border-top:1px solid #334155;font-size:10px}.ga-arena-analysis-row:first-child{border-top:0}.ga-arena-analysis-row small{display:block;margin-top:2px}.ga-pill{display:inline-block;padding:2px 5px;background:#374151;border-radius:999px;font-size:8px}.ga-focus:first-child{border-top:0}.ga-focus strong{min-width:82px}.ga-focus span{color:#cbd5e1}
      ${itemGridCss()}
      .ga-hover-tooltip{position:fixed;z-index:2147483647;width:max-content;min-width:220px;max-width:330px;padding:10px;border:1px solid #64748b;border-radius:9px;background:#0f172a;color:#e5e7eb;box-shadow:0 10px 28px rgba(0,0,0,.55);pointer-events:none;font-size:10px;line-height:1.2}.ga-hover-head{display:flex;align-items:center;gap:8px;min-width:0}.ga-hover-icon{width:54px;height:54px;flex:0 0 54px;object-fit:contain;background:#111827;border:1px solid #475569;border-radius:6px}.ga-hover-icon.ga-missing{display:flex;align-items:center;justify-content:center;color:#64748b}.ga-hover-title{min-width:0;flex:1}.ga-hover-name{font-size:12px;line-height:1.2;font-weight:900;overflow-wrap:anywhere}.ga-hover-meta{color:#94a3b8;font-size:9px;margin-top:3px}.ga-hover-section{margin-top:9px}.ga-hover-section-title{color:#94a3b8;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;margin-bottom:4px}.ga-hover-stats{display:flex;flex-wrap:wrap;gap:4px}.ga-hover-stat{background:#1f2937;border:1px solid #334155;border-radius:5px;padding:3px 5px;font-size:9px}.ga-hover-muted{color:#64748b;font-size:9px}.ga-hover-stat-table{display:grid;grid-template-columns:minmax(0,1fr) 56px;border:1px solid #334155;border-radius:5px;overflow:hidden;background:#1f2937}.ga-hover-stat-table-header,.ga-hover-stat-table-row{display:contents}.ga-hover-stat-table-header>span{color:#94a3b8;font-size:8px;font-weight:800;padding:3px 5px;background:#172033;border-bottom:1px solid #334155}.ga-hover-stat-table-header>span:last-child{text-align:right}.ga-hover-stat-table-row>span{min-width:0;padding:3px 5px;font-size:9px;border-bottom:1px solid #273447}.ga-hover-stat-table-row:last-child>span{border-bottom:0}.ga-hover-stat-table-row>span:last-child{text-align:right;color:#cbd5e1;white-space:nowrap}.ga-hover-grid{display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:9px}.ga-hover-grid>div{display:flex;justify-content:space-between;gap:7px;padding:4px 5px;background:#1f2937;border-radius:5px;font-size:9px}.ga-hover-grid strong{color:#f3f4f6}.ga-tier{display:inline-flex;align-items:center;justify-content:center;min-width:24px;padding:2px 5px;border:1px solid currentColor;border-radius:5px;font-size:10px;font-weight:900}.ga-missing{color:#64748b}
      .ga-combat-result{display:inline-flex;align-items:center;justify-content:center;padding:4px 7px;border-radius:999px;border:1px solid #475569;background:#111827;color:#cbd5e1;font-size:9px;font-weight:800}.ga-combat-result.win,.ga-combat-history-result.win{color:#86efac;border-color:#166534}.ga-combat-result.loss,.ga-combat-history-result.loss{color:#fca5a5;border-color:#7f1d1d}.ga-combat-result.unknown,.ga-combat-history-result.unknown{color:#cbd5e1}.ga-combat-history{display:flex;flex-direction:column;margin-top:7px;border-top:1px solid #374151}.ga-combat-history-head,.ga-combat-history-row{display:grid;grid-template-columns:minmax(0,1fr) 64px 118px;gap:8px;align-items:center}.ga-combat-history-head{padding:5px 7px;color:#94a3b8;font-size:8px}.ga-combat-history-row{width:100%;border:0;border-top:1px solid #273447;background:transparent;color:#e5e7eb;padding:7px;cursor:pointer;text-align:left}.ga-combat-history-row:hover{background:#172033}.ga-combat-history-main{min-width:0;display:flex;flex-direction:column;gap:2px}.ga-combat-history-main strong{font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ga-combat-history-main small{font-size:8px;color:#94a3b8}.ga-combat-history-result{font-size:8px;font-weight:800}.ga-combat-history-values{display:grid;grid-template-columns:1fr 1fr;gap:4px;text-align:right;font-size:9px}.ga-combat-history-values span:first-child::before{content:"↑ ";color:#94a3b8}.ga-combat-history-values span:last-child::before{content:"↓ ";color:#94a3b8}.ga-combat-history-detail{white-space:pre-wrap;overflow-wrap:anywhere;margin-top:7px;font-size:8px;line-height:1.35;color:#94a3b8;background:#0f172a;border-radius:7px;padding:8px;max-height:360px;overflow:auto}.ga-combat-metrics-grid{grid-template-columns:repeat(3,1fr)}.ga-combat-filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:8px}.ga-combat-filters label{display:flex;flex-direction:column;gap:4px}.ga-combat-filters label span{font-size:8px;color:#94a3b8}.ga-combat-filters select{width:100%}.ga-combat-trend-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:8px}.ga-combat-trend-grid .ga-stat small{display:block;margin-top:4px;font-size:8px;color:#64748b}.ga-combat-delta{font-weight:700}.ga-combat-delta.up{color:#86efac}.ga-combat-delta.down{color:#fca5a5}.ga-combat-delta.same{color:#cbd5e1}
      .ga-stat-hoverable{cursor:help}.ga-stat-hoverable:hover,.ga-stat-hoverable:focus-visible{border:1px solid #64748b;outline:none}.ga-stat-tooltip{position:fixed;z-index:2147483647;width:235px;max-width:300px;padding:8px 9px;border:1px solid #64748b;border-radius:8px;background:#0f172a;color:#e5e7eb;box-shadow:0 10px 28px rgba(0,0,0,.55);pointer-events:none;font-size:10px;line-height:1.2}.ga-stat-tooltip-title{font-size:11px;font-weight:900;margin-bottom:6px}.ga-stat-tooltip-row{display:flex;justify-content:space-between;gap:10px;padding:3px 0}.ga-stat-tooltip-row strong{color:#f8fafc}      .ga-diag-pills{display:flex;flex-wrap:wrap;gap:5px}.ga-diag-pill{background:#111827;color:#cbd5e1;border:1px solid #374151;border-radius:999px;padding:3px 6px;font-size:8px}.ga-diag-pill b{font-weight:800}.ga-diagnostic-pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:8px;line-height:1.35;color:#94a3b8;background:#0f172a;border-radius:7px;padding:8px;max-height:300px;overflow:auto}.ga-icon-preview{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;margin-top:7px}.ga-preview{background:#0f172a;border:1px solid #334155;border-radius:7px;padding:4px;text-align:center;min-width:0}.ga-preview img,.ga-preview-missing{width:40px;height:40px;display:block;object-fit:contain;margin:0 auto;background:#111827;border-radius:5px}.ga-preview-missing{display:flex;align-items:center;justify-content:center;color:#64748b}.ga-preview-slot{margin-top:3px;color:#94a3b8;font-size:7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .ga-auction-controls{position:relative}.ga-auction-scan-menu{position:absolute;right:0;top:calc(100% + 6px);z-index:50;width:260px;background:#0f172a;border:1px solid #475569;border-radius:9px;box-shadow:0 14px 30px rgba(0,0,0,.5);padding:8px}.ga-auction-menu-title{font-weight:800;font-size:10px;margin-bottom:6px}.ga-auction-menu-list{display:grid;grid-template-columns:1fr 1fr;gap:4px 8px;max-height:280px;overflow:auto}.ga-auction-menu-list label{display:flex;align-items:center;gap:5px;font-size:9px;color:#cbd5e1;padding:3px 0}.ga-auction-menu-actions{display:flex;justify-content:flex-end;gap:5px;margin-top:7px;padding-top:7px;border-top:1px solid #334155}.ga-auction-toolbar{display:flex;align-items:center;justify-content:flex-start;flex-wrap:wrap;gap:7px;margin-top:8px;position:relative}.ga-auction-toolbar label{display:flex;align-items:center;gap:6px;font-size:9px;color:#cbd5e1}.ga-auction-toolbar select{padding:5px 7px;border-radius:6px;border:1px solid #475569;background:#111827;color:#e5e7eb;font-size:9px}.ga-auction-affix-control{position:relative}.ga-auction-affix-toggle{white-space:nowrap}.ga-auction-affix-menu{position:absolute;left:0;top:calc(100% + 5px);z-index:60;width:270px;padding:8px;background:#0f172a;border:1px solid #475569;border-radius:9px;box-shadow:0 14px 32px rgba(0,0,0,.55)}.ga-auction-affix-search{width:100%;padding:6px 7px;border-radius:6px;border:1px solid #475569;background:#111827;color:#f3f4f6;font-size:10px}.ga-auction-affix-count{margin-top:5px;color:#64748b;font-size:8px}.ga-auction-affix-options{display:flex;flex-direction:column;gap:2px;max-height:270px;overflow:auto;margin-top:5px;padding-right:2px}.ga-auction-affix-option{display:flex;align-items:center;gap:6px;padding:3px 4px;color:#cbd5e1;font-size:9px;border-radius:5px;cursor:pointer}.ga-auction-affix-option:hover{background:#172033}.ga-auction-affix-actions{display:flex;justify-content:flex-end;gap:5px;margin-top:7px;padding-top:7px;border-top:1px solid #334155}.ga-auction-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;max-height:min(58vh,520px);overflow:auto;padding-right:2px;margin-top:8px}.ga-auction-row{appearance:none;width:100%;min-width:0;display:grid;grid-template-columns:72px minmax(0,1fr);align-items:center;gap:8px;padding:6px 7px;background:#111827;border:1px solid #334155;border-radius:7px;color:#e5e7eb;cursor:pointer;text-align:left;box-sizing:border-box;box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--ga-quality-color,#64748b) 70%,transparent)}.ga-auction-row:hover,.ga-auction-row:focus-visible{outline:none;border-color:var(--ga-quality-color,#64748b);background:#172033;transform:none}
      .ga-auction-row-main{min-width:0;display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:8px}.ga-auction-compare-badge{display:inline-flex;align-items:center;padding:3px 5px;border-radius:5px;font-size:8px;font-weight:900;white-space:nowrap;border:1px solid #475569}.ga-auction-compare-upgrade{color:#86efac;border-color:#166534;background:#052e16}.ga-auction-compare-sidegrade{color:#fde68a;border-color:#92400e;background:#451a03}.ga-auction-compare-pending{color:#93c5fd;border-color:#1d4ed8;background:#172554}.ga-auction-compare-stale{color:#fcd34d;border-color:#92400e;background:#451a03}.ga-auction-compare-error{color:#fca5a5;border-color:#991b1b;background:#450a0a}.ga-auction-compare-worse{color:#fca5a5;border-color:#991b1b;background:#450a0a}.ga-comparison-status{font-size:9px;font-weight:900;margin-top:3px}.ga-comparison-upgrade{color:#86efac}.ga-comparison-sidegrade{color:#fde68a}.ga-comparison-pending{color:#93c5fd}.ga-comparison-error{color:#fca5a5}.ga-comparison-worse{color:#fca5a5}.ga-auction-thumb{width:72px;height:72px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#0f172a;border-radius:5px}.ga-auction-thumb img{display:block;object-fit:contain}.ga-auction-price{display:flex;align-items:center;gap:5px;font-size:12px}.ga-auction-price strong{font-size:12px}.ga-auction-gold{width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 16px}.ga-auction-gold img{width:16px;height:16px;object-fit:contain;display:block}.ga-gold-fallback{width:14px;height:14px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;border:1px solid #d1a94c;color:#d1a94c;font-size:8px}.ga-auction-empty{padding:18px 8px;text-align:center;grid-column:1/-1}.ga-auction-progress{margin-top:6px;color:#94a3b8;font-size:9px}.ga-sim-controls{margin-top:8px}.ga-stat-priority-controls{margin-top:8px}.ga-stat-priority-cost-preview{display:flex;flex-wrap:wrap;gap:5px;align-items:center;font-size:9px;color:#cbd5e1}.ga-stat-priority-cost-preview>span{background:#111827;border:1px solid #334155;border-radius:5px;padding:4px 6px}.ga-stat-priority-summary{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;margin-bottom:8px}.ga-table-wrap{overflow:auto;border:1px solid #334155;border-radius:7px}.ga-stat-priority-table{width:100%;border-collapse:collapse;font-size:9px;background:#111827}.ga-stat-priority-table th{padding:6px 7px;text-align:left;color:#94a3b8;font-weight:800;background:#172033;white-space:nowrap}.ga-stat-priority-table td{padding:6px 7px;border-top:1px solid #273447;color:#e5e7eb;vertical-align:top}.ga-stat-priority-table td small{display:block;color:#94a3b8;font-size:8px;margin-top:2px}.ga-stat-priority-table td:nth-child(2),.ga-stat-priority-table td:nth-child(3),.ga-stat-priority-table td:nth-child(4),.ga-stat-priority-table td:nth-child(5){white-space:nowrap}.ga-stat-priority-manual-grid{margin-top:8px}.ga-manual-combined{margin-bottom:8px;padding:8px;border:1px solid #334155;border-radius:7px;background:#111827}.ga-manual-combined-title{font-weight:900;color:#e5e7eb;margin-bottom:7px}.ga-manual-combined-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;font-size:9px}.ga-manual-combined-grid span{color:#94a3b8}.ga-manual-combined-grid strong{color:#f8fafc}
      .ga-sim-two-col{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ga-sim-two-col section{min-width:0}.ga-sim-two-col h3{font-size:10px;margin:0 0 6px;color:#cbd5e1}.ga-sim-profile-two{display:grid;grid-template-columns:1fr 1fr;gap:7px}.ga-sim-profile-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}.ga-sim-profile{background:#111827;border-radius:7px;padding:7px}.ga-sim-profile-title{font-weight:800;font-size:10px;margin-bottom:6px}.ga-sim-profile-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;font-size:8px;color:#cbd5e1}.ga-sim-result-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px}.ga-sim-profile select,.ga-sim-profile input{max-width:100%}.ga-sim-result{background:#0f172a;border-radius:7px;padding:7px}.ga-sim-captured-profile{background:#0f172a;border:1px solid #475569;border-radius:7px;padding:7px}.ga-sim-two-col select{width:100%;padding:6px 7px;border-radius:6px;border:1px solid #475569;background:#111827;color:#e5e7eb;font-size:9px}.ga-sim-two-col input{box-sizing:border-box}.ga-primary:disabled,.ga-secondary:disabled{opacity:.55;cursor:wait}
      .ga-combat-diagnostic-pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:8px;line-height:1.35;color:#94a3b8;background:#0f172a;border-radius:7px;padding:8px;max-height:420px;overflow:auto}.ga-auction-diagnostic-pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:8px;line-height:1.35;color:#94a3b8;background:#0f172a;border-radius:7px;padding:8px;max-height:260px;overflow:auto}
      .ga-field-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.ga-field{display:flex;flex-direction:column;gap:3px;font-size:9px;color:#cbd5e1}.ga-field input,.ga-field select{width:100%;padding:6px;border-radius:6px;border:1px solid #475569;background:#111827;color:#f3f4f6;font-size:10px;box-sizing:border-box}.ga-field select{cursor:pointer}.ga-settings-section{margin-top:8px;padding-top:8px;border-top:1px solid #374151}.ga-settings-section:first-child{margin-top:0;padding-top:0;border-top:0}.ga-target-edit:first-child{border-top:0}.ga-settings-save{display:flex;justify-content:flex-end;gap:7px;align-items:center;margin-top:8px}.ga-settings-status{color:#a7f3d0;font-size:9px}
      .ga-footer{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:7px 10px 9px;color:#64748b;font-size:9px}.ga-footer button{border:0;background:none;color:#94a3b8;cursor:pointer;padding:0}
      @media(max-width:700px){.ga-panel{width:calc(100vw - 12px)}.ga-paper{grid-template-columns:repeat(6,minmax(0,1fr));grid-template-rows:repeat(7,minmax(40px,9.5vw));gap:4px}.ga-stats-grid{grid-template-columns:repeat(2,1fr)}.ga-field-grid{grid-template-columns:repeat(2,1fr)}.ga-sim-two-col,.ga-sim-profile-two,.ga-sim-profile-three{grid-template-columns:1fr}.ga-sim-result-grid,.ga-stat-priority-summary{grid-template-columns:repeat(2,1fr)}}
    `;
    shadow.appendChild(style);
    activeTab = await loadActiveTab();

    panel = document.createElement("section");
    panel.className = "ga-panel";
    panel.innerHTML = `
      <header class="ga-header">
        <div><div class="ga-title">Gladiatus Assistant</div><div class="ga-status">Loading…</div></div>
        <div class="ga-actions"><button class="ga-btn" id="ga-minimize" type="button" title="Minimize">−</button><button class="ga-btn" id="ga-close" type="button" title="Hide">×</button></div>
      </header>
      <div class="ga-body">
        <nav class="ga-tabs" aria-label="Assistant sections">
          <button class="ga-tab${activeTab === "equipment" ? " active" : ""}" data-tab="equipment" type="button">Character Overview</button>
          <button class="ga-tab${activeTab === "auctions" ? " active" : ""}" data-tab="auctions" type="button">Auctions</button>
          <button class="ga-tab${activeTab === "combat" ? " active" : ""}" data-tab="combat" type="button">Combat</button>
          <button class="ga-tab${activeTab === "stat-priority" ? " active" : ""}" data-tab="stat-priority" type="button">Stat Priority</button>
          <button class="ga-tab${activeTab === "diagnostics" ? " active" : ""}" data-tab="diagnostics" type="button">Diagnostics</button>
          <button class="ga-tab${activeTab === "settings" ? " active" : ""}" data-tab="settings" type="button">Settings</button>
        </nav>

        <section class="ga-tab-panel${activeTab === "equipment" ? " active" : ""}" data-panel="equipment">
          <section class="ga-card">
            <div class="ga-card-head">
              <div><h2>Character Overview</h2><div class="ga-statusline" id="ga-equipment-status">Loading saved character profile…</div></div>
              <div class="ga-actions-row"><button class="ga-primary" id="ga-scan-equipment" type="button">Capture All Characters</button><button class="ga-secondary" id="ga-clear-equipment" type="button">Clear saved</button></div>
            </div>
            <div class="ga-character-switcher" aria-label="Character selector">
              <button class="ga-character-cycle" data-character-cycle="-1" type="button" aria-label="Previous character">‹</button>
              <div class="ga-character-current" data-character-selector-label>No captured characters</div>
              <button class="ga-character-cycle" data-character-cycle="1" type="button" aria-label="Next character">›</button>
            </div>
            <h3 class="ga-subsection-title">Equipment</h3>
            <div class="ga-paper" id="ga-paper">
              <div class="ga-slot ga-helmet" data-slot="helmet"></div>
              <div class="ga-slot ga-amulet" data-slot="amulet"></div>
              <div class="ga-slot ga-weapon" data-slot="weapon"></div>
              <div class="ga-slot ga-chest" data-slot="chest"></div>
              <div class="ga-slot ga-shield" data-slot="shield"></div>
              <div class="ga-slot ga-gloves" data-slot="gloves"></div>
              <div class="ga-slot ga-boots" data-slot="boots"></div>
              <div class="ga-slot ga-ring1" data-slot="ring1"></div>
              <div class="ga-slot ga-ring2" data-slot="ring2"></div>
            </div>
            <div class="ga-muted" style="margin-top:6px">Full capture navigates through the available characters and stores stats, roles, and equipment. Saved profiles are the simulator source of truth; live stat refresh is only used for the Character Overview display when available.</div>
            <div class="ga-card-head" style="margin-top:12px"><div><h3 class="ga-subsection-title">Character Stats</h3><div class="ga-statusline" id="ga-character-stats-status"></div></div><button class="ga-secondary" id="ga-refresh-stats" type="button">Refresh live</button></div>
            <div class="ga-stats-grid" id="ga-stats-grid"></div>
          </section>
        </section>

        <section class="ga-tab-panel${activeTab === "auctions" ? " active" : ""}" data-panel="auctions">
          <section class="ga-card">
            <div class="ga-card-head">
              <div><h2>Auctions</h2><div class="ga-statusline" id="ga-auction-status">No auction scan yet.</div></div>
              <div class="ga-actions-row ga-auction-controls">
                <button class="ga-primary" id="ga-scan-auction" type="button">Scan Current</button>
                <button class="ga-secondary" id="ga-select-scan-auction" type="button" aria-expanded="false">Select &amp; Scan ▾</button>
                <button class="ga-secondary" id="ga-stop-auction" type="button" hidden>Stop</button>
                <button class="ga-secondary" id="ga-clear-auction" type="button">Clear Data</button>
                <div class="ga-auction-scan-menu" id="ga-auction-scan-menu" hidden>
                  <div class="ga-auction-menu-title">Categories to scan</div>
                  <div class="ga-auction-menu-list">
                    ${AUCTION_CATEGORIES.map(c => `<label><input type="checkbox" value="${esc(c.value)}" data-auction-category="${esc(c.value)}"><span>${esc(c.label)}</span></label>`).join("")}
                  </div>
                  <div class="ga-auction-menu-actions"><button class="ga-secondary" id="ga-auction-select-all" type="button">Select all</button><button class="ga-secondary" id="ga-auction-select-none" type="button">Clear</button><button class="ga-primary" id="ga-auction-start-selected" type="button">Start scan</button></div>
                </div>
              </div>
            </div>
            <div class="ga-auction-toolbar">
              <label>Filter <select id="ga-auction-results-filter">${AUCTION_RESULTS_FILTERS.map(c => `<option value="${esc(c.value)}">${esc(c.label)}</option>`).join("")}</select></label>
              <label>Sort <select id="ga-auction-results-sort">${AUCTION_RESULTS_SORTS.map(c => `<option value="${esc(c.value)}">${esc(c.label)}</option>`).join("")}</select></label>
              <label>Min improvement <input id="ga-auction-min-improvement" type="number" min="0" step="0.1" placeholder="0" title="Minimum win-rate improvement in percentage points"></label>
              <label>Max price <input id="ga-auction-max-price" type="number" min="0" step="1" placeholder="Any" title="Maximum auction price"></label>
              <div class="ga-auction-affix-control" data-auction-affix-control="prefix">
                <button class="ga-secondary ga-auction-affix-toggle" data-auction-affix-toggle="prefix" type="button" aria-expanded="false">Prefix: Any ▾</button>
                <div class="ga-auction-affix-menu" data-auction-affix-menu="prefix" hidden>
                  <input class="ga-auction-affix-search" data-auction-affix-search="prefix" type="search" placeholder="Search prefixes…" autocomplete="off">
                  <div class="ga-auction-affix-count" data-auction-affix-count></div>
                  <div class="ga-auction-affix-options" data-auction-affix-options></div>
                  <div class="ga-auction-affix-actions"><button class="ga-secondary" data-auction-affix-clear="prefix" type="button">Clear</button><button class="ga-primary" data-auction-affix-done="prefix" type="button">Done</button></div>
                </div>
              </div>
              <div class="ga-auction-affix-control" data-auction-affix-control="suffix">
                <button class="ga-secondary ga-auction-affix-toggle" data-auction-affix-toggle="suffix" type="button" aria-expanded="false">Suffix: Any ▾</button>
                <div class="ga-auction-affix-menu" data-auction-affix-menu="suffix" hidden>
                  <input class="ga-auction-affix-search" data-auction-affix-search="suffix" type="search" placeholder="Search suffixes…" autocomplete="off">
                  <div class="ga-auction-affix-count" data-auction-affix-count></div>
                  <div class="ga-auction-affix-options" data-auction-affix-options></div>
                  <div class="ga-auction-affix-actions"><button class="ga-secondary" data-auction-affix-clear="suffix" type="button">Clear</button><button class="ga-primary" data-auction-affix-done="suffix" type="button">Done</button></div>
                </div>
              </div>
              <label title="When enabled, an item must match both its selected prefix and its selected suffix. When disabled, matching either selected affix is enough."><input id="ga-auction-combine-affixes" type="checkbox"> Combine Prefix + Suffix</label>
              <span class="ga-muted">Combined saved results</span>
            </div>
            <div class="ga-auction-progress" id="ga-auction-progress" hidden></div>
            <div class="ga-auction-list" id="ga-auction-list"></div>
            <div class="ga-muted" style="margin-top:6px">Hover an item to view its full details. Results preserve in-game order within each scanned category, including duplicates.</div>
          </section>
        </section>

        <section class="ga-tab-panel${activeTab === "combat" ? " active" : ""}" data-panel="combat">
          <div id="ga-combat-tab-content"></div>
        </section>
        <section class="ga-tab-panel${activeTab === "stat-priority" ? " active" : ""}" data-panel="stat-priority">
          <div id="ga-stat-priority-tab-content"></div>
        </section>

        <section class="ga-tab-panel${activeTab === "diagnostics" ? " active" : ""}" data-panel="diagnostics">
          <section class="ga-card"><div class="ga-card-head"><div><h2>Master Diagnostics</h2><div class="ga-muted">Refresh shows a lightweight chronological preview. Copy master diagnostic builds the full structured export, including diagnostic snapshots and source state, without rendering the full payload into the UI.</div></div><div class="ga-actions-row"><button class="ga-secondary" id="ga-refresh-master-diagnostics" type="button">Refresh</button><button class="ga-primary" id="ga-copy-master-diagnostics" type="button">Copy master diagnostic</button><button class="ga-secondary" id="ga-clear-master-diagnostics" type="button">Clear</button></div></div><div class="ga-actions-row" style="margin-top:8px"><button class="ga-secondary" id="ga-toggle-diagnostic-capture" type="button" aria-pressed="false">Diagnostic Capture: OFF</button><span class="ga-muted" id="ga-diagnostic-capture-state"></span></div><div class="ga-statusline" id="ga-master-diagnostic-status" style="margin-top:7px">Not refreshed yet.</div><pre class="ga-diagnostic-pre" id="ga-master-diagnostic-text">Click Refresh to build the master diagnostic.</pre></section>
        </section>

        <section class="ga-tab-panel${activeTab === "settings" ? " active" : ""}" data-panel="settings">
          <section class="ga-card"><h2>Global simulation</h2><div class="ga-field-grid"><label class="ga-field"><span>Simulations</span><input data-setting="simulationCount" type="number" min="1" max="10000" step="1"></label></div><div class="ga-muted" style="margin-top:5px">This single value is used for Stat Priority analysis, Arena opponent analysis, Circus Provinciarum opponent analysis, and Auction House item-comparison calculations. Lower values finish faster but produce noisier Monte Carlo estimates.</div></section>
          <section class="ga-card"><h2>Item Comparison</h2><div class="ga-field-grid"><label class="ga-field"><span>Comparison opponent</span><select data-comparison-setting="opponentMode"><option value="player-clone">Player Clone</option><option value="expedition-enemy">Expedition Enemy</option></select></label><label class="ga-field"><span>Expedition enemy</span><select data-comparison-setting="expeditionEnemyKey"></select></label></div><div class="ga-muted" style="margin-top:5px">Player Clone keeps the existing behavior. Expedition Enemy uses the bundled Gladiatus Fansite enemy database. Every simulation gets a new random roll for each ranged enemy stat; the baseline and candidate use the same rolled enemy for that simulation, and the same sampled enemy set is reused across all candidate items in the comparison batch.</div></section>
          <section class="ga-card"><h2>Character stats</h2><div class="ga-field-grid" id="ga-settings-stats"></div></section>
          <section class="ga-card"><h2>Auto Combat</h2><div class="ga-field-grid" id="ga-settings-automation"><label class="ga-field"><span>Pre-action delay minimum (ms)</span><input data-auto-setting="preActionDelayMinMs" type="number" min="0" max="60000" step="1"></label><label class="ga-field"><span>Pre-action delay maximum (ms)</span><input data-auto-setting="preActionDelayMaxMs" type="number" min="0" max="60000" step="1"></label><label class="ga-field"><span>Minimum HP threshold (%)</span><input data-auto-setting="minimumHpThresholdPercent" type="number" min="0" max="100" step="1"></label><label class="ga-field"><span>Minimum opponent win rate (%)</span><input data-auto-setting="minimumOpponentWinRatePercent" type="number" min="0" max="100" step="1"></label><label class="ga-field"><span>Healing inventory</span><select data-auto-setting="healingBagNumber"></select></label><label class="ga-field"><span>Post-battle loot search</span><select data-auto-setting="postBattleLootAction"><option value="thorough">Thorough Search</option><option value="quick">Quick Search</option><option value="return">Return to Safety</option></select></label><label class="ga-field"><span>Dungeon consecutive losses before reset</span><input data-auto-setting="dungeonConsecutiveLossesBeforeReset" type="number" min="1" max="10" step="1"></label><label class="ga-field"><span>Healing behavior</span><span style="display:flex;align-items:center;gap:7px"><input data-auto-setting="avoidHealingOverheal" type="checkbox"><span>Avoid overheal</span></span></label></div><div class="ga-muted" style="margin-top:5px">A fresh random integer delay is applied immediately before every automated Arena, Circus Provinciarum or Expedition click. When the optional post-battle loot screen appears after an Expedition or Dungeon battle, Auto Combat performs the selected action. When it does not appear, automation continues normally. When HP falls below the single configured threshold, Auto Combat pauses and automatically heals the main character from the selected in-game inventory page. When Avoid overheal is enabled, only healing combinations at or below the missing HP are allowed; if no zero-overheal combination exists, Auto Combat stops instead of wasting HP. When Minimum opponent win rate is above 0%, Auto Arena and Auto Circus request a fresh opponent set instead of fighting when every currently unattempted opponent is below that threshold. A value of 0 disables this safeguard. Dungeon only resets its current run after the configured number of consecutive losses against the same opponent; a win clears the loss streak and a loss against a different opponent starts a new streak. Healing uses the selected in-game inventory page; the internal bag number is handled automatically.</div></section>
          <section class="ga-settings-save"><span class="ga-settings-status" id="ga-settings-status"></span><button class="ga-primary" id="ga-save-settings" type="button">Save settings</button></section>
        </section>
      </div>
      <footer class="ga-footer"><span>v${VERSION}</span><button id="ga-refresh-saved" type="button">Refresh saved scan</button></footer>`;
    shadow.appendChild(panel);
    body = panel.querySelector(".ga-body");
    statusEl = panel.querySelector(".ga-status");

    shadow.querySelectorAll(".ga-tab").forEach(btn => btn.addEventListener("click", () => switchTab(btn.dataset.tab)));
    shadow.querySelector("#ga-minimize").addEventListener("click", () => setMinimized(!overlayState.minimized));
    shadow.querySelector("#ga-close").addEventListener("click", () => setVisible(false));
    shadow.querySelector("#ga-scan-equipment").addEventListener("click", startCharacterProfileCapture);
    shadow.querySelector("#ga-clear-equipment").addEventListener("click", clearEquipment);
    shadow.querySelector("#ga-scan-auction").addEventListener("click", () => scanAuction({ fromWorkflow: false }));
    shadow.querySelector("#ga-select-scan-auction").addEventListener("click", () => {
      auctionScanMenuOpen = !auctionScanMenuOpen;
      shadow.querySelector("#ga-select-scan-auction").setAttribute("aria-expanded", String(auctionScanMenuOpen));
      renderAuctionScanMenu();
    });
    shadow.querySelector("#ga-stop-auction").addEventListener("click", stopAuctionWorkflow);
    shadow.querySelector("#ga-clear-auction").addEventListener("click", clearAuction);
    shadow.querySelector("#ga-auction-select-all").addEventListener("click", () => { shadow.querySelectorAll('#ga-auction-scan-menu input[data-auction-category]').forEach(x => { x.checked = true; }); });
    shadow.querySelector("#ga-auction-select-none").addEventListener("click", () => { shadow.querySelectorAll('#ga-auction-scan-menu input[data-auction-category]').forEach(x => { x.checked = false; }); });
    shadow.querySelector("#ga-auction-start-selected").addEventListener("click", startSelectedAuctionScan);
    shadow.querySelector("#ga-auction-results-filter").addEventListener("change", (event) => { auctionResultFilter = String(event.target.value || "all"); void saveAuctionResultViewState(); renderAuctionList(); });
    shadow.querySelector("#ga-auction-results-sort").addEventListener("change", (event) => { auctionResultSort = String(event.target.value || "scan"); void saveAuctionResultViewState(); renderAuctionList(); });
    shadow.querySelector("#ga-auction-min-improvement").addEventListener("change", (event) => { auctionResultMinImprovement = Math.max(0, Number(event.target.value) || 0); void saveAuctionResultViewState(); renderAuctionList(); });
    shadow.querySelector("#ga-auction-max-price").addEventListener("change", (event) => { auctionResultMaxPrice = normalizeAuctionMaxPrice(event.target.value); void saveAuctionResultViewState(); renderAuctionList(); });
    shadow.querySelector("#ga-auction-combine-affixes").addEventListener("change", (event) => { auctionResultCombineAffixes = !!event.target.checked; void saveAuctionResultViewState(); renderAuctionList(); });
    shadow.addEventListener("click", (event) => {
      const affixToggle = event.target.closest?.("[data-auction-affix-toggle]");
      if (affixToggle) { toggleAuctionAffixMenu(String(affixToggle.dataset.auctionAffixToggle || "")); return; }
      const affixClear = event.target.closest?.("[data-auction-affix-clear]");
      if (affixClear) {
        const kind = String(affixClear.dataset.auctionAffixClear || "");
        if (kind === "prefix") auctionResultPrefixes = [];
        if (kind === "suffix") auctionResultSuffixes = [];
        void saveAuctionResultViewState();
        renderAuctionAffixOptions(kind);
        renderAuctionList();
        return;
      }
      const affixDone = event.target.closest?.("[data-auction-affix-done]");
      if (affixDone) { closeAuctionAffixMenu(); return; }
      if (auctionAffixMenuOpen) {
        const menu = shadow.querySelector(`[data-auction-affix-menu="${auctionAffixMenuOpen}"]`);
        const toggle = shadow.querySelector(`[data-auction-affix-toggle="${auctionAffixMenuOpen}"]`);
        if (menu && toggle && !event.composedPath().includes(menu) && !event.composedPath().includes(toggle)) closeAuctionAffixMenu();
      }
      if (auctionScanMenuOpen && !event.composedPath().includes(shadow.querySelector("#ga-auction-scan-menu")) && !event.composedPath().includes(shadow.querySelector("#ga-select-scan-auction"))) { auctionScanMenuOpen = false; void renderAuctionScanMenu(); }
    });
    shadow.addEventListener("input", (event) => {
      const search = event.target.closest?.("[data-auction-affix-search]");
      if (!search) return;
      const kind = String(search.dataset.auctionAffixSearch || "");
      if (!(kind in auctionAffixSearch)) return;
      auctionAffixSearch[kind] = String(search.value || "");
      renderAuctionAffixOptions(kind);
    });
    shadow.addEventListener("change", (event) => {
      const input = event.target.closest?.("input[data-auction-affix-input]");
      if (!input) return;
      const kind = String(input.dataset.auctionAffixInput || "");
      if (kind !== "prefix" && kind !== "suffix") return;
      const state = kind === "prefix" ? auctionResultPrefixes : auctionResultSuffixes;
      const value = String(input.value || "");
      const next = new Set(state);
      if (input.checked) {
        if (value === AUCTION_AFFIX_NONE_TOKEN) {
          next.clear();
          next.add(AUCTION_AFFIX_NONE_TOKEN);
        } else {
          next.delete(AUCTION_AFFIX_NONE_TOKEN);
          next.add(value);
        }
      } else next.delete(value);
      if (kind === "prefix") auctionResultPrefixes = [...next]; else auctionResultSuffixes = [...next];
      void saveAuctionResultViewState();
      updateAuctionAffixButtons();
      renderAuctionList();
    });
    shadow.querySelectorAll("[data-character-cycle]").forEach(btn => btn.addEventListener("click", () => void selectCharacterByOffset(Number(btn.dataset.characterCycle || 0))));
    shadow.querySelector("#ga-refresh-stats").addEventListener("click", refreshStats);
    shadow.querySelector("#ga-refresh-master-diagnostics").addEventListener("click", () => void refreshMasterDiagnostics());
    shadow.querySelector("#ga-copy-master-diagnostics").addEventListener("click", (event) => void copyMasterDiagnostics(event));
    shadow.querySelector("#ga-clear-master-diagnostics").addEventListener("click", () => void clearMasterDiagnostics());
    shadow.querySelector("#ga-toggle-diagnostic-capture").addEventListener("click", () => void toggleDiagnosticCapture());
    shadow.querySelector("#ga-save-settings").addEventListener("click", saveSettingsFromUi);
    shadow.querySelector('[data-comparison-setting="opponentMode"]')?.addEventListener("change", event => {
      const enemyInput = shadow.querySelector('[data-comparison-setting="expeditionEnemyKey"]');
      if (enemyInput) enemyInput.disabled = String(event.target?.value || "player-clone") !== "expedition-enemy";
    });
    shadow.querySelector('[data-auto-setting="avoidHealingOverheal"]').addEventListener("change", () => void saveAvoidOverhealSettingFromUi());
    shadow.querySelector("#ga-refresh-saved").addEventListener("click", loadSavedEquipment);

    makeDraggable();
    applyPosition();
    document.documentElement.appendChild(host);
    ensureNativeOpponentWinRateStyles();
    initializeNativeOpponentWinRateDisplay();
    initializeNativeAuctionComparisonDisplay();
    initializeNativeEquipmentComparisonDisplay();
    switchTab(activeTab);
    applyMinimized();
    applySize();
    applyVisibility();
    watchResize();

    await loadSettings();
    await loadAutoCombatDiagnostics();
    await loadCharacterProfileStore();
    await loadCharacterSelection();
    await loadCurrentStatsSnapshot();
    renderSettings(); renderCharacterSelectors(); renderStats(); renderDiagnosticCaptureControls();
    await loadSavedEquipment();
    await loadSavedAuction();
    latestAuctionDiagnostic = currentAuctionScan?.diagnostics || latestAuctionDiagnostic || null;
    await loadAuctionSelection();
    await loadCombatCaptureStore();
    await loadArenaCombatStore();
    await loadArenaOpponentAnalysisStore();
    await loadCircusCombatStore();
    await loadDungeonCombatStore();
    await loadCircusProvinciarumAnalysisStore();
    renderNativeOpponentWinRateBadges();
    nativeOpponentWinRateAutoAnalysisReady = true;
    scheduleNativeOpponentWinRateAutoAnalysis({ force: true });
    await loadSimulatorState();
    await loadStatPriorityDiagnostics();
    await loadStatPriorityState();
    await loadAuctionComparisonResults();
    initializeNativeEquipmentComparisonDisplay();
    scheduleNativeEquipmentComparisonScan(40);
    renderAuctionList();
    await loadAutoExpeditionState();
    await loadArenaAutomationState();
    await loadCircusProvinciarumAutomationState();
    await loadAutoDungeonState();
    await loadAutoHealingState();
    logAutoCombatDiagnostic("content-script-ready", { version: VERSION });
    renderCombatCaptureStatus();
    renderCombatTab();
    renderStatPriorityTab();
    renderDiagnosticCaptureControls();
    if (activeTab === "diagnostics") renderDiagnosticCaptureControls();
    const characterCaptureWasActive = await resumeCharacterProfileCapture();
    if (!characterCaptureWasActive) await refreshStats();
    startPassiveCharacterStatsRefresh();
    await resumeAuctionWorkflow();
    initializePassiveCombatCapture();
    scheduleAutoCombatResume(250);
  }

  function handleMessage(message) {
    if (!message) return undefined;
    if (message.type === "SHOW_OVERLAY") { setVisible(true); return { ok: true, visible: true }; }
    if (message.type === "HIDE_OVERLAY") { setVisible(false); return { ok: true, visible: false }; }
    if (message.type === "TOGGLE_OVERLAY") { setVisible(!overlayState.visible); return { ok: true, visible: overlayState.visible }; }
    if (message.type === "REFRESH_OVERLAY") { loadSavedEquipment(); refreshStats(); return { ok: true }; }
    return undefined;
  }

  api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!["SHOW_OVERLAY", "HIDE_OVERLAY", "TOGGLE_OVERLAY", "REFRESH_OVERLAY"].includes(message?.type)) return false;
    try {
      const result = handleMessage(message);
      sendResponse(result || { ok: false });
    } catch (error) {
      sendResponse({ ok: false, error: error?.message || String(error) });
    }
    return true;
  });

  api.storage.onChanged?.addListener((changes, area) => {
    if (area !== "local") return;
    const eqKey = equipmentKey();
    if (changes[eqKey]) {
      loadSavedEquipment();
      scheduleNativeEquipmentComparisonScan(120);
    }
    if (changes[auctionKey()]) void loadSavedAuction({ invalidate: false, invalidationReason: "auction-store-storage-change" });
    if (changes[auctionDiagnosticKey()]) { latestAuctionDiagnostic = changes[auctionDiagnosticKey()].newValue || null; }
    if (changes[diagnosticKey()]) { latestEquipmentDiagnostic = changes[diagnosticKey()].newValue || null; }
    if (changes[statPriorityDiagnosticKey()]) { statPriorityDiagnostics = changes[statPriorityDiagnosticKey()].newValue || { schemaVersion: 1, updatedAt: null, events: [] }; renderStatPriorityDiagnostics(); }
    if (changes[auctionComparisonDiagnosticKey()]) { auctionComparisonDiagnostics = changes[auctionComparisonDiagnosticKey()].newValue || { schemaVersion: 1, updatedAt: null, active: null, lastCompleted: null, events: [] }; renderAuctionComparisonDiagnostics(); }
    if (changes[auctionGoldIconKey()]) void loadSavedAuction({ invalidate: false, invalidationReason: "auction-gold-icon-storage-change" });
    if (changes[auctionResultViewStateKey()]) {
      const next = changes[auctionResultViewStateKey()].newValue;
      if (next && typeof next === "object" && auctionResultViewStateLoaded) {
        const filterValues = new Set(AUCTION_RESULTS_FILTERS.map(x => String(x.value)));
        const sortValues = new Set(AUCTION_RESULTS_SORTS.map(x => String(x.value)));
        if (filterValues.has(String(next.filter))) auctionResultFilter = String(next.filter);
        if (sortValues.has(String(next.sort))) auctionResultSort = String(next.sort);
        const nextMinImprovement = Number(next.minImprovement);
        const nextMaxPrice = normalizeAuctionMaxPrice(next.maxPrice);
        if (Number.isFinite(nextMinImprovement)) auctionResultMinImprovement = Math.max(0, nextMinImprovement);
        auctionResultMaxPrice = nextMaxPrice;
        if (Array.isArray(next.prefixes)) auctionResultPrefixes = [...new Set(next.prefixes.map(String).filter(Boolean))];
        if (Array.isArray(next.suffixes)) auctionResultSuffixes = [...new Set(next.suffixes.map(String).filter(Boolean))];
        if (typeof next.combineAffixes === "boolean") auctionResultCombineAffixes = next.combineAffixes;
        updateAuctionAffixButtons();
        const combineInput = shadow?.querySelector("#ga-auction-combine-affixes");
        if (combineInput) combineInput.checked = auctionResultCombineAffixes;
        if (host) renderAuctionList();
      }
    }
    if (changes[combatKey()]) {
      combatCaptureStore = changes[combatKey()].newValue || { schemaVersion: 3, reports: [], updatedAt: null };
      renderCombatCaptureStatus();
    }
    if (changes[arenaCombatKey()]) {
      arenaCombatStore = changes[arenaCombatKey()].newValue || { schemaVersion: 1, reports: [], updatedAt: null };
      if (host) { renderAutoCombatUI(); renderCombatTab(); }
    }
    if (changes[arenaOpponentAnalysisKey()]) {
      arenaOpponentAnalysisStore = changes[arenaOpponentAnalysisKey()].newValue || { schemaVersion: 2, updatedAt: null, setSignature: null, playerProfile: null, opponents: {} };
      renderNativeOpponentWinRateBadges();
      if (host) renderAutoCombatUI();
    }
    if (changes[circusCombatKey()]) {
      circusCombatStore = changes[circusCombatKey()].newValue || { schemaVersion: 1, reports: [], updatedAt: null };
      if (host) { renderCombatCaptureStatus(); renderCombatTab(); }
    }
    if (changes[circusProvinciarumAnalysisKey()]) {
      circusProvinciarumAnalysisStore = changes[circusProvinciarumAnalysisKey()].newValue || { schemaVersion: 1, updatedAt: null, setSignature: null, playerProfile: null, opponents: {} };
      renderNativeOpponentWinRateBadges();
      if (host) renderAutoCombatUI();
    }
    if (changes[statPriorityStateKey()]) {
      const next = changes[statPriorityStateKey()].newValue;
      if (next && typeof next === "object") {
        const existingResult = statPriorityState.result;
        const existingManualResult = statPriorityState.manualResult;
        statPriorityState = { ...statPriorityState, ...next, simulations: globalSimulationCount(), busy: false };
        // saveStatPriorityState intentionally omits in-memory analysis results. Preserve
        // freshly computed results when the resulting storage change echoes back.
        if (existingResult && !statPriorityState.result) statPriorityState.result = existingResult;
        if (existingManualResult && !statPriorityState.manualResult) statPriorityState.manualResult = existingManualResult;
        if (host) renderStatPriorityTab();
      }
    }
    if (changes[autoExpeditionKey()]) {
      autoExpeditionState = changes[autoExpeditionKey()].newValue || null;
      if (host) renderAutoCombatUI();
    }
    if (changes[arenaAutomationKey()]) {
      arenaAutomationState = changes[arenaAutomationKey()].newValue || null;
      if (host) renderAutoCombatUI();
    }
    if (changes[circusProvinciarumAutomationKey()]) {
      circusProvinciarumAutomationState = changes[circusProvinciarumAutomationKey()].newValue || null;
      if (host) renderAutoCombatUI();
    }
    if (changes[autoCombatDiagnosticKey()]) {
      autoCombatDiagnostics = changes[autoCombatDiagnosticKey()].newValue || { schemaVersion: 1, updatedAt: null, events: [] };
      renderAutoCombatDiagnostics();
    }
    if (changes[characterProfileKey()]) {
      const next = changes[characterProfileKey()].newValue;
      if (next?.characters && typeof next.characters === "object") {
        characterProfileStore = { schemaVersion: 1, updatedAt: next.updatedAt || null, characters: { ...next.characters } };
        renderSelectedCharacterProfile();
      }
    }
    if (changes[characterSelectionKey()]) {
      const nextId = String(changes[characterSelectionKey()].newValue || "");
      if (nextId && characterProfileStore.characters?.[nextId]) {
        selectedCharacterDollId = nextId;
        renderSelectedCharacterProfile();
      }
    }
    if (changes.settings) {
      settings = normalizeSettings(changes.settings.newValue || defaultSettings());
      renderSettings(); renderStats(); renderDiagnosticCaptureControls();
      renderNativeOpponentWinRateBadges();
    }
    if (changes[overlayStateKey()]) {
      overlayState = { ...overlayState, ...(changes[overlayStateKey()].newValue || {}) };
      if (host) { applyVisibility(); applyMinimized(); applyPosition(); }
    }
  });

  window.addEventListener("resize", () => {
    if (!host) return;
    if (overlayState.left != null && overlayState.top != null) {
      const p = clampPosition(overlayState.left, overlayState.top);
      host.style.left = `${p.left}px`; host.style.top = `${p.top}px`;
    }
    if (!overlayState.minimized && panel) {
      const size = clampSize(panel.getBoundingClientRect().width, panel.getBoundingClientRect().height);
      panel.style.width = `${Math.round(size.width)}px`;
      panel.style.height = `${Math.round(size.height)}px`;
      overlayState.width = Math.round(size.width);
      overlayState.height = Math.round(size.height);
      scheduleSaveResize();
    }
  });

  (async () => {
    await loadOverlayState();
    await createOverlay();
  })();
})();
