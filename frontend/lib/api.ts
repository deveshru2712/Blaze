import { useAuthStore } from "@/store/authStore";
import axios, { InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://localhost:5050/api",
  withCredentials: true,
});

export default api;

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
