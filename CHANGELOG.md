# Changelog

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
