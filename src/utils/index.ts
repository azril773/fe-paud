import { AxiosError } from "axios"
import Cookies from "universal-cookie"

export function getErrorMessage(error: AxiosError): string {
  return error.response?.data
    ? (error.response.data as { error: string }).error
    : error.message
}

export const cookies = new Cookies(null, { path: "/" })
