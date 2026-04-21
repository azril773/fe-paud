import { AxiosError } from "axios"

import { BASE_URL } from "@/src/constants/common"
import { Teacher } from "@/src/types/common"
import { getErrorMessage } from "@/src/utils"

import { backendInstance } from "."

type GetTeachersResponse = {
  teachers: Teacher[]
  total: number
}

const API_URL = `${BASE_URL}/api/teachers`

export async function searchTeachers({ token }: { token: string }): Promise<{
  data: Teacher[]
  totalPages: number
  error: string
}> {
  try {
    const response = await backendInstance.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const { teachers, total }: GetTeachersResponse = response.data
    const totalPages = Math.ceil(total / 10)

    return { data: teachers, totalPages, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: [], totalPages: 0, error: getErrorMessage(error) }
  }
}

export async function searchAdminTeachers({
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
  data: Teacher[]
  totalPages: number
  error: string
}> {
  try {
    const params: Record<string, string | number> = {}
    let effectivePerPage = 10

    if (typeof page === "number") {
      effectivePerPage = perPage ?? 10
      params.page = page
      params.per_page = effectivePerPage
    }
    if (search) {
      params.search = search
    }

    const response = await backendInstance.get(API_URL, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const { teachers, total }: GetTeachersResponse = response.data
    const totalPages = Math.ceil(total / effectivePerPage)

    return { data: teachers, totalPages, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: [], totalPages: 0, error: getErrorMessage(error) }
  }
}

export async function createTeacher({
  token,
  name,
  email,
  phone,
  password
}: {
  token: string
  name: string
  email: string
  phone: string
  password: string
}): Promise<{ data: Teacher | null; error: string }> {
  try {
    const response = await backendInstance.post(
      API_URL,
      {
        name,
        email,
        phone,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const data = response.data as Teacher
    return { data, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: null, error: getErrorMessage(error) }
  }
}

export async function getTeacherById({
  token,
  teacherId,
}: {
  token: string
  teacherId: string
}): Promise<{ data: Teacher | null; error: string }> {
  try {
    const response = await backendInstance.get(`${API_URL}/${teacherId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = response.data as Teacher
    return { data, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: null, error: getErrorMessage(error) }
  }
}

export async function updateTeacher({
  token,
  teacherId,
  name,
  email,
  phone,
  password,
}: {
  token: string
  teacherId: string
  name: string
  email: string
  phone: string
  password?: string
}): Promise<{ error: string }> {
  try {
    await backendInstance.put(
      `${API_URL}/${teacherId}`,
      {
        name,
        email,
        phone,
        ...(password ? { password } : {}),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return { error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { error: getErrorMessage(error) }
  }
}

export async function deleteTeacher({
  token,
  teacherId,
}: {
  token: string
  teacherId: string
}): Promise<{ error: string }> {
  try {
    await backendInstance.delete(`${API_URL}/${teacherId}`, {
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