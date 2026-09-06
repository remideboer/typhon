'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  pickRunTerminal,
  runTerminalName,
} = require('../run-terminal');

test('runTerminalName uses Node label for javascript target', () => {
  assert.equal(runTerminalName('python'), 'Run Typhon');
  assert.equal(runTerminalName('javascript'), 'Run Typhon (Node)');
});

test('pickRunTerminal prefers active when name matches', () => {
  const active = { name: 'Run Typhon' };
  const other = { name: 'Run Typhon' };
  const picked = pickRunTerminal([other, active], active, 'Run Typhon');
  assert.equal(picked, active);
});

test('pickRunTerminal finds by name when active is unrelated', () => {
  const run = { name: 'Run Typhon' };
  const active = { name: 'powershell' };
  const picked = pickRunTerminal([{ name: 'Install Python' }, run], active, 'Run Typhon');
  assert.equal(picked, run);
});

test('pickRunTerminal returns null when missing', () => {
  const picked = pickRunTerminal(
    [{ name: 'powershell' }],
    { name: 'powershell' },
    'Run Typhon',
  );
  assert.equal(picked, null);
});

test('pickRunTerminal keeps python and node run terminals distinct', () => {
  const py = { name: 'Run Typhon' };
  const node = { name: 'Run Typhon (Node)' };
  assert.equal(pickRunTerminal([py, node], null, 'Run Typhon (Node)'), node);
  assert.equal(pickRunTerminal([py, node], null, 'Run Typhon'), py);
});
