# V4 applied design research

These are **external observations and design deductions**, not assertions that the game has reached the quality or scope of commercial references.

| Reference | Observed / documented principle | v4 implementation | Next evaluation |
|---|---|---|---|
| [Nielsen Norman Group — Visibility of System Status](https://www.nngroup.com/articles/visibility-system-status/) | Users need immediate confirmation and an understandable state after each action | Nearby `E` prompt, focus highlights, item outcome text and sound/floating text | New-player tasks: find bush, collect, verify inventory without guesswork |
| [Nielsen Norman Group — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) | Frequent actions should be visible; secondary complexity should appear when needed | Three primary tabs plus More Panels; main menu and help | Measure whether players can find inventory, relationships and settings in under 15 seconds |
| [Adam Robinson-Yu — Making A Short Hike](https://blog.playstation.com/2021/08/05/crafting-a-tiny-open-world-a-look-behind-the-scenes-at-the-creation-of-a-short-hike/) | Compact worlds reward wandering and contain side minigames | Context interaction movement, fishing, swimming and special Human Trail event | Add landmarks/secrets rather than simply more destinations |
| [Stardew Valley — Villagers](https://stardewvalleywiki.com/Villagers) | Individually routine-driven characters, purposeful gift preferences and friendship | Preserved schedules and personal item valuation; proximity checks tightened | Move from location jumps to paths and multi-day personal story arcs |
| [Recettear — Haggling](https://recettear.fandom.com/wiki/Haggling) | Trading decisions are a central deliberate activity with individual reactions | Preserved v3 barter rather than replacing the economic core | Implement counteroffers, debts and NPC item attachment |
| [National Park Service — Bear Identification](https://www.nps.gov/articles/bear-identification.htm) | Real brown-bear proportions and facial cues support species recognition | Preserved rounded bear sprites and allowed coat customization | Direction-specific animation atlas / puppet rig with readable paws and muzzle |

## Why the genre is difficult

The game is a **social-life simulator with barter/shopkeeping, exploration RPG and sandbox/light survival elements**. Too many meters make play tedious; too many content menus make player action feel abstract; autonomous traders can create unwinnable or invisible state changes if rarity is poorly explained. Distinguish **a resource feedback loop** (obtain/consume/craft) from **a social consequence loop** (witness/remember/choose/respond) and **a personal goal loop** (learn/desire/acquire/show/protect). The most useful next improvement is to make each activity advance at least two loops instead of awarding generic reputation.

## Design experiments not yet measured

- Observe a new player finding and eating a berry in under one minute without outside instruction.
- Compare 15-minute tutorial completion and first-trade rates against v3.
- Test whether players can predict NPC reactions to a gift based on visible motives rather than random numbers.
- Compare the satisfaction of a single multi-step treasure quest to five disconnected item finds.
- Measure input-to-visible-response latency and identify any controls without feedback.
- Run 30+ normal-play days without cheats to test food, water, rare economy and NPC rivalry balance.