# Phase 1 — Express in-memory shop (JavaScript target)

JSON shop API on **Node Express**. Domain/repos match the Python
[`examples/rest-api/shop/memory`](../../../../../rest-api/shop/memory) track;
transport is Express (no DIY HTTP stack).

## Run

```bash
python -m transpiler run examples/by-target/javascript/rest-api/express/memory/src/main.typhon
```

Or right-click this folder’s `typhon.toml` → **Run Project** (`target = "javascript"`).

Do **not** run `deps lock` on this silo: it only has `[dependencies.npm]`.
There is no `typhon.lock`; Express installs on Run into `~/.typhon/repository/npm/`.

Listens on `127.0.0.1:8190`. Seeds three board-game products.

## Tests

```bash
set TYPHON_WORKSPACE_ROOT=examples\by-target\javascript\rest-api\express\memory
python -m transpiler run examples/by-target/javascript/rest-api/express/memory/tests/test_repos.typhon --target javascript
python -m transpiler run examples/by-target/javascript/rest-api/express/memory/tests/test_api.typhon --target javascript
```

## Curl cookbook

### Health

```bash
curl -s http://127.0.0.1:8190/health
```

Expected: `{"ok":true}`

### List / create products

```bash
curl -s http://127.0.0.1:8190/api/products
curl -s -X POST http://127.0.0.1:8190/api/products -H "Content-Type: application/json" -d "{\"sku\":\"BG-NEW\",\"name\":\"New Game\",\"unitPrice\":12.5}"
```

### Orders + lines

```bash
curl -s -X POST http://127.0.0.1:8190/api/orders -H "Content-Type: application/json" -d "{\"status\":\"placed\",\"customerRef\":\"ada@example.com\"}"
curl -s -X POST http://127.0.0.1:8190/api/orders/1/lines -H "Content-Type: application/json" -d "{\"productId\":2,\"quantity\":2}"
```

## Layout

| Path | Role |
|------|------|
| `src/main.typhon` | Express `listen` |
| `src/app.typhon` | Route wiring |
| `src/api_*.typhon` | CRUD → `ApiResponse` |
| `src/repositories.typhon` | In-memory store |
| `src/models.typhon` | Entities |
