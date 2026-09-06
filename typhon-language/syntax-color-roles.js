/**
 * Shared TextMate role → scope map (packaged with the VSIX).
 * Build script `scripts/apply-syntax-colors.js` and runtime UI both use this.
 */
/** @type {Record<string, { scope: string[] }>} */
const ROLE_SCOPES = {
  comments: {
    scope: ['comment.line.number-sign.typhon', 'comment.block.typhon'],
  },
  strings: {
    scope: ['string.quoted.double.typhon', 'string.quoted.single.typhon'],
  },
  numbers: {
    scope: [
      'constant.numeric.integer.typhon',
      'constant.numeric.float.typhon',
      'constant.numeric.hex.typhon',
      'constant.numeric.binary.typhon',
      'constant.language.typhon',
      'constant.character.escape.typhon',
    ],
  },
  functions: {
    scope: ['entity.name.function.typhon', 'support.function.typhon'],
  },
  types: {
    scope: [
      'storage.type.primitive.typhon',
      'entity.name.type.typhon',
      'entity.name.type.class.typhon',
      'entity.name.type.interface.typhon',
      'entity.name.type.struct.typhon',
      'entity.name.type.data.typhon',
      'entity.name.type.entity.typhon',
      'entity.name.type.enum.typhon',
    ],
  },
  'language-constants': {
    scope: ['variable.language.typhon', 'variable.other.constant.typhon'],
  },
  keywords: {
    scope: [
      'keyword.control.typhon',
      'keyword.operator.typhon',
      'storage.modifier.typhon',
      'punctuation.definition.decorator.typhon',
      'entity.name.function.decorator.typhon',
      'meta.function.decorator.typhon',
    ],
  },
};

const THEME_KEYS = {
  dark: '[*Dark*]',
  light: '[*Light*]',
  'high-contrast': '[*HighContrast*]',
};

module.exports = {
  ROLE_SCOPES,
  THEME_KEYS,
};
