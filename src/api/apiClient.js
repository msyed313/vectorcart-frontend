const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7045/api";
const TOKEN_KEY = "vectorcart_token";
const USER_KEY = "vectorcart_user";

function buildHeaders(isFormData) {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";

  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

async function handleResponse(res) {
     if (res.status === 204) return null; 
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    // Token invalid/expired — clear local auth state so the UI stops
    // pretending the user is still logged in.
    if (res.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }

    // Thrown error carries `.response.data` so existing catch blocks
    // (err.response?.data) keep working without changes.
    const error = new Error(typeof data === "string" ? data : data?.message || "Request failed");
    error.response = { status: res.status, data };
    throw error;
  }

  return data;
}

const apiClient = {
  get: (endpoint) =>
    fetch(`${API_BASE_URL}${endpoint}`, { headers: buildHeaders() }).then(handleResponse),

  post: (endpoint, body, isFormData = false) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: buildHeaders(isFormData),
      body: isFormData ? body : JSON.stringify(body),
    }).then(handleResponse),

  put: (endpoint, body) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),
  delete: (endpoint) =>
  fetch(`${API_BASE_URL}${endpoint}`, { method: "DELETE", headers: buildHeaders() }).then(handleResponse),
};

export default apiClient;