// ==========================================
// EcoShare — Explore Resources JavaScript
// ==========================================


// ==========================================
// 1. RESOURCE DATA
// ==========================================

const resources = [
  {
    id: 1,
    title: "Programming Books",
    description:
      "Useful programming and computer science books for students and developers.",
    category: "books",
    owner: "Rahul",
    location: "Kottayam",
    available: true,
    image: "/assets/programming-book.jpg",
    createdAt: "2026-09-07"
  },

  {
    id: 2,
    title: "Scientific Calculator",
    description:
      "Casio scientific calculator available for students and academic work.",
    category: "electronics",
    owner: "Ananya",
    location: "Kottayam",
    available: true,
    image: "/assets/calculator.jpg",
    createdAt: "2026-09-06"
  },

  {
    id: 3,
    title: "Power Drill",
    description:
      "Electric power drill suitable for household repairs and DIY projects.",
    category: "tools",
    owner: "Arjun",
    location: "Kottayam",
    available: true,
    image: "/assets/power-drill.jpg",
    createdAt: "2026-09-05"
  },

  {
    id: 4,
    title: "College Backpack",
    description:
      "Good condition backpack suitable for college and everyday use.",
    category: "others",
    owner: "Sneha",
    location: "Kottayam",
    available: true,
    image: "/assets/backpack.jpg",
    createdAt: "2026-09-04"
  }
];


// ==========================================
// 2. GET ELEMENTS
// ==========================================

const resourceSearch =
  document.getElementById("resourceSearch");

const searchBtn =
  document.getElementById("searchBtn");

const categoryFilter =
  document.getElementById("categoryFilter");

const availabilityFilter =
  document.getElementById("availabilityFilter");

const sortFilter =
  document.getElementById("sortFilter");

const resultsCount =
  document.getElementById("resultsCount");

const resourceGrid =
  document.getElementById("resourceGrid");

const noResources =
  document.getElementById("noResources");

const resetFilters =
  document.getElementById("resetFilters");

const menuBtn =
  document.getElementById("menu-btn");

const primaryNavigation =
  document.getElementById("primary-navigation");

const header =
  document.querySelector(".header");


// ==========================================
// 3. STATE
// ==========================================

let filteredResources = [...resources];


// ==========================================
// 4. FORMAT CATEGORY
// ==========================================

function formatCategory(category) {

  if (!category) {
    return "Other";
  }

  return (
    category.charAt(0).toUpperCase() +
    category.slice(1)
  );
}


// ==========================================
// 5. UPDATE RESULT COUNT
// ==========================================

function updateResultsCount(count) {

  if (!resultsCount) {
    return;
  }

  if (count === 0) {
    resultsCount.textContent =
      "No resources found";

    return;
  }

  resultsCount.textContent =
    `Showing ${count} resource${count === 1 ? "" : "s"}`;
}


// ==========================================
// 6. DISPLAY RESOURCE CARDS
// ==========================================

function displayResources(resourceList) {

  if (!resourceGrid) {
    return;
  }

  resourceGrid.innerHTML = "";

  // Empty state

  if (resourceList.length === 0) {

    resourceGrid.hidden = true;

    if (noResources) {
      noResources.hidden = false;
    }

    updateResultsCount(0);

    return;
  }

  resourceGrid.hidden = false;

  if (noResources) {
    noResources.hidden = true;
  }


  resourceList.forEach((resource) => {

    const card =
      document.createElement("article");

    card.className = "resource-card";


    const availabilityText =
      resource.available
        ? "Available"
        : "Currently Borrowed";


    const availabilityClass =
      resource.available
        ? "available"
        : "unavailable";


    card.innerHTML = `
      <div class="resource-image">

        <img
          src="${resource.image}"
          alt="${resource.title}"
          loading="lazy"
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

        <div class="resource-meta">

          <span>
            <i
              class="fa-solid fa-user"
              aria-hidden="true"
            ></i>
            ${resource.owner}
          </span>

          <span>
            <i
              class="fa-solid fa-location-dot"
              aria-hidden="true"
            ></i>
            ${resource.location}
          </span>

        </div>

        <div class="resource-footer">

          <span
            class="availability ${availabilityClass}"
          >
            ${availabilityText}
          </span>

          <button
            type="button"
            class="view-resource-btn"
            data-resource-id="${resource.id}"
          >
            View Details
          </button>

        </div>

      </div>
    `;


    // ======================================
    // IMAGE FALLBACK
    // ======================================

    const image =
      card.querySelector("img");

    if (image) {

      image.addEventListener(
        "error",
        () => {

          const imageContainer =
            card.querySelector(".resource-image");

          imageContainer.innerHTML = `
            <i
              class="fa-solid fa-image"
              aria-hidden="true"
            ></i>
          `;
        }
      );
    }


    // ======================================
    // VIEW DETAILS
    // ======================================

    const viewButton =
      card.querySelector(".view-resource-btn");

    if (viewButton) {

      viewButton.addEventListener(
        "click",
        () => {

          const resourceId =
            Number(
              viewButton.dataset.resourceId
            );

          viewResource(resourceId);
        }
      );
    }


    resourceGrid.appendChild(card);

  });


  updateResultsCount(resourceList.length);
}


// ==========================================
// 7. FILTER RESOURCES
// ==========================================

function filterResources() {

  const searchText =
    resourceSearch
      ? resourceSearch.value
          .toLowerCase()
          .trim()
      : "";


  const selectedCategory =
    categoryFilter
      ? categoryFilter.value
      : "all";


  const selectedAvailability =
    availabilityFilter
      ? availabilityFilter.value
      : "all";


  filteredResources =
    resources.filter((resource) => {

      const searchableText = [
        resource.title,
        resource.description,
        resource.category,
        resource.owner,
        resource.location
      ]
        .join(" ")
        .toLowerCase();


      const matchesSearch =
        searchableText.includes(searchText);


      const matchesCategory =
        selectedCategory === "all" ||
        resource.category === selectedCategory;


      const matchesAvailability =
        selectedAvailability === "all" ||
        (
          selectedAvailability === "available" &&
          resource.available === true
        ) ||
        (
          selectedAvailability === "unavailable" &&
          resource.available === false
        );


      return (
        matchesSearch &&
        matchesCategory &&
        matchesAvailability
      );

    });


  sortResources();
}


// ==========================================
// 8. SORT RESOURCES
// ==========================================

function sortResources() {

  const sortValue =
    sortFilter
      ? sortFilter.value
      : "newest";


  const sortedResources =
    [...filteredResources];


  switch (sortValue) {

    case "name-asc":

      sortedResources.sort(
        (a, b) =>
          a.title.localeCompare(b.title)
      );

      break;


    case "name-desc":

      sortedResources.sort(
        (a, b) =>
          b.title.localeCompare(a.title)
      );

      break;


    case "newest":

    default:

      sortedResources.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      break;

  }


  displayResources(sortedResources);
}


// ==========================================
// 9. VIEW RESOURCE
// ==========================================

function viewResource(resourceId) {

  const resource =
    resources.find(
      (item) => item.id === resourceId
    );


  if (!resource) {
    return;
  }


  /*
   * Navigate to the actual resource details page.
   *
   * Example:
   * resource-details.html?id=1
   */

  window.location.href =
    `resource-details.html?id=${encodeURIComponent(resource.id)}`;
}


// ==========================================
// 10. SEARCH BUTTON
// ==========================================

if (searchBtn) {

  searchBtn.addEventListener(
    "click",
    filterResources
  );
}


// ==========================================
// 11. LIVE SEARCH
// ==========================================

if (resourceSearch) {

  resourceSearch.addEventListener(
    "input",
    filterResources
  );


  resourceSearch.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {

        event.preventDefault();

        filterResources();
      }
    }
  );
}


// ==========================================
// 12. CATEGORY FILTER
// ==========================================

if (categoryFilter) {

  categoryFilter.addEventListener(
    "change",
    filterResources
  );
}


// ==========================================
// 13. AVAILABILITY FILTER
// ==========================================

if (availabilityFilter) {

  availabilityFilter.addEventListener(
    "change",
    filterResources
  );
}


// ==========================================
// 14. SORT FILTER
// ==========================================

if (sortFilter) {

  sortFilter.addEventListener(
    "change",
    sortResources
  );
}


// ==========================================
// 15. RESET FILTERS
// ==========================================

if (resetFilters) {

  resetFilters.addEventListener(
    "click",
    () => {

      if (resourceSearch) {
        resourceSearch.value = "";
      }

      if (categoryFilter) {
        categoryFilter.value = "all";
      }

      if (availabilityFilter) {
        availabilityFilter.value = "all";
      }

      if (sortFilter) {
        sortFilter.value = "newest";
      }

      filteredResources =
        [...resources];

      sortResources();
    }
  );
}


// ==========================================
// 16. MOBILE NAVIGATION
// ==========================================

if (menuBtn && primaryNavigation) {

  menuBtn.addEventListener(
    "click",
    () => {

      const isOpen =
        primaryNavigation.classList.toggle("show");


      menuBtn.setAttribute(
        "aria-expanded",
        String(isOpen)
      );


      menuBtn.setAttribute(
        "aria-label",
        isOpen
          ? "Close navigation menu"
          : "Open navigation menu"
      );


      const icon =
        menuBtn.querySelector("i");


      if (icon) {

        icon.classList.toggle(
          "fa-bars",
          !isOpen
        );

        icon.classList.toggle(
          "fa-xmark",
          isOpen
        );
      }
    }
  );


  const navigationLinks =
    primaryNavigation.querySelectorAll("a");


  navigationLinks.forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        primaryNavigation.classList.remove("show");

        menuBtn.setAttribute(
          "aria-expanded",
          "false"
        );

        menuBtn.setAttribute(
          "aria-label",
          "Open navigation menu"
        );


        const icon =
          menuBtn.querySelector("i");


        if (icon) {

          icon.classList.remove("fa-xmark");

          icon.classList.add("fa-bars");
        }
      }
    );

  });
}


// ==========================================
// 17. HEADER SCROLL EFFECT
// ==========================================

window.addEventListener(
  "scroll",
  () => {

    if (!header) {
      return;
    }

    header.classList.toggle(
      "scrolled",
      window.scrollY > 30
    );

  }
);


// ==========================================
// 18. INITIALIZE
// ==========================================

sortResources();