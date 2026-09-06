# Concurrent webserver (Typhon)

Project root for the I/O-bound concurrent HTTP server (see
`concurrent-webserver-spec.md` / `concurrent-webserver-testplan.md`).

Layout uses **`typhon.toml` `[source_roots]`** (ADR-017): production under `src/`,
tests under `tests/` — same package (root-relative `.`), so `package` types stay
visible to tests without widening modifiers.

## Canonical Typhon style

- **OO**: `package class` / `package interface` for domain types.
- **Least privilege**: `package` exports only (no `global` app API).
- **Concurrency**: `tasks` / `task` acceptor + workers; `shared` queue/objects;
  instance locks where class fields need cross-task mutation.

## Run tests

```bash
python -m transpiler run examples/webserver/tests/test_core.typhon
python -m transpiler run examples/webserver/tests/test_integration.typhon
python -m transpiler run examples/webserver/tests/test_faults.typhon
python -m transpiler run examples/webserver/tests/test_inbound_shed.typhon
python -m transpiler run examples/webserver/tests/test_http_e2e.typhon
python -m transpiler run examples/webserver/tests/test_http_keepalive_e2e.typhon
python -m transpiler run examples/webserver/tests/test_timeouts.typhon
python -m transpiler run examples/webserver/tests/test_https_e2e.typhon
python -m transpiler run examples/webserver/tests/test_http2_e2e.typhon
python examples/webserver/scripts/check_idempotency.py
python -m pytest tests/test_webserver_idempotency_gate.py -q
```

First HTTP/2 run installs locked `h2` (see `typhon.toml` / `typhon.lock`). On another
OS/Python minor, refresh with `python -m transpiler deps lock examples/webserver/typhon.toml`.

## Run server

```bash
python -m transpiler run examples/webserver/src/main.typhon
curl http://127.0.0.1:8080/health
curl http://127.0.0.1:8080/proxy/data
curl http://127.0.0.1:8080/proxy/slow
curl http://127.0.0.1:8080/metrics
```

### HTTPS + HTTP/2 (FR5 / FR2)

```bash
python examples/webserver/scripts/gen_dev_certs.py
```

In `src/main.typhon`, set `cfg.tlsEnabled = true`. TLS advertises ALPN `h2` and
`http/1.1`; cleartext stays HTTP/1.1 only.

```bash
python -m transpiler run examples/webserver/src/main.typhon
curl -k https://127.0.0.1:8080/health
curl -k --http2 https://127.0.0.1:8080/health
```

## Load (k6) — testplan A/B/C subsets + manual soak

See [`load/README.md`](load/README.md) and [`load/SOAK.md`](load/SOAK.md).

| k6 script | Testplan |
|-----------|----------|
| `load/k6/baseline.js` | A1 subset |
| `load/k6/overload.js` | B1 subset (503 pool / 429 inbound) |
| `load/k6/pool_exhaust.js` | C1 subset |
| `load/k6/soak.js` | H1 manual ≥1k VU (not CI) |
| `load/k6/tls_handshake.js` | A3 subset (HTTPS; enable `tlsEnabled`) |
| `load/k6/http2_multiplex.js` | A2 subset (HTTPS+h2; enable `tlsEnabled`) |

## Layout

| Path | Role |
|------|------|
| `typhon.toml` | `[source_roots] main=src test=tests` |
| `src/*.typhon` | Production package (pool, breaker, HTTP, router, main) |
| `tests/test_*.typhon` | Same package — `package` visibility without `public` widening |
| `certs/` | Local TLS PEMs (gitignored; see `certs/README.md`) |
| `scripts/` | Idempotency gate, cert generation |
| `load/k6/` | Load scenarios |

## Increment status

1–6 — done.  
Source-root layout — done (F-006 / ADR-017).  
Full-spec remainder — **done** ([F-007](../../docs/TODO-FUTURE.md#f-007-webserver-full-spec-remainder) / [CER-034](../../docs/evolution/CER-034-webserver-full-spec.md)).  
See [`DEFERRED.md`](DEFERRED.md) for the delivery map.
