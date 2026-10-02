# Gladiatus Assistant v0.5.51

## v0.5.51 Circus opponent fallback and healing-state cleanup
- Retries transient Circus Provinciarum opponent-profile HTTP failures (including HTTP 503) up to 3 retries with increasing delays.
- If an opponent remains uncapturable after retries, that opponent is excluded from the current analysis and successful opponents remain usable as targets.
- If no opponent can be captured, the automation requests a fresh Provinciarum opponent set before failing.
- Master Diagnostics records retry, recovery, and retry-exhausted events for individual opponent dolls.
- Clears the stale healing error after successful best-effort recovery that satisfies the HP safety threshold.

## v0.5.50 Expedition report/loot lifecycle fixes

- Prevents Auto Expedition from treating the last already-credited combat report as a new battle when its cooldown expires while the browser remains on that report. The stale report is now skipped and normal Expedition navigation continues.
- Adds explicit post-battle loot lifecycle diagnostics: loot detection, action click, completion when the loot dialog disappears, and a bounded 15-second timeout instead of an indefinite wait.
- Makes the optional loot-dialog detector more tolerant of server-side markup variations while still requiring a visible loot action dialog.
- A failed or timed-out loot action releases the affected automation module rather than leaving the dispatcher stuck indefinitely.


## v0.5.49 Master diagnostic consistency fixes

- Changes the default post-battle loot search action to **Thorough Search**. Existing explicitly saved selections remain unchanged.

- Stat Priority now uses the same persistent global simulation count as Arena opponent analysis, Circus Provinciarum opponent analysis, and Auction House item comparisons. Legacy stored Stat Priority simulation counts and results using a different count are ignored and synchronized to the global setting.
- Changing the global simulation count invalidates the current Stat Priority results and synchronizes the persisted Stat Priority state to the new count.
- Fixed combat readiness diagnostics so the generic readiness object reports its actual `reportType` and only marks `expedition` or `arena` true for the corresponding report kind. Arena captures no longer expose the incorrect `expedition: true` flag.
- The Stat Priority UI now displays the effective global simulation count instead of exposing a second independent simulation-count control.


## v0.5.47 Combat UI initialization fix

- Fixes Circus Provinciarum report lifecycle so a newly displayed report replaces stale pending report context, report loading has a bounded recovery window, and an incomplete report cannot hold the global dispatcher indefinitely.
- Refines Master Diagnostics so the UI renders only a lightweight preview on demand while Copy master diagnostic generates the full structured export without inserting the full event/snapshot payload into the DOM.
- Diagnostics tab switching no longer triggers automatic diagnostic generation.

## v0.5.44 Dungeon Boss-only reset duplicate-target fix

- Deduplicates duplicate DOM representations of the same Dungeon Boss encounter before target selection. Boss-only reset logic now evaluates logical encounters rather than raw `startFight(...)` nodes, preventing a duplicate Boss element from bypassing the configured reset-before-Boss behavior.
- Target-selection diagnostics expose the logical candidate count.

## v0.5.43 Global simulations and optional post-battle loot handling

- Adds a persistent global simulation count (default 50) shared by Arena opponent analysis, Circus Provinciarum opponent analysis, and Auction House item comparisons.
- Adds a persistent post-battle loot selection for Expedition and Dungeon: Return to Safety, Quick Search, or Thorough Search. The loot screen is optional/random; when absent, automation proceeds normally.

## v0.5.42 Independent Dungeon cooldown handoff
Normal Dungeon battles now mark only the Dungeon module as cooling and immediately hand control back to the global scheduler, allowing ready Arena/Circus/Expedition work to run before the Dungeon cooldown expires.


- Scheduler now follows the configured `routine` order when choosing among ready enabled modules instead of using the module discovery order. The legacy `circus` routine name is normalized to `provinciarum`.
- Enabled modules not present in the configured routine remain runnable and are appended in a deterministic fallback order.
- Added scheduler diagnostics showing the configured/effective routine order, selected module, and ready modules skipped because of routine order; the dispatcher snapshot now exposes both configured and effective order as well.
- Added an explicit terminal `runComplete` flag for Auto Dungeon. A Boss-completed Dungeon is permanently excluded from the active scheduler module set for that run and only becomes runnable again when the user explicitly starts Auto Dungeon again.
- Boss completion diagnostics now identify the terminal state and scheduler exclusion.

## v0.5.40 Dungeon boss cancellation and cooldown-gated navigation

- Fixed Auto Dungeon so a completed normal battle no longer navigates back to the Dungeon while the global Dungeon attack cooldown is active; navigation is deferred until the attack is actually available.
- Added a persistent **Cancel/reset Dungeon when Boss is the only target** option.
- Auto Dungeon still prioritizes and attacks a visible Boss whenever any normal encounter remains alongside it.
- When the option is enabled, the Dungeon is cancelled/reset only when the Boss is the sole remaining `startFight(...)` target. The Boss is never attacked in that reset case, and automation remains enabled to re-enter the selected dungeon.
- Added dedicated diagnostics for cooldown-gated navigation and Boss-only reset checks/clicks.

## v0.5.39 Dungeon global cooldown handling

- Fixed Auto Dungeon so the global Dungeon action cooldown is read from the server-provided Dungeon cooldown bar and enforced after every Dungeon battle.
- Kept Dungeon points as a separate resource; the next-point timer is only used when Dungeon points reach 0.
- Prevented the post-report navigation continuation from bypassing the global Dungeon cooldown and immediately starting another fight.
- Added explicit global and point cooldown values to Dungeon page diagnostics and a dedicated `dungeon-global-cooldown-wait` event.

## v0.5.38 Dungeon encounter classification

- Fixed Auto Dungeon classification so every valid `startFight(...)` dungeon node is treated as a normal encounter unless it is explicitly identified as the Boss (type `7` or visible `Boss` label).
- This supports freshly created dungeon maps that expose normal encounter types such as `1`–`4`.
- Added candidate-count diagnostics for normal, boss, and unknown dungeon encounters.

## v0.5.37 Auto Dungeon startup and dungeon selection

- Added a persistent **Dungeon** selector to Auto Combat using the currently unlocked dungeon-location entries exposed by the server page.
- Auto Dungeon now preserves the selected dungeon location instead of always resetting to Cave Temple at startup.
- Added explicit detection of the pre-entry **Enter Dungeon → Normal** state and automatic Normal-difficulty entry before looking for `startFight(...)` nodes.
- Added dedicated diagnostics for dungeon-entry detection and the automated Normal entry click, plus a waiting-map state while the new dungeon instance initializes.
- Auto Dungeon navigation continues to use server-provided dungeon links and the global pre-click humanization mechanism.

## v0.5.36 Dungeon report parsing

- Fixed Dungeon combat-report result detection for the actual `#reportHeader` markup (`reportWin` + `Winner: ...`).
- Added a Dungeon-specific `Damage & Healing` summary parser for variable-size Dungeon reports.
- Added explicit Dungeon outcome and damage-summary diagnostics.

## v0.5.35 Dungeon automation

- Added a dedicated **Auto Dungeon** module for the Cave Temple dungeon.
- Auto Dungeon follows the live dungeon map after every battle instead of assuming a fixed encounter sequence. It rescans the currently exposed fight controls and attacks a visible **Boss** node as soon as one is exposed; otherwise it attacks the currently exposed normal encounter.
- Dungeon node detection uses the live `startFight(type, dungeonId)` controls and the visible Boss marker rather than map coordinates or the displayed `1/5`, `2/5`, etc. progress labels.
- Added capture and persistence for Dungeon combat reports (`t=1`), including variable defender counts such as the observed 5v1 format, combat events, participants, outcome, and reward/damage summaries when available.
- Integrated Dungeon automation with the existing global combat dispatcher, global header cooldown observation, pre-click humanization delay, shared HP-safety/healing flow, and navigation ownership.
- Added Dungeon-specific scheduler/report/cooldown state to the diagnostics snapshot.
- Added recovery for the passive-capture/scheduler race where an already-captured Dungeon report could leave Auto Dungeon on the report page.

## v0.5.34 Circus Provinciarum stale-action recovery

Recovers persisted Provinciarum `confirming`/`humanizing` states after a page transition or reload instead of allowing the global scheduler to remain suppressed indefinitely. A live Circus report resumes report handling, an existing confirmation dialog resumes the pending confirmation, and an unrelated/non-combat page resets the transient action state and rechecks the live Provinciarum page.

## v0.5.28 changes

- Fixed Auction Analyzer maximum-price filtering so an unset/blank Max price is treated as no price limit instead of `0`.
- Preserved explicit `0` as a valid maximum price and normalized persisted/view-state values consistently.
- Added regression coverage for blank/null, zero, positive, negative, and invalid maximum-price values.
- Persisted completed Stat Priority and Manual Adjustment results instead of keeping them runtime-only.
- Restored saved Stat Priority results after content-script/page reloads.
- Added dedicated Stat Priority diagnostics covering analysis lifecycle, individual tests, persistence/restoration, rendering, and errors.
- Kept persisted results compact by omitting equipment/media payloads that are not needed to render the results.

## v0.5.24 changes

- Avoid overheal is enabled by default when there is no explicit user preference; legacy stored false values are treated as the old default and upgraded to enabled. Once the user changes or saves the checkbox, their ON/OFF choice is preserved.

## v0.5.23 changes

- Fixed Auto Combat HP-safety healing handoff so Arena/Expedition no longer retain the navigation lock when Auto Heal needs to navigate to Character Overview.
- Avoid overheal remains enabled by default.

## v0.5.22 changes

- Excluded doll 1 (the actual account main character) from Circus Turma Stat Priority team membership; Turma roles no longer affect roster eligibility.
- Added a separate Turma Stat Priority character selector that only cycles eligible non-main saved profiles.
- Arena Stat Priority continues to use the saved main character only.
- Made Avoid overheal enabled by default when no explicit saved preference exists.
- Made the Avoid overheal checkbox persist immediately when toggled.

## v0.5.21 changes

- Fixed Arena Auto Combat analysis after the saved-character migration by removing the stale `freshMain` object reference.
- Added a dedicated Circus Turma team simulation model using the saved multi-character profiles and saved equipment.
- Stat Priority now has explicit **Circus Turma** and **Arena** combat models.
- Circus Turma Stat Priority modifies only the selected saved fighter, reruns the full saved team against a frozen mirror team, and uses the resulting team win-rate change for each test.
- Arena Stat Priority remains main-character-only and uses a frozen one-on-one training dummy.
- Added Turma role controls for saved fighters without introducing a second stats/equipment capture pipeline.
- Added capture support for Turma `threat` and `critical healing` item modifiers; these modifiers are retained for Turma simulation but excluded from the general item-tier score.

The Circus Turma model is based on the public DinoDevs GladiatusBattleSimulator implementation. DinoDevs documents its Turma formulas as approximate, particularly for non-defense stances.


## v0.5.32 Auction prefix/suffix filters
Auction scan results now recognize item prefixes and suffixes using the Gladiatus Fansite catalog and expose persistent multi-select Prefix and Suffix filters, including No Prefix and No Suffix. Changing these filters does not rescan the auction.

## v0.5.33 Auction affix filter behavior

- Prefix and suffix filter options are displayed alphabetically.
- Suffix filter labels omit leading `of ` and `of the ` while preserving the original suffix value for matching.
- Prefix and suffix searches are additive (OR) by default when both filters are selected.
- Added a persistent **Combine Prefix + Suffix** checkbox for optional AND behavior when both filters are selected.
- Existing single-prefix, single-suffix, No Prefix, and No Suffix filtering behavior remains available.
