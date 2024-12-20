import tailwind from 'eslint-plugin-tailwindcss';
import astroEslintParser from 'astro-eslint-parser';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import js from '@eslint/js';
import tsEslint from 'typescript-eslint';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  ...tailwind.configs['flat/recommended'],
  ...eslintPluginAstro.configs['flat/recommended'],
  ...tsEslint.configs.recommended,
  prettier, // Add Prettier configuration to disable conflicting ESLint rules
  {
    plugins: {
      prettier: prettierPlugin, // Add Prettier plugin
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  },
  {
    files: ['**/*.{js,jsx,astro}'],
    rules: {
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    },
  },
  {
    files: ['**/*.{ts,tsx}', '**/*.astro/*.js'],
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      complexity: ['warn', { max: 10 }],
      'max-depth': ['warn', 1],
      'no-nested-ternary': 'error',
      'no-restricted-syntax': [
        'warn',
        {
          selector: "VariableDeclaration[kind='const'] > VariableDeclarator[init.type='Literal'][id.name!=/^[A-Z_]+$/]",
          message: 'Constants should be in uppercase with underscores.',
        },
      ],
      'no-warning-comments': ['warn', { terms: ['todo', 'fixme', 'xxx'], location: 'start' }],
      'max-lines-per-function': ['warn', { max: 35, skipComments: true }],
      'no-magic-numbers': ['warn', { ignore: [0, 1, -1], ignoreArrayIndexes: true, enforceConst: true }],
      'max-lines': [
        'warn',
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
      'prefer-const': 'warn',
      'no-var': 'warn',
      'no-else-return': 'warn',
    },
  },
  {
    ignores: ['dist', 'node_modules', '.github', 'types.generated.d.ts', '.astro'],
  },
];
