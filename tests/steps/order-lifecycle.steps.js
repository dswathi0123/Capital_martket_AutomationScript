// tests/steps/order-lifecycle.steps.js
//
// Steps that drive an order to a terminal state and inspect its
// full audit history (the `history` array each order accumulates).

const { createBdd } = require("playwright-bdd");
const { expect } = require("@playwright/test");
const { test } = require("../support/fixtures");
const { isTerminal, pollOrderBySymbol } = require("../support/helpers");

const { When, Then } = createBdd(test);

When("the order eventually reaches a terminal status", async ({ request, scenarioContext }) => {
  const order = await pollOrderBySymbol(request, scenarioContext.symbol, (o) => isTerminal(o.status), {
    timeoutMs: 12000,
  });
  scenarioContext.lastKnownOrder = order;
});

When("the order eventually reaches status {string}", async ({ request, scenarioContext }, expectedStatus) => {
  const order = await pollOrderBySymbol(request, scenarioContext.symbol, (o) => o.status === expectedStatus, {
    timeoutMs: 12000,
  });
  scenarioContext.lastKnownOrder = order;
});

Then("the order should eventually reach a terminal status", async ({ request, scenarioContext }) => {
  const order = await pollOrderBySymbol(request, scenarioContext.symbol, (o) => isTerminal(o.status), {
    timeoutMs: 12000,
  });
  expect(isTerminal(order.status)).toBeTruthy();
});

Then("the order history should include the stage {string}", async ({ request, scenarioContext }, stage) => {
  const order = await pollOrderBySymbol(request, scenarioContext.symbol, () => true);
  const stages = order.history.map((h) => h.status);
  expect(stages).toContain(stage);
});
