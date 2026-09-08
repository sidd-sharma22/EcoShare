// EcoShare Explore - Supabase-backed resources.
(() => {
  "use strict";

  const resourceSearch = document.getElementById("resourceSearch");
  const searchBtn = document.getElementById("searchBtn");
  const categoryFilter = document.getElementById("categoryFilter");
  const availabilityFilter = document.getElementById("availabilityFilter");
  const sortFilter = document.getElementById("sortFilter");
  const resultsCount = document.getElementById("resultsCount");
  const resourceGrid = document.getElementById("resourceGrid");
  const noResources = document.getElementById("noResources");
  const resetFilters = document.getElementById("resetFilters");
  const menuBtn = document.getElementById("menu-btn");
  const primaryNavigation = document.getElementById("primary-navigation");
  const header = document.querySelector(".header");
  let resources = [];

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const formatCategory = (value) => value
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "Other";

  function applyFilters() {
    const search = resourceSearch?.value.trim().toLowerCase() || "";
    const category = categoryFilter?.value || "all";
    const availability = availabilityFilter?.value || "all";
    const sort = sortFilter?.value || "newest";

    let filtered = resources.filter((resource) => {
      const text = [resource.title, resource.description, resource.category, resource.owner, resource.location].join(" ").toLowerCase();
      const searchMatch = !search || text.includes(search);
      const categoryMatch = category === "all" || resource.category === category;
      const availabilityMatch = availability === "all" ||
        (availability === "available" ? resource.available : !resource.available);
      return searchMatch && categoryMatch && availabilityMatch;
    });

    if (sort === "name-asc") filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "name-desc") filtered.sort((a, b) => b.title.localeCompare(a.title));
    if (sort === "newest") filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    render(filtered);
  }

  function render(list) {
    if (!resourceGrid) return;
    resourceGrid.innerHTML = "";
    if (resultsCount) resultsCount.textContent = list.length ? `Showing ${list.length} resource${list.length === 1 ? "" : "s"}` : "No resources found";
    if (noResources) noResources.hidden = list.length !== 0;
    resourceGrid.hidden = list.length === 0;
    if (!list.length) return;

    list.forEach((resource) => {
      const card = document.createElement("article");
      card.className = "resource-card";
      card.innerHTML = `
        <div class="resource-image"><img src="${escapeHtml(resource.image)}" alt="${escapeHtml(resource.title)}" loading="lazy"></div>
        <div class="resource-content">
          <span class="resource-category">${escapeHtml(formatCategory(resource.category))}</span>
          <h3>${escapeHtml(resource.title)}</h3>
          <p>${escapeHtml(resource.description)}</p>
          <div class="resource-meta">
            <span><i class="fa-solid fa-user" aria-hidden="true"></i> ${escapeHtml(resource.owner)}</span>
            <span><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHtml(resource.location)}</span>
          </div>
          <div class="resource-footer">
            <span class="availability ${resource.available ? "available" : "unavailable"}">${resource.available ? "Available" : "Currently Borrowed"}</span>
            <button type="button" class="view-resource-btn" data-resource-id="${resource.id}">View Details</button>
          </div>
        </div>`;
      card.querySelector("img")?.addEventListener("error", () => {
        const container = card.querySelector(".resource-image");
        if (container) container.innerHTML = `<i class="fa-solid fa-image" aria-hidden="true"></i>`;
      });
      card.querySelector(".view-resource-btn")?.addEventListener("click", () => {
        window.location.href = `/Phase 2/resource-details.html?id=${encodeURIComponent(resource.id)}`;
      });
      resourceGrid.appendChild(card);
    });
  }

  resourceSearch?.addEventListener("input", applyFilters);
  searchBtn?.addEventListener("click", applyFilters);
  categoryFilter?.addEventListener("change", applyFilters);
  availabilityFilter?.addEventListener("change", applyFilters);
  sortFilter?.addEventListener("change", applyFilters);
  resetFilters?.addEventListener("click", () => {
    if (resourceSearch) resourceSearch.value = "";
    if (categoryFilter) categoryFilter.value = "all";
    if (availabilityFilter) availabilityFilter.value = "all";
    if (sortFilter) sortFilter.value = "newest";
    applyFilters();
  });
  menuBtn?.addEventListener("click", () => {
    const open = primaryNavigation?.classList.toggle("show");
    menuBtn.setAttribute("aria-expanded", String(Boolean(open)));
  });
  window.addEventListener("scroll", () => header?.classList.toggle("scrolled", window.scrollY > 30));

  (async () => {
    try {
      resources = await window.EcoShareSupabase.getResources();
      applyFilters();
    } catch (error) {
      console.error("Failed to load resources:", error);
      if (resultsCount) resultsCount.textContent = "Unable to load resources";
      if (noResources) noResources.hidden = false;
    }
  })();
})();
