import globals from 'globals'
import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // infra/ is a self-contained AWS CDK app with its own tooling; its synthesized
  // cdk.out bundles and the CloudFront Function are not linted as app code.
  { ignores: ['dist', 'node_modules', 'infra', 'playwright-report', 'test-results', 'coverage'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Node-context config files (build/test tooling).
    files: ['*.config.js', 'vite.config.js', 'vitest.config.js', 'playwright.config.js'],
    languageOptions: { globals: globals.node },
  },
]
