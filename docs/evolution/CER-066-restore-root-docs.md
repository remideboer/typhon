# CER-066: Restore root `docs/` (undo mistaken relocate)

| | |
| --- | --- |
| Status | Accepted |
| Date | 2026-09-06 |
| Scope | Project documentation tree; `project-memory.mdc` paths |
| Module | [`docs/`](../), [`.cursor/rules/project-memory.mdc`](../../.cursor/rules/project-memory.mdc) |

## Context

During the PYS → Typhon rename (`53b91db` / CER-064), the entire root `docs/`
tree was relocated to `examples/docs/` and project-memory indexes were pointed
there. That was out of scope for the rebrand and broke the long-standing layout
(LANGUAGE, EBNF, railroad, CERs, ADRs at repo-root `docs/`).

### Pre-behavior (wrong)

- Canonical docs lived under `examples/docs/`
- CER/ADR indexes in `project-memory.mdc` used `examples/docs/…`

### Why it hurt

- Teaching / architecture docs are not example programs; nesting them under
  `examples/` hid the primary documentation surface and contradicted book,
  README, and tutorial links that already targeted root `docs/`

### Post-behavior

- `git mv examples/docs docs` restores the tree at repo root
- `project-memory.mdc` again indexes `docs/evolution/` and `docs/adr/`

### Evidence

- Path greps: no remaining `examples/docs` references in tracked sources
- `tests/test_book_links.py` asserts `docs/LANGUAGE.md` on `main`

## Trade-offs

- None; this reverses an accidental relocate only
