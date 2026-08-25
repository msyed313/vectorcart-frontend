import apiClient from "./apiClient";

export const authApi = {
  register: (data) => apiClient.post("/auth/register", data),
  login: (data) => apiClient.post("/auth/login", data),
  forgotPassword: (email) => apiClient.post("/password-reset/forgot", { email }),
  verifyOtp: (email, otp) => apiClient.post("/password-reset/verify-otp", { email, otp }),
  resetPassword: (resetToken, newPassword) =>
    apiClient.post("/password-reset/reset", { resetToken, newPassword }),
};