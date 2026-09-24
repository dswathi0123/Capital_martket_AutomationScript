// tests/support/fixtures.js
//
// Extends the base Playwright test with a `scenarioContext` fixture — a
// plain object, fresh per scenario, that step definitions use to pass
// data to each other (e.g. "submit an order" records the symbol so a
// later "it should eventually settle" step knows what to poll for).

const { test: base } = require("playwright-bdd");

const test = base.extend({
  scenarioContext: async ({}, use) => {
    await use({});
  },
});

module.exports = { test };
