// tests/steps/reports.steps.js
//
// Steps that read the aggregate stat cards on the Reports view.

const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");
const { test } = require("../support/fixtures");

const { Then } = createBdd(test);

function statValue(page, label) {
  return page.locator(".stat", { hasText: label }).locator(".value");
}

Then("the {string} stat should be at least {string}", async ({ page }, label, minValueStr) => {
  const minValue = Number(minValueStr);
  const locator = statValue(page, label);
  await expect(locator).toBeVisible({ timeout: 5000 });
  const text = (await locator.textContent()).replace(/[^0-9.-]/g, "");
  expect(Number(text)).toBeGreaterThanOrEqual(minValue);
});
