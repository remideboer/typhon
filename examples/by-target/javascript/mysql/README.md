# Node MySQL silo (`mysql2`).

`typhon.toml` declares `mysql2` under `[dependencies.npm]` and
`target = "javascript"`. **Run** installs into
the central npm cache (`~/.typhon/repository/npm/<fingerprint>/`) — no local
`npm install` needed.

```text
python -m transpiler run examples/by-target/javascript/mysql/main.typhon
# or right-click typhon.toml → Run Project
```

Use the **workspace** transpiler (repo root on `PYTHONPATH`, or run from
`D:\projecten\python-transpiler`). An IDE terminal that prepends the extension
`bundled/` copy may reject `import mysql2` until that bundle is rebuilt.

Uses the **callback** API so the demo stays within today's JS emitter
(no `tasks` / `await`). Promise/`mysql2/promise` can wait for concurrency emit.
