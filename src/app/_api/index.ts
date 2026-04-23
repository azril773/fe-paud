import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { BASE_URL, UNAUTHORIZED_CODE } from "@/constants/common";
import { notification } from "@/src/utils/toast";

import { logout, refreshToken } from "./auth";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const backendInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  withCredentials: true,
});

backendInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as ExtendedAxiosRequestConfig;

    if (error.response?.status === UNAUTHORIZED_CODE && config && !config.url?.includes("/auth/login")) {
      if (!config._retry) {
        config._retry = true;
        const { data, error } = await refreshToken();
        if (error) {
          await logout();
          notification("Sesi Berakhir", "Silakan login kembali.", "error");
          window.location.href = `${process.env.NEXT_PUBLIC_HTTP_SECURE === "true" ? "https" : "http"}://${process.env.NEXT_PUBLIC_DOMAIN}/login`;
          throw error;
        }
        const token = data?.access_token ?? ''
        config.headers.Authorization = `Bearer ${token}`;
        return backendInstance(config);
      }else{
        await logout();
        notification("Sesi Berakhir", "Silakan login kembali.", "error");
        window.location.href = `${process.env.NEXT_PUBLIC_HTTP_SECURE === "true" ? "https" : "http"}://${process.env.NEXT_PUBLIC_DOMAIN}/login`;
        throw error
      }
    }

    throw error;
  },
);
