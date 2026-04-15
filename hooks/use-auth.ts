import { ClaimJWT } from "@/src/types/auth"
import { getAccessToken, getJWTPayload } from "@/src/utils/auth-token"
import { useEffect, useState } from "react"

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [decoded, setDecoded] = useState<ClaimJWT | null>(null)

  useEffect(() => {
    const storedToken = getAccessToken()
    setToken(storedToken)
    const decodedValue: ClaimJWT | null = getJWTPayload(storedToken)
    setDecoded(decodedValue)
  }, [])

  return { token, decoded }
}
