import apiClient from "./apiClient";

export const ordersApi = {
  getAll: () => apiClient.get("/orders"),
  getById: (id) => apiClient.get(`/orders/${id}`),
  checkout: (shippingAddress) => apiClient.post("/orders/checkout", { shippingAddress }),
  // Add these methods to the existing ordersApi object
getAllAdmin: () => apiClient.get("/orders/admin/all"),
updateStatus: (id, status) => apiClient.put(`/orders/${id}/status`, { status }),
};