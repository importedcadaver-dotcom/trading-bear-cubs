# The Little Trading Post v5.1.2 — Security and Code Quality

## Evidenced results
- The previous `npm install` CI output reported **four vulnerabilities** (2 critical, 1 high, 1 moderate), without listing dependency-level advisories in the console output.\n- CodeQL issued three clear-text storage comments for local fictional cub data (`knownSecrets` and avatar `gender`). This is deliberate offline game state, not service credentials. The comments are not a reason to encrypt saves or block the game; review future real-account/PII additions separately.
- With **Vite 8.3.6** and **Vitest 5.1.0**, fresh `npm audit --audit-level=high` and `npm ci` in Actions reported **zero vulnerabilities**. This concerns the development toolchain; it does not prove that every browser code path is secure.
- The dependency graph is now committed in `package-lock.json`, and CI uses `npm ci`. It fails closed on high/critical npm advisories.

## Actual code fixes
1. **Import validation.** Accepts JSON v1-based save objects only when the six canonical cub IDs, inventories, numbers and world locations satisfy invariants. Unknown item IDs, negative quantities, malformed positions, invalid needs and missing cubs are rejected.
2. **Import recovery.** A pre-import backup is saved under `little_trading_post_v1_2026_backup_before_import`. The original game state remains intact if validation or persistence fails. A successful import reinitializes relevant fields through v2–v5 migration stages; real browser-generated saves from the v1–v5 archived game versions are independently checked before release.
3. **Save failure visibility.** Failed localStorage writes now produce a visible warning. Export your save through developer tools if browser storage is unavailable.
4. **HTML rendering.** Imported NPC names and quotes are restored to canonical sources. Rival-market dialogue escapes cub names instead of interpolating unchecked strings.
5. **Special trading invariant.** Dependence-related sentimental deals cannot bypass local proximity or inventory capacity, and are subject to the same ownership checks before any transfer.

## Browser tests
- `python tests/security_v512.py` uses a real HTTP origin and performs successful import, rejected invalid imports, a staged legacy-shaped save import, a full-backpack desperate-deal attempt, backup restoration, and simulated blocked storage.\n- `python tests/historical_save_migrations_v512.py` creates genuine saves using each archived v1–v5 version and confirms successful import into v5.1.2 without losing inventory. The GitHub Actions run passed all five.
- `python tests/reliability_v51.py` covers the original clicking and null-swap regression.
- `pytest -q tests/test_state_invariants_v51.py` exercises randomized game states through the real browser.
- `npm run test` covers pure inventory/economy module invariants.
- All must pass before Pages deployment; CI captures diagnostics as artifacts.

## Not yet done
- The remaining game logic is still predominantly in one HTML file; extracting rendering, state and economy modules safely will require a separate migration and action-level regression suite. **Do not mark modularization complete.**
- Existing source still includes some inherited v1-v4 text/UI routes; a future dead-code removal must be benchmarked and playtested before deletions.
- Automated migration tests now generate and import actual browser-saved game state from archived v1, v2, v3, v4 and v5 HTML builds. Long-running real-user save files (including corrupted or unusually complex ones) have not been supplied, so their migrations are not fully proven.
- Third-party CodeRabbit warnings on PR descriptions are procedural; this update improves the PR template, but does not guarantee that automated Dependabot descriptions will match it.
- Dependabot PRs #8–#12 may need rebasing/closing once their upgrades are included.
