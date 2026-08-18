const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const { test } = require('../support/fixtures');

const { When, Then } = createBdd(test);

When('I add a new non-breaking release note', async ({ dashboard }) => {
  await dashboard.addRelease({
    product:     'New Product',
    version:     'v1.0.0',
    title:       'New Release',
    description: 'A freshly added release.',
    date:        '2026-08-18',
  });
});

Then('the results summary should show {string}', async ({ dashboard }, text) => {
  await expect(dashboard.resultsSummary).toContainText(text);
});

Then('the results summary should contain {string}', async ({ dashboard }, text) => {
  await expect(dashboard.resultsSummary).toContainText(text);
});
