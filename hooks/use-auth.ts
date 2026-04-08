import { ClaimJWT } from "@/src/types/auth"
import { cookies } from "@/src/utils"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState } from "react"

export function useAuth() {
  const [token, setToken] = useState<string | null>(null)
  const [decoded, setDecoded] = useState<ClaimJWT | null>(null)

  useEffect(() => {
    const storedToken = cookies.get("access_token")
    setToken(storedToken)
    const decodedValue: ClaimJWT | null = storedToken ? jwtDecode(storedToken) : null
    setDecoded(decodedValue)
  }, [])

  return { token, decoded }
}
