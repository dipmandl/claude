const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const { test } = require('../support/fixtures');

const { When, Then } = createBdd(test);

When('I click the Edit button on the first release card', async ({ dashboard }) => {
  await dashboard.clickEdit(0);
});

When('I clear the title field and type {string}', async ({ dashboard }, text) => {
  await dashboard.titleInput.clear();
  await dashboard.titleInput.fill(text);
});

When('I click the submit button', async ({ dashboard }) => {
  await dashboard.submitForm();
});

When('I click the Cancel button', async ({ dashboard }) => {
  await dashboard.cancelEditBtn.click();
});

Then('the form title input should contain the first release title', async ({ dashboard, page }) => {
  const firstCardTitle = await dashboard.getCardTitle(0);
  // After clicking edit the field is populated — read value from input
  const inputValue = await dashboard.titleInput.inputValue();
  expect(inputValue.trim()).toBe((firstCardTitle || '').trim());
});

Then('the submit button label should be {string}', async ({ dashboard }, label) => {
  await expect(dashboard.submitBtn).toHaveText(label, { ignoreCase: false });
});

Then('the Cancel button should be visible', async ({ dashboard }) => {
  await expect(dashboard.cancelEditBtn).toBeVisible();
});

Then('the Cancel button should be hidden', async ({ dashboard }) => {
  await expect(dashboard.cancelEditBtn).toBeHidden();
});

Then('a card with title {string} should appear in the list', async ({ dashboard }, title) => {
  await expect(dashboard.releaseList.locator('.release-title', { hasText: title })).toBeVisible();
});

Then('no card with title {string} should exist in the list', async ({ dashboard }, title) => {
  await expect(dashboard.releaseList.locator('.release-title', { hasText: title })).toHaveCount(0);
});
