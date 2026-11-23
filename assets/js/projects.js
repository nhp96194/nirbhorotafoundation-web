import { fetchPublishedProjects } from "./firebase-service.js";

const listEl = document.getElementById("projects-list");
const searchEl = document.getElementById("project-search");
const categoryEl = document.getElementById("project-category");
const statusEl = document.getElementById("project-status");
const resetEl = document.getElementById("reset-filters");
const loadMoreEl = document.getElementById("load-more-btn");

let allLoaded = [];
let cursor = null;

function renderFiltered() {
  const term = (searchEl?.value || "").trim().toLowerCase();
  const filtered = allLoaded.filter((p) => {
    if (!term) return true;
    const hay = `${p.title || ""} ${p.summary || ""} ${p.location || ""}`.toLowerCase();
    return hay.includes(term);
  });

  if (!filtered.length) {
    listEl.innerHTML = `
      <div class="col-12">
        <div class="editorial-card p-4 text-center">
          <p class="mb-0" style="color: var(--nf-muted);">No matching published projects found.</p>
        </div>
      </div>`;
    return;
  }

  listEl.innerHTML = filtered
    .map(
      (p) => `
      <div class="col-md-6 col-lg-4">
        <article class="editorial-card p-4 h-100 d-flex flex-column">
          ${
            p.coverImage
              ? `<img src="${p.coverImage}" alt="${p.title}" class="img-fluid rounded mb-3" style="height: 190px; object-fit: cover;" loading="lazy" />`
              : ""
          }
          <div class="d-flex justify-content-between small mb-1" style="color: var(--nf-green); font-weight: 600;">
            <span>${p.category || "General"}</span>
            <span>${p.status || "Ongoing"}</span>
          </div>
          <h2 class="h5 mb-2">${p.title}</h2>
          <p class="small flex-grow-1" style="color: var(--nf-muted);">${p.summary || ""}</p>
          <div class="small mb-3" style="color: var(--nf-muted);">
            ${p.location ? `<i class="bi bi-geo-alt me-1"></i>${p.location}` : ""}
          </div>
          <a href="project-details.html?slug=${encodeURIComponent(p.slug || p.id)}" class="btn btn-nf-secondary btn-sm align-self-start">
            Project Details
          </a>
        </article>
      </div>`
    )
    .join("");
}

async function loadPage(reset = false) {
  if (reset) {
    allLoaded = [];
    cursor = null;
    listEl.innerHTML = `<div class="col-12"><div class="skeleton-block" style="height: 180px;"></div></div>`;
  }

  const { items, lastDoc, unconfigured } = await fetchPublishedProjects({
    category: categoryEl?.value || "",
    status: statusEl?.value || "",
    pageSize: 6,
    lastDoc: cursor
  });

  cursor = lastDoc;
  if (unconfigured && !allLoaded.length) {
    listEl.innerHTML = `
      <div class="col-12">
        <div class="placeholder-notice">
          Connect Firebase in <code>assets/js/firebase-config.js</code> and publish projects in <code>/admin/projects.html</code> to display live project records.
        </div>
      </div>`;
    if (loadMoreEl) loadMoreEl.hidden = true;
    return;
  }

  allLoaded = reset ? items : [...allLoaded, ...items];
  renderFiltered();
  if (loadMoreEl) loadMoreEl.hidden = !cursor;
}

searchEl?.addEventListener("input", renderFiltered);
categoryEl?.addEventListener("change", () => loadPage(true));
statusEl?.addEventListener("change", () => loadPage(true));
resetEl?.addEventListener("click", () => {
  if (searchEl) searchEl.value = "";
  if (categoryEl) categoryEl.value = "";
  if (statusEl) statusEl.value = "";
  loadPage(true);
});
loadMoreEl?.addEventListener("click", () => loadPage(false));

loadPage(true);
