# Release and GitHub feature status

Current production: GitHub Pages on `main`. v5.1 work happens on a separate feature branch and enters main only after PR CI.

## Automated
- Playwright gameplay tests (visible mouse hits, trading, save origin, mobile) with trace screenshots.
- Vitest and Python property-based checks.
- GitHub Pages **verify → deploy** dependency: failed tests prevent publishing.
- GitHub Release on merging a commit that changes `VERSION`, with downloadable ZIP and SHA256 checksum.
- Dependabot weekly npm and GitHub Actions dependency update PRs.
- CodeQL JS/Python security scans on public main/PRs/weekly.

## Owner settings that still need review
- **Branch ruleset / protection:** Settings → Rules → Rulesets; require PRs and the v5.1 gameplay CI check. The GitHub app connection lacks a repository-administration action to set rulesets.
- **GitHub Projects:** Create project in repository/owner UI, link Issues #1 and #2 and other development tasks; connector lacks a Project-creation action.
- **GitHub security dashboard:** confirm CodeQL and Dependabot are enabled for the public repository after the workflows run.
- **Codespaces:** optional and can consume limited free usage; no need to use for simply playing.
