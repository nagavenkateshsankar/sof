// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '../tests',
  testMatch: '**/record-full-quiz-current-resolution.spec.js', // Only run the recording test
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1, // Single worker for clean recording
  reporter: 'line',

  timeout: 180000, // 3 minutes timeout
  use: {
    actionTimeout: 0,
    trace: 'off',
    video: {
      mode: 'on',
      size: { width: 1280, height: 720 } // Current screen resolution
    },
    screenshot: 'off',
  },

  projects: [
    {
      name: 'chromium-recording',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 }, // Match current screen
        launchOptions: {
          slowMo: 0 // No slow motion for natural recording
        }
      },
    },
  ],

  webServer: {
    command: 'python3 -m http.server 9090',
    port: 9090,
    reuseExistingServer: !process.env.CI,
  },
});