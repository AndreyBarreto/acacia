import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
// Tests own their port (never 4321, where `astro dev` runs). PORT lets parallel worktrees
// run their own preview server.
const port = Number(process.env.PORT ?? 4400);

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
    // Never reuse a running server: it could be a dev server instead of the production build.
    reuseExistingServer: false,
    // The build processes every photo and OG image; on a 2-core CI runner it takes over 60 s.
    timeout: 180_000,
  },
});
