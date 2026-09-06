# T1 — Sensor log

**Whole task:** Produce a short lab log: identify the probe, record one temperature and one status flag, print a line a technician can read.

## Scaffolding

| Level | File | Your job |
|-------|------|----------|
| A Worked | [`1-worked.typhon`](1-worked.typhon) | Run it. Cover the file and retell the story (names + types). |
| B Completion | [`2-completion.typhon`](2-completion.typhon) | Replace every `TODO` so the log is honest and runs. |
| C Conventional | [`3-brief.md`](3-brief.md) | Only the brief — design your own `.typhon` file. |

## JIT (open only if blocked)

- [Declarations](../../jit/J-declare.md)
- [Print / interpolation](../../jit/J-print-interpolate.md)
- [Errors](../../jit/J-errors.md)

## Supportive (if the *idea* of types feels pointless)

- [S1 — Typhon as a contract](../../supportive/S1-typhon-as-contract.md)

## Success criteria (product)

1. Program runs.  
2. Each stored reading has an explicit type that matches its meaning.  
3. Printed line uses typed interpolation where the kind of value matters (`#i` / `#f` / `#s` / `#b`).  
4. You can say in one sentence why something is `const` or `fix` (if you used them).
