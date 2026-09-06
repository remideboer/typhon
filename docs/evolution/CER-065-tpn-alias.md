# CER-065: `.tpn` alias for `.typhon`

| | |
| --- | --- |
| Status | Accepted |
| Date | 2026-09-06 |
| Scope | Source extension recognition; `transpiler/brand.py` helpers; import/manifest/run; extension `languages.extensions` + menus |
| Module | [`transpiler/brand.py`](../../transpiler/brand.py), [`typhon-language/`](../../typhon-language/) |

## Context

`.typhon` is long for some students and tooling. A short alias was requested without renaming the corpus or changing the language id / markdown fences.

### Pre-behavior

- Only `.typhon` was accepted as a Typhon source file (toolchain + IDE).

### Why it hurt

- No short peer extension for quick files or muscle-memory aliases.

### Post-behavior

- **Canonical:** `.typhon` (docs, scaffolding, preferred resolve).
- **Alias:** `.tpn` is a full peer for open / highlight / Run / transpile / import / project `main` / debug maps.
- Bare module resolve tries `.typhon` then `.tpn`; if both exist, prefer `.typhon`.
- Helpers: `SOURCE_EXTS`, `is_source_path`, `ensure_source_suffix`, `resolve_source_candidate`, `ends_with_source_ext`, `strip_source_ext`, `iter_source_files`.
- Extension 0.0.109 lists both extensions and dual `resourceExtname` when-clauses.

### Evidence

- `tests/test_source_ext_alias.py`
- `typhon-language` npm tests (`project-main`, `is-typhon-source`, package.json extensions)

## Trade-offs

- Teaching materials and `create-project` still emit `.typhon` only.
- Markdown fence language id stays `` ```typhon `` (not `tpn`).
