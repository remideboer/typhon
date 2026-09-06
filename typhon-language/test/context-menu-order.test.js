/**
 * Context menu order + in-class extract title.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { isOffsetInClassBody } = require('../in-class-body.js');

const root = path.join(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

test('editor/context order: run, refactor, find usages, generate, reveal, extra', () => {
  const ctx = manifest.contributes.menus['editor/context'].filter(
    (e) => e.when && String(e.when).includes('resourceExtname == .typhon'),
  );
  const byCmd = (id) => ctx.find((e) => e.command === id || e.submenu === id);
  assert.equal(byCmd('typhon.runFile').group, '0_run@1');
  assert.equal(byCmd('typhon.debugFile').group, '0_run@2');
  assert.equal(byCmd('typhon.formatDocument').group, '1_modification@1');
  assert.equal(byCmd('typhon.refactor.rename').group, '1_typhon_refactor@1');
  assert.equal(byCmd('typhon.refactor.extractFunction').group, '1_typhon_refactor@2');
  assert.equal(byCmd('typhon.refactor.extractMethod').group, '1_typhon_refactor@2');
  assert.match(byCmd('typhon.refactor.extractFunction').when, /!typhon\.inClassBody/);
  assert.match(byCmd('typhon.refactor.extractMethod').when, /typhon\.inClassBody/);
  assert.equal(byCmd('typhon.refactor.more').group, '1_typhon_refactor@3');
  assert.equal(byCmd('typhon.findUsages').group, 'navigation@50');
  assert.equal(byCmd('typhon.generate').group, 'z_typhon_generate@1');
  assert.equal(byCmd('revealFileInOS').group, 'z_typhon_reveal@1');
  assert.equal(byCmd('typhon.debugTranspiledFile').group, 'z_typhon_extra@1');

  const refactorSub = manifest.contributes.submenus.find((s) => s.id === 'typhon.refactor.more');
  assert.equal(refactorSub.label, 'Refactor');
  const genSub = manifest.contributes.submenus.find((s) => s.id === 'typhon.generate');
  assert.equal(genSub.label, 'Generate');

  const gen = manifest.contributes.menus['typhon.generate'].map((e) => e.command);
  assert.deepEqual(gen, [
    'typhon.generate.constructor',
    'typhon.generate.toString',
    'typhon.generate.overrideMethods',
    'typhon.generate.gettersSetters',
    'typhon.generate.test',
    'typhon.generate.createClass',
  ]);

  const more = manifest.contributes.menus['typhon.refactor.more'].map((e) => e.command);
  assert.ok(more.includes('typhon.refactor.extractVariable'));
  assert.ok(!ctx.some((e) => e.command === 'typhon.refactor.extractVariable'));

  const formatCmd = manifest.contributes.commands.find((c) => c.command === 'typhon.formatDocument');
  assert.equal(formatCmd.title, 'Reformat Code in File');
  assert.match(
    fs.readFileSync(path.join(root, 'extension.js'), 'utf8'),
    /registerDocumentFormattingEditProvider/,
  );
});

test('isOffsetInClassBody detects class vs top-level function', () => {
  const src = [
    'class Hero {',
    '    public void greet() {',
    '        print("hi")',
    '    }',
    '}',
    'function top() {',
    '    print(1)',
    '}',
    '',
  ].join('\n');
  const inGreet = src.indexOf('print("hi")');
  const inTop = src.indexOf('print(1)');
  assert.equal(isOffsetInClassBody(src, inGreet), true);
  assert.equal(isOffsetInClassBody(src, inTop), false);
});
