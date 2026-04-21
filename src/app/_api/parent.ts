import { AxiosError } from "axios";

import { BASE_URL } from "@/src/constants/common";
import { Parent } from "@/src/types/common";
import { getErrorMessage } from "@/src/utils";

import { backendInstance } from ".";


type GetParentResponse = {
    data: Parent[];
    total: number;
}

const API_URL = `${BASE_URL}/api/parents`

export async function searchParents({
    token,
    page,
    perPage,
    search,
}: {
    token: string;
    page?: number;
    perPage?: number;
    search?: string;
}): Promise<{
    data: Parent[];
    totalPages: number;
    error: string;
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
            }
        })

        const { data, total }: GetParentResponse = response.data
        const totalPages = Math.ceil(total / effectivePerPage)

        return { data, totalPages, error: "" }

    } catch (err) {
        const error = err as AxiosError
        return { data: [], totalPages: 0, error: getErrorMessage(error) }
    }
}

export async function createParent({
    token,
    name,
    email,
    password
}: {
    token: string
    name: string
    email: string
    password: string
}): Promise<{ data: Parent | null; error: string }> {
    try {
        const response = await backendInstance.post(
            API_URL,
            {
                name,
                email,
                password,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )

        const data = response.data as Parent
        return { data, error: "" }
    } catch (err) {
        const error = err as AxiosError
        return { data: null, error: getErrorMessage(error) }
    }
}

export async function getParentById({
    token,
    parentId,
}: {
    token: string
    parentId: string
}): Promise<{ data: Parent | null; error: string }> {
    try {
        const response = await backendInstance.get(`${API_URL}/${parentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        const data = response.data as Parent
        return { data, error: "" }
    } catch (err) {
        const error = err as AxiosError
        return { data: null, error: getErrorMessage(error) }
    }
}

export async function updateParent({
    token,
    parentId,
    name,
    email,
    password,
}: {
    token: string
    parentId: string
    name: string
    email: string
    password?: string
}): Promise<{ error: string }> {
    try {
        await backendInstance.put(
            `${API_URL}/${parentId}`,
            {
                name,
                email,
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

export async function deleteParent({
    token,
    parentId,
}: {
    token: string
    parentId: string
}): Promise<{ error: string }> {
    try {
        await backendInstance.delete(`${API_URL}/${parentId}`, {
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