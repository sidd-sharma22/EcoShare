// ==========================================
// EcoShare Register JavaScript
// ==========================================

// ==========================================
// 1. GET HTML ELEMENTS
// ==========================================

const menuBtn = document.getElementById("menu-btn");

const navLinks = document.querySelector(".nav-links");

const registerPassword = document.getElementById("registerPassword");

const toggleRegisterPassword = document.getElementById(
  "toggleRegisterPassword",
);

const registerForm = document.getElementById("registerForm");

const registerMessage = document.getElementById("registerMessage");

const nameInput = document.getElementById("name");

const emailInput = document.getElementById("registerEmail");

const confirmPasswordInput = document.getElementById("confirmPassword");

const termsInput = document.getElementById("terms");

// ==========================================
// 2. MESSAGE HELPER
// ==========================================

function showRegisterMessage(text, type = "error") {
  if (!registerMessage) return;

  registerMessage.textContent = text;

  if (type === "success") {
    registerMessage.style.color = "#245501";
  } else {
    registerMessage.style.color = "#c62828";
  }
}

// ==========================================
// 3. MOBILE NAVIGATION
// ==========================================

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");

    menuBtn.setAttribute("aria-expanded", String(isOpen));

    menuBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu",
    );
  });

  // ------------------------------------------
  // CLOSE NAVIGATION AFTER CLICKING A LINK
  // ------------------------------------------

  const navigationLinks = navLinks.querySelectorAll("a");

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");

      menuBtn.setAttribute("aria-expanded", "false");

      menuBtn.setAttribute("aria-label", "Open navigation menu");
    });
  });
}

// ==========================================
// 4. PASSWORD TOGGLE
// ==========================================

if (registerPassword && toggleRegisterPassword) {
  toggleRegisterPassword.addEventListener("click", () => {
    const icon = toggleRegisterPassword.querySelector("i");

    const isPassword = registerPassword.type === "password";

    if (isPassword) {
      registerPassword.type = "text";

      if (icon) {
        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");
      }

      toggleRegisterPassword.setAttribute("aria-label", "Hide password");

      toggleRegisterPassword.setAttribute("aria-pressed", "true");
    } else {
      registerPassword.type = "password";

      if (icon) {
        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");
      }

      toggleRegisterPassword.setAttribute("aria-label", "Show password");

      toggleRegisterPassword.setAttribute("aria-pressed", "false");
    }
  });
}

// ==========================================
// 5. REGISTER FORM
// ==========================================

if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // --------------------------------------
    // GET FORM VALUES
    // --------------------------------------

    const name = nameInput ? nameInput.value.trim() : "";

    const email = emailInput ? emailInput.value.trim() : "";

    const password = registerPassword ? registerPassword.value : "";

    const confirmPassword = confirmPasswordInput
      ? confirmPasswordInput.value
      : "";

    const termsAccepted = termsInput ? termsInput.checked : false;

    // --------------------------------------
    // CLEAR PREVIOUS MESSAGE
    // --------------------------------------

    showRegisterMessage("");

    // --------------------------------------
    // NAME VALIDATION
    // --------------------------------------

    if (name === "") {
      showRegisterMessage("Please enter your full name.");

      if (nameInput) {
        nameInput.focus();
      }

      return;
    }

    // --------------------------------------
    // NAME LENGTH
    // --------------------------------------

    if (name.length < 2) {
      showRegisterMessage("Name must contain at least 2 characters.");

      if (nameInput) {
        nameInput.focus();
      }

      return;
    }

    // --------------------------------------
    // EMAIL VALIDATION
    // --------------------------------------

    if (email === "") {
      showRegisterMessage("Please enter your email address.");

      if (emailInput) {
        emailInput.focus();
      }

      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showRegisterMessage("Please enter a valid email address.");

      if (emailInput) {
        emailInput.focus();
      }

      return;
    }

    // --------------------------------------
    // PASSWORD LENGTH
    // --------------------------------------

    if (password.length < 8) {
      showRegisterMessage("Password must be at least 8 characters.");

      if (registerPassword) {
        registerPassword.focus();
      }

      return;
    }

    // --------------------------------------
    // PASSWORD CONFIRMATION
    // --------------------------------------

    if (confirmPassword === "") {
      showRegisterMessage("Please confirm your password.");

      if (confirmPasswordInput) {
        confirmPasswordInput.focus();
      }

      return;
    }

    if (password !== confirmPassword) {
      showRegisterMessage("Passwords do not match.");

      if (confirmPasswordInput) {
        confirmPasswordInput.focus();
      }

      return;
    }

    // --------------------------------------
    // TERMS
    // --------------------------------------

    if (!termsAccepted) {
      showRegisterMessage("Please agree to the Terms & Conditions.");

      if (termsInput) {
        termsInput.focus();
      }

      return;
    }

    // ======================================
    // REAL SUPABASE REGISTRATION
    // ======================================

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      showRegisterMessage(error.message);
      return;
    }

    if (data.user && !data.session) {
      showRegisterMessage(
        "Account created. Please check your email to verify your account.",
        "success",
      );

      registerForm.reset();
      return;
    }

    showRegisterMessage("Account created successfully.", "success");

    showRegisterMessage("Registration is not connected yet.", "error");
  });
}
