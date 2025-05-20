// /utils/api.ts

import axios from "axios";
import Cookies from "js-cookie";
import { store } from "@/redux/store";
import { refreshAccessToken, logout } from "@/redux/slices/authSlice";
import "dotenv/config";
import { jwtDecode } from "jwt-decode";


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
        const accessToken = Cookies.get("accessToken");
        // Call your backend refresh endpoint
        let userRole = "customer"; // default
        if (accessToken) {
          try {
            const decoded: any = jwtDecode(accessToken);
            userRole = decoded.role || "customer";
          } catch (e) {
            // fallback to customer
          }
        }

        // Set refresh URL based on user role
        const refreshUrl =
          userRole === "owner"
            ? "http://localhost:8000/api/v1/o/auth/refresh"
            : "http://localhost:8000/api/v1/u/auth/refresh";

        const res = await axios.get(refreshUrl, {});

        const newAccessToken = res.data.accessToken;
        const newRefreshToken = res.data.refreshToken;

        Cookies.set("accessToken", newAccessToken, { expires: 7 });
        if (newRefreshToken) {
          Cookies.set("refreshToken", newRefreshToken, { expires: 30 });
        }

        store.dispatch(refreshAccessToken(newAccessToken));
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
