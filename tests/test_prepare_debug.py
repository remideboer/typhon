"""prepare_debug: temp .py + pysmap sidecars for DAP."""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from transpiler.ide import main as ide_main
from transpiler.ide import prepare_debug
from transpiler.workspace import WORKSPACE_ROOT_ENV


def test_prepare_debug_writes_py_and_maps(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    ws = tmp_path / "ws"
    ws.mkdir()
    src = ws / "demo.typhon"
    src.write_text("int x = 1\nprint(x)\n", encoding="utf-8")
    out = tmp_path / "dbg"
    monkeypatch.setenv(WORKSPACE_ROOT_ENV, str(ws))
    result = prepare_debug(src, out)
    assert result["ok"] is True
    main = Path(result["main"])
    assert main.is_file()
    assert "x = 1" in main.read_text(encoding="utf-8")
    assert result["pythonpath_prepend"] == str(out.resolve())
    assert result["python"]
    map_path = Path(result["maps"]["demo"])
    assert map_path.is_file()
    sidecar = json.loads(map_path.read_text(encoding="utf-8"))
    assert sidecar["version"] == 1
    assert Path(sidecar["typhon"]).resolve() == src.resolve()
    assert sidecar["lines"]
    assert any(e["typhon"] == 1 for e in sidecar["lines"])
    assert "names" in sidecar
    assert sidecar["hidePrefixes"] == ["_typhon_", "__typhon_", "_Typhon"]


def test_prepare_debug_prepends_deps_site_paths(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """Debug launch PYTHONPATH must include typhon.deps sites (parity with Run)."""
    import os
    import sys

    ws = tmp_path / "ws"
    ws.mkdir()
    (ws / "typhon.deps").write_text(
        "[interpreter]\n\tversion: any\n"
        "[dependencies]\n\tdemo\n\t\tversion: 1.0.0\n",
        encoding="utf-8",
    )
    src = ws / "app.typhon"
    src.write_text("print(1)\n", encoding="utf-8")
    out = tmp_path / "dbg"
    site = tmp_path / "fake-site"
    site.mkdir()
    monkeypatch.setenv(WORKSPACE_ROOT_ENV, str(ws))
    monkeypatch.setattr(
        "transpiler.deps.resolve_python_executable",
        lambda _config: sys.executable,
    )
    monkeypatch.setattr(
        "transpiler.deps.resolve_site_paths",
        lambda *_a, **_k: [site],
    )
    result = prepare_debug(src, out)
    assert result["ok"] is True
    parts = result["pythonpath_prepend"].split(os.pathsep)
    assert parts[0] == str(out.resolve())
    assert str(site) in parts
    assert result["python"] == sys.executable


def test_prepare_debug_includes_lambda_capture_names(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    ws = tmp_path / "ws"
    ws.mkdir()
    src = ws / "lam.typhon"
    src.write_text(
        "shared int hits = 0\n"
        "list<int> xs = [1]\n"
        "xs.loop(n => {\n"
        "  hits += 1\n"
        "  return n\n"
        "})\n",
        encoding="utf-8",
    )
    out = tmp_path / "dbg"
    monkeypatch.setenv(WORKSPACE_ROOT_ENV, str(ws))
    result = prepare_debug(src, out)
    assert result["ok"] is True
    sidecar = json.loads(Path(result["maps"]["lam"]).read_text(encoding="utf-8"))
    assert sidecar["names"].get("_c_hits") == "hits"


def test_prepare_debug_cli_json(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    ws = tmp_path / "ws"
    ws.mkdir()
    src = ws / "a.typhon"
    src.write_text("print(1)\n", encoding="utf-8")
    out = tmp_path / "out"
    monkeypatch.setenv(WORKSPACE_ROOT_ENV, str(ws))
    code = ide_main(["--prepare-debug", str(out), str(src)])
    assert code == 0
    payload = json.loads(capsys.readouterr().out)
    assert payload["ok"] is True
    assert Path(payload["main"]).is_file()


def test_prepare_debug_rejects_outside_workspace(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    ws = tmp_path / "ws"
    ws.mkdir()
    outside = tmp_path / "outside.typhon"
    outside.write_text("print(1)\n", encoding="utf-8")
    monkeypatch.setenv(WORKSPACE_ROOT_ENV, str(ws))
    result = prepare_debug(outside, tmp_path / "dbg")
    assert result["ok"] is False
    assert "workspace" in result["error"]["message"].lower()


def test_prepare_debug_javascript_writes_mjs_and_js_maps(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    import shutil

    if shutil.which("node") is None:
        pytest.skip("node not on PATH")
    ws = tmp_path / "ws"
    ws.mkdir()
    src = ws / "demo.typhon"
    src.write_text("int x = 1\nprint(x)\n", encoding="utf-8")
    out = tmp_path / "dbg"
    monkeypatch.setenv(WORKSPACE_ROOT_ENV, str(ws))
    result = prepare_debug(src, out, target="javascript")
    assert result["ok"] is True
    assert result["target"] == "javascript"
    main = Path(result["main"])
    assert main.suffix == ".mjs"
    assert main.is_file()
    assert "let x = 1" in main.read_text(encoding="utf-8") or "x = 1" in main.read_text(
        encoding="utf-8"
    )
    assert result["runtimeExecutable"]
    assert "pythonpath_prepend" not in result
    map_path = Path(result["maps"]["demo"])
    sidecar = json.loads(map_path.read_text(encoding="utf-8"))
    assert "js" in sidecar
    assert Path(sidecar["js"]).resolve() == main.resolve()
    assert any("js" in e and "typhon" in e for e in sidecar["lines"])


def test_prepare_debug_cli_javascript_target(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, capsys: pytest.CaptureFixture[str]
) -> None:
    import shutil

    if shutil.which("node") is None:
        pytest.skip("node not on PATH")
    ws = tmp_path / "ws"
    ws.mkdir()
    src = ws / "a.typhon"
    src.write_text("print(1)\n", encoding="utf-8")
    out = tmp_path / "out"
    monkeypatch.setenv(WORKSPACE_ROOT_ENV, str(ws))
    code = ide_main(
        ["--prepare-debug", str(out), str(src), "--target", "javascript"]
    )
    assert code == 0
    payload = json.loads(capsys.readouterr().out)
    assert payload["ok"] is True
    assert payload["target"] == "javascript"
    assert Path(payload["main"]).suffix == ".mjs"
