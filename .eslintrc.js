module.exports = {
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    jquery: true,
    es6: true
  },
  globals: {
    $: true,
    router: true,
    express: true,
    appRootDirectory: true,
    req: true,
    next: true,
    res: true,
    govuk: true,
    logger: true,
    config: true,
    gulpPaths: true
  },
  rules: {
    strict: [
      2,
      'global'
    ],
    'init-declarations': 0,
    'no-catch-shadow': 0,
    'no-delete-var': 1,
    'no-label-var': 2,
    'no-shadow-restricted-names': 2,
    'no-undef-init': 1,
    'no-undef': 2,
    'no-undefined': 2,
    'no-unused-vars': [
      1,
      {
        vars: 'all',
        args: 'after-used'
      }
    ],
    'no-use-before-define': 1,
    'comma-dangle': [
      2,
      'never'
    ],
    'no-cond-assign': [
      2,
      'except-parens'
    ],
    'no-console': 1,
    'no-constant-condition': 2,
    'no-control-regex': 2,
    'no-debugger': 2,
    'no-dupe-args': 2,
    'no-dupe-keys': 2,
    'no-duplicate-case': 2,
    'no-empty-character-class': 2,
    'no-empty': 2,
    'no-ex-assign': 2,
    'no-extra-boolean-cast': 2,
    'no-extra-parens': [
      0,
      'all'
    ],
    'no-extra-semi': 1,
    'no-func-assign': 2,
    'no-inner-declarations': [
      2,
      'both'
    ],
    'no-invalid-regexp': 2,
    'no-irregular-whitespace': [
      2,
      {
        skipRegExps: true
      }
    ],
    'no-negated-in-lhs': 2,
    'no-obj-calls': 2,
    'no-regex-spaces': 2,
    'no-sparse-arrays': 2,
    'no-unreachable': 2,
    'use-isnan': 2,
    'valid-jsdoc': 0,
    'valid-typeof': 2,
    'no-unexpected-multiline': 2,
    'accessor-pairs': [
      2,
      {
        getWithoutSet: false,
        setWithoutGet: true
      }
    ],
    'block-scoped-var': 2,
    complexity: [
      1,
      15
    ],
    'consistent-return': 2,
    curly: [
      2,
      'all'
    ],
    'default-case': 2,
    'dot-notation': [
      2,
      {
        allowKeywords: true,
        allowPattern: ''
      }
    ],
    'dot-location': [
      2,
      'property'
    ],
    eqeqeq: 2,
    'guard-for-in': 2,
    'no-alert': 1,
    'no-caller': 2,
    'no-div-regex': 2,
    'no-else-return': 0,
    'no-eq-null': 2,
    'no-eval': 2,
    'no-extend-native': 2,
    'no-extra-bind': 2,
    'no-fallthrough': 1,
    'no-floating-decimal': 1,
    'no-implicit-coercion': [
      1,
      {
        'boolean': false,
        number: true,
        string: false
      }
    ],
    'no-implied-eval': 2,
    'no-invalid-this': 0,
    'no-iterator': 2,
    'no-labels': 2,
    'no-lone-blocks': 2,
    'no-loop-func': 2,
    'no-multi-spaces': [
      1,
      {
        exceptions: {
          VariableDeclarator: true,
          ImportDeclaration: true,
          AssignmentExpression: true,
          ObjectExpression: true
        }
      }
    ],
    'no-multi-str': 2,
    'no-native-reassign': 2,
    'no-new-func': 2,
    'no-new-wrappers': 2,
    'no-new': 2,
    'no-octal-escape': 2,
    'no-octal': 2,
    'no-param-reassign': 0,
    'no-process-env': 0,
    'no-proto': 2,
    'no-redeclare': [
      2,
      {
        builtinGlobals: true
      }
    ],
    'no-return-assign': [
      2,
      'except-parens'
    ],
    'no-script-url': 2,
    'no-self-compare': 0,
    'no-sequences': 2,
    'no-throw-literal': 2,
    'no-unused-expressions': 2,
    'no-useless-call': 1,
    'no-useless-concat': 2,
    'no-void': 2,
    'no-warning-comments': [
      0,
      {
        terms: [
          'todo',
          'fixme'
        ],
        location: 'start'
      }
    ],
    'no-with': 2,
    radix: 1,
    'vars-on-top': 1,
    'wrap-iife': [
      2,
      'inside'
    ],
    yoda: [
      1,
      'never'
    ],
    'array-bracket-spacing': [
      2,
      'never'
    ],
    'block-spacing': [
      1,
      'always'
    ],
    'brace-style': [
      2,
      '1tbs'
    ],
    camelcase: [
      1,
      {
        properties: 'always'
      }
    ],
    'comma-spacing': [
      1,
      {
        before: false,
        after: true
      }
    ],
    'comma-style': [
      1,
      'last'
    ],
    'computed-property-spacing': [
      2,
      'never'
    ],
    'consistent-this': [
      1,
      'self'
    ],
    'eol-last': 1,
    'func-style': 0,
    'id-length': 0,
    'id-match': 0,
    indent: [
      1,
      4
    ],
    'jsx-quotes': [
      1,
      'prefer-single'
    ],
    'key-spacing': [
      1,
      {
        beforeColon: true,
        afterColon: true,
        mode: 'minimum'
      }
    ],
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    'lines-around-comment': 0,
    'linebreak-style': 0,
    'max-nested-callbacks': [
      1,
      3
    ],
    'new-cap': [
      1,
      {
        newIsCap: true,
        capIsNew: true
      }
    ],
    'new-parens': 1,
    'newline-after-var': [
      0,
      'always'
    ],
    'no-array-constructor': 1,
    'no-continue': 1,
    'no-inline-comments': 0,
    'no-lonely-if': 1,
    'no-mixed-spaces-and-tabs': 2,
    'no-multiple-empty-lines': [
      1,
      {
        max: 1
      }
    ],
    'no-nested-ternary': 1,
    'no-new-object': 1,
    'no-restricted-syntax': 0,
    'no-spaced-func': 1,
    'no-ternary': 0,
    'no-underscore-dangle': 0,
    'no-unneeded-ternary': [
      1,
      {
        defaultAssignment: true
      }
    ],
    'object-curly-spacing': [
      1,
      'never'
    ],
    'one-var': [
      0,
      'never'
    ],
    'operator-assignment': 0,
    'operator-linebreak': [
      1,
      'after'
    ],
    'padded-blocks': [
      1,
      'never'
    ],
    'quote-props': [
      1,
      'as-needed',
      {
        keywords: false,
        unnecessary: false,
        numbers: true
      }
    ],
    quotes: [
      2,
      'single',
      'avoid-escape'
    ],
    'require-jsdoc': 0,
    'semi-spacing': [
      1,
      {
        before: false,
        after: true
      }
    ],
    semi: [
      1,
      'always'
    ],
    'sort-vars': 0,
    'space-before-blocks': [
      1,
      'always'
    ],
    'space-before-function-paren': [
      1,
      {
        anonymous: 'never',
        named: 'never'
      }
    ],
    'space-in-parens': [
      1,
      'never'
    ],
    'space-infix-ops': [
      1,
      {
        int32Hint: false
      }
    ],
    'space-unary-ops': [
      1,
      {
        words: true,
        nonwords: false
      }
    ],
    'wrap-regex': 2,
    'arrow-parens': [
      2,
      'always'
    ],
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    'constructor-super': 2,
    'generator-star-spacing': [
      2,
      {
        before: false,
        after: true
      }
    ],
    'no-class-assign': 2,
    'no-const-assign': 2,
    'no-dupe-class-members': 0,
    'no-this-before-super': 2,
    'no-var': 0,
    'object-shorthand': 0,
    'prefer-arrow-callback': 0,
    'prefer-const': 1,
    'prefer-spread': 0,
    'prefer-reflect': 0,
    'prefer-template': 0,
    'require-yield': 2,
    'callback-return': 1,
    'global-require': 0,
    'handle-callback-err': 1,
    'no-mixed-requires': 1,
    'no-new-require': 1,
    'no-path-concat': 1,
    'no-process-exit': 1,
    'no-restricted-modules': 1,
    'no-sync': 0
  }
}