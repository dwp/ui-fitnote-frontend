module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  extends: ['@dwp/eslint-config-base', 'plugin:sonarjs/recommended'],
  plugins: [
    'sonarjs',
  ],
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': ['error', { ignore: ['.js'] }],
    'sonarjs/cognitive-complexity': [1, 10],
    'jsdoc/require-description-complete-sentence': ['warn'],
  },
  parserOptions: {
    ecmaVersion: '2022',
    sourceType: 'module',
  },
  env: {
    mocha: true,
  },
};
