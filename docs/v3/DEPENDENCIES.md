# Cross-system dependency and invariant audit

## Implemented interaction matrix

Legend: **LIVE** = existing integration was tested through game state; **PARTIAL** = connection exists but is shallow or inconsistent; **MISSING** = no valid runtime link yet.

| Source system | Target / causal result | Status | Verification / risk |
|---|---|---|---|
| Location | Encounter, barter, dialogue | **LIVE** | Remote cubs cannot be traded with; location appears on their profile. |
| World path | Time, energy, new scene | **LIVE** | Route graph and energy costs verified; no true continuous route traversal. |
| Time phase | NPC location, weather lighting, food needs | **LIVE** | Phase logic and time-dependent visuals exercised. Schedules are rules, not plans. |
| Foraging area | Loot pool, resource scarcity, fatigue | **LIVE** | Wrong-location gather denied; zero-cost time skip doesn't create loot. |
| Inventory | Trading/crafting/consumption/hidden stock | **LIVE** | Physical quantities deducted; no negatives in 35-day stress run. |
| NPC carried items | NPC trade eligibility | **LIVE** | Hidden or reserved inventory excluded; transactions subtract source before transfer. |
| NPC discovery | Envy/secret caches/rare acquisition | **LIVE** | Rare finds, hidden inventories, jealousy state and memories appear in events. |
| Sibling relationship | Pebble promise, trust and shared Mama talk | **LIVE** | Specific dialogue and promise state verified; shared history shallow. |
| Confrontation | Trust, Mama awareness, secret knowledge | **LIVE** | Threaten/blackmail produce penalties or refusal; blackmail requires secret evidence. |
| Mama and hunger | Intervention, discipline, survival | **LIVE** | Den feeding and real death condition tested; difficulty balancing needs human playtest. |
| Mythic item use | Vapor pose, health/energy, suspicion | **LIVE** | Use consumes no instructions; harm and response checked. |
| Market policy | Entry fees and external trades | **LIVE** | Actual material fees and rival fallback tested. |
| Construction | World equipment and amenities | **PARTIAL** | Many drawn structures and bonuses; NPCs do not consistently walk to and use every one. |
| NPC intentions | Cross-map physical movement | **PARTIAL** | Persistent single location, updated by phase; off-screen area switches have no animated journey. |
| Character speech | Knowledge and log | **PARTIAL** | Conversation response logged, bubble visible, but some witness/knowledge propagation is basic. |
| Secret caches | Visibility and Mama inspections | **PARTIAL** | Stored in local-area state, can be found/confiscated; no physical movable cache sprite or spatial stealth. |
| Items and rarity | Dynamic valuation | **PARTIAL** | Shared tier rolls and personal valuations exist; no detailed per-variant condition and provenance chain. |
| Survival / death | Long-running legacy save handling | **PARTIAL** | Game over and restart exist; real old v2 save migration and all possible failure paths not exhaustively tested. |
| Furniture positions | Player free placement | **MISSING** | The market draws fixed coordinates for built upgrades. |
| Long-term history | Archival persistence beyond browser quota | **MISSING** | Full history accumulates inside browser localStorage; export is supported, but no separate IndexedDB pagination. |

## Essential world-state invariants

- An NPC must have exactly one `location` value at any moment. Only NPCs in the active `state.location` draw in the current scene.
- A trade consumes **carried** goods and does not duplicate **hidden** or **reserved** goods.
- Every item quantity is a non-negative integer across player, NPC, carried, stored and hidden inventories.
- Location-scoped hidden items remain associated with their actual hiding site (`state.hiddenAt[location]`).
- The 6 rarity weights add to 100%; region eligibility is applied after rarity roll; unavailable tiers fall back to common, not mythic.
- Player resource gathering takes an action, depletes an actual pool and costs energy; waiting alone does not create loot.
- The mythical vape variant tier is **one shared roll** at Human Trail, not four independent high-probability rolls.
- Player-owned post fees are charged only by policy; NPCs may bargain outside the post instead.
- Actions refusing to execute must leave invariants intact, and ideally explain the refusal.

## Highest priority remaining integrations

1. **Spatial NPC pathfinding:** render cubs moving between actual exits and through intermediate map nodes, with arrival timers, interruptions, and no location flicker.
2. **Real object placement:** tile occupancy, drag-drop furniture and collision rules, plus NPC sit/use animations.
3. **Knowledge graph:** per-cub witnessed events, hearsay, confidence, decay and explicit evidence provenance for threats and blackmail.
4. **Item instances rather than stacks:** personal sentimental value, ownership history, condition, special marks, lending and inventory transfers all as unique entities where necessary.
5. **Economy stress testing:** repeated full normal-play loops without resetting needs; better price distribution, sinks and anti-hoarding policy.