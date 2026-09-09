// ==========================================
// EcoShare Login JavaScript
// ==========================================

// ==========================================
// 1. GET HTML ELEMENTS
// ==========================================

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const togglePassword = document.getElementById("togglePassword");

const message = document.getElementById("message");

const forgotPassword = document.getElementById("forgotPassword");

// ==========================================
// 2. MESSAGE HELPER
// ==========================================

function showMessage(text, type = "error") {
  if (!message) return;

  message.textContent = text;

  if (type === "success") {
    message.style.color = "#245501";
  } else {
    message.style.color = "#c62828";
  }
}

// ==========================================
// 3. SHOW / HIDE PASSWORD
// ==========================================

if (togglePassword && passwordInput) {
  togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";

    if (isPassword) {
      passwordInput.type = "text";

      togglePassword.textContent = "Hide";

      togglePassword.setAttribute("aria-label", "Hide password");
    } else {
      passwordInput.type = "password";

      togglePassword.textContent = "Show";

      togglePassword.setAttribute("aria-label", "Show password");
    }
  });
}

// ==========================================
// 4. LOGIN
// ==========================================

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // --------------------------------------
    // GET VALUES
    // --------------------------------------

    const email = emailInput ? emailInput.value.trim() : "";

    const password = passwordInput ? passwordInput.value : "";

    // --------------------------------------
    // CLEAR PREVIOUS MESSAGE
    // --------------------------------------

    showMessage("");

    // --------------------------------------
    // VALIDATE EMAIL
    // --------------------------------------

    if (email === "") {
      showMessage("Please enter your email address.");

      if (emailInput) {
        emailInput.focus();
      }

      return;
    }

    // --------------------------------------
    // VALIDATE PASSWORD
    // --------------------------------------

    if (password === "") {
      showMessage("Please enter your password.");

      if (passwordInput) {
        passwordInput.focus();
      }

      return;
    }

    // --------------------------------------
    // BASIC EMAIL VALIDATION
    // --------------------------------------

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showMessage("Please enter a valid email address.");

      if (emailInput) {
        emailInput.focus();
      }

      return;
    }

    // --------------------------------------
    // REAL SUPABASE LOGIN
    // --------------------------------------

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showMessage(error.message);
      return;
    }

    if (!data.session) {
      showMessage("Login failed. Please try again.");
      return;
    }

    showMessage("Login successful.", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  });
}

// ==========================================
// 5. FORGOT PASSWORD
// ==========================================

if (forgotPassword) {
  forgotPassword.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = emailInput ? emailInput.value.trim() : "";

    // --------------------------------------
    // EMAIL REQUIRED
    // --------------------------------------

    if (email === "") {
      showMessage("Enter your email address first.");

      if (emailInput) {
        emailInput.focus();
      }

      return;
    }

    // --------------------------------------
    // BASIC EMAIL VALIDATION
    // --------------------------------------

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showMessage("Please enter a valid email address.");

      if (emailInput) {
        emailInput.focus();
      }

      return;
    }

    // --------------------------------------
    // REAL SUPABASE PASSWORD RESET
    // --------------------------------------

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);

    if (error) {
      showMessage(error.message);
      return;
    }

    showMessage("Password reset link has been sent to your email.", "success");
  });
}
