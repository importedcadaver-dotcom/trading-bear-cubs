# Project history, established decisions, and outstanding requests

This is a curated reconstruction of **The Little Trading Post** development conversation and the available v1–v5 source/audit records. It preserves game-design decisions; it is **not** a verbatim export of every private chat message. The full source prompts are under [briefs](briefs/).

## Original premise — The Little Trading Post (v1)

- A young brown bear cub sets up **their own** trading post in a woodland community.
- The player starts with **three berries and one very nice stick**.
- Objects have **personal value** based on memories, relationships, tastes and needs, not a fixed price list.
- The original bargain story was a carved wooden fish, berries and a rare blue stone; NPCs can trade away a coveted item independently while the player delays.
- Other cubs should trade with each other, develop friendships and grudges, form rivalries and respond to the player's behavior.
- The player can expand and control the post; others using the player's private facilities should respect rules and fees.
- A rare human vape is a mythic artifact; later user corrections explicitly required usable fictional contraband, health/social consequences and adult/cub illegal commerce.

## v2 expansion — daily life, physical objects, and ownership

The player requested morning/night structure, food/water/energy, Mama interactions, hiding items from Mama, pride/display of finds, unique physical uses for berries/sticks/fish, crafting and placed amenities, sibling/littermate relationships, different cub ages, serious consequences, a playable vape action and better bear anatomy/art.

A prominent exploit was unlimited days and foraging. The solution should be systemic scarcity and opportunity cost, *not* tedious arbitrary click cooldowns.

## v3 world expansion

Required locations included Whisperwood Clearing, Mama's Den, Pebble's spot, Riverside, woodland, playground, rival market and Human Trail. Travel and character presence should be spatially real; no NPC in two scenes at once.

User requested envious NPCs with cherished rare items, lying/hiding, persuasion and intimidation with autonomy and retaliation, strong Pebble-littermate identity, complete six-tier item rarity, full event/dialogue logs, better UI/world scale, the `YOU` nameplate not covering eyes, developer cheats, and stronger dependency auditing.

Item rarity baseline proposed: **Common 50%, Uncommon 27%, Rare 14%, Epic 6%, Legendary 2.5%, Mythic 0.5%** for eligible rolls. Item rarity ≠ universal personal value.

## v4 — the Living Woodland update

A new player needed a main menu, character creator, guided first morning, keyboard movement, clear interactables, improved art, easier inventory, unique item use, real family interactions, deeper gameplay feedback and technical QA.

Other requested mechanics: active Human Trail with vehicles and lethal road risk, rare orphaned newborn rescue, swimming/drowning/current, fishing and lessons with Mama, and an adult wandering criminal trader who sells/buys products using the **frozen Bear Drugs Edition 1.0** canon.

The user preferred small original pixel-art brown bears and original cutout/puppet-like wobble (not copyrighted character copies).

## v5 — UI, systems and social depth corrections

The user explicitly criticized:
- The title being a small overlay over gameplay, rather than a full-window Minecraft/Stardew-like title screen.
- Crowded right sidebar, inconsistent type, overlapping popups, repeated dialogue, tiny/unclear action cues and generic rectangular outlines.
- Movement getting stuck at the player-owned stall, menus granting remote interactions, NPCs teleporting, insufficient distinctive scene assets, and opaque game progress.
- Unrealized stories and behavior in bartering, construction, sibling lives, homes, self-care/sleep, notice board and market gate.
- Unclear or unearned foraging restrictions, shallow trading denial reasons, and weak scene-to-scene pathing.
- Panda trader needing **a unique adult giant-panda sprite and edible, conserved honey currency** instead of coins.
- Newborn needing a unique newborn sprite and long-term physical care.
- Need for stronger item provenance, emotional attachment, events (independent rarity tiers), addiction, blackmail/snitching, jealousy, social autonomy, and cause/effect chains.

### Approved in-world family and age premises
- Player, Fern, and Pebble are **biological littermates, all 11 months old**.
- Siblings receive shared base features (protectiveness, competition, teasing, family memories, secrets, reconciliation, snitching) before individual traits.
- Fictional developmental benchmark: **3 bear months ≈ 1 human developmental year**; therefore 11 months ≈ 3 years 8 months as a writing reference.
- Other cubs should have distinct mothers/homes and meaningful family rules.
- Mama can intervene in dangerous conditions, curfews and serious conflicts.

### Current v5 character-creator request
- For this game, player selected **male/he-him or female/she-her**; name must not duplicate NPCs; **Evil** temperament creates genuine starting hostility and social consequences.
- Do not silently make further unapproved changes to these player-selected character-creator rules.

### Substance/addiction simulation — essential clarification
In this **fictional bear world**, products can be illegal for cubs without being disabled gameplay actions. Player and NPC cubs can possess, trade and use fictional substances with appropriate harm, dependence, withdrawal and parental/legal/social consequences; a desperate dependent NPC may part with a sentimental item, but the item retains its former owner, and the NPC can resist, later regret, seek help or retaliate. No practical real-world drug-use, manufacturing, dosing, concealment or trafficking instructions.

Canon family names and status must follow [Bear Drugs Edition 1.0](canon/Bear_Drugs_Encyclopedia_Edition_1.0_FROZEN.md): Hookleaf/Nictarine, Skunkmoss/Tetrahum, Brewzol, Hiveglass, Nectopiates (unnamed individual opioid members). New labels and character details are local game fiction and not automatically approved canon.

### Death and darker events
- User asked for a direct road collision to kill the player immediately, with an appropriate laid-over sprite and restrained blood layer, plus a game-over/reload path.
- A rare newborn by a deceased mother on the road can become an ongoing, highly dependent NPC, with choices to rescue, keep secret or seek adult care.
- Extreme rival-crime ideas (hired violence, kidnapping, ransom or murder) were brainstormed but **not approved as mandatory implemented mechanics**.

### Deliberately deferred / choice required
- **Tutorial duration and feature gating**: player explicitly said not to decide between short, long and gradual tutorials without their approval.
- **Extreme rival-crime branches**: proposal, not approved scope.
- Exact event-tier probabilities, expansion details for other families/homes, some newborn outcomes, and special story arcs require careful proposal vs canon distinctions.
- Each subsequent build should provide a verified implemented/partial/missing/untested ledger.

## Guiding design rule

**Every significant player action should be visible and causal in-world**, not a button that only changes a number. Build a living woodland, not a browser dashboard. More item IDs/menus are not substitutes for better playfeel.

## Versions and evidence

| Version | Playable source | Historical docs |
|---|---|---|
| v1 | [versions/v1/index.html](../versions/v1/index.html) | Original premise above |
| v2 | [versions/v2/index.html](../versions/v2/index.html) | [v2 audit](v2/AUDIT.md) |
| v3 | [versions/v3/index.html](../versions/v3/index.html) | [v3 docs](v3/) and [v3 prompt](briefs/v3_expansion_prompt.txt) |
| v4 | [versions/v4/index.html](../versions/v4/index.html) | [v4 docs](v4/) and [v4 prompt](briefs/v4_living_woodland_prompt.txt) |
| v5 | [root index.html](../index.html) | [v5 docs](v5/) and [v5 prompt](briefs/v5_living_world_prompt.txt) |

The project is ongoing; previous QA numbers are historical tool-run reports and should be independently revalidated after changes.
