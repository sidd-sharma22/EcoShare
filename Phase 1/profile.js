// ==========================================
// EcoShare Profile
// ==========================================

// ==========================================
// GET HTML ELEMENTS
// ==========================================

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileRole = document.getElementById("profileRole");

const profileForm = document.getElementById("profileForm");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const roleInput = document.getElementById("role");
const locationInput = document.getElementById("location");
const bioInput = document.getElementById("bio");

const bioCount = document.getElementById("bioCount");

const profileMessage = document.getElementById("profileMessage");

const saveProfileButton = document.getElementById("saveProfileButton");

const logoutButton = document.getElementById("logoutButton");

// ==========================================
// SHOW MESSAGE
// ==========================================

function showProfileMessage(message, type = "error") {
  if (!profileMessage) {
    return;
  }

  profileMessage.textContent = message;
  profileMessage.className = `profile-message ${type}`;

  profileMessage.hidden = false;
}

// ==========================================
// HIDE MESSAGE
// ==========================================

function hideProfileMessage() {
  if (!profileMessage) {
    return;
  }

  profileMessage.hidden = true;
  profileMessage.textContent = "";
  profileMessage.className = "profile-message";
}

// ==========================================
// UPDATE BIO CHARACTER COUNT
// ==========================================

function updateBioCount() {
  if (!bioInput || !bioCount) {
    return;
  }

  bioCount.textContent = bioInput.value.length;
}

bioInput.addEventListener("input", updateBioCount);

// ==========================================
// LOAD PROFILE
// ==========================================

async function loadProfile() {
  hideProfileMessage();

  /*
   * getUser() asks Supabase for the authenticated
   * user rather than trusting information supplied
   * by the browser.
   */
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  // ------------------------------------------
  // NOT LOGGED IN
  // ------------------------------------------

  if (userError || !user) {
    window.location.href = "login.html?redirect=profile.html";

    return;
  }

  // ------------------------------------------
  // LOAD PROFILE FROM DATABASE
  // ------------------------------------------

  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("id, full_name, email, role, location, bio, avatar_url")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error("Profile loading error:", profileError);

    showProfileMessage("Unable to load your profile. Please try again.");

    return;
  }

  // ------------------------------------------
  // DISPLAY PROFILE
  // ------------------------------------------

  const displayName = profile.full_name || "EcoShare User";

  const displayEmail = profile.email || user.email || "";

  const displayRole = profile.role || "user";

  profileName.textContent = displayName;

  profileEmail.textContent = displayEmail;

  profileRole.textContent = displayRole;

  // ------------------------------------------
  // FILL FORM
  // ------------------------------------------

  fullNameInput.value = profile.full_name || "";

  emailInput.value = displayEmail;

  roleInput.value = displayRole;

  locationInput.value = profile.location || "";

  bioInput.value = profile.bio || "";

  updateBioCount();
}

// ==========================================
// SAVE PROFILE
// ==========================================

async function saveProfile(event) {
  event.preventDefault();

  hideProfileMessage();

  // ------------------------------------------
  // GET CURRENT AUTHENTICATED USER
  // ------------------------------------------

  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    window.location.href = "login.html?redirect=profile.html";

    return;
  }

  // ------------------------------------------
  // GET FORM VALUES
  // ------------------------------------------

  const fullName = fullNameInput.value.trim();

  const location = locationInput.value.trim();

  const bio = bioInput.value.trim();

  // ------------------------------------------
  // VALIDATION
  // ------------------------------------------

  if (!fullName) {
    showProfileMessage("Please enter your full name.");

    fullNameInput.focus();

    return;
  }

  if (fullName.length > 100) {
    showProfileMessage("Full name must be 100 characters or less.");

    fullNameInput.focus();

    return;
  }

  if (location.length > 100) {
    showProfileMessage("Location must be 100 characters or less.");

    locationInput.focus();

    return;
  }

  if (bio.length > 300) {
    showProfileMessage("Bio must be 300 characters or less.");

    bioInput.focus();

    return;
  }

  // ------------------------------------------
  // DISABLE BUTTON
  // ------------------------------------------

  saveProfileButton.disabled = true;

  saveProfileButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Saving...
    `;

  // ------------------------------------------
  // UPDATE DATABASE
  // ------------------------------------------
  /*
   * IMPORTANT:
   *
   * We deliberately do NOT update:
   * - id
   * - email
   * - role
   *
   * The user can only modify their personal
   * profile information.
   */

  const { error: updateError } = await supabaseClient
    .from("profiles")
    .update({
      full_name: fullName,
      location: location || null,
      bio: bio || null,
    })
    .eq("id", user.id);

  // ------------------------------------------
  // HANDLE ERROR
  // ------------------------------------------

  if (updateError) {
    console.error("Profile update error:", updateError);

    showProfileMessage(updateError.message || "Unable to update your profile.");

    saveProfileButton.disabled = false;

    saveProfileButton.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Save Changes
        `;

    return;
  }

  // ------------------------------------------
  // SUCCESS
  // ------------------------------------------

  profileName.textContent = fullName;

  showProfileMessage("Profile updated successfully.", "success");

  // ------------------------------------------
  // RESTORE BUTTON
  // ------------------------------------------

  saveProfileButton.disabled = false;

  saveProfileButton.innerHTML = `
        <i class="fa-solid fa-floppy-disk"></i>
        Save Changes
    `;
}

// ==========================================
// LOGOUT
// ==========================================

async function logout() {
  logoutButton.disabled = true;

  logoutButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Logging out...
    `;

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error("Logout error:", error);

    showProfileMessage(error.message || "Unable to logout. Please try again.");

    logoutButton.disabled = false;

    logoutButton.innerHTML = `
            <i class="fa-solid fa-right-from-bracket"></i>
            Logout
        `;

    return;
  }

  // ------------------------------------------
  // REDIRECT AFTER LOGOUT
  // ------------------------------------------

  window.location.href = "index.html";
}

// ==========================================
// EVENT LISTENERS
// ==========================================

profileForm.addEventListener("submit", saveProfile);

logoutButton.addEventListener("click", logout);

// ==========================================
// INITIAL LOAD
// ==========================================

loadProfile();
