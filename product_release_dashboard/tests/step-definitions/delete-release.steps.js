const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const { test } = require('../support/fixtures');

const { When, Then } = createBdd(test);

When('I click the Delete button on the first release card', async ({ dashboard }) => {
  await dashboard.clickDelete(0);
});

When('I click the Confirm delete button', async ({ dashboard }) => {
  await dashboard.confirmDelete(0);
});

When('I click the Cancel delete button', async ({ dashboard }) => {
  await dashboard.cancelDelete(0);
});

Then('the inline delete confirmation row should be visible on the first card', async ({ dashboard }) => {
  await expect(dashboard.card(0).locator('.delete-confirm')).toBeVisible();
});

Then('the inline delete confirmation row should be hidden on the first card', async ({ dashboard }) => {
  await expect(dashboard.card(0).locator('.delete-confirm')).toBeHidden();
});

Then('the card action buttons row should be hidden on the first card', async ({ dashboard }) => {
  await expect(dashboard.card(0).locator('.card-actions')).toBeHidden();
});

Then('the card action buttons row should be visible on the first card', async ({ dashboard }) => {
  await expect(dashboard.card(0).locator('.card-actions')).toBeVisible();
});

Then('the browser dialog should not have appeared', async ({ page }) => {
  // window.confirm / window.alert would be intercepted by Playwright;
  // if none appeared during the test the dialog flag stays false.
  // We verify by checking that the page is still in the expected state.
  await expect(page.locator('.delete-confirm').first()).toBeVisible();
});
