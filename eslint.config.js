import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import jsxA11y from 'eslint-plugin-jsx-a11y-x'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { reactRefresh } from 'eslint-plugin-react-refresh'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'dist-ssr', '**/*.local']),

  // Base rules for every linted file
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  },

  // Application code (runs in the browser)
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite(),
      jsxA11y.configs.recommended
    ],
    languageOptions: {
      globals: globals.browser
    },
    settings: {
      // Pinned instead of 'detect': eslint-plugin-react 7.37.5 calls
      // context.getFilename() for detection, which ESLint 10 removed.
      // Keep in sync with the installed React version. Switch back to
      // 'detect' (and drop the package.json override) once
      // eslint-plugin-react officially supports ESLint 10.
      react: { version: '18.3' }
    }
  },

  // Tooling config files (run in Node)
  {
    files: ['*.{js,cjs,mjs,ts}'],
    languageOptions: {
      globals: globals.node
    }
  },

  // Must stay last: disables formatting rules and runs Prettier as a rule
  prettierRecommended
])
