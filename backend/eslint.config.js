const globals = require('globals');
const eslintRecommended = require('@eslint/js').configs.recommended;
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
  eslintRecommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      // Add any specific rules here
      'no-unused-vars': ['warn', { argsIgnorePattern: 'next' }], // Allow 'next' for Express middleware
      // Prettier rules
      'prettier/prettier': 'error',
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
