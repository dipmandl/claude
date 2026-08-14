const STORAGE_KEY = "releaseNotesDashboard.releases";

// Fields validated by the form, in DOM order (drives "focus first invalid").
const VALIDATED_FIELDS = ["product", "version", "title", "description", "releaseDate"];

const releaseForm = document.getElementById("release-form");
const releaseList = document.getElementById("release-list");
const template = document.getElementById("release-card-template");
const productFilterInput = document.getElementById("product-filter");
const breakingFilterSelect = document.getElementById("breaking-filter");

let releases = loadReleases();

renderReleaseList();

releaseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(releaseForm);
  const release = {
    id: crypto.randomUUID(),
    product: String(formData.get("product") || "").trim(),
    version: String(formData.get("version") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    releaseDate: String(formData.get("releaseDate") || ""),
    isBreaking: formData.get("breaking") === "on"
  };

  const { valid, errors } = validateRelease(release);

  clearAllErrors();

  if (!valid) {
    showErrors(errors);
    return;
  }

  releases.unshift(release);
  saveReleases(releases);
  releaseForm.reset();
  renderReleaseList();
});

// Clear a field's error as soon as the user starts correcting it.
for (const field of VALIDATED_FIELDS) {
  const input = document.getElementById(field);
  if (!input) {
    continue;
  }
  const eventName = input.type === "date" ? "change" : "input";
  input.addEventListener(eventName, () => clearFieldError(field));
}

productFilterInput.addEventListener("input", renderReleaseList);
breakingFilterSelect.addEventListener("change", renderReleaseList);

/**
 * Render validation errors into the DOM, mark inputs invalid, and move focus to
 * the first invalid field (DOM order).
 * @param {Record<string, string>} errors
 */
function showErrors(errors) {
  let firstInvalid = null;

  for (const field of VALIDATED_FIELDS) {
    const message = errors[field];
    if (!message) {
      continue;
    }

    const input = document.getElementById(field);
    const errorEl = document.getElementById(`${field}-error`);

    if (input) {
      input.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
      if (!firstInvalid) {
        firstInvalid = input;
      }
    }

    if (errorEl) {
      errorEl.textContent = message;
    }
  }

  if (firstInvalid) {
    firstInvalid.focus();
  }
}

/**
 * Remove the error state and message for a single field.
 * @param {string} field
 */
function clearFieldError(field) {
  const input = document.getElementById(field);
  const errorEl = document.getElementById(`${field}-error`);

  if (input) {
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
  }

  if (errorEl) {
    errorEl.textContent = "";
  }
}

/**
 * Remove all field error states and messages.
 */
function clearAllErrors() {
  for (const field of VALIDATED_FIELDS) {
    clearFieldError(field);
  }
}

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

function renderReleaseList() {
  const productQuery = productFilterInput.value.trim().toLowerCase();
  const breakingQuery = breakingFilterSelect.value;

  const filtered = releases.filter((release) => {
    const matchesProduct = !productQuery || release.product.toLowerCase().includes(productQuery);
    const matchesBreaking =
      breakingQuery === "all" ||
      (breakingQuery === "breaking" && release.isBreaking) ||
      (breakingQuery === "non-breaking" && !release.isBreaking);

    return matchesProduct && matchesBreaking;
  });

  releaseList.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No release notes match your current filters.";
    releaseList.appendChild(empty);
    return;
  }

  for (const release of filtered) {
    const card = template.content.firstElementChild.cloneNode(true);
    card.classList.toggle("breaking", release.isBreaking);

    card.querySelector(".product-version").textContent = `${release.product} - ${release.version}`;
    card.querySelector(".release-title").textContent = release.title;
    card.querySelector(".release-description").textContent = release.description;
    card.querySelector(".release-date").textContent = `Release date: ${formatDate(release.releaseDate)}`;

    const badge = card.querySelector(".badge");
    badge.textContent = release.isBreaking ? "Breaking Change" : "Non-Breaking";
    badge.classList.add(release.isBreaking ? "breaking" : "safe");

    releaseList.appendChild(card);
  }
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
