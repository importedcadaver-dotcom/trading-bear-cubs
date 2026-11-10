# Release and GitHub feature status

Current production: GitHub Pages on `main`. v5.1 work happens on a separate feature branch and enters main only after PR CI.

## Automated
- Playwright gameplay tests (visible mouse hits, trading, save origin, mobile) with trace screenshots.
- Vitest and Python property-based checks.
- GitHub Pages **verify → deploy** dependency: failed tests prevent publishing.
- GitHub Release on merging a commit that changes `VERSION`, with permanent downloadable ZIP and SHA256 checksum.
- Archive and screenshot builds run on updates to the game or build scripts. Their validated ZIPs, generated screenshots and extracted development layers are uploaded as **GitHub Actions run artifacts** (30-day retention). They never commit directly to `main`. Open **Actions → Build downloadable archives and screenshots → the run → Artifacts** to download them. Existing files already committed under `archives/` and `assets/screenshots/` remain as historical snapshots, not automatically updated.
- Dependabot weekly npm and GitHub Actions dependency update PRs.
- CodeQL JS/Python security scans on public main/PRs/weekly.

## Owner settings that still need review
- **Branch ruleset / protection:** The owner enabled the active `Protect Main — Require Game Tests` ruleset for `main`, requiring PRs and the `gameplay` check. Generated files now upload as Actions artifacts, so protection is not bypassed or undermined.
- **GitHub Projects:** Create project in repository/owner UI, link Issues #1 and #2 and other development tasks; connector lacks a Project-creation action.
- **GitHub security dashboard:** confirm CodeQL and Dependabot are enabled for the public repository after the workflows run.
- **Codespaces:** optional and can consume limited free usage; no need to use for simply playing.
