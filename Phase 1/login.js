// ==========================================
// EcoShare - Login
// ==========================================

(() => {
  "use strict";

  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const message = document.getElementById("message");
  const forgotPassword = document.getElementById("forgotPassword");

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
    togglePassword.textContent = visible ? "Show" : "Hide";
  });

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const submit = form.querySelector('button[type="submit"]');

    showMessage("");

    if (!validEmail(email)) {
      showMessage("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    if (!password) {
      showMessage("Please enter your password.");
      passwordInput.focus();
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.textContent = "Logging in...";
    }

    try {
      const { error } = await window.EcoShareSupabase.signIn(email, password);
      if (error) throw error;

      showMessage("Login successful. Redirecting...", "success");

      const redirect = new URLSearchParams(window.location.search).get("redirect");
      window.setTimeout(() => {
        window.location.href = redirect || "/Phase 1/index.html";
      }, 350);
    } catch (error) {
      console.error("Login failed:", error);
      showMessage(error.message || "Unable to log in. Please check your credentials.");

      if (submit) {
        submit.disabled = false;
        submit.textContent = "Login";
      }
    }
  });

  forgotPassword?.addEventListener("click", async (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!validEmail(email)) {
      showMessage("Enter a valid email address first.");
      emailInput.focus();
      return;
    }

    try {
      const { error } = await window.EcoShareSupabase.resetPassword(email);
      if (error) throw error;
      showMessage("Password reset instructions have been sent to your email.", "success");
    } catch (error) {
      console.error("Password reset failed:", error);
      showMessage(error.message || "Unable to send password reset email.");
    }
  });
})();
