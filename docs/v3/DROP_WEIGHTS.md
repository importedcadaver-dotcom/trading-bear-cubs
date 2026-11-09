# Item drop probability audit

This file is produced by `calc_drop_chances.py`, using the exact weighted rarity selection and per-area eligible item sets in the shipped `extension-v3.js`. The formulas sum to 100% per zone. It reports **conditional probabilities for an eligible successful gathering attempt**, with basic equipment (no fishing rod, no shovel). **It is not** a 100%-per-day drop chance: area travel/energy, per-day action budget, capacity and pool depletion may prevent gathering.

The algorithm first draws one rarity tier with weights Common 50%, Uncommon 27%, Rare 14%, Epic 6%, Legendary 2.5%, Mythic 0.5%. If an area has no item at the selected tier, its weight is redistributed among that area’s common goods. If a tier has multiple eligible items, each is equiprobable. Stream fishing without a rod or bridge replaces half of fresh-fish draws with clay. Carrying a shovel at Logs overrides 20% of any sampled find with quartz; the CSV does not include this optional override.

See `ITEM_DROP_RATES.csv` for **exact conditional per-item percentages**, for all eligible area/item pairs. No mythic drops are eligible outside Human Trail.

## Selected illustrative percentages

| Location | Item | Rarity | Chance per successful gather |
|---|---|---|---:|
| Grove | Berry | Common | 10.6000% |
| Grove | Amber bead | Epic | 6.0000% |
| Stream | Fresh fish | Uncommon | 3.3750% |
| Stream | River clay | Uncommon | 10.1250% |
| Stream | Fish-shaped stone | Legendary | 2.5000% |
| Logs | Wood plank | Uncommon | 9.0000% |
| Trail | Mythical vape | Mythic | 0.1250% |
| Trail | Frost-labelled vape | Mythic | 0.1250% |
| Trail | Fish-shaped stone | Legendary | 2.5000% |

Note: the `vape` base specimen plus all three labeled variants share a single **0.5% Mythic tier**, so each of the four labels has 0.125% chance *per successful eligible Human Trail gather* under this default pool. They do not each get an independent 0.5% tier roll.

For separately measured sampled frequencies, see `drop-simulation.json` (25,000 draws per zone).