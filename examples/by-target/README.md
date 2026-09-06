# Target-dependent examples
#
# Showcase language demos that need a specific emit target / native packages
# live here so each silo can own a single `typhon.toml` (entrypoint + deps).
#
# Target-independent dense showcase: [`../main.typhon`](../main.typhon)
# Existing Python GUI track (Tk / ttkbootstrap / PyQt): [`../gui/`](../gui/)

| Path | Target | Notes |
| --- | --- | --- |
| [`python/mysql/`](python/mysql/) | Python | `mysql-connector-python` via `[dependencies]` → central repo |
| [`javascript/mysql/`](javascript/mysql/) | JavaScript | `mysql2` via `[dependencies.npm]` → central npm cache |
| [`javascript/gui_nodegui/`](javascript/gui_nodegui/) | JavaScript | [@nodegui/nodegui](https://github.com/nodegui/nodegui) (runs under **qode**) |
| [`javascript/rest-api/express/`](javascript/rest-api/express/) | JavaScript | Express shop (memory → mysql → jwt); ports 8190–8192 |

## JavaScript deps (central repo)

Declare npm packages under `[dependencies.npm]` in the silo’s `typhon.toml`, and
set `target = "javascript"` under `[project]`. **Run Project** on that toml
(or bare `transpiler run` without `--target`) uses it. **Run** installs into
`~/.typhon/repository/npm/<fingerprint>/` — no local `npm install` / silo
`node_modules` required.

```text
python -m transpiler run examples/by-target/javascript/mysql/main.typhon
# same as --target javascript when typhon.toml has target = "javascript"
```

Override the cache root with `TYPHON_REPO` (same as Python wheels: `$TYPHON_REPO/npm/...`).
