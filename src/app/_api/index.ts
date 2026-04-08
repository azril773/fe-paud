import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { BASE_URL, UNAUTHORIZED_CODE } from "@/constants/common";
import { cookies } from "@/src/utils";
import { notification } from "@/src/utils/toast";

import { refreshToken } from "./auth";

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
          cookies.remove("access_token");
          notification("Sesi Berakhir", "Silakan login kembali.", "error");
          window.location.href = "/login";
          throw error;
        }
        cookies.set("access_token", data?.access_token || "", {
          path: "/",
        });
        config.headers.Authorization = `Bearer ${data?.access_token}`;
        return backendInstance(config);
      }else{
        cookies.remove("access_token");
        notification("Sesi Berakhir", "Silakan login kembali.", "error");
        window.location.href = "/login";
        throw error
      }
    }

    throw error;
  },
);
