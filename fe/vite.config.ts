import { defineConfig } from 'vite-plus'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import annotator from 'vite-plugin-ai-annotator'

export default defineConfig({
  lint: {
    ignorePatterns: ['src/components/ui/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'no-console': ['error', { allow: ['error', 'warn'] }],
    },
  },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html'],
    },
  },
  staged: {
    '*.{ts,vue}': 'vp check --fix',
  },
  plugins: [vue(), tailwindcss(), VueDevTools(), annotator({ port: 7318 })],
  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src`,
      '@shared': `${import.meta.dirname}/../shared`,
    },
  },
  server: {
    proxy: {
      '/api': `http://localhost:${process.env.PORT || 8787}`,
    },
  },
})
