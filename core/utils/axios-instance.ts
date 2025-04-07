import axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import { AUTH_STORAGE } from "@core/frameworks/auth-storage/interface";
import { appResolve } from "@core/di/container";
import { type AuthStorage } from "@core/frameworks/auth-storage/web";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(async (config) => {
  const storage = await appResolve<AuthStorage>(AUTH_STORAGE);
  const jwt = await storage.getAccessToken();
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`;
  }
  return config;
});

export const axiosInstance = instance;

export const axiosCacheInstance = setupCache(instance, {
  ttl: 1000 * 60,
});
