/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@repo/eslint-config/base'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  rules: {
    'no-redeclare': 'off',
  },
};
