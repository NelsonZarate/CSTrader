import {
  getMarketplace,
  createTrade,
  getToken,
  getUserByEmail,
  getUserMarketplace,
  removeSkin,
} from "./api.js";
import "./dropdown_style.js";
import "./main.js";

const container = document.getElementById("skin_display");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("search");
const filterType = document.getElementById("filter-type");
const filterSkin = document.getElementById("filter-skin");
const sortSelect = document.getElementById("sort");
const resetBtn = document.getElementById("reset");
const viewMySkinsBtn = document.getElementById("view_my_skins");

let skins = [];
let viewingMySkins = false;

function formatPrice(v) {
  return "€" + v.toFixed(2);
}

async function handleRemoveListing(skinId) {
  Swal.fire({
    title: "Remove listing?",
    text: "Are you sure you want to remove this item?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, remove",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await removeSkin(skinId);
        Swal.fire({
          title: "Removed!",
          text: "Your item has been removed.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        const mySkins = await getUserMarketplace();
        renderList(mySkins);
      } catch (err) {
        Swal.fire({
          title: "Error",
          text: err.message || "Failed to remove item.",
          icon: "error",
        });
      }
    }
  });
}

function openMarketModal(skin) {
  const modal = document.getElementById("modal-market");
  if (!modal) return;

  modal.querySelector(".skin-name").innerText = skin.name;
  modal.querySelector(".skin-sub").innerText = skin.float;
  modal.querySelector(".price").innerText = `Preço:${formatPrice(skin.value)}`;

  const img = modal.querySelector("#modalSkinImg");
  if (img) img.src = skin.link;

  modal.dataset.skin = JSON.stringify(skin);
  modal.style.display = "flex";
}

function setupModalEvents() {
  const modal = document.getElementById("modal-market");
  if (!modal) return;

  document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-cancel")) {
      const modal = e.target.closest(".modal-market");
      if (modal) modal.style.display = "none";
    }
  });

  document.addEventListener("click", async (e) => {
    if (e.target.matches(".btn-buynow-confirm")) {
      const modal = e.target.closest(".modal-market");
      if (!modal) return;

      const skin = JSON.parse(modal.dataset.skin);

      const token = getToken();
      const payload = JSON.parse(atob(token.split(".")[1]));
      const email = payload.sub;

      const user = await getUserByEmail(email);

      if (!skin) return console.error("Skin não encontrada no modal.");
      if (!user) return console.error("User não encontrado.");

      if (user.funds >= skin.value) {
        await createTrade(user.id, skin.id);
        Swal.fire({
          title: "Transaction Completed!",
          text: `Congratulations! The item ${skin.name} has been added to your collection.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: "elegant-success-popup" },
        }).then(() => {
          window.location.replace("../inventory/index.html");
        });
      } else {
        Swal.fire({
          title: "Insufficient Balance",
          text: `To acquire ${skin.name}, you need more funds. Would you like to top up now?`,
          icon: "error",
          confirmButtonText: "✅ Add Funds",
          timer: 5000,
          customClass: {
            confirmButton: "btn btn-primary",
            cancelButton: "btn btn-secondary",
          },
        }).then((result) => {
          if (result.isConfirmed)
            window.location.replace = "../wallet/index.html";
        });
      }
    }
  });
}

function renderList(list) {
  container.innerHTML = "";

  if (!list.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  const mappedList = list.map((s) => ({
    ...s,
    name: s.type ? `${s.type} ${s.name}` : s.name,
    float: s.float || s.float_value || "Unknown",
  }));

  mappedList.forEach((s, idx) => {
    const card = document.createElement("div");
    card.className = "skin-card";
    card.innerHTML = `
      <div><div class="skin-name">${s.name}</div></div>
      <div class="skin-thumb"><img src="${s.link}" alt="${s.name}"></div>
      <div><div class="skin-sub">${s.float}</div></div>
      <div class="skin-meta"><div class="price">€${s.value}</div></div>
      <div class="actions">
        ${
          viewingMySkins
            ? `<button class="btn remove-btn" data-id="${s.id}">Remove</button>`
            : `<button class="btn btn-buynow">Buy Now</button>`
        }
      </div>
    `;

    container.appendChild(card);

    if (viewingMySkins) {
      card
        .querySelector(".remove-btn")
        .addEventListener("click", () => handleRemoveListing(s.id));
    } else {
      card
        .querySelector(".btn-buynow")
        .addEventListener("click", () => handleBuyClick(s));
    }

    setTimeout(() => card.classList.add("visible"), 70 * idx);
  });
}

function handleBuyClick(skin) {
  const token = getToken();
  if (!token) {
    Swal.fire({
      title: "Login Required",
      text: "You must be logged in to buy items.",
      icon: "error",
    });
    return;
  }
  openMarketModal(skin);
}

function refreshCustomSelect(select) {
  const next = select.nextElementSibling;
  if (next && next.classList.contains("custom-select")) next.remove();
  delete select.dataset.enhanced;
  document.dispatchEvent(
    new CustomEvent("force-enhance-select", { detail: select })
  );
}

function populateDropdowns(skins) {
  const knifeTypes = [
    ...new Set(skins.map((s) => s.knifeType).filter(Boolean)),
  ].sort();
  const skinTypes = [
    ...new Set(skins.map((s) => s.skinType).filter(Boolean)),
  ].sort();

  filterType.innerHTML = `<option value="all">All knife types</option>`;
  knifeTypes.forEach((type) => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type;
    filterType.appendChild(opt);
  });

  filterSkin.innerHTML = `<option value="all">All finishes</option>`;
  skinTypes.forEach((finish) => {
    const opt = document.createElement("option");
    opt.value = finish;
    opt.textContent = finish;
    filterSkin.appendChild(opt);
  });

  refreshCustomSelect(filterType);
  refreshCustomSelect(filterSkin);
}

function normalizeFloat(f) {
  const map = {
    "factory new": "Factory New",
    "minimal wear": "Minimal Wear",
    "field-tested": "Field-Tested",
    "well-worn": "Well-Worn",
    "battle-scarred": "Battle-Scarred",
  };
  return map[f.toLowerCase()] || f;
}

function applyFilters() {
  if (viewingMySkins) return;

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

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterType.value = "all";
  filterSkin.value = "all";
  sortSelect.value = "default";
  applyFilters();
});

viewMySkinsBtn.addEventListener("click", async () => {
  viewingMySkins = !viewingMySkins;

  if (viewingMySkins) {
    const mySkins = await getUserMarketplace();
    renderList(mySkins);
    viewMySkinsBtn.innerText = "View all skins";
  } else {
    applyFilters();
    viewMySkinsBtn.innerText = "View my skins";
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  skins = await getMarketplace();
  populateDropdowns(skins);
  applyFilters();
  setupModalEvents();
});
