import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
const apiURL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:5000';

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    extraHTTPHeaders: {},
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'npm run dev',
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm start',
      cwd: '../backend',
      url: `${apiURL}/`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
