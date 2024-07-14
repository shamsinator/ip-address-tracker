module.exports = {
  root: true, // Indicates this configuration applies to the root directory and its subdirectories
  env: {
    browser: true, // Enables browser globals like `window` and `document`
    es2020: true, // Enables ES2020 global variables and ES2020 syntax
    node: true // Enables Node.js global variables and Node.js specific rules
  },
  parserOptions: {
    sourceType: 'module', // Specifies that the code is in ECMAScript module format
    ecmaVersion: 2020, // Specifies the ECMAScript version to ES2020 (ES11)
    ecmaFeatures: {
      jsx: true // Enables JSX syntax parsing
    }
  },
  extends: [
    'eslint:recommended', // Uses ESLint's recommended rules for all ESLint core rules
    'plugin:@typescript-eslint/recommended', // Uses recommended rules from @typescript-eslint/eslint-plugin
    'plugin:react-hooks/recommended', // Uses recommended rules from eslint-plugin-react-hooks plugin
    'prettier' // Integrates Prettier's formatting rules to ESLint
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'], // Ignores files matching these patterns from linting
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript files
  plugins: ['react', '@typescript-eslint', 'prettier', 'react-refresh'], // Specifies ESLint plugins to use
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true } // Warns if React components are not exported as constants
    ],
    'prettier/prettier': 'error' // Displays Prettier errors as ESLint errors
  },
  settings: {
    react: {
      version: 'detect' // Automatically detects the React version used in the project
    }
  }
}
