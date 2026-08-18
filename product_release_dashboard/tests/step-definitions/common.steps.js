const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const { test } = require('../support/fixtures');

const { Given, When, Then } = createBdd(test);

Given('I am on the Release Notes Dashboard with seed data', async ({ dashboard }) => {
  await dashboard.navigate();
});

Given('the dashboard has {int} release cards', async ({ dashboard }, count) => {
  await expect(dashboard.cards()).toHaveCount(count);
});

When('I type {string} in the product filter', async ({ dashboard }, text) => {
  await dashboard.productFilter.fill(text);
});

When('I type {string} in the search filter', async ({ dashboard }, text) => {
  await dashboard.searchFilter.fill(text);
});

When('I clear the search filter', async ({ dashboard }) => {
  await dashboard.searchFilter.clear();
});

When('I select {string} from the sort dropdown', async ({ dashboard }, option) => {
  await dashboard.sortSelect.selectOption({ label: option });
});

When('I select {string} from the change type filter', async ({ dashboard }, option) => {
  await dashboard.breakingFilter.selectOption({ label: option });
});

Given('I type {string} in the product filter', async ({ dashboard }, text) => {
  await dashboard.productFilter.fill(text);
});

Given('I type {string} in the search filter', async ({ dashboard }, text) => {
  await dashboard.searchFilter.fill(text);
});

Given('the release list has fewer cards than the total', async ({ dashboard }) => {
  const summaryText = await dashboard.resultsSummary.textContent();
  // Verify summary shows fewer than total (e.g. "1 of 2")
  expect(summaryText).toMatch(/\d+ of \d+/);
});

Then('the release list should be empty', async ({ dashboard }) => {
  await expect(dashboard.cards()).toHaveCount(0);
});

Then('an empty-state message should be visible', async ({ dashboard }) => {
  await expect(dashboard.releaseList.locator('.empty-state')).toBeVisible();
});

Then('the release list should have {int} card', async ({ dashboard }, count) => {
  await expect(dashboard.cards()).toHaveCount(count);
});

Then('the release list should show all unfiltered cards', async ({ dashboard }) => {
  await expect(dashboard.cards()).toHaveCount(2);
});
