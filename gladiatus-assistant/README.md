## v0.5.94 — Dungeon same-opponent loss reset
- Dungeon losses are now non-terminal by default.
- Tracks consecutive losses against the same opponent; losses against a different opponent start a new streak, and any win clears the streak.
- Adds a persisted Auto Combat setting for the number of consecutive same-opponent losses required to reset the Dungeon run (default: 2, range: 1–10).
- When the threshold is reached, the extension navigates back to the active Dungeon, uses the server-provided reset control, clears the completed battle count/streak, and starts a new run.
- If the reset control is unavailable or the reset click fails, the Dungeon module stops rather than continuing blindly.

## v0.5.92 — Circus in-page refresh handoff
- Treats a successful in-page Circus Provinciarum opponent refresh as complete when the Circus cooldown starts, even when Gladiatus does not navigate to `getNewOpponents`.
- Releases Circus navigation ownership and returns control to the shared dispatcher so a ready Arena can be selected immediately.
- Keeps Arena and Circus combat/capture paths otherwise unchanged.

## v0.5.91 — Previous Circus refresh dispatcher handoff
- Circus native opponent analysis no longer loops on page mutations or while the server cooldown is active.
- Circus cached results now retain the team fingerprint required for cache validation.
- Automatic native analysis is tied to actual opponent-set changes; manual analysis remains explicit.

- Partial Arena/Circus opponent analysis no longer stops the automation; successfully analyzed opponents remain usable.
- Failed opponent profiles/simulations are recorded individually with the failed stage and error.
- If an entire opponent set is unusable, the module requests a fresh set or retries the live page instead of disabling the module.
- Partial analysis sets are reusable from cache; cached results report the real successful/failed counts.
- Known transient Arena/Circus analysis/confirmation errors recover from persisted error state instead of remaining permanently stopped.
- Low-win-rate safeguards evaluate only opponents with usable simulated win rates while retaining missing/failed candidates in diagnostics.
- Redundant native Arena/Circus cache-reuse diagnostic spam is suppressed.
- Generic equipment-comparison scans are gated away from unrelated pages with no item/comparison context.
- Arena confirmation handling now retries the target safely and detects a fight that has already started via a new combat report or cooldown.


## v0.5.81 — Arena loss result detection

- Builds on v0.5.80.
- Detects Arena wins/losses directly from the report header's `reportWin` / `reportLose` class.
- Removes the dependency on the Reward section for determining Arena losses.
- Preserves existing Winner-heading and remaining-life fallbacks for other combat reports.

## v0.5.80 — Unified low-win-rate opponent refresh

- Builds on v0.5.79.
- Keeps the minimum opponent win-rate safeguard as the single win-rate gate for Arena and Circus Provinciarum.
- Removes the terminal hard-stop when the refresh control is temporarily unavailable; automation remains enabled and retries the refresh path.
- Makes the Arena/Circus refresh-control lookup tolerant of submit-button markup variants.
- Preserves the separate exhausted-opponent fallback refresh for the case where every visible opponent has already been attempted.

## v0.5.77 — Native tooltip DOM comparison rows — Direct section.tooltips insertion

- Builds on v0.5.72.
- Renders generic equipment comparison results through Gladiatus' native `data-comparison-tooltip` mechanism so the result appears at the bottom of the normal item tooltip.
- Preserves the item's original comparison-tooltip attribute and restores it when no comparison result is active.
- Keeps the existing package/inventory scrolling detection behavior.

## v0.5.73 — Route visible equipment comparison scan

- Builds on v0.5.69.
- Fixes background/service-worker parser routing so `SCAN_VISIBLE_EQUIPMENT_COMPARISON` reaches `gladiatus-parser.js`.
- Keeps the v0.5.69 master diagnostic for visible equipment capture.
- Keeps result-first Circus Provinciarum report completion behavior.

## v0.5.69 — Master visible-item capture diagnostics

### Circus Provinciarum
- Keeps the v0.5.68 result-first report completion behavior: a definitive Win/Loss result is sufficient to finish the fight.

### Universal equipment comparison diagnostics
- Adds detailed visible-equipment capture tracing to the existing Master Diagnostic; no separate diagnostic panel or copy mechanism is added.
- The master diagnostic records DOM preflight counts, tooltip/item candidate counts, wrapper-to-item resolution, rejection reasons, content types, item IDs, item classes, slot mapping, accepted candidates and parser/runtime errors.
- The diagnostic is stored with the existing Auction/Comparison diagnostic stream so a single **Copy master diagnostic** contains the complete capture evidence.
- Adds both parser-side and overlay-side counts so we can distinguish “items are not present in the DOM”, “items have no usable tooltip”, “wrapper/item resolution failed”, “item metadata is incomplete”, and “slot mapping failed”.
