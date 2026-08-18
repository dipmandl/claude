const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const { test } = require('../support/fixtures');

const { Then } = createBdd(test);

Then('only cards with {string} in the title or description should be visible', async ({ dashboard }, text) => {
  const cards = dashboard.cards();
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const titleText = (await card.locator('.release-title').textContent() || '').toLowerCase();
    const descText  = (await card.locator('.release-description').textContent() || '').toLowerCase();
    const matched = titleText.includes(text.toLowerCase()) || descText.includes(text.toLowerCase());
    expect(matched, `Card ${i} does not contain "${text}" in title or description`).toBe(true);
  }
});

Then('at least one card should be visible', async ({ dashboard }) => {
  await expect(dashboard.cards().first()).toBeVisible();
});

Then('only cards matching both filters should be visible', async ({ dashboard, page }) => {
  const productValue = await dashboard.productFilter.inputValue();
  const searchValue  = await dashboard.searchFilter.inputValue();
  const cards = dashboard.cards();
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const productText = (await card.locator('.product-version').textContent() || '').toLowerCase();
    const titleText   = (await card.locator('.release-title').textContent() || '').toLowerCase();
    const descText    = (await card.locator('.release-description').textContent() || '').toLowerCase();
    expect(productText).toContain(productValue.toLowerCase());
    const matchesSearch = titleText.includes(searchValue.toLowerCase()) || descText.includes(searchValue.toLowerCase());
    expect(matchesSearch).toBe(true);
  }
});
