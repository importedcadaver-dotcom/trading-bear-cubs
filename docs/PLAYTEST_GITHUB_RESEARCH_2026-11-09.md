# V5 Independent Playtest and GitHub/JS/Python Opportunity Audit
*2026-11-09; verified same preserved v5 HTML in headless Chromium, 1440×900 and 390×844*

## Scope and honesty
The published Pages URL was not reachable from this execution environment (network/local server navigation blocked). I injected the preserved game HTML directly into Chromium. Thus these are genuine UI/JavaScript and in-memory simulation tests but **not** a network or persistent-origin test of the live Pages deployment. The historical 59-check release QA is separate. Do not combine totals into one claimed exhaustive pass.

### What I directly exercised
- Full-screen title → creator → duplicate-NPC-name rejection → New Game.
- Starts in Mama's Den: 3 berries, 1 nice stick, Fern and Pebble.
- WASD key held continuously changes the cub's position.
- Nearby Fern conversation, Escape to close, backpack, map, world travel, build panel, sleep location restrictions, fishing modal, Mama conversation, panda shop at Human Trail via deterministic developer trigger.
- 390×844 mobile screen has no **horizontal** overflow, though the scene and nameplates are too small.
- Browser did not produce JavaScript page exceptions in these cases.

### Critical reproducible defects
1. **P0 [Issue #1](https://github.com/importedcadaver-dotcom/trading-bear-cubs/issues/1): canvas mouse coordinates + collision.** The 768×434 intrinsic canvas displayed at 1392×520 with `object-fit:contain` creates horizontal letterboxing. Clicking Mama at her visible location converted `worldX=563` to roughly `worldX=502`. The cub walked toward the wrong target and stalled at approximately [398,288] against the den nest collider. Blocks the first tutorial interaction by mouse.
2. **P0 [Issue #2](https://github.com/importedcadaver-dotcom/trading-bear-cubs/issues/2): identical berry exchange farms resources.** In live UI, Fern accepted Berry-for-Berry swaps that left inventory unchanged but raised successful trades from 0→4, reputation 0→4, friendship 0→4. Can trivialize the entire commerce/progression loop; UI result text remained stale, and Fern later became unavailable.
3. **P1 Onboarding and HUD:** At 1440×900 the needs panel begins below the fold. The tutorial asks to talk to Mama while the closest interaction prompt highlights Fern; important actions are harder to discover than global toolbar actions.
4. **P1 Mobile usability:** No horizontal overflow is not enough; 768 logical pixel world shown at 390 physical CSS pixels means the bear art/nameplates become too tiny. Implement camera/zoom and tap-target sizing instead of squeezing whole scene.
5. **P1 save portability:** Existing game calls `localStorage`, whose data is origin-scoped. Downloaded `file://` play sessions will not automatically share data with the `https://importedcadaver-dotcom.github.io` published site. Provide explicit export/import saves and real-origin reload/migration tests before claiming continuity. MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API and https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy .
6. **P2 architectural risk:** V1–V5 legacy functions override each other; there are multiple animation/click paths. Lack of deterministic simulation/model separation makes fixes fragile. The active `page.set_content` tests cannot prove save durability, cross-browser behavior or world-interaction ergonomics.

**A mistaken test selector** flagged the map as unopenable, but the screenshot and visible map buttons proved it actually opened. **Browser storage** returned `SecurityError` only because the sandbox page had an opaque origin; not evidence that storage on actual GitHub Pages is broken.

## GitHub capabilities best aligned with this game

| Priority | GitHub capability | Value and exact next action |
|---|---|---|
| P0 | **Actions + Playwright traces** | Existing smoke test validates startup only. Add mouse hitbox, real UI barter, tutorial completion, real save/load and screenshot comparison; upload failure screenshots/traces as workflow artifacts. Do not deploy before checks succeed. https://playwright.dev/docs/trace-viewer |
| P0 | **Issues and Projects** | Use Issues for verified bugs and an owner Project with views Bug / UX / Gameplay / Deferred; organize by P0–P3 and versions; link QA evidence. Issues #1 and #2 have been opened. https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects |
| P1 | **Releases and version tags** | Stop treating mutable main ZIP and `archives/` as permanent release identifiers; publish versioned `v5.1` releases with reproducible standalone ZIP, checksums, changelog and known bugs. https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases |
| P1 | **Branch protection / PR checks** | Use branches and pull requests when an AI contributor changes core economy or world code. Make passing tests a merge condition; avoid multiple agents committing directly to main. |
| P1 | **Code scanning / Dependabot** | Free features on public repositories can catch unsafe JS patterns or vulnerable future npm dependencies. Enable at Settings → Security & analysis. https://docs.github.com/en/code-security/concepts/code-scanning/code-scanning |
| P2 | **Codespaces** | Optional cloud VS Code setup for collaborators; personal accounts include limited monthly free compute/storage. No need for routine solo playtesting or deployment. https://docs.github.com/en/codespaces/troubleshooting/troubleshooting-included-usage |
| P2 | **GitHub Discussions** | Optional for design ballots or feature ideas if the private game becomes a collaborative project; use Issues for concrete bugs instead. |

**Cost:** GitHub Pages can host this public-repository static HTML/JS game. Standard GitHub-hosted Actions runners are free for public repositories; larger runners and storage usage have separate constraints, so stick to standard runners and short-lived test artifacts. https://docs.github.com/en/billing/concepts/product-billing/github-actions

## JavaScript upgrades, with sequencing
1. **First fix input geometry and movement using existing Canvas 2D**; do not change engines just to avoid fixing the current bug.
2. **Vite + modular ES modules** (and optionally TypeScript) for development and automatic static production build. Vite can target GitHub Pages using base `/trading-bear-cubs/`. https://vite.dev/guide/
3. **Vitest** for pure economy/NPC state and invariants; **Playwright** for real browser UI, input and screenshot regressions. https://vitest.dev/guide/
4. **Tiled** maps exported as JSON plus a collision/interaction layer if scene painting is expanded. https://docs.mapeditor.org/en/stable/manual/export/
5. **Phaser** is an option if rebuilding most movement, sprites, collisions and cameras as a true 2D engine; **PixiJS** mainly helps if retaining custom simulation but replacing the low-level renderer. Both are sizeable migrations, not first fixes. https://www.phaser.io/oss/docs/ and https://pixijs.com/
6. **IndexedDB + explicit save export/import** for long item provenance/event logs and migration from `localStorage`, with automatic backups before schema change.

## Python tooling
- **pytest + Hypothesis** property/state-machine testing on an extracted deterministic game-simulation model: trade, craft, store, hide, sleep, NPC transfer. Invariants: quantity never negative, total items conserved in trades, no progression for null trades, no cub in two places. https://hypothesis.readthedocs.io/en/latest/stateful.html
- **Python seeded balance runner** for 500–10,000 in-game days with charts for wealth distributions, rare-item acquisition, trader honey conservation, famine frequency, friendship saturation, and exploitation rates. Test both ordinary play and adversarial policies.
- **Ruff** to keep Python test/build scripts tidy. None of these require putting Python on the GitHub Pages client; static Pages cannot run a persistent Python game backend.

## Immediate recommended sequence
1. Fix and regression-test Issue #1 (click map + obstacle pathing).
2. Fix and regression-test Issue #2 (null transactions and stale trade results).
3. Make essential needs readable without scrolling, add tutorial-target highlighting and readable mobile zoom.
4. Gate Pages deployment on strong browser/UI tests, preserving failure traces as Actions artifacts.
5. Split economy/inventory/NPC simulation into testable modules while keeping the existing offline build and saved games.
