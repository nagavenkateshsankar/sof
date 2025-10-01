// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/full-quiz-4k-recording.spec.js', // Only run the 4K recording test
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1, // Single worker for clean recording
  reporter: [['list'], ['html']],
  timeout: 180000, // 3 minutes for the full quiz
  use: {
    baseURL: 'file://' + __dirname,
    trace: 'off', // Disable trace for performance
    screenshot: 'off', // Disable screenshots for performance
    video: {
      mode: 'on',
      size: { width: 3840, height: 2160 } // 4K resolution
    },
    viewport: { width: 3840, height: 2160 }, // 4K viewport
    launchOptions: {
      slowMo: 100 // Slight slowdown for smoother recording
    }
  },
  projects: [
    {
      name: 'chromium-4k',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 3840, height: 2160 },
        deviceScaleFactor: 1,
      },
    },
  ],
  webServer: {
    command: 'python3 -m http.server 9090',
    port: 9090,
    reuseExistingServer: true,
  },
});