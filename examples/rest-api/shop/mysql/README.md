# Phase 2 — MySQL-backed shop REST

Same HTTP JSON surface as [`../memory/`](../memory/), but repositories use
MySQL (`ShopDatabase` + mappers) matching the console shop schema.

**Diff vs memory:** `store.typhon` / `db.typhon` / `mappers.typhon` / `repositories.typhon`
— transport and `api_*.typhon` stay the same shape.

## Setup

```bash
mysql -u pys -p < examples/rest-api/shop/mysql/shop.sql
mysql -u pys -p shop < examples/rest-api/shop/mysql/seed_boardgames.sql
```

Credentials default to `typhon` / `123456789` / `shop` (see `src/config.typhon`).

## Run

```bash
python -m transpiler run examples/rest-api/shop/mysql/src/main.typhon
curl http://127.0.0.1:8091/health
curl http://127.0.0.1:8091/api/products
```

Or right-click this folder’s `typhon.toml` → **Run Project**.

Port **8091** (memory uses 8090).

## Tests (CI without live MySQL)

```bash
set TYPHON_WORKSPACE_ROOT=examples\rest-api\shop\mysql
python -m pytest tests/test_rest_shop_mysql.py -q
```

Transpile gate only — live CRUD needs a running MySQL (manual / local).

## Routes

Identical to memory: `/api/products`, `/api/orders`, `/api/orders/{id}/lines`, …
