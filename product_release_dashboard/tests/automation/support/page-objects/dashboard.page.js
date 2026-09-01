/**
 * Page Object: Release Notes Dashboard
 * Encapsulates all selectors and UI interactions for the dashboard page.
 */
class DashboardPage {
  constructor(page) {
    this.page = page;
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async open(baseURL = 'file:///claude/product_release_dashboard/index.html') {
    await this.page.goto(baseURL);
  }

  async reload() {
    await this.page.reload();
  }

  // ── Form fields ────────────────────────────────────────────────────────────

  formHeading() {
    return this.page.locator('#create-release-title');
  }

  productInput() {
    return this.page.locator('#product');
  }

  versionInput() {
    return this.page.locator('#version');
  }

  titleInput() {
    return this.page.locator('#title');
  }

  descriptionInput() {
    return this.page.locator('#description');
  }

  releaseDateInput() {
    return this.page.locator('#releaseDate');
  }

  breakingCheckbox() {
    return this.page.locator('#breaking');
  }

  submitButton() {
    return this.page.locator('button[type="submit"]');
  }

  cancelButton() {
    return this.page.locator('#cancel-edit');
  }

  // ── Form actions ───────────────────────────────────────────────────────────

  async fillForm({ product, version, title, description, releaseDate, isBreaking = false }) {
    await this.productInput().fill(product);
    await this.versionInput().fill(version);
    await this.titleInput().fill(title);
    await this.descriptionInput().fill(description);
    await this.releaseDateInput().fill(releaseDate);
    if (isBreaking) {
      await this.breakingCheckbox().check();
    } else {
      await this.breakingCheckbox().uncheck();
    }
  }

  async submitForm() {
    await this.submitButton().click();
  }

  async cancelEdit() {
    await this.cancelButton().click();
  }

  // ── Release list ───────────────────────────────────────────────────────────

  releaseCards() {
    return this.page.locator('.release-card');
  }

  releaseCardByIndex(index) {
    return this.releaseCards().nth(index);
  }

  editButtonOnCard(cardLocator) {
    return cardLocator.locator('.btn-edit');
  }

  deleteButtonOnCard(cardLocator) {
    return cardLocator.locator('.btn-delete');
  }

  async clickEditOnCard(index) {
    const card = this.releaseCardByIndex(index);
    await this.editButtonOnCard(card).click();
  }

  async clickDeleteOnCard(index) {
    const card = this.releaseCardByIndex(index);
    await this.deleteButtonOnCard(card).click();
  }

  cardTitle(cardLocator) {
    return cardLocator.locator('.release-title');
  }

  cardProduct(cardLocator) {
    return cardLocator.locator('.product-version');
  }

  // ── Filter controls ────────────────────────────────────────────────────────

  productFilterInput() {
    return this.page.locator('#product-filter');
  }

  breakingFilterSelect() {
    return this.page.locator('#breaking-filter');
  }

  async filterByProduct(value) {
    await this.productFilterInput().fill(value);
  }

  async filterByBreaking(value) {
    // value: 'all' | 'breaking' | 'non-breaking'
    await this.breakingFilterSelect().selectOption(value);
  }

  // ── localStorage helpers ───────────────────────────────────────────────────

  async getStoredReleases() {
    return this.page.evaluate(() => {
      const raw = localStorage.getItem('releaseNotesDashboard.releases');
      return raw ? JSON.parse(raw) : [];
    });
  }

  async clearStorage() {
    await this.page.evaluate(() => localStorage.clear());
  }
}

module.exports = { DashboardPage };
