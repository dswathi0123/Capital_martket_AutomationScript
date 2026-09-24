// tests/steps/order-entry.steps.js
//
// Steps for submitting orders through the UI and asserting on their
// resulting status, backed by API polling for eventual-state checks.

const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");
const { test } = require("../support/fixtures");
const { isAtLeast, pollOrderBySymbol } = require("../support/helpers");

const { When, Then } = createBdd(test);

async function fillAndSubmit(page, { clientAccount = "ACC-10245", symbol, quantity, price, side }) {
  await page.locator('input[name="clientAccount"]').fill(clientAccount);
  await page.locator('input[name="symbol"]').fill(symbol);
  await page.locator('input[name="quantity"]').fill(String(quantity));
  await page.locator('input[name="price"]').fill(String(price));
  await page.locator(side === "SELL" ? ".btn-sell" : ".btn-buy").click();
}

When(
  'I submit a {string} order for {string} with quantity {string} at price {string}',
  async ({ page, scenarioContext }, side, symbol, quantity, price) => {
    await fillAndSubmit(page, { symbol, quantity, price, side });
    scenarioContext.symbol = symbol;
  }
);

When(
  'I submit an order for account {string} symbol {string} quantity {string} price {string}',
  async ({ page, scenarioContext }, account, symbol, quantity, price) => {
    await fillAndSubmit(page, { clientAccount: account, symbol, quantity, price, side: "BUY" });
    scenarioContext.symbol = symbol;
  }
);

Then("the order should appear in the blotter for {string}", async ({ page }, symbol) => {
  await expect(page.locator("#orders-body")).toContainText(symbol, { timeout: 5000 });
});

Then(
  "the order should eventually reach a status of {string} or later",
  async ({ request, scenarioContext }, minStatus) => {
    const order = await pollOrderBySymbol(request, scenarioContext.symbol, (o) => isAtLeast(o.status, minStatus));
    expect(isAtLeast(order.status, minStatus)).toBeTruthy();
  }
);

Then("the order should eventually have status {string}", async ({ request, scenarioContext }, expectedStatus) => {
  const order = await pollOrderBySymbol(request, scenarioContext.symbol, (o) => o.status === expectedStatus);
  expect(order.status).toBe(expectedStatus);
});
