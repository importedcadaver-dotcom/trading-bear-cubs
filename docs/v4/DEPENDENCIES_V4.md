# v4 System Dependencies, Invariants and Known Weak Links

| Source | Consequence | Status | Test and caveat |
|---|---|---|---|
| Character creator | Avatar identity and in-world coat/accessory | PARTIAL | State saved, body coat changes; eyes/marking variants remain shallow |
| Movement | Position, interaction range, collision and animation | LIVE | Held-key test; simple collision boxes only |
| Context objects | Item changes, world feedback, tutorial advance | PARTIAL | Some old actions lack a bespoke sprite animation |
| Tutorial | Mama → food → sibling → woods → forage → post → bag → trade | LIVE | Finite progression and objective strip; not every step re-run by a human tester |
| Nearby cub | Gift/play/selected trade | PARTIAL | Remote gifting blocked; some legacy cub-life buttons may lack distance gates |
| Item placement | Persistent world pin + inventory subtraction | LIVE | Birdhouse placement regression tested; stool/furniture placement still fixed |
| Unique items | Contextual play/social/clue flags | PARTIAL | 26 named interactions/roles; some are still text-only |
| Human Trail location | Moving road danger + rare encounter | LIVE | Collision injury/death route browser-tested |
| River position | Current, energy, fatigue | LIVE | Swimming position and energy browser-tested |
| Fishing | Timing, catch probability, skill, food inventory | LIVE | Meter and state changes tested; visually simple mini-game |
| Mama lesson | Travel together, skill, borrowed rod and memory | LIVE | Route/test verified; Mama is not continuously path-animated |
| Orphan | Rescue → carried → placed under Mama's care | LIVE | Browser round-trip tested; no long-term baby-growth simulation |
| Criminal trader | Location, time, limited money/stock and suspicion | LIVE | Transaction checked; no sophisticated law enforcement |
| Bear Drugs lore | Item descriptions, legality, adverse consequences | PARTIAL | Five families recognized; exact new items game-local, not canon additions |
| Save state | v1/v2/v3 migrated to v4 fields | PARTIAL | Code path supported, real browser-origin persistence not fully verified |
| Independent NPC social economy | Inventory, market fees, caches, sentiments | INHERITED | v3 tests had coverage; v4 not exhaustive for every prior path |

## Core invariants to preserve

1. Starting player bag is exactly three berries and one very nice stick; tutorial food must be acquired separately.
2. NPCs exist in exactly one named location; conversations and player-facing transfers cannot occur across locations without explicit travel.
3. Hidden, reserved, carried, displayed and stored goods must not be sold from the wrong storage scope or duplicated.
4. A placed object consumes its input when placement is intended to transfer ownership into the world.
5. Trader sales require positive player quantity and adult trader funds; buys require limited stock and sufficient money.
6. Travel has meaningful time/energy costs unless explicitly using developer controls.
7. Story-only newborn is a unique NPC, not a stackable inventory item, and can occur only once per save.
8. Road collision and exhaustion danger must operate without a forced lethal result until injury/health rules require it.
9. Human-trail rare vape variants remain tied to a shared 0.5% mythic rarity roll; trader-specific stock does not silently change foraging odds.
10. Frozen Bear Drugs Edition 1.0 remains unchanged; game-specific products are labeled as additions, not canon.

## High-priority missing cross-links

NPC travel should show departure and arrival and allow interception; new furniture should be usable by autonomous cubs; unique item instances should remember provenance, theft, promises and sentimental value; care/stress and witness knowledge should influence relationship choices; law enforcement and adult supervision should respond causally to criminal trader encounters; save history should move to a larger structured store for long-running play.