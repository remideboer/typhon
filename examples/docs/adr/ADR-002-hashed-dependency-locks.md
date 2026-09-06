# ADR-002: Hashed, fail-closed dependency locks

| | |
| --- | --- |
| Status | Accepted |
| Date | 2026-08-01 |
| Amended | 2026-08-09 (deps live in `typhon.toml`; lock remains sibling) |
| Commits | `4446848` |
| Code detail | [CER-001](../evolution/CER-001-security-boundaries.md) §6–7 |

## Context

Third-party packages for `.typhon` programs are shared via `~/.typhon/repository`, not
per-project venvs. Without exact pins and artifact hashes, classroom runs and CI
can silently pick different bits than the author reviewed.

## Decision

1. Every runnable project with Python deps keeps pins in **`typhon.toml`**
   (`[interpreter]` / `[dependencies]`) and a committed sibling **`typhon.lock`**
   (URL + SHA-256 per artifact, deps fingerprint, Python minor, platform).
2. Install uses **`pip --require-hashes --no-deps`** into a lock-digest cache.
3. Missing, stale, wrong-runtime, or bad-hash locks **fail closed** on run /
   transpile; unpinned run dependencies are rejected.
4. Authors refresh locks explicitly: `python -m transpiler deps lock`
   (default `./typhon.toml`).
5. npm packages use the same `typhon.toml` under `[dependencies.npm]` (central
   npm cache; no student-facing `package.json`). Legacy `typhon.deps` /
   `package.json` still load with a deprecation warning.

## Consequences

- Changing `[dependencies]` without regenerating the lock is a hard error —
  intentional.
- Platform-specific locks may be needed when artifacts differ (document in
  project README / CI); do not weaken hashing to paper over that.
- In this monorepo, a root `typhon.lock` (often `win-amd64`) must not leak into
  `run_source` tests for dep-free examples on Linux CI — bind
  `TYPHON_WORKSPACE_ROOT` (see [CER-001](../evolution/CER-001-security-boundaries.md) §4).
- Analysis may recognize locked modules without installing them
  (`lock_declares_module`).

## Rejected alternatives

- Flyweight install of “latest” on first use (non-reproducible, supply-chain drift)
- Hash-optional locks for convenience (fail-open under pressure)
