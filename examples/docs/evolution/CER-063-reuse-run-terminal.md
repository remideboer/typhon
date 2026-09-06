# CER-063: Reuse Run Typhon terminal

| | |
| --- | --- |
| Status | Accepted |
| Date | 2026-08-11 |
| Scope | `typhon-language/run-terminal.js`; `extension.js` `runPysFile` |
| ADRs | [ADR-001](../adr/ADR-001-security-boundaries.md) (trust / workspace boundary unchanged) |

## Context

Run File / Run Project / Run Main each opened a fresh integrated terminal. Repeated
runs littered the terminal dropdown with many `Run Typhon` entries.

### Pre-behavior

- Every `runPysFile` called `vscode.window.createTerminal` with name `Run Typhon` or
  `Run Typhon (Node)`

### Why it hurt

- Terminal list grew on every run; students closed tabs manually

### Post-behavior

- `pickRunTerminal` reuses the active terminal when its name matches, else the
  first open terminal with that name; create only when none exists
- Python and Node keep separate named terminals
- Install / Deps terminals still create fresh (out of scope)

### Evidence

- `typhon-language/test/run-terminal.test.js`

## Trade-offs

- Reuse does not refresh `cwd` / `env` from the first create (run command uses an
  absolute path; workspace env is set on first create)
- Historical duplicate `Run Typhon` tabs are not auto-disposed
