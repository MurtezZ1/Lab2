import axios from "axios";
import { getAuthTokens, saveAuthTokens } from "@/services/authService";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
});

apiClient.interceptors.request.use((config) => {
  const tokens = getAuthTokens();
  if (tokens.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const tokens = getAuthTokens();

    if (error.response?.status === 401 && tokens.refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      const { data } = await apiClient.post("/auth/refresh-token", {
        refreshToken: tokens.refreshToken,
      });
      saveAuthTokens(data.data.accessToken, data.data.refreshToken);
      originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  },
);
