import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    timeout: 60000, // 60 seconds for integration tests
    testTimeout: 60000,
    setupFiles: [],
    include: [
      'src/**/*.test.ts',
      'src/**/*.integration.test.ts'
    ],
    exclude: [
      'node_modules/**',
      'dist/**'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
})