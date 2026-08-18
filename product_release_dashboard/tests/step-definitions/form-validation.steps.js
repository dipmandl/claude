const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const { test } = require('../support/fixtures');

const { Given, When, Then } = createBdd(test);

When('I click the submit button without filling any fields', async ({ dashboard }) => {
  await dashboard.submitForm();
});

When('I fill in only the product field with {string}', async ({ dashboard }, value) => {
  await dashboard.productInput.fill(value);
});

When('I click the submit button without filling all required fields', async ({ dashboard }) => {
  await dashboard.submitForm();
});

When('I fill in all required fields with valid data', async ({ dashboard }) => {
  await dashboard.fillForm({
    product:     'Test Product',
    version:     'v1.0.0',
    title:       'Test Release',
    description: 'A test release description.',
    date:        '2026-08-01',
  });
});

Given('I click the submit button without filling any fields', async ({ dashboard }) => {
  await dashboard.submitForm();
});

Given('I fill in only the product field with {string}', async ({ dashboard }, value) => {
  await dashboard.productInput.fill(value);
});

Then('an error message should be visible for the product field', async ({ dashboard }) => {
  await expect(dashboard.errorProduct).toBeVisible();
});

Then('an error message should be visible for the version field', async ({ dashboard }) => {
  await expect(dashboard.errorVersion).toBeVisible();
});

Then('an error message should be visible for the title field', async ({ dashboard }) => {
  await expect(dashboard.errorTitle).toBeVisible();
});

Then('an error message should be visible for the description field', async ({ dashboard }) => {
  await expect(dashboard.errorDescription).toBeVisible();
});

Then('an error message should be visible for the release date field', async ({ dashboard }) => {
  await expect(dashboard.errorReleaseDate).toBeVisible();
});

Then('no error message should be visible for the product field', async ({ dashboard }) => {
  await expect(dashboard.errorProduct).toBeHidden();
});

Then('the product field should still contain {string}', async ({ dashboard }, value) => {
  await expect(dashboard.productInput).toHaveValue(value);
});

When('I type {string} in the product input', async ({ dashboard }, value) => {
  await dashboard.productInput.fill(value);
});

Then('a new release card should appear in the list', async ({ dashboard }) => {
  await expect(dashboard.cards()).toHaveCount(3);
});

Then('the form should be cleared after successful submission', async ({ dashboard }) => {
  await expect(dashboard.productInput).toHaveValue('');
  await expect(dashboard.versionInput).toHaveValue('');
  await expect(dashboard.titleInput).toHaveValue('');
});
