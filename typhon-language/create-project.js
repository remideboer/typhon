/**
 * Pure filesystem scaffold for a new Typhon project (ADR-017 source roots).
 * Kept free of vscode so unit tests can run under node --test.
 */

'use strict';

const path = require('path');
const fs = require('fs');

const MAIN_SOURCE = `# Expected output:
# Hello from Typhon

print("Hello from Typhon")
`;

/**
 * @param {'python' | 'javascript' | string} [target]
 * @returns {string}
 */
function buildTyphonToml(target = 'python') {
  const emit = String(target || 'python').trim().toLowerCase() === 'javascript'
    ? 'javascript'
    : 'python';
  return `[project]
main = "src/main.typhon"
target = "${emit}"

[source_roots]
main = "src"
test = "tests"

[interpreter]
version = ">=3.10"

[dependencies]
# Add third-party packages here, then right-click typhon.toml → Typhon: Run Deps Lock
# "example-package" = { version = "1.2.3" }

# npm packages for --target javascript (optional):
# [dependencies.npm]
# mysql2 = "^3.11.0"
`;
}

/** Default template (python target) for tests / docs. */
const TyphonTOML = buildTyphonToml('python');

/**
 * @param {string} projectRoot absolute path
 * @param {{ target?: string, existsSync?: Function, mkdirSync?: Function, writeFileSync?: Function } | object} [optionsOrIo]
 * @param {{ existsSync?: Function, mkdirSync?: Function, writeFileSync?: Function }} [maybeIo]
 * @returns {{ root: string, created: string[], target: string }}
 */
function createTyphonProjectScaffold(projectRoot, optionsOrIo = fs, maybeIo) {
  let options = {};
  let io = fs;
  if (optionsOrIo && typeof optionsOrIo.existsSync === 'function') {
    io = optionsOrIo;
  } else if (optionsOrIo && typeof optionsOrIo === 'object') {
    options = optionsOrIo;
    io = maybeIo && typeof maybeIo.existsSync === 'function' ? maybeIo : fs;
  }
  const emitTarget =
    String(options.target || 'python').trim().toLowerCase() === 'javascript'
      ? 'javascript'
      : 'python';
  const root = path.resolve(projectRoot);
  if (!io.existsSync(root)) {
    io.mkdirSync(root, { recursive: true });
  }
  const tomlPath = path.join(root, 'typhon.toml');
  if (io.existsSync(tomlPath)) {
    const err = new Error(`Already a Typhon project (typhon.toml exists): ${root}`);
    err.code = 'TYPHON_PROJECT_EXISTS';
    throw err;
  }
  const created = [];
  for (const rel of ['src', 'tests']) {
    const dir = path.join(root, rel);
    if (!io.existsSync(dir)) {
      io.mkdirSync(dir, { recursive: true });
      created.push(rel + path.sep);
    }
    if (rel === 'tests') {
      const keep = path.join(dir, '.gitkeep');
      if (!io.existsSync(keep)) {
        io.writeFileSync(keep, '', 'utf8');
        created.push(path.join(rel, '.gitkeep'));
      }
    }
  }
  const mainPath = path.join(root, 'src', 'main.typhon');
  if (!io.existsSync(mainPath)) {
    io.writeFileSync(mainPath, MAIN_SOURCE, 'utf8');
    created.push(path.join('src', 'main.typhon'));
  }
  const toml = buildTyphonToml(emitTarget);
  io.writeFileSync(tomlPath, toml, 'utf8');
  created.push('typhon.toml');
  return { root, created, target: emitTarget };
}

module.exports = {
  buildTyphonToml,
  createTyphonProjectScaffold,
  MAIN_SOURCE,
  TyphonTOML,
};
