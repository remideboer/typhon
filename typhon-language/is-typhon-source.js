'use strict';

const SOURCE_EXTS = ['.typhon', '.tpn'];

/**
 * True when ``filePath`` ends with a Typhon source extension (``.typhon`` or ``.tpn``).
 * @param {string | undefined | null} filePath
 * @returns {boolean}
 */
function isTyphonSourcePath(filePath) {
  if (!filePath) {
    return false;
  }
  const lower = String(filePath).toLowerCase();
  return SOURCE_EXTS.some((ext) => lower.endsWith(ext));
}

/**
 * True when ``extname`` (with or without leading dot) is a Typhon source extension.
 * @param {string | undefined | null} extname
 * @returns {boolean}
 */
function isTyphonSourceExt(extname) {
  if (!extname) {
    return false;
  }
  const lower = String(extname).toLowerCase();
  const withDot = lower.startsWith('.') ? lower : `.${lower}`;
  return SOURCE_EXTS.includes(withDot);
}

module.exports = {
  SOURCE_EXTS,
  isTyphonSourcePath,
  isTyphonSourceExt,
};
