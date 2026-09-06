# FastAPI shop — library field research (not a teaching example)

Typhon + [FastAPI](https://fastapi.tiangolo.com/) under `library-tests/` to prove
**library decorator application** ([ADR-026](../../docs/adr/ADR-026-library-decorators.md))
against a mature stack: JWT login, bcrypt passwords, MySQL `shop` schema
(accounts / NL addresses / fake payment instruments).

Teaching hand-rolled HTTP shops stay under `examples/rest-api/shop/` (ports
8090–8092). This app listens on **8093**.

## Prerequisites

1. Schema + seed (shared with console/REST shops):

```text
mysql -u pys -p123456789 < examples/database/shop.sql
mysql -u pys -p123456789 shop < examples/database/seed_boardgames.sql
```

2. Lock deps (once per machine/platform):

```text
python -m transpiler deps lock library-tests/fastapi-shop/typhon.toml
```

## Run

From the repo root (no `TYPHON_WORKSPACE_ROOT` — `typhon.toml` bounds the project):

```text
python -m transpiler run library-tests/fastapi-shop
```

Or the entry file: `python -m transpiler run library-tests/fastapi-shop/src/main.typhon`

- OpenAPI UI: http://127.0.0.1:8093/docs
- Health: `GET /health`
- Login: `POST /api/login` with seeded users (password **`Welcome1!`** for all):
  `admin`, `clerk`, `amira`, `mehmet`, `priya`, …

## Auth model

| Method | Auth |
|--------|------|
| GET | open |
| POST /api/login | open |
| other POST/PUT/DELETE | `Authorization: Bearer <token>` |

JWT is stdlib HS256 (same teaching approach as `examples/rest-api/shop/jwt`).
PyJWT is deferred until Typhon has `try`/`catch` for invalid-token errors.
Passwords use **bcrypt** against `account.password_hash`.

### Field-research notes (Typhon ↔ FastAPI)

- Route decorators (`@appRouter.get` / `.post` / …) are ADR-026 library application.
- Path templates use `chr(123)`/`chr(125)` via [`paths.typhon`](src/paths.typhon) — brace chars inside Typhon strings become f-string interpolations.
- JSON bodies are read with `Request` + `anyio.from_thread.run(request.json)` ([`json_body.typhon`](src/json_body.typhon)) because Typhon has no default parameter values for `Body()`.
- Emit keeps PascalCase param annotations (`Request`) so FastAPI can inject them.
- Module wiring uses a dict holder ([`state.typhon`](src/state.typhon)) — plain module reassignment inside `bind` would be Python locals without `global`.
- Typing mirrors the teaching MySQL shop: `MySQLConnection` / `MySQLCursor`, domain
  `entity` types ([`models.typhon`](src/models.typhon)), tuple→entity mappers, and
  entity→dict views for the FastAPI JSON edge. Prefer those over `object` /
  bare `dict` rows (`object` stays for true foreign unions such as
  `dict | JSONResponse` route returns and JWT decode bytes).

## Curl sketch

```text
curl -s http://127.0.0.1:8093/health
curl -s -X POST http://127.0.0.1:8093/api/login -H "Content-Type: application/json" -d "{\"username\":\"amira\",\"password\":\"Welcome1!\"}"
curl -s http://127.0.0.1:8093/api/products
curl -s http://127.0.0.1:8093/api/accounts/3/addresses
curl -s -X POST http://127.0.0.1:8093/api/products -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d "{\"sku\":\"X\",\"name\":\"Y\",\"unitPrice\":1.5}"
```

## Layout

| File | Role |
|------|------|
| `src/main.typhon` | FastAPI app + uvicorn |
| `src/models.typhon` | Domain entities (`Product`, `Account`, …) |
| `src/mappers.typhon` | SQL tuple → entity |
| `src/views.typhon` | Entity → JSON dict (no password hashes) |
| `src/routes_*.typhon` | `@router.get` / `.post` / … |
| `src/security.typhon` | bcrypt + JWT |
| `src/db.typhon` | `ShopDatabase` (`MySQLCursor`) |
| `typhon.toml` | fastapi, uvicorn, mysql-connector, bcrypt, httpx |
