# Pokemon TCG demo (Tkinter + Typhon) — isolated silo

Type-safe OO Typhon example: browse a [TCGdex](https://tcgdex.dev/rest)-extracted
card catalog, manage an owned collection with per-type stats, and build decks
from owned cards. UI is a Tkinter notebook (Catalog | Collection | Decks).
Clicking a master-list row updates the detail pane immediately.

This folder is self-contained (stdlib Tkinter). The PyQt6 twin lives in
`examples/gui/PyQt/`.

Domain inspiration: [Pokemon TCG card browser](https://www.pokemon.com/us/pokemon-tcg/pokemon-cards).
Card data comes from TCGdex (not scraped from Pokemon.com).

## Run

From the repo root:

```bash
python -m transpiler run examples/gui/pokemontcg/main.typhon
```

Working directory for the run is the example folder, so `data/*.json` resolves
next to the sources.

## Refresh the catalog (network)

Shipped `data/catalog.json` is a slim extract of the first 35 cards from set
`swsh3` (Darkness Ablaze). To rebuild:

```bash
python -m transpiler run examples/gui/pokemontcg/fetch_catalog.typhon
```

Uses HTTPS GET against `https://api.tcgdex.net/v2/en/...` (stdlib `urllib`).
The [TCGdex Python SDK](https://tcgdex.dev/sdks/python) is an alternative
client; this demo keeps domain types in Typhon and maps JSON into `Card` /
`Attack` itself.

## Tabs

| Tab | Master (left) | Detail (right) |
|-----|---------------|----------------|
| Catalog | All catalog cards (click row → detail) | Stats, types, attacks; **Add to collection** |
| Collection | Owned cards + qty (click row → detail) | Card detail; **+1 / -1 / Remove**; type stats |
| Decks | Deck names (click row → detail) | Deck contents; create/delete; add/remove owned cards |

Deck rule (teaching): only cards you own, and deck quantity cannot exceed owned
quantity. No full 60-card tournament validation.

## Layout

| File | Role |
|------|------|
| `main.typhon` | Entry — open store, start UI |
| `domain.typhon` | `Card`, `Attack`, `CollectionBook`, `Deck`, `TypeStat`, … |
| `store.typhon` | Load/save JSON under `data/` |
| `ui.typhon` | Tkinter notebook master–detail |
| `fetch_catalog.typhon` | TCGdex extract → `data/catalog.json` |
| `data/` | `catalog.json`, `collection.json`, `decks.json` |
| `docs/DATA.md` | JSON schemas and TCGdex field map |

## Persistence

Edits to collection and decks write immediately to local JSON. The catalog file
is read-only at runtime (refresh via `fetch_catalog.typhon`).
