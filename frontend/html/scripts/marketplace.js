import {
  getMarketplace,
  createTrade,
  getToken,
  getUserByEmail,
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

let skins = [];

function openMarketModal(skin) {
  const modal = document.getElementById("modal-market");
  if (!modal) return;

  modal.querySelector(".skin-name").innerText = skin.name;
  modal.querySelector(".skin-sub").innerText = skin.float;
  modal.querySelector(".price").innerText = `Preço: €${skin.value.toFixed(2)}`;

  const img = modal.querySelector("#modalSkinImg");
  if (img) img.src = skin.image;

  modal.dataset.skin = JSON.stringify(skin);

  modal.style.display = "flex";
}
function setupModalEvents() {
  const modal = document.getElementById("modal-market");
  if (!modal) return;

  // Cancelar modal
  document.addEventListener("click", (e) => {
    if (e.target.matches(".btn-cancel")) {
      const modal = e.target.closest(".modal-market");
      if (modal) modal.style.display = "none";
    }
  });

  // Confirmar compra
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
        const idUser = user.id;
        const idSkin = skin.id;
        await createTrade(idUser, idSkin);

        const modal = e.target.closest(".modal-market");
        if (modal) modal.style.display = "none";
        Swal.fire({
          title: "Transaction Completed!",
          text: `Congratulations! The item ${skin.name} has been added to your collection.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
          customClass: {
            popup: "elegant-success-popup",
          },
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
          if (result.isConfirmed) {
            window.location.replace = "#"; //mudar dpsssssssssssssssssssssssssssssssssssssss
          }
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

  list.forEach((s, idx) => {
    const card = document.createElement("div");
    card.className = "skin-card";

    card.innerHTML = `
      <div>
        <div class="skin-name">${s.name}</div>
      </div>
      <div class="skin-thumb"><img src="${s.image}" alt="${s.name}"></div>
      <div>
        <div class="skin-sub">${s.float}</div>
      </div>
      <div class="skin-meta">
        <div class="price">€${s.value.toFixed(2)}</div>
      </div>
      <div class="actions">
        <button class="btn btn-buynow">Buy Now</button>
      </div>
    `;

    container.appendChild(card);

    const btn = card.querySelector(".btn-buynow");
    if (btn) btn.addEventListener("click", () => openMarketModal(s));

    setTimeout(() => card.classList.add("visible"), 70 * idx);
  });
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

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterType.value = "all";
  filterSkin.value = "all";
  sortSelect.value = "default";
  applyFilters();
});

document.addEventListener("DOMContentLoaded", async () => {
  skins = await getMarketplace();
  applyFilters();
  setupModalEvents();
});
