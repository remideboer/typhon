"""Canonical Typhon language / toolchain naming (hard cut from PYS)."""
from __future__ import annotations

from pathlib import Path

LANGUAGE_NAME = "Typhon"
LANGUAGE_ID = "typhon"
SOURCE_EXT = ".typhon"  # canonical
SOURCE_EXT_ALIAS = ".tpn"
SOURCE_EXTS = (SOURCE_EXT, SOURCE_EXT_ALIAS)
SOURCE_SUFFIX = "typhon"  # without dot; for fence / messages


def is_source_path(path: Path | str) -> bool:
    """True when ``path`` ends with a Typhon source extension (``.typhon`` or ``.tpn``)."""
    suffix = Path(path).suffix.lower() if not isinstance(path, Path) else path.suffix.lower()
    return suffix in SOURCE_EXTS


def ensure_source_suffix(path: Path) -> Path:
    """Append canonical ``SOURCE_EXT`` when ``path`` has no Typhon source suffix."""
    if is_source_path(path):
        return path
    return path.with_suffix(SOURCE_EXT)


def resolve_source_candidate(base: Path) -> Path | None:
    """Prefer ``base.typhon`` over ``base.tpn`` when resolving a stem without suffix.

    ``base`` may already include a source suffix; otherwise try each of ``SOURCE_EXTS``.
    """
    if is_source_path(base):
        return base if base.is_file() else None
    for ext in SOURCE_EXTS:
        candidate = base.with_suffix(ext)
        if candidate.is_file():
            return candidate
    return None


def source_globs() -> tuple[str, ...]:
    """Glob patterns for Typhon sources (canonical first)."""
    return tuple(f"*{ext}" for ext in SOURCE_EXTS)


def ends_with_source_ext(ref: str) -> bool:
    """True when ``ref`` ends with any Typhon source extension (case-insensitive)."""
    lowered = ref.lower()
    return any(lowered.endswith(ext) for ext in SOURCE_EXTS)


def strip_source_ext(name: str) -> str:
    """Remove a trailing Typhon source extension if present (case-insensitive)."""
    lowered = name.lower()
    for ext in SOURCE_EXTS:
        if lowered.endswith(ext):
            return name[: -len(ext)]
    return name


def iter_source_files(directory: Path) -> list[Path]:
    """List Typhon sources in ``directory`` (``.typhon`` and ``.tpn``)."""
    found: list[Path] = []
    for pattern in source_globs():
        found.extend(directory.glob(pattern))
    return found


DEPS_FILENAME = "typhon.deps"
MANIFEST_FILENAME = "typhon.toml"
LOCK_FILENAME = "typhon.lock"

WORKSPACE_ROOT_ENV = "TYPHON_WORKSPACE_ROOT"
REPO_ROOT_ENV = "TYPHON_REPO"
SUPPRESS_WARNINGS_ENV = "TYPHON_SUPPRESS_WARNINGS"

DEFAULT_REPO = Path.home() / ".typhon" / "repository"
HOME_DIR_NAME = ".typhon"

LOCK_MARKER = ".typhon-lock.json"
NPM_READY_MARKER = ".typhon_npm_ready"
SOURCE_MAP_SUFFIX = ".typhonmap.json"

EMIT_PREFIX = "_typhon_"
BRACE_LOCAL_PREFIX = "_typhon_b"

EXTENSION_PACKAGE = "typhon-language"
EXTENSION_DISPLAY_NAME = "Typhon Language Support"
MARKETPLACE_ID = "remideboer.typhon-language"

RUN_TERMINAL_NAME = "Run Typhon"
RUN_TERMINAL_NAME_NODE = "Run Typhon (Node)"

CLI_SCRIPT = "typhon"
