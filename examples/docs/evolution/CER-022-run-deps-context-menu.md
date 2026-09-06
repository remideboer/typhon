# CER-022: Run Deps from typhon.deps context menu

| | |
| --- | --- |
| Status | Accepted |
| Date | 2026-08-04 |
| Commits | (extension 0.0.66) |
| Scope | `typhon-language/package.json` menus; `extension.js` `typhon.lockDeps` / `lockDepsFile` |
| ADRs | [ADR-002](../adr/ADR-002-hashed-dependency-locks.md) (lock refresh remains explicit) |

## Context

After editing `typhon.deps`, authors must run `python -m transpiler deps lock`
(ADR-002). Students and teachers often only know the IDE; there was no
discoverable surface on the deps file itself.

### Pre-behavior

- Explorer / editor context menus for `typhon.deps` had no Typhon action.
- Locking required a terminal / CLI knowledge of `deps lock`.

### Why it hurt

- Fail-closed locks (CER-001 / ADR-002) look like “broken Run” when `typhon.lock`
  is stale; the refresh step was hard to find.

### Post-behavior

- Command **Typhon: Run Deps** (`typhon.lockDeps`) on `resourceFilename == 'typhon.deps'`:
  explorer context, editor context, editor title, command palette.
- Opens a terminal and runs `python -m transpiler deps lock <typhon.deps>` with the
  same bundled `PYTHONPATH` / workspace env as Run (ADR-001 containment).

### Evidence

- Manual: right-click `typhon.deps` → Run Deps; terminal prints lock path.
- Extension **0.0.66**.

## Entry 2 — rename to Run Deps Lock

### Pre-behavior

Menu title was **Run Deps**, which understated that the action is `deps lock`.

### Why it hurt

Authors could confuse it with “run the program’s dependencies” rather than
regenerating `typhon.lock`.

### Post-behavior

Command title (and template / welcome copy) is **Typhon: Run Deps Lock**. Command
id stays `typhon.lockDeps`. Extension **0.0.76**.

### Evidence

`package.json` command title; `create-project.js` template comment;
root README imports / dependency sections.

## Trade-offs

- Does not auto-lock on save (still explicit per ADR-002).
- Filename must be exactly `typhon.deps` (case-sensitive on Linux).
