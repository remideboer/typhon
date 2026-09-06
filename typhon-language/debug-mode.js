'use strict';

const TYPHON_DEBUG_SESSION_NAME = 'Debug Typhon';
const PYTHON_DEBUG_SESSION_NAME = 'Debug Typhon (Transpiled Python)';
const JS_DEBUG_SESSION_NAME = 'Debug Typhon (Transpiled JavaScript)';

/**
 * @param {string} [mode] 'typhon' (mapped) or 'python'/'generated' (advanced)
 * @param {string} [target] emit target: 'python' | 'javascript'
 */
function debugModeOptions(mode = 'typhon', target = 'python') {
  if (mode === 'python' || mode === 'generated') {
    const isJs = target === 'javascript';
    return {
      mode: 'python',
      sessionName: isJs ? JS_DEBUG_SESSION_NAME : PYTHON_DEBUG_SESSION_NAME,
      justMyCode: false,
      stopOnEntry: true,
      remapSource: false,
      revealGenerated: true,
      typhonOnlyStepping: false,
    };
  }
  return {
    mode: 'typhon',
    sessionName: TYPHON_DEBUG_SESSION_NAME,
    justMyCode: true,
    stopOnEntry: false,
    remapSource: true,
    revealGenerated: false,
    typhonOnlyStepping: true,
  };
}

function isTyphonDebugSession(sessionName) {
  return (
    sessionName === TYPHON_DEBUG_SESSION_NAME ||
    sessionName === PYTHON_DEBUG_SESSION_NAME ||
    sessionName === JS_DEBUG_SESSION_NAME
  );
}

module.exports = {
  TYPHON_DEBUG_SESSION_NAME,
  PYTHON_DEBUG_SESSION_NAME,
  JS_DEBUG_SESSION_NAME,
  debugModeOptions,
  isTyphonDebugSession,
};
