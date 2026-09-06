# Source roots teaching example (ADR-017 / F-006)

| Path | Role |
|------|------|
| `typhon.toml` | `[source_roots] main=src test=tests` |
| `src/billing/Invoice.typhon` | package `billing` — production `package` types |
| `tests/billing/InvoiceTest.typhon` | same package — uses `package` exports |
| `tests/test_utils/WrongPlaceTest.typhon` | wrong package — enable import to see diagnostic + QF |

```bash
python -m transpiler run examples/source_roots/tests/billing/InvoiceTest.typhon
# → Ada: 150 cents
```

**Rejected by design:** private field access from tests; C# `namespace` /
`partial class` (see requirements doc).
