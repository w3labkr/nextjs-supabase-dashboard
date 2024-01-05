/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parserOptions: {
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
    'next',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'react', 'react-hooks', 'prettier'],
  rules: {
    // 'React' must be in scope when using JSX react/react-in-jsx-scope`
    'react/react-in-jsx-scope': 'off',
    // Unable to resolve path to module ...
    'import/no-unresolved': 'off',
    // ... is defined but never used.
    'no-unused-vars': 'warn',
  },
  ignorePatterns: ['*.config.js'],
};
