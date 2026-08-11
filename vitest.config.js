import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Separate from vite.config.js on purpose: unit tests must NOT trigger the
// optimize-images `buildStart` plugin or vite-plugin-mkcert. Vitest prefers
// this file over vite.config.js when both exist.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.{js,mjs}'],
  },
});
