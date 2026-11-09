# The Little Trading Post — Baseline Audit and v2 Findings

**Scope:** Inspection of the uploaded 62 KB standalone HTML, independent rule review, scripted Chromium UI interactions, 21 deterministic state/integration checks, 14 smoke checks, and a 25-day game-state stress run. The automated tests are not a substitute for a human exploratory playtest.

## Findings and changes

| Severity | Baseline finding / evidence | v2 repair or status |
|---|---|---|
| **Critical** | `newDay()` reset the forage counter with no needs, costs or meaningful opportunity tradeoffs; repeatedly pressing Next Morning produced free access to new goods. | **Reworked.** Four phases, limited actions, hunger/water/energy, four separately depleted foraging areas, gradual replenishment, gathering cost, market saturation, rescue/closure if a neglected cub becomes unwell. A 70-wait stress test produced **no goods**. |
| **High** | Twelve baseline items; berries/sticks merely served as trade tokens; 'fish' meant a wooden carving without clear distinction from real fish. | **Implemented core.** 55 identities including four differently named fish/stone objects; real eat/drink/craft/store/hide/display/play actions, gathered foods, custom fish icon shapes. Other objects still need deeper individual use. |
| **High** | Original cubs had simplified upright shapes, narrow heads and angular ears, evoking puppies more than brown bear cubs. | **Revised.** Original drawn cub canvas function replaced with fuller body, larger round head, short muzzle, circular ears, broad plantigrade paws, age scaling and poses. Still compact programmatic pixel art, not premium character animation. |
| **High** | No family, food, water, comfort, parent or maternal inspection systems. | **Implemented core.** Five needs, Mama trust/suspicion/memories/food/help/cuddles/wrestle and hidden-object inspections, rescue interventions and interactions. A full explorable den and narrative scenes remain unbuilt. |
| **High** | Three fixed upgrades, no player control over other traders occupying the post. | **Expanded.** 17 upgrade definitions, visible structures, four access policies, once-per-cub physical-good fees, rival/offsite trade, storage and displays. Spatial drag-placement and negotiated rental contracts remain out of scope. |
| **High** | NPC relationships were essentially a scalar affected by trades; little life outside commerce. | **Expanded.** Six age/family profiles; player's Fern/Pebble littermates; NPC-to-NPC interaction memories, shares, chases, wrestling, crafting and gathering; player social actions change actual trust/needs. NPC behavior still uses simplified goals and timed logic. |
| **High** | Mythical vape could only be archived and was expressly blocked from use or bartering. | **Changed per request.** Rare human-trail item can be held, shown, hidden, displayed, traded and used; use triggers visible pixelated vapor, coughing, -12 health, -9 energy, dependence increment, parental suspicion and possible witnesses. It provides no buffs or real-life usage directions. |
| **High** | Original automatic tick eventually advanced days without player choice, potentially altering a farm while idle. | **Fixed.** Background NPC pulse progresses social/economic events independently, but does not advance player phase/needs. Time costs come from player activities and waiting/sleeping. |
| **Medium** | Little capacity pressure on advancement. | **Rebalanced.** Finite inventory, optional baskets and cart capacity, stock transfer validation, crafting consumes ingredients, recovery fees and player stamina. |
| **Medium** | Re-showing an object or changing market rules could allow reward/fee farming in the expansion. | **Fixed during implementation.** Display reputation limited to first presentation of each item ID; changing market rule no longer resets the visitor's day pass; repeated trades with one NPC have daily reputation caps. |
| **Medium** | Original NPC `memory` was a descriptive **string**. An early v2 prototype replaced it with an event list and broke cub lore. | **Caught and repaired.** `backstory` stores the personal-value lore; `memory[]` stores new events. v1 save migration verified. |
| **Medium** | Initial built-market screenshot showed overlapping amenity captions and crowded NPC sprites. | **Visual cleanup.** Removed floating object labels and gave key amenities distinct interaction anchors; cleaner scene at multiple upgrades. Additional collision/pathing work is recommended. |
| **Medium** | Saving used a v1 browser local-storage shape. | **Preserved.** Existing save key kept; old v1 NPC backstories migrated and new state saved. Tested restore with a localStorage-shaped browser shim; local filesystem/browser persistence varies by browser configuration. |

## Foraging design before and after

**Before:** Two random forage draws per morning; clicking Next Morning endlessly resets availability. No physiological or economic opportunity cost for cycling; only backpack capacity slows accumulation. `tick()` also advanced days after a fixed number of background ticks.

**After:** A day has morning (3 slots), afternoon (4), evening (3), night (2). A gathering trip consumes a slot, energy, one of a small number of daily exploration opportunities, and a unit of a specific region's stock. Region stocks recover slowly at morning and can be picked over. Resource categories vary by locale and tools. Skipping phases **does not directly award anything** and reduces food/water; repeatedly doing so can result in Mama enforcing a recovery day and reputation loss. NPCs collect independently, can preempt trade opportunities, and repeated commodity finds lower that commodity's perceived trade worth. The result is a decision among eating, selling, crafting, saving, visiting friends and keeping family trust rather than an infinite free button loop.

## Browser test evidence (this v2 build)

- **21/21** deterministic integration/state checks passed; test checks include berry eating, stick-to-fish crafting, distinct fresh/wooden/dried/stone fish, phased waiting cost, skip-spam, gathering cap, Mama discovering hidden vape, vape state harm/pose, fee transfer and anti-double-pay, material-cost building, wrestling consequences, sibling ages, autonomous NPC trades, negative relationship from poor trade, saved-state reload, 55 item catalog, NPC memory evolution, 25-day stress run, runtime JS errors, and **legacy v1 save migration**.
- **14/14** browser smoke checks passed, including UI for food, Mama, social wrestling, fee policy, gathering, clock, journal, crafting, and desktop/mobile no horizontal overflow.
- **25-day automated run**: passed without negative item counts or JavaScript exceptions; intentionally includes repeated waiting and attempted gathering. A neglected cub got automatic aid rather than a permanent dead state.
- Real Chromium screenshots in `screenshots/`; the multi-building screenshot uses items granted by the *test harness* then spends them through real build actions, to demonstrate an upgraded post without pretending this was a naturally earned player save.
- The test harness exposes private debug functions in the **test copy only**, not in the shipped game. Browser local storage is mocked for save tests because the test container disallows Chromium URL navigation; the delivered HTML uses actual `localStorage` in browsers that permit it.

## Open items — candid completion boundary

1. **High priority:** Richer NPC action planner, travel/pathfinding and physically distinct den/home/shop locations. Current agents have state, inventories, schedules and autonomous event decisions, but no walkable pathfinding mesh or full AI intention hierarchy.
2. **High priority:** Bespoke art for all 55 item identities and full animation frame sheets for eating/carrying/play/wrestling/sleeping and multi-age species-faithful silhouettes. Current animations are lightweight procedural poses; many items reuse category stamps.
3. **High priority:** Live economy tuning over 100+ days, exploitation of niche craft arbitrage, seasonal demand, per-cub trade strategy and richer user-facing prediction explanations.
4. **Medium:** Drag-and-drop positioning, zoning, furniture use, full distinct shop interiors and an extended family/home simulation.
5. **Medium:** Real market membership contracts, negotiated stall rent, credit, permits, and differentiated nonpaying visitors. Currently four policies and physical fees are functional, but not a complete rental market.
6. **Medium:** More unique object actions, fishing minigames, crafting station requirements, food spoilage, and tool durability.
7. **Medium:** More robust accessibility, screen-reader modes, small-screen UI simplification and real user playtesting with usability questionnaires.
8. **Low:** Audio polish, character expression sheets and convenience UI quality-of-life features.

## Evidence & inspiration links

- NPS bear anatomy: https://www.nps.gov/articles/bear-identification.htm
- NPS brown bear ecology: https://home.nps.gov/articles/000/coastal-bear-ecology.htm
- *Bear and Breakfast* artist process: https://ioana-sopov.squarespace.com/bear-breakfast
- *Stardew Valley* developer on repeated pixel-art revisions: https://store.steampowered.com/news/posts/?appids=413150&enddate=1458777599
- Game economy taps, converters and drains: https://gameindustrylibrary.com/documents/how-video-game-economies-are-designed-by-mark-brown
- Bear social play: https://www.adfg.alaska.gov/static/home/library/pdfs/wildlife/research_pdfs/living_harmony_bears.pdf