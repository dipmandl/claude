const { createBdd } = require('playwright-bdd');
const { expect } = require('@playwright/test');
const { test } = require('../support/fixtures');

const { When, Then } = createBdd(test);

// Download and cache CSV content on the page object for subsequent Then assertions.
When('I click the Export CSV button', async ({ dashboard, page }) => {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    dashboard.exportBtn.click(),
  ]);

  const stream = await download.createReadStream();
  let raw = '';
  for await (const chunk of stream) {
    raw += chunk.toString('utf8');
  }
  await download.delete();

  // Strip UTF-8 BOM if present
  page._csvContent  = raw.replace(/^﻿/, '');
  page._csvFilename = download.suggestedFilename();
});

Then('the Export CSV button should be enabled', async ({ dashboard }) => {
  await expect(dashboard.exportBtn).toBeEnabled();
});

Then('the Export CSV button should be disabled', async ({ dashboard }) => {
  await expect(dashboard.exportBtn).toBeDisabled();
});

Then('a file named {string} should be downloaded', async ({ page }, filename) => {
  expect(page._csvFilename).toBe(filename);
});

Then('the downloaded CSV should contain the header {string}', async ({ page }, header) => {
  const firstLine = (page._csvContent || '').split('\n')[0].trim();
  expect(firstLine).toBe(header);
});

Then('the downloaded CSV should contain {string}', async ({ page }, text) => {
  expect(page._csvContent || '').toContain(text);
});

Then('the downloaded CSV should not contain {string}', async ({ page }, text) => {
  expect(page._csvContent || '').not.toContain(text);
});
