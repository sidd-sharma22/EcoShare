// =========================================
// My Listings
// =========================================

const listingsGrid = document.getElementById("listingsGrid");
const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");
const pageMessage = document.getElementById("pageMessage");

const authNavButton = document.getElementById("authNavButton");
const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");


// =========================================
// Helpers
// =========================================

function showMessage(message, type = "error") {
    pageMessage.textContent = message;
    pageMessage.className = `page-message ${type}`;
    pageMessage.hidden = false;
}

function hideMessage() {
    pageMessage.hidden = true;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatCategory(category) {
    if (!category) {
        return "Other";
    }

    return category
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}

function formatDate(dateString) {
    if (!dateString) {
        return "Unknown date";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Unknown date";
    }

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}


// =========================================
// Image
// =========================================

function getImageHtml(imageUrl, title) {
    if (imageUrl) {
        return `
            <img
                src="${escapeHtml(imageUrl)}"
                alt="${escapeHtml(title)}"
                loading="lazy"
                onerror="this.onerror=null; this.src='../assets/logo.png';"
            >
        `;
    }

    return `
        <img
            src="../assets/logo.png"
            alt="${escapeHtml(title)}"
        >
    `;
}


// =========================================
// Authentication Navigation
// =========================================

async function updateAuthNavigation() {
    const {
        data: { session },
    } = await supabaseClient.auth.getSession();

    if (session) {
        authNavButton.textContent = "Profile";
        authNavButton.href = "../Phase 1/profile.html";
        authNavButton.classList.add("profile-button");
    } else {
        authNavButton.textContent = "Login";
        authNavButton.href =
            `../Phase 1/login.html?redirect=${encodeURIComponent(
                "../Phase 2/my-listings.html"
            )}`;
        authNavButton.classList.remove("profile-button");
    }
}


// =========================================
// Load Current User
// =========================================

async function getAuthenticatedUser() {
    const {
        data: { user },
        error,
    } = await supabaseClient.auth.getUser();

    if (error) {
        console.error("Authentication error:", error);
        return null;
    }

    return user;
}


// =========================================
// Load Listings
// =========================================

async function loadMyListings() {

    loadingState.hidden = false;
    emptyState.hidden = true;
    listingsGrid.hidden = true;

    hideMessage();

    const user = await getAuthenticatedUser();

    if (!user) {

        loadingState.hidden = true;

        window.location.href =
            `../Phase 1/login.html?redirect=${encodeURIComponent(
                "../Phase 2/my-listings.html"
            )}`;

        return;
    }


    const {
        data: resources,
        error,
    } = await supabaseClient
        .from("resources")
        .select(`
            id,
            owner_id,
            title,
            description,
            category,
            location,
            image_url,
            available,
            created_at
        `)
        .eq("owner_id", user.id)
        .order("created_at", {
            ascending: false,
        });


    if (error) {

        console.error("Failed to load listings:", error);

        loadingState.hidden = true;

        showMessage(
            "Unable to load your listings. Please try again."
        );

        return;
    }


    loadingState.hidden = true;


    if (!resources || resources.length === 0) {
        emptyState.hidden = false;
        return;
    }


    renderListings(resources);

    listingsGrid.hidden = false;
}


// =========================================
// Render Listings
// =========================================

function renderListings(resources) {

    listingsGrid.innerHTML = resources
        .map(resource => {

            const availabilityClass =
                resource.available
                    ? "available"
                    : "unavailable";

            const availabilityText =
                resource.available
                    ? "Available"
                    : "Currently Unavailable";

            return `
                <article
                    class="listing-card"
                    data-resource-id="${resource.id}"
                >

                    <div class="listing-image">
                        ${getImageHtml(
                            resource.image_url,
                            resource.title
                        )}
                    </div>


                    <div class="listing-content">

                        <div class="listing-category">
                            ${escapeHtml(
                                formatCategory(resource.category)
                            )}
                        </div>


                        <h2 class="listing-title">
                            ${escapeHtml(resource.title)}
                        </h2>


                        <p class="listing-description">
                            ${escapeHtml(resource.description)}
                        </p>


                        <div class="listing-meta">

                            ${
                                resource.location
                                    ? `
                                        <div class="listing-meta-item">
                                            <i class="fa-solid fa-location-dot"></i>
                                            <span>
                                                ${escapeHtml(resource.location)}
                                            </span>
                                        </div>
                                    `
                                    : ""
                            }

                            <div class="listing-meta-item">
                                <i class="fa-regular fa-calendar"></i>
                                <span>
                                    Listed ${formatDate(resource.created_at)}
                                </span>
                            </div>

                        </div>


                        <span
                            class="availability-badge ${availabilityClass}"
                        >
                            ${escapeHtml(availabilityText)}
                        </span>


                        <div class="listing-actions">

                            <a
                                href="resource-details.html?id=${resource.id}"
                                class="listing-action view-resource-button"
                            >
                                <i class="fa-solid fa-eye"></i>
                                View Resource
                            </a>


                            <button
                                type="button"
                                class="listing-action delete-resource-button"
                                data-delete-id="${resource.id}"
                                data-delete-title="${escapeHtml(resource.title)}"
                            >
                                <i class="fa-solid fa-trash"></i>
                                Delete
                            </button>

                        </div>

                    </div>

                </article>
            `;
        })
        .join("");


    const deleteButtons =
        listingsGrid.querySelectorAll(
            "[data-delete-id]"
        );

    deleteButtons.forEach(button => {

        button.addEventListener(
            "click",
            handleDeleteResource
        );

    });
}


// =========================================
// Delete Resource
// =========================================

async function handleDeleteResource(event) {

    const button = event.currentTarget;

    const resourceId =
        button.dataset.deleteId;

    const resourceTitle =
        button.dataset.deleteTitle;


    const confirmed = window.confirm(
        `Are you sure you want to delete "${resourceTitle}"?\n\nThis action cannot be undone.`
    );


    if (!confirmed) {
        return;
    }


    button.disabled = true;

    button.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Deleting...
    `;


    const user = await getAuthenticatedUser();

    if (!user) {

        window.location.href =
            `../Phase 1/login.html?redirect=${encodeURIComponent(
                "../Phase 2/my-listings.html"
            )}`;

        return;
    }


    // Get the image URL before deleting the resource.
    const {
        data: resource,
        error: resourceFetchError,
    } = await supabaseClient
        .from("resources")
        .select("id, owner_id, image_url")
        .eq("id", resourceId)
        .eq("owner_id", user.id)
        .single();


    if (resourceFetchError) {

        console.error(
            "Failed to fetch resource:",
            resourceFetchError
        );

        showMessage(
            "Unable to find this resource."
        );

        resetDeleteButton(button);

        return;
    }


    // Delete resource from database.
    const {
        error: deleteError,
    } = await supabaseClient
        .from("resources")
        .delete()
        .eq("id", resourceId)
        .eq("owner_id", user.id);


    if (deleteError) {

        console.error(
            "Failed to delete resource:",
            deleteError
        );

        showMessage(
            "Unable to delete the resource. Please try again."
        );

        resetDeleteButton(button);

        return;
    }


    // Try to remove the associated Storage image.
    // The resource is already deleted, so an image cleanup
    // failure should not make the user think the resource remains.
    if (resource.image_url) {

        const storagePath =
            getStoragePathFromPublicUrl(
                resource.image_url
            );

        if (storagePath) {

            const {
                error: storageDeleteError,
            } = await supabaseClient
                .storage
                .from("resource-images")
                .remove([storagePath]);


            if (storageDeleteError) {

                console.warn(
                    "Resource deleted, but image cleanup failed:",
                    storageDeleteError
                );

            }
        }
    }


    showMessage(
        `"${resourceTitle}" was deleted successfully.`,
        "success"
    );


    await loadMyListings();
}


// =========================================
// Storage Path
// =========================================

function getStoragePathFromPublicUrl(publicUrl) {

    const marker =
        "/storage/v1/object/public/resource-images/";

    const markerIndex =
        publicUrl.indexOf(marker);


    if (markerIndex === -1) {
        return null;
    }


    return decodeURIComponent(
        publicUrl.substring(
            markerIndex + marker.length
        )
    );
}


// =========================================
// Reset Delete Button
// =========================================

function resetDeleteButton(button) {

    button.disabled = false;

    button.innerHTML = `
        <i class="fa-solid fa-trash"></i>
        Delete
    `;
}


// =========================================
// Mobile Navigation
// =========================================

if (menuToggle && navLinks) {

    menuToggle.addEventListener(
        "click",
        () => {

            const isOpen =
                navLinks.classList.toggle("show");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );


    navLinks
        .querySelectorAll(".nav-link, .auth-nav-button")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    navLinks.classList.remove("show");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });
}


// =========================================
// Auth State
// =========================================

supabaseClient.auth.onAuthStateChange(
    () => {
        updateAuthNavigation();
    }
);


// =========================================
// Initialize
// =========================================

async function init() {

    await updateAuthNavigation();

    await loadMyListings();
}

init();