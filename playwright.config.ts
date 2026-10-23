import { defineConfig, devices } from '@playwright/test';

// Browser tests for the main flows. TMDB is mocked (see e2e/tmdb-mock.ts), so they don't depend
// on the network or on what's popular this week.
//
//   npx playwright install chromium   (once)
//   npm run e2e
//
// To use an installed browser instead of downloading one: PW_CHANNEL=msedge npm run e2e
const channel = process.env['PW_CHANNEL'];

export default defineConfig({
  testDir: 'e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  // The dev server compiles on the first requests, so the first tests can be slow.
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4300',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 }, channel },
    },
    { name: 'phone', use: { ...devices['Pixel 7'], channel } },
  ],
  webServer: {
    command: 'npx ng serve --port 4300',
    url: 'http://localhost:4300',
    reuseExistingServer: true,
    timeout: 180_000,
  },
});
