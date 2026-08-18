const STORAGE_KEY = "releaseNotesDashboard.releases";

const releaseForm = document.getElementById("release-form");
const releaseList = document.getElementById("release-list");
const template = document.getElementById("release-card-template");
const productFilterInput = document.getElementById("product-filter");
const breakingFilterSelect = document.getElementById("breaking-filter");

let releases = loadReleases();

let editingId = null;

const cancelEditBtn = document.getElementById("cancel-edit");
const createReleaseTitle = document.getElementById("create-release-title");
const submitBtn = releaseForm.querySelector('button[type="submit"]');

renderReleaseList();

releaseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(releaseForm);
  const fields = {
    product:     String(formData.get("product")     || "").trim(),
    version:     String(formData.get("version")     || "").trim(),
    title:       String(formData.get("title")       || "").trim(),
    description: String(formData.get("description") || "").trim(),
    releaseDate: String(formData.get("releaseDate") || ""),
    isBreaking:  formData.get("breaking") === "on"
  };

  if (!fields.product || !fields.version || !fields.title || !fields.description || !fields.releaseDate) {
    return;
  }

  if (editingId !== null) {
    const idx = releases.findIndex(r => r.id === editingId);
    if (idx !== -1) {
      releases[idx] = { ...releases[idx], ...fields };
    }
    cancelEdit();
  } else {
    const release = { id: crypto.randomUUID(), ...fields };
    releases.unshift(release);
    releaseForm.reset();
  }

  saveReleases(releases);
  renderReleaseList();
});

productFilterInput.addEventListener("input", renderReleaseList);
breakingFilterSelect.addEventListener("change", renderReleaseList);

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

function deleteRelease(id) {
  if (editingId === id) {
    cancelEdit();
  }
  releases = releases.filter(r => r.id !== id);
  saveReleases(releases);
  renderReleaseList();
}

function startEditRelease(id) {
  const release = releases.find(r => r.id === id);
  if (!release) return;

  editingId = id;

  document.getElementById("product").value = release.product;
  document.getElementById("version").value = release.version;
  document.getElementById("title").value = release.title;
  document.getElementById("description").value = release.description;
  document.getElementById("releaseDate").value = release.releaseDate;
  document.getElementById("breaking").checked = release.isBreaking;

  createReleaseTitle.textContent = "Edit Release Note";
  submitBtn.textContent = "Save Changes";
  cancelEditBtn.hidden = false;

  releaseForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
  document.getElementById("product").focus();
}

function cancelEdit() {
  editingId = null;
  releaseForm.reset();
  createReleaseTitle.textContent = "Create a Release Note";
  submitBtn.textContent = "Add Release Note";
  cancelEditBtn.hidden = true;
}

cancelEditBtn.addEventListener("click", cancelEdit);

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

    const editBtn = card.querySelector(".btn-edit");
    const deleteBtn = card.querySelector(".btn-delete");

    editBtn.setAttribute("aria-label", `Edit ${release.product} ${release.version}`);
    deleteBtn.setAttribute("aria-label", `Delete ${release.product} ${release.version}`);

    editBtn.addEventListener("click", () => startEditRelease(release.id));
    deleteBtn.addEventListener("click", () => deleteRelease(release.id));

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
