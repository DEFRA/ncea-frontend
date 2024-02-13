/* eslint-env node */
const alwaysMultiLine = 'always-multiline';
module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  ignorePatterns: ['build/**/*.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'jest'],
  root: true,
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: alwaysMultiLine,
        objects: alwaysMultiLine,
        imports: alwaysMultiLine,
        exports: alwaysMultiLine,
        functions: 'ignore',
      },
    ],
    'no-underscore-dangle': 0,
    'no-undef': 1,
    'linebreak-style': [0, 'unix'],
    'sort-imports': [
      2,
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        ignoreDeclarationSort: false,
        memberSyntaxSortOrder: ['all', 'single', 'multiple', 'none'],
        allowSeparatedGroups: true,
      },
    ],
    'no-promise-executor-return': 0,
    'default-param-last': 0,
    'no-unsafe-optional-chaining': 1,
    'class-methods-use-this': 0,
    'prettier/prettier': [
      'error',
      {
        semi: true,
        trailingComma: 'all',
        singleQuote: true,
        printWidth: 120,
        tabWidth: 2,
        endOfLine: 'auto',
      },
    ],
  },
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
    es6: true,
  },
};
