"""Canonical Typhon language / toolchain naming (hard cut from PYS)."""
from __future__ import annotations

from pathlib import Path

LANGUAGE_NAME = "Typhon"
LANGUAGE_ID = "typhon"
SOURCE_EXT = ".typhon"
SOURCE_SUFFIX = "typhon"  # without dot; for fence / messages

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
