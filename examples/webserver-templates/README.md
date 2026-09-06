# Template HTTP server

Renders HTML from `templates/` with `{{key}}` placeholders (HTML-escaped).
Port **8101**. Separate from the static-file server so students see the
templating layer alone.

For `{% if %}` / `{% for %}`, use
[`../webserver-templates-logic/`](../webserver-templates-logic/) (port **8102**, CER-040).
For query-string → template binding, use
[`../webserver-templates-query/`](../webserver-templates-query/) (port **8103**, CER-041).

## Run

```bash
python -m transpiler run examples/webserver-templates/src/main.typhon
curl http://127.0.0.1:8101/hello
```

Expected body contains `Hello, <strong>Ada</strong>!`.

## Tests

```bash
set TYPHON_WORKSPACE_ROOT=examples\webserver-templates
set TYPHON_TEMPLATES_DIR=examples\webserver-templates\templates
python -m transpiler run examples/webserver-templates/tests/test_templates.typhon
python -m pytest tests/test_webserver_templates.py -q
```
