// /utils/api.ts

import axios from "axios";
import Cookies from "js-cookie";
import { store } from "@/redux/store";
import { refreshAccessToken, logout } from "@/redux/slices/authSlice";
import "dotenv/config";
const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true, // Important if tokens are in httpOnly cookies
});

// Request interceptor: Attach access token
api.interceptors.request.use(
  (config) => {
    // const state = store.getState();
    // const token = state.auth.accessToken;
    const token = Cookies.get("accessToken");

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
        const refToken = Cookies.get("refresh_token");

        // Call your backend refresh endpoint
        console.log("REFRESH TOKEN", refToken);

        const res = await axios.get(
          `http://localhost:8000/api/v1/o/auth/refresh`,
          {}
        );

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken; // Assuming the backend also sends a new refresh token

        // Update the access token in cookies
        Cookies.set("accessToken", newAccessToken, { expires: 7 }); // Set to expire in 7 days

        // Optionally update the refresh token in cookies (if provided by the backend)
        if (newRefreshToken) {
          Cookies.set("refreshToken", newRefreshToken, { expires: 30 }); // Set to expire in 30 days
        }

        // Update token in Redux (if applicable)
        store.dispatch(refreshAccessToken(newAccessToken));

        // Retry the original request with the new access token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log the user out
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
