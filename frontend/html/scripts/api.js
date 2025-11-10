const BASE_URL = "http://127.0.0.1:8000";

// Registrar usuário
export async function registerUser(data) {
  const response = await fetch(`${BASE_URL}/register_user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Login
export async function loginUser(data) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

// Pegar todos os usuários
export async function getUsers() {
  const response = await fetch(`${BASE_URL}/get_users`);
  return response.json();
}

// Pegar usuário por email
export async function getUser(email) {
  const response = await fetch(`${BASE_URL}/get_user/${encodeURIComponent(email)}`);
  return response.json();
}

// Pegar dados do usuário logado (usando token)
export async function getMyData(token) {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return response.json();
}
