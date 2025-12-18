// src/api/api.js
import axios from "axios";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 30000,
});

// attach token automatically
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Failed to read token", e);
    }
    return config;
  },
  (err) => Promise.reject(err)
);

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // token expired / invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      toast.error("Session expired. Please login again.");
      // optionally redirect to login: window.location = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
