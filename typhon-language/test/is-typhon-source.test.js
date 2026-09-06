'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const {
  SOURCE_EXTS,
  isTyphonSourcePath,
  isTyphonSourceExt,
} = require('../is-typhon-source');

test('isTyphonSourcePath accepts .typhon and .tpn', () => {
  assert.deepEqual(SOURCE_EXTS, ['.typhon', '.tpn']);
  assert.equal(isTyphonSourcePath('a.typhon'), true);
  assert.equal(isTyphonSourcePath('b.tpn'), true);
  assert.equal(isTyphonSourcePath('C.TPN'), true);
  assert.equal(isTyphonSourcePath('a.py'), false);
  assert.equal(isTyphonSourcePath(''), false);
});

test('isTyphonSourceExt normalizes leading dot', () => {
  assert.equal(isTyphonSourceExt('.tpn'), true);
  assert.equal(isTyphonSourceExt('tpn'), true);
  assert.equal(isTyphonSourceExt('.js'), false);
});
