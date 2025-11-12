import { loadNavbar, updateNavbarState } from "./navbar.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadNavbar();
  updateNavbarState();
});
