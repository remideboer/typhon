# Typhon patterns — teaching demos and stubs

Runnable **pure OO** `.typhon` demos plus markdown notes. Layout:

| Folder | Contents |
|--------|----------|
| [`design/`](design/) | Gang of Four (creational / structural / behavioral) |
| [`concurrency/`](concurrency/) | Concurrency patterns expressible in Typhon today |
| [`general/`](general/) | Cross-cutting OO (e.g. Dependency Injection) |
| [`authentication/`](authentication/) | Common authentication patterns |
| [`architectural/`](architectural/) | MVC / MVP / MVVM / hexagonal / layered |
| [`persistence/`](persistence/) | Repository, Unit of Work, cache, concurrency |
| [`application/`](application/) | Service layer, DTO/ACL, pipeline, specification |
| [`authorization/`](authorization/) | RBAC / ACL / ABAC |
| [`resilience/`](resilience/) | Retry, circuit breaker, idempotency, … |
| [`messaging/`](messaging/) | Event-driven / pub-sub / CQRS / outbox / saga |
| [`testing/`](testing/) | Test doubles, Object Mother / Builder |
| [`reactive/`](reactive/) | Teaching push streams |

Companion `[name].md` files include intent, use cases, a run line, and
**Prompting an AI** (say this / not this / confusion to avoid).
OAuth2 / mTLS remain **stubs** (need IdP / TLS — not faked in-process).
Book: Session 10 in [`book/`](../../book/SUMMARY.md).

## Run

From the repo root (this folder has its own `typhon.toml`):

```text
python -m transpiler run examples/patterns/design/creational/singleton.typhon
python -m transpiler run examples/patterns/general/dependency_injection.typhon
python -m transpiler run examples/patterns/authentication/session_based.typhon
```

## Design (GoF)

### Creational

| Pattern | Code | Notes |
|---------|------|-------|
| Abstract Factory | [abstract_factory.typhon](design/creational/abstract_factory.typhon) | [md](design/creational/abstract_factory.md) |
| Builder | [builder.typhon](design/creational/builder.typhon) | [md](design/creational/builder.md) |
| Factory Method | [factory_method.typhon](design/creational/factory_method.typhon) | [md](design/creational/factory_method.md) |
| Prototype | [prototype.typhon](design/creational/prototype.typhon) | [md](design/creational/prototype.md) |
| Singleton | [singleton.typhon](design/creational/singleton.typhon) | [md](design/creational/singleton.md) — prefer [DI](general/dependency_injection.md) |

### Structural

| Pattern | Code | Notes |
|---------|------|-------|
| Adapter | [adapter.typhon](design/structural/adapter.typhon) | [md](design/structural/adapter.md) |
| Bridge | [bridge.typhon](design/structural/bridge.typhon) | [md](design/structural/bridge.md) |
| Composite | [composite.typhon](design/structural/composite.typhon) | [md](design/structural/composite.md) |
| Decorator | [decorator.typhon](design/structural/decorator.typhon) | [md](design/structural/decorator.md) |
| Facade | [facade.typhon](design/structural/facade.typhon) | [md](design/structural/facade.md) |
| Flyweight | [flyweight.typhon](design/structural/flyweight.typhon) | [md](design/structural/flyweight.md) |
| Proxy | [proxy.typhon](design/structural/proxy.typhon) | [md](design/structural/proxy.md) |

### Behavioral

| Pattern | Code | Notes |
|---------|------|-------|
| Chain of Responsibility | [chain_of_responsibility.typhon](design/behavioral/chain_of_responsibility.typhon) | [md](design/behavioral/chain_of_responsibility.md) |
| Command | [command.typhon](design/behavioral/command.typhon) | [md](design/behavioral/command.md) |
| Interpreter | [interpreter.typhon](design/behavioral/interpreter.typhon) | [md](design/behavioral/interpreter.md) |
| Iterator | [iterator.typhon](design/behavioral/iterator.typhon) | [md](design/behavioral/iterator.md) |
| Mediator | [mediator.typhon](design/behavioral/mediator.typhon) | [md](design/behavioral/mediator.md) |
| Memento | [memento.typhon](design/behavioral/memento.typhon) | [md](design/behavioral/memento.md) |
| Observer | [observer.typhon](design/behavioral/observer.typhon) | [md](design/behavioral/observer.md) |
| State | [state.typhon](design/behavioral/state.typhon) | [md](design/behavioral/state.md) |
| Strategy | [strategy.typhon](design/behavioral/strategy.typhon) | [md](design/behavioral/strategy.md) |
| Template Method | [template_method.typhon](design/behavioral/template_method.typhon) | [md](design/behavioral/template_method.md) |
| Visitor | [visitor.typhon](design/behavioral/visitor.typhon) | [md](design/behavioral/visitor.md) |

## Concurrency

Runnable demos use only `tasks` / `task` / `await` / `shared` / `atomic`
([CONCURRENCY.md](../../docs/CONCURRENCY.md)). No `import threading`.

| Pattern | Code | Notes |
|---------|------|-------|
| Active object | [active_object.typhon](concurrency/active_object.typhon) | [md](concurrency/active_object.md) |
| Balking | [balking.typhon](concurrency/balking.typhon) | [md](concurrency/balking.md) |
| Double-checked locking | [double_checked_locking.typhon](concurrency/double_checked_locking.typhon) | [md](concurrency/double_checked_locking.md) |
| Scheduler | [scheduler.typhon](concurrency/scheduler.typhon) | [md](concurrency/scheduler.md) |

### Out of language today

| Pattern | Why skipped |
|---------|-------------|
| Barrier | Needs reusable arrive-and-wait; `await` fan-in is not this pattern |
| Guarded suspension | Needs wait/notify |
| Monitor object | Needs mutual exclusion on methods |
| Readers–writer lock | Needs RW lock |
| Thread-local storage | No TLS |
| Thread pool | Emitter pools threads; Typhon cannot define/size one |
| Reactor | No selector / demux API |
| Nuclear reaction | Niche; same missing primitives |

## General

| Pattern | Code | Notes |
|---------|------|-------|
| Dependency Injection | [dependency_injection.typhon](general/dependency_injection.typhon) | [md](general/dependency_injection.md) |
| Service Locator | [service_locator_antipattern.typhon](general/service_locator_antipattern.typhon) | [md](general/service_locator_antipattern.md) — **anti-pattern**; prefer DI |

## Authentication

Pure OO teaching demos (no network). Full HTTP JWT shop:
[`examples/rest-api/shop/jwt/`](../rest-api/shop/jwt/).

| Pattern | Code | Notes |
|---------|------|-------|
| Session-based | [session_based.typhon](authentication/session_based.typhon) | [md](authentication/session_based.md) |
| Token-based | [token_based.typhon](authentication/token_based.typhon) | [md](authentication/token_based.md) |
| API key | [api_key.typhon](authentication/api_key.typhon) | [md](authentication/api_key.md) |
| HTTP Basic | [basic_auth.typhon](authentication/basic_auth.typhon) | [md](authentication/basic_auth.md) |

### Stubs

| Pattern | Notes |
|---------|-------|
| [OAuth 2.0](authentication/oauth2.md) | Needs external IdP / redirects |
| [mTLS](authentication/mtls.md) | Needs TLS client certificates |

## Architectural

| Pattern | Code | Notes |
|---------|------|-------|
| MVC | [mvc.typhon](architectural/mvc.typhon) | [md](architectural/mvc.md) |
| MVP | [mvp.typhon](architectural/mvp.typhon) | [md](architectural/mvp.md) |
| MVVM | [mvvm.typhon](architectural/mvvm.typhon) | [md](architectural/mvvm.md) |
| Hexagonal | [hexagonal.typhon](architectural/hexagonal.typhon) | [md](architectural/hexagonal.md) |
| Layered | [layered.typhon](architectural/layered.typhon) | [md](architectural/layered.md) — short stack |
| Multitier | [multitier.typhon](architectural/multitier.typhon) | [md](architectural/multitier.md) — three-tier / layer≠tier |

## Persistence

| Pattern | Code | Notes |
|---------|------|-------|
| Repository | [repository.typhon](persistence/repository.typhon) | [md](persistence/repository.md) |
| Unit of Work | [unit_of_work.typhon](persistence/unit_of_work.typhon) | [md](persistence/unit_of_work.md) |
| Cache-aside | [cache_aside.typhon](persistence/cache_aside.typhon) | [md](persistence/cache_aside.md) |
| Optimistic concurrency | [optimistic_concurrency.typhon](persistence/optimistic_concurrency.typhon) | [md](persistence/optimistic_concurrency.md) |
| Data Mapper vs Active Record | [data_mapper_vs_active_record.typhon](persistence/data_mapper_vs_active_record.typhon) | [md](persistence/data_mapper_vs_active_record.md) |
| Identity Map | [identity_map.typhon](persistence/identity_map.typhon) | [md](persistence/identity_map.md) |

## Application

| Pattern | Code | Notes |
|---------|------|-------|
| Service layer | [service_layer.typhon](application/service_layer.typhon) | [md](application/service_layer.md) |
| DTO / ACL | [dto_acl.typhon](application/dto_acl.typhon) | [md](application/dto_acl.md) |
| Pipeline / middleware | [pipeline_middleware.typhon](application/pipeline_middleware.typhon) | [md](application/pipeline_middleware.md) |
| Specification | [specification.typhon](application/specification.typhon) | [md](application/specification.md) |
| Null Object | [null_object.typhon](application/null_object.typhon) | [md](application/null_object.md) |
| Plugin | [plugin.typhon](application/plugin.typhon) | [md](application/plugin.md) |

## Authorization

| Pattern | Code | Notes |
|---------|------|-------|
| RBAC | [rbac.typhon](authorization/rbac.typhon) | [md](authorization/rbac.md) |
| ACL | [acl.typhon](authorization/acl.typhon) | [md](authorization/acl.md) |
| ABAC | [abac.typhon](authorization/abac.typhon) | [md](authorization/abac.md) |

## Resilience

| Pattern | Code | Notes |
|---------|------|-------|
| Retry | [retry.typhon](resilience/retry.typhon) | [md](resilience/retry.md) |
| Timeout | [timeout.typhon](resilience/timeout.typhon) | [md](resilience/timeout.md) |
| Circuit breaker | [circuit_breaker.typhon](resilience/circuit_breaker.typhon) | [md](resilience/circuit_breaker.md) |
| Bulkhead | [bulkhead.typhon](resilience/bulkhead.typhon) | [md](resilience/bulkhead.md) |
| Fallback | [fallback.typhon](resilience/fallback.typhon) | [md](resilience/fallback.md) |
| Rate limiting | [rate_limiting.typhon](resilience/rate_limiting.typhon) | [md](resilience/rate_limiting.md) |
| Idempotency | [idempotency.typhon](resilience/idempotency.typhon) | [md](resilience/idempotency.md) |

## Messaging

| Pattern | Code | Notes |
|---------|------|-------|
| Event-driven | [event_driven.typhon](messaging/event_driven.typhon) | [md](messaging/event_driven.md) |
| Publish–subscribe | [publish_subscribe.typhon](messaging/publish_subscribe.typhon) | [md](messaging/publish_subscribe.md) |
| CQRS | [cqrs.typhon](messaging/cqrs.typhon) | [md](messaging/cqrs.md) |
| Event sourcing | [event_sourcing.typhon](messaging/event_sourcing.typhon) | [md](messaging/event_sourcing.md) |
| Outbox | [outbox.typhon](messaging/outbox.typhon) | [md](messaging/outbox.md) |
| Saga | [saga.typhon](messaging/saga.typhon) | [md](messaging/saga.md) |
| Request–reply | [request_reply.typhon](messaging/request_reply.typhon) | [md](messaging/request_reply.md) |

## Testing

| Pattern | Code | Notes |
|---------|------|-------|
| Test doubles | [test_doubles.typhon](testing/test_doubles.typhon) | [md](testing/test_doubles.md) |
| Object Mother | [object_mother.typhon](testing/object_mother.typhon) | [md](testing/object_mother.md) |
| Test Data Builder | [test_data_builder.typhon](testing/test_data_builder.typhon) | [md](testing/test_data_builder.md) |

## Reactive

| Pattern | Code | Notes |
|---------|------|-------|
| Reactive (teaching) | [reactive.typhon](reactive/reactive.typhon) | [md](reactive/reactive.md) — push streams, not ReactiveX |

## Modern notes

- Prefer **program to an interface** and **composition over inheritance**.
- Prefer [Dependency Injection](general/dependency_injection.md) over Singleton globals.
- **Interpreter** is for tiny DSLs only.
