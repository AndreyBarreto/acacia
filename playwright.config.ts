import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
// PORT lets parallel worktrees run their own preview server.
const port = Number(process.env.PORT ?? 4321);

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'iphone', use: { ...devices['iPhone 15'] } },
    { name: 'android', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // Tests run against the production build, never the dev server.
    // --ignore-lock keeps `astro preview` in the foreground (Astro auto-backgrounds it when it
    // detects an AI agent, which makes Playwright think the server exited).
    command: `pnpm build && pnpm preview --port ${port} --ignore-lock`,
    url: `http://localhost:${port}/`,
    reuseExistingServer: !isCI,
  },
});
