import { getUser } from "./api.js";

let currentUser = null;

/** Busca o utilizador logado (do backend ou token) */
export async function fetchUser() {
  try {
    currentUser = await getUser();
  } catch (err) {
    console.error("Erro ao obter dados do utilizador:", err);
    currentUser = null;
  }
  return currentUser;
}

/** Verifica se há utilizador logado */
export function isUserLoggedIn() {
  return currentUser !== null;
}

/** Retorna os dados do utilizador logado */
export function getCurrentUser() {
  return currentUser;
}

/** Termina a sessão do utilizador e remove o token */
export function logout() {
  currentUser = null;
  localStorage.removeItem("token");
}

/** Atualiza a navbar de acordo com o estado do utilizador */
export async function updateNavbarState() {
  const loggedOut = document.querySelector(".logged-out");
  const loggedIn = document.querySelector(".logged-in");
  const userName = document.querySelector(".user-name");

  if (!loggedOut || !loggedIn) return;

  if (isUserLoggedIn()) {
    loggedOut.style.display = "none";
    loggedIn.style.display = "flex";
    userName.textContent = currentUser?.name || "Utilizador";
  } else {
    loggedOut.style.display = "flex";
    loggedIn.style.display = "none";
  }

  const logoutButton = document.querySelector(".logout-button");
  if (logoutButton && !logoutButton.dataset.listenerAdded) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
      updateNavbarState();
    });
    logoutButton.dataset.listenerAdded = "true"; // evita múltiplos listeners
  }
}

/** Carrega a navbar como componente e atualiza o estado do utilizador */
export async function loadNavbar() {
  const navbar = document.querySelector("#navbar");
  if (!navbar) return;

  try {
    const response = await fetch("../components/navbar.html");
    const html = await response.text();
    navbar.innerHTML = html;

    await fetchUser();          // obter utilizador logado
    await updateNavbarState();  // atualizar a navbar
  } catch (err) {
    console.error("Erro ao carregar a navbar:", err);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  loadNavbar();
});
