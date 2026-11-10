# AI / human contributor rules

**Repository:** importedcadaver-dotcom/trading-bear-cubs. This repository is dedicated solely to The Little Trading Post.

- The deployed root `index.html` is **generated** from `src/runtime/standalone-template.html`, eight files under `src/runtime/layers/`, and shared `src/lib/barter-rules.mjs`. Edit those maintained source files, run `python scripts/build_standalone.py`, commit both source and generated `index.html`, and verify `--check`. Never patch root generated HTML alone.
- Main branch hosts the current published game. Use **one feature branch per agent/task**, open a PR, run CI, and do not push untested changes directly to main.
- Root `index.html` is the offline-safe production game. `versions/v1–v5` preserve old builds; never silently overwrite the historical versions.
- Preserve approved family canon: the player, Fern and Pebble are 11-month-old biological littermates; separate romantic/gender policy debates from user-requested game settings.
- The user's documented decisions in `docs/PROJECT_HISTORY.md` and versioned requests outrank speculative AI suggestions. Tutorial duration remains undecided.
- Preserve the fictional drug encyclopedia's Edition 1.0 as frozen lore. Existing fictional cub use/trading is a game mechanic with serious simulation consequences; do not write real-world preparation, dosing or trafficking instructions.
- Essential invariants: no negative inventory, item transfers conserve stock, no rewards for null barter, actors occupy one location, remote interaction requires real proximity, no new origin-sensitive save breakage.
- **P0 tests:** `python tests/reliability_v51.py`. **Save integrity:** `python tests/security_v512.py`. **Real archived v1–v5 compatibility:** `python tests/historical_save_migrations_v512.py`. **Economy:** `npm run test`. **Property tests:** `pytest -q tests/test_state_invariants_v51.py`.
- Do not state that passing unit tests proves the game is fun, that browser storage migrations are proven, or that every requested feature has been implemented.
- For large work, use PR reviews, keep test artifacts, document limitations, and update `CHANGELOG.md` and `VERSION` on a real release.
