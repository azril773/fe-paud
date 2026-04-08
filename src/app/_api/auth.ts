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

export async function verify(
  token: string
): Promise<{ success: boolean; error: string }> {
  try {
    console.log(token)
    await backendInstance.post(
      "/auth/verify",
      {
        token,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    return { success: true, error: "" }
  } catch (error) {
    const err = error as AxiosError
    return { success: false, error: getErrorMessage(err) }
  }
}
