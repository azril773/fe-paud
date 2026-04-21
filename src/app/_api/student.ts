import { AxiosError } from "axios"

import { BASE_URL } from "@/src/constants/common"
import { Student } from "@/src/types/common"
import { getErrorMessage } from "@/src/utils"

import { backendInstance } from "."


type StudentStats = {
  total_students: number
  male_students: number
  female_students: number
}
type StudentWithDetails = Student & {
  parent_name: string
  class_name: string
}

type GetStudentsResponse = {
  students: StudentWithDetails[]
  total: number
}


const API_URL = `${BASE_URL}/api/students`

export async function searchStudents({
  token,
  page,
  perPage,
  search,
}: {
  token: string
  page?: number
  perPage?: number
  search?: string
}): Promise<{
  data: StudentWithDetails[]
  totalPages: number
  error: string
}> {
  try {
    const effectivePerPage = perPage ?? 10
    const params: Record<string, string | number> = {
      page: page ?? 1,
      per_page: effectivePerPage,
    }
    if (search) {
      params.search = search
    }

    const response = await backendInstance.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    })

    const { students, total }: GetStudentsResponse = response.data
    const totalPages = Math.ceil(total / effectivePerPage)

    return { data: students, totalPages, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: [], totalPages: 0, error: getErrorMessage(error) }
  }
}

export async function getStudentStats({
  token,
}: {
  token: string
}): Promise<{
  data: StudentStats | null
  error: string
}> {
  try {
    const response = await backendInstance.get(`${API_URL}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = response.data as StudentStats
    return { data, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: null, error: getErrorMessage(error) }
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

    const response = await backendInstance.post(API_URL, formData, {
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
    const response = await backendInstance.get(`${API_URL}/${studentId}`, {
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

    await backendInstance.put(`${API_URL}/${studentId}`, formData, {
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
    await backendInstance.delete(`${API_URL}/${studentId}`, {
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
