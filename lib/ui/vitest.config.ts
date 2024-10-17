/// <reference types="vitest" />


import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Add specific coverage settings if needed
    coverage: {
      provider: 'v8',
      exclude: ["dist"],
      reporter: ['text', 'json', 'html'],
    },
  },
})