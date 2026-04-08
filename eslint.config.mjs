import js from '@eslint/js';
import json from '@eslint/json';
import {defineConfig} from 'eslint/config';
import importPlugin from "eslint-plugin-import";
import reactHookLint from "eslint-plugin-react-hooks";
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    
    ignores: ['src/components/global/**/*.{js,ts,tsx}', 'src/components/ui/**/*.{js,ts,tsx}'],
  },
  tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,tsx}'],
    plugins: {
      js,
      'unused-imports': unusedImports,
      'import': importPlugin,
      "eslint-plugin-react-hooks": reactHookLint
    },
    extends: ['js/recommended'],
    rules: {
      "eslint-plugin-react-hooks/exhaustive-deps": "error",
      'no-unused-vars': 'off',
      "no-prototype-builtins": "off",
      "no-undef":"off",
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_',  },
      ],  
      '@typescript-eslint/naming-convention':[
        'error',
        {
          'selector': 'variableLike',
          'format': ['camelCase', 'UPPER_CASE', "PascalCase"],
          'leadingUnderscore': 'allow'
        },
        {
          'selector': 'function',
          'format': ['camelCase', 'PascalCase'],
        }
      ],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
        groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
        pathGroups: [{ pattern: '@/**', group: 'internal', position: 'after' }],
        pathGroupsExcludedImportTypes: ['builtin']
        }
      ],
      "sort-imports": [
        "error",
        {
          "ignoreDeclarationSort": true,
          "ignoreCase": true,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false,
        }
      ],
    },
  },
  { files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
  { files: ['**/*.jsonc'], plugins: { json }, language: 'json/jsonc', extends: ['json/recommended'] },
  { files: ['**/*.json5'], plugins: { json }, language: 'json/json5', extends: ['json/recommended'] },
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], languageOptions: { globals: globals.browser } },
]);
