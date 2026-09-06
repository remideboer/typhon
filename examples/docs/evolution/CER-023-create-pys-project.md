# CER-023: Create Typhon Project from activity bar

| | |
| --- | --- |
| Status | Accepted |
| Date | 2026-08-04 |
| Amended | 2026-08-04 (manifest entrypoint starter) |
| Commits | (extension 0.0.67) |
| Scope | `typhon-language/create-project.js`; `package.json` activity bar / welcome / `typhon.createProject`; `extension.js` |
| ADRs | [ADR-017](../adr/ADR-017-source-roots-same-package-tests.md); [ADR-002](../adr/ADR-002-hashed-dependency-locks.md) |

## Context

New learners needed a one-click layout matching declared source roots
(`src` / `tests` + `typhon.toml`) and an empty `typhon.deps` template. There was no
primary-sidebar Typhon surface for project setup.

### Pre-behavior

- No activity-bar container; project layout was hand-copied from docs/examples.

### Why it hurt

- Easy to miss ADR-017 roots and start with a flat folder (blocks same-package
  tests). Empty `typhon.deps` format was not discoverable next to Run Deps Lock (CER-022).

### Post-behavior

- Activity bar **Typhon** view with welcome + title **Create Typhon Project**.
- Scaffold: `src/main.typhon`, `tests/.gitkeep`, unified `typhon.toml`
  (`[project].main`, optional emit `target`, `main`/`test` source roots,
  `[interpreter]` / `[dependencies]` comments). See **CER-051** for target
  QuickPick + host runtime ensure.
- The starter source has documented output and is immediately runnable through
  the same manifest entrypoint contract as CLI, Run Main, and Debug.
- Pure scaffold helper unit-tested.

### Evidence

- `typhon-language/test/create-project.test.js`

## Trade-offs

- Folder name is `tests` (ADR-017), not `test`.
- Uses one minimal `src/main.typhon`; it does not invent domain structure.
- Does not auto-open a multi-root workspace; offers Open Folder after create.
