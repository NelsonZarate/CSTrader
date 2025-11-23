import { getMySkins, getToken, getUserByEmail,marketplaceAddSkin } from "./api.js";
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
    card.className = "skin-card flip-card";

    // flip inner container
    const inner = document.createElement("div");
    inner.className = "flip-inner";

    // FRONT
    const front = document.createElement("div");
    front.className = "flip-front";
    front.innerHTML = `
      <div class="skin-thumb"><img src="${s.link}" alt="${s.name}"></div>
      <div class="skin-info">
        <div class="skin-name">${s.name}</div>
        <div class="skin-sub">${s.float}</div>
      </div>
      <button class="btn btn-buynow">Sell Now</button>
    `;

    // BACK
    const back = document.createElement("div");
    back.className = "flip-back";
    back.innerHTML = `
      <div class="skin-name">${s.name}</div>
      <div class="skin-sub">Type: ${s.knifeType} | Finish: ${s.skinType} | Float: ${s.float}</div>
      <form class="sell-form">
        <input type="number" min="0" placeholder="Enter price" class="sell-value" required />
        <button type="submit" class="btn btn-sell">Sell</button>
        <button type="button" class="btn btn-cancel-back">Cancel</button>
      </form>
    `;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    container.appendChild(card);

    setTimeout(() => card.classList.add("visible"), 70 * idx);

    // Evento flip
    const sellNowBtn = front.querySelector(".btn-buynow");
    const cancelBtn = back.querySelector(".btn-cancel-back");

    sellNowBtn.addEventListener("click", () => card.classList.add("flipped"));
    cancelBtn.addEventListener("click", () => card.classList.remove("flipped"));

    // Evento do form de venda
    const form = back.querySelector(".sell-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const valueInput = back.querySelector(".sell-value");
      const price = parseFloat(valueInput.value);
      if (isNaN(price) || price <= 0) {
        alert("Please enter a valid price.");
        return;
      }
      const confirmSell = confirm(`Confirm sale of ${s.name} for ${price}?`);
      if (!confirmSell) return;

      try {
        await marketplaceAddSkin({ id: s.id, value: price });
        alert("Skin listed successfully!");
        location.reload();
      } catch (err) {
        console.error(err);
        alert("Failed to list skin. See console for details.");
      }
    });
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

