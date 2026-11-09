# The Little Trading Post v3 — candid implementation and QA audit

**Build examined:** user-supplied v2 `index.html` from `v2-original.zip`, expanded in place as `index.html`. 2026-11-08. All screenshots are actual Chromium browser renders of the delivered source.

## Critical baseline problems and change evidence

| Severity | v2 problem found | v3 action taken | Verification / caveat |
|---|---|---|---|
| CRITICAL | Entire game world was the Whisperwood Clearing canvas; visiting Mama had no distinct den scene. | Eight distinct drawable locations, Mama's Den interior, routes/map, unique object interactions and per-character locations. | Browser location transitions and actual screenshots verified; travel between regions is discrete, not seamless. |
| HIGH | At desktop size the main world was cramped beside the dashboard. | Responsive desktop world is roughly 1016px wide at 1440px viewport; narrow barter sidebar and under-canvas hotbar. | Screenshot and browser width assertion. |
| HIGH | Bag was below the fold; frequent inventory actions required scrolling. | Persistent compact bag hotbar and optional full backpack modal (`I`). | Browser button check. |
| MEDIUM | `YOU` label obscured face and world sprites. | Marked player's trading post above canopy; place personal label above head elsewhere. | Visual screenshot of post and den. |
| CRITICAL | Rarity was suggestive description, not an audited 6-tier weighted discovery generator. | Six tiers, eligibility-filtered region pools, 58 source-derived item IDs, complete CSV/MD catalog, 25,000-roll samples per area. | Script-backed source export; per-zone distribution differs from nominal tier weights. |
| HIGH | Some NPC inventory was treated as wholly available to the player. | Distinct carried/hidden/reserved stock, hidden caches, NPC finds and protected goods. | Deep inventory tests. |
| HIGH | Contradictory single-clearing NPC social/trade simulation. | Background NPC barter/social filters require common location; schedule gives each cub one location at a time. | Deep tests and 35-day run; schedule transit still abstract. |
| HIGH | Family interaction was a UI action without a physically simulated family space. | Mama's visible den, family food, sibling conversations and promise, suspicious-item inspections. | Den screenshot and browser checks; limited number of authored interactions. |
| HIGH | Skip/forage repetition had little world cost. | Physical region access for gathering, finite per-area pools, restoration, hunger/thirst/energy and time costs. | Repeating 22 mornings produced no free player loot; broader normal-play balance not fully tuned. |
| MEDIUM | Character labels/dialogues overlapped or were overwritten. | Repositioned nameplates, scene-attached bubbles, direct conversation restored after autonomous background tick. | Visual speech screenshot and bug-regression test. |
| MEDIUM | Hidden mechanics/dev intervention were inaccessible. | Cheat/debug menu, save export/import, state inspector, NPC inspection, currency/inventory interventions. | Functional controls verified; not all requested debug sliders implemented. |
| HIGH | Logs kept only a short recent-event list. | Persistent categorized `history` with filter/export in History tab, while preserving short rumor board. | Deep tests confirm dialogue and activity history; very-long-term browser quota risk remains. |

## Features: present vs partial vs missing

**Implemented and tested:** Eight distinct painted scenes, navigation graph/map, energy/time travel costs, local click-to-move, clickable objects, separate Mama's Den, room-based social encounters, family feeding, sibling-specific Pebble/Fern actions, social threat/persuade/accuse/blackmail/refuse, NPC hidden/reserved goods, NPC discovery (including rare tier), location-constrained NPC trades, daily phases, resource pools, item craft/build and food consumption, player-owned market fee policy, six rarity weights, vape cosmetic variants with harmful use animation, conversation bubbles, full event log, accessible hotbar, independent 35-day economy simulation, modern desktop/mobile layouts, cheats/debug menu.

**Partially implemented:** Physics/pathfinding through complex obstacles; detailed cub age-dependent animation; real NPC motivations beyond deterministic schedules/rules; dialogue memory/witness uncertainty; corruption/reputation propagation; all 58 items having uniquely drawn sprites or equally deep utility; actual venue placement, persistent furniture use by all cubs; nuanced parent hostility and hunger rescue beyond threshold rules; full input accessibility and keyboard focus handling; unbounded save history beyond browser localStorage storage quotas; exact restoration of arbitrary historical v2 saves.

**Not implemented:** Complete seamless 2D open world; free tile-by-tile building placement; production-grade sprite sheets for every direction/action; independently authored multi-day quests for every cub; server cloud saves, user accounts, multiplayer; path animation across every inter-zone boundary; real external website deployment.

## Actual tests and limitations

- **30/30 deterministic browser integration checks passed, 0 failed.** Detailed names in `test-results.json`; implementation in `test_deep_v3.py`.
- **35-day isolated economy stress run** (`stress_v3.py` and `stress-results.json`): 83 NPC-NPC trades, 38 independent NPC finds, 456 persisted history entries, 24 player inventory units, 73 combined NPC held/hidden units; zero negative quantities; zero JavaScript page errors.
- **This was NOT a 35-day human playtest of unmodified survival balance:** the stress harness replenished needs to healthy values to isolate the resource economy, and used debug teleportation. Consequently, do not treat this as evidence that long-term starvation and travel balance is excellent.
- **Loot generation** sampled 25,000 draws in each of four regions. Human Trail mythic effective rate was about 0.52% (131/25,000), consistent with one shared 0.5% roll; baseline rarity weights do not imply a mythic can drop in the woods or stream. See `drop-simulation.json`.
- **Screenshots** recorded at desktop 1440×900 and mobile 390×844; both reported no horizontal document overflow and no captured page errors. CSS/DOM inspected in Chromium with Playwright; browser automation used `set_content` because this test environment prohibited browser navigation to local/file URLs. Opening HTML normally in a user browser is the intended distribution model.
- **Save checks:** JSON serialization and save-slot writing verified with an in-page localStorage shim. Full real-browser migration with an actual old user save and hours-long sessions remains unverified.

## UI audit

**Before:** roughly half width world illustration at typical desktop, cramped side trading panel, large lower page with backpack far below main action, obscuring `YOU` label and an external overlay mistaken for game space.

**After:** world-first two-column layout, visible world map/scene selection, immediate beneath-world hotbar, optional full backpack and debug views, no externally sourced false game overlay; clear label over canopy. Trade panel retains previous design identity and item tooltips. Improvement is confirmed visually, not by formal user usability studies.

**Remaining polish:** right-side text still relatively small; in-world object labels can clutter den; more intentional context-sensitive sidebar states (rather than always trading on initial entry) would aid usability; mobile view is responsive but not optimized for extended touch play. The procedural bear characters look more bear-like but are still simple sprites.

## Design / economy conclusion

Previously, the dominant player strategy was to advance mornings and gather more objects without meaningful opportunity cost. Now finding a particular category requires going to its appropriate place, spending time and energy, drawing from a finite region stock, and accepting starvation risk, while NPCs trade and accumulate elsewhere. This gives *some* costs and meaningful choices. However, resource sinks, rare-object hoarding, and social incentives still need balancing through actual unscripted player testing; the economy is not yet fully solved.

## Prioritized next milestone

1. Draw a properly animated top-down traversal and movement AI across each scene, with collisions, scene exits and visible arrival/departure.
2. Replace fixed amenity anchors with an editor for individual world objects, along with functional seating/rest and storage interactions.
3. Introduce per-object identity, history and secret provenance; model sentimental value, witnessed lies and evidence accurately.
4. Add distinctive authored cub schedules, bedtime sibling scenes and consequences across multiple days.
5. Test an authentic multi-day playthrough with hunger/energy and no cheats; rebalance if starvation is frustrating or gathering too rewarding.
6. Improve custom pixel sprite sheets, readable labels, mobile input and accessible semantics.