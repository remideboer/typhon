# Concurrency examples

Structured concurrency for Typhon: `tasks`, `task`, `await`, `shared`.

**Documentation:** [`docs/CONCURRENCY.md`](../../docs/CONCURRENCY.md)

## Run

```bash
# Offline / CI-friendly (no network)
python -m transpiler run examples/concurrency/main.typhon

# Live HTTPS package (needs network)
python -m transpiler run examples/concurrency/http/http_main.typhon
```

## Layout

| File | Demos |
|------|--------|
| `main.typhon` | Entry — runs every offline demo below |
| `interleaving.typhon` | Two tasks print in a loop so output **mixes** (time slicing) |
| `basics.typhon` | Join, **task parameters**, task-local vars |
| `awaiting.typhon` | Named `await`, parameterized fan-in / chain / args |
| `shared_state.typhon` | `shared` plus parameterized updates |
| `pipeline.typhon` | Sequential groups / stages |
| `more.typhon` | Many workers, mixed patterns |
| `http/` | Live HTTPS package (Open-Meteo + DownStatus) |

### Live HTTP package (`http/`)

| File | Role / visibility |
|------|-------------------|
| `http_main.typhon` | Entry — named imports of package demos only |
| `http_client.typhon` | `package` `httpGetJson` shared by siblings |
| `open_meteo.typhon` | Open-Meteo demos (`package`); helpers module-private |
| `down_status.typhon` | DownStatus top-10 demos (`package`); helpers module-private |

Least privilege: helpers and constants stay module-private (default). Demos and
the shared GET are `package` so only files in `http/` can import them — nothing
is `global`.

**Open-Meteo** ([open-meteo.com](https://open-meteo.com/)) — CC BY 4.0.  
**DownStatus** ([API docs](https://isitdownstatus.com/en/api-docs)) — free JSON, no key.

What it teaches:

- Blocking `urllib` inside a `task` overlaps with sibling tasks (thread-pool I/O).
- Auto-started tasks -> parallel wall time ~ slowest GET; sequential ~ sum.
- Parameterized `await` returns values but starts one-at-a-time in one consumer.
- Package vs module visibility for multi-file examples.

## Input / output pattern

```typhon
tasks {
    task add(int a, int b) {
        return a + b
    }
    task {
        int s = await add(10, 32)
        print(s)
    }
}
```

Prefer parameters for inputs; use `shared` only for intentional cross-task mutation.

Await edges inside one `tasks` group must form a DAG (no `a`↔`b` cycles) —
the transpiler rejects cycles. See `docs/CONCURRENCY.md` §2b.
