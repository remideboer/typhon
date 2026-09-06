"""`.tpn` is accepted as an alias of `.typhon` (CER-065)."""
from __future__ import annotations

from pathlib import Path

import pytest

from transpiler.brand import (
    SOURCE_EXT,
    SOURCE_EXT_ALIAS,
    SOURCE_EXTS,
    ends_with_source_ext,
    ensure_source_suffix,
    is_source_path,
    resolve_source_candidate,
    strip_source_ext,
)
from transpiler.project_manifest import resolve_entrypoint
from transpiler.transpiler import TranspileError, run_source, transpile_path


def test_is_source_path_accepts_both_extensions() -> None:
    assert is_source_path(Path("main.typhon"))
    assert is_source_path(Path("main.tpn"))
    assert is_source_path("Main.TPN")
    assert not is_source_path(Path("main.py"))
    assert SOURCE_EXTS == (SOURCE_EXT, SOURCE_EXT_ALIAS)


def test_ensure_and_strip_source_suffix() -> None:
    assert ensure_source_suffix(Path("foo")).name == "foo.typhon"
    assert ensure_source_suffix(Path("foo.tpn")).name == "foo.tpn"
    assert strip_source_ext("mod.typhon") == "mod"
    assert strip_source_ext("mod.tpn") == "mod"
    assert ends_with_source_ext("x.tpn")
    assert not ends_with_source_ext("x.py")


def test_resolve_source_candidate_prefers_typhon(tmp_path: Path) -> None:
    (tmp_path / "both.typhon").write_text("print(1);\n", encoding="utf-8")
    (tmp_path / "both.tpn").write_text("print(2);\n", encoding="utf-8")
    (tmp_path / "only.tpn").write_text("print(3);\n", encoding="utf-8")
    assert resolve_source_candidate(tmp_path / "both").name == "both.typhon"
    assert resolve_source_candidate(tmp_path / "only").name == "only.tpn"
    assert resolve_source_candidate(tmp_path / "missing") is None


def test_transpile_and_run_tpn_file(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("TYPHON_WORKSPACE_ROOT", str(tmp_path))
    src = tmp_path / "hello.tpn"
    src.write_text('print("hi");\n', encoding="utf-8")
    out = tmp_path / "hello.py"
    transpile_path(src, out)
    assert "hi" in out.read_text(encoding="utf-8")
    assert run_source(src) == 0


def test_manifest_main_accepts_tpn(tmp_path: Path) -> None:
    (tmp_path / "typhon.toml").write_text(
        '[project]\nmain = "app.tpn"\n',
        encoding="utf-8",
    )
    app = tmp_path / "app.tpn"
    app.write_text("print(1);\n", encoding="utf-8")
    assert resolve_entrypoint(tmp_path).resolve() == app.resolve()


def test_bare_import_resolves_tpn_sibling(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("TYPHON_WORKSPACE_ROOT", str(tmp_path))
    (tmp_path / "lib.tpn").write_text(
        "global function int answer() {\n    return 42;\n}\n",
        encoding="utf-8",
    )
    main = tmp_path / "main.typhon"
    main.write_text(
        "import answer from lib;\nprint(answer());\n",
        encoding="utf-8",
    )
    assert run_source(main) == 0


def test_entrypoint_rejects_non_source(tmp_path: Path) -> None:
    py = tmp_path / "x.py"
    py.write_text("print(1)\n", encoding="utf-8")
    with pytest.raises(TranspileError, match=r"\.typhon.*\.tpn"):
        resolve_entrypoint(py)
