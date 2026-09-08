// EcoShare Borrow Request - Supabase-backed.
(() => {
  "use strict";

  const resourceLink = document.getElementById("resourceLink");
  const borrowRequestCard = document.getElementById("borrowRequestCard");
  const resourceImage = document.getElementById("resourceImage");
  const resourceCategory = document.getElementById("resourceCategory");
  const resourceTitle = document.getElementById("resourceTitle");
  const resourceDescription = document.getElementById("resourceDescription");
  const resourceOwner = document.getElementById("resourceOwner");
  const resourceLocation = document.getElementById("resourceLocation");
  const resourceAvailability = document.getElementById("resourceAvailability");
  const borrowRequestForm = document.getElementById("borrowRequestForm");
  const requestMessage = document.getElementById("requestMessage");
  const characterCount = document.getElementById("characterCount");
  const messageError = document.getElementById("messageError");
  const requestBtn = document.getElementById("requestBtn");
  const formMessage = document.getElementById("formMessage");
  const resourceNotFound = document.getElementById("resourceNotFound");
  const menuBtn = document.getElementById("menu-btn");
  const primaryNavigation = document.getElementById("primary-navigation");
  const header = document.querySelector(".header");

  let resource = null;

  const formatCategory = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : "Other";
  const getResourceId = () => {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    return Number.isInteger(id) && id > 0 ? id : null;
  };
  const showFormMessage = (text, type = "error") => {
    if (!formMessage) return;
    formMessage.textContent = text;
    formMessage.style.color = type === "success" ? "var(--color-success, #2e7d32)" : "var(--color-error, #c62828)";
  };
  const updateCharacterCount = () => {
    if (requestMessage && characterCount) characterCount.textContent = `${requestMessage.value.length} / 500`;
  };

  function showNotFound() {
    if (borrowRequestCard) borrowRequestCard.hidden = true;
    if (resourceNotFound) resourceNotFound.hidden = false;
  }

  function display(item) {
    if (!item) return showNotFound();
    resource = item;
    if (borrowRequestCard) borrowRequestCard.hidden = false;
    if (resourceNotFound) resourceNotFound.hidden = true;
    document.title = `Borrow ${item.title} | EcoShare`;
    if (resourceLink) { resourceLink.textContent = item.title; resourceLink.href = `/Phase 2/resource-details.html?id=${encodeURIComponent(item.id)}`; }
    if (resourceCategory) resourceCategory.textContent = formatCategory(item.category);
    if (resourceTitle) resourceTitle.textContent = item.title;
    if (resourceDescription) resourceDescription.textContent = item.description;
    if (resourceOwner) resourceOwner.textContent = item.owner;
    if (resourceLocation) resourceLocation.textContent = item.location;
    if (resourceAvailability) {
      resourceAvailability.classList.toggle("unavailable", !item.available);
      resourceAvailability.textContent = item.available ? "Available" : "Currently Borrowed";
    }
    if (resourceImage) {
      resourceImage.src = item.image;
      resourceImage.alt = item.title;
    }
    if (!item.available) {
      requestMessage.disabled = true;
      requestBtn.disabled = true;
      requestBtn.innerHTML = `<i class="fa-solid fa-ban" aria-hidden="true"></i> Currently Unavailable`;
    }
  }

  requestMessage?.addEventListener("input", () => {
    updateCharacterCount();
    if (messageError) messageError.textContent = "";
    if (formMessage) formMessage.textContent = "";
  });

  borrowRequestForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!resource || !resource.available) return;

    const message = requestMessage?.value.trim() || "";
    if (message.length < 10) {
      if (messageError) messageError.textContent = "Please enter at least 10 characters.";
      requestMessage?.focus();
      return;
    }
    if (message.length > 500) {
      if (messageError) messageError.textContent = "Message cannot exceed 500 characters.";
      return;
    }

    const originalText = requestBtn.innerHTML;
    requestBtn.disabled = true;
    requestBtn.textContent = "Sending...";
    showFormMessage("");

    try {
      const user = await window.EcoShareSupabase.getUser();
      if (!user) {
        const returnUrl = `/Phase 2/borrow-request.html?id=${encodeURIComponent(resource.id)}`;
        window.location.href = `/Phase 1/login.html?redirect=${encodeURIComponent(returnUrl)}`;
        return;
      }

      await window.EcoShareSupabase.createBorrowRequest(resource.id, message);
      borrowRequestForm.reset();
      updateCharacterCount();
      showFormMessage("Your borrow request has been sent to the resource owner.", "success");
    } catch (error) {
      console.error("Borrow request failed:", error);
      let text = "Unable to send the borrow request.";
      const lower = String(error.message || "").toLowerCase();
      if (lower.includes("unavailable")) text = "This resource is currently unavailable.";
      else if (lower.includes("own resource")) text = "You cannot request your own resource.";
      else if (lower.includes("duplicate") || lower.includes("one_active_request_per_user_resource")) text = "You already have a pending request for this resource.";
      else if (error.code === "AUTH_REQUIRED") text = "Please login before sending a request.";
      showFormMessage(text);
      requestBtn.disabled = false;
      requestBtn.innerHTML = originalText;
    }
  });

  menuBtn?.addEventListener("click", () => {
    const open = primaryNavigation?.classList.toggle("show");
    menuBtn.setAttribute("aria-expanded", String(Boolean(open)));
  });
  window.addEventListener("scroll", () => header?.classList.toggle("scrolled", window.scrollY > 30));

  updateCharacterCount();
  (async () => {
    const id = getResourceId();
    if (!id) return showNotFound();
    try {
      display(await window.EcoShareSupabase.getResourceById(id));
    } catch (error) {
      console.error("Failed to load resource:", error);
      showNotFound();
    }
  })();
})();
