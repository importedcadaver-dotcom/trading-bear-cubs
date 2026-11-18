# Runtime reliability cleanup

## Baseline

Default branch at inspection was `42a1ca32d8c1db99ac8badd5b05f80c3640bd108`. The working baseline was `cdd37bd3e0e6ef88d731c1ad9861c1d9de62286a` (open PR #27), which contains the player-tested work in #23 and #26. Testing the published branch alone would have missed those mechanics. Open gameplay issues #4, #6 and #17 and repository setup issue #7 remain tracked separately.

An isolated copy passed standalone parity, 9 Vitest tests, the Vite build, the state property suite, and the existing reliability, save, migration, travel/mobile, physical encounter, accessibility, ribbon mouse, smoke, appearance capture, and Woodland Day browser suites. Chromium/Chrome captured the title, creator and den. Baseline browser reproduction: pause in the den and click an empty spot. The cub moved from `[348,326]` to about `[319,338]` because the older listener handled clicks the active listener declined.

The package audit separately reported high-severity findings in development dependencies. The standalone game loads no npm packages. The repository's required audit remains enabled. At inspection the registry exposed Picomatch 4.0.7 as latest and the audit still flagged it; the automated suggestion proposed a breaking development-stack downgrade.

## Sources and ownership

The standalone generator lists every production input. A single HTML template and ten runtime files supply UI, wiring, and world behavior. Four inlined ES modules contain independently testable rules also imported directly by Vitest. Historical extracted snapshots and the playable v1–v5 archives are not inputs.

| Responsibility | Current owner | Classification and change |
| --- | --- | --- |
| Lifecycle and clock | Core creates, loads and saves state; family-care owns tick, phase and bedtime | **B.** Replaced four chained fresh/load overrides each with explicit initialization. Removed unreachable earlier tick and next-day bodies. Version-specific initializers still populate historical saves. |
| Load and migration | `save-migrations.mjs` validates and prepares a copy using injected item, location, actor, and migration rules; world scenes owns the local-storage transaction | **C.** Retains historical version upgrades, backups, and rollback. Boolean reservation flags from older live code convert to numeric reservations on import. |
| Input and travel | Frame input in `05-mouse-hitboxes.js`; scene graph and route travel in `03-world-scenes.js` | **A/B.** Deleted legacy canvas click and bubbling movement shortcut handlers, their draw-time movement queue, and hidden travel navigation. Player and NPC boundaries use `collision-rules.mjs`. One travel entry runs movement and arrival effects in order. Arrivals now place the cub below the stall collider. Key focus/Tab trapping, panel cancellation, and touch pointer capture still have separate responsibilities. |
| NPC movement and encounter ownership | `07-actor-travel.js` advances routes/amenities and idle motion; `09-physical-encounters.js` controls approach, settlement, and cancellation | **A/B.** Removed superseded instant social and NPC trade implementations, including the old scheduler that reassigned locations. A single world update schedules actors, evaluates fictional dependencies, then evaluates social events. Draw calls no longer advance idle NPCs. |
| Barter, currency, construction | Policy, capacity and individual valuations remain in the scene/family rules; `inventory-rules.mjs` applies stock changes | **B/C.** Standard, local, high-pressure, and NPC barter use one reciprocal stock-transfer rule. Market access, willingness, the ribbon mouse and honey rules retain their existing distinct effects. Construction and trader-specific overlays remain active. |
| Dialogue, Mama, items and hazards | Scene interaction and family rules, with explicit item entry and current day/river controllers | **C/E.** The scene-specific actions, witnessing and needs consequences still have callers. Some inherited action/death hooks still need parity evidence before consolidation. |
| Rendering and UI | One world draw and one interface render, plus ordered drawing/UI passes | **A/B.** Removed the replaced v4 title and creator, three hidden mounts (old navigation, top controls, and tutorial subbar), inventory grid/action pane, vitals, rumor/action panels, and footer. The old backpack implementation is gone. Hotbar opens the current backpack directly and selects the item. One modal lifecycle restores focus and removes talk styling, and one notice element replaces the two toast updates. |
| Settings and tools | Navigation-facing Settings/save controls, the header gear, and developer tools | **C/E.** Header gear retains manual pause/reset controls. Developer menu, trade/craft/relationship tabs, and keyboard focus manager remain reachable. Keep these during UI cleanup until migration has direct coverage. |
| Snapshots and archives | `versions/`, existing archive bundles, and the extraction workflow | **D.** Preserved. The extraction script now reads archived v5 HTML rather than slicing the current game into historical-looking files. |

## Metrics

Measured UTF-8 bytes with LF line endings over production template/layers/shared modules and generated HTML. Reassignments count source occurrences of `name = function (...)`, not arbitrary variable writes. The four entries consolidated by #27 were already at zero and remain at zero.

| Measure | Baseline | Cleanup |
| --- | ---: | ---: |
| Maintained production inputs | 379,643 B | 335,191 B |
| Generated offline game | 379,953 B | 335,645 B |
| Function-expression assignments | 89 | 52 |
| Names assigned to a function expression multiple times | 19 | 9 |
| Canvas click handlers | 2 | 1 |

Static parity checks enforce one declaration for the audited entry points and reject reintroduced retired mounts. They leave unrelated assignments alone.

## Known remaining debt

Dialogue, item sub-actions, developer tools and later family consequences still include intentional extensions in the existing shared closure. The refactor does not claim complete subsystem isolation. Four economy call sites now share settlement, but pricing and family rule layers still require separate coverage. Full human mobile usability, exhaustive menus and event combinations, sustained real-device play, and unused asset removal beyond the documented source paths remain unverified.

| Remaining repeated entry | Live behavior requiring parity checks for further consolidation |
| --- | --- |
| `buildCraft` | Recipe affordability, post-only placement, resource calculation, and ghost placement each affect allowed purchases. |
| `checkMother` | Legacy single stash, later location-aware stashes, and confiscation/concern affect different saves and circumstances. |
| `devAction`, `showDev` | Earlier commands remain reachable through the current developer menu and save backup controls. |
| `drawItem` | Original sprites, added catalog objects, and contraband art serve different item IDs. |
| `forageZone`, `interactObject` | Gathering, object proximity, tutorial progress and hazard actions call different paths. |
| `selectNPC`, `v5OpenConversation` | Initial selection, the tutorial objective, story-specific actions, and the current modal affect player progression. |
