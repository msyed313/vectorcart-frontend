import apiClient from "./apiClient";

export const productsApi = {
  getPaged: (params) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ).toString();
    return apiClient.get(`/products?${query}`);
  },
  getById: (id) => apiClient.get(`/products/${id}`),
  create: (data) => apiClient.post("/products", data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`),
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post(`/products/${id}/image`, formData, true);
  },
  // Add these methods to the existing productsApi object
getFull: (id) => apiClient.get(`/products/${id}/full`),
updateDetails: (id, details) => apiClient.put(`/products/${id}/details`, details),
addImage: (id, file, isPrimary = false) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`/products/${id}/images?isPrimary=${isPrimary}`, formData, true);
},
deleteImage: (id, imageId) => apiClient.delete(`/products/${id}/images/${imageId}`),
setPrimaryImage: (id, imageId) => apiClient.put(`/products/${id}/images/${imageId}/primary`, {}),
getSimilar: (id, limit = 4) => apiClient.get(`/products/${id}/similar?limit=${limit}`),
};