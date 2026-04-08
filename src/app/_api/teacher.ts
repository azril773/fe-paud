import { getErrorMessage } from "@/src/utils"
import { AxiosError } from "axios"
import { backendInstance } from "."
import { BASE_URL } from "@/src/constants/common"


const API_URL = `${BASE_URL}/admin/api/teachers`

type GetTeacherResponse = {
    
}
export default async function getTeacher({ token }: { token: string }) {
  try {
    const response = await backendInstance.get(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })
  } catch (err) {
    const error = err as AxiosError
    return { error: getErrorMessage(error) }
  }
}
