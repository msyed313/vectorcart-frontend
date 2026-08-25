import apiClient from "./apiClient";

export const companyApi = {
  get: () => apiClient.get("/Company"),
  update: (companyData) => apiClient.put("/Company", companyData),
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/Company/logo", formData, true); // true = isFormData, skips JSON headers
  },
};