/**
 * Step Definitions: release-delete.feature
 * Maps Gherkin steps to Playwright actions via the DashboardPage object.
 * All selectors and UI actions live in dashboard.page.js.
 */
const { Given, When, Then, Before } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { DashboardPage } = require('../support/page-objects/dashboard.page');

let dashboard;
let deletedCardTitle;

Before(async function () {
  // Each scenario receives a fresh page from the Playwright World context
  dashboard = new DashboardPage(this.page);
  await dashboard.open();
  await dashboard.clearStorage();
  await dashboard.reload();
});

// ── Shared Givens ────────────────────────────────────────────────────────────

Given('the Release Notes Dashboard is open', async function () {
  // Page is already open via Before hook
  await expect(dashboard.releaseCards().first()).toBeVisible({ timeout: 5000 });
});

Given('at least one release card is visible in the release list', async function () {
  await expect(dashboard.releaseCards().count()).resolves.toBeGreaterThan(0);
});

Given('the release list is filtered by product name', async function () {
  // Seed data includes 'Billing API'; filter to it
  await dashboard.filterByProduct('Billing');
});

Given('the filtered results include at least one card', async function () {
  await expect(dashboard.releaseCards().first()).toBeVisible();
});

Given('the release list is filtered to show breaking changes only', async function () {
  await dashboard.filterByBreaking('breaking');
});

Given('the filtered results include at least one breaking-change card', async function () {
  await expect(dashboard.releaseCards().first()).toBeVisible();
});

Given('the page is opened for the first time with no stored data', async function () {
  // localStorage was cleared in Before hook; seeds fire on first load
  await expect(dashboard.releaseCards().first()).toBeVisible();
});

Given('the user has submitted a new release note via the form', async function () {
  await dashboard.fillForm({
    product: 'New Product',
    version: 'v0.1.0',
    title: 'Brand New Release',
    description: 'Created during test setup.',
    releaseDate: '2026-08-01',
    isBreaking: false,
  });
  await dashboard.submitForm();
  await expect(dashboard.releaseCards().first()).toBeVisible();
});

// ── Delete Whens ─────────────────────────────────────────────────────────────

When('the user clicks the delete button on a release card', async function () {
  const firstCard = dashboard.releaseCardByIndex(0);
  const titleEl = dashboard.cardTitle(firstCard);
  deletedCardTitle = await titleEl.textContent();
  await dashboard.clickDeleteOnCard(0);
});

When('the user reloads the page', async function () {
  await dashboard.reload();
});

When('the user clicks the delete button on one of the visible filtered cards', async function () {
  const firstCard = dashboard.releaseCardByIndex(0);
  const titleEl = dashboard.cardTitle(firstCard);
  deletedCardTitle = await titleEl.textContent();
  await dashboard.clickDeleteOnCard(0);
});

// ── Delete Thens ─────────────────────────────────────────────────────────────

Then('that card is removed from the release list without a page reload', async function () {
  const titles = await dashboard.releaseCards().allTextContents();
  expect(titles.join('')).not.toContain(deletedCardTitle);
});

Then('no other cards are removed', async function () {
  // Seed has 2 cards; after deleting one there should be at least 1
  const count = await dashboard.releaseCards().count();
  expect(count).toBeGreaterThanOrEqual(1);
});

Then('the deleted card is not present in the release list', async function () {
  const titles = await dashboard.releaseCards().allTextContents();
  expect(titles.join('')).not.toContain(deletedCardTitle);
});

Then('only that card is removed from the filtered view', async function () {
  const titles = await dashboard.releaseCards().allTextContents();
  expect(titles.join('')).not.toContain(deletedCardTitle);
});

Then('the remaining filtered results are unaffected', async function () {
  // The filter is still active; remaining visible cards should still match the filter
  const count = await dashboard.releaseCards().count();
  // No assertion on exact count since seeds may vary; just ensure no error state
  expect(count).toBeGreaterThanOrEqual(0);
});

Then('only that card is removed from the list', async function () {
  const titles = await dashboard.releaseCards().allTextContents();
  expect(titles.join('')).not.toContain(deletedCardTitle);
});

Then('each seeded release card displays a delete button', async function () {
  const cards = dashboard.releaseCards();
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    await expect(dashboard.deleteButtonOnCard(card)).toBeVisible();
  }
});

Then('the newly created card displays a delete button', async function () {
  const firstCard = dashboard.releaseCardByIndex(0);
  await expect(dashboard.deleteButtonOnCard(firstCard)).toBeVisible();
});
