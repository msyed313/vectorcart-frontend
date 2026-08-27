import apiClient from "./apiClient";

export const cartApi = {
  get: () => apiClient.get("/cart"),
  addItem: (productId, quantity = 1) => apiClient.post("/cart/items", { productId, quantity }),
  updateItem: (cartItemId, quantity) => apiClient.put(`/cart/items/${cartItemId}`, { quantity }),
  removeItem: (cartItemId) => apiClient.delete(`/cart/items/${cartItemId}`),
};