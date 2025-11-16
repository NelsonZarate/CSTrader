const API_BASE_URL = "http://localhost:8000";

// -----------------------------
// TOKEN
// -----------------------------
export function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// -----------------------------
// LOGIN
// -----------------------------
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Erro ao fazer login.");

  localStorage.setItem("token", data.access_token);
  return data;
}

// -----------------------------
// REGISTAR UTILIZADOR
// -----------------------------
export async function registerUser(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/register_user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      funds: 0,
      role: "player",
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Erro ao criar conta.");
  return data;
}

// -----------------------------
// GET USERS
// -----------------------------
export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/get_users`);
  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Erro ao obter utilizadores.");
  return data;
}

// -----------------------------
// GET USER BY EMAIL
// -----------------------------
export async function getUserByEmail(email) {
  const encoded = encodeURIComponent(email);
  const response = await fetch(`${API_BASE_URL}/get_user/${encoded}`);
  const data = await response.json();

  if (!response.ok) throw new Error(data.detail || "Erro ao buscar utilizador.");
  return data.user;
}

// -----------------------------
// /users/me  → GET MY DATA
// -----------------------------
export async function getMyData() {
  const response = await fetch(`${API_BASE_URL}/users/me`, {
    headers: authHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Erro ao obter os seus dados.");
  return data;
}

// -----------------------------
// LOGOUT
// -----------------------------
export function logoutUser() {
  localStorage.removeItem("token");
}

// -----------------------------
// /inventory → GET MY SKINS
// -----------------------------
export async function getMySkins() {
  const response = await fetch(`../marketplace_teste.json`, {
    headers: authHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Erro ao obter skins.");
  return data;
}

// -----------------------------
// /user/skins/{user_id} GET Skins por ID
// -----------------------------
export async function getUserSkinsById(userId) {
  const response = await fetch(`${API_BASE_URL}/user/skins/${userId}`, {
    headers: authHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Erro ao obter skins do utilizador.");
  return data;
}

// -----------------------------
// POST /admin/skins → Criar skin (ADMIN)
// -----------------------------
export async function adminCreateSkin(skinData) {
  const response = await fetch(`${API_BASE_URL}/admin/skins`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(skinData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Erro ao criar skin.");
  return data;
}

// -----------------------------
// PUT /admin/skin/edit/{skin_id} → Editar skin
// -----------------------------
export async function adminEditSkin(skinId, skinData) {
  const response = await fetch(`${API_BASE_URL}/admin/skin/edit/${skinId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(skinData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Erro ao editar skin.");
  return data;
}


// -----------------------------
// GET SKINS FOR MARKETPLACE
// -----------------------------
export async function getMarketplace() {
  const response = await fetch(`../marketplace_teste.json`, { /*Mudar Endpoint tomasssssss dps pedir ao nelson para criar o ENDPOINT*/
    method: "GET",
    headers: authHeaders(),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Falha ao buscar skins do marketplace.");
  return data;
}