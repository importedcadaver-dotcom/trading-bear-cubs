# The Little Trading Post v3 — Source-audited item catalog

Inventory below is extracted from the **actual running browser source**, not a proposed list. 55 legacy v2 types + 3 distinct mythic-label variants = **58 total IDs**.

## Six rarity tiers (baseline weights)

| Tier | Attempt weight |
|---|---:|
| Common | 50% |
| Uncommon | 27% |
| Rare | 14% |
| Epic | 6% |
| Legendary | 2.5% |
| Mythic | 0.5% |

**Important:** These weights are a first-stage roll in eligible gathering areas, not a guaranteed chance for every region. For a missing tier in a particular local pool, the renderer falls back to a common find; epic, legendary and mythic goods cannot materialize from the wrong habitat. Mythic devices share one 0.5% tier; four labels are different presentation variants within that tier, **not four separate 0.5% jackpots**. Actual NPC personal value is adjusted by wants, relationship and saturation.

### Sampled effective drop distribution

25,000 seeded rolls per area, recorded in `drop-simulation.json`.

| Area | Common | Uncommon | Rare | Epic | Legendary | Mythic |
|---|---:|---:|---:|---:|---:|---:|
| Grove | 52.79% | 27.27% | 14.03% | 5.91% | 0.00% | 0.00% |
| Stream | 50.56% | 26.90% | 13.94% | 6.09% | 2.50% | 0.00% |
| Logs | 53.57% | 26.64% | 13.77% | 6.02% | 0.00% | 0.00% |
| Trail | 50.57% | 26.66% | 13.90% | 5.88% | 2.46% | 0.52% |

## Complete item list

| ID | Name | Category | Rarity | Base utility | Primary actions |
|---|---|---|---|---:|---|
| `berry` | Berry | Food | common | 2 | Inspect, Trade, Gift, Store, Hide, Display, Eat, Show Mama |
| `stick` | Nice stick | Material | common | 3 | Inspect, Trade, Gift, Store, Hide, Display, Craft, Build, Show Mama |
| `feather` | Blue feather | Treasure | uncommon | 5 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `fish` | Carved wooden fish | Toy | uncommon | 5 | Inspect, Trade, Gift, Store, Hide, Display, Play, Show Mama |
| `stone` | Blue stone | Treasure | rare | 8 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `button` | Old button | Human | uncommon | 6 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `acorn` | Acorn cap | Treasure | common | 2 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `mouse` | Toy mouse | Toy | common | 6 | Inspect, Trade, Gift, Store, Hide, Display, Play, Show Mama |
| `shell` | River shell | Treasure | uncommon | 4 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `ribbon` | Red ribbon | Human | common | 5 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `key` | Human key | Human | epic | 11 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `vape` | Mythical vape | Human | mythic | 39 | Inspect, Trade, Gift, Store, Hide, Display, Use (harmful), Show Mama |
| `freshfish` | Fresh fish | Food | uncommon | 7 | Inspect, Trade, Gift, Store, Hide, Display, Eat, Show Mama |
| `driedfish` | Dried fish | Food | uncommon | 9 | Inspect, Trade, Gift, Store, Hide, Display, Eat, Show Mama |
| `fishstone` | Fish-shaped stone | Treasure | legendary | 8 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `honey` | Honey comb | Food | common | 8 | Inspect, Trade, Gift, Store, Hide, Display, Eat, Show Mama |
| `water` | Water flask | Drink | uncommon | 4 | Inspect, Trade, Gift, Store, Hide, Display, Drink, Show Mama |
| `apple` | Forest apple | Food | uncommon | 4 | Inspect, Trade, Gift, Store, Hide, Display, Eat, Show Mama |
| `mushroom` | Edible mushroom | Food | common | 3 | Inspect, Trade, Gift, Store, Hide, Display, Eat, Show Mama |
| `roots` | Sweet roots | Food | common | 3 | Inspect, Trade, Gift, Store, Hide, Display, Eat, Show Mama |
| `jam` | Berry jam | Food | rare | 8 | Inspect, Trade, Gift, Store, Hide, Display, Eat, Show Mama |
| `meal` | Fish supper | Food | rare | 13 | Inspect, Trade, Gift, Store, Hide, Display, Eat, Show Mama |
| `leaf` | Big leaf | Material | common | 2 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `twig` | Bundle of twigs | Material | common | 3 | Inspect, Trade, Gift, Store, Hide, Display, Craft, Build, Show Mama |
| `wood` | Wood plank | Material | uncommon | 5 | Inspect, Trade, Gift, Store, Hide, Display, Craft, Build, Show Mama |
| `rope` | Braided rope | Material | uncommon | 6 | Inspect, Trade, Gift, Store, Hide, Display, Craft, Build, Show Mama |
| `clay` | River clay | Material | uncommon | 4 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `mossmat` | Soft moss | Material | common | 3 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `pinecone` | Pine cone | Treasure | uncommon | 3 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `quartz` | White quartz | Treasure | rare | 8 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `amber` | Amber bead | Treasure | epic | 13 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `marble` | Glass marble | Human | rare | 14 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `thimble` | Silver thimble | Human | rare | 13 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `bell` | Brass bell | Human | rare | 12 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `compass` | Broken compass | Human | epic | 18 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `postcard` | Lost postcard | Human | epic | 11 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `dice` | Wooden die | Toy | rare | 7 | Inspect, Trade, Gift, Store, Hide, Display, Play, Show Mama |
| `ball` | Cloth ball | Toy | uncommon | 8 | Inspect, Trade, Gift, Store, Hide, Display, Play, Show Mama |
| `boat` | Leaf boat | Toy | uncommon | 6 | Inspect, Trade, Gift, Store, Hide, Display, Play, Show Mama |
| `kite` | Tiny kite | Toy | rare | 12 | Inspect, Trade, Gift, Store, Hide, Display, Play, Show Mama |
| `crown` | Acorn crown | Toy | rare | 9 | Inspect, Trade, Gift, Store, Hide, Display, Play, Show Mama |
| `drum` | Hollow-log drum | Toy | rare | 12 | Inspect, Trade, Gift, Store, Hide, Display, Play, Show Mama |
| `basket` | Woven basket | Tool | uncommon | 12 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `shovel` | Wooden shovel | Tool | rare | 12 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `fishingrod` | Fishing pole | Tool | rare | 12 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `lantern` | Firefly lantern | Tool | rare | 16 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `map` | Forest map | Tool | rare | 11 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `acorncookies` | Acorn biscuits | Food | common | 9 | Inspect, Trade, Gift, Store, Hide, Display, Eat, Show Mama |
| `paintedstone` | Painted stone | Craft | rare | 7 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `necklace` | Shell necklace | Craft | rare | 11 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `wovenmat` | Woven mat | Craft | uncommon | 10 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `birdhouse` | Mini birdhouse | Craft | rare | 14 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `cup` | Clay cup | Craft | uncommon | 8 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `sticker` | Star sticker | Human | epic | 10 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `ticket` | Train ticket | Human | epic | 9 | Inspect, Trade, Gift, Store, Hide, Display, Show Mama |
| `vape_berry` | Wildberry-labelled vape | Human | mythic | 39 | Inspect, Trade, Gift, Store, Hide, Display, Use (harmful), Show Mama |
| `vape_frost` | Frost-labelled vape | Human | mythic | 39 | Inspect, Trade, Gift, Store, Hide, Display, Use (harmful), Show Mama |
| `vape_citrus` | Citrus-labelled vape | Human | mythic | 39 | Inspect, Trade, Gift, Store, Hide, Display, Use (harmful), Show Mama |

## Limitations and audit notes

- Physical inventory quantities are implemented. Many art stamps are category-generic rather than fully bespoke.
- `possible_origins` in CSV includes historical v2 loot lists, which may differ from v3 weighted selection and NPC autonomous discovery. For true per-region weights, inspect `selectedRarityLoot()` in `extension-v3.js` and `drop-simulation.json`.
- Foods are consumed; crafting consumes input goods; display and storage remove items from carried inventory.
- Base utility is an input to preferences, not a fixed selling price or universal market.
- Blackmail, negotiation and theft never grant an item that the target does not physically own.