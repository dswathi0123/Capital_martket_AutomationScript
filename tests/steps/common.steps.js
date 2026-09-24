// tests/steps/common.steps.js
//
// Shared navigation steps used across every feature file.

const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");
const { test } = require("../support/fixtures");

const { Given, When } = createBdd(test);

const VIEW_MAP = {
  "Order blotter": "blotter",
  "Clearing & settlement": "settlement",
  Reports: "reports",
};

Given("I am on the order blotter", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#view-blotter")).toBeVisible();
});

When("I switch to the {string} view", async ({ page }, viewLabel) => {
  const viewKey = VIEW_MAP[viewLabel];
  if (!viewKey) throw new Error(`Unknown view label: "${viewLabel}"`);
  await page.locator(`.nav-item[data-view="${viewKey}"]`).click();
  await expect(page.locator(`#view-${viewKey}`)).toBeVisible();
});
