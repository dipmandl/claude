const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const { test } = require('../support/fixtures');

const { Then } = createBdd(test);

Then('the first card product should contain {string}', async ({ dashboard }, text) => {
  const productText = await dashboard.getCardProduct(0);
  expect((productText || '').toLowerCase()).toContain(text.toLowerCase());
});

Then('the second card product should contain {string}', async ({ dashboard }, text) => {
  const productText = await dashboard.getCardProduct(1);
  expect((productText || '').toLowerCase()).toContain(text.toLowerCase());
});

Then('only cards from {string} should be visible', async ({ dashboard }, productName) => {
  const cards = dashboard.cards();
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const text = (await cards.nth(i).locator('.product-version').textContent() || '').toLowerCase();
    expect(text).toContain(productName.toLowerCase());
  }
});
