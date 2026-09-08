// ==========================================
// EcoShare — Borrow Request JavaScript
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
    image: "/assets/programming-books.jpg",
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

const borrowRequestCard =
  document.getElementById("borrowRequestCard");

const resourceNotFound =
  document.getElementById("resourceNotFound");

const resourceLink =
  document.getElementById("resourceLink");

const resourceImage =
  document.getElementById("resourceImage");

const resourceCategory =
  document.getElementById("resourceCategory");

const resourceTitle =
  document.getElementById("resourceTitle");

const resourceDescription =
  document.getElementById("resourceDescription");

const resourceOwner =
  document.getElementById("resourceOwner");

const resourceLocation =
  document.getElementById("resourceLocation");

const resourceAvailability =
  document.getElementById("resourceAvailability");

const borrowRequestForm =
  document.getElementById("borrowRequestForm");

const requestMessage =
  document.getElementById("requestMessage");

const characterCount =
  document.getElementById("characterCount");

const messageError =
  document.getElementById("messageError");

const requestBtn =
  document.getElementById("requestBtn");

const formMessage =
  document.getElementById("formMessage");

const backButton =
  document.getElementById("backButton");

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
// 4. GET RESOURCE ID
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
// 5. FIND RESOURCE
// ==========================================

function getResourceById(id) {

  return resources.find(
    (resource) =>
      resource.id === id
  );
}


// ==========================================
// 6. SHOW FORM MESSAGE
// ==========================================

function showFormMessage(
  text,
  type = "error"
) {

  if (!formMessage) {
    return;
  }

  formMessage.textContent = text;

  formMessage.style.color =
    type === "success"
      ? "var(--color-success)"
      : "var(--color-error)";
}


// ==========================================
// 7. SHOW FIELD ERROR
// ==========================================

function showFieldError(text) {

  if (!messageError) {
    return;
  }

  messageError.textContent = text;
}


// ==========================================
// 8. UPDATE CHARACTER COUNT
// ==========================================

function updateCharacterCount() {

  if (!requestMessage || !characterCount) {
    return;
  }

  const count =
    requestMessage.value.length;

  characterCount.textContent =
    `${count} / 500`;
}


// ==========================================
// 9. DISPLAY RESOURCE IMAGE
// ==========================================

function displayResourceImage(resource) {

  if (!resourceImage) {
    return;
  }

  resourceImage.src =
    resource.image;

  resourceImage.alt =
    resource.title;

  resourceImage.onerror = () => {

    resourceImage.removeAttribute("src");

    resourceImage.alt = "";

    const imageContainer =
      resourceImage.parentElement;

    if (!imageContainer) {
      return;
    }

    imageContainer.innerHTML = `
      <i
        class="fa-solid fa-image"
        aria-hidden="true"
      ></i>
    `;
  };
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
  // SHOW PAGE
  // ========================================

  if (borrowRequestCard) {
    borrowRequestCard.hidden = false;
  }

  if (resourceNotFound) {
    resourceNotFound.hidden = true;
  }


  // ========================================
  // PAGE TITLE
  // ========================================

  document.title =
    `Borrow ${resource.title} | EcoShare`;


  // ========================================
  // RESOURCE LINK
  // ========================================

  if (resourceLink) {

    resourceLink.textContent =
      resource.title;

    resourceLink.href =
      `resource-details.html?id=${encodeURIComponent(resource.id)}`;
  }


  // ========================================
  // RESOURCE CATEGORY
  // ========================================

  if (resourceCategory) {

    resourceCategory.textContent =
      formatCategory(resource.category);
  }


  // ========================================
  // RESOURCE TITLE
  // ========================================

  if (resourceTitle) {

    resourceTitle.textContent =
      resource.title;
  }


  // ========================================
  // RESOURCE DESCRIPTION
  // ========================================

  if (resourceDescription) {

    resourceDescription.textContent =
      resource.description;
  }


  // ========================================
  // RESOURCE OWNER
  // ========================================

  if (resourceOwner) {

    resourceOwner.textContent =
      resource.owner;
  }


  // ========================================
  // RESOURCE LOCATION
  // ========================================

  if (resourceLocation) {

    resourceLocation.textContent =
      resource.location;
  }


  // ========================================
  // RESOURCE AVAILABILITY
  // ========================================

  if (resourceAvailability) {

    resourceAvailability.classList.remove(
      "unavailable"
    );


    if (resource.available) {

      resourceAvailability.textContent =
        "Available";

    } else {

      resourceAvailability.textContent =
        "Currently Borrowed";

      resourceAvailability.classList.add(
        "unavailable"
      );
    }
  }


  // ========================================
  // RESOURCE IMAGE
  // ========================================

  displayResourceImage(resource);


  // ========================================
  // FORM STATE
  // ========================================

  setupRequestForm(resource);
}


// ==========================================
// 11. SETUP REQUEST FORM
// ==========================================

function setupRequestForm(resource) {

  if (!borrowRequestForm) {
    return;
  }


  // Reset form state

  borrowRequestForm.reset();

  updateCharacterCount();

  showFieldError("");

  showFormMessage("");


  // ========================================
  // RESOURCE UNAVAILABLE
  // ========================================

  if (!resource.available) {

    if (requestMessage) {
      requestMessage.disabled = true;
    }

    if (requestBtn) {

      requestBtn.disabled = true;

      requestBtn.innerHTML = `
        <i
          class="fa-solid fa-ban"
          aria-hidden="true"
        ></i>
        Currently Unavailable
      `;
    }

    return;
  }


  // ========================================
  // RESOURCE AVAILABLE
  // ========================================

  if (requestMessage) {
    requestMessage.disabled = false;
  }

  if (requestBtn) {

    requestBtn.disabled = false;

    requestBtn.innerHTML = `
      <i
        class="fa-solid fa-paper-plane"
        aria-hidden="true"
      ></i>
      Send Request
    `;
  }
}


// ==========================================
// 12. VALIDATE REQUEST MESSAGE
// ==========================================

function validateRequestMessage() {

  if (!requestMessage) {
    return false;
  }

  const message =
    requestMessage.value.trim();


  if (!message) {

    showFieldError(
      "Please enter a message for the resource owner."
    );

    requestMessage.focus();

    return false;
  }


  if (message.length < 10) {

    showFieldError(
      "Please enter at least 10 characters."
    );

    requestMessage.focus();

    return false;
  }


  if (message.length > 500) {

    showFieldError(
      "Message cannot exceed 500 characters."
    );

    requestMessage.focus();

    return false;
  }


  showFieldError("");

  return true;
}


// ==========================================
// 13. HANDLE REQUEST SUBMISSION
// ==========================================

function handleRequestSubmission(resource) {

  if (!resource) {
    return;
  }


  // ========================================
  // AVAILABILITY CHECK
  // ========================================

  if (!resource.available) {

    showFormMessage(
      "This resource is currently unavailable."
    );

    return;
  }


  // ========================================
  // MESSAGE VALIDATION
  // ========================================

  if (!validateRequestMessage()) {
    return;
  }


  /*
   * ========================================
   * FRONTEND-ONLY STAGE
   * ========================================
   *
   * We are not storing or submitting a real
   * borrow request yet.
   *
   * The backend will later:
   *
   * 1. Authenticate the user.
   * 2. Identify the requester.
   * 3. Verify the resource exists.
   * 4. Verify the resource is available.
   * 5. Prevent self-borrowing.
   * 6. Create the borrow request.
   *
   * For now, we only validate the form and
   * send the guest/user to Login.
   */


  showFormMessage(
    "Please login to continue with your request.",
    "success"
  );


  const returnUrl =
    `../Phase 2/borrow-request.html?id=${encodeURIComponent(resource.id)}`;


  const loginUrl =
    `../Phase 1/login.html?redirect=${encodeURIComponent(returnUrl)}`;


  if (requestBtn) {
    requestBtn.disabled = true;
  }


  setTimeout(() => {

    window.location.href =
      loginUrl;

  }, 600);
}


// ==========================================
// 14. FORM SUBMISSION
// ==========================================

if (borrowRequestForm) {

  borrowRequestForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();

      const resourceId =
        getResourceId();

      const resource =
        getResourceById(resourceId);

      handleRequestSubmission(resource);
    }
  );
}


// ==========================================
// 15. CHARACTER COUNT
// ==========================================

if (requestMessage) {

  requestMessage.addEventListener(
    "input",
    () => {

      updateCharacterCount();

      if (messageError) {
        messageError.textContent = "";
      }

      if (formMessage) {
        formMessage.textContent = "";
      }
    }
  );
}


// ==========================================
// 16. MOBILE NAVIGATION
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
// 18. RESOURCE NOT FOUND
// ==========================================

function showResourceNotFound() {

  if (borrowRequestCard) {
    borrowRequestCard.hidden = true;
  }

  if (resourceNotFound) {
    resourceNotFound.hidden = false;
  }

  document.title =
    "Resource Not Found | EcoShare";
}


// ==========================================
// 19. INITIALIZE
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