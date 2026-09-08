// ==========================================
// EcoShare — Resource Details JavaScript
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

const detailsCard =
  document.getElementById("detailsCard");

const detailsImage =
  document.getElementById("detailsImage");

const detailsCategory =
  document.getElementById("detailsCategory");

const detailsTitle =
  document.getElementById("detailsTitle");

const detailsDescription =
  document.getElementById("detailsDescription");

const detailsOwner =
  document.getElementById("detailsOwner");

const detailsLocation =
  document.getElementById("detailsLocation");

const detailsAvailability =
  document.getElementById("detailsAvailability");

const breadcrumbTitle =
  document.getElementById("breadcrumbTitle");

const borrowBtn =
  document.getElementById("borrowBtn");

const detailsMessage =
  document.getElementById("detailsMessage");

const resourceNotFound =
  document.getElementById("resourceNotFound");

const menuBtn =
  document.getElementById("menu-btn");

const primaryNavigation =
  document.getElementById("primary-navigation");

const header =
  document.querySelector(".header");


// ==========================================
// 3. FORMAT CATEGORY
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
// 4. SHOW MESSAGE
// ==========================================

function showMessage(
  text,
  type = "error"
) {

  if (!detailsMessage) {
    return;
  }

  detailsMessage.textContent = text;

  detailsMessage.style.color =
    type === "success"
      ? "var(--color-success)"
      : "var(--color-error)";
}


// ==========================================
// 5. GET RESOURCE ID
// ==========================================

function getResourceId() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const id =
    Number(params.get("id"));

  return Number.isInteger(id)
    ? id
    : null;
}


// ==========================================
// 6. FIND RESOURCE
// ==========================================

function getResourceById(id) {

  return resources.find(
    (resource) =>
      resource.id === id
  );
}


// ==========================================
// 7. DISPLAY RESOURCE IMAGE
// ==========================================

function displayResourceImage(resource) {

  if (!detailsImage) {
    return;
  }

  detailsImage.innerHTML = "";

  const image =
    document.createElement("img");

  image.src = resource.image;

  image.alt =
    resource.title;

  image.addEventListener(
    "error",
    () => {

      detailsImage.innerHTML = `
        <i
          class="fa-solid fa-image"
          aria-hidden="true"
        ></i>
      `;

    }
  );

  detailsImage.appendChild(image);
}


// ==========================================
// 8. SETUP BORROW BUTTON
// ==========================================

function setupBorrowButton(resource) {

  if (!borrowBtn) {
    return;
  }

  showMessage("");


  // ========================================
  // RESOURCE UNAVAILABLE
  // ========================================

  if (!resource.available) {

    borrowBtn.disabled = true;

    borrowBtn.innerHTML = `
      <i
        class="fa-solid fa-ban"
        aria-hidden="true"
      ></i>
      Currently Unavailable
    `;

    borrowBtn.onclick = null;

    return;
  }


  // ========================================
  // RESOURCE AVAILABLE
  // ========================================

  borrowBtn.disabled = false;

  borrowBtn.innerHTML = `
    <i
      class="fa-solid fa-hand-holding"
      aria-hidden="true"
    ></i>
    Borrow / Request
  `;


  borrowBtn.onclick = () => {
    handleBorrowRequest(resource);
  };
}


// ==========================================
// 9. HANDLE BORROW REQUEST
// ==========================================

function handleBorrowRequest(resource) {

  if (!resource) {
    return;
  }


  // ========================================
  // SAFETY CHECK
  // ========================================

  if (!resource.available) {

    showMessage(
      "This resource is currently unavailable."
    );

    return;
  }


  /*
   * FRONTEND-ONLY STAGE
   *
   * Real authentication and borrowing
   * requests will be handled by the backend.
   *
   * For now, the user is sent to Login.
   */


  showMessage(
    "Please login to request this resource.",
    "success"
  );


  /*
   * Preserve the resource URL so the
   * login page can eventually return the
   * user to this resource.
   */

  const returnUrl =
    `../Phase 2/resource-details.html?id=${resource.id}`;


  const loginUrl =
    `../Phase 1/login.html?redirect=${encodeURIComponent(returnUrl)}`;


  setTimeout(() => {

    window.location.href =
      loginUrl;

  }, 600);
}


// ==========================================
// 10. DISPLAY RESOURCE
// ==========================================

function displayResource(resource) {

  if (!resource) {

    showResourceNotFound();

    return;
  }


  // ========================================
  // SHOW DETAILS
  // ========================================

  if (detailsCard) {
    detailsCard.hidden = false;
  }

  if (resourceNotFound) {
    resourceNotFound.hidden = true;
  }


  // ========================================
  // PAGE TITLE
  // ========================================

  document.title =
    `${resource.title} | EcoShare`;


  // ========================================
  // BREADCRUMB
  // ========================================

  if (breadcrumbTitle) {

    breadcrumbTitle.textContent =
      resource.title;
  }


  // ========================================
  // CATEGORY
  // ========================================

  if (detailsCategory) {

    detailsCategory.textContent =
      formatCategory(resource.category);
  }


  // ========================================
  // TITLE
  // ========================================

  if (detailsTitle) {

    detailsTitle.textContent =
      resource.title;
  }


  // ========================================
  // DESCRIPTION
  // ========================================

  if (detailsDescription) {

    detailsDescription.textContent =
      resource.description;
  }


  // ========================================
  // OWNER
  // ========================================

  if (detailsOwner) {

    detailsOwner.textContent =
      resource.owner;
  }


  // ========================================
  // LOCATION
  // ========================================

  if (detailsLocation) {

    detailsLocation.textContent =
      resource.location;
  }


  // ========================================
  // AVAILABILITY
  // ========================================

  if (detailsAvailability) {

    detailsAvailability.classList.remove(
      "available",
      "unavailable"
    );


    if (resource.available) {

      detailsAvailability.textContent =
        "Available";

      detailsAvailability.classList.add(
        "available"
      );

    } else {

      detailsAvailability.textContent =
        "Currently Borrowed";

      detailsAvailability.classList.add(
        "unavailable"
      );

    }

  }


  // ========================================
  // IMAGE
  // ========================================

  displayResourceImage(resource);


  // ========================================
  // BORROW BUTTON
  // ========================================

  setupBorrowButton(resource);
}


// ==========================================
// 11. RESOURCE NOT FOUND
// ==========================================

function showResourceNotFound() {

  if (detailsCard) {
    detailsCard.hidden = true;
  }

  if (resourceNotFound) {
    resourceNotFound.hidden = false;
  }

  document.title =
    "Resource Not Found | EcoShare";
}


// ==========================================
// 12. MOBILE NAVIGATION
// ==========================================

if (
  menuBtn &&
  primaryNavigation
) {

  menuBtn.addEventListener(
    "click",
    () => {

      const isOpen =
        primaryNavigation.classList.toggle(
          "show"
        );


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
    primaryNavigation.querySelectorAll(
      "a"
    );


  navigationLinks.forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        primaryNavigation.classList.remove(
          "show"
        );


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

          icon.classList.remove(
            "fa-xmark"
          );

          icon.classList.add(
            "fa-bars"
          );
        }

      }
    );

  });
}


// ==========================================
// 13. HEADER SCROLL EFFECT
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
// 14. INITIALIZE PAGE
// ==========================================

const resourceId =
  getResourceId();

const resource =
  getResourceById(resourceId);


if (resource) {

  displayResource(resource);

} else {

  showResourceNotFound();

}