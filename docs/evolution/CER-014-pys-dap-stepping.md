# CER-014: Typhon source-level DAP stepping

| | |
| --- | --- |
| Status | Accepted |
| Date | 2026-08-03 |
| Amended | 2026-08-03 (UX maturity / deps); 2026-08-04 (Typhon-only default + Python depth mode + manifest entrypoint); 2026-08-05 (exact Typhon-line step filtering + toolbar toggle); 2026-08-09 (Node DAP + target-neutral maps) |
| Commits | (F-004 increment; debug UX maturity; deps on Debug; Node DAP) |
| Scope | `emit/python.py`; `emit/javascript.py`; `pipeline.py`; `transpiler.py`; `ide.py`; `typhon-language/extension.js`; `debug-map.js`; `debug-launch.js`; `debug-step-filter.js`; docs |
| ADRs | [ADR-014](../adr/ADR-014-pys-dap-stepping.md) |

## Context

F-004 / pipeline C2: students need breakpoints and step-over on `.typhon` lines.
Follow-up maturity: verified gutter glyphs, stop-on-entry, Variables/Watch names.

### Pre-behavior

- Emit ignored AST spans; no line map.
- `debugPysFile` launched `type: python` on `module: transpiler` /
  `args: ['run', file]` — debugger on the runner; student code in a child
  subprocess under `run_source`.

### Post-behavior (F-004)

- `emit_with_map` / `compile_typhon_with_map` / `transpile_with_modules_and_maps`
  produce statement maps `{py, pys}`; preamble unmapped.
- `ide.prepare_debug` writes temp modules + `*.typhonmap.json`; CLI
  `--prepare-debug <outdir> <file.typhon>`.
- Extension prepares artifacts, launches `program` under debugpy, remaps
  inbound `setBreakpoints` / `stackTrace` via `debug-map.js`.

### Post-behavior (UX maturity)

- Outbound `setBreakpoints` response + `breakpoint` events remap to `.typhon`.
- Launch **`stopOnEntry: false`** — run until a user breakpoint (not top-level halt).
- `typhon.clearAllBreakpoints` on editor context, gutter line-number context, tab
  title, and tab context menu.
- pysmap includes `names` (`_c_*` → Typhon) and `hidePrefixes`; tracker remaps
  `variables` and bare `evaluate` expressions.
- Lambda free-name walk treats outer aug-assign targets as captures.
- Extension **0.0.49**.

### Post-behavior (deps PYTHONPATH)

- `prepare_debug` resolves `typhon.deps` site paths like `run_source` and joins
  them into `pythonpath_prepend` after the temp module dir; also returns
  `python` for the launch config.
- Debug no longer fails with `ModuleNotFoundError` for locked packages
  (e.g. `mysql.connector`) that Run already finds.
- Extension **0.0.50**.

### Post-behavior (inline values)

- `InlineValuesProvider` for `.typhon` shows Locals as end-of-line ghost text
  while paused (`InlineValueText`); only names present in the current frame’s
  Locals/Args scopes (not Globals/Builtins); `typhon.debug.inlineValues`.
- Extension **0.0.54** (Map scope filter fix; was 0.0.53 empty inline values).
- Extension **0.0.55**: `remapVariables` applies pysmap `names` **before**
  `hidePrefixes`, so brace-scoped `_typhon_bN_*` locals (CER-015) display as
  their Typhon names in Variables and inline values (e.g. loop counter `i` on
  the `loop` header line).

### Post-behavior (logpoints)

- DAP `logMessage` remapped with Typhon→emitted identifier rewrite inside `{…}`.
- `typhon.addLogpoint` on gutter / editor context; messages go to Debug Console
  without suspending (IntelliJ-style logpoints).
- Extension **0.0.52**.

### Post-behavior (PYS-first stepping)

- `Typhon: Debug File` now uses `justMyCode: true`: normal Step Into stays in
  mapped Typhon/user code instead of entering Python dependencies.
- `Typhon Advanced: Debug Transpiled Python` is the explicit escape hatch:
  opens the generated `.py`, stops on entry, uses `justMyCode: false`, and
  leaves stack/Variables/evaluate in Python names.
- Both session modes still translate pre-existing `.typhon` breakpoints to the
  generated program. Only the normal mode remaps source views back to Typhon.
- `debug-mode.js` keeps the launch contract pure and unit-tested.
- Extension **0.0.68**.

### Post-behavior (manifest entrypoint parity)

- `prepare_debug` resolves contained `[project].main` through the same helper
  as Run/transpile and marks only that module as the entrypoint.
- Debugging a conflicting selected file is rejected or reconciled through the
  extension's Set as entrypoint action.
- Result propagation maps remain Typhon source sites; imported top-level code
  cannot gain panic handling from a debug launch.
- Extension **0.0.69**.

### Post-behavior (Typhon statement step filtering)

- Normal `Debug Typhon` sessions observe native DAP `next`, `stepIn`, and
  `stepOut` requests. Stops on additional generated Python lines for the same
  Typhon statement, or on lines with no **exact** Typhon map origin, automatically
  repeat the original step.
- Re-execution of the same exact generated/Typhon line remains visible, so loop
  iterations and recursion are not silently skipped.
- A different mapped Typhon line or mapped module is visible immediately, so Step
  Into still enters user functions across files.
- Breakpoint / exception / pause / data-breakpoint stops never auto-resume.
  Filtering has a 100-step cap and reports the fail-safe rather than looping.
- The debug toolbar shows a session-local filter toggle. Normal Typhon starts on;
  Advanced transpiled-Python remains off. Native step controls and keys do not
  change.
- `debug-step-filter.js` owns pure, unit-tested state; the tracker only supplies
  exact map locations and DAP requests.
- Extension **0.0.72**.

### Evidence

`tests/test_line_map.py`; `tests/test_prepare_debug.py`;
`tests/test_entrypoint_panic.py`;
`typhon-language/test/debug-map.test.js`;
`typhon-language/test/debug-mode.test.js`;
`typhon-language/test/debug-step-filter.test.js`;
`typhon-language/test/project-main.test.js`.

## Entry — Typhon-facing `null` in debug values

### Pre-behavior

Variables, Watch/evaluate, and inline values showed Python `None` for Typhon
`null`.

### Why it hurt

Students learn the source-level word `null`; leaking `None` breaks that model
(ADR-023).

### Post-behavior

`formatPysDebugValue` maps exact `None` to `null` in remapped Variables,
evaluate results, and inline values (extension ≥ 0.0.73).

### Evidence

`typhon-language/test/debug-map.test.js`.

## Entry — Node DAP (JavaScript emit)

### Pre-behavior

Extension blocked Debug when `typhon.emitTarget` was `javascript`. Maps and
trackers assumed `.py` / `py` sidecar keys only.

### Post-behavior

- `prepare_debug(..., target="javascript")` emits `.mjs` + `js`-keyed
  pysmaps; returns `runtimeExecutable` (node/qode); npm emit root matches Run.
- `debug-map.js` indexes `py`|`js` under `byGenerated` (alias `byPy`).
- `debug-launch.js` builds `python` vs `pwa-node` launch configs; extension
  registers the **same** tracker factory for both adapters.
- Advanced mode opens `.mjs` / uses `Debug Typhon (Transpiled JavaScript)`.

### Evidence

`tests/test_prepare_debug.py`; `typhon-language/test/debug-map.test.js`;
`typhon-language/test/debug-launch.test.js`; ADR-014 amend; F-010 item 1 Done.

## Trade-offs / deferred

- No scalar unwrap of `_TyphonShared` / `_TyphonAtomic` in Variables.
- `tasks` / ThreadPool thread debugging not specialized (F-010 item 2 for JS
  OS-thread/worker tasks).
- Column / `end_line` spans still unused.
- Custom standalone DAP server not built.
