// ==========================================
// EcoShare - Registration
// ==========================================

(() => {
  "use strict";

  const form = document.getElementById("registerForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("registerEmail");
  const passwordInput = document.getElementById("registerPassword");
  const confirmInput = document.getElementById("confirmPassword");
  const termsInput = document.getElementById("terms");
  const togglePassword = document.getElementById("toggleRegisterPassword");
  const message = document.getElementById("registerMessage");

  function showMessage(text, type = "error") {
    if (!message) return;
    message.textContent = text;
    message.style.color = type === "success" ? "var(--color-success, #2e7d32)" : "var(--color-error, #c62828)";
  }

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  togglePassword?.addEventListener("click", () => {
    const visible = passwordInput.type === "text";
    passwordInput.type = visible ? "password" : "text";
    togglePassword.setAttribute("aria-pressed", String(!visible));
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirm = confirmInput.value;
    const submit = form.querySelector('button[type="submit"]');

    showMessage("");

    if (name.length < 2) {
      showMessage("Please enter your full name.");
      nameInput.focus();
      return;
    }

    if (!validEmail(email)) {
      showMessage("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    if (password.length < 6) {
      showMessage("Password must contain at least 6 characters.");
      passwordInput.focus();
      return;
    }

    if (password !== confirm) {
      showMessage("Passwords do not match.");
      confirmInput.focus();
      return;
    }

    if (!termsInput.checked) {
      showMessage("Please agree to the Terms & Conditions.");
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = "Creating Account...";
    }

    try {
      const { data, error } = await window.EcoShareSupabase.signUp(email, password, name);
      if (error) throw error;

      if (data.session) {
        showMessage("Account created. Redirecting...", "success");
        window.setTimeout(() => {
          window.location.href = "/Phase 1/index.html";
        }, 350);
      } else {
        showMessage("Account created. Check your email to confirm your account.", "success");
        if (submit) {
          submit.disabled = false;
          submit.textContent = "Create Account";
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
      showMessage(error.message || "Unable to create your account.");
      if (submit) {
        submit.disabled = false;
        submit.textContent = "Create Account";
      }
    }
  });
})();
