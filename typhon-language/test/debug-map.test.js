const test = require('node:test');
const assert = require('node:assert/strict');
const {
  loadMapRegistry,
  mapTyphonBreakpoint,
  mapPyStackFrame,
  mapExactPyStackFrame,
  remapSetBreakpointsArgs,
  remapSetBreakpointsResponse,
  remapBreakpoint,
  remapStackFrames,
  formatTyphonDebugValue,
  remapVariables,
  rewriteEvaluateExpression,
  rewriteLogMessageExpressions,
  collectInlineValueSites,
  filterInlineValueSitesByScope,
  normalizePathKey,
} = require('../debug-map');

const PY = 'C:\\tmp\\dbg\\demo.py';
const Typhon = 'C:\\ws\\demo.typhon';

function registryFromSidecar(sidecar) {
  const mapFiles = { demo: 'demo.typhonmap.json' };
  const read = () => JSON.stringify(sidecar);
  return loadMapRegistry(mapFiles, read);
}

test('normalizePathKey keeps Windows absolute paths stable on any host', () => {
  assert.equal(
    normalizePathKey('C:\\workspace\\main.typhon'),
    'c:\\workspace\\main.typhon',
  );
  assert.equal(
    normalizePathKey('C:/workspace/main.typhon'),
    'c:\\workspace\\main.typhon',
  );
});

test('loadMapRegistry indexes py and pys paths', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [
      { py: 10, typhon: 1 },
      { py: 11, typhon: 2 },
    ],
  });
  assert.equal(reg.byPy.has(normalizePathKey(PY)), true);
  assert.equal(reg.byTyphon.has(normalizePathKey(Typhon)), true);
});

test('mapTyphonBreakpoint exact and forward nearest', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [
      { py: 10, typhon: 1 },
      { py: 12, typhon: 3 },
    ],
  });
  assert.deepEqual(mapTyphonBreakpoint(reg, Typhon, 1), {
    generatedPath: PY,
    generatedLine: 10,
    pyPath: PY,
    pyLine: 10,
  });
  assert.deepEqual(mapTyphonBreakpoint(reg, Typhon, 2), {
    generatedPath: PY,
    generatedLine: 12,
    pyPath: PY,
    pyLine: 12,
  });
});

test('mapPyStackFrame exact and backward nearest', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [
      { py: 10, typhon: 1 },
      { py: 12, typhon: 3 },
    ],
  });
  assert.deepEqual(mapPyStackFrame(reg, PY, 12), { typhonPath: Typhon, typhonLine: 3 });
  assert.deepEqual(mapPyStackFrame(reg, PY, 11), { typhonPath: Typhon, typhonLine: 1 });
});

test('mapExactPyStackFrame rejects generated lines without their own Typhon origin', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [
      { py: 10, typhon: 1 },
      { py: 12, typhon: 3 },
    ],
  });
  assert.deepEqual(mapExactPyStackFrame(reg, PY, 12), {
    typhonPath: Typhon,
    typhonLine: 3,
  });
  assert.equal(mapExactPyStackFrame(reg, PY, 11), null);
});

test('remapSetBreakpointsArgs rewrites .typhon source to .py', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [{ py: 5, typhon: 2 }],
  });
  const out = remapSetBreakpointsArgs(reg, {
    source: { path: Typhon, name: 'demo.typhon' },
    breakpoints: [{ line: 2 }],
  });
  assert.equal(out.source.path, PY);
  assert.equal(out.breakpoints[0].line, 5);
});

test('remapSetBreakpointsResponse maps verified glyph back to .typhon', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [{ py: 5, typhon: 2 }],
  });
  const body = remapSetBreakpointsResponse(
    reg,
    {
      breakpoints: [
        { id: 1, verified: true, line: 5, source: { path: PY, name: 'demo.py' } },
      ],
    },
    Typhon,
  );
  assert.equal(body.breakpoints[0].source.path, Typhon);
  assert.equal(body.breakpoints[0].line, 2);
});

test('remapBreakpoint event source back to .typhon', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [{ py: 9, typhon: 4 }],
  });
  const bp = remapBreakpoint(reg, {
    id: 2,
    verified: true,
    line: 9,
    source: { path: PY },
  });
  assert.equal(bp.source.path, Typhon);
  assert.equal(bp.line, 4);
});

test('remapStackFrames rewrites .py frames to .typhon', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [{ py: 8, typhon: 4 }],
  });
  const frames = remapStackFrames(reg, [
    { id: 1, line: 8, source: { path: PY, name: 'demo.py' } },
  ]);
  assert.equal(frames[0].source.path, Typhon);
  assert.equal(frames[0].line, 4);
});

const JS = 'C:\\tmp\\dbg\\demo.mjs';

test('loadMapRegistry indexes js sidecars under byGenerated', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    js: JS,
    lines: [
      { js: 10, typhon: 1 },
      { js: 11, typhon: 2 },
    ],
  });
  assert.equal(reg.byGenerated.has(normalizePathKey(JS)), true);
  assert.equal(reg.byPy.has(normalizePathKey(JS)), true);
  assert.equal(reg.byTyphon.has(normalizePathKey(Typhon)), true);
});

test('mapTyphonBreakpoint works for js line keys', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    js: JS,
    lines: [
      { js: 10, typhon: 1 },
      { js: 12, typhon: 3 },
    ],
  });
  assert.deepEqual(mapTyphonBreakpoint(reg, Typhon, 1), {
    generatedPath: JS,
    generatedLine: 10,
    pyPath: JS,
    pyLine: 10,
  });
});

test('remapSetBreakpointsArgs rewrites .typhon source to .mjs', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    js: JS,
    lines: [{ js: 5, typhon: 2 }],
  });
  const out = remapSetBreakpointsArgs(reg, {
    source: { path: Typhon, name: 'demo.typhon' },
    breakpoints: [{ line: 2 }],
  });
  assert.equal(out.source.path, JS);
  assert.equal(out.breakpoints[0].line, 5);
});

test('remapStackFrames rewrites .mjs frames to .typhon', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    js: JS,
    lines: [{ js: 8, typhon: 3 }],
  });
  const frames = remapStackFrames(reg, [
    { id: 1, line: 8, source: { path: JS, name: 'demo.mjs' } },
  ]);
  assert.equal(frames[0].source.path, Typhon);
  assert.equal(frames[0].line, 3);
});

test('remapVariables renames _c_ captures and hides runtime helpers', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [],
    names: { _c_hits: 'hits' },
    hidePrefixes: ['_typhon_', '__typhon_', '_Typhon'],
  });
  const vars = remapVariables(reg, [
    { name: '_c_hits', value: '3', variablesReference: 0 },
    { name: '_typhon_tg_0', value: '<TaskGroup>', variablesReference: 1 },
    { name: '__typhon_task_a', value: '<fn>', variablesReference: 0 },
    { name: 'n', value: '1', variablesReference: 0 },
  ]);
  assert.deepEqual(
    vars.map((v) => v.name),
    ['hits', 'n'],
  );
});

test('Typhon debug values display exact Python None as null', () => {
  assert.equal(formatTyphonDebugValue('None'), 'null');
  assert.equal(formatTyphonDebugValue('"None"'), '"None"');
  const vars = remapVariables(
    registryFromSidecar({ version: 1, typhon: Typhon, py: PY, lines: [] }),
    [{ name: 'nickname', value: 'None', variablesReference: 0 }],
  );
  assert.equal(vars[0].value, 'null');
});

test('remapVariables renames brace-scoped _typhon_b locals before hidePrefixes', () => {
  // CER-015: loop binders emit as _typhon_bN_*; hidePrefixes is `_typhon_` for helpers.
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [],
    names: { _typhon_b1_i: 'i' },
    hidePrefixes: ['_typhon_', '__typhon_', '_Typhon'],
  });
  const vars = remapVariables(reg, [
    { name: '_typhon_b1_i', value: '2', variablesReference: 0 },
    { name: '_typhon_tg_0', value: '<TaskGroup>', variablesReference: 1 },
  ]);
  assert.deepEqual(
    vars.map((v) => ({ name: v.name, value: v.value })),
    [{ name: 'i', value: '2' }],
  );
});

test('collectInlineValueSites finds loop binder on header line', () => {
  const src = [
    'loop (int i = 0, i < 3, i++) {',
    '    print(i)',
    '}',
  ].join('\n');
  const sites = collectInlineValueSites(src, 2, {
    keywords: ['loop', 'print'],
    types: ['int'],
  });
  // One site per name per line (deduped); header + body both see `i`.
  assert.deepEqual(
    sites.map((s) => ({ line: s.line, name: s.name })),
    [
      { line: 0, name: 'i' },
      { line: 1, name: 'i' },
    ],
  );
});
test('rewriteEvaluateExpression maps bare Typhon name to emitted', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [],
    names: { _c_hits: 'hits' },
  });
  assert.equal(rewriteEvaluateExpression(reg, 'hits'), '_c_hits');
  assert.equal(rewriteEvaluateExpression(reg, ' hits '), '_c_hits');
  assert.equal(rewriteEvaluateExpression(reg, 'hits + 1'), 'hits + 1');
  assert.equal(rewriteEvaluateExpression(reg, 'n'), 'n');
});

test('collectInlineValueSites finds vars up to stopped line', () => {
  const src = [
    'int total = 0',
    'print("total")  # name in string ignored',
    'total = bump(total)',
    'print(total)',
  ].join('\n');
  const sites = collectInlineValueSites(src, 3, {
    keywords: ['print'],
    types: ['int'],
  });
  assert.deepEqual(
    sites.map((s) => ({ line: s.line, name: s.name })),
    [
      { line: 0, name: 'total' },
      { line: 2, name: 'total' },
      { line: 2, name: 'bump' },
    ],
  );
});

test('filterInlineValueSitesByScope keeps only in-scope names', () => {
  const sites = [
    { line: 0, column: 4, length: 5, name: 'total' },
    { line: 2, column: 0, length: 4, name: 'bump' },
    { line: 2, column: 7, length: 5, name: 'total' },
  ];
  const filtered = filterInlineValueSitesByScope(sites, new Set(['total']));
  assert.deepEqual(
    filtered.map((s) => s.name),
    ['total', 'total'],
  );
  assert.deepEqual(filterInlineValueSitesByScope(sites, new Set()), []);
  // Map of name -> value (as returned by fetchFrameLocalValues) must use keys.
  const asMap = new Map([
    ['total', '1'],
    ['other', '2'],
  ]);
  assert.deepEqual(
    filterInlineValueSitesByScope(sites, asMap).map((s) => s.name),
    ['total', 'total'],
  );
});

test('rewriteLogMessageExpressions rewrites braced Typhon names', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [{ py: 10, typhon: 3 }],
    names: { _c_hits: 'hits' },
  });
  assert.equal(
    rewriteLogMessageExpressions(reg, 'hits={hits} n={n}'),
    'hits={_c_hits} n={n}',
  );
  assert.equal(
    rewriteLogMessageExpressions(reg, 'sum={hits + 1}'),
    'sum={_c_hits + 1}',
  );
});

test('remapSetBreakpointsArgs preserves and rewrites logMessage', () => {
  const reg = registryFromSidecar({
    version: 1,
    typhon: Typhon,
    py: PY,
    lines: [{ py: 10, typhon: 3 }],
    names: { _c_hits: 'hits' },
  });
  const out = remapSetBreakpointsArgs(reg, {
    source: { path: Typhon, name: 'demo.typhon' },
    breakpoints: [{ line: 3, logMessage: 'hits={hits}' }],
  });
  assert.equal(out.source.path, PY);
  assert.equal(out.breakpoints[0].line, 10);
  assert.equal(out.breakpoints[0].logMessage, 'hits={_c_hits}');
});
