# v5.1 reliability and tool architecture

The playable game remains **one offline HTML file** and continues to be served by GitHub Pages.

### Development tools added
- **Vite:** `npm install && npm run dev` for hot reload during development, `npm run build` for `dist/` static output. GitHub Pages still publishes the tested standalone HTML to avoid breaking offline play.
- **Vitest:** `npm run test` for pure economy/inventory invariants in `src/lib/barter-rules.mjs`.
- **Playwright:** `python tests/reliability_v51.py` serves the real site origin, clicks visible sprites and exercises trading, saved storage and mobile UI. CI captures screenshots and traces.
- **Python:** existing tests, plus property-based browser stress tests that will be added for inventory/day/actor location invariants.

### Migration caveat
The live app still contains a monolithic IIFE with inherited v1–v5 overrides. Pure modules are a **staged extraction**, and Vitest unit tests do **not yet directly execute the inlined game runtime**. Only the browser regression checks the production trade function. Avoid claiming a complete modular rewrite.

### Important constraints
- No paid SDK, backend, hosted database, or required runtime packages.
- For multi-agent collaboration, develop on topic branches, submit pull requests, preserve older save compatibility and require a passing browser test before public Pages deployment.
- Canvas coordinate mapping must include the drawn image's letterbox offsets.
- Market progress must not be awarded for item-for-identical-item exchange.
- Prefer visible effects, physical proximity checks and a readable small-screen camera.
