const API_BASE_URL = "http://localhost:8000";

// LOGIN DE UTILIZADOR
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

// REGISTO DE NOVO UTILIZADOR
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


// OBTÉM DADOS DO UTILIZADOR POR EMAIL
export async function getUserByEmail(email) {
  const encodedEmail = encodeURIComponent(email);
  const response = await fetch(`${API_BASE_URL}/get_user/${encodedEmail}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erro ao buscar utilizador.");
  }

  return data.user;
}

// OBTÉM TOKEN DO UTILIZADOR ATUAL
export function getToken() {
  return localStorage.getItem("token");
}

// LOGOUT DO UTILIZADOR
export function logoutUser() {
  localStorage.removeItem("token");
}
