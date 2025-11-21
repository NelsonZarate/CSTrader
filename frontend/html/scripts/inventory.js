import { getMySkins, getToken, getUserByEmail } from "./api.js";
import "./dropdown_style.js";
import "./main.js";

const container = document.getElementById("skin_display");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("search");
const filterType = document.getElementById("filter-type");
const filterSkin = document.getElementById("filter-skin");
const sortSelect = document.getElementById("sort");
const resetBtn = document.getElementById("reset");

let skins = [];

function renderList(list) {
  container.innerHTML = "";
  if (!list.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  list.forEach((s, idx) => {
    const card = document.createElement("div");
    card.className = "skin-card";

    card.innerHTML = `
        <div>
          <div class="skin-name">${s.name}</div>
        </div>
      <div class="skin-thumb"><img src="${s.link}" alt="${s.name}"></div>
      <div>
        <div class="skin-sub">${s.float}</div>
      </div>
      <div class="actions">
        <button class="btn btn-buynow">Sell Now</button>
      </div>
    `;

    container.appendChild(card);
    setTimeout(() => card.classList.add("visible"), 70 * idx);
  });
}

function refreshCustomSelect(select) {
  const next = select.nextElementSibling;
  if (next && next.classList.contains("custom-select")) {
    next.remove();
  }

  delete select.dataset.enhanced;

  document.dispatchEvent(
    new CustomEvent("force-enhance-select", { detail: select })
  );
}



function populateDropdowns(skins) {
  const knifeTypes = [...new Set(skins.map(s => s.knifeType).filter(Boolean))].sort();
  const skinTypes = [...new Set(skins.map(s => s.skinType).filter(Boolean))].sort();

  filterType.innerHTML = `<option value="all">All knife types</option>`;
  knifeTypes.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    filterType.appendChild(opt);
  });

  filterSkin.innerHTML = `<option value="all">All finishes</option>`;
  skinTypes.forEach(finish => {
    const opt = document.createElement("option");
    opt.value = finish;
    opt.textContent = finish;
    filterSkin.appendChild(opt);
  });

  // 🔥 IMPORTANTE (tal como faz o skin_management)
  refreshCustomSelect(filterType);
  refreshCustomSelect(filterSkin);
}



function applyFilters() {
  let out = skins.slice();
  const q = searchInput.value.toLowerCase();
  if (q)
    out = out.filter((s) =>
      (s.name + s.knifeType + s.skinType).toLowerCase().includes(q)
    );

  if (filterType.value !== "all")
    out = out.filter((s) => s.knifeType === filterType.value);
  if (filterSkin.value !== "all")
    out = out.filter((s) => s.skinType === filterSkin.value);

  const floatOrder = {
    "Factory New": 1,
    "Minimal Wear": 2,
    "Field-Tested": 3,
    "Well-Worn": 4,
    "Battle-Scarred": 5,
  };

  function normalizeFloat(f) {
    const map = {
      "factory new": "Factory New",
      "minimal wear": "Minimal Wear",
      "field-tested": "Field-Tested",
      "filed tested": "Field-Tested",
      "well-worn": "Well-Worn",
      "battle-scarred": "Battle-Scarred",
    };
    return map[f.toLowerCase()] || f;
  }

  switch (sortSelect.value) {
    case "name-asc":
      out.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      out.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price-asc":
      out.sort((a, b) => a.value - b.value);
      break;
    case "price-desc":
      out.sort((a, b) => b.value - a.value);
      break;
    case "float-asc":
      out.forEach((s) => (s.float = normalizeFloat(s.float)));
      out.sort(
        (a, b) => (floatOrder[a.float] || 99) - (floatOrder[b.float] || 99)
      );
      break;
    case "float-desc":
      out.forEach((s) => (s.float = normalizeFloat(s.float)));
      out.sort(
        (a, b) => (floatOrder[b.float] || 99) - (floatOrder[a.float] || 99)
      );
      break;
  }

  renderList(out);
}

[searchInput, filterType, filterSkin, sortSelect].forEach((el) =>
  el.addEventListener("input", applyFilters)
);

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = getToken();

    if (!token) {
      empty.style.display = "block";
      empty.textContent = "You must be logged in to view your inventory.";
      container.innerHTML = "";
      return;
    }

    let payload;
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch (err) {
      empty.style.display = "block";
      empty.textContent = "Invalid session. Please log in again.";
      container.innerHTML = "";
      return;
    }

    const email = payload.sub;
    const user = await getUserByEmail(email);

    if (!user || !user.email) {
      empty.style.display = "block";
      empty.textContent = "You must be logged in to view your inventory.";
      container.innerHTML = "";
      return;
    }

    skins = await getMySkins();
    populateDropdowns(skins);  // <- CUIDADO: esta é a nova linha
    applyFilters();

  } catch (err) {
    console.error("Authentication error:", err);
    empty.style.display = "block";
    empty.textContent = "Unable to load your skins.";
  }
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterType.value = "all";
  filterSkin.value = "all";
  sortSelect.value = "default";

  applyFilters();
});
