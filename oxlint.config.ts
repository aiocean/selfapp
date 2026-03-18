import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: ['typescript', 'vue', 'import', 'unicorn'],
  rules: {
    eqeqeq: 'warn',
    'no-console': 'warn',
    'typescript/no-explicit-any': 'warn',
    'typescript/no-unused-vars': 'error',
  },
  ignorePatterns: ['dist/**', 'node_modules/**', '*.d.ts'],
})
