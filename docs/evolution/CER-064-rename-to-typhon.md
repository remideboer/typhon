# CER-064: Rename PYS → Typhon (full surface)

| | |
| --- | --- |
| Status | Accepted |
| Date | 2026-09-06 |
| Scope | Brand, `.typhon` sources, `typhon.toml`/`typhon.lock`, env `TYPHON_*`, `~/.typhon`, emit `_typhon_*` / `_Typhon*`, extension `typhon-language` / `remideboer.typhon-language`, CLI script `typhon` |
| Module | [`transpiler/brand.py`](../../transpiler/brand.py) |

## Context

The teaching language was branded **PYS**. The name **Typhon** (anagram of Python; **T** for typed) replaces it end-to-end.

### Pre-behavior

- Sources `*.pys`, fences ```` ```pys ````, lang id `pys`
- Manifests `pys.toml` / `pys.lock` / `pys.deps`
- Env `PYS_WORKSPACE_ROOT`, cache `~/.pys`, sidecars `.pysmap.json`
- Emit `_pys_*` / `_Pys*`; extension `pys-language` / commands `pys.*`
- CLI entry `pys`

### Why it hurt

- Brand did not communicate “typed Python-family teaching language”
- Short `pys` collided with casual shorthand and Marketplace identity churn

### Post-behavior

- Canonical constants in `transpiler/brand.py`
- Hard cut: no dual `.pys` / `pys.toml` support; clear errors if old names appear
- Marketplace id **`remideboer.typhon-language`** is a **new** extension (uninstall old `pys-language`)
- ELO zip is **`dist/typhon-student-<version>.zip`** (`prepare_elo_zip.py`; workflows upload that glob)
- GitHub remote is **`https://github.com/remideboer/typhon`** (renamed from `remideboer/pys`)
- Do not auto-migrate `~/.pys` caches — re-lock / delete old cache

### Evidence

- Full `pytest` + `typhon-language` npm tests
- Mechanical corpus rename + CER index

## Trade-offs

- Python import package remains `transpiler` / dist `python_transpiler`
- Icon asset filenames may still contain `pys-` until redesigned
- Accidental relocate of root `docs/` → `examples/docs/` in this commit was
  reversed in [CER-066](CER-066-restore-root-docs.md)
