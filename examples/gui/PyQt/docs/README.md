# Pokemon TCG demo (PyQt6 + Typhon) — isolated silo

Type-safe OO Typhon example using **PyQt6** from `typhon.toml`: browse a
[TCGdex](https://tcgdex.dev/rest)-extracted card catalog, manage an owned
collection with per-type stats, and build decks from owned cards.

Self-contained folder (`domain` / `store` / `data` / `typhon.toml`).
Tkinter twin: `examples/gui/pokemontcg/`.

`PokemonQtApp inherits QMainWindow` — create `QApplication` in `main.typhon` first,
then construct the window (Qt requires an app before any `QMainWindow`).

Clicking a master-list row updates the detail pane immediately
(`QListWidget.currentRowChanged`). The first catalog card is selected on startup.

## Run

```bash
python -m transpiler run examples/gui/PyQt/main.typhon
```

## Refresh the catalog (network)

```bash
python -m transpiler run examples/gui/PyQt/fetch_catalog.typhon
```

## Tabs

| Tab | Master (left) | Detail (right) |
|-----|---------------|----------------|
| Catalog | Card list (click → detail) | Stats, types, attacks; **Add to collection** |
| Collection | Owned + qty (click → detail) | Card detail; **+1 / -1 / Remove**; type stats |
| Decks | Deck names (click → detail) | Deck contents; create/delete; add/remove cards |

## Layout

| File | Role |
|------|------|
| `main.typhon` | Entry — `PokemonQtApp` |
| `ui.typhon` | PyQt6 tabs master–detail |
| `domain.typhon` / `store.typhon` | Typed domain + JSON I/O |
| `typhon.toml` | `pyqt6` |
| `data/` | `catalog.json`, `collection.json`, `decks.json` |
