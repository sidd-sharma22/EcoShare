// EcoShare Resource Details - Supabase-backed.
(() => {
  "use strict";

  const breadcrumbTitle = document.getElementById("breadcrumbTitle");
  const detailsCard = document.getElementById("detailsCard");
  const detailsImage = document.getElementById("detailsImage");
  const detailsCategory = document.getElementById("detailsCategory");
  const detailsTitle = document.getElementById("detailsTitle");
  const detailsDescription = document.getElementById("detailsDescription");
  const detailsOwner = document.getElementById("detailsOwner");
  const detailsLocation = document.getElementById("detailsLocation");
  const detailsAvailability = document.getElementById("detailsAvailability");
  const borrowBtn = document.getElementById("borrowBtn");
  const detailsMessage = document.getElementById("detailsMessage");
  const resourceNotFound = document.getElementById("resourceNotFound");
  const menuBtn = document.getElementById("menu-btn");
  const primaryNavigation = document.getElementById("primary-navigation");
  const header = document.querySelector(".header");

  const formatCategory = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : "Other";
  const getResourceId = () => {
    const id = Number(new URLSearchParams(window.location.search).get("id"));
    return Number.isInteger(id) && id > 0 ? id : null;
  };
  const showMessage = (text, type = "error") => {
    if (!detailsMessage) return;
    detailsMessage.textContent = text;
    detailsMessage.style.color = type === "success" ? "var(--color-success, #2e7d32)" : "var(--color-error, #c62828)";
  };

  function showNotFound() {
    if (detailsCard) detailsCard.hidden = true;
    if (resourceNotFound) resourceNotFound.hidden = false;
  }

  function display(resource) {
    if (!resource) return showNotFound();
    if (detailsCard) detailsCard.hidden = false;
    if (resourceNotFound) resourceNotFound.hidden = true;
    document.title = `${resource.title} | EcoShare`;
    if (breadcrumbTitle) breadcrumbTitle.textContent = resource.title;
    if (detailsCategory) detailsCategory.textContent = formatCategory(resource.category);
    if (detailsTitle) detailsTitle.textContent = resource.title;
    if (detailsDescription) detailsDescription.textContent = resource.description;
    if (detailsOwner) detailsOwner.textContent = resource.owner;
    if (detailsLocation) detailsLocation.textContent = resource.location;
    if (detailsAvailability) {
      detailsAvailability.classList.remove("available", "unavailable");
      detailsAvailability.textContent = resource.available ? "Available" : "Currently Borrowed";
      detailsAvailability.classList.add(resource.available ? "available" : "unavailable");
    }
    if (detailsImage) {
      detailsImage.innerHTML = "";
      const image = document.createElement("img");
      image.src = resource.image;
      image.alt = resource.title;
      image.addEventListener("error", () => {
        detailsImage.innerHTML = `<i class="fa-solid fa-image" aria-hidden="true"></i>`;
      });
      detailsImage.appendChild(image);
    }

    if (!borrowBtn) return;
    borrowBtn.disabled = !resource.available;
    borrowBtn.innerHTML = resource.available
      ? `<i class="fa-solid fa-hand-holding" aria-hidden="true"></i> Borrow / Request`
      : `<i class="fa-solid fa-ban" aria-hidden="true"></i> Currently Unavailable`;
    borrowBtn.onclick = resource.available ? async () => {
      const user = await window.EcoShareSupabase.getUser();
      if (!user) {
        const returnUrl = `/Phase 2/resource-details.html?id=${encodeURIComponent(resource.id)}`;
        window.location.href = `/Phase 1/login.html?redirect=${encodeURIComponent(returnUrl)}`;
        return;
      }
      window.location.href = `/Phase 2/borrow-request.html?id=${encodeURIComponent(resource.id)}`;
    } : null;
  }

  menuBtn?.addEventListener("click", () => {
    const open = primaryNavigation?.classList.toggle("show");
    menuBtn.setAttribute("aria-expanded", String(Boolean(open)));
  });
  window.addEventListener("scroll", () => header?.classList.toggle("scrolled", window.scrollY > 30));

  (async () => {
    const id = getResourceId();
    if (!id) return showNotFound();
    try {
      display(await window.EcoShareSupabase.getResourceById(id));
    } catch (error) {
      console.error("Failed to load resource:", error);
      showMessage("Unable to load this resource.");
    }
  })();
})();
