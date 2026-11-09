# V5 request reconciliation — direct requested feature vs evidence

| User request | v5 status | Notes |
|---|---|---|
| Full-screen menu, centered primary buttons | **Implemented/tested** | The game HUD is hidden under the opaque title scene |
| Custom cub name and appearance | **Implemented/partial** | Name, sex/prospective pronouns, coat; visual orientation variation remains basic |
| For this setting: male/he and female/she only | **Implemented/tested** | Distinct pronoun selector removed; intended fictional configuration |
| Disallow named-NPC duplicate names | **Implemented/tested** | Case-insensitive validation |
| Evil temperament makes cub widely disliked | **Implemented/tested** | NPC relationship baseline and mother trust change |
| Main gameplay less cluttered, remove permanent sidebar | **Implemented/tested** | Context panel; some legacy menus preserved behind it |
| Tutorial longer vs short | **Deferred intentionally** | User explicitly wanted to decide length themselves. Retained eight-step guide |
| Close and uncluttered notifications/popups | **Partial** | Improved modal priority and mobile toast position; not all pairs tested |
| No in-world remote item/social actions | **Improved/targeted tests** | Panda/negotiation/Mama checks; exhaustive every action not tested |
| Continuous walking and usable trading post | **Implemented/targeted tests** | Fixed initial spawn/collision; complete navmesh still pending |
| Item-specific world animation | **Partial** | Transfer effects/poses; full set of 63 item animations absent |
| Deep barter dialogue and refusal reasons | **Improved** | Contextual conversation, variable refusal; no fully voiced negotiation or multi-round promise contracts |
| Underage cub drug purchase/use/trade | **Implemented/tested** | Fictionally illegal but controls functional |
| NPC drug use and dependence | **Implemented/partially tested** | Autonomous rule-based effects; multi-month recovery untested |
| Addicted NPC may part with beloved item | **Implemented/real UI tested** | Item changes ownership and preserves history/regret; NPC can refuse |
| Full independent adult panda and honey currency | **Implemented/partial** | Unique panda, finite honey, but honey jars/spills missing |
| Mother's detection/confiscation/support | **Implemented/targeted tests** | Confiscated cache + once/day help; long-term consequences partial |
| Actual sleep and Mama curfew | **Implemented/targeted tests** | Den nest/next day; richer family bedtime animations missing |
| Rival shopping betrayal/sabotage | **Partial** | Contextual reactions and sign sabotage; organized crime/hitmen unapproved |
| Physical construction and item costs | **Improved/tested** | Ghost placement and collision; individual construction animations missing |
| Distinct Notice Board & Market Gate | **Implemented** | Daily commissions and market policies instead of duplicate map |
| Unique newborn sprite | **Implemented/visual proof** | Original closed-eye sprite; complex growth/care missing |
| One-hit fatal roadway | **Implemented/tested** | Visible traffic with sideways fallen cub; simple overlay effect |
| NPC walking between scenes, other dens/mamas | **Not implemented fully** | Still primary remaining simulation milestone |
| Fully styled consistent pixel UI and controls | **Partially complete** | Clear improvements but old micro-text in original world remains |
| Event rarity system separate from item rarity | **Proposal/partial** | Six tier weights suggested, not full event roll system |
| Audit all 63 item functions & remove dead code | **Partial** | Existing v4 item-use audit included, enhanced exceptions; old architecture still present |
| Real-origin save migration + extended playtest | **Not verified** | Embedded HTML Chromium checks only; no long human session |