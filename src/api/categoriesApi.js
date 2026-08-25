import apiClient from "./apiClient";

export const categoriesApi = {
  getAll: () => apiClient.get("/categories"),
  create: (data) => apiClient.post("/categories", data),
  update: (id, data) => apiClient.put(`/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/categories/${id}`),
};