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
    // Disallow unused variables
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    // Using exported name ... as identifier for default export.
    'import/no-named-as-default': 'off',
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
