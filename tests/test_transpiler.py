from pathlib import Path

from transpiler.transpiler import transpile


def test_transpile_repeat_syntax() -> None:
    source = """repeat 3 times:
    print hello
"""
    expected = """def _typhon_format(value):
    return "null" if value is None else str(value)
for _ in range(3):
    print(_typhon_format(hello))
"""
    assert transpile(source) == expected
