const { test: base } = require('@playwright/test');
const { DashboardPage } = require('./page-objects/dashboard.page');

/**
 * Shared Playwright BDD fixtures for the Release Notes Dashboard.
 * Each fixture provides an isolated browser context with cleared localStorage.
 */
const test = base.extend({
  /**
   * dashboardPage — opens a fresh dashboard page with localStorage cleared before
   * each scenario so scenarios do not bleed state into one another.
   */
  dashboardPage: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    // Navigate first so evaluate has a context, then clear and reload
    await dashboard.open();
    await dashboard.clearStorage();
    await dashboard.reload();
    await use(dashboard);
  },

  /**
   * sampleRelease — a default release record object used across multiple scenarios.
   */
  sampleRelease: async ({}, use) => {
    await use({
      product: 'Test Product',
      version: 'v1.0.0',
      title:   'Initial Test Release',
      description: 'A release created during automated testing.',
      releaseDate: '2026-01-15',
      isBreaking: false,
    });
  },

  /**
   * breakingRelease — a breaking-change release used in filter-related scenarios.
   */
  breakingRelease: async ({}, use) => {
    await use({
      product: 'Auth Service',
      version: 'v3.0.0',
      title:   'Breaking Auth Change',
      description: 'This release introduces a breaking change to the auth token format.',
      releaseDate: '2026-03-01',
      isBreaking: true,
    });
  },
});

module.exports = { test, expect: require('@playwright/test').expect };
