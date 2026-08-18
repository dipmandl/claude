const { test: base } = require('@playwright/test');
const { DashboardPage } = require('./page-objects/dashboard.page');

const test = base.extend({
  dashboard: async ({ page }, use) => {
    const dashboard = new DashboardPage(page);
    await use(dashboard);
  },
});

module.exports = { test };
