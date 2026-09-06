# NodeGUI temperature converter (JS emit target).

Native desktop UI via [@nodegui/nodegui](https://github.com/nodegui/nodegui)
(Qt bindings for Node). Pair with the Python Tk track under `examples/gui/temperature_tk`.

## Run

`typhon.toml` declares `@nodegui/nodegui` under `[dependencies.npm]` and
`target = "javascript"`. **Run** installs into
`~/.typhon/repository/npm/<fingerprint>/` and prefers **qode** from
that cache (NodeGUI’s Qt-enabled Node). Plain `node` fails with
`ERR_DLOPEN_FAILED` on `nodegui_core.node` because Qt DLLs are not loaded.

```text
python -m transpiler run examples/by-target/javascript/gui_nodegui/main.typhon
# or right-click typhon.toml → Run Project
```

No local `npm install` / silo `node_modules` required.

## Requirements

- Desktop session (not headless CI). Acceptance tests only **transpile** (or
  resolve the central env when `npm` is available).
- If the native addon still fails to load after a bad install: delete the
  hashed folder under `~/.typhon/repository/npm/` (or set `TYPHON_REPO` to a fresh
  temp) and re-Run; prefer an LTS Node for the **install** step (qode embeds
  Node 18).
