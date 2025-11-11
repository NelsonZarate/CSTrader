import { getToken, logoutUser } from "./api.js";

export async function loadNavbar() {
  const navbarContainer = document.getElementById("navbar");
  if (!navbarContainer) return;

  const response = await fetch("./components/navbar.html");
  const html = await response.text();
  navbarContainer.innerHTML = html;
}

export function updateNavbarState() {
  const loggedOut = document.querySelector(".logged-out");
  const loggedIn = document.querySelector(".logged-in");
  const userNameEl = document.querySelector(".user-name");
  const logoutBtn = document.querySelector(".logout-button");

  const token = getToken();

  if (token) {
    if (loggedOut) loggedOut.style.display = "none";
    if (loggedIn) loggedIn.style.display = "flex";

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userNameEl.textContent = payload.username || "User";
    } catch {
      userNameEl.textContent = "User";
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        logoutUser();
        location.reload();
      });
    }
  } else {
    if (loggedOut) loggedOut.style.display = "flex";
    if (loggedIn) loggedIn.style.display = "none";
  }
}
