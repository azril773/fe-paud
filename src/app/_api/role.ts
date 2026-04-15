import { AxiosError } from "axios"

import { BASE_URL } from "@/src/constants/common"
import { getErrorMessage } from "@/src/utils"

import { backendInstance } from "."

export type Role = {
  id: string
  name: string
}

const API_URL = `${BASE_URL}/admin/api/roles`

export async function searchRoles({ token }: { token: string }): Promise<{
  data: Role[]
  error: string
}> {
  try {
    const response = await backendInstance.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = response.data as Role[]
    return { data, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: [], error: getErrorMessage(error) }
  }
}
