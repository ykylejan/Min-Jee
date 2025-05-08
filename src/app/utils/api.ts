// /utils/api.ts

import axios from "axios";
import { store } from "@/redux/store";
import { refreshAccessToken, logout } from "@/redux/slices/authSlice";
import "dotenv/config";
const api = axios.create({
  baseURL: process.env.API_URL || "http://localhost:8000/api/v1", 
  withCredentials: true, // Important if tokens are in httpOnly cookies
});

// Request interceptor: Attach access token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // call your backend refresh endpoint
        const res = await axios.post(
          `${process.env.API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        // Update token in Redux
        store.dispatch(refreshAccessToken(newAccessToken));

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
