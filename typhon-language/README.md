# Typhon Language Extension

VS Code / Cursor extension for the Typhon teaching language. The **transpiler is
bundled** in the VSIX — students do not `pip install` this repo.

## Features

- `*.typhon` language association and TextMate syntax highlighting
- Brace-based indentation and `##` … `/#` block comments
- Snippets for functions, classes, loops, results, nullable values, `inherits`, and interpolation
- Keyword / type completions and hover hints
- Go to Definition / **Find Usages** (editor context menu on the identifier under the cursor)
  - Optional: settings → **Typhon: Navigate Library Sources** (`typhon.navigateLibrarySources`)
    to F12 into Python files from the locked `typhon.toml` / `typhon.lock` env (trusted workspace only;
    off by default — ADR-001)
- Language / file icons for `.typhon`
- Markdown ` ```typhon ` fences: editor + preview highlighting
- **Run** and **Debug** using the bundled transpiler
  - Debug: breakpoints / step / inline values / Variables on `.typhon`
  - Typhon-only stepping is on by default: native Step Over/Into/Out skip extra
    generated Python lines and stop at the next mapped Typhon statement
  - Filter icon in the debug toolbar toggles Typhon-only stepping for this session;
    breakpoints, exceptions, and Pause are never skipped
  - **Typhon Advanced: Debug Transpiled Python** opens generated `.py` and permits stepping into Python internals
  - Halts at BPs; Clear All Breakpoints in context/gutter/tab; needs Microsoft Python extension
  - `Ctrl+Shift+R` / `Ctrl+Shift+D` — run/debug current `.typhon` file
  - `Ctrl+Alt+R` / `Ctrl+Alt+D` — run/debug configured main file
  - `[project].main` in `typhon.toml` is authoritative; right-click
    **Set as entrypoint** updates it
  - `typhon.mainFile` is a deprecated fallback only when no manifest exists
- `nullable<T>` highlighting, hover, diagnostics, and quick fixes (make nullable /
  surround with null check); debugger Variables show `null` not Python `None`
- `result<T,E>`, `ok` / `error`, `propagate`, and result-pattern highlighting,
  completions, hovers, snippets, diagnostics, and entrypoint conflict fixes
- Libraries: project `typhon.toml` `[dependencies]` → shared `~/.typhon/repository` (no venv)
  - Right-click **`typhon.toml`** → **Typhon: Run Deps Lock** (runs `deps lock` / refreshes `typhon.lock`)
- **Typhon activity bar** (sidebar icon): **Create Typhon Project** — scaffolds a
  runnable `src/main.typhon`, `tests/`, `typhon.toml` (`[project].main` and
  `[source_roots]`), and `[dependencies]` templates in the same file

## Install (students)

**Marketplace (preferred):** Extensions → **Typhon Language Support**  
(`ext install remideboer.typhon-language`). Leave auto-update on.

**ELO / offline:** unzip `typhon-student-<version>.zip` → `install.cmd` / `install.sh` → reload.

Requires **system Python 3.10+** on PATH. The extension bundles the transpiler.

## Publish (maintainers)

See [`PUBLISH.md`](PUBLISH.md): Marketplace tag publish + ELO zip on the GitHub Release.

## Develop (contributors)

From the repo root:

```powershell
cd typhon-language
npm run prepare
npm run package
```

`prepare` copies `../transpiler` into `bundled/transpiler` (gitignored). Then F5
in the extension host, or install the built `.vsix`.

Live diagnostics still resolve `transpiler.ide` via workspace `PYTHONPATH` until
a later phase; **Run always uses the bundled copy**.
