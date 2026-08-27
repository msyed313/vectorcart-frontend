import apiClient from "./apiClient";

export const paymentsApi = {
  createCheckoutSession: (orderId) =>
    apiClient.post("/payments/checkout-session", { orderId }),
};