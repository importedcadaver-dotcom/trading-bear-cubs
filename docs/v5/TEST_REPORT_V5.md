# v5 QA report — reproduced browser assertions

## Method

Tests launched real headless Chromium with Playwright (`/usr/bin/chromium`), loaded the actual v5 standalone HTML as an embedded document (`page.set_content(html)`), and manipulated the UI, exposed game-debug controls and simulation state. Browser-origin navigation was blocked in the test environment; as a result **ordinary local-file save restoration across browser reloads is NOT verified**. Tests are executable in this ZIP.

| Suite | Assertions | Result |
|---|---:|---|
| `test_v5.py` — menu, creator, gameplay, drug use, honey, orphan, context UI, construction, responsive basics | 41 | **PASS 41/41** |
| `test_deep_v5.py` — proximate barter, substances, Mama's confiscation/help, panda economics, lethal road traffic | 13 | **PASS 13/13** |
| `test_trade_v5.py` — actual UI trade of cherished toy by dependent NPC; provenance, relationship, non-duplication | 5 | **PASS 5/5** |
| **Total** | **59** | **59 passing checks**, zero captured page errors in the executed scenarios |

### Additional visual QA

Desktop captures at 1440×900 and mobile captures at 390×844 recorded with `capture_v5.py`. The last known mobile pass reported **zero horizontal overflow**. The title menu, creator, den, clearing, barter, panda, newborn, and mobile views have actual PNG screenshots. We moved the mobile toast from the top of the gameplay scene to the bottom after screenshot review; the affected basic suite was rerun PASS.

### Adversarial checks directly exercised

- Trade between a real drug item and an NPC's actual toy mouse under high nicotine dependence; the toy's original ownership was retained.
- No duplication of drug stock or cherished items under the tested trade/purchase transitions.
- Mama's confiscation removes actual stock into her cache; help requires proximity and has a once-per-day limit.
- Remote panda purchase rejected; local purchase conserves honey between buyer and merchant and updates stock.
- Real animated car collision sets death cause to `road` after one impact.
- Build placement requires valid ground and real material costs; player and NPC collisions block overlap.
- Title/creator and responsive frame can render without recorded JavaScript page exceptions.

### Not tested or not proven

Uninformed human-first-run experience, multi-hour gameplay fun, every controller/keyboard event, every dialog branch, complete older-save browser migration, default long-term survival balance, all NPC event rarity probabilities, general pathfinding, accessibility audit, and real-life medical accuracy (this is fiction). Do not interpret passing targeted assertions as evidence of these areas.