import globals from 'globals';
import eslintRecommended from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

export default [
  eslintRecommended.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        // Vitest globals
        vi: true,
        describe: true,
        it: true,
        expect: true,
        beforeEach: true,
        // React Testing Library globals
        screen: true,
        waitFor: true,
        fireEvent: true,
        render: true,
        // For react-router-dom Router
        Router: true,
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    rules: {
      // React-specific rules
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed for React 17+ with new JSX transform
      'react/prop-types': 'off', // Disable if using TypeScript or not enforcing prop-types
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn for unused vars, ignore starting with _
      // Prettier rules
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
  },
  {
    // Apply prettier plugin to all files
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...prettierConfig.rules,
    },
  },
];
