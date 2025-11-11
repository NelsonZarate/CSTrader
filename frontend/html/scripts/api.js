const API_BASE_URL = "http://localhost:8000"; 

export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Erro ao fazer login.");

  localStorage.setItem("token", data.access_token);
  return data;
}

export async function registerUser(username, email, password, confirmPassword) {
  const response = await fetch(`${API_BASE_URL}/register_user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Erro ao criar conta.");

  return data;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logoutUser() {
  localStorage.removeItem("token");
}
