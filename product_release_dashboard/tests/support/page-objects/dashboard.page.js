const { pathToFileURL } = require('url');
const path = require('path');

const DASHBOARD_URL = pathToFileURL(
  path.resolve(__dirname, '../../../index.html')
).href;

class DashboardPage {
  constructor(page) {
    this.page = page;

    // Form inputs
    this.productInput     = page.locator('#product');
    this.versionInput     = page.locator('#version');
    this.titleInput       = page.locator('#title');
    this.descriptionInput = page.locator('#description');
    this.releaseDateInput = page.locator('#releaseDate');
    this.breakingCheckbox = page.locator('#breaking');
    this.submitBtn        = page.locator('button[type="submit"]');
    this.cancelEditBtn    = page.locator('#cancel-edit');

    // Filters
    this.productFilter  = page.locator('#product-filter');
    this.breakingFilter = page.locator('#breaking-filter');
    this.searchFilter   = page.locator('#search-filter');
    this.sortSelect     = page.locator('#sort-select');

    // Export & summary
    this.exportBtn      = page.locator('#export-btn');
    this.resultsSummary = page.locator('#results-summary');

    // Release list
    this.releaseList = page.locator('#release-list');

    // Validation error spans
    this.errorProduct     = page.locator('#error-product');
    this.errorVersion     = page.locator('#error-version');
    this.errorTitle       = page.locator('#error-title');
    this.errorDescription = page.locator('#error-description');
    this.errorReleaseDate = page.locator('#error-releaseDate');
  }

  async navigate() {
    await this.page.addInitScript(() => localStorage.clear());
    await this.page.goto(DASHBOARD_URL);
    await this.page.waitForSelector('.release-card');
  }

  async fillForm({ product = '', version = '', title = '', description = '', date = '', breaking = false } = {}) {
    if (product)     await this.productInput.fill(product);
    if (version)     await this.versionInput.fill(version);
    if (title)       await this.titleInput.fill(title);
    if (description) await this.descriptionInput.fill(description);
    if (date)        await this.releaseDateInput.fill(date);
    if (breaking)    await this.breakingCheckbox.check();
  }

  async submitForm() {
    await this.submitBtn.click();
  }

  cards() {
    return this.page.locator('.release-card');
  }

  card(index = 0) {
    return this.cards().nth(index);
  }

  async getCardTitle(index = 0) {
    return this.card(index).locator('.release-title').textContent();
  }

  async getCardProduct(index = 0) {
    return this.card(index).locator('.product-version').textContent();
  }

  async clickEdit(index = 0) {
    await this.card(index).locator('.btn-edit').click();
  }

  async clickDelete(index = 0) {
    await this.card(index).locator('.btn-delete').click();
  }

  async confirmDelete(index = 0) {
    await this.card(index).locator('.btn-confirm-delete').click();
  }

  async cancelDelete(index = 0) {
    await this.card(index).locator('.btn-cancel-delete').click();
  }

  async addRelease(data) {
    await this.fillForm(data);
    await this.submitForm();
    await this.page.waitForTimeout(100);
  }
}

module.exports = { DashboardPage, DASHBOARD_URL };
