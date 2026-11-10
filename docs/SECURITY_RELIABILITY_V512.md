# The Little Trading Post v5.1.2 — Security and Code Quality

## Evidenced results
- The previous `npm install` CI output reported **four vulnerabilities** (2 critical, 1 high, 1 moderate), without listing dependency-level advisories in the console output.
- With **Vite 8.3.6** and **Vitest 5.1.0**, fresh `npm audit --audit-level=high` and `npm ci` in Actions reported **zero vulnerabilities**. This concerns the development toolchain; it does not prove that every browser code path is secure.
- The dependency graph is now committed in `package-lock.json`, and CI uses `npm ci`. It fails closed on high/critical npm advisories.

## Actual code fixes
1. **Import validation.** Accepts JSON v1-based save objects only when the six canonical cub IDs, inventories, numbers and world locations satisfy invariants. Unknown item IDs, negative quantities, malformed positions, invalid needs and missing cubs are rejected.
2. **Import recovery.** A pre-import backup is saved under `little_trading_post_v1_2026_backup_before_import`. The original game state remains intact if validation or persistence fails. A successful import reinitializes relevant fields through v2–v5 migration stages; historically exact v1–v4 binary fixture validation remains to be done.
3. **Save failure visibility.** Failed localStorage writes now produce a visible warning. Export your save through developer tools if browser storage is unavailable.
4. **HTML rendering.** Imported NPC names and quotes are restored to canonical sources. Rival-market dialogue escapes cub names instead of interpolating unchecked strings.
5. **Special trading invariant.** Dependence-related sentimental deals cannot bypass local proximity or inventory capacity, and are subject to the same ownership checks before any transfer.

## Browser tests
- `python tests/security_v512.py` uses a real HTTP origin and performs successful import, rejected invalid imports, a staged legacy-shaped save import, a full-backpack desperate-deal attempt, and simulated blocked storage.
- `python tests/reliability_v51.py` covers the original clicking and null-swap regression.
- `pytest -q tests/test_state_invariants_v51.py` exercises randomized game states through the real browser.
- `npm run test` covers pure inventory/economy module invariants.
- All must pass before Pages deployment; CI captures diagnostics as artifacts.

## Not yet done
- The remaining game logic is still predominantly in one HTML file; extracting rendering, state and economy modules safely will require a separate migration and action-level regression suite. **Do not mark modularization complete.**
- Existing source still includes some inherited v1-v4 text/UI routes; a future dead-code removal must be benchmarked and playtested before deletions.
- Real-user historical save files have not been supplied as migration fixtures.
- Third-party CodeRabbit warnings on PR descriptions are procedural; this update improves the PR template, but does not guarantee that automated Dependabot descriptions will match it.
- Dependabot PRs #8–#12 may need rebasing/closing once their upgrades are included.
