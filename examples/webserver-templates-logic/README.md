# Template HTTP server — loops & conditionals

Extends the placeholder-only example
([`../webserver-templates/`](../webserver-templates/), CER-039) with:

| Tag | Meaning |
|-----|---------|
| `{{ name }}` / `{{ p.price }}` | Variable / dotted lookup (HTML-escaped) |
| `{% if key %}…{% else %}…{% endif %}` | Conditional (truthy context value) |
| `{% for x in list %}…{% endfor %}` | Loop over a list (nested `{{ x.field }}` OK) |

Port **8102**.

## Run

```bash
python -m transpiler run examples/webserver-templates-logic/src/main.typhon
curl http://127.0.0.1:8102/shop
curl http://127.0.0.1:8102/empty
```

`/shop` shows a sale banner and two products; `/empty` shows the else branches.

Query-string binding is a separate example:
[`../webserver-templates-query/`](../webserver-templates-query/) (port **8103**, CER-041).

## Tests

```bash
set TYPHON_WORKSPACE_ROOT=examples\webserver-templates-logic
set TYPHON_TEMPLATES_DIR=examples\webserver-templates-logic\templates
python -m transpiler run examples/webserver-templates-logic/tests/test_logic.typhon
python -m pytest tests/test_webserver_templates_logic.py -q
```
