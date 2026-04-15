import { AxiosError } from "axios"

import { BASE_URL } from "@/src/constants/common"
import { Student } from "@/src/types/common"
import { getErrorMessage } from "@/src/utils"

import { backendInstance } from "."

type GetStudentsResponse = {
  students: Student[]
  total: number
}

const API_URL = `${BASE_URL}/api/students`
const ADMIN_API_URL = `${BASE_URL}/admin/api/students`

export async function searchStudents({ token }: { token: string }): Promise<{
  data: Student[]
  totalPages: number
  error: string
}> {
  try {
    const response = await backendInstance.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const { students, total }: GetStudentsResponse = response.data
    const totalPages = Math.ceil(total / 10)

    return { data: students, totalPages, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: [], totalPages: 0, error: getErrorMessage(error) }
  }
}

export async function createStudent({
  token,
  parentId,
  classId,
  name,
  gender,
  birthDate,
  nisn,
  photo,
}: {
  token: string
  parentId: string
  classId: string
  name: string
  gender: string
  birthDate: string
  nisn: string
  photo: File | null
}): Promise<{ data: Student | null; error: string }> {
  try {
    const formData = new FormData()
    formData.append("parent_id", parentId)
    formData.append("class_id", classId)
    formData.append("name", name)
    formData.append("gender", gender)
    formData.append("birth_date", birthDate)
    formData.append("nisn", nisn)
    if (photo) {
      formData.append("photo", photo)
    }

    const response = await backendInstance.post(ADMIN_API_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = response.data as Student
    return { data, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: null, error: getErrorMessage(error) }
  }
}

export async function getStudentById({
  token,
  studentId,
}: {
  token: string
  studentId: string
}): Promise<{ data: Student | null; error: string }> {
  try {
    const response = await backendInstance.get(`${ADMIN_API_URL}/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = response.data as Student
    return { data, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: null, error: getErrorMessage(error) }
  }
}

export async function updateStudent({
  token,
  studentId,
  parentId,
  classId,
  name,
  gender,
  birthDate,
  nisn,
  photo,
}: {
  token: string
  studentId: string
  parentId: string
  classId: string
  name: string
  gender: string
  birthDate: string
  nisn: string
  photo: File | null
}): Promise<{ error: string }> {
  try {
    const formData = new FormData()
    formData.append("parent_id", parentId)
    formData.append("class_id", classId)
    formData.append("name", name)
    formData.append("gender", gender)
    formData.append("birth_date", birthDate)
    formData.append("nisn", nisn)
    if (photo) {
      formData.append("photo", photo)
    }

    await backendInstance.put(`${ADMIN_API_URL}/${studentId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return { error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { error: getErrorMessage(error) }
  }
}

export async function deleteStudent({
  token,
  studentId,
}: {
  token: string
  studentId: string
}): Promise<{ error: string }> {
  try {
    await backendInstance.delete(`${ADMIN_API_URL}/${studentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return { error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { error: getErrorMessage(error) }
  }
}
