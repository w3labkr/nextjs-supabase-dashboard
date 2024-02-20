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
  plugins: ['import', 'react', 'react-hooks', '@typescript-eslint'],
  rules: {
    // 'React' must be in scope when using JSX react/react-in-jsx-scope`
    // 'react/react-in-jsx-scope': 'warn',
    // No default export found in imported module "react-dom/client".
    // 'import/default': 'warn',
    // Using exported name ... as identifier for default export.
    // 'import/no-named-as-default': 'warn',
    // ... is not defined.
    'no-undef': 'error',
    // Unable to resolve path to module ...
    'import/no-unresolved': 'warn',
    // ... is defined but never used.
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    // Unexpected any. Specify a different type.
    '@typescript-eslint/no-explicit-any': 'off',
    // Using `<img>` could result in slower LCP and higher bandwidth.
    '@next/next/no-img-element': 'off',
    // ... is never reassigned. Use 'const' instead.
    'prefer-const': 'warn',
  },
  ignorePatterns: [
    '.eslintrc.js',
    'next.config.mjs',
    'postcss.config.js',
    'tailwind.config.ts',
    'components/ui',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
}
