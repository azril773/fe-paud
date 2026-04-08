import { AxiosError } from "axios"

import { getErrorMessage } from "@/src/utils"

import { backendInstance } from "."

type ResponseRefresh = {
  access_token: string
  refrsh_token: string
}
export async function refreshToken(): Promise<{
  data: ResponseRefresh | null
  error: string
}> {
  try {
    const response = await backendInstance.post("/auth/refresh")
    const data = response.data as ResponseRefresh
    return { data, error: "" }
  } catch (error) {
    const err = error as AxiosError
    return { data: null, error: getErrorMessage(err) }
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ accessToken: string | null; error: string }> {
  try {
    const response = await backendInstance.post(
      "/auth/login",
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    if (!response.data.access_token) throw new Error("No access token received")
    return { accessToken: response.data.access_token, error: "" }
  } catch (error) {
    const err = error as AxiosError
    return { accessToken: null, error: getErrorMessage(err) }
  }
}



export async function logout(): Promise<{ error: string }> {
  try {
    await backendInstance.post(
      "/auth/logout",
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return { error: "" };
  } catch (error) {
    const err = error as AxiosError;
    return { error: getErrorMessage(err) };
  }
}
