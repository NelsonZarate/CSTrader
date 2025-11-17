import { getMySkins } from "./api.js";
import "./dropdown_style.js"
import "./main.js"

// DOM elements
const container = document.getElementById("skin_display");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("search");
const filterType = document.getElementById("filter-type");
const filterSkin = document.getElementById("filter-skin");
const sortSelect = document.getElementById("sort");
const resetBtn = document.getElementById("reset");
const btnAdd = document.getElementById("btn-add");

// Drawer elements (substitui o modal)
const drawer = document.getElementById("drawer");
const drawerTitle = document.getElementById("drawer-title");
const drawerClose = document.getElementById("drawer-close");
const form = document.getElementById("skin-form");
const btnCancel = document.getElementById("btn-cancel");
const btnDelete = document.getElementById("btn-delete");
const btnSave = document.getElementById("btn-save");

const fType = document.getElementById("f-type");
const fSkin = document.getElementById("f-skin");
const fPrice = document.getElementById("f-price");
const fFloat = document.getElementById("f-float");
const fImage = document.getElementById("f-image");

let skins = [];

/* Utility functions */
function uid() {
  // simple uid for demo; replace with your server ids when using endpoints
  return Date.now() + Math.floor(Math.random() * 10000);
}

function formatPrice(v) {
  return "€" + v.toFixed(2);
}

function normalizeFloat(f) {
  const map = {
    "factory new": "Factory New",
    "minimal wear": "Minimal Wear",
    "field-tested": "Field-Tested",
    "filed tested": "Field-Tested",
    "well-worn": "Well-Worn",
    "battle-scarred": "Battle-Scarred"
  };
  return map[f.toLowerCase()] || f;
}

/* Drawer show/hide */
function showDrawer() {
  drawer.classList.add("active");
  drawer.setAttribute("aria-hidden", "false");
}

function hideDrawer() {
  drawer.classList.remove("active");
  drawer.setAttribute("aria-hidden", "true");
  // clear editing dataset if needed
  form.dataset.editing = "";
  btnDelete.style.display = "none";
}

/* Render list */
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
    card.dataset.id = s.id;

    // Create inner html with Edit and Delete buttons
    card.innerHTML = `
      <div>
        <div class="skin-name">${s.name}</div>
      </div>
      <div class="skin-thumb"><img src="${s.image}" alt="${s.name}"></div>
      <div>
        <div class="skin-sub">${s.float}</div>
      </div>
      <div class="skin-meta">
        <div class="price">${formatPrice(s.value)}</div>
      </div>
      <div class="actions">
        <button class="btn btn-edit" data-action="edit" data-id="${s.id}">Edit</button>
        <button class="btn btn-danger" data-action="delete" data-id="${s.id}">Delete</button>
      </div>
    `;
    container.appendChild(card);
    // small staggered animation
    setTimeout(() => card.classList.add("visible"), 70 * idx);
  });
}

/* Filters/sorting */
function applyFilters() {
  let out = skins.slice();
  const q = (searchInput.value || "").toLowerCase();
  if (q) out = out.filter(s => (s.name + s.knifeType + s.skinType).toLowerCase().includes(q));

  if (filterType.value !== "all") out = out.filter(s => s.knifeType === filterType.value);
  if (filterSkin.value !== "all") out = out.filter(s => s.skinType === filterSkin.value);

  const floatOrder = {
    "Factory New": 1,
    "Minimal Wear": 2,
    "Field-Tested": 3,
    "Well-Worn": 4,
    "Battle-Scarred": 5
  };

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
      out.forEach(s => s.float = normalizeFloat(s.float));
      out.sort((a, b) => (floatOrder[a.float] || 99) - (floatOrder[b.float] || 99));
      break;
    case "float-desc":
      out.forEach(s => s.float = normalizeFloat(s.float));
      out.sort((a, b) => (floatOrder[b.float] || 99) - (floatOrder[a.float] || 99));
      break;
  }

  renderList(out);
}

/* Open drawer for adding */
function openAdd() {
  drawerTitle.textContent = "Adicionar Skin";
  form.dataset.editing = "";
  btnDelete.style.display = "none";
  fType.value = "";
  fSkin.value = "";
  fPrice.value = "";
  fFloat.value = "";
  fImage.value = "";
  showDrawer();
}

/* Open drawer for editing */
function openEdit(id) {
  const s = skins.find(x => String(x.id) === String(id));
  if (!s) return alert("Skin não encontrada");
  drawerTitle.textContent = "Editar Skin";
  form.dataset.editing = s.id;
  btnDelete.style.display = "";
  fType.value = s.knifeType;
  fSkin.value = s.skinType;
  fPrice.value = s.value;
  fFloat.value = s.float;
  fImage.value = s.image;
  showDrawer();
}

/* Delete (client-side) */
function doDelete(id) {
  if (!confirm("Tens a certeza que queres eliminar esta skin?")) return;
  skins = skins.filter((s) => String(s.id) !== String(id));
  applyFilters();
}

/* Form submit (save new or edit) */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const knifeType = fType.value.trim();
  const skinType = fSkin.value.trim();
  const name = `${knifeType.charAt(0).toUpperCase() + knifeType.slice(1)} ${skinType.charAt(0).toUpperCase() + skinType.slice(1)}`;

  const payload = {
    id: form.dataset.editing ? Number(form.dataset.editing) : uid(),
    name,
    knifeType,
    skinType,
    value: Number(fPrice.value) || 0,
    float: normalizeFloat(fFloat.value.trim()),
    image: fImage.value.trim(),
  };

  if (form.dataset.editing) {
    skins = skins.map((s) => (s.id === payload.id ? payload : s));
  } else {
    skins.unshift(payload);
  }

  hideDrawer();
  applyFilters();
});

/* Drawer buttons */
btnAdd.addEventListener("click", openAdd);
drawerClose.addEventListener("click", hideDrawer);
btnCancel.addEventListener("click", hideDrawer);

/* Delete from drawer (when editing) */
btnDelete.addEventListener("click", () => {
  const id = form.dataset.editing;
  if (!id) return;
  if (!confirm("Eliminar esta skin?")) return;
  skins = skins.filter((s) => String(s.id) !== String(id));
  hideDrawer();
  applyFilters();
});

/* Delegated click handler for edit/delete buttons in cards */
container.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if (!action) return;

  if (action === "edit") {
    openEdit(id);
  } else if (action === "delete") {
    doDelete(id);
  }
});

/* Filters */
[searchInput, filterType, filterSkin, sortSelect].forEach(el =>
  el.addEventListener("input", applyFilters)
);

/* Load initial skins */
document.addEventListener("DOMContentLoaded", async () => {
  try {
    skins = await getMySkins();
    applyFilters();
  } catch (err) {
    console.error("Erro ao buscar skins:", err);
    empty.style.display = "block";
    empty.textContent = "Não foi possível carregar as skins.";
  }
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterType.value = "all";
  filterSkin.value = "all";
  sortSelect.value = "default";
  applyFilters();
});
