//import { fetchUser, updateNavbarState } from "./auth.js";

export async function loadNavbar() {
    const navbar = document.querySelector("#navbar");
    if (!navbar) return;

    try {
        const response = await fetch("../components/navbar.html");
        const html = await response.text();
        navbar.innerHTML = html;

        await fetchUser();
        updateNavbarState();
    } catch (err) {
        console.error("Erro ao carregar navbar:", err);
    }
}
