const skins = [
    { id: 1, name: "Karambit Doppler", knifeType: "karambit", skinType: "doppler", value: 1230.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iUzv5mvOR7cDm7lA4i4AKJk4jxNWWebgAlA8dwQLMOshmwm9y0Puni5Qba3ohEni-r33xA7X5o4uZTV6ch5OSJ2C8W7sST" },
    { id: 2, name: "Butterfly Tiger Tooth", knifeType: "butterfly", skinType: "tiger tooth", value: 720.50, float: "Factory New", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2mv1edxtfNWQDuymxoijDGMnYftb3mfOg8hAsFzRrYCtxKxxtPlZOnl5gaM3ogQmX_7jnkdvHppseoGVvI7uvqAJhUGkWs/280x210" },
    { id: 3, name: "M9 Bayonet Marble Fade", knifeType: "m9 bayonet", skinType: "marble fade", value: 680.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWad_uN3ouNlSha1lBkijDGMnYftb3OTbVRyD8Z1RrNctkS6kobkZLzi7gTW2NpFxH33hi9Nuno65uxXAqs7uvqA7lyFHH4/280x210" },
    { id: 4, name: "Kukri Case Hardened", knifeType: "kukri", skinType: "case hardened", value: 540.00, float: "Field Tested", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q-vm8YZtsMc-cB2uVxdF6ueZhW2fizRsk4G_dzY39eCrCaA51W8QlF-ZZtRK6m4XlPunn71TbjY0QzimokGoXuR84GhWV/280x210" },
    { id: 5, name: "Karambit Doppler", knifeType: "karambit", skinType: "doppler", value: 1230.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iUzv5mvOR7cDm7lA4i4AKJk4jxNWWebgAlA8dwQLMOshmwm9y0Puni5Qba3ohEni-r33xA7X5o4uZTV6ch5OSJ2C8W7sST" },
    { id: 6, name: "Butterfly Tiger Tooth", knifeType: "butterfly", skinType: "tiger tooth", value: 720.50, float: "Factory New", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2mv1edxtfNWQDuymxoijDGMnYftb3mfOg8hAsFzRrYCtxKxxtPlZOnl5gaM3ogQmX_7jnkdvHppseoGVvI7uvqAJhUGkWs/280x210" },
    { id: 7, name: "M9 Bayonet Marble Fade", knifeType: "m9 bayonet", skinType: "marble fade", value: 680.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWad_uN3ouNlSha1lBkijDGMnYftb3OTbVRyD8Z1RrNctkS6kobkZLzi7gTW2NpFxH33hi9Nuno65uxXAqs7uvqA7lyFHH4/280x210" },
    { id: 8, name: "Kukri Case Hardened", knifeType: "kukri", skinType: "case hardened", value: 540.00, float: "Field Tested", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q-vm8YZtsMc-cB2uVxdF6ueZhW2fizRsk4G_dzY39eCrCaA51W8QlF-ZZtRK6m4XlPunn71TbjY0QzimokGoXuR84GhWV/280x210" },
    { id: 9, name: "Karambit Tiger Tooth", knifeType: "karambit", skinType: "tiger tooth", value: 899.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SAFiEyOlzot5mXSi9khgYvzSCkpu3eC3BbwUmCcMlQbMD4xG_w9zkPu7gsQXe2YJFzHqqjixL5ylr4ukAWb1lpPNV9oeSnQ" },
    { id: 10, name: "Karambit Tiger Tooth", knifeType: "karambit", skinType: "tiger tooth", value: 899.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SAFiEyOlzot5mXSi9khgYvzSCkpu3eC3BbwUmCcMlQbMD4xG_w9zkPu7gsQXe2YJFzHqqjixL5ylr4ukAWb1lpPNV9oeSnQ" },
    { id: 11, name: "Karambit Doppler", knifeType: "karambit", skinType: "doppler", value: 1230.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iUzv5mvOR7cDm7lA4i4AKJk4jxNWWebgAlA8dwQLMOshmwm9y0Puni5Qba3ohEni-r33xA7X5o4uZTV6ch5OSJ2C8W7sST" },
    { id: 12, name: "Butterfly Tiger Tooth", knifeType: "butterfly", skinType: "tiger tooth", value: 720.50, float: "Factory New", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2mv1edxtfNWQDuymxoijDGMnYftb3mfOg8hAsFzRrYCtxKxxtPlZOnl5gaM3ogQmX_7jnkdvHppseoGVvI7uvqAJhUGkWs/280x210" },
    { id: 13, name: "M9 Bayonet Marble Fade", knifeType: "m9 bayonet", skinType: "marble fade", value: 680.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWad_uN3ouNlSha1lBkijDGMnYftb3OTbVRyD8Z1RrNctkS6kobkZLzi7gTW2NpFxH33hi9Nuno65uxXAqs7uvqA7lyFHH4/280x210" },
    { id: 14, name: "Kukri Case Hardened", knifeType: "kukri", skinType: "case hardened", value: 540.00, float: "Field Tested", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q-vm8YZtsMc-cB2uVxdF6ueZhW2fizRsk4G_dzY39eCrCaA51W8QlF-ZZtRK6m4XlPunn71TbjY0QzimokGoXuR84GhWV/280x210" },
    { id: 15, name: "Karambit Doppler", knifeType: "karambit", skinType: "doppler", value: 1230.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iUzv5mvOR7cDm7lA4i4AKJk4jxNWWebgAlA8dwQLMOshmwm9y0Puni5Qba3ohEni-r33xA7X5o4uZTV6ch5OSJ2C8W7sST" },
    { id: 16, name: "Butterfly Tiger Tooth", knifeType: "butterfly", skinType: "tiger tooth", value: 720.50, float: "Factory New", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2mv1edxtfNWQDuymxoijDGMnYftb3mfOg8hAsFzRrYCtxKxxtPlZOnl5gaM3ogQmX_7jnkdvHppseoGVvI7uvqAJhUGkWs/280x210" },
    { id: 17, name: "M9 Bayonet Marble Fade", knifeType: "m9 bayonet", skinType: "marble fade", value: 680.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWad_uN3ouNlSha1lBkijDGMnYftb3OTbVRyD8Z1RrNctkS6kobkZLzi7gTW2NpFxH33hi9Nuno65uxXAqs7uvqA7lyFHH4/280x210" },
    { id: 18, name: "Kukri Case Hardened", knifeType: "kukri", skinType: "case hardened", value: 540.00, float: "Field Tested", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q-vm8YZtsMc-cB2uVxdF6ueZhW2fizRsk4G_dzY39eCrCaA51W8QlF-ZZtRK6m4XlPunn71TbjY0QzimokGoXuR84GhWV/280x210" },
    { id: 19, name: "Karambit Tiger Tooth", knifeType: "karambit", skinType: "tiger tooth", value: 899.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SAFiEyOlzot5mXSi9khgYvzSCkpu3eC3BbwUmCcMlQbMD4xG_w9zkPu7gsQXe2YJFzHqqjixL5ylr4ukAWb1lpPNV9oeSnQ" },
    { id: 20, name: "Karambit Tiger Tooth", knifeType: "karambit", skinType: "tiger tooth", value: 899.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SAFiEyOlzot5mXSi9khgYvzSCkpu3eC3BbwUmCcMlQbMD4xG_w9zkPu7gsQXe2YJFzHqqjixL5ylr4ukAWb1lpPNV9oeSnQ" },
    { id: 21, name: "Karambit Doppler", knifeType: "karambit", skinType: "doppler", value: 1230.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iUzv5mvOR7cDm7lA4i4AKJk4jxNWWebgAlA8dwQLMOshmwm9y0Puni5Qba3ohEni-r33xA7X5o4uZTV6ch5OSJ2C8W7sST" },
    { id: 22, name: "Butterfly Tiger Tooth", knifeType: "butterfly", skinType: "tiger tooth", value: 720.50, float: "Factory New", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2mv1edxtfNWQDuymxoijDGMnYftb3mfOg8hAsFzRrYCtxKxxtPlZOnl5gaM3ogQmX_7jnkdvHppseoGVvI7uvqAJhUGkWs/280x210" },
    { id: 23, name: "M9 Bayonet Marble Fade", knifeType: "m9 bayonet", skinType: "marble fade", value: 680.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWad_uN3ouNlSha1lBkijDGMnYftb3OTbVRyD8Z1RrNctkS6kobkZLzi7gTW2NpFxH33hi9Nuno65uxXAqs7uvqA7lyFHH4/280x210" },
    { id: 24, name: "Kukri Case Hardened", knifeType: "kukri", skinType: "case hardened", value: 540.00, float: "Field Tested", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q-vm8YZtsMc-cB2uVxdF6ueZhW2fizRsk4G_dzY39eCrCaA51W8QlF-ZZtRK6m4XlPunn71TbjY0QzimokGoXuR84GhWV/280x210" },
    { id: 25, name: "Karambit Doppler", knifeType: "karambit", skinType: "doppler", value: 1230.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SA1iUzv5mvOR7cDm7lA4i4AKJk4jxNWWebgAlA8dwQLMOshmwm9y0Puni5Qba3ohEni-r33xA7X5o4uZTV6ch5OSJ2C8W7sST" },
    { id: 26, name: "Butterfly Tiger Tooth", knifeType: "butterfly", skinType: "tiger tooth", value: 720.50, float: "Factory New", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2mv1edxtfNWQDuymxoijDGMnYftb3mfOg8hAsFzRrYCtxKxxtPlZOnl5gaM3ogQmX_7jnkdvHppseoGVvI7uvqAJhUGkWs/280x210" },
    { id: 27, name: "M9 Bayonet Marble Fade", knifeType: "m9 bayonet", skinType: "marble fade", value: 680.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWad_uN3ouNlSha1lBkijDGMnYftb3OTbVRyD8Z1RrNctkS6kobkZLzi7gTW2NpFxH33hi9Nuno65uxXAqs7uvqA7lyFHH4/280x210" },
    { id: 28, name: "Kukri Case Hardened", knifeType: "kukri", skinType: "case hardened", value: 540.00, float: "Field Tested", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q-vm8YZtsMc-cB2uVxdF6ueZhW2fizRsk4G_dzY39eCrCaA51W8QlF-ZZtRK6m4XlPunn71TbjY0QzimokGoXuR84GhWV/280x210" },
    { id: 29, name: "Karambit Tiger Tooth", knifeType: "karambit", skinType: "tiger tooth", value: 899.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SAFiEyOlzot5mXSi9khgYvzSCkpu3eC3BbwUmCcMlQbMD4xG_w9zkPu7gsQXe2YJFzHqqjixL5ylr4ukAWb1lpPNV9oeSnQ" },
    { id: 30, name: "Karambit Tiger Tooth", knifeType: "karambit", skinType: "tiger tooth", value: 899.00, float: "Minimal Wear", image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SAFiEyOlzot5mXSi9khgYvzSCkpu3eC3BbwUmCcMlQbMD4xG_w9zkPu7gsQXe2YJFzHqqjixL5ylr4ukAWb1lpPNV9oeSnQ" },
];

const container = document.getElementById("skin_display");
const empty = document.getElementById("empty");
const searchInput = document.getElementById("search");
const filterType = document.getElementById("filter-type");
const filterSkin = document.getElementById("filter-skin");
const sortSelect = document.getElementById("sort");

function formatPrice(v) {
    return "€" + v.toFixed(2);
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
        <button class="btn btn-trade">Trade</button>
        <button class="btn btn-sell">Sell</button>
      </div>
    `;

        container.appendChild(card);
        setTimeout(() => card.classList.add("visible"), 70 * idx);
    });
}

function applyFilters() {
    let out = skins.slice();
    const q = searchInput.value.toLowerCase();
    if (q) out = out.filter(s => (s.name + s.knifeType + s.skinType).toLowerCase().includes(q));

    if (filterType.value !== "all") out = out.filter(s => s.knifeType === filterType.value);
    if (filterSkin.value !== "all") out = out.filter(s => s.skinType === filterSkin.value);

    // Mapeamento da ordem dos floats do CS2
    const floatOrder = {
        "Factory New": 1,
        "Minimal Wear": 2,
        "Field-Tested": 3,
        "Well-Worn": 4,
        "Battle-Scarred": 5
    };

    function normalizeFloat(f) {
        const map = {
            "factory new": "Factory New",
            "minimal wear": "Minimal Wear",
            "field-tested": "Field-Tested",
            "filed tested": "Field-Tested", // corrigir erro comum
            "well-worn": "Well-Worn",
            "battle-scarred": "Battle-Scarred"
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


[searchInput, filterType, filterSkin, sortSelect].forEach(el =>
    el.addEventListener("input", applyFilters)
);

document.addEventListener("DOMContentLoaded", applyFilters);


// Select -> CustomSelect enhancer
(function () {
    function enhanceSelect(select) {
        if (select.dataset.enhanced) return;
        select.dataset.enhanced = "1";
        select.style.display = "none";

        const wrapper = document.createElement('div');
        wrapper.className = 'custom-select';
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');

        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = select.options[select.selectedIndex]?.text || '';

        const arrow = document.createElement('span');
        arrow.className = 'arrow';

        trigger.appendChild(label);
        trigger.appendChild(arrow);

        const optionsList = document.createElement('div');
        optionsList.className = 'custom-options';
        optionsList.setAttribute('role', 'listbox');

        // Construindo as opções do select
        Array.from(select.options).forEach((opt, idx) => {
            const item = document.createElement('div');
            item.className = 'custom-option';
            item.setAttribute('data-value', opt.value);
            item.setAttribute('role', 'option');
            item.textContent = opt.text;
            if (opt.disabled) item.setAttribute('aria-disabled', 'true');
            if (idx === select.selectedIndex) item.classList.add('selected');

            item.addEventListener('click', () => {
                select.value = opt.value;
                select.dispatchEvent(new Event('input', { bubbles: true }));
                select.dispatchEvent(new Event('change', { bubbles: true }));
                optionsList.querySelectorAll('.custom-option').forEach(o => o.classList.remove('selected'));
                item.classList.add('selected');
                label.textContent = opt.text;
                close();
            });

            optionsList.appendChild(item);
        });

        wrapper.appendChild(trigger);
        wrapper.appendChild(optionsList);
        select.parentNode.insertBefore(wrapper, select.nextSibling);

        function open() {
            wrapper.classList.add('open');
            trigger.setAttribute('aria-expanded', 'true');
            const sel = optionsList.querySelector('.custom-option.selected') || optionsList.querySelector('.custom-option');
            sel && sel.focus && sel.focus();
        }

        function close() {
            wrapper.classList.remove('open');
            trigger.setAttribute('aria-expanded', 'false');
        }

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (wrapper.classList.contains('open')) close();
            else open();
        });

        // Navegação por teclado
        let focusedIdx = -1;
        trigger.addEventListener('keydown', (e) => {
            const items = Array.from(optionsList.querySelectorAll('.custom-option'));
            if (!items.length) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!wrapper.classList.contains('open')) { open(); focusedIdx = 0; items[0].focus(); return; }
                focusedIdx = Math.min(items.length - 1, (focusedIdx < 0 ? 0 : focusedIdx + 1));
                items[focusedIdx].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!wrapper.classList.contains('open')) { open(); focusedIdx = items.length - 1; items[focusedIdx].focus(); return; }
                focusedIdx = Math.max(0, focusedIdx - 1);
                items[focusedIdx].focus();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!wrapper.classList.contains('open')) open();
                else {
                    const focused = document.activeElement;
                    focused && focused.classList.contains('custom-option') && focused.click();
                }
            } else if (e.key === 'Escape') {
                close();
                trigger.focus();
            }
        });

        // Garantir que cada opção seja focável para navegação por teclado
        optionsList.querySelectorAll('.custom-option').forEach((el) => {
            el.tabIndex = 0;
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
                if (e.key === 'Escape') { close(); trigger.focus(); }
                if (e.key === 'ArrowDown') { e.preventDefault(); const next = el.nextElementSibling; if (next) next.focus(); }
                if (e.key === 'ArrowUp') { e.preventDefault(); const prev = el.previousElementSibling; if (prev) prev.focus(); }
            });
        });

        // Fechar ao clicar fora do componente
        document.addEventListener('click', (ev) => {
            if (!wrapper.contains(ev.target)) close();
        });
    }

    // Aplica a melhoria em todos os selects com a classe .select
    document.querySelectorAll('select.select').forEach(enhanceSelect);
})();

