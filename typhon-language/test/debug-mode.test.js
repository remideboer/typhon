const test = require('node:test');
const assert = require('node:assert/strict');

const {
  TYPHON_DEBUG_SESSION_NAME,
  PYTHON_DEBUG_SESSION_NAME,
  JS_DEBUG_SESSION_NAME,
  debugModeOptions,
  isTyphonDebugSession,
} = require('../debug-mode');

test('default debug mode stays in mapped Typhon code', () => {
  assert.deepEqual(debugModeOptions(), {
    mode: 'typhon',
    sessionName: TYPHON_DEBUG_SESSION_NAME,
    justMyCode: true,
    stopOnEntry: false,
    remapSource: true,
    revealGenerated: false,
    typhonOnlyStepping: true,
  });
});

test('transpiled Python mode reveals internals and stops on entry', () => {
  assert.deepEqual(debugModeOptions('python'), {
    mode: 'python',
    sessionName: PYTHON_DEBUG_SESSION_NAME,
    justMyCode: false,
    stopOnEntry: true,
    remapSource: false,
    revealGenerated: true,
    typhonOnlyStepping: false,
  });
});

test('both Typhon debugger session names are recognized', () => {
  assert.equal(isTyphonDebugSession(TYPHON_DEBUG_SESSION_NAME), true);
  assert.equal(isTyphonDebugSession(PYTHON_DEBUG_SESSION_NAME), true);
  assert.equal(isTyphonDebugSession(JS_DEBUG_SESSION_NAME), true);
  assert.equal(isTyphonDebugSession('Python: Current File'), false);
});

test('transpiled JavaScript advanced mode uses JS session name', () => {
  assert.deepEqual(debugModeOptions('python', 'javascript'), {
    mode: 'python',
    sessionName: JS_DEBUG_SESSION_NAME,
    justMyCode: false,
    stopOnEntry: true,
    remapSource: false,
    revealGenerated: true,
    typhonOnlyStepping: false,
  });
});

test('extension manifest contributes the explicit Python-depth command', () => {
  const manifest = require('../package.json');
  const commands = new Set(manifest.contributes.commands.map((item) => item.command));
  assert.equal(commands.has('typhon.debugTranspiledFile'), true);
  assert.equal(
    manifest.activationEvents.includes('onCommand:typhon.debugTranspiledFile'),
    true,
  );
  const editorCommands = new Set(
    manifest.contributes.menus['editor/context'].map((item) => item.command),
  );
  assert.equal(editorCommands.has('typhon.debugTranspiledFile'), true);
});

test('extension manifest contributes the session-local Typhon stepping toolbar toggle', () => {
  const manifest = require('../package.json');
  const commands = new Set(manifest.contributes.commands.map((item) => item.command));
  assert.equal(commands.has('typhon.enableTyphonOnlyStepping'), true);
  assert.equal(commands.has('typhon.disableTyphonOnlyStepping'), true);
  assert.equal(
    manifest.activationEvents.includes('onCommand:typhon.enableTyphonOnlyStepping'),
    true,
  );
  assert.equal(
    manifest.activationEvents.includes('onCommand:typhon.disableTyphonOnlyStepping'),
    true,
  );

  const toolbar = manifest.contributes.menus['debug/toolBar'];
  const enable = toolbar.find(
    (item) => item.command === 'typhon.enableTyphonOnlyStepping',
  );
  const disable = toolbar.find(
    (item) => item.command === 'typhon.disableTyphonOnlyStepping',
  );
  assert.match(enable.when, /typhon\.debugSessionActive/);
  assert.match(enable.when, /!typhon\.debug\.typhonOnlyStepping/);
  assert.match(disable.when, /typhon\.debugSessionActive/);
  assert.match(disable.when, /typhon\.debug\.typhonOnlyStepping/);
});
