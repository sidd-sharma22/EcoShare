// ==========================================
// EcoShare Homepage JavaScript
// ==========================================


// ==========================================
// 1. DEMO RESOURCE DATA
// ==========================================

const resources = [

    {
        id: 1,
        title: "Programming Books",
        description:
            "Useful programming and computer science books.",
        category: "books",
        owner: "Rahul",
        location: "Kottayam",
        available: true,
        image: "/assets/programming-book.jpg"
    },

    {
        id: 2,
        title: "Scientific Calculator",
        description:
            "Casio scientific calculator available for students.",
        category: "electronics",
        owner: "Ananya",
        location: "Kottayam",
        available: true,
        image: "/assets/calculator.jpg"
    },

    {
        id: 3,
        title: "Power Drill",
        description:
            "Electric power drill for household and DIY work.",
        category: "tools",
        owner: "Arjun",
        location: "Kottayam",
        available: true,
        image: "/assets/power-drill.jpg"
    },

    {
        id: 4,
        title: "College Backpack",
        description:
            "Good condition backpack suitable for college students.",
        category: "others",
        owner: "Sneha",
        location: "Kottayam",
        available: true,
        image: "/assets/backpack.jpg"
    }

];


// ==========================================
// 2. GET HTML ELEMENTS
// ==========================================

const resourceGrid =
    document.getElementById("resourceGrid");

const resourceSearch =
    document.getElementById("resourceSearch");

const searchBtn =
    document.querySelector(".search-btn");

const categories =
    document.querySelectorAll(".category");

const menuBtn =
    document.getElementById("menu-btn");

const primaryNavigation =
    document.getElementById("primary-navigation");

const header =
    document.querySelector(".header");


// ==========================================
// 3. CURRENT FILTER
// ==========================================

let selectedCategory = "all";


// ==========================================
// 4. FORMAT CATEGORY NAME
// ==========================================

function formatCategory(category) {

    return (
        category.charAt(0).toUpperCase() +
        category.slice(1)
    );

}


// ==========================================
// 5. DISPLAY RESOURCES
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

        const card =
            document.createElement("div");

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

        const image =
            card.querySelector("img");

        image.addEventListener("error", () => {

            image.style.display = "none";

            const imageContainer =
                card.querySelector(".resource-image");

            imageContainer.innerHTML = `
                <i class="fa-solid fa-image"></i>
            `;

        });


        // ------------------------------------------
        // VIEW BUTTON
        // ------------------------------------------

        const viewButton =
            card.querySelector(".view-resource-btn");

        viewButton.addEventListener("click", () => {

            viewResource(resource.id);

        });


        resourceGrid.appendChild(card);

    });

}


// ==========================================
// 6. FILTER RESOURCES
// ==========================================

function filterResources() {

    const searchText =
        resourceSearch
            ? resourceSearch.value
                .toLowerCase()
                .trim()
            : "";


    const filteredResources =
        resources.filter((resource) => {


            // --------------------------------------
            // CATEGORY MATCH
            // --------------------------------------

            const matchesCategory =
                selectedCategory === "all" ||
                resource.category === selectedCategory;


            // --------------------------------------
            // SEARCH MATCH
            // --------------------------------------

            const matchesSearch =

                resource.title
                    .toLowerCase()
                    .includes(searchText)

                ||

                resource.description
                    .toLowerCase()
                    .includes(searchText)

                ||

                resource.category
                    .toLowerCase()
                    .includes(searchText)

                ||

                resource.owner
                    .toLowerCase()
                    .includes(searchText)

                ||

                resource.location
                    .toLowerCase()
                    .includes(searchText);


            return (
                matchesCategory &&
                matchesSearch
            );

        });


    displayResources(filteredResources);

}


// ==========================================
// 7. SEARCH INPUT
// ==========================================

if (resourceSearch) {

    resourceSearch.addEventListener(
        "input",
        filterResources
    );

}


// ==========================================
// 8. SEARCH BUTTON
// ==========================================

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        filterResources
    );

}


// ==========================================
// 9. CATEGORY FILTER
// ==========================================

categories.forEach((category) => {

    category.addEventListener(
        "click",
        () => {


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

            selectedCategory =
                category.dataset.category;


            // --------------------------------------
            // APPLY FILTER
            // --------------------------------------

            filterResources();

        }
    );

});


// ==========================================
// 10. VIEW RESOURCE
// ==========================================

function viewResource(resourceId) {
  const resource = resources.find(
    (item) => item.id === resourceId
  );

  if (!resource) {
    return;
  }

  window.location.href =
    `../Phase 2/resource-details.html?id=${encodeURIComponent(resource.id)}`;
}


// ==========================================
// 11. MOBILE NAVIGATION
// ==========================================

if (
    menuBtn &&
    primaryNavigation
) {

    menuBtn.addEventListener(
        "click",
        () => {


            const isOpen =
                primaryNavigation
                    .classList
                    .toggle("show");


            menuBtn.setAttribute(
                "aria-expanded",
                isOpen
            );

        }
    );


    // ------------------------------------------
    // CLOSE MENU WHEN NAV LINK IS CLICKED
    // ------------------------------------------

    const navLinks =
        primaryNavigation
            .querySelectorAll(".nav-link");


    navLinks.forEach((link) => {

        link.addEventListener(
            "click",
            () => {

                primaryNavigation
                    .classList
                    .remove("show");


                menuBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }
        );

    });

}


// ==========================================
// 12. SMOOTH SCROLLING
// ==========================================

document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {


                const targetId =
                    link.getAttribute("href");


                // Ignore empty "#"
                if (targetId === "#") {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (target) {

                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });


// ==========================================
// 13. NAVBAR SCROLL EFFECT
// ==========================================

window.addEventListener(
    "scroll",
    () => {

        if (!header) return;


        if (window.scrollY > 50) {

            header.classList.add(
                "scrolled"
            );

        } else {

            header.classList.remove(
                "scrolled"
            );

        }

    }
);


// ==========================================
// 14. INITIAL LOAD
// ==========================================

displayResources(resources);