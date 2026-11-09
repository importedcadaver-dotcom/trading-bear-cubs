# 🐻 The Little Trading Post

**A playable, offline-first browser game about a young brown bear cub who owns a woodland trading post.** Other cubs have independent wants, memories, families, possessions, and their own trading lives.

> Project owner: `importedcadaver-dotcom` · Current playable build: **v5** · Status: **active private-game development / unfinished systems**
>
> **Content warning:** Fictional underage animal characters, substance use/addiction, contraband, coercion, starvation, injury and death can occur. These are game systems with consequences, not real-world instructions.

## ▶️ Play

1. From this GitHub page select **Code → Download ZIP**, and extract the archive.
2. Open **[`index.html`](index.html)** in Chrome or Edge.
3. Choose **New Game** or **Continue**. No account, install, server, or payment required.

GitHub Pages is enabled and the [deployment workflow](.github/workflows/deploy-pages.yml) **succeeded on its second attempt**. GitHub does not execute arbitrary HTML from its source-file viewer, so use the playable website instead:
**https://importedcadaver-dotcom.github.io/trading-bear-cubs/** (only after Pages is enabled and publishing succeeds).

## 📁 Project layout

| Location | What it contains |
|---|---|
| [`index.html`](index.html) | Current playable v5 standalone game |
| [`versions/v1/`](versions/v1/) | Original prototype HTML |
| [`versions/v2/`](versions/v2/) | v2 playable HTML |
| [`versions/v3/`](versions/v3/) | v3 playable HTML |
| [`versions/v4/`](versions/v4/) | v4 playable HTML |
| [`docs/v3/`](docs/v3/) | Original catalog, drop weights, rarity, research, dependency & QA reports |
| [`docs/v4/`](docs/v4/) | Item-use audit and v4 research/QA |
| [`docs/v5/`](docs/v5/) | [Audit](docs/v5/AUDIT_V5.md), [requirements](docs/v5/REQUIREMENTS_V5.md), [drug economy](docs/v5/DRUG_ECONOMY_V5.md), [tests](docs/v5/TEST_REPORT_V5.md), [roadmap](docs/v5/ROADMAP_V5.md) |
| [`docs/canon/`](docs/canon/) | Frozen Edition 1.0 bear-substance encyclopedia |
| [`docs/briefs/`](docs/briefs/) | Historical design prompts and development instructions |
| [`docs/PROJECT_HISTORY.md`](docs/PROJECT_HISTORY.md) | Design decisions, deferred requests, provenance |
| [`archives/`](archives/) | Reconstructed downloadable version ZIPs if the archive-generation workflow has run |

## Core premise

You start with **three berries and a very nice stick**. Cub-owned objects have **personal value**, not only a universal price. The game combines bartering, friendship, family, rivalry, exploration, crafting, property management, survival, rarity, fictional contraband, and emergent NPC behavior.

The latest version adds a full-screen title, character creator, clearer exploration UI, panda wandering trader, honey-based contraband economy, dependent-NPC trade consequences, and more.

## Important remaining work

V5 is playable but **not a finished, fully polished indie game**. See [ROADMAP_V5](docs/v5/ROADMAP_V5.md) and [AUDIT_V5](docs/v5/AUDIT_V5.md). Particularly incomplete: full NPC pathfinding, deep event histories, unique world animations for all actions, extensive newborn care, physically modeled honey containers, complete accessibility/migration testing, and long-form balance.

Tutorial duration and extreme rival-crime branches are **not automatically approved**. Do not silently replace player decisions or label untested features as complete.

## Source preservation

Older builds are in `versions/`. The historical ZIPs included large amounts of repeated data; the readable playable HTML and reports are stored separately to avoid making the current game harder to find. GitHub can create a ZIP of any snapshot via **Code → Download ZIP**. If `archives/` exists, it contains generated version-specific download bundles rather than byte-for-byte originals.

Files and facts are based on the actual project artifacts available from the ChatGPT development conversation. A full private chat transcript, inaccessible binary attachments, or unstored prior tool state should not be represented as recovered.

## Contributing / project rules

- Preserve the existing game and saved state when feasible.
- Prefer visible world actions to text-only state changes.
- Require physical location and inventory ownership for trade/interactions.
- Maintain rarity probabilities independently of sentimental value.
- Preserve the frozen substance-lore canon; any new local item is not automatically approved global canon.
- Record each feature as **implemented / partial / missing / untested**, with reproducible evidence.
- The user's supplied design prompts and specific corrections outrank unapproved proposals.

**No license has been added**; public repository visibility alone does not grant third-party reuse rights.
