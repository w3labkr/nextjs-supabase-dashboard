/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:import/typescript',
    'next',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'import', 'react', 'react-hooks', 'prettier'],
  rules: {
    // 'React' must be in scope when using JSX react/react-in-jsx-scope`
    'react/react-in-jsx-scope': 'off',
    // Unable to resolve path to module ...
    'import/no-unresolved': 'warn',
    // Using exported name ... as identifier for default export.
    'import/no-named-as-default': 'off',
    //  Disallow unused variables
    '@typescript-eslint/no-unused-vars': 'warn',
    // Promise-returning function provided to attribute where a void return was expected.
    '@typescript-eslint/no-misused-promises': 'off',
    // Unexpected any.
    // '@typescript-eslint/no-unsafe-argument': 'off',
    // '@typescript-eslint/no-unsafe-member-access': 'off',
    // '@typescript-eslint/no-unsafe-assignment': 'off',
    // '@typescript-eslint/no-unsafe-return': 'off',
    // '@typescript-eslint/no-unsafe-call': 'off',
    // '@typescript-eslint/no-explicit-any': 'off',
    // Async function has no 'await' expression.
    '@typescript-eslint/require-await': 'off',
  },
  // ignorePatterns: ['.eslintrc.js', '*.config.js', '*.config.ts'],
  ignorePatterns: ['.eslintrc.js', '*.config.js'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
};
