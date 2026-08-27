import apiClient from "./apiClient";

export const reviewsApi = {
  getAll: (productId) => apiClient.get(`/products/${productId}/reviews`),
  create: (productId, data) => apiClient.post(`/products/${productId}/reviews`, data),
  delete: (productId, reviewId) => apiClient.delete(`/products/${productId}/reviews/${reviewId}`),
};