(() => {
  "use strict";

  const api = globalThis.browser || globalThis.chrome;

  const AFFIX_CATALOG_DEFAULT_URLS = {
    prefixes: "https://raw.githubusercontent.com/Djongov/gladiatus-fansite/main/static/data/items/prefixes.json",
    suffixes: "https://raw.githubusercontent.com/Djongov/gladiatus-fansite/main/static/data/items/suffixes.json"
  };

  const DEFAULT_SETTINGS = {
    stats: {
      level: 33,
      strength: 89,
      dexterity: 114,
      agility: 136,
      constitution: 66,
      charisma: 61,
      intelligence: 50,
      armour: 1763,
      damage: 122
    },
    automation: {
      preActionDelayMinMs: 342,
      preActionDelayMaxMs: 1967,
      dungeonConsecutiveLossesBeforeReset: 2
    },
    economy: {
      foodCost: 245,
      foodHeal: 454,
      itemDropChance: 0.50,
      itemValueByTarget: {
        "Tax Collector": 240,
        "Blood Wolf": 390
      }
    },
    routine: ["expedition", "dungeon", "circus"],
    targets: [
      {
        name: "Tax Collector",
        activity: "expedition",
        enemy: { level: 35, agility: 99, dexterity: 71, intelligence: 50, armour: 1344, damageMin: 37, damageMax: 46 },
        goldMin: 1049,
        goldMax: 1728,
        expectedHpLoss: 120,
        itemLevelMin: 28,
        itemLevelMax: 43,
        notes: "Safe current farm baseline."
      },
      {
        name: "Blood Wolf",
        activity: "expedition",
        enemy: { level: 40, agility: 128, dexterity: 111, intelligence: 50, armour: 1527, damageMin: 67, damageMax: 83 },
        goldMin: 1237,
        goldMax: 2012,
        expectedHpLoss: 620,
        itemLevelMin: 38,
        itemLevelMax: 48,
        notes: "Higher gold/item level; test at level 35+."
      }
    ]
  };

  function getStorage(key) {
    const r = api.storage.local.get(key);
    return r?.then ? r : new Promise(resolve => api.storage.local.get(key, resolve));
  }

  function setStorage(value) {
    const r = api.storage.local.set(value);
    return r?.then ? r : Promise.resolve();
  }

  async function ensureDefaults() {
    const current = await getStorage("settings");
    if (!current.settings) await setStorage({ settings: DEFAULT_SETTINGS });
  }

  ensureDefaults().catch(() => {});

  api.browserAction?.onClicked?.addListener(async (tab) => {
    if (!tab?.id) return;
    try {
      await api.tabs.sendMessage(tab.id, { type: "SHOW_OVERLAY" });
    } catch (_) {
      // The content script may not be loaded on this tab. Nothing to do here.
    }
  });

  api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "GET_DEFAULTS") {
      sendResponse(DEFAULT_SETTINGS);
      return false;
    }

    if (message?.type === "FETCH_GLADIATUS_PROFILE") {
      const requested = String(message?.url || "");
      let url;
      try { url = new URL(requested); } catch (_) {
        sendResponse({ ok: false, error: "Invalid Gladiatus profile URL." });
        return false;
      }
      if (!/\.gladiatus\.gameforge\.com$/i.test(url.hostname)) {
        sendResponse({ ok: false, error: "Profile URL is not a Gladiatus Gameforge host." });
        return false;
      }
      fetch(url.href, { credentials: "include", redirect: "follow", headers: { Accept: "text/html,application/xhtml+xml" } })
        .then(async response => {
          if (!response.ok) return { ok: false, status: response.status, statusText: response.statusText || "", error: `Opponent profile returned HTTP ${response.status}.` };
          const html = await response.text();
          return { ok: true, html, finalUrl: response.url || url.href, status: response.status };
        })
        .then(sendResponse)
        .catch(error => sendResponse({ ok: false, error: error?.message || String(error) }));
      return true;
    }

    if (message?.type === "FETCH_AFFIX_CATALOG") {
      const requested = message?.urls && typeof message.urls === "object" ? message.urls : AFFIX_CATALOG_DEFAULT_URLS;
      const urls = { prefixes: AFFIX_CATALOG_DEFAULT_URLS.prefixes, suffixes: AFFIX_CATALOG_DEFAULT_URLS.suffixes };
      for (const kind of ["prefixes", "suffixes"]) {
        try {
          const candidate = new URL(String(requested[kind] || urls[kind]));
          const allowed = candidate.origin === "https://raw.githubusercontent.com" && candidate.pathname.startsWith("/Djongov/gladiatus-fansite/");
          if (allowed) urls[kind] = candidate.href;
        } catch (_) {}
      }
      Promise.all(["prefixes", "suffixes"].map(async kind => {
        const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), 10000) : null;
        try {
          const response = await fetch(urls[kind], { redirect: "follow", cache: "no-store", headers: { Accept: "application/json" }, signal: controller?.signal });
          if (!response.ok) throw new Error(`${kind} catalog returned HTTP ${response.status}.`);
          const data = await response.json();
          return { kind, data };
        } finally {
          if (timer) clearTimeout(timer);
        }
      })).then(results => {
        const prefixes = results.find(x => x.kind === "prefixes")?.data;
        const suffixes = results.find(x => x.kind === "suffixes")?.data;
        const prefixNames = Array.isArray(prefixes) ? prefixes.map(x => typeof x === "string" ? x : x?.name).filter(Boolean) : [];
        const suffixNames = Array.isArray(suffixes) ? suffixes.map(x => typeof x === "string" ? x : x?.name).filter(Boolean) : [];
        if (!prefixNames.length || !suffixNames.length) throw new Error("Fansite affix catalog returned an empty prefix or suffix list.");
        sendResponse({ ok: true, prefixes: prefixNames, suffixes: suffixNames, fetchedAt: new Date().toISOString() });
      }).catch(error => sendResponse({ ok: false, error: error?.message || String(error) }));
      return true;
    }

    if (message?.type === "CAPTURE_VISIBLE_TAB") {
      const windowId = sender?.tab?.windowId;
      if (windowId == null) {
        sendResponse({ ok: false, error: "No Gladiatus tab was supplied for screenshot capture." });
        return false;
      }
      Promise.resolve()
        .then(() => api.tabs.captureVisibleTab(windowId, { format: "png" }))
        .then(dataUrl => sendResponse({ ok: true, dataUrl }))
        .catch(error => sendResponse({ ok: false, error: error?.message || String(error) }));
      return true;
    }

    // The persistent on-page Assistant is a content script, so runtime.sendMessage
    // reaches this background context but not the parser content script. Route
    // parser commands back to the sender's Gladiatus tab explicitly.
    if (["PING", "DISCOVER_CHARACTER_DOLLS", "CAPTURE_CHARACTER_PROFILE", "SCAN_EQUIPMENT", "SCAN_AUCTION", "SCAN_VISIBLE_EQUIPMENT_COMPARISON", "QUICK_EQUIPMENT"].includes(message?.type)) {
      const tabId = sender?.tab?.id;
      if (tabId == null) {
        sendResponse({ ok: false, error: "No Gladiatus tab was supplied for parser routing." });
        return false;
      }
      Promise.resolve()
        .then(() => api.tabs.sendMessage(tabId, message))
        .then(response => sendResponse(response))
        .catch(error => sendResponse({ ok: false, error: error?.message || String(error) }));
      return true;
    }

    return false;
  });
})();
