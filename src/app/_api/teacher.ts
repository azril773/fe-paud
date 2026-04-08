import { AxiosError } from "axios"

import { BASE_URL } from "@/src/constants/common"
import { getErrorMessage } from "@/src/utils"

import { backendInstance } from "."



const API_URL = `${BASE_URL}/admin/api/teachers`

export default async function getTeacher({ token }: { token: string }) {
  try {
    await backendInstance.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
  } catch (err) {
    const error = err as AxiosError
    return { error: getErrorMessage(error) }
  }
}
