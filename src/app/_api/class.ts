import { AxiosError } from "axios"

import { BASE_URL } from "@/src/constants/common"
import { Class } from "@/src/types/common"
import { getErrorMessage } from "@/src/utils"

import { backendInstance } from "."

type GetClassesResponse = {
  data: Class[]
  total: number
}

const API_URL = `${BASE_URL}/api/classes`

export async function searchClasses({
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
  data: Class[]
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

    const { data, total }: GetClassesResponse = response.data
    const totalPages = Math.ceil(total / effectivePerPage)

    return { data, totalPages, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: [], totalPages: 0, error: getErrorMessage(error) }
  }
}

export async function createClass({
  token,
  teacherId,
  name,
  level,
  academicYear,
}: {
  token: string
  teacherId: string
  name: string
  level: string
  academicYear: string
}): Promise<{ data: Class | null; error: string }> {
  try {
    const response = await backendInstance.post(
      API_URL,
      {
        teacher_id: teacherId,
        name,
        level,
        academic_year: academicYear,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    const data = response.data as Class
    return { data, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: null, error: getErrorMessage(error) }
  }
}

export async function getClassById({
  token,
  classId,
}: {
  token: string
  classId: string
}): Promise<{ data: Class | null; error: string }> {
  try {
    const response = await backendInstance.get(`${API_URL}/${classId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = response.data as Class
    return { data, error: "" }
  } catch (err) {
    const error = err as AxiosError
    return { data: null, error: getErrorMessage(error) }
  }
}

export async function updateClass({
  token,
  classId,
  teacherId,
  name,
  level,
  academicYear,
}: {
  token: string
  classId: string
  teacherId: string
  name: string
  level: string
  academicYear: string
}): Promise<{ error: string }> {
  try {
    await backendInstance.put(
      `${API_URL}/${classId}`,
      {
        teacher_id: teacherId,
        name,
        level,
        academic_year: academicYear,
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

export async function deleteClass({
  token,
  classId,
}: {
  token: string
  classId: string
}): Promise<{ error: string }> {
  try {
    await backendInstance.delete(`${API_URL}/${classId}`, {
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
