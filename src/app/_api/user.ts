import { AxiosError } from "axios";

import { BASE_URL } from "@/src/constants/common";
import { getErrorMessage } from "@/src/utils";

import { backendInstance } from ".";

type User = {
    id: string;
    role_id: string;
    name: string;
    email: string;
    role: string;
    role_name: string;
    photo?: string | null;
    created_at: string;
    updated_at: string;
}
type GetUsersResponse = {
    users: User[];
    total: number;
    error: string;
}

type UserDetail = User & {
    paud_id?: string | null;
    role_id?: string | null;
    paud_name?: string;
    subdomain?: string;
    logo?: string | null;
    status?: string;
};

const API_URL = `${BASE_URL}/api/users`

export async function searchUsers({
    token,
    page,
    perPage,
    search,
}: {
    token: string
    page?: number
    perPage?: number
    search?: string
}) : Promise<{
    data: User[];
    total: number;
    totalPages: number;
    error: string;
}> {
    try {
        const effectivePerPage = perPage ?? 5
        const params: Record<string, string | number> = {
            page: page ?? 1,
            per_page: effectivePerPage,
        }

        if (search && search.trim()) {
            params.search = search
        }

        const response = await backendInstance.get(API_URL, {
            params,
            headers: {
            Authorization: `Bearer ${token}`,
        }
        });
        const { users, total }: GetUsersResponse = response.data;
        const totalPages = effectivePerPage ? Math.ceil(total / effectivePerPage) : 0;
        return { data: users, total, totalPages, error: "" };   
    } catch (err) {
        const error = err as AxiosError;
        return { data: [], total: 0, totalPages: 0, error: getErrorMessage(error) };
    }
}

export async function createUser({
    token,
    name,
    email,
    password,
    roleId,
}: {
    token: string;
    name: string;
    email: string;
    password: string;
    roleId: string;
}): Promise<{ data: User | null; error: string }> {
    try {
        const response = await backendInstance.post(
            API_URL,
            {
                name,
                email,
                password,
                role_id: roleId,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const data = response.data as User;
        return { data, error: "" };
    } catch (err) {
        const error = err as AxiosError;
        return { data: null, error: getErrorMessage(error) };
    }
}

export async function getUserById({
    token,
    userId,
}: {
    token: string;
    userId: string;
}): Promise<{ data: UserDetail | null; error: string }> {
    try {
        const response = await backendInstance.get(`${API_URL}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = response.data as UserDetail;
        return { data, error: "" };
    } catch (err) {
        const error = err as AxiosError;
        return { data: null, error: getErrorMessage(error) };
    }
}

export async function updateUser({
    token,
    userId,
    name,
    email,
    roleId,
    paudId,
    password,
}: {
    token: string;
    userId: string;
    name: string;
    email: string;
    roleId: string;
    paudId?: string | null;
    password?: string;
}): Promise<{ error: string }> {
    try {
        await backendInstance.put(
            `${API_URL}/${userId}`,
            {
                name,
                email,
                role_id: roleId,
                paud_id: paudId ?? null,
                ...(password ? { password } : {}),
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return { error: "" };
    } catch (err) {
        const error = err as AxiosError;
        return { error: getErrorMessage(error) };
    }
}

export async function deleteUser({
    token,
    userId,
}: {
    token: string;
    userId: string;
}): Promise<{ error: string }> {
    try {
        await backendInstance.delete(`${API_URL}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { error: "" };
    } catch (err) {
        const error = err as AxiosError;
        return { error: getErrorMessage(error) };
    }
}