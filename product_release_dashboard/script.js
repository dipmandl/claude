const STORAGE_KEY = "releaseNotesDashboard.releases";

// --- DOM references (existing) ---
const releaseForm         = document.getElementById("release-form");
const releaseList         = document.getElementById("release-list");
const template            = document.getElementById("release-card-template");
const productFilterInput  = document.getElementById("product-filter");
const breakingFilterSelect = document.getElementById("breaking-filter");

// --- DOM references (new) ---
const searchFilterInput   = document.getElementById("search-filter");
const sortSelect          = document.getElementById("sort-select");
const exportBtn           = document.getElementById("export-btn");
const cancelEditBtn       = document.getElementById("cancel-edit");
const resultsSummary      = document.getElementById("results-summary");
const submitBtn           = releaseForm.querySelector('button[type="submit"]');

const errorProduct        = document.getElementById("error-product");
const errorVersion        = document.getElementById("error-version");
const errorTitle          = document.getElementById("error-title");
const errorDescription    = document.getElementById("error-description");
const errorReleaseDate    = document.getElementById("error-releaseDate");

// --- Module-level state ---
let releases       = loadReleases();
let editingId      = null;
let currentFiltered = [];

// --- Initial render ---
renderReleaseList();

// --- Form submit handler ---
releaseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const formData = new FormData(releaseForm);

  if (editingId !== null) {
    // Edit mode: update record in-place
    const idx = releases.findIndex(r => r.id === editingId);
    if (idx !== -1) {
      releases[idx] = {
        id: editingId,
        product:     String(formData.get("product")     || "").trim(),
        version:     String(formData.get("version")     || "").trim(),
        title:       String(formData.get("title")       || "").trim(),
        description: String(formData.get("description") || "").trim(),
        releaseDate: String(formData.get("releaseDate") || ""),
        isBreaking:  formData.get("breaking") === "on"
      };
      saveReleases(releases);
    }
    exitEditMode();
    renderReleaseList();
  } else {
    // Create mode: add new record
    const release = {
      id:          crypto.randomUUID(),
      product:     String(formData.get("product")     || "").trim(),
      version:     String(formData.get("version")     || "").trim(),
      title:       String(formData.get("title")       || "").trim(),
      description: String(formData.get("description") || "").trim(),
      releaseDate: String(formData.get("releaseDate") || ""),
      isBreaking:  formData.get("breaking") === "on"
    };

    releases.unshift(release);
    saveReleases(releases);
    releaseForm.reset();
    renderReleaseList();
  }
});

// --- Event listeners (existing) ---
productFilterInput.addEventListener("input", renderReleaseList);
breakingFilterSelect.addEventListener("change", renderReleaseList);

// --- Event listeners (new) ---
searchFilterInput.addEventListener("input", renderReleaseList);
sortSelect.addEventListener("change", renderReleaseList);
exportBtn.addEventListener("click", exportCSV);
cancelEditBtn.addEventListener("click", exitEditMode);

// Per-field validation clear listeners
document.getElementById("product").addEventListener("input",      () => clearFieldError(errorProduct));
document.getElementById("version").addEventListener("input",      () => clearFieldError(errorVersion));
document.getElementById("title").addEventListener("input",        () => clearFieldError(errorTitle));
document.getElementById("description").addEventListener("input",  () => clearFieldError(errorDescription));
document.getElementById("releaseDate").addEventListener("input",  () => clearFieldError(errorReleaseDate));

// --- Validation ---

/**
 * Validates all required form fields.
 * Shows inline errors for empty fields.
 * @returns {boolean} true if all required fields are filled
 */
function validateForm() {
  const fields = [
    { input: document.getElementById("product"),     span: errorProduct,     msg: "Product name is required." },
    { input: document.getElementById("version"),     span: errorVersion,     msg: "Version is required." },
    { input: document.getElementById("title"),       span: errorTitle,       msg: "Title is required." },
    { input: document.getElementById("description"), span: errorDescription, msg: "Description is required." },
    { input: document.getElementById("releaseDate"), span: errorReleaseDate, msg: "Release date is required." }
  ];
  let valid = true;
  for (const { input, span, msg } of fields) {
    if (!input.value.trim()) {
      span.textContent = msg;
      span.classList.add("visible");
      valid = false;
    }
  }
  return valid;
}

/**
 * Clears the inline error message for one field.
 * @param {HTMLElement} errorSpan
 */
function clearFieldError(errorSpan) {
  errorSpan.textContent = "";
  errorSpan.classList.remove("visible");
}

// --- Edit mode ---

/**
 * Enters edit mode for the release with the given id.
 * Populates the form fields and scrolls to the form.
 * @param {string} id
 */
function enterEditMode(id) {
  const release = releases.find(r => r.id === id);
  if (!release) return;

  document.getElementById("product").value     = release.product;
  document.getElementById("version").value     = release.version;
  document.getElementById("title").value       = release.title;
  document.getElementById("description").value = release.description;
  document.getElementById("releaseDate").value = release.releaseDate;
  document.getElementById("breaking").checked  = release.isBreaking;

  editingId = id;
  submitBtn.textContent = "Save Changes";
  cancelEditBtn.removeAttribute("hidden");
  releaseForm.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Exits edit mode, resets the form to create state, hides the Cancel button.
 */
function exitEditMode() {
  editingId = null;
  releaseForm.reset();
  submitBtn.textContent = "Add Release Note";
  cancelEditBtn.setAttribute("hidden", "");

  // Clear all error spans
  clearFieldError(errorProduct);
  clearFieldError(errorVersion);
  clearFieldError(errorTitle);
  clearFieldError(errorDescription);
  clearFieldError(errorReleaseDate);
}

// --- Delete ---

/**
 * Removes a release by id.
 * Calls exitEditMode() first if that record is currently being edited.
 * @param {string} id
 */
function deleteRelease(id) {
  if (editingId === id) {
    exitEditMode();
  }
  releases = releases.filter(r => r.id !== id);
  saveReleases(releases);
  renderReleaseList();
}

// --- CSV Export ---

/**
 * Downloads currentFiltered as a UTF-8 CSV file named release-notes-export.csv.
 */
function exportCSV() {
  if (currentFiltered.length === 0) return;

  const COLUMNS = ["id", "product", "version", "title", "description", "releaseDate", "isBreaking"];

  function escapeCSV(value) {
    const str = value === null || value === undefined ? "" : String(value);
    return '"' + str.replace(/"/g, '""') + '"';
  }

  const headerRow = COLUMNS.join(",");
  const dataRows  = currentFiltered.map(r => COLUMNS.map(col => escapeCSV(r[col])).join(","));
  // UTF-8 BOM prepended for Excel compatibility
  const content   = "﻿" + headerRow + "\n" + dataRows.join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href     = url;
  a.download = "release-notes-export.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// --- Render ---

/**
 * Applies the filter+sort pipeline, updates currentFiltered, results summary,
 * export button state, then renders the card list.
 */
function renderReleaseList() {
  const productQuery  = productFilterInput.value.trim().toLowerCase();
  const breakingQuery = breakingFilterSelect.value;
  const searchQuery   = searchFilterInput.value.trim().toLowerCase();

  // Step 2 — Filter (AND logic)
  const filtered = releases.filter((release) => {
    const matchesProduct =
      !productQuery || release.product.toLowerCase().includes(productQuery);

    const matchesBreaking =
      breakingQuery === "all" ||
      (breakingQuery === "breaking" && release.isBreaking) ||
      (breakingQuery === "non-breaking" && !release.isBreaking);

    const matchesSearch =
      !searchQuery ||
      release.title.toLowerCase().includes(searchQuery) ||
      release.description.toLowerCase().includes(searchQuery);

    return matchesProduct && matchesBreaking && matchesSearch;
  });

  // Step 3 — Sort (shallow copy, never mutates releases[])
  const sortValue = sortSelect.value;
  const sorted = [...filtered].sort((a, b) => {
    if (sortValue === "date-desc") return new Date(b.releaseDate) - new Date(a.releaseDate);
    if (sortValue === "date-asc")  return new Date(a.releaseDate) - new Date(b.releaseDate);
    if (sortValue === "name-asc")  return a.product.localeCompare(b.product);
    if (sortValue === "name-desc") return b.product.localeCompare(a.product);
    return 0;
  });

  // Step 4 — Assign module-level reference
  currentFiltered = sorted;

  // Step 5 — Side effects
  const breakingCount = currentFiltered.filter(r => r.isBreaking).length;
  resultsSummary.textContent =
    `Showing ${currentFiltered.length} of ${releases.length} releases — ${breakingCount} breaking`;

  exportBtn.disabled = currentFiltered.length === 0;

  // Step 6 — Render DOM
  releaseList.innerHTML = "";

  if (currentFiltered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No release notes match your current filters.";
    releaseList.appendChild(empty);
    return;
  }

  for (const release of currentFiltered) {
    const card = template.content.firstElementChild.cloneNode(true);
    card.classList.toggle("breaking", release.isBreaking);

    card.querySelector(".product-version").textContent   = `${release.product} - ${release.version}`;
    card.querySelector(".release-title").textContent     = release.title;
    card.querySelector(".release-description").textContent = release.description;
    card.querySelector(".release-date").textContent      = `Release date: ${formatDate(release.releaseDate)}`;

    const badge = card.querySelector(".badge");
    badge.textContent = release.isBreaking ? "Breaking Change" : "Non-Breaking";
    badge.classList.add(release.isBreaking ? "breaking" : "safe");

    // Wire Edit button
    card.querySelector(".btn-edit").addEventListener("click", () => {
      enterEditMode(release.id);
    });

    // Wire Delete button — shows inline confirmation
    card.querySelector(".btn-delete").addEventListener("click", () => {
      card.querySelector(".card-actions").setAttribute("hidden", "");
      const confirmRow = card.querySelector(".delete-confirm");
      confirmRow.removeAttribute("hidden");
      confirmRow.querySelector(".btn-confirm-delete").focus();
    });

    // Wire Cancel delete button — restores normal card state
    card.querySelector(".btn-cancel-delete").addEventListener("click", () => {
      card.querySelector(".delete-confirm").setAttribute("hidden", "");
      card.querySelector(".card-actions").removeAttribute("hidden");
    });

    // Wire Confirm delete button — removes the record
    card.querySelector(".btn-confirm-delete").addEventListener("click", () => {
      deleteRelease(release.id);
    });

    releaseList.appendChild(card);
  }
}

// --- Persistence ---

function loadReleases() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return seedData();
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    return seedData();
  }

  return seedData();
}

function saveReleases(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function seedData() {
  const initial = [
    {
      id: "r1",
      product: "Billing API",
      version: "v1.4.0",
      title: "Invoice export now supports CSV and XLSX",
      description: "Added dual-format export and improved export speed for large accounts.",
      releaseDate: "2026-06-08",
      isBreaking: false
    },
    {
      id: "r2",
      product: "Auth Service",
      version: "v2.0.0",
      title: "Token introspection endpoint updated",
      description: "Old response shape is deprecated. Clients should migrate to the new claims object format.",
      releaseDate: "2026-06-10",
      isBreaking: true
    }
  ];

  saveReleases(initial);
  return initial;
}
