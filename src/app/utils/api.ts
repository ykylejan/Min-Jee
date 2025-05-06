// /utils/api.ts
import axios from "axios";
import { store } from "@/redux/store";
import { refreshAccessToken, logout } from "@/redux/slices/authSlice";

let currentAccessToken: string | null = null;

// Helper to keep token in sync
export const setAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

// Request interceptor: attach current token
api.interceptors.request.use(
  (config) => {
    if (currentAccessToken && config.headers) {
      config.headers["Authorization"] = `Bearer ${currentAccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401s and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${process.env.API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        // Update Redux and token tracker
        store.dispatch(refreshAccessToken(newAccessToken));
        setAccessToken(newAccessToken); // 

        // Retry original request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        setAccessToken(null); // Clear token
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
