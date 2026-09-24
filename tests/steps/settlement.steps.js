// tests/steps/settlement.steps.js
//
// Steps that assert on the "Clearing & settlement" view, which lists
// orders once they've reached the CLEARING stage or beyond.

const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");
const { test } = require("../support/fixtures");

const { Then } = createBdd(test);

function settlementRow(page, symbol) {
  return page.locator("#settlement-body tr", { hasText: symbol });
}

Then("the settlement queue should contain an entry for {string}", async ({ page }, symbol) => {
  await expect(settlementRow(page, symbol)).toBeVisible({ timeout: 5000 });
});

Then("that entry's counterparty should be {string}", async ({ page, scenarioContext }, counterparty) => {
  const row = settlementRow(page, scenarioContext.symbol);
  await expect(row).toContainText(counterparty);
});

Then("that entry's progress bar for {string} should be full", async ({ page }, symbol) => {
  const row = settlementRow(page, symbol);
  const fill = row.locator(".progress-fill");
  await expect(fill).toHaveAttribute("style", /width\s*:\s*100%/, { timeout: 5000 });
});
