# ETMS test suite (Playwright + BDD)

End-to-end tests written as Gherkin `.feature` files, run through
[playwright-bdd](https://github.com/vitalets/playwright-bdd), which
converts them into native Playwright tests at runtime.

## Setup

```bash
npm install
npx playwright install chromium   # one-time browser download
```

## Run

```bash
npm run test:bdd            # generate + run headless
npm run test:bdd:headed     # generate + run with a visible browser
npm run test:bdd:report     # open the last HTML report
```

`npm run test:bdd` does two things:
1. `bddgen` — reads `tests/features/*.feature` + `tests/steps/*.js` and
   generates plain Playwright spec files into `.features-gen/` (git-ignored)
2. `playwright test` — runs those generated specs

The app is started automatically via the `webServer` block in
`playwright.config.js` (`npm start`), and reused if you already have it
running locally on port 3000.

## Structure

```
tests/
├── features/                    # Gherkin scenarios — the readable spec
│   ├── order-entry.feature      # order submission + validation rules
│   ├── order-lifecycle.feature  # full lifecycle to a terminal state
│   ├── settlement.feature       # clearing & settlement queue view
│   └── reports.feature          # reporting dashboard stat cards
├── steps/                       # step definitions (the "glue" code)
│   ├── common.steps.js          # navigation between views
│   ├── order-entry.steps.js     # submitting orders, status assertions
│   ├── order-lifecycle.steps.js # polling to a terminal state, history
│   ├── settlement.steps.js      # settlement queue row assertions
│   └── reports.steps.js         # stat-card assertions
└── support/
    ├── fixtures.js               # scenario-scoped context object
    └── helpers.js                # status-ordering + polling helpers
```

## How scenarios share data

Each scenario gets a fresh `scenarioContext` object (a Playwright
fixture, see `support/fixtures.js`). A `When I submit an order...` step
records the symbol on it; later `Then` steps read it back — so steps
stay reusable across features instead of re-parsing the page each time.

## Why polling via the API, not the UI

The order lifecycle runs asynchronously on the server (simulated
compliance checks, exchange round-trip, etc. — see
`src/services/orderLifecycle.js`). Steps that wait for a status change
poll `GET /api/orders` directly (`support/helpers.js`) rather than
waiting on a UI element, since the blotter only shows the *current*
status, not a promise of a future one. UI-facing steps (filling the
form, reading table rows) still drive/assert through the page as normal.

## A note on the one intentionally flaky scenario

`clearingService.js` simulates a ~5% random settlement exception
(`FAILURE_RATE`), matching how real settlement occasionally fails and
needs manual review. `playwright.config.js` sets `retries: 1` so that
expected randomness doesn't fail the whole suite — the same pattern
you'd use for any test touching a system with real-world flakiness.
