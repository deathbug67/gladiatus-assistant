## v0.5.72 — Route visible equipment comparison scan

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
