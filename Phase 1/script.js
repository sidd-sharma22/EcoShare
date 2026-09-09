// ==========================================
// EcoShare Homepage JavaScript
// ==========================================

// ==========================================
// 1. DEMO RESOURCE DATA
// ==========================================

// ==========================================
// 2. GET HTML ELEMENTS
// ==========================================

const resourceGrid = document.getElementById("resourceGrid");
const resourceSearch = document.getElementById("resourceSearch");
const searchBtn = document.querySelector(".search-btn");
const categories = document.querySelectorAll(".category");
const menuBtn = document.getElementById("menu-btn");
const primaryNavigation = document.getElementById("primary-navigation");
const header = document.querySelector(".header");
const authNavButton = document.getElementById("authNavButton");

// ==========================================
// 3. AUTHENTICATION / NAVBAR
// ==========================================

async function updateAuthNavigation() {
  if (!authNavButton) return;

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (session) {
    authNavButton.innerHTML = `
      <i class="fa-solid fa-user"></i>
      Profile
    `;

    authNavButton.href = "profile.html";
    authNavButton.setAttribute("aria-label", "Open profile");
  } else {
    authNavButton.innerHTML = `
      <i class="fa-solid fa-right-to-bracket"></i>
      Login
    `;

    authNavButton.href = "login.html";
    authNavButton.setAttribute("aria-label", "Login");
  }
}

// Update navbar when authentication state changes
supabaseClient.auth.onAuthStateChange(() => {
  updateAuthNavigation();
});

// ==========================================
// 4. CURRENT FILTER
// ==========================================

let selectedCategory = "all";

// ==========================================
// 5. FORMAT CATEGORY NAME
// ==========================================

function formatCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// ==========================================
// 6. DISPLAY RESOURCES
// ==========================================

function displayResources(resourceList) {
  if (!resourceGrid) return;

  // Clear existing resources
  resourceGrid.innerHTML = "";

  // No resources found
  if (resourceList.length === 0) {
    resourceGrid.innerHTML = `
      <div class="no-resources">
        <i class="fa-solid fa-box-open"></i>

        <h3>
          No resources found
        </h3>

        <p>
          Try a different search or category.
        </p>
      </div>
    `;

    return;
  }

  // Create resource cards
  resourceList.forEach((resource) => {
    const card = document.createElement("div");

    card.classList.add("resource-card");

    card.innerHTML = `
      <div class="resource-image">
        <img
          src="${resource.image}"
          alt="${resource.title}"
        >
      </div>

      <div class="resource-content">

        <span class="resource-category">
          ${formatCategory(resource.category)}
        </span>

        <h3>
          ${resource.title}
        </h3>

        <p>
          ${resource.description}
        </p>

        <div class="resource-footer">

          <span>
            <i class="fa-solid fa-location-dot"></i>
            ${resource.location}
          </span>

          <button
            class="view-resource-btn"
            type="button"
            data-resource-id="${resource.id}"
          >
            View
          </button>

        </div>

      </div>
    `;

    // ------------------------------------------
    // IMAGE ERROR HANDLING
    // ------------------------------------------

    const image = card.querySelector("img");

    image.addEventListener("error", () => {
      image.style.display = "none";

      const imageContainer = card.querySelector(".resource-image");

      imageContainer.innerHTML = `
        <i class="fa-solid fa-image"></i>
      `;
    });

    // ------------------------------------------
    // VIEW BUTTON
    // ------------------------------------------

    const viewButton = card.querySelector(".view-resource-btn");

    viewButton.addEventListener("click", () => {
      viewResource(resource.id);
    });

    resourceGrid.appendChild(card);
  });
}

// ==========================================
// 7. FILTER RESOURCES
// ==========================================

function filterResources() {
  const searchText = resourceSearch
    ? resourceSearch.value.toLowerCase().trim()
    : "";

  const filteredResources = resources.filter((resource) => {
    // --------------------------------------
    // CATEGORY MATCH
    // --------------------------------------

    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;

    // --------------------------------------
    // SEARCH MATCH
    // --------------------------------------

    const matchesSearch =
      resource.title.toLowerCase().includes(searchText) ||
      resource.description.toLowerCase().includes(searchText) ||
      resource.category.toLowerCase().includes(searchText) ||
      resource.owner.toLowerCase().includes(searchText) ||
      resource.location.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  displayResources(filteredResources);
}

// ==========================================
// 8. SEARCH INPUT
// ==========================================

if (resourceSearch) {
  resourceSearch.addEventListener("input", filterResources);
}

// ==========================================
// 9. SEARCH BUTTON
// ==========================================

if (searchBtn) {
  searchBtn.addEventListener("click", filterResources);
}

// ==========================================
// 10. CATEGORY FILTER
// ==========================================

categories.forEach((category) => {
  category.addEventListener("click", () => {
    // --------------------------------------
    // REMOVE ACTIVE FROM ALL
    // --------------------------------------

    categories.forEach((item) => {
      item.classList.remove("active");
    });

    // --------------------------------------
    // ADD ACTIVE TO SELECTED CATEGORY
    // --------------------------------------

    category.classList.add("active");

    // --------------------------------------
    // UPDATE CATEGORY
    // --------------------------------------

    selectedCategory = category.dataset.category;

    // --------------------------------------
    // APPLY FILTER
    // --------------------------------------

    filterResources();
  });
});

// ==========================================
// 11. VIEW RESOURCE
// ==========================================

function viewResource(resourceId) {
  const resource = resources.find((item) => item.id === resourceId);

  if (!resource) {
    return;
  }

  window.location.href = `../Phase 2/resource-details.html?id=${encodeURIComponent(resource.id)}`;
}

// ==========================================
// 12. MOBILE NAVIGATION
// ==========================================

if (menuBtn && primaryNavigation) {
  menuBtn.addEventListener("click", () => {
    const isOpen = primaryNavigation.classList.toggle("show");

    menuBtn.setAttribute("aria-expanded", String(isOpen));

    menuBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  });

  // ------------------------------------------
  // CLOSE MENU WHEN NAV LINK IS CLICKED
  // ------------------------------------------

  const navLinks = primaryNavigation.querySelectorAll("a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      primaryNavigation.classList.remove("show");

      menuBtn.setAttribute("aria-expanded", "false");

      menuBtn.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

// ==========================================
// 13. SMOOTH SCROLLING
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    // Ignore empty "#"
    if (targetId === "#") {
      return;
    }

    const target = document.querySelector(targetId);

    if (target) {
      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ==========================================
// 14. NAVBAR SCROLL EFFECT
// ==========================================

window.addEventListener("scroll", () => {
  if (!header) return;

  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// ==========================================
// 15. INITIAL LOAD
// ==========================================

displayResources(resources);
updateAuthNavigation();
