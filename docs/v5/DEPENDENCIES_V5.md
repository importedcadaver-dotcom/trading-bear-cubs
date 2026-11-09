# The Little Trading Post v5 — system dependency and conservation audit

## Verified invariants in targeted browser scenarios

1. Trading consumes the offering and moves the receiving item; tested for one dependency-influenced emotionally important object. Original owner, regret and memory are recorded, and recipient cannot receive duplicated stock.
2. Panda purchase transfers **honey from player to trader** and **item from trader to player**. Source stock decreases by one; no change occurs for remote transaction.
3. Drug use requires actual player inventory and consumes the item. The appropriate substance-dependence class and behavior/need fields change.
4. Mama's confiscation transfers actual substance quantities into a cache attributed to Mama; does not merely erase the item, in the tested scenario.
5. Mama's addiction-recovery help requires proximity in her den, and is limited to once per game day. It cannot instantly cure all dependence.
6. Construction in a valid spot consumes materials and registers a world placement; blocked or overlapping placements do not silently apply costs.
7. Sleep is tied to Mama's Den and advances the daily cycle. Away-from-home curfew triggers an adult response rather than a free skip.
8. Direct moving-car collision triggers death/game-over. Death prevents ordinary action flow in tested paths.

## Causal chains implemented, partially implemented or pending

| Causal chain | Status |
|---|---|
| Contraband acquired → inventory transfer → use → health/needs, craving/dependence | Implemented and directly tested |
| Contraband offered → craving-driven item valuation → cherished toy changes hands → regret/history | Implemented; real UI browser test |
| Panda buys/sells item → honey decreases/increases → stock transfer | Implemented; direct tests |
| Honey consumed → hunger/status/stickiness → later social consequences | Partial; effects exist but indirect social consequences shallow |
| Witness sees use → gossip/suspicion → Mama searches and confiscates | Partial: state connections and search; complete stochastic natural-play chain untested |
| Mama helps → dependence reduces slowly → social recovery | Partial: once-a-day care; full trajectory not simulated end-to-end |
| Sibling sees rare item → envy → private bargain → family argument | Partial; core trade exists, full emergent story pending |
| Built amenity → physically placed → individual cub paths to it and uses it | Partial; placement exists, pathfinding/use not complete |
| NPC walks to scene exit → traverses map → enters destination | Not complete |
| Rare event → persistent new characters/relationships → long-term consequences | Partial; newborn has persistent state and visuals, aging not complete |

## QA priorities not yet resolved

Test a long uninterrupted in-world week with no cheats; verify withdrawal over successive days, Mama rescue at both high/low trust, orphan care after day five, trader inventory depletion and replenishment conditions, hidden-item migration from all older save versions, every possible stacked-modal pair, relationship loop resistance and full event-log scalability.
