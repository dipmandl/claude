// Release Note form validation.
//
// This module is intentionally DOM-free and side-effect-free so the exact same
// rules can be reused by the Create form and a future Edit form, and so the
// logic can be unit-tested without a browser.

// Validation configuration (centralized so rules are tunable in one place).
const VERSION_PATTERN = /^[vV]?\d+\.\d+\.\d+([-+.][0-9A-Za-z-]+)*$/;
const TITLE_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 2000;

/**
 * Validate a release object.
 *
 * Pure function: no DOM access, no I/O, no mutation of the input.
 *
 * @param {object} release
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
function validateRelease(release) {
  const errors = {};
  const data = release || {};

  const product = String(data.product || "").trim();
  const version = String(data.version || "").trim();
  const title = String(data.title || "").trim();
  const description = String(data.description || "").trim();
  const releaseDate = String(data.releaseDate || "").trim();

  if (!product) {
    errors.product = "Product name is required.";
  }

  if (!version) {
    errors.version = "Version is required.";
  } else if (!VERSION_PATTERN.test(version)) {
    errors.version = "Use a version like v1.4.0 (major.minor.patch).";
  }

  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${TITLE_MAX_LENGTH} characters or fewer.`;
  }

  if (!description) {
    errors.description = "Description is required.";
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`;
  }

  if (!releaseDate) {
    errors.releaseDate = "Release date is required.";
  } else if (Number.isNaN(new Date(releaseDate).getTime())) {
    errors.releaseDate = "Enter a valid release date.";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// Export for a Node-based test runner; harmless in the browser where `module`
// is undefined and `validateRelease` is simply a global.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validateRelease,
    VERSION_PATTERN,
    TITLE_MAX_LENGTH,
    DESCRIPTION_MAX_LENGTH
  };
}
