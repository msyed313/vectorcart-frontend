import apiClient from "./apiClient";

export const chatApi = {
  getHistory: () => apiClient.get("/chat/history"),
  sendMessage: (message) => apiClient.post("/chat/message", { message }),
};