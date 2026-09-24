// tests/support/helpers.js
//
// Polling helpers used by step definitions. The app's lifecycle runs
// asynchronously server-side, so tests assert eventual state via the
// API (fast, reliable) rather than waiting on UI animations.

const { HAPPY_PATH } = require("../../src/models/Order");

const TERMINAL_STATUSES = ["SETTLED", "FAILED", "REJECTED"];

function isTerminal(status) {
  return TERMINAL_STATUSES.includes(status);
}

/** True if `status` is at or beyond `minStatus` on the happy path (FAILED counts as terminal/"later"). */
function isAtLeast(status, minStatus) {
  if (status === "FAILED") return true;
  const idx = HAPPY_PATH.indexOf(status);
  const minIdx = HAPPY_PATH.indexOf(minStatus);
  if (idx === -1) return false; // e.g. REJECTED is not "on" the happy path
  return idx >= minIdx;
}

async function findLatestOrderBySymbol(request, symbol) {
  const res = await request.get("/api/orders");
  const orders = await res.json();
  return orders.find((o) => o.symbol === symbol); // API returns newest first
}

/** Polls the API until `predicate(order)` is true, or throws after `timeoutMs`. */
async function pollOrderBySymbol(request, symbol, predicate, { timeoutMs = 10000, intervalMs = 250 } = {}) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await findLatestOrderBySymbol(request, symbol);
    if (last && predicate(last)) return last;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(
    `Timed out waiting for order "${symbol}" to satisfy the expected condition. Last seen: ${JSON.stringify(last)}`
  );
}

module.exports = { isTerminal, isAtLeast, findLatestOrderBySymbol, pollOrderBySymbol, TERMINAL_STATUSES };
