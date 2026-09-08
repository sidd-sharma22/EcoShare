// ==========================================
// EcoShare - Shared Authentication UI
// ==========================================

(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", async () => {
    const buttons = document.querySelectorAll(".login-nav-btn");
    if (!buttons.length) return;

    try {
      const user = await window.EcoShareSupabase.getUser();

      buttons.forEach((button) => {
        if (!user) return;

        button.textContent = "Logout";
        button.href = "#";

        button.addEventListener("click", async (event) => {
          event.preventDefault();
          button.textContent = "Logging out...";

          const { error } = await window.EcoShareSupabase.signOut();

          if (error) {
            console.error("Logout failed:", error);
            button.textContent = "Logout";
            return;
          }

          window.location.href = "/Phase 1/index.html";
        });
      });
    } catch (error) {
      console.error("Authentication UI initialization failed:", error);
    }
  });
})();
