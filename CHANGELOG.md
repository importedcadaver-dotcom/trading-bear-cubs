# Changelog

## 5.2.2 — Tutorial Reliability & Keyboard Accessibility
- Tutorial objectives remain eight steps; clearer step-by-step guidance is visible without adding progression gates.
- Pebble is kept in Mama's Den when needed by the opening sibling objective; Fern returns to the post for the first required trade.
- Canvas now has an accessible scene description and keyboard control instructions.
- Modal dialogues move keyboard focus into the dialog, loop Tab navigation through active controls, and restore focus when dismissed.
- Reduced-motion settings skip decorative item-flight animations rather than displaying unnecessary flashes.
- Added Playwright checks for tutorial schedule requirements, modal focus, keyboard dismissal, 390/430px screens and minimum 44px touch targets.

**Not complete:** Human-uninformed first-ten-minute usability study, full screen-reader navigation review, alternative input devices and thorough NPC collision-grid pathing. Issue #6 remains open for these acceptance tests.


## 5.2.1 — Offline-Safe Source Modularization
- Extracted historically merged game engine into eight maintained JavaScript source layers, plus an HTML template.
- Added deterministic dependency-free Python compiler producing byte-complete standalone `index.html`; CI and releases reject stale builds.
- Unified the live game’s no-op barter guard with the authoritative `src/lib/barter-rules.mjs` function already tested by Vitest.
- Added 50 repeat UI swaps to regression-test the closed reputation exploit.
- Marked the generated HTML as derived source for clearer PR reviews, while preserving in-browser and offline runtime behavior.
- No paid tools or external runtime dependencies.

**Remaining:** The layers still share one legacy closure; not all rendering, NPC behavior, input and save logic are independent modules yet. Issue #17 remains open for deeper extraction and dead-code removal once comprehensive parity tests are complete.


## 5.2.0 — Woodland Travel & Practical Controls
- Cub NPC schedules begin visible departures instead of teleporting instantly to distant scenes. Route progress is saved and arrival happens after real travel time.
- Physical amenity approach and use intentions for available benches, water stations, nest spaces, play areas and workstations. Item/activity visuals follow the on-screen cub.
- Cross-scene autonomous trades and same-scene social interactions are restricted when participants are in transit.
- Added mobile touch movement pad, map and interact controls (minimum 48px), and reduced-motion item transfers.
- Added a normal save export/import interface under Settings with file download, import, and pre-import backup restore.
- Added browser regression of scene departures, arrivals, saved NPC travel states, repeated schedule changes, mobile touch and Settings save transfer.
- Retained standalone HTML and save compatibility; no paid third-party dependencies.

**Remaining:** The AI still has limited goal-driven activity selection, collision-aware NPC wayfinding is not complete, true human onboarding/accessibility testing is pending, and scene transitions are simplified. Issues #4 and #6 remain open until their full acceptance criteria are met.


## 5.1.2 — Security, Saves & Economy Integrity
- Updated pinned Vite/Vitest dependencies and committed a lockfile; npm audit reports zero known vulnerabilities in the tested lockfile.
- Updated supported GitHub Actions runners/actions, using locked npm ci and a deployment-blocking audit.
- Defensive save import with inventory/identity validation, old-version field migration and a pre-import browser backup; rejected saves leave current progress intact.
- Player-visible autosave failures when storage is blocked/full; explicitly supported JSON export/import on the existing developer menu.
- Escaped HTML in rival-market family dialogue; canonical NPC identity restored during imported-save validation.
- Prevented special high-pressure sentimental trades from exceeding the player's inventory capacity or bypassing in-person trading.
- New browser tests for malformed saves, migrations, security boundaries, full-bag trades and save failures.
- No new paid dependencies; standalone offline HTML remains supported.

**Remaining:** long-lived real-user save fixtures beyond newly verified archived v1–v5 saves, multi-hour gameplay stress tests, complete engine modularization, continuous NPC navigation and full accessibility pass.


## 5.1.1 — Patch-release metadata
- Correct the in-game version label to match the GitHub release and website. Gameplay rules are unchanged from 5.1.0.

## 5.1.0 — Gameplay Reliability
- Fixed canvas pointer-to-world conversion with object-fit letterboxing; implemented obstacle-aware click-to-walk around Mama's Den.
- Closed free-reputation exploit from identical-item barter and clarified completed trade messages.
- Added visible trade item flights, social and item-use feedback, Mama's first tutorial target highlight.
- Compact always-visible hunger/water/energy/comfort/health display, mobile player-following camera.
- GitHub Actions real browser regression, Vitest pure economy tests, Python Hypothesis invariants, and successful test gate before Pages deployment.
- Optional Vite dev server, release automation, Dependabot/CodeQL scaffolding, and contributor guidance.

**Still in progress:** fully continuous NPC map traversal, true item-specific animation, robust multi-day social stories, polished mobile touch controls, old save migration, and human usability playtesting.
