import tailwind from 'eslint-plugin-tailwindcss';
import astroEslintParser from 'astro-eslint-parser';
import eslintPluginAstro from 'eslint-plugin-astro';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import typescriptParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  ...tailwind.configs['flat/recommended'],
  ...eslintPluginAstro.configs['flat/recommended'],
  ...tseslint.configs.recommended,
  {
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
    // Define the configuration for `<script>` tag.
    // Script in `<script>` is assigned a virtual file name with the `.js` extension.
    files: ['**/*.{ts,tsx}', '**/*.astro/*.js'],
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      // Note: you must disable the base rule as it can report incorrect errors
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',

      complexity: ['warn', { max: 10 }], // Warn when code complexity exceeds 10

      // Uppercase Constants
      'no-restricted-syntax': [
        'warn',
        {
          selector: "VariableDeclarator[init.type='Literal'][id.name!=/^[A-Z_]+$/]",
          message: 'Constants should be in uppercase with underscores.',
        },
      ],

      // No Comments
      'no-warning-comments': ['warn', { terms: ['todo', 'fixme', 'xxx'], location: 'start' }],

      // Short Functions/Methods
      'max-lines-per-function': ['warn', { max: 30, skipComments: true }], // Warn if a function exceeds 30 lines

      // Descriptive Naming
      'id-length': [
        'warn',
        { min: 3, exceptions: ['i', 'j', 'x', 'y', '_'] }, // Warn if variable names are shorter than 3 characters
      ],

      // Avoid Magic Numbers
      'no-magic-numbers': ['warn', { ignore: [0, 1, -1], ignoreArrayIndexes: true, enforceConst: true }],

      // Limit File Line Length (200-500 max)
      'max-lines': [
        'warn',
        {
          max: 400, // Set max file length to 400 lines
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      // Avoid Deep Loops
      'max-depth': ['warn', 3], // Already added for nesting

      // Consistent Indentation and Formatting
      indent: ['warn', 2], // Enforce 2-space indentation
      // 'prettier/prettier': 'warn', // Add Prettier plugin for consistent formatting

      // Immutable Variables
      'prefer-const': 'warn', // Prefer `const` where variables are never reassigned
      'no-var': 'warn', // Disallow `var`

      // Avoid Using `else`
      'no-else-return': 'warn', // Suggest avoiding `else` after `return`
    },
  },
  {
    ignores: ['dist', 'node_modules', '.github', 'types.generated.d.ts', '.astro'],
  },
];
