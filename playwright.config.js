// playwright.config.js
//
// Wires up playwright-bdd: it generates plain Playwright test files from
// the .feature + step-definition files under tests/, into a hidden
// .features-gen directory, which is what actually gets run.

const { defineConfig, devices } = require("@playwright/test");
const { defineBddConfig } = require("playwright-bdd");

const testDir = defineBddConfig({
  features: "tests/features/**/*.feature",
  steps: ["tests/steps/**/*.js", "tests/support/fixtures.js"],
});

module.exports = defineConfig({
  testDir,
  timeout: 20_000,
  fullyParallel: false, // the app's in-memory store is shared/stateful
  // The app intentionally simulates a ~5% random settlement exception
  // (see clearingService.js FAILURE_RATE). One retry absorbs that
  // expected randomness without masking a genuinely broken test.
  retries: 1,
  reporter: [["list"]],

  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],

  // Starts the app automatically before the suite runs (and reuses a
  // server you already have running locally during development).
  webServer: {
    command: "npm start",
    url: "http://localhost:3000/api/health",
    reuseExistingServer: true,
    timeout: 15_000,
  },
});
