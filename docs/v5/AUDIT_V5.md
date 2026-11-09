# The Little Trading Post v5 — implementation and design audit

**Source baseline:** the attached v4 game, preserved unmodified as `v4-original.zip` in this release. The v5 game is the modified original standalone `index.html`, with a copy of its new extension at `v5-extension.js`. V5 does not replace the working barter/world model with a mockup.

## Major corrections

| Priority | v4 deficiency | Actual v5 change | Evidence / limitation |
|---|---|---|---|
| P0 | Menu shows the HUD behind it | Fully opaque screen-filling woodland title, large centered New/Continue/Load controls | Chromium screenshot and browser checks PASS; title image is original canvas drawing |
| P0 | Exploration crowded by permanent trade/family sidebar | Side panel hidden by default; large world and contextual dock; panel opens on use | Screenshots desktop/mobile; legacy panels remain when explicitly opened |
| P0 | Creator name confusion and unapproved options | Male/female mapped pronouns; duplicate NPC-name rejection; Evil start changes relationships | Browser test PASS; cosmetic customizations are still limited by old sprite rig |
| P0 | Stuck behind trading-post stall | Corrected post spawn to clear ground; fixed local stall collision | Browser test PASS for initial access; exhaustive pathfinding not done |
| P0 | Repetitive interactions are text only | Floating item movement, item use poses, contextual prompts, in-world effects | Partial: new effects work, not every one of 63 items has unique physical animation |
| P0 | UI popup/feedback interference | Blocking modal priority, contextual panel, mobile notice moved away from top of scene | Browser screenshots and 390px width smoke test; not exhaustive UI state-pair testing |
| P1 | Cub substance items treated as generic inventory artifacts | All v4 five substance families and vapes mapped to functional use; consumption, health/needs, dependences/cravings, witnesses | Specific player/NPC browser checks PASS. Distinct classes, no real-world dose or use instructions |
| P1 | Dependent NPCs not economically motivated | NPC craving/health/recovery and an eligible **voluntary but unfair** trade of a cherished belonging, with preserved owner/regret and memories | Real UI browser test PASS for item transfer, provenance and lack of duplication; recovery dynamics remain simplified |
| P1 | Underage contraband merchant paid with coins and looked like brown bear | Unique adult panda sprite, trade at the Human Trail, finite honey and inventory, refusals outside reach | Targeted browser checks PASS; honey is a conserved numeric quantity, not yet physical spillable containers |
| P1 | Market Gate / Notice Board duplicate map button | Gate permissions/fees; daily NPC demand commission and rumors | Source-level update, not exhaustive economic balance study |
| P1 | Resting did not complete real bedtime | Den-only next-day sleep, curfew interception and recovery costs | Browser checks PASS for sleep/day, but no complete cinematic family bedtime |
| P1 | Construction click-spawn at arbitrary location | Ghost placement with validity check, materials consumed and placed object rendered | Targeted construction checks PASS; still simplified furniture behavior |
| P1 | Mama aware of some bad acts but no concrete recovery | Proximity-checked recovery discussion (max once/day), confiscation moves goods into Mama's held inventory | Deep tests PASS; no comprehensive long-term treatment narrative |
| P2 | Newborn appeared as scaled-up/down standard cub | Distinct pixel newborn with closed-eye pose; carry/den rendering | Screenshot; care and growth remain partial |
| P2 | Road collision merely caused damage | One-hit fatal state, sideways fallen cub and small blood shadow/pool beneath | Deep browser test PASS for fatal collision; alternative non-graphic setting still needed |
| P2 | Rival/trading systems disconnected | Rival sign sabotage and sibling response, deeper refusal reasons | Some scripted choices, still not a robust organized-crime simulation |
| P3 | V1–v4 overrides and dead code | V5 layered extension and targeted overrides to avoid breaking saves | Technical debt remains; **not** a full module cleanup |

## Original signature mechanic remains

Personal valuations and non-player trades remain inherited from v3/v4. Players begin with exactly three berries and one very nice stick, own the trading-post property and may find rare items. Event categories are **not** the same as item rarity.

## V5 functional substance and relationship behavior

The game treats **underage possession/use/dealing as illegal within the story, not disabled in UI**. The player can purchase, own, consume, hide and barter the items. NPCs may use stocked substances and develop dependence, cravings, impaired health, resentment and support-seeking. A dependence-affected cub may sometimes part with a sentimental item despite its high personal value. The item records former ownership, the cub's regret and future consequences. A refusal remains possible. Mama can learn from witnesses, search for carried/hidden stock, confiscate real item quantities and provide limited help. This is gameplay fiction, not real-world guidance.

The item set is still the **63 entries from v4** (58 previous + five substance items); v5 deepens behavior rather than adding filler catalog IDs. It does not implement full standalone intake animations for all five products; poses and smoke/illness cues are shared.

## Known incomplete systems (do not mistake for tested/completed)

- **Autonomy:** NPCs do not yet continuously follow paths across the whole map; their schedule changes still have some off-screen jumps.
- **Visual action coverage:** Not every item and every social action has unique movement/physics; world feedback is improved but often shared.
- **Age and family:** Sibling story logic is partial; the game does not have fully different dens/mothers and age-specific language across all NPCs.
- **Trader/honey:** honey is conserved across buy/sell/eat but not physically stored in individual jars on the map; no comprehensive spoiling, spilling, stealing or vomit animation.
- **Dependence:** rules approximate persistent craving/withdrawal and recovery; they are not a medical model, and not all branching long-term narratives exist.
- **Human trail/newborn:** no fully autonomous newborn growth, sustained milk care, rival kidnapping storyline or exhaustive human traffic ecology.
- **Construction:** ghost placement/costs work, but deep building animations and each furniture's custom use still lack coverage.
- **UI:** a few inherited panels remain dense; mobile is usable at 390px but the underlying original scene contains small pixel-name text.
- **Tutorial length:** the existing eight-step tutorial is retained because the player explicitly reserved the length decision.
- **Data/architecture:** original monolithic IIFE and v1–v5 overrides remain. No IndexedDB event archive. Full real-origin v2–v4 save migration has **not** been proven.
- **Testing:** no uninformed-human usability test, continuous two-hour fun test, or uninterrupted unmodified 30-day survival test was conducted. Test cases do not exhaust state combinations.

## Principal next milestone

Concentrate on **playfeel, NPC spatial autonomy, object-specific use, true personal-item instances, family narrative depth and save migration** before adding further categories/places. The essential bar is that any button representing a physical interaction should correspond to a visible, locatable change in the world.