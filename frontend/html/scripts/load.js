export async function loadNavbar() {
    const navbarContainer = document.getElementById("navbar");
    if (!navbarContainer) return;

    const response = await fetch("../components/navbar.html");
    const html = await response.text();
    navbarContainer.innerHTML = html;
}

export async function loadFilters() {
    const filterContainer = document.getElementById("filter_Container");
    if (!filterContainer) return;

    const response = await fetch("../components/filter.html");
    const html = await response.text();
    filterContainer.innerHTML = html;
}
