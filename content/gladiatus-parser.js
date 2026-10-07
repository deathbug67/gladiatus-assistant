(() => {
  "use strict";

  const api = globalThis.browser || globalThis.chrome;

  const STAT_KEYS = [
    "strength", "dexterity", "agility", "constitution", "charisma", "intelligence",
    "armour", "health", "damage", "criticalAttack", "blockValue", "hardening", "healing", "threat", "criticalHealing"
  ];

  const STAT_LABELS = {
    strength: [/^strength\b/i],
    dexterity: [/^dexterity\b/i],
    agility: [/^agility\b/i],
    constitution: [/^constitution\b/i],
    charisma: [/^charisma\b/i],
    intelligence: [/^intelligence\b/i],
    armour: [/^armour\b/i, /^armor\b/i],
    health: [/^health\b/i, /^life points\b/i, /^hp\b/i],
    damage: [/^damage\b/i, /^dmg\b/i],
    criticalAttack: [/^critical attack(?: value)?\b/i, /^crit(?:ical)?\b/i],
    blockValue: [/^block(?: value)?\b/i],
    hardening: [/^hardening\b/i, /^resilience\b/i],
    healing: [/^healing\b/i],
    threat: [/^threat\b/i],
    criticalHealing: [/^critical healing(?: chance)?\b/i, /^critical-healing\b/i]
  };

  const TRAINABLE_STAT_KEYS = ["strength", "dexterity", "agility", "constitution", "charisma", "intelligence"];
  const TRAINABLE_STAT_IDS = Object.freeze({
    strength: "char_f0",
    dexterity: "char_f1",
    agility: "char_f2",
    constitution: "char_f3",
    charisma: "char_f4",
    intelligence: "char_f5"
  });
  const SLOT_NAMES = ["helmet", "amulet", "chest", "gloves", "weapon", "shield", "boots", "ring1", "ring2"];
  const SLOT_LABELS = {
    helmet: "Helmet", amulet: "Amulet", chest: "Chest", gloves: "Gloves", weapon: "Weapon",
    shield: "Shield", boots: "Boots", ring1: "Ring 1", ring2: "Ring 2"
  };

  // Gladiatus equipment container numbers are the authoritative slot mapping
  // for the character equipment paper-doll. These values come from the live
  // DOM structure supplied by the user's server. Do not infer slots from scan
  // order or screen position.
  const CONTAINER_TO_SLOT = Object.freeze({
    "2": "helmet",
    "3": "weapon",
    "4": "shield",
    "5": "chest",
    "6": "ring1",
    "7": "ring2",
    "9": "gloves",
    "10": "boots",
    "11": "amulet"
  });

  function normalize(value) {
    return String(value ?? "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function stripTags(value) {
    return normalize(String(value ?? "").replace(/<[^>]*>/g, " "));
  }

  function unique(arr) { return [...new Set(arr.filter(Boolean))]; }

  function parseInteger(value) {
    if (value == null) return null;
    const s = normalize(value).replace(/[^\d.,-]/g, "");
    if (!s) return null;
    if (/^-?\d{1,3}(?:\.\d{3})+$/.test(s)) return Number(s.replace(/\./g, ""));
    if (/^-?\d{1,3}(?:,\d{3})+$/.test(s)) return Number(s.replace(/,/g, ""));
    return Number(s.replace(/,/g, "."));
  }

  function parseTooltipJson(raw) {
    if (!raw) return null;
    try { return typeof raw === "string" ? JSON.parse(raw) : raw; } catch { return null; }
  }

  function looksLikeCssStyle(value) {
    const s = String(value || "");
    return /(?:^|[;\s])(?:color|font-|text-shadow|background|style)\s*:/i.test(s);
  }

  function collectTextLeaves(value, out = []) {
    if (typeof value === "string" || typeof value === "number") {
      const s = stripTags(value);
      if (s && !looksLikeCssStyle(s)) out.push(s);
      return out;
    }
    if (Array.isArray(value)) {
      for (const x of value) collectTextLeaves(x, out);
    } else if (value && typeof value === "object") {
      for (const x of Object.values(value)) collectTextLeaves(x, out);
    }
    return out;
  }

  function extractStyleHints(value, out = []) {
    if (typeof value === "string") {
      if (looksLikeCssStyle(value)) out.push(value);
      return out;
    }
    if (Array.isArray(value)) {
      for (const x of value) extractStyleHints(x, out);
    } else if (value && typeof value === "object") {
      for (const x of Object.values(value)) extractStyleHints(x, out);
    }
    return out;
  }

  function tooltipRows(raw) {
    const data = parseTooltipJson(raw);
    if (!data) return [];
    const root = Array.isArray(data?.[0]) ? data[0] : data;
    if (!Array.isArray(root)) return [];
    return root.map(entry => {
      const cells = unique(collectTextLeaves(entry?.[0] ?? entry));
      const styles = unique(extractStyleHints(entry));
      return { cells, style: styles[0] || "" };
    }).filter(row => row.cells.length);
  }

  function getTooltipAttr(el) { return el?.getAttribute?.("data-tooltip") || null; }

  function findItemName(rows) {
    const blockers = /^(?:soul bound to|soulbound|level\b|value\b|durability\b|conditioning\b|through durability\b|slot[- ]char\b)/i;
    for (const row of rows) {
      for (const cell of row.cells) {
        const s = stripTags(cell);
        if (!s || blockers.test(s)) continue;
        if (/^(?:damage|armour|armor|health|strength|dexterity|agility|constitution|charisma|intelligence|critical|block|hardening|resilience|healing|threat)\b/i.test(s)) continue;
        if (/^[-+]?\d+(?:[.,]\d+)?$/.test(s)) continue;
        if (s.length > 1 && s.length < 100) return s;
      }
    }
    return "Unknown item";
  }

  const CSS_NAMED_COLORS = {
    black:[0,0,0], white:[255,255,255], red:[255,0,0], green:[0,128,0], lime:[0,255,0],
    blue:[0,0,255], navy:[0,0,128], purple:[128,0,128], violet:[238,130,238], magenta:[255,0,255],
    orange:[255,165,0], yellow:[255,255,0], gray:[128,128,128], grey:[128,128,128], silver:[192,192,192]
  };

  function parseCssColor(value) {
    if (!value) return null;
    const s=String(value).trim().toLowerCase();
    const keyword=s.split(/[;\s]/)[0];
    if (CSS_NAMED_COLORS[keyword]) { const [r,g,b]=CSS_NAMED_COLORS[keyword]; return {r,g,b}; }
    let m=s.match(/^#([0-9a-f]{3})$/i);
    if(m) return {r:parseInt(m[1][0]+m[1][0],16),g:parseInt(m[1][1]+m[1][1],16),b:parseInt(m[1][2]+m[1][2],16)};
    m=s.match(/^#([0-9a-f]{6})$/i);
    if(m) return {r:parseInt(m[1].slice(0,2),16),g:parseInt(m[1].slice(2,4),16),b:parseInt(m[1].slice(4,6),16)};
    m=s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if(m) return {r:Number(m[1]),g:Number(m[2]),b:Number(m[3])};
    return null;
  }

  function extractColorValue(value) {
    if (!value) return null;
    const s = String(value).trim();
    const first = s.split(';')[0].trim();
    if (/^#[0-9a-f]{3,8}$/i.test(first)) return first;
    if (/^rgba?\(/i.test(first)) {
      const rgb = first.match(/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[^)]+)?\)/i);
      if (rgb) return rgb[0];
    }
    const firstToken = first.split(/\s+/)[0];
    if (CSS_NAMED_COLORS[firstToken.toLowerCase()]) return firstToken;
    // Fallback for strings that contain a bare color later in the value.
    const rgb = s.match(/rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(?:\s*,\s*[^)]+)?\)/i);
    if (rgb) return rgb[0];
    const hex = s.match(/#[0-9a-f]{3,8}\b/i);
    return hex ? hex[0] : null;
  }

  function qualityFromColor(color) {
    const raw=String(color||'').trim().toLowerCase();
    const first=raw.split(/[;\s]/)[0];
    const named={lime:'green',green:'green',white:'white',whitesmoke:'white',blue:'blue',navy:'blue',purple:'purple',violet:'purple',magenta:'purple',orange:'orange',red:'red'};
    if(named[first]) return named[first];
    const parsed=parseCssColor(extractColorValue(color));
    if(!parsed) return 'unknown';
    const {r,g,b}=parsed; const max=Math.max(r,g,b), min=Math.min(r,g,b), delta=max-min;
    const value=max/255, sat=max===0?0:delta/max;
    if(sat<0.13 && value>0.80) return 'white';
    if(sat<0.13) return 'unknown';
    let hue=0;
    if(delta){ if(max===r) hue=((g-b)/delta)%6; else if(max===g) hue=(b-r)/delta+2; else hue=(r-g)/delta+4; hue*=60; if(hue<0) hue+=360; }
    if(hue>=75 && hue<170) return 'green';
    if(hue>=170 && hue<255) return 'blue';
    if(hue>=255 && hue<325) return 'purple';
    if(hue>=10 && hue<65) return 'orange';
    if(hue<10 || hue>=325) return 'red';
    return 'unknown';
  }

  function colorsNearName(raw, itemName) {
    const result=[];
    const s=String(raw||'');
    const nameIndex=s.toLowerCase().indexOf(String(itemName||'').toLowerCase());
    if(nameIndex>=0){
      const start=Math.max(0,nameIndex-700), end=Math.min(s.length,nameIndex+String(itemName||'').length+700);
      const near=s.slice(start,end);
      const colorRe=/(?:color\s*[:=]\s*|fontcolor\s*[:=]\s*|color[^#\d]{0,20})(#[0-9a-f]{3,8}\b|rgba?\([^)]*\)|[a-z]+)(?=[;\s])/ig;
      for(const m of near.matchAll(colorRe)) result.push(m[1]);
    }
    return unique(result);
  }

  function extractTooltipTitleColor(raw, itemName) {
    const data = parseTooltipJson(raw);
    if (!data) return null;
    const root = Array.isArray(data?.[0]) ? data[0] : data;
    if (!Array.isArray(root)) return null;
    for (const entry of root) {
      let title = null;
      let color = null;
      if (Array.isArray(entry?.[0])) {
        title = entry[0][0];
        color = entry[0][1];
      } else if (typeof entry?.[0] === "string") {
        title = entry[0];
        color = entry[1];
      }
      if (normalize(title) !== normalize(itemName)) continue;
      return extractColorValue(color) || extractColorValue(String(color || '')) || null;
    }
    return null;
  }

  function extractQuality(candidate,itemName,rows){
    const raw=getTooltipAttr(candidate.node)||candidate.tooltip||'';
    const candidates=[];
    const tooltipTitleColor=extractTooltipTitleColor(raw,itemName);
    // The first tooltip row is Gladiatus' authoritative rendered item-name color.
    // Prefer it over computed extension/DOM colors, which can be black because
    // of inherited button/card styling.
    if(tooltipTitleColor) candidates.push(tooltipTitleColor);
    const titleRow=rows.find(row=>row.cells.some(c=>c===itemName || c.startsWith(itemName)));
    candidates.push(titleRow?.style || '');
    candidates.push(...colorsNearName(raw,itemName));
    const nameNode=findVisibleNameNode(candidate.itemElement || candidate.slotElement || candidate.node,itemName);
    if(nameNode) candidates.push(getComputedStyle(nameNode).color||'');

    let quality='unknown', nameColor=null;
    for(const c of candidates){
      const color=extractColorValue(c);
      const q=qualityFromColor(c);
      if(q!=='unknown'){
        quality=q;
        if(color) nameColor=color;
        break;
      }
      if(color && !nameColor) nameColor=color;
    }

    // If the tooltip itself supplied a title color, keep that exact CSS value
    // even if later fallback candidates were inspected.
    if(tooltipTitleColor) nameColor=tooltipTitleColor;
    return {quality,nameColor};
  }

  function findVisibleNameNode(scope, itemName) {
    if (!scope) return null;
    const nodes = [scope, ...Array.from(scope.querySelectorAll?.("a, span, div, p, strong, b") || [])];
    return nodes.find(node => {
      const t = normalize(node.textContent);
      return t === itemName || (t.length < 100 && t.startsWith(itemName));
    }) || null;
  }

  function itemLikeRows(rows) {
    const all = rows.flatMap(r => r.cells).join(" | ");
    if (/slot[- ]char\b/i.test(all)) return false;
    const hasLevel = /\blevel\s+\d+/i.test(all);
    const hasValue = /\bvalue\s+[\d.,]+/i.test(all);
    const hasCondition = /\b(?:durability|conditioning)\b/i.test(all);
    const hasStats = rows.some(r => r.cells.some(c => /^(?:damage|armour|armor|health|strength|dexterity|agility|constitution|charisma|intelligence|critical|block|hardening|resilience|healing)\b/i.test(c)));
    return hasLevel && (hasValue || hasCondition || hasStats);
  }

  function isItemElement(el) {
    if (!el?.classList) return false;
    return [...el.classList].some(c => /^item-i-\d+-\d+$/i.test(c)) && (!!el.getAttribute?.('data-item-id') || !!el.getAttribute?.('data-hash'));
  }

  function findActualItemElement(node, slotElement) {
    if (isItemElement(node)) return node;

    // Tooltip-bearing wrappers frequently contain the real .item-i-* element
    // as a descendant. The previous implementation only searched upward from
    // the tooltip node (and the optional equipment slot), so inventory/reward
    // wrappers were silently rejected before simulation could be queued.
    const descendant = node?.querySelector?.('[class*="item-i-"][data-item-id], [class*="item-i-"][data-hash]');
    if (isItemElement(descendant)) return descendant;

    let el = node;
    for (let i = 0; el && i < 8; i++, el = el.parentElement) {
      if (isItemElement(el)) return el;
    }

    const slotDescendant = slotElement?.querySelector?.('[class*="item-i-"][data-item-id], [class*="item-i-"][data-hash]');
    return isItemElement(slotDescendant) ? slotDescendant : null;
  }

  function findEquipmentContainer(itemElement, root) {
    // The actual equipped item has the same data-container-number as its
    // surrounding equipment drop target. Walk upward and deliberately skip
    // the item itself because it also carries ui-droppable/data-container-number.
    let el = itemElement?.parentElement || null;
    for (let i = 0; el && i < 8 && el !== root; i++, el = el.parentElement) {
      if (!el.classList?.contains('ui-droppable')) continue;
      if (!el.hasAttribute?.('data-container-number')) continue;
      if (isItemElement(el)) continue;
      const number = String(el.getAttribute('data-container-number') || '').trim();
      if (CONTAINER_TO_SLOT[number]) return el;
    }
    return null;
  }

  function containerNumberFor(itemElement, equipmentContainer, node) {
    for (const el of [equipmentContainer, itemElement, node].filter(Boolean)) {
      const value = el.getAttribute?.('data-container-number');
      if (value != null && String(value).trim() !== '') return String(value).trim();
    }
    return null;
  }

  function slotFromContainerNumber(value) {
    return CONTAINER_TO_SLOT[String(value ?? '').trim()] || null;
  }

  function findSlotElement(node, root) {
    // Legacy compatibility fallback used only where a real equipment container
    // cannot be identified. Slot assignment itself never uses this fallback.
    let el = node;
    for (let i = 0; el && i < 8 && el !== root; i++, el = el.parentElement) {
      if (el.id && /:char$/i.test(el.id)) return el;
    }
    return node;
  }

  function attributeItemHash(slotElement, node, itemElement) {
    for(const n of [itemElement,slotElement,node].filter(Boolean)) {
      const v=n.getAttribute?.('data-hash');
      if(v) return v;
    }
    return null;
  }

  function attributeItemId(slotElement, node) {
    const nodes = [slotElement, node].filter(Boolean);
    const attrs = ["data-item-id", "data-itemid", "data-object-id", "data-instance-id", "data-id"];
    for (const n of nodes) {
      for (const a of attrs) {
        const v = n.getAttribute?.(a);
        if (v) return v;
      }
    }
    return null;
  }

  const GENERIC_ITEM_IDENTITY_ATTRS = Object.freeze([
    "data-content-type", "data-item-type", "data-category", "data-type"
  ]);

  function attributeItemContentType(node, itemElement = null) {
    const nodes = [itemElement, node].filter(Boolean);
    for (const n of nodes) {
      for (const a of GENERIC_ITEM_IDENTITY_ATTRS) {
        const v = n.getAttribute?.(a);
        if (v != null && String(v).trim() !== "") return String(v).trim();
      }
    }
    return null;
  }

  function visibleRect(el) {
    if (!el?.getBoundingClientRect) return null;
    const r = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    if (r.width <= 0 || r.height <= 0 || style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return null;
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }

  function backgroundUrl(el) {
    const bg = getComputedStyle(el).backgroundImage || "";
    const m = bg.match(/url\((?:"|')?(.*?)(?:"|')?\)/i);
    return m?.[1] ? new URL(m[1], location.href).href : null;
  }

  function iconInfoFromSlot(slotElement, candidateNode, itemElement) {
    const visual=itemElement || findActualItemElement(candidateNode,slotElement);
    if(!visual) return {iconUrl:null,iconCapture:null,source:'none'};
    const rect=visibleRect(visual);
    if(!rect) return {iconUrl:null,iconCapture:null,source:'item-element'};
    let iconUrl=null;
    const img=visual.matches?.('img') ? visual : visual.querySelector?.('img');
    if(img){ const url=img.currentSrc || img.getAttribute('src') || img.getAttribute('data-src') || img.getAttribute('data-lazy-src'); if(url){ try{iconUrl=new URL(url,location.href).href;}catch{} } }
    if(!iconUrl){ const bg=getComputedStyle(visual).backgroundImage||''; const m=bg.match(/url\((?:"|')?(.*?)(?:"|')?\)/i); if(m?.[1]){ try{iconUrl=new URL(m[1],location.href).href;}catch{} } }
    return {iconUrl,iconCapture:rect,source:'item-element'};
  }

  function directTooltipCandidates(root) {
    const nodes = Array.from(root.querySelectorAll('[data-tooltip]'));
    const accepted = [], rejectedChar = [];
    const seen = new Set();

    for (const node of nodes) {
      const tooltip = getTooltipAttr(node);
      if (!tooltip) continue;
      const rows = tooltipRows(tooltip);
      if (!rows.length) continue;
      const text = rows.flatMap(r => r.cells).join(' | ');
      if (/slot[- ]char\b/i.test(text)) { rejectedChar.push(node); continue; }
      if (!itemLikeRows(rows)) continue;

      const itemName = findItemName(rows);
      if (!itemName || itemName === 'Unknown item') continue;

      // The tooltip-bearing .item-i-* element is the actual equipped item.
      // Determine its real Gladiatus equipment container before accepting it.
      const itemElement = findActualItemElement(node, null);
      if (!itemElement) continue;
      const equipmentContainer = findEquipmentContainer(itemElement, root);
      const containerNumber = containerNumberFor(itemElement, equipmentContainer, node);
      const canonicalSlot = slotFromContainerNumber(containerNumber);

      // Only accept the nine known equipment containers. This prevents chat,
      // quest abilities, inventory items, and unrelated droppable elements
      // from becoming equipment records.
      if (!canonicalSlot) continue;

      const slotElement = equipmentContainer || findSlotElement(node, root);
      const itemId = attributeItemId(itemElement, node);
      if (!itemId) continue;

      const key = `${canonicalSlot}|${containerNumber}|${itemId}|${itemName}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const iconInfo = iconInfoFromSlot(slotElement, node, itemElement);
      accepted.push({
        node, tooltip, rows, itemName, slotElement, equipmentContainer, itemElement,
        containerNumber, canonicalSlot, slotDomId: slotElement?.id || '', iconInfo
      });
    }
    return { accepted, rejectedChar, examined: nodes.length };
  }

  const explicitSlotFromId = id => {
    const key = String(id || "").split(":")[0].toLowerCase();
    if (SLOT_NAMES.includes(key)) return key;
    return null;
  };

  function assignSlots(candidates, root) {
    const assignments = [];
    const used = new Set();

    // Slot assignment is authoritative and deterministic: the game's equipment
    // container number decides the slot. There is intentionally no positional or
    // scan-order fallback, because those approaches caused rings/weapons/etc. to
    // render in the wrong UI slots.
    for (const candidate of candidates) {
      const slot = candidate.canonicalSlot || slotFromContainerNumber(candidate.containerNumber);
      if (!slot || used.has(slot)) continue;
      assignments.push({ slot, candidate });
      used.add(slot);
    }

    return assignments;
  }

  function emptyModifier() { return { flat: 0, percent: 0 }; }
  function emptyDamageModifier() { return { flat: 0, percent: 0, min: null, max: null }; }
  function createModifierSet() {
    const x = {};
    for (const k of STAT_KEYS) x[k] = k === "damage" ? emptyDamageModifier() : emptyModifier();
    return x;
  }

  function canonicalStat(label) {
    for (const [key, patterns] of Object.entries(STAT_LABELS)) {
      if (patterns.some(p => p.test(label))) return key;
    }
    return null;
  }

  function parseModifierOnly(text) {
    const cleaned = normalize(text).replace(/\(\s*[+-]?\d+(?:[.,]\d+)?\s*\)/g, "").trim();
    const m = cleaned.match(/^([+-]\d+(?:[.,]\d+)?)(%)?$/);
    if (!m) return null;
    const value = Number(m[1].replace(",", "."));
    return m[2] ? { flat: 0, percent: value } : { flat: value, percent: 0 };
  }

  function parseLabeledModifier(text) {
    // Parenthesized (+X) values are character-derived values, not intrinsic item stats.
    const cleaned = normalize(text).replace(/\(\s*[+-]?\d+(?:[.,]\d+)?\s*\)/g, "").trim();
    const match = cleaned.match(/^(.+?)\s+([+-]\d+(?:[.,]\d+)?)(%)/i) || cleaned.match(/^(.+?)\s+([+-]\d+(?:[.,]\d+)?)(?=\s|$)/i);
    if (!match) return null;
    const key = canonicalStat(match[1]);
    if (!key) return null;
    const value = Number(match[2].replace(",", "."));
    return { key, mod: match[3] === "%" ? { flat: 0, percent: value } : { flat: value, percent: 0 } };
  }

  function mergeModifier(target, mod) {
    if (!target || !mod) return;
    if (Number.isFinite(mod.flat)) target.flat += mod.flat;
    if (Number.isFinite(mod.percent)) target.percent += mod.percent;
  }

  function captureRowsIntoItem(item, rows) {
    // Gladiatus presents "Through durability" as a column header, not as a
    // separate block of stat rows. The following rows keep the intrinsic stat
    // in cell 0 and the through-durability modifier in cell 1. Preserve the
    // original row order as a display-only representation so the assistant can
    // mirror the game's tooltip instead of imposing a fixed stat order.
    if (!Array.isArray(item.statDisplayRows)) item.statDisplayRows = [];

    const addDisplayRow = (key, baseText, throughText) => {
      if (!key || !baseText) return;
      if (item.statDisplayRows.some(row => row.key === key)) return;
      item.statDisplayRows.push({
        key,
        baseText: normalize(baseText),
        throughText: throughText == null ? null : normalize(throughText)
      });
    };

    for (const row of rows) {
      const cells = row.cells.map(normalize).filter(Boolean);
      if (!cells.length) continue;
      const joined = cells.join(" ");

      if (/^through durability$/i.test(joined)) continue;
      if (/^(?:level|value|durability|conditioning|soul bound to)\b/i.test(joined)) continue;

      const base = parseLabeledModifier(cells[0]);
      const damageRow = /^damage\b/i.test(cells[0]) ? canonicalStat(cells[0]) : null;
      const key = base?.key || damageRow;
      if (!key) continue;

      if (base) mergeModifier(item.raw[base.key], base.mod);

      // Keep the exact stat text, including character-derived parenthetical
      // values such as "+2% (+1)", for display. The numeric fields used by
      // comparisons remain parsed separately below.
      addDisplayRow(key, cells[0], cells.length > 1 ? cells[1] : null);

      // When a tooltip has a through-durability column, cell 1 is the
      // separate item-derived bonus. Parenthesized character-derived values
      // are removed by parseModifierOnly().
      if (cells.length > 1) {
        const dur = parseModifierOnly(cells[1]);
        if (dur) mergeModifier(item.throughDurability[key], dur);
      }
    }

    // Defensive fallback for tooltip encoders that flatten the two columns
    // into a single text cell, e.g. "Strength +25% (+10) +3% (+1)".
    for (const row of rows) {
      const cells = row.cells.map(normalize).filter(Boolean);
      // Only use this fallback when the tooltip encoder flattened both columns
      // into a single cell. Normal two-cell rows were already handled above.
      if (cells.length !== 1) continue;
      const joined = normalize(cells[0]);
      if (!joined || /^through durability$/i.test(joined)) continue;
      if (/^(?:level|value|durability|conditioning|soul bound to)\b/i.test(joined)) continue;

      const cleaned = joined.replace(/\(\s*[+-]?\d+(?:[.,]\d+)?\s*\)/g, "");
      const m = cleaned.match(/^(Strength|Dexterity|Agility|Constitution|Charisma|Intelligence|Armour|Armor|Health|Damage|Critical Attack(?: Value)?|Block(?: Value)?|Hardening|Resilience|Healing)\s+([+-]\d+(?:[.,]\d+)?)(%)?\s+([+-]\d+(?:[.,]\d+)?)(%)?$/i);
      if (!m) continue;

      const key = canonicalStat(m[1]);
      if (!key) continue;
      const baseValue = Number(m[2].replace(",", "."));
      const throughValue = Number(m[4].replace(",", "."));
      const baseMod = m[3] === "%" ? { flat: 0, percent: baseValue } : { flat: baseValue, percent: 0 };
      const durMod = m[5] === "%" ? { flat: 0, percent: throughValue } : { flat: throughValue, percent: 0 };
      mergeModifier(item.raw[key], baseMod);
      mergeModifier(item.throughDurability[key], durMod);
      const displayRow = item.statDisplayRows.find(row => row.key === key);
      if (displayRow) displayRow.throughText = normalize(`${m[4]}${m[5] || ""}`);
    }
  }

  function parseDamageRanges(item, rows) {
    const texts = rows.flatMap(r => r.cells).map(normalize);
    const mins = [], maxs = [];
    for (const t of texts) {
      let m = t.match(/\bdamage\s*(?:min|minimum)?\s*[+:]?\s*(-?\d+)\s*[-–]\s*(-?\d+)/i);
      if (m) { mins.push(Number(m[1])); maxs.push(Number(m[2])); continue; }
      m = t.match(/\b(?:min|minimum)\s*[+:]?\s*(-?\d+)/i); if (m) mins.push(Number(m[1]));
      m = t.match(/\b(?:max|maximum)\s*[+:]?\s*(-?\d+)/i); if (m) maxs.push(Number(m[1]));
    }
    if (mins.length && maxs.length) {
      item.raw.damage.min = Math.min(...mins); item.raw.damage.max = Math.max(...maxs);
      item.raw.damage.flat = (item.raw.damage.min + item.raw.damage.max) / 2;
    }
  }

  function damageDisplay(damage) {
    if (damage?.min != null && damage?.max != null) return Math.round((damage.min + damage.max) / 2);
    return Math.round(damage?.flat || 0);
  }

  const tierWeights = {
    damage: 4.5, strength: 1.25, dexterity: 3.25, agility: 3.25, constitution: 1.6,
    charisma: 1.7, intelligence: 0.9, armour: 0.10, health: 0.75, criticalAttack: 4.0,
    blockValue: 2.0, hardening: 2.0, healing: 0.6
  };

  const slotWeightMods = {
    weapon: { damage: 1.45, dexterity: 1.1, criticalAttack: 1.1 },
    shield: { armour: 1.25, blockValue: 1.4, strength: 0.9 },
    gloves: { dexterity: 1.15, agility: 1.15, criticalAttack: 1.15 },
    boots: { agility: 1.15, constitution: 1.05, criticalAttack: 1.1 },
    helmet: { health: 1.1, constitution: 1.1 },
    chest: { armour: 1.15, health: 1.1, agility: 1.05 },
    amulet: { damage: 1.15, dexterity: 1.1 },
    ring1: { dexterity: 1.1, agility: 1.1 }, ring2: { dexterity: 1.1, agility: 1.1 }
  };

  function provisionalTier(item) {
    const slotMods = slotWeightMods[item.slot] || {};
    let score = 0;
    for (const key of STAT_KEYS) {
      // Turma-only threat/critical-healing modifiers are captured for combat
      // simulation, but they are not part of the general item-tier weighting.
      if (key === "threat" || key === "criticalHealing") continue;
      const base = item.raw[key], dur = item.throughDurability[key];
      if (!base) continue;
      const w = (tierWeights[key] || 0.5) * (slotMods[key] || 1);
      score += ((base.flat || 0) + (base.percent || 0) * 0.8) * w;
      score += (((dur?.flat || 0) + (dur?.percent || 0) * 0.8) * w * 0.45);
    }
    if (score >= 58) return "SS"; if (score >= 44) return "S"; if (score >= 33) return "A";
    if (score >= 23) return "B"; if (score >= 15) return "C"; if (score >= 8) return "D";
    if (score >= 3) return "E"; return "F";
  }

  function parseTooltipItem(candidate, slot) {
    const rows = candidate.rows;
    const allText = rows.flatMap(r => r.cells).join(" | ");
    const q = extractQuality(candidate, candidate.itemName, rows);
    const item = {
      schemaVersion: 5,
      slot,
      slotLabel: SLOT_LABELS[slot],
      slotDomId: candidate.slotDomId || null,
      slotContainerNumber: candidate.containerNumber || null,
      itemDomClass: candidate.itemElement?.className || null,
      itemId: attributeItemId(candidate.itemElement, candidate.node),
      itemHash: attributeItemHash(candidate.slotElement, candidate.node, candidate.itemElement),
      contentType: attributeItemContentType(candidate.node, candidate.itemElement),
      name: candidate.itemName,
      quality: q.quality,
      nameColor: q.nameColor,
      iconUrl: candidate.iconInfo?.iconUrl || null,
      iconDataUrl: null,
      iconCapture: candidate.iconInfo?.iconCapture || null,
      iconCaptureSource: candidate.iconInfo?.source || "none",
      level: null,
      value: null,
      raw: createModifierSet(),
      throughDurability: createModifierSet(),
      statDisplayRows: [],
      durability: { current: null, maximum: null, percent: null },
      conditioning: { current: null, maximum: null, percent: null },
      soulBoundTo: null,
      rawTooltipText: allText,
      rawTooltipJson: candidate.tooltip || null,
      capturedAt: new Date().toISOString()
    };

    for (const row of rows) {
      const rowText = normalize(row.cells.join(" "));
      const levelMatch = rowText.match(/\blevel\s+(\d+)\b/i); if (levelMatch) item.level = Number(levelMatch[1]);
      const valueMatch = rowText.match(/\bvalue\s+([\d.,]+)/i); if (valueMatch) item.value = parseInteger(valueMatch[1]);
      const dur = rowText.match(/\bdurability\s+([\d.,]+)\s*\/\s*([\d.,]+)\s*\((\d+)%\)/i);
      if (dur) item.durability = { current: parseInteger(dur[1]), maximum: parseInteger(dur[2]), percent: Number(dur[3]) };
      const cond = rowText.match(/\bconditioning\s+([\d.,]+)\s*\/\s*([\d.,]+)\s*\((\d+)%\)/i);
      if (cond) item.conditioning = { current: parseInteger(cond[1]), maximum: parseInteger(cond[2]), percent: Number(cond[3]) };
      const bound = rowText.match(/^soul bound to\s*:\s*(.+)$/i); if (bound) item.soulBoundTo = bound[1];
    }

    captureRowsIntoItem(item, rows);
    parseDamageRanges(item, rows);
    item.displayDamage = damageDisplay(item.raw.damage);
    item.fitTier = provisionalTier(item);
    return item;
  }

  const GENERIC_NON_EQUIPMENT_CONTENT_TYPES = new Set(["-1", "64"]);

  function genericItemSourceKey(node) {
    const parts = [
      node?.closest?.("#packages, #inventory, #inv, .inventory_box, .packageItem, #content, #center, body")?.id || "",
      node?.getAttribute?.("data-container-number") || "",
      node?.getAttribute?.("data-position-x") || "",
      node?.getAttribute?.("data-position-y") || "",
      node?.getAttribute?.("data-item-id") || "",
      node?.getAttribute?.("data-hash") || ""
    ];
    return parts.join("|");
  }

  function genericCandidateVisible(node) {
    const rect = visibleRect(node);
    if (!rect) return false;
    const right = rect.left + rect.width;
    const bottom = rect.top + rect.height;
    return bottom > 0 && rect.top < window.innerHeight && right > 0 && rect.left < window.innerWidth;
  }

  function genericDiagnosticElementSnapshot(node) {
    if (!node) return null;
    const attrs = {};
    for (const name of ["id", "class", "data-item-id", "data-hash", "data-content-type", "data-item-type", "data-category", "data-type", "data-container-number", "data-position-x", "data-position-y", "data-measurement-x", "data-measurement-y"]) {
      const value = node.getAttribute?.(name);
      if (value != null && value !== "") attrs[name] = String(value).slice(0, 500);
    }
    return {
      tag: String(node.tagName || "").toLowerCase() || null,
      attrs,
      text: normalize(node.textContent || "").slice(0, 180),
      hasTooltip: node.hasAttribute?.("data-tooltip") || false,
      tooltipLength: String(node.getAttribute?.("data-tooltip") || "").length
    };
  }

  function genericItemCandidateElements() {
    // Keep the exact rejection path visible in the master diagnostic. This is
    // deliberately one structured capture result rather than a separate
    // diagnostic collector so the problem can be diagnosed from Copy master
    // diagnostic alone.
    const allTooltipNodes = Array.from(document.querySelectorAll('[data-tooltip]'));
    const directItemNodes = Array.from(document.querySelectorAll('[data-item-id][class*="item-i-"], [data-hash][class*="item-i-"]'));
    const diagnostic = {
      schemaVersion: 1,
      capturedAt: new Date().toISOString(),
      queryCounts: {
        tooltipNodes: allTooltipNodes.length,
        directItemNodes: directItemNodes.length
      },
      stages: {
        tooltipNodesExamined: 0,
        excludedByContainer: 0,
        actualItemResolved: 0,
        actualItemNotResolved: 0,
        excludedResolvedItemByContainer: 0
      },
      candidateChecks: [],
      directItemNodeSamples: directItemNodes.slice(0, 60).map(genericDiagnosticElementSnapshot)
    };
    const seen = new Set();
    const out = [];
    const pushCheck = check => {
      if (diagnostic.candidateChecks.length < 100) diagnostic.candidateChecks.push(check);
    };
    for (const node of allTooltipNodes) {
      diagnostic.stages.tooltipNodesExamined += 1;
      const check = {
        tooltipNode: genericDiagnosticElementSnapshot(node),
        result: null,
        itemElement: null,
        parsed: null
      };
      if (seen.has(node)) {
        check.result = "duplicate-tooltip-node";
        pushCheck(check);
        continue;
      }
      seen.add(node);
      const sourceContainer = node.closest?.("#char, .auction_item_div, .ga-host, #gladiatus-assistant");
      if (sourceContainer) {
        diagnostic.stages.excludedByContainer += 1;
        check.result = "excluded-by-container";
        check.excludedContainer = genericDiagnosticElementSnapshot(sourceContainer);
        pushCheck(check);
        continue;
      }
      const itemElement = findActualItemElement(node, null);
      if (!itemElement) {
        diagnostic.stages.actualItemNotResolved += 1;
        check.result = "actual-item-not-resolved";
        pushCheck(check);
        continue;
      }
      diagnostic.stages.actualItemResolved += 1;
      check.itemElement = genericDiagnosticElementSnapshot(itemElement);
      const itemContainer = itemElement.closest?.("#char, .auction_item_div, .ga-host, #gladiatus-assistant");
      if (itemContainer) {
        diagnostic.stages.excludedResolvedItemByContainer += 1;
        check.result = "resolved-item-excluded-by-container";
        check.excludedContainer = genericDiagnosticElementSnapshot(itemContainer);
        pushCheck(check);
        continue;
      }
      check.result = "resolved";
      pushCheck(check);
      out.push(node);
    }
    diagnostic.visibleDirectItemNodes = directItemNodes.filter(node => genericCandidateVisible(node)).length;
    diagnostic.visibleDirectItemNodeSamples = directItemNodes.filter(node => genericCandidateVisible(node)).slice(0, 60).map(genericDiagnosticElementSnapshot);
    return { nodes: out, diagnostic };
  }

  function genericEquipmentTypeMapFromCurrentDoll() {
    const map = {};
    const root = document.querySelector("#char");
    if (!root) return map;
    const found = directTooltipCandidates(root);
    const assignments = assignSlots(found.accepted, root);
    for (const assignment of assignments) {
      const candidate = assignment.candidate;
      const type = attributeItemContentType(candidate.node, candidate.itemElement);
      if (!type) continue;
      const key = String(type);
      if (!map[key]) map[key] = [];
      if (!map[key].includes(assignment.slot)) map[key].push(assignment.slot);
    }
    return map;
  }

  function mergeGenericTypeMaps(...maps) {
    const out = {};
    for (const map of maps) {
      for (const [type, slots] of Object.entries(map || {})) {
        if (!Array.isArray(slots) || !slots.length) continue;
        if (!out[type]) out[type] = [];
        for (const slot of slots) if (!out[type].includes(slot)) out[type].push(slot);
      }
    }
    return out;
  }

  const GENERIC_ITEM_CLASS_GROUP_TO_SLOT = Object.freeze({
    "1": "weapon",
    "2": "shield",
    "3": "chest",
    "4": "helmet",
    "5": "gloves",
    "6": "ring",
    "8": "boots",
    "9": "amulet"
  });

  function genericComparisonSlotsForCandidate(candidate, typeMap) {
    const type = String(candidate?.contentType || "").trim();
    const mapped = Array.isArray(typeMap?.[type]) ? typeMap[type].filter(Boolean) : [];
    if (mapped.length) {
      if (mapped.every(slot => /^ring[12]$/.test(slot))) return ["ring1", "ring2"];
      return [...new Set(mapped)];
    }

    // Inventory/reward item elements use the same stable item-i-GROUP-VARIANT
    // class family as the character equipment DOM. The first numeric component
    // identifies the equipment family; use it only as a fallback after the
    // stronger content-type mapping above. Ring items intentionally map to both
    // ring slots because simulateAuctionComparison() evaluates both and keeps
    // the better replacement result.
    const classNames = [
      candidate?.itemElement?.className,
      candidate?.node?.className,
      candidate?.itemDomClass,
      candidate?.parsedItemClass
    ].filter(value => typeof value === "string");
    for (const className of classNames) {
      const match = className.match(/(?:^|\s)item-i-(\d+)-\d+(?:\s|$)/i);
      const family = match?.[1] || null;
      const slot = GENERIC_ITEM_CLASS_GROUP_TO_SLOT[family];
      if (!slot) continue;
      if (slot === "ring") return ["ring1", "ring2"];
      return [slot];
    }
    return [];
  }

  function directVisibleEquipmentCandidates() {
    const typeMap = mergeGenericTypeMaps(genericEquipmentTypeMapFromCurrentDoll());
    const candidateResult = genericItemCandidateElements();
    const nodes = candidateResult.nodes;
    const diagnostic = candidateResult.diagnostic;
    diagnostic.typeMap = typeMap;
    diagnostic.typeMapKeys = Object.keys(typeMap);
    diagnostic.scanCandidates = {
      visibleTooltipNodes: 0,
      tooltipRowsParsed: 0,
      tooltipRowsRejected: 0,
      itemNamesFound: 0,
      itemNamesMissing: 0,
      nonEquipmentRejected: 0,
      itemIdsFound: 0,
      itemIdsMissing: 0,
      itemHashesFound: 0,
      itemHashesMissing: 0,
      duplicateIdentityRejected: 0,
      comparisonSlotsResolved: 0,
      comparisonSlotsMissing: 0,
      accepted: 0
    };
    diagnostic.acceptedItems = [];
    diagnostic.rejectedItems = [];
    const accepted = [];
    const seenIdentity = new Set();
    const pushRejected = (reason, node, itemElement, extra = {}) => {
      if (diagnostic.rejectedItems.length >= 100) return;
      diagnostic.rejectedItems.push({
        reason,
        tooltipNode: genericDiagnosticElementSnapshot(node),
        itemElement: genericDiagnosticElementSnapshot(itemElement),
        ...extra
      });
    };
    for (const node of nodes) {
      if (!genericCandidateVisible(node)) {
        pushRejected("tooltip-node-not-visible", node, null);
        continue;
      }
      diagnostic.scanCandidates.visibleTooltipNodes += 1;
      const tooltip = getTooltipAttr(node);
      const rows = tooltipRows(tooltip);
      const itemLike = rows.length > 0 && itemLikeRows(rows);
      if (!rows.length || !itemLike) {
        diagnostic.scanCandidates.tooltipRowsRejected += 1;
        pushRejected("tooltip-rows-not-item-like", node, null, {
          tooltipLength: String(tooltip || "").length,
          rowCount: rows.length,
          itemLikeRows: itemLike
        });
        continue;
      }
      diagnostic.scanCandidates.tooltipRowsParsed += 1;
      const itemName = findItemName(rows);
      if (!itemName || itemName === "Unknown item") {
        diagnostic.scanCandidates.itemNamesMissing += 1;
        pushRejected("item-name-missing", node, null, { rowCount: rows.length });
        continue;
      }
      diagnostic.scanCandidates.itemNamesFound += 1;
      const itemElement = findActualItemElement(node, null) || node;
      const contentType = attributeItemContentType(node, itemElement);
      if (contentType && GENERIC_NON_EQUIPMENT_CONTENT_TYPES.has(String(contentType))) {
        diagnostic.scanCandidates.nonEquipmentRejected += 1;
        pushRejected("non-equipment-content-type", node, itemElement, { contentType, itemName });
        continue;
      }
      const itemId = attributeItemId(itemElement, node);
      const itemHash = attributeItemHash(null, node, itemElement);
      if (!itemId && !itemHash) {
        diagnostic.scanCandidates.itemIdsMissing += 1;
        diagnostic.scanCandidates.itemHashesMissing += 1;
        pushRejected("item-identity-missing", node, itemElement, { itemName, contentType });
        continue;
      }
      if (itemId) diagnostic.scanCandidates.itemIdsFound += 1;
      if (itemHash) diagnostic.scanCandidates.itemHashesFound += 1;
      const identity = genericItemSourceKey(itemElement);
      if (seenIdentity.has(identity)) {
        diagnostic.scanCandidates.duplicateIdentityRejected += 1;
        pushRejected("duplicate-identity", node, itemElement, { itemId, itemName, identity });
        continue;
      }
      seenIdentity.add(identity);
      const candidate = {
        node, tooltip, rows, itemName, itemElement, slotElement: null, equipmentContainer: null,
        containerNumber: null, slotDomId: "",
        iconInfo: iconInfoFromSlot(null, node, itemElement),
        itemId,
        itemHash: attributeItemHash(null, node, itemElement),
        contentType,
        measurementX: Number(itemElement.getAttribute("data-measurement-x") || 0) || null,
        measurementY: Number(itemElement.getAttribute("data-measurement-y") || 0) || null,
        positionX: Number(itemElement.getAttribute("data-position-x") || 0) || null,
        positionY: Number(itemElement.getAttribute("data-position-y") || 0) || null,
        sourceKey: identity,
        source: "generic-visible"
      };
      const item = parseTooltipItem(candidate, null);
      item.contentType = contentType;
      item.measurementX = candidate.measurementX;
      item.measurementY = candidate.measurementY;
      item.positionX = candidate.positionX;
      item.positionY = candidate.positionY;
      item.sourceKey = candidate.sourceKey;
      item.source = candidate.source;
      item.comparisonSlots = genericComparisonSlotsForCandidate(item, typeMap);
      if (!item.comparisonSlots.length) {
        diagnostic.scanCandidates.comparisonSlotsMissing += 1;
        pushRejected("comparison-slot-unresolved", node, itemElement, {
          itemId,
          itemName,
          contentType,
          itemClass: itemElement.className || null,
          typeMap,
          parsedItemClass: item.itemDomClass || null
        });
        continue;
      }
      diagnostic.scanCandidates.comparisonSlotsResolved += 1;
      diagnostic.scanCandidates.accepted += 1;
      accepted.push({ item, sourceKey: candidate.sourceKey, contentType, comparisonSlots: item.comparisonSlots });
      if (diagnostic.acceptedItems.length < 100) {
        diagnostic.acceptedItems.push({
          itemId: item.itemId,
          itemHash: item.itemHash,
          itemName: item.name,
          contentType: item.contentType,
          comparisonSlots: item.comparisonSlots,
          itemClass: item.itemDomClass,
          sourceKey: item.sourceKey,
          measurementX: item.measurementX,
          measurementY: item.measurementY,
          positionX: item.positionX,
          positionY: item.positionY,
          tooltipNode: genericDiagnosticElementSnapshot(node),
          itemElement: genericDiagnosticElementSnapshot(itemElement)
        });
      }
    }
    diagnostic.final = {
      accepted: accepted.length,
      examinedTooltipCandidates: nodes.length,
      directItemNodes: diagnostic.queryCounts.directItemNodes,
      visibleDirectItemNodes: diagnostic.visibleDirectItemNodes
    };
    return { accepted, typeMap, examined: nodes.length, diagnostic };
  }

  function directAuctionComparisonCandidates() {
    const category = auctionCategoryInfo();
    const allListings = Array.from(document.querySelectorAll('.auction_item_div'));
    const accepted = [];
    for (let globalIndex = 0; globalIndex < allListings.length; globalIndex++) {
      const listing = allListings[globalIndex];
      const itemElement = findAuctionItemElement(listing);
      if (!itemElement) continue;
      const tooltip = getTooltipAttr(itemElement);
      const groups = auctionTooltipGroups(tooltip);
      if (!groups.first?.length) continue;
      const rows = auctionFirstGroupRows(tooltip);
      const itemName = findItemName(rows);
      if (!itemName || itemName === 'Unknown item') continue;
      const candidate = {
        listing, itemElement, node: itemElement, tooltip, rows, itemName,
        index: globalIndex, globalIndex, iconInfo: iconInfoFromSlot(null, listing, itemElement),
        auctionPrice: auctionPriceFromElement(itemElement),
        measurementX: Number(itemElement.getAttribute('data-measurement-x') || 0) || null,
        measurementY: Number(itemElement.getAttribute('data-measurement-y') || 0) || null,
        itemLevel: Number(itemElement.getAttribute('data-level') || 0) || null,
        itemHash: itemElement.getAttribute('data-hash') || null,
        itemId: itemElement.getAttribute('data-item-id') || null,
        contentType: attributeItemContentType(itemElement, itemElement),
        listingClass: listing.className || null
      };
      const item = parseAuctionItem(candidate, globalIndex);
      accepted.push(item);
    }
    return { accepted, typeMap: {}, examined: allListings.length, categoryValue: category.value, categoryLabel: category.label };
  }

  async function scanVisibleEquipmentForComparison() {
    const auction = directAuctionComparisonCandidates();
    const generic = directVisibleEquipmentCandidates();
    const items = [...auction.accepted, ...generic.accepted.map(entry => entry.item)];
    return {
      ok: true, items, auctionCount: auction.accepted.length, genericCount: generic.accepted.length,
      typeMap: generic.typeMap, examined: auction.examined + generic.examined,
      categoryValue: auction.categoryValue || null, categoryLabel: auction.categoryLabel || null,
      captureDiagnostics: {
        mode: "visible-equipment-comparison",
        page: { url: location.href, pathname: location.pathname, hostname: location.hostname, bodyId: document.body?.id || "" },
        auction: { examined: auction.examined, accepted: auction.accepted.length, categoryValue: auction.categoryValue || null, categoryLabel: auction.categoryLabel || null },
        generic: generic.diagnostic
      }
    };
  }

  function quickEquipmentSignature(root) {
    if (!root) return null;
    const found=directTooltipCandidates(root);
    const assignments=assignSlots(found.accepted,root);
    const signature={}; for(const slot of SLOT_NAMES) signature[slot]=null;
    for(const a of assignments){
      signature[a.slot]={
        name:a.candidate.itemName,
        itemId:attributeItemId(a.candidate.itemElement,a.candidate.node),
        itemHash:attributeItemHash(a.candidate.slotElement,a.candidate.node,a.candidate.itemElement),
        domId:a.candidate.slotDomId || '',
        itemClass:a.candidate.itemElement?.className || ''
      };
    }
    return stableStringify(signature);
  }

  function stripForFingerprint(value) {
    if (Array.isArray(value)) return value.map(stripForFingerprint);
    if (value && typeof value === "object") {
      const out = {};
      for (const [k, v] of Object.entries(value)) {
        if (["iconDataUrl", "iconCapture", "iconCaptureSource", "capturedAt", "rawTooltipText", "rawTooltipJson", "durability", "conditioning", "statDisplayRows"].includes(k)) continue;
        out[k] = stripForFingerprint(v);
      }
      return out;
    }
    return value;
  }

  async function hashString(text) {
    try {
      const bytes = new TextEncoder().encode(text);
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      return [...new Uint8Array(digest)].map(x => x.toString(16).padStart(2, "0")).join("");
    } catch {
      let h = 2166136261;
      for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
      return (h >>> 0).toString(16);
    }
  }

  function stableStringify(value) {
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
    return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
  }



  function auctionCategoryInfo() {
    const select = document.querySelector('select[name="itemType"]');
    if (!select) return { value: null, label: null };
    const value = String(select.value ?? "0");
    const option = select.selectedOptions?.[0];
    return { value, label: (option?.textContent || (value === "0" ? "All" : `Category ${value}`)).trim() };
  }

  function auctionTooltipGroups(raw) {
    const data = parseTooltipJson(raw);
    if (!Array.isArray(data) || !Array.isArray(data[0])) return { first: null, comparison: [] };
    return { first: data[0], comparison: data.slice(1) };
  }

  // tooltipRows() expects the full Gladiatus tooltip wrapper ([[row], [row], ...]).
  // Auction data is nested one level higher because data-tooltip contains one or
  // more complete tooltip groups. Wrap the first group so it is parsed as one item.
  function auctionFirstGroupRows(raw) {
    const groups = auctionTooltipGroups(raw);
    return groups.first ? tooltipRows(JSON.stringify([groups.first])) : [];
  }

  function auctionPriceFromElement(itemElement) {
    const raw = itemElement?.getAttribute?.('data-price-gold');
    return raw == null ? null : parseInteger(raw);
  }

  function auctionContentFingerprint(item) {
    return stableStringify({
      hash: item.itemHash || null,
      name: item.name || null,
      price: item.auctionPrice ?? null,
      level: item.level ?? null,
      measurementX: item.measurementX ?? null,
      measurementY: item.measurementY ?? null
    });
  }

  function auctionGoldIconRect(listings) {
    const auctionGold = Array.from(document.querySelectorAll('.auction_item_div .icon_gold'));
    const fallbackGold = auctionGold.length ? auctionGold : Array.from(document.querySelectorAll('.icon_gold'));
    const visibleGold = fallbackGold.map(el => ({ el, rect: visibleRect(el) })).filter(x => x.rect);
    if (!visibleGold.length) return null;
    const listingRects = listings.map(l => visibleRect(l)).filter(Boolean);
    if (!listingRects.length) return visibleGold[0].rect;
    const center = r => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    let best = null;
    for (const candidate of visibleGold) {
      const c = center(candidate.rect);
      let minDistance = Infinity;
      for (const lr of listingRects) {
        const l = center(lr);
        const d = Math.hypot(c.x - l.x, c.y - l.y);
        if (d < minDistance) minDistance = d;
      }
      if (!best || minDistance < best.distance) best = { rect: candidate.rect, distance: minDistance };
    }
    return best?.rect || null;
  }

  function isAuctionItemElement(el) {
    if (!el?.classList) return false;
    const hasItemClass = [...el.classList].some(c => /^item-i-\d+-\d+$/i.test(c));
    return hasItemClass && !!el.getAttribute?.('data-tooltip');
  }

  function findAuctionItemElement(listing) {
    if (!listing) return null;
    const exact = listing.querySelector('[data-tooltip][class*="item-i-"]');
    if (exact && isAuctionItemElement(exact)) return exact;
    const candidates = Array.from(listing.querySelectorAll('[data-tooltip]')).filter(isAuctionItemElement);
    return candidates[0] || null;
  }

  function auctionListingVisible(listing) {
    const rect = visibleRect(listing);
    if (!rect) return false;
    const right = rect.left + rect.width;
    const bottom = rect.top + rect.height;
    return bottom > 0 && rect.top < window.innerHeight && right > 0 && rect.left < window.innerWidth;
  }

  function directAuctionCandidates() {
    // Return only currently visible listings so their icon rectangles can be
    // captured, but preserve the listing's global DOM index for scroll-through
    // scans in the on-page Auction UI.
    const allListings = Array.from(document.querySelectorAll('.auction_item_div'));
    const listings = allListings.filter(auctionListingVisible);
    const accepted = [];
    let rejected = 0;
    for (const listing of listings) {
      const globalIndex = allListings.indexOf(listing);
      const itemElement = findAuctionItemElement(listing);
      if (!itemElement) { rejected++; continue; }
      const tooltip = getTooltipAttr(itemElement);
      const groups = auctionTooltipGroups(tooltip);
      if (!groups.first?.length) { rejected++; continue; }
      const rows = auctionFirstGroupRows(tooltip);
      const itemName = findItemName(rows);
      if (!itemName || itemName === 'Unknown item') { rejected++; continue; }
      const rect = visibleRect(itemElement);
      if (!rect) { rejected++; continue; }
      accepted.push({
        listing,
        itemElement,
        node: itemElement,
        tooltip,
        rows,
        itemName,
        index: globalIndex,
        globalIndex,
        iconInfo: iconInfoFromSlot(null, listing, itemElement),
        auctionPrice: auctionPriceFromElement(itemElement),
        measurementX: Number(itemElement.getAttribute('data-measurement-x') || 0) || null,
        measurementY: Number(itemElement.getAttribute('data-measurement-y') || 0) || null,
        itemLevel: Number(itemElement.getAttribute('data-level') || 0) || null,
        itemHash: itemElement.getAttribute('data-hash') || null,
        itemId: itemElement.getAttribute('data-item-id') || null,
        listingClass: listing.className || null
      });
    }
    return { accepted, listings, allListings, totalListings: allListings.length, rejected, goldIconRect: null };
  }

  function parseAuctionItem(candidate, index) {
    const item = parseTooltipItem({
      ...candidate,
      // Keep the complete tooltip for quality parsing; tooltipRows() already uses
      // the first tooltip group. The comparison item remains ignored.
      tooltip: candidate.tooltip
    }, null);
    item.schemaVersion = 1;
    const category = auctionCategoryInfo();
    item.auctionCategoryValue = category.value;
    item.auctionCategoryLabel = category.label;
    item.categoryValue = category.value;
    item.categoryLabel = category.label;
    item.slot = null;
    item.slotLabel = null;
    item.slotDomId = null;
    item.slotContainerNumber = null;
    item.auctionPrice = candidate.auctionPrice;
    item.measurementX = candidate.measurementX;
    item.measurementY = candidate.measurementY;
    item.itemId = candidate.itemId;
    item.itemHash = candidate.itemHash;
    item.itemLevel = candidate.itemLevel;
    item.auctionIndex = Number.isFinite(Number(candidate.globalIndex)) ? Number(candidate.globalIndex) : index;
    // A listing is uniquely identified by auction category + global auction
    // position. Do not use the viewport/local parser index: scrolling rescans
    // overlapping listings and local indices repeat.
    item.listingId = `${location.hostname}:auction:${category.value ?? "0"}:${item.auctionIndex}`;
    item.contentFingerprint = auctionContentFingerprint(item);
    item.fitTier = null;
    // Store only the first tooltip group so the comparison/equipped tooltip is
    // never persisted as part of the auction item's raw data.
    const groups = auctionTooltipGroups(candidate.tooltip);
    item.rawTooltipJson = groups.first ? JSON.stringify(groups.first) : null;
    item.rawTooltipText = candidate.rows.flatMap(r => r.cells).join(' | ');
    return item;
  }

  async function scanAuction() {
    const category = auctionCategoryInfo();
    const diagnostics = {
      scanStatus: 'success',
      failedStage: null,
      categoryValue: category.value,
      categoryLabel: category.label,
      pageDetected: /auction/i.test(document.body?.innerText || '') || document.querySelectorAll('.auction_item_div').length > 0,
      listingsFound: 0,
      itemsAccepted: 0,
      itemsParsed: 0,
      itemsWithPrice: 0,
      itemsWithIcons: 0,
      itemRectsDetected: 0,
      qualitiesDetected: 0,
      durabilityDetected: 0,
      conditioningDetected: 0,
      valuesDetected: 0,
      rawPercentStatsDetected: 0,
      throughDurabilityDetected: 0,
      itemHashesDetected: 0,
      itemMeasurementsDetected: 0,
      duplicateListings: 0,
      goldIconFound: 1,
      goldIconSource: "hardcoded",
      viewport: { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight, devicePixelRatio: window.devicePixelRatio || 1 },
      itemRects: {},
      goldIconRect: null,
      itemPngDuplicateCount: 0,
      errors: []
    };
    const found = directAuctionCandidates();
    diagnostics.listingsFound = found.totalListings ?? found.listings.length;
    diagnostics.itemsAccepted = found.accepted.length;
    // Duplicates remain separate rows; this is diagnostic-only information.
    const duplicateCounts = new Map();
    for (const candidate of found.accepted) {
      const key = stableStringify({
        hash: candidate.itemHash || null,
        name: candidate.itemName || null,
        price: candidate.auctionPrice ?? null,
        level: candidate.itemLevel ?? null,
        measurementX: candidate.measurementX ?? null,
        measurementY: candidate.measurementY ?? null
      });
      duplicateCounts.set(key, (duplicateCounts.get(key) || 0) + 1);
    }
    diagnostics.duplicateListings = [...duplicateCounts.values()].reduce((sum, count) => sum + Math.max(0, count - 1), 0);
    const items = [];
    for (let i = 0; i < found.accepted.length; i++) {
      const candidate = found.accepted[i];
      try {
        const item = parseAuctionItem(candidate, i);
        diagnostics.itemsParsed++;
        if (item.auctionPrice != null) diagnostics.itemsWithPrice++;
        if (item.iconCapture) { diagnostics.itemsWithIcons++; diagnostics.itemRectsDetected++; }
        if (item.quality !== 'unknown') diagnostics.qualitiesDetected++;
        if (item.durability.percent != null) diagnostics.durabilityDetected++;
        if (item.conditioning.percent != null) diagnostics.conditioningDetected++;
        if (item.value != null) diagnostics.valuesDetected++;
        if (Object.values(item.raw || {}).some(v => v && v.percent)) diagnostics.rawPercentStatsDetected++;
        if (Object.values(item.throughDurability || {}).some(v => v && (v.flat || v.percent))) diagnostics.throughDurabilityDetected++;
        if (item.itemHash) diagnostics.itemHashesDetected++;
        if (item.measurementX && item.measurementY) diagnostics.itemMeasurementsDetected++;
        diagnostics.itemRects[i] = item.iconCapture;
        items.push(item);
      } catch (error) {
        diagnostics.errors.push(`listing ${i + 1}: ${error?.message || String(error)}`);
      }
    }
    diagnostics.goldIconRect = null;
    diagnostics.goldIconFound = 1;
    diagnostics.goldIconSource = "hardcoded";
    diagnostics.iconScreenshotReady = items.filter(x => x.iconCapture).length;
    diagnostics.iconsFound = items.filter(x => x.iconCapture || x.iconUrl).length;
    return {
      ok: items.length > 0,
      items,
      diagnostics,
      category,
      capture: {
        viewport: diagnostics.viewport,
        itemRects: Object.fromEntries(items.map((item, idx) => [String(Number.isFinite(Number(item.auctionIndex)) ? item.auctionIndex : idx), item.iconCapture]).filter(([, rect]) => !!rect)),
        goldIconRect: diagnostics.goldIconRect
      },
      scannedAt: new Date().toISOString(),
      error: items.length ? null : 'No auction items were found on this page.'
    };
  }

  async function scanEquipment() {
    const root = document.querySelector("#char");
    const diagnostics = {
      rootFound: !!root,
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
      slotDomIds: [],
      itemDomClasses: [],
      iconCaptureRects: {},
      iconCaptureUniqueRects: 0,
      duplicateIconRects: [],
      duplicateIconPngs: [],
      viewport: { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight, devicePixelRatio: window.devicePixelRatio || 1 },
      errors: []
    };
    if (!root) return { ok: false, equipment: emptyEquipment(), diagnostics, quickSignature: null, error: "The Gladiatus equipment paper-doll (#char) was not found." };

    const found = directTooltipCandidates(root);
    diagnostics.tooltipCandidates = found.examined;
    diagnostics.rejectedSlotChar = found.rejectedChar.length;
    diagnostics.acceptedTooltips = found.accepted.length;
    const assignments = assignSlots(found.accepted, root);
    diagnostics.slotsDetected = assignments.length;
    const equipment = emptyEquipment();

    for (const assignment of assignments) {
      try {
        const item = parseTooltipItem(assignment.candidate, assignment.slot);
        if (item.iconUrl || item.iconCapture) diagnostics.iconsFound++;
        if (item.iconCapture) {
          diagnostics.iconScreenshotReady++;
          diagnostics.iconCaptureRects[assignment.slot] = item.iconCapture;
        }
        if (item.quality !== "unknown") diagnostics.qualitiesDetected++;
        if (item.durability.percent != null) diagnostics.durabilityDetected++;
        if (item.conditioning.percent != null) diagnostics.conditioningDetected++;
        if (item.value != null) diagnostics.valuesDetected++;
        if (item.itemId != null) diagnostics.itemIdsDetected++;
        if (item.itemHash != null) diagnostics.itemHashesDetected++;
        if (item.itemDomClass) diagnostics.itemDomClasses.push(`${assignment.slot}:${item.itemDomClass}`);
        if (Object.values(item.raw).some(v => v && v.percent)) diagnostics.rawPercentStatsDetected++;
        if (Object.values(item.throughDurability).some(v => v && (v.flat || v.percent))) diagnostics.throughDurabilityDetected++;
        if (item.slotDomId) diagnostics.slotDomIds.push(`${item.slot}:${item.slotDomId}`);
        equipment[assignment.slot] = item;
      } catch (error) {
        diagnostics.errors.push(`${assignment.slot}: ${error?.message || String(error)}`);
      }
    }

    const rectMap=new Map();
    for(const [slot,rect] of Object.entries(diagnostics.iconCaptureRects)){
      const key=[rect.left,rect.top,rect.width,rect.height].map(v=>Number(v).toFixed(2)).join('|');
      if(!rectMap.has(key)) rectMap.set(key,[]);
      rectMap.get(key).push(slot);
    }
    diagnostics.iconCaptureUniqueRects=rectMap.size;
    diagnostics.duplicateIconRects=[...rectMap.values()].filter(slots=>slots.length>1);

    const quickSignature = quickEquipmentSignature(root);
    const fingerprint = await hashString(stableStringify(stripForFingerprint(equipment)));
    return {
      ok: true,
      equipment,
      diagnostics,
      quickSignature,
      fingerprint,
      capture: { viewport: diagnostics.viewport, rects: diagnostics.iconCaptureRects },
      scannedAt: new Date().toISOString()
    };
  }

  function emptyEquipment() { return Object.fromEntries(SLOT_NAMES.map(slot => [slot, null])); }

  function cleanTooltipLabel(value) {
    return stripTags(String(value ?? "").replace(/&nbsp;/gi, " ")).replace(/\s+/g, " ").trim().replace(/:$/, "");
  }

  function characterTooltipRows(rawTooltip) {
    const data = parseTooltipJson(rawTooltip);
    if (!data) return [];
    const group = Array.isArray(data?.[0]) ? data[0] : data;
    if (!Array.isArray(group)) return [];
    const rows = [];
    for (const entry of group) {
      const pair = Array.isArray(entry?.[0]) ? entry[0] : null;
      if (!pair || typeof pair[0] !== "string" || pair.length < 2) continue;
      rows.push({ label: cleanTooltipLabel(pair[0]), value: pair[1] });
    }
    return rows;
  }

  function tooltipValue(rows, pattern, occurrence = 0) {
    let seen = 0;
    for (const row of rows) {
      if (!pattern.test(row.label)) continue;
      if (seen++ === occurrence) return row.value;
    }
    return null;
  }

  function parseRangeValue(value) {
    if (value == null) return null;
    const s = normalize(value);
    const m = s.match(/(-?\d+(?:[.,]\d+)?)\s*[-–]\s*(-?\d+(?:[.,]\d+)?)/);
    if (!m) return null;
    return {
      min: Number(m[1].replace(",", ".")),
      max: Number(m[2].replace(",", ".")),
      text: s
    };
  }

  function statTooltipDetails(rawTooltip) {
    const rows = characterTooltipRows(rawTooltip);
    const basicRaw = tooltipValue(rows, /^basic$/i);
    const maximumRaw = tooltipValue(rows, /^maximum$/i);
    const basic = typeof basicRaw === "number" ? basicRaw : parseInteger(basicRaw);
    const maximum = typeof maximumRaw === "number" ? maximumRaw : parseInteger(maximumRaw);
    return { basic, maximum };
  }

  function parseCharacterStats() {
    const data = {};
    const statDetails = {};
    const combatDetails = {};
    // The Overview stat panel is the authoritative source for the character
    // currently selected by doll=N. #char is the equipment paper-doll and must
    // never be used as the stats root; using it can expose only main-character
    // fallback values and miss mirrored mercenary stats.
    const root = document.querySelector("#charstats");

    // Gladiatus renders the six trainable stats with stable IDs, but the value
    // class differs between the main character overview and mirrored/mercenary
    // layouts (e.g. .charstats_value vs .charstats_value3_mirrored). Read by
    // ID first so both layouts populate the same authoritative profile fields.
    for (const [key, id] of Object.entries(TRAINABLE_STAT_IDS)) {
      // Scope both ID lookups to #charstats because Gladiatus can reuse IDs
      // in other stat widgets on the same page (e.g. combat/report markup).
      const valueEl = root?.querySelector?.(`#${id}`) || null;
      const statEl = root?.querySelector?.(`#${id}_tt`) || valueEl?.closest?.('[data-tooltip]') || valueEl?.parentElement || null;
      const currentText = normalize(valueEl?.textContent || statEl?.querySelector?.(
        '.charstats_value, .charstats_value3, .charstats_value3_mirrored, .charstats_value22, .charstats_value22_mirrored'
      )?.textContent || '');
      const current = parseInteger(currentText);
      if (current != null) data[key] = current;

      const rawTooltip = statEl?.getAttribute?.('data-tooltip') || '';
      const tooltip = statTooltipDetails(rawTooltip);
      if (current != null || tooltip.basic != null || tooltip.maximum != null) {
        statDetails[key] = {
          base: tooltip.basic,
          max: tooltip.maximum,
          current: current != null ? current : (data[key] ?? null)
        };
      }
    }

    if (root) {
      // Keep the generic text parser as a fallback for non-standard/private
      // layouts, but never let it overwrite values already obtained from the
      // stable stat IDs above.
      const text = normalize(root.innerText || "");
      const rowRegex = /(Strength|Dexterity|Agility|Constitution|Charisma|Intelligence|Armour|Armor|Damage)\s+(-?\d+(?:[.,]\d+)?(?:\s*[-–]\s*-?\d+(?:[.,]\d+)?)?)/gi;
      for (const match of text.matchAll(rowRegex)) {
        const key = canonicalStat(match[1]); if (!key) continue;
        if (key === "damage") {
          const m = match[2].match(/(-?\d+(?:[.,]\d+)?)\s*[-–]\s*(-?\d+(?:[.,]\d+)?)/);
          if (m && data.damageMin == null) {
            data.damageMin = Number(m[1].replace(",", "."));
            data.damageMax = Number(m[2].replace(",", "."));
            data.damage = Math.round((data.damageMin + data.damageMax) / 2);
          }
        } else if (data[key] == null) {
          data[key] = Number(match[2].replace(",", "."));
        }
      }
    }

    // Parse the dedicated overview stat rows as well. This supplies armour,
    // damage and any game-provided tooltip breakdowns without relying on row
    // ordering, and supports mirrored .charstats_bg2 markup used by mercenaries.
    const statRows = root
      ? Array.from(root.querySelectorAll('.charstats_bg, .charstats_bg2'))
      : [];
    for (const statEl of statRows) {
      const labelText = normalize(statEl.querySelector(
        '.charstats_text, .charstats_text_mirrored, .charstats_value21, .charstats_value21_mirrored'
      )?.textContent || '');
      const key = canonicalStat(labelText);
      const currentText = normalize(statEl.querySelector(
        '.charstats_value, .charstats_value3, .charstats_value3_mirrored, .charstats_value22, .charstats_value22_mirrored'
      )?.textContent || '');
      const tooltipRows = characterTooltipRows(statEl.getAttribute('data-tooltip'));

      if (TRAINABLE_STAT_KEYS.includes(key)) {
        const current = parseInteger(currentText);
        if (current != null) data[key] = current;
        const tooltip = statTooltipDetails(statEl.getAttribute('data-tooltip'));
        statDetails[key] = {
          base: tooltip.basic,
          max: tooltip.maximum,
          current: current != null ? current : (data[key] ?? null)
        };
        continue;
      }

      if (key === "damage") {
        const currentRaw = tooltipValue(tooltipRows, /^Damage$/i) ?? currentText;
        const range = parseRangeValue(currentRaw);
        if (range) {
          data.damageMin = range.min;
          data.damageMax = range.max;
          data.damageRange = range.text;
          data.damage = Math.round((range.min + range.max) / 2);
        }
        combatDetails.damage = {
          current: data.damageRange ?? currentRaw ?? null,
          basic: tooltipValue(tooltipRows, /^Basic$/i) ?? null,
          throughItems: tooltipValue(tooltipRows, /^Through items$/i, 0) ?? null,
          throughStrength: tooltipValue(tooltipRows, /^Through strength$/i) ?? null,
          throughReinforcement: tooltipValue(tooltipRows, /^Through reinforcement$/i) ?? null,
          criticalDamage: tooltipValue(tooltipRows, /^Critical damage$/i) ?? null,
          criticalThroughItems: tooltipValue(tooltipRows, /^Through items$/i, 1) ?? null,
          criticalThroughDexterity: tooltipValue(tooltipRows, /^Through dexterity$/i) ?? null,
          criticalChance: tooltipValue(tooltipRows, /^Chance for critical damage$/i) ?? null
        };
        continue;
      }

      if (key === "armour") {
        const current = parseInteger(currentText || tooltipValue(tooltipRows, /^Armour$/i));
        if (current != null) data.armour = current;
        combatDetails.armour = {
          current: current,
          absorbsDamage: tooltipValue(tooltipRows, /^Absorbs damage$/i),
          resilience: tooltipValue(tooltipRows, /^Resilience$/i),
          resilienceThroughItems: tooltipValue(tooltipRows, /^Through items$/i, 0),
          resilienceThroughAgility: tooltipValue(tooltipRows, /^Through agility$/i),
          avoidCriticalChance: tooltipValue(tooltipRows, /^Chance of avoiding critical hits$/i),
          blockingValue: tooltipValue(tooltipRows, /^Blocking value$/i),
          blockingThroughItems: tooltipValue(tooltipRows, /^Through items$/i, 1),
          blockingThroughStrength: tooltipValue(tooltipRows, /^Through strength$/i),
          blockChance: tooltipValue(tooltipRows, /^Chance to block a hit$/i)
        };
        continue;
      }

      if (key === "health") {
        const life = tooltipValue(tooltipRows, /^Life points$/i);
        const lifeSource = life ?? currentText;
        const lifeRange = normalize(lifeSource).match(/([\d.,]+)\s*\/\s*([\d.,]+)/);
        if (lifeRange) {
          data.healthCurrent = parseInteger(lifeRange[1]);
          data.healthMax = parseInteger(lifeRange[2]);
        }
        const percentMatch = currentText.match(/(-?\d+(?:[.,]\d+)?)\s*%/);
        if (percentMatch) data.healthPercent = Number(percentMatch[1].replace(",", "."));
        if (data.healthPercent != null) data.health = `${data.healthPercent}%`;
        combatDetails.health = {
          current: life ?? null,
          lifeOnLevel: tooltipValue(tooltipRows, /^Life on level \d+$/i),
          throughItems: tooltipValue(tooltipRows, /^Through items$/i, 0),
          throughReinforcement: tooltipValue(tooltipRows, /^Through reinforcement$/i),
          bonusThroughConstitution: tooltipValue(tooltipRows, /^Bonus through Constitution$/i),
          regeneration: tooltipValue(tooltipRows, /^Regeneration$/i),
          regenerationThroughConstitution: tooltipValue(tooltipRows, /^Through constitution$/i),
          regenerationByLevel: tooltipValue(tooltipRows, /^By level$/i),
          regenerationThroughGuild: tooltipValue(tooltipRows, /^Through guild$/i),
          regenerationThroughPact: tooltipValue(tooltipRows, /^Through pact$/i),
          regenerationByCostumes: tooltipValue(tooltipRows, /^By costumes$/i),
          regenerationFromBlessing: tooltipValue(tooltipRows, /^From blessing$/i)
        };
      }
    }

    // Dedicated IDs are stable on the overview for armour and damage.
    const liveDamageEl = root?.querySelector?.('#char_schaden_tt[data-tooltip]') || null;
    if (liveDamageEl) {
      const rows = characterTooltipRows(liveDamageEl.getAttribute('data-tooltip'));
      const currentRaw = tooltipValue(rows, /^Damage$/i) ?? normalize(liveDamageEl.querySelector(
        '.charstats_value22, .charstats_value22_mirrored, .charstats_value3, .charstats_value3_mirrored, .charstats_value'
      )?.textContent || '');
      const range = parseRangeValue(currentRaw);
      if (range) {
        data.damageMin = range.min;
        data.damageMax = range.max;
        data.damageRange = range.text;
        data.damage = Math.round((range.min + range.max) / 2);
      }
      combatDetails.damage = {
        current: range?.text ?? currentRaw ?? null,
        basic: tooltipValue(rows, /^Basic$/i) ?? null,
        throughItems: tooltipValue(rows, /^Through items$/i, 0) ?? null,
        throughStrength: tooltipValue(rows, /^Through strength$/i) ?? null,
        throughReinforcement: tooltipValue(rows, /^Through reinforcement$/i) ?? null,
        criticalDamage: tooltipValue(rows, /^Critical damage$/i) ?? null,
        criticalThroughItems: tooltipValue(rows, /^Through items$/i, 1) ?? null,
        criticalThroughDexterity: tooltipValue(rows, /^Through dexterity$/i) ?? null,
        criticalChance: tooltipValue(rows, /^Chance for critical damage$/i) ?? null
      };
    }

    const liveArmourEl = root?.querySelector?.('#char_panzer_tt[data-tooltip]') || null;
    if (liveArmourEl) {
      const rows = characterTooltipRows(liveArmourEl.getAttribute('data-tooltip'));
      const currentRaw = tooltipValue(rows, /^Armour$/i) ?? normalize(liveArmourEl.querySelector(
        '.charstats_value22, .charstats_value22_mirrored, .charstats_value3, .charstats_value3_mirrored, .charstats_value'
      )?.textContent || '');
      const current = parseInteger(currentRaw);
      if (current != null) data.armour = current;
      combatDetails.armour = {
        current: current != null ? current : currentRaw ?? null,
        absorbsDamage: tooltipValue(rows, /^Absorbs damage$/i),
        resilience: tooltipValue(rows, /^Resilience$/i),
        resilienceThroughItems: tooltipValue(rows, /^Through items$/i, 0),
        resilienceThroughAgility: tooltipValue(rows, /^Through agility$/i),
        avoidCriticalChance: tooltipValue(rows, /^Chance of avoiding critical hits$/i),
        blockingValue: tooltipValue(rows, /^Blocking value$/i),
        blockingThroughItems: tooltipValue(rows, /^Through items$/i, 1),
        blockingThroughStrength: tooltipValue(rows, /^Through strength$/i),
        blockChance: tooltipValue(rows, /^Chance to block a hit$/i)
      };
    }

    // The overview stat panel has its own Level/HP rows. Parse those before
    // considering the global header, because the global header always belongs
    // to the main account character even when doll=2..6 is being viewed.
    if (root) {
      for (const statEl of Array.from(root.querySelectorAll('.charstats_bg, .charstats_bg2'))) {
        const label = cleanTooltipLabel(statEl.querySelector(
          '.charstats_text, .charstats_text_mirrored, .charstats_value21, .charstats_value21_mirrored'
        )?.textContent || '');
        const value = normalize(statEl.querySelector(
          '.charstats_value, .charstats_value3, .charstats_value3_mirrored, .charstats_value22, .charstats_value22_mirrored'
        )?.textContent || '');
        if (/^level$/i.test(label)) {
          const level = parseInteger(value);
          if (level != null) data.level = level;
        } else if (/^life points$/i.test(label)) {
          const life = value.match(/([\d.,]+)\s*\/\s*([\d.,]+)/);
          if (life) {
            const current = parseInteger(life[1]);
            const maximum = parseInteger(life[2]);
            if (current != null) data.healthCurrent = current;
            if (maximum != null) data.healthMax = maximum;
          }
        }
      }
    }

    let pageDollId = '1';
    try { pageDollId = String(new URL(location.href).searchParams.get('doll') || document.querySelector('#plDoll')?.value || '1'); } catch (_) {}

    // Global header values are only safe as a fallback for the main character.
    // Never copy them into a mercenary profile while doll=2..6 is displayed.
    const headerLevel = parseInteger(document.querySelector('#header_values_level')?.textContent || '');
    if (pageDollId === '1' && data.level == null && headerLevel != null) data.level = headerLevel;
    const headerHp = document.querySelector('#header_values_hp_bar[data-value], #header_values_hp_bar[data-max-value]');
    if (headerHp) {
      const current = parseInteger(headerHp.getAttribute('data-value') || '');
      const maximum = parseInteger(headerHp.getAttribute('data-max-value') || '');
      const percent = parseInteger(document.querySelector('#header_values_hp_percent')?.textContent || '');
      if (pageDollId === '1') {
        if (data.healthCurrent == null && current != null) data.healthCurrent = current;
        if (data.healthMax == null && maximum != null) data.healthMax = maximum;
        if (percent != null) { data.healthPercent = percent; data.health = `${percent}%`; }
      }
    }

    // Profile diagnostic: the capture UI can show exactly how many primary
    // stats were found, making partial/failed character captures obvious.
    data.captureDiagnostics = {
      trainableStatsFound: TRAINABLE_STAT_KEYS.filter(key => data[key] != null).length,
      trainableStatsExpected: TRAINABLE_STAT_KEYS.length,
      missingTrainableStats: TRAINABLE_STAT_KEYS.filter(key => data[key] == null)
    };

    if (Object.keys(statDetails).length) data.statDetails = statDetails;
    if (Object.keys(combatDetails).length) data.combatDetails = combatDetails;
    return data;
  }

  function roleTextFromTooltip(rawTooltip) {
    const data = parseTooltipJson(rawTooltip);
    if (!data) return { className: null, roleRaw: null, roleKey: null, tooltipText: null };
    const root = Array.isArray(data?.[0]) ? data[0] : data;
    const pairs = (Array.isArray(root) ? root : []).map(entry => {
      if (Array.isArray(entry) && typeof entry[0] === "string") return entry;
      if (Array.isArray(entry?.[0]) && typeof entry[0][0] === "string") return entry[0];
      return null;
    }).filter(Boolean);
    const plainValues = pairs.map(pair => stripTags(pair[0])).filter(Boolean);
    const tooltipText = plainValues.join(" ").replace(/\s+/g, " ").trim() || null;
    const quest = tooltipText?.match(/Quest:\s*(.+)$/i) || null;
    const className = normalize(quest ? tooltipText.slice(0, quest.index) : (plainValues[0] || tooltipText || "")).replace(/\s+/g, " ").trim() || null;
    const roleRaw = quest ? normalize(quest[1]).replace(/\s+/g, " ").trim() : null;
    const roleSource = String(roleRaw || className || "").toLowerCase();
    let roleKey = null;
    if (/heal group members|healer|heal/.test(roleSource)) roleKey = "healer";
    else if (/dish out damage|dps|damage/.test(roleSource)) roleKey = "dps";
    else if (/direct attention to oneself|tank|attention/.test(roleSource)) roleKey = "tank";
    else if (/standard battle/.test(roleSource)) roleKey = "main";
    return { className, roleRaw, roleKey, tooltipText };
  }

  function discoverCharacterDolls() {
    const selectors = Array.from(document.querySelectorAll('.charmercsel'));
    const dolls = [];
    const seen = new Set();
    for (const selector of selectors) {
      const pic = selector.querySelector('.charmercpic[class*="doll"]');
      const onclick = selector.getAttribute('onclick') || "";
      const href = selector.querySelector('a')?.href || null;
      const match = onclick.match(/selectDoll\(\s*["']([^"']+)["']\s*\)/i);
      let rawUrl = match?.[1] || href || null;
      if (!rawUrl) continue;
      let url = null;
      try { url = new URL(rawUrl, location.href).href; } catch (_) { continue; }
      const dollFromUrl = new URL(url).searchParams.get('doll');
      const dollFromClass = (pic?.className || '').match(/\bdoll(\d+)\b/i)?.[1] || null;
      const dollId = String(dollFromUrl || dollFromClass || '').trim();
      if (!dollId || seen.has(dollId)) continue;
      seen.add(dollId);
      const role = roleTextFromTooltip(pic?.getAttribute('data-tooltip'));
      dolls.push({
        dollId,
        url,
        active: selector.classList.contains('active'),
        className: role.className,
        roleRaw: role.roleRaw,
        roleKey: role.roleKey,
        tooltipText: role.tooltipText
      });
    }
    dolls.sort((a, b) => Number(a.dollId) - Number(b.dollId));
    return dolls;
  }

  function currentPlayerId() {
    try {
      const scripts = Array.from(document.scripts || []).map(script => script.textContent || '').join('\n');
      const match = scripts.match(/\b(?:var|let|const)\s+playerId\s*=\s*["'](\d+)["']/i);
      if (match) return String(match[1]);
    } catch (_) {}
    try {
      const ownName = normalize(document.querySelector('.playername')?.textContent || '');
      if (ownName) {
        const link = Array.from(document.querySelectorAll('a[href*="mod=player"][href*="p="]')).find(a => normalize(a.textContent || '') === ownName);
        if (link) return String(new URL(link.href, location.href).searchParams.get('p') || '');
      }
    } catch (_) {}
    return null;
  }

  function currentCharacterContext() {
    const url = new URL(location.href);
    const dollId = String(url.searchParams.get('doll') || document.querySelector('#doll')?.value || '1');
    const playerName = normalize(document.querySelector('.playername')?.textContent || '') || null;
    const dolls = discoverCharacterDolls();
    const selected = dolls.find(d => d.dollId === dollId) || null;
    const fullPanel = !!document.querySelector('#charstats');
    return {
      dollId,
      playerId: currentPlayerId(),
      name: playerName,
      className: selected?.className || (dollId === '1' ? 'Standard Battle' : null),
      roleRaw: selected?.roleRaw || (dollId === '1' ? 'Standard Battle' : null),
      roleKey: selected?.roleKey || (dollId === '1' ? 'main' : null),
      roleTooltip: selected?.tooltipText || null,
      url: location.href,
      pageIsOverview: url.searchParams.get('mod') === 'overview',
      statsPanelAvailable: fullPanel
    };
  }

  async function captureCharacterProfile() {
    const character = currentCharacterContext();
    const equipmentResult = await scanEquipment();
    const stats = parseCharacterStats();
    const ok = !!equipmentResult?.ok || Object.keys(stats).length > 0;
    return {
      ok,
      character,
      stats,
      equipment: equipmentResult?.equipment || emptyEquipment(),
      equipmentDiagnostics: equipmentResult?.diagnostics || null,
      quickSignature: equipmentResult?.quickSignature || null,
      fingerprint: equipmentResult?.fingerprint || null,
      capture: equipmentResult?.capture || null,
      scannedAt: new Date().toISOString(),
      error: ok ? null : (equipmentResult?.error || 'No character profile data was found on this page.')
    };
  }

  function activity() {
    const url = new URL(location.href);
    const submod = url.searchParams.get("submod") || "";
    const text = `${document.title} ${document.body?.innerText || ""}`.toLowerCase();
    if (/grouparena|circus|turma/.test(submod + " " + text)) return "circus";
    if (/dungeon/.test(submod + " " + text)) return "dungeon";
    if (/expedition/.test(submod + " " + text)) return "expedition";
    if (/arena/.test(submod + " " + text)) return "arena";
    return "unknown";
  }

  async function handle(message) {
    if (message?.type === "PING") return { state: parseCharacterStats(), activity: activity(), character: currentCharacterContext() };
    if (message?.type === "DISCOVER_CHARACTER_DOLLS") return { ok: true, character: currentCharacterContext(), dolls: discoverCharacterDolls() };
    if (message?.type === "CAPTURE_CHARACTER_PROFILE") return await captureCharacterProfile();
    if (message?.type === "SCAN_EQUIPMENT") return await scanEquipment();
    if (message?.type === "SCAN_AUCTION") return await scanAuction();
    if (message?.type === "SCAN_VISIBLE_EQUIPMENT_COMPARISON") return await scanVisibleEquipmentForComparison();
    if (message?.type === "QUICK_EQUIPMENT") {
      const root = document.querySelector("#char");
      return { rootFound: !!root, quickSignature: root ? quickEquipmentSignature(root) : null };
    }
    return { ok: false, error: "Unknown command" };
  }

  api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const type = message?.type;
    if (!["PING", "DISCOVER_CHARACTER_DOLLS", "CAPTURE_CHARACTER_PROFILE", "SCAN_EQUIPMENT", "SCAN_AUCTION", "SCAN_VISIBLE_EQUIPMENT_COMPARISON", "QUICK_EQUIPMENT"].includes(type)) return false;
    Promise.resolve(handle(message)).then(sendResponse).catch(error => sendResponse({ ok: false, error: error?.message || String(error) }));
    return true;
  });
})();
