// src/api/client.js

const API_URL = import.meta.env.VITE_API_URL; 
// Ejemplo: https://flowy-api-production.up.railway.app

async function request(method, path, body = null) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const opts = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  const res = await fetch(`${API_URL}${path}`, opts);

  // Manejo de errores global
  if (!res.ok) {
    // token inválido o expirado
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      return;
    }

    let errorMsg = "Error en la petición";
    try {
      const json = await res.json();
      errorMsg = json.mensaje || JSON.stringify(json);
    } catch (err) {
      errorMsg = res.statusText;
    }

    throw new Error(errorMsg);
  }

  // Respuesta JSON o texto
  try {
    return await res.json();
  } catch {
    return await res.text();
  }
}

export const client = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path)
};
