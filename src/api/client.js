// src/api/client.js
export const client = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};

async function request(method, path, body) {
  const baseURL = import.meta.env.VITE_API_URL; // <<--- https://proyect-final-production.up.railway.app

  if (!baseURL) {
    console.error("❌ VITE_API_URL no está definida");
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${baseURL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "Error en la petición");
    throw new Error(msg);
  }

  // Si no hay JSON, devolvemos objeto vacío
  try {
    return await res.json();
  } catch {
    return {};
  }
}
