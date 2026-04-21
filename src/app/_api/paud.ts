import { AxiosError } from "axios"

import { BASE_URL } from "@/src/constants/common"
import { CurrentPaud } from "@/src/types/common"
import { getErrorMessage } from "@/src/utils"

import { backendInstance } from "."

type Paud = {
  id: string
  name: string
  subdomain: string
}

type GetPaudsResponse = {
  pauds: Paud[]
}



const ADMIN_API_URL = `${BASE_URL}/admin/api/pauds`
const PAUD_API_URL = `${BASE_URL}/api/paud`

export async function searchPauds({ token }: { token: string }): Promise<{
  data: Paud[]
  error: string
}> {
  try {
    const response = await backendInstance.get(ADMIN_API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const { pauds }: GetPaudsResponse = response.data
    return { data: pauds, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: [], error: getErrorMessage(error) }
}
}

export async function getCurrentPaud({ token }: { token: string }): Promise<{
  data: CurrentPaud | null
  error: string
}> {
  try {
    const response = await backendInstance.get(`${PAUD_API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return { data: response.data as CurrentPaud, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: null, error: getErrorMessage(error) }
  }
}

export async function updatePaud({ token, name, subdomain }: { token: string; name: string; subdomain: string }) {
  try {
    const response = await backendInstance.put(`${PAUD_API_URL}/profile`, { name, subdomain }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return { data: response.data, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: null, error: getErrorMessage(error) }
  }
}

