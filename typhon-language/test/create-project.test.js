const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  buildTyphonToml,
  createTyphonProjectScaffold,
  MAIN_SOURCE,
  TyphonTOML,
} = require('../create-project');

test('createTyphonProjectScaffold writes src, tests, and unified typhon.toml', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pys-scaffold-'));
  try {
    const result = createTyphonProjectScaffold(root);
    assert.equal(result.root, path.resolve(root));
    assert.equal(result.target, 'python');
    assert.equal(
      fs.readFileSync(path.join(root, 'src', 'main.typhon'), 'utf8'),
      MAIN_SOURCE,
    );
    assert.ok(fs.existsSync(path.join(root, 'tests', '.gitkeep')));
    assert.equal(fs.readFileSync(path.join(root, 'typhon.toml'), 'utf8'), TyphonTOML);
    assert.match(TyphonTOML, /\[project\]\nmain = "src\/main\.typhon"\ntarget = "python"/);
    assert.match(TyphonTOML, /\[interpreter\]/);
    assert.match(TyphonTOML, /\[dependencies\]/);
    assert.ok(!fs.existsSync(path.join(root, 'typhon.deps')));
    assert.ok(result.created.includes(path.join('src', 'main.typhon')));
    assert.ok(result.created.includes('typhon.toml'));
    assert.ok(!result.created.includes('typhon.deps'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('createTyphonProjectScaffold writes javascript target when requested', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pys-scaffold-js-'));
  try {
    const result = createTyphonProjectScaffold(root, { target: 'javascript' });
    assert.equal(result.target, 'javascript');
    const toml = fs.readFileSync(path.join(root, 'typhon.toml'), 'utf8');
    assert.match(toml, /target = "javascript"/);
    assert.equal(toml, buildTyphonToml('javascript'));
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('createTyphonProjectScaffold refuses an existing typhon.toml', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pys-scaffold-'));
  try {
    fs.writeFileSync(path.join(root, 'typhon.toml'), '[source_roots]\n', 'utf8');
    assert.throws(
      () => createTyphonProjectScaffold(root),
      (err) => err && err.code === 'TYPHON_PROJECT_EXISTS',
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
