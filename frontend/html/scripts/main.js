import { updateNavbarState } from "./navbar.js";
import { loadFilters, loadNavbar } from "./load.js";


document.addEventListener("DOMContentLoaded", async () => {
  await loadNavbar();
  updateNavbarState();

  if (window.location.pathname.includes('/Marketplace/')) {
      await loadFilters();
  }
});
