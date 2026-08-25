import { defineConfig, devices } from '@playwright/test';

// Against the ephemeral preview when E2E_BASE_URL is set (CI); otherwise a
// local `vite preview` build over HTTPS (mkcert — see vite.config.js). The
// local server is only started in the latter case; scripts/run-e2e.mjs makes
// the webServer readiness probe trust the mkcert CA via NODE_EXTRA_CA_CERTS.
const baseURL = process.env.E2E_BASE_URL || 'https://localhost:4173';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  ...(process.env.E2E_BASE_URL
    ? {}
    : {
        webServer: {
          command: 'yarn build && yarn preview --port 4173 --strictPort',
          url: 'https://localhost:4173',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      }),
});
