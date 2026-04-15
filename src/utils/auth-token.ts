import { jwtDecode } from "jwt-decode"

import { ClaimJWT } from "@/src/types/auth"

import { cookies } from "./index"

type JWTExpClaim = {
  exp?: number
}

const ACCESS_TOKEN_COOKIE = "access_token"

export function getAccessToken(): string | null {
  const token = cookies.get(ACCESS_TOKEN_COOKIE)
  return token || null
}

export function setAccessToken(token: string) {
  cookies.set(ACCESS_TOKEN_COOKIE, token, { path: "/" })
}

export function clearAccessToken() {
  cookies.remove(ACCESS_TOKEN_COOKIE, { path: "/" })
}

export function getJWTPayload(token?: string | null): ClaimJWT | null {
  const accessToken = token ?? getAccessToken()
  if (!accessToken) return null

  try {
    return jwtDecode<ClaimJWT>(accessToken)
  } catch {
    return null
  }
}

export function isTokenExpired(token?: string | null, skewInSeconds = 30): boolean {
  const accessToken = token ?? getAccessToken()
  if (!accessToken) return true

  try {
    const decoded = jwtDecode<JWTExpClaim>(accessToken)
    if (!decoded.exp) return true
    const nowInSeconds = Math.floor(Date.now() / 1000)
    return decoded.exp <= nowInSeconds + skewInSeconds
  } catch {
    return true
  }
}