// ==================================================
// EcoShare — Lend Resource
// ==================================================


// ==================================================
// 1. DOM ELEMENTS
// ==================================================

const lendResourceForm =
  document.getElementById("lendResourceForm");

const resourceTitle =
  document.getElementById("resourceTitle");

const resourceDescription =
  document.getElementById("resourceDescription");

const resourceCategory =
  document.getElementById("resourceCategory");

const resourceLocation =
  document.getElementById("resourceLocation");

const resourceImage =
  document.getElementById("resourceImage");

const imageUploadArea =
  document.getElementById("imageUploadArea");

const imagePreview =
  document.getElementById("imagePreview");

const imagePreviewImg =
  document.getElementById("imagePreviewImg");

const imageFileName =
  document.getElementById("imageFileName");

const removeImageButton =
  document.getElementById("removeImageButton");

const descriptionCount =
  document.getElementById("descriptionCount");

const titleError =
  document.getElementById("titleError");

const descriptionError =
  document.getElementById("descriptionError");

const categoryError =
  document.getElementById("categoryError");

const imageError =
  document.getElementById("imageError");

const formMessage =
  document.getElementById("formMessage");

const submitResourceBtn =
  document.getElementById("submitResourceBtn");

const authNavButton =
  document.getElementById("authNavButton");


// ==================================================
// 2. CONSTANTS
// ==================================================

const STORAGE_BUCKET =
  "resource-images";

const MAX_IMAGE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];


// ==================================================
// 3. SELECTED IMAGE
// ==================================================

let selectedImageFile = null;

let previewObjectUrl = null;


// ==================================================
// 4. INITIALIZE PAGE
// ==================================================

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    setupDescriptionCounter();

    setupImageUpload();

    setupMobileNavigation();

    setupHeaderScroll();


    const isAuthenticated =
      await checkAuthentication();


    if (!isAuthenticated) {
      return;
    }


    await updateAuthNavigation();

  }
);


// ==================================================
// 5. CHECK AUTHENTICATION
// ==================================================

async function checkAuthentication() {

  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser();


  if (error || !user) {

    const returnUrl =
      "../Phase 2/lend-resource.html";


    window.location.href =
      "../Phase 1/login.html?redirect=" +
      encodeURIComponent(returnUrl);


    return false;
  }


  return true;
}


// ==================================================
// 6. AUTH NAVIGATION
// ==================================================

async function updateAuthNavigation() {

  if (!authNavButton) {
    return;
  }


  const {
    data: { session },
  } = await supabaseClient.auth.getSession();


  if (session) {

    authNavButton.innerHTML = `
      <i class="fa-solid fa-user"></i>
      Profile
    `;


    authNavButton.href =
      "../Phase 1/profile.html";


    authNavButton.setAttribute(
      "aria-label",
      "Open profile"
    );

  } else {

    authNavButton.innerHTML = `
      <i class="fa-solid fa-right-to-bracket"></i>
      Login
    `;


    authNavButton.href =
      "../Phase 1/login.html";


    authNavButton.setAttribute(
      "aria-label",
      "Login"
    );

  }
}


// ==================================================
// 7. DESCRIPTION CHARACTER COUNTER
// ==================================================

function setupDescriptionCounter() {

  if (
    !resourceDescription ||
    !descriptionCount
  ) {
    return;
  }


  function updateCount() {

    descriptionCount.textContent =
      resourceDescription.value.length;

  }


  resourceDescription.addEventListener(
    "input",
    updateCount
  );


  updateCount();
}


// ==================================================
// 8. IMAGE UPLOAD SETUP
// ==================================================

function setupImageUpload() {

  if (!resourceImage) {
    return;
  }


  // ----------------------------------------------
  // File selected
  // ----------------------------------------------

  resourceImage.addEventListener(
    "change",
    handleImageSelection
  );


  // ----------------------------------------------
  // Remove image
  // ----------------------------------------------

  if (removeImageButton) {

    removeImageButton.addEventListener(
      "click",
      removeSelectedImage
    );

  }

}


// ==================================================
// 9. HANDLE IMAGE SELECTION
// ==================================================

function handleImageSelection(event) {

  clearImageError();


  const file =
    event.target.files?.[0];


  if (!file) {

    removeSelectedImage();

    return;
  }


  // ----------------------------------------------
  // Validate file type
  // ----------------------------------------------

  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type
    )
  ) {

    showFieldError(
      resourceImage,
      imageError,
      "Please select a JPG, PNG, or WEBP image."
    );


    resetImageInput();

    return;
  }


  // ----------------------------------------------
  // Validate file size
  // ----------------------------------------------

  if (file.size > MAX_IMAGE_SIZE) {

    showFieldError(
      resourceImage,
      imageError,
      "Image size must be 5 MB or smaller."
    );


    resetImageInput();

    return;
  }


  // ----------------------------------------------
  // Store selected file
  // ----------------------------------------------

  selectedImageFile =
    file;


  // ----------------------------------------------
  // Create preview
  // ----------------------------------------------

  if (previewObjectUrl) {

    URL.revokeObjectURL(
      previewObjectUrl
    );

  }


  previewObjectUrl =
    URL.createObjectURL(file);


  if (imagePreviewImg) {

    imagePreviewImg.src =
      previewObjectUrl;

  }


  if (imageFileName) {

    imageFileName.textContent =
      file.name;

  }


  // ----------------------------------------------
  // Show preview
  // ----------------------------------------------

  if (imageUploadArea) {

    imageUploadArea.hidden =
      true;

  }


  if (imagePreview) {

    imagePreview.hidden =
      false;

  }

}


// ==================================================
// 10. REMOVE SELECTED IMAGE
// ==================================================

function removeSelectedImage() {

  selectedImageFile =
    null;


  if (previewObjectUrl) {

    URL.revokeObjectURL(
      previewObjectUrl
    );

    previewObjectUrl =
      null;

  }


  if (resourceImage) {

    resourceImage.value =
      "";

  }


  if (imagePreviewImg) {

    imagePreviewImg.src =
      "";

  }


  if (imageFileName) {

    imageFileName.textContent =
      "No image selected";

  }


  if (imagePreview) {

    imagePreview.hidden =
      true;

  }


  if (imageUploadArea) {

    imageUploadArea.hidden =
      false;

  }


  clearImageError();
}


// ==================================================
// 11. RESET IMAGE INPUT
// ==================================================

function resetImageInput() {

  selectedImageFile =
    null;


  if (resourceImage) {

    resourceImage.value =
      "";

  }


  if (imagePreview) {

    imagePreview.hidden =
      true;

  }


  if (imageUploadArea) {

    imageUploadArea.hidden =
      false;

  }


  if (imageFileName) {

    imageFileName.textContent =
      "No image selected";

  }


  if (imagePreviewImg) {

    imagePreviewImg.src =
      "";

  }


  if (previewObjectUrl) {

    URL.revokeObjectURL(
      previewObjectUrl
    );

    previewObjectUrl =
      null;

  }

}


// ==================================================
// 12. FORM SUBMISSION
// ==================================================

if (lendResourceForm) {

  lendResourceForm.addEventListener(
    "submit",
    handleFormSubmit
  );

}


async function handleFormSubmit(event) {

  event.preventDefault();


  clearErrors();

  hideFormMessage();


  // ----------------------------------------------
  // Get form values
  // ----------------------------------------------

  const title =
    resourceTitle.value.trim();


  const description =
    resourceDescription.value.trim();


  const category =
    resourceCategory.value;


  const location =
    resourceLocation.value.trim();


  // ----------------------------------------------
  // Validate form
  // ----------------------------------------------

  let isValid =
    true;


  if (!title) {

    showFieldError(
      resourceTitle,
      titleError,
      "Please enter a resource title."
    );


    isValid =
      false;

  }


  if (!description) {

    showFieldError(
      resourceDescription,
      descriptionError,
      "Please describe your resource."
    );


    isValid =
      false;

  }


  if (!category) {

    showFieldError(
      resourceCategory,
      categoryError,
      "Please select a category."
    );


    isValid =
      false;

  }


  // ----------------------------------------------
  // Validate selected image again
  // ----------------------------------------------

  if (selectedImageFile) {

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        selectedImageFile.type
      )
    ) {

      showFieldError(
        resourceImage,
        imageError,
        "Please select a JPG, PNG, or WEBP image."
      );


      isValid =
        false;
    }


    if (
      selectedImageFile.size >
      MAX_IMAGE_SIZE
    ) {

      showFieldError(
        resourceImage,
        imageError,
        "Image size must be 5 MB or smaller."
      );


      isValid =
        false;
    }

  }


  if (!isValid) {
    return;
  }


  // ----------------------------------------------
  // Get authenticated user
  // ----------------------------------------------

  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();


  if (userError || !user) {

    showFormMessage(
      "Your session has expired. Please log in again.",
      "error"
    );


    setTimeout(() => {

      window.location.href =
        "../Phase 1/login.html?redirect=" +
        encodeURIComponent(
          "../Phase 2/lend-resource.html"
        );

    }, 1200);


    return;
  }


  // ----------------------------------------------
  // Disable submit button
  // ----------------------------------------------

  submitResourceBtn.disabled =
    true;


  submitResourceBtn.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin"></i>
    Sharing...
  `;


  let uploadedFilePath =
    null;


  try {

    // ============================================
    // UPLOAD IMAGE
    // ============================================

    let imageUrl =
      null;


    if (selectedImageFile) {

      submitResourceBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Uploading Image...
      `;


      // ------------------------------------------
      // Get file extension
      // ------------------------------------------

      const fileExtension =
        getFileExtension(
          selectedImageFile
        );


      // ------------------------------------------
      // Generate unique filename
      // ------------------------------------------

      const uniqueFileName =
        `${crypto.randomUUID()}.${fileExtension}`;


      // ------------------------------------------
      // Store inside user's folder
      // ------------------------------------------

      uploadedFilePath =
        `${user.id}/${uniqueFileName}`;


      // ------------------------------------------
      // Upload to Supabase Storage
      // ------------------------------------------

      const {
        error: uploadError,
      } = await supabaseClient.storage
        .from(STORAGE_BUCKET)
        .upload(
          uploadedFilePath,
          selectedImageFile,
          {
            cacheControl: "3600",
            upsert: false,
            contentType:
              selectedImageFile.type,
          }
        );


      if (uploadError) {

        console.error(
          "Image upload error:",
          uploadError
        );


        throw new Error(
          "Unable to upload the image."
        );

      }


      // ------------------------------------------
      // Get public URL
      // ------------------------------------------

      const {
        data: publicUrlData,
      } =
        supabaseClient.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(
            uploadedFilePath
          );


      imageUrl =
        publicUrlData?.publicUrl ||
        null;


      if (!imageUrl) {

        throw new Error(
          "Unable to create image URL."
        );

      }

    }


    // ============================================
    // CREATE RESOURCE
    // ============================================

    submitResourceBtn.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      Saving Resource...
    `;


    const {
      data,
      error,
    } = await supabaseClient
      .from("resources")
      .insert({

        owner_id:
          user.id,

        title:
          title,

        description:
          description,

        category:
          category,

        location:
          location || null,

        image_url:
          imageUrl,

        available:
          true,

      })
      .select()
      .single();


    // ------------------------------------------
    // Database error
    // ------------------------------------------

    if (error) {

      console.error(
        "Resource creation error:",
        error
      );


      // ----------------------------------------
      // Delete uploaded image
      // ----------------------------------------

      if (uploadedFilePath) {

        const {
          error: deleteError,
        } =
          await supabaseClient.storage
            .from(STORAGE_BUCKET)
            .remove([
              uploadedFilePath
            ]);


        if (deleteError) {

          console.error(
            "Uploaded image cleanup error:",
            deleteError
          );

        }

      }


      throw new Error(
        "Unable to save your resource."
      );

    }


    // ============================================
    // SUCCESS
    // ============================================

    console.log(
      "Resource created successfully:",
      data
    );


    showFormMessage(
      "Your resource has been shared successfully!",
      "success"
    );


    submitResourceBtn.innerHTML = `
      <i class="fa-solid fa-check"></i>
      Shared Successfully
    `;


    // ------------------------------------------
    // Redirect to Explore
    // ------------------------------------------

    setTimeout(() => {

      window.location.href =
        "explore.html";

    }, 1000);


  } catch (error) {

    console.error(
      "Share resource error:",
      error
    );


    showFormMessage(
      error.message ||
        "Unable to share your resource right now. Please try again.",
      "error"
    );


    resetSubmitButton();

  }

}


// ==================================================
// 13. GET FILE EXTENSION
// ==================================================

function getFileExtension(file) {

  const type =
    file.type;


  switch (type) {

    case "image/jpeg":
      return "jpg";

    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    default:
      return "jpg";
  }

}


// ==================================================
// 14. FIELD ERROR
// ==================================================

function showFieldError(
  input,
  errorElement,
  message
) {

  const formGroup =
    input?.closest(
      ".form-group"
    );


  if (formGroup) {

    formGroup.classList.add(
      "has-error"
    );

  }


  if (errorElement) {

    errorElement.textContent =
      message;

  }

}


// ==================================================
// 15. CLEAR ERRORS
// ==================================================

function clearErrors() {

  document
    .querySelectorAll(
      ".form-group"
    )
    .forEach(
      (group) => {

        group.classList.remove(
          "has-error"
        );

      }
    );


  if (titleError) {
    titleError.textContent =
      "";
  }


  if (descriptionError) {
    descriptionError.textContent =
      "";
  }


  if (categoryError) {
    categoryError.textContent =
      "";
  }


  if (imageError) {
    imageError.textContent =
      "";
  }

}


// ==================================================
// 16. CLEAR IMAGE ERROR
// ==================================================

function clearImageError() {

  if (imageError) {

    imageError.textContent =
      "";

  }


  if (resourceImage) {

    const formGroup =
      resourceImage.closest(
        ".form-group"
      );


    if (formGroup) {

      formGroup.classList.remove(
        "has-error"
      );

    }

  }

}


// ==================================================
// 17. FORM MESSAGE
// ==================================================

function showFormMessage(
  message,
  type
) {

  if (!formMessage) {
    return;
  }


  formMessage.textContent =
    message;


  formMessage.className =
    `form-message ${type}`;

}


function hideFormMessage() {

  if (!formMessage) {
    return;
  }


  formMessage.textContent =
    "";


  formMessage.className =
    "form-message";

}


// ==================================================
// 18. RESET SUBMIT BUTTON
// ==================================================

function resetSubmitButton() {

  if (!submitResourceBtn) {
    return;
  }


  submitResourceBtn.disabled =
    false;


  submitResourceBtn.innerHTML = `
    <i class="fa-solid fa-hand-holding-heart"></i>
    Share Resource
  `;

}


// ==================================================
// 19. MOBILE NAVIGATION
// ==================================================

function setupMobileNavigation() {

  const menuBtn =
    document.getElementById(
      "menu-btn"
    );


  const navigation =
    document.getElementById(
      "primary-navigation"
    );


  if (
    !menuBtn ||
    !navigation
  ) {
    return;
  }


  menuBtn.addEventListener(
    "click",
    () => {

      const isOpen =
        navigation.classList.toggle(
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


      menuBtn.innerHTML =
        isOpen

          ? `
            <i class="fa-solid fa-xmark"></i>
          `

          : `
            <i class="fa-solid fa-bars"></i>
          `;

    }
  );

}


// ==================================================
// 20. HEADER SCROLL
// ==================================================

function setupHeaderScroll() {

  const header =
    document.getElementById(
      "header"
    );


  if (!header) {
    return;
  }


  function updateHeader() {

    if (
      window.scrollY > 10
    ) {

      header.classList.add(
        "scrolled"
      );

    } else {

      header.classList.remove(
        "scrolled"
      );

    }

  }


  window.addEventListener(
    "scroll",
    updateHeader
  );


  updateHeader();

}