import apiClient from "./apiClient";

export const searchApi = {
  search: (query, limit = 20) =>
    apiClient.get(`/search?q=${encodeURIComponent(query)}&limit=${limit}`),
};