# THE LITTLE TRADING POST v5 — Living World & Playfeel

A self-contained offline browser game. Open `index.html` using Chrome or Edge. Start with New Game to create an eleven-month-old brown bear cub. The original first-morning tutorial, gathering, personally valued trades, shop, six autonomous cubs, Mama's Den, world map, survival and family systems are preserved.

## Getting started

1. Open `index.html`.
2. Select New Game. Choose a unique name, male/female, coat and temperament (including Evil).
3. Learn movement with WASD/arrows and approach Mama. Press **E** when an in-world interaction prompt appears. Click on ground to move toward it.
4. Use the dock for **Talk/Trade**, **Bag**, **Build**, **Map**, **Journal**, **Sleep**, and **Menu**. Build requires going to your trading post.
5. Use the map to visit the river, rival market or Human Trail. The panda appears on certain days, subject to real proximity. Sleeping is at Mama's Den.
6. Open developer/debug controls in the existing project UI to force rare situations for testing.

**Autosaving and security:** Saves are kept by your browser. The exact storage behavior for opening a standalone `file://` HTML page depends on browser policy. The v5 migration logic is present, but prior-save real-browser compatibility was not comprehensively verified. Keep a backup of your v4 ZIP and browser save export before replacing your usual file.

## This release

World-first HUD, fullscreen title, simpler creator, contextual interaction, trade explanations, physical build placement, sleep/curfew, panda seller and finite honey, playable cub substance-use and NPC dependence, sentimental trade aftermath, original newborn art, road death, and actual screenshots and test evidence.

The NPC/world simulation remains a work in progress. See `AUDIT_V5.md` and `ROADMAP_V5.md` before assuming every proposed v5 feature has been completed.

## Files

- `index.html` — executable complete game, includes integrated v5 JavaScript.
- `v5-extension.js` — separately inspectable copy of v5 enhancement code (not needed to run `index.html`).
- `v4-original.zip` — exact uploaded v4 source archive backup.
- `AUDIT_V5.md`, `TEST_REPORT_V5.md`, `DEPENDENCIES_V5.md`, `DRUG_ECONOMY_V5.md`, `REQUIREMENTS_V5.md`, `ROADMAP_V5.md`, `RESEARCH_V5.md` — release notes and evidence.
- `test_*.py`, `test-*-v5.json` — test scripts/results.
- `v5-*.png` — actual Chromium screenshots, not generated promotional images.

> This preserved historical v5 README refers to the original packaged artifact. In this GitHub repository, the runnable file is the root `index.html`, and reconstructed downloads/screenshots are generated under `archives/` and `assets/screenshots/`.
