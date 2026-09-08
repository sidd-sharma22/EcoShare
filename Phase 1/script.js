// EcoShare homepage - Supabase-backed resource listing.
(() => {
  "use strict";

  const resourceGrid = document.getElementById("resourceGrid");
  const resourceSearch = document.getElementById("resourceSearch");
  const searchBtn = document.querySelector(".search-btn");
  const categories = document.querySelectorAll(".category");
  const menuBtn = document.getElementById("menu-btn");
  const primaryNavigation = document.getElementById("primary-navigation");
  const header = document.querySelector(".header");
  let resources = [];
  let selectedCategory = "all";

  const escapeHtml = (value) => String(value ?? "")
    .replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const formatCategory = (value) => value
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "Other";

  function render(list) {
    if (!resourceGrid) return;
    resourceGrid.innerHTML = "";
    if (!list.length) {
      resourceGrid.innerHTML = `<div class="no-resources"><h3>No resources found</h3><p>Try a different search or category.</p></div>`;
      return;
    }

    list.forEach((resource) => {
      const card = document.createElement("article");
      card.className = "resource-card";
      card.innerHTML = `
        <div class="resource-image">
          <img src="${escapeHtml(resource.image)}" alt="${escapeHtml(resource.title)}" loading="lazy">
        </div>
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

  function filterResources() {
    const search = resourceSearch?.value.trim().toLowerCase() || "";
    render(resources.filter((resource) => {
      const text = [resource.title, resource.description, resource.category, resource.owner, resource.location].join(" ").toLowerCase();
      return (selectedCategory === "all" || resource.category === selectedCategory) && text.includes(search);
    }));
  }

  categories.forEach((category) => category.addEventListener("click", () => {
    categories.forEach((item) => item.classList.remove("active"));
    category.classList.add("active");
    selectedCategory = category.dataset.category || "all";
    filterResources();
  }));

  resourceSearch?.addEventListener("input", filterResources);
  searchBtn?.addEventListener("click", filterResources);

  menuBtn?.addEventListener("click", () => {
    const open = primaryNavigation?.classList.toggle("show");
    menuBtn.setAttribute("aria-expanded", String(Boolean(open)));
  });

  window.addEventListener("scroll", () => header?.classList.toggle("scrolled", window.scrollY > 30));

  async function initialize() {
    try {
      resources = await window.EcoShareSupabase.getResources();
      filterResources();
    } catch (error) {
      console.error("Failed to load resources:", error);
      if (resourceGrid) resourceGrid.innerHTML = `<div class="no-resources"><h3>Unable to load resources</h3><p>Please check your Supabase configuration and database setup.</p></div>`;
    }
  }

  initialize();
})();
