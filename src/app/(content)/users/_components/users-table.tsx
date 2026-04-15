"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { deleteUser, searchUsers } from "@/src/app/_api/user"
import { User } from "@/src/types/common"
import { getAccessToken } from "@/src/utils/auth-token"
import { notification } from "@/utils/toast"


export default function UserTable() {
    const route = useRouter()
    const [userData, setUserData] = useState<User[]>([])
    const [deletingId, setDeletingId] = useState<string>("")

    const loadData = useCallback(async () => {
        const token = getAccessToken()
        if (!token) {
            return
        }

        const { data, error } = await searchUsers({ token })
        if (error) {
            notification("Error!", error, "error")
            return
        }
        setUserData(data)
    }, [])

    const handleDelete = async (userId: string) => {
        const token = getAccessToken()
        if (!token) {
            notification("Error!", "Anda harus login terlebih dahulu.", "error")
            return
        }

        const confirmed = window.confirm("Yakin ingin menghapus user ini?")
        if (!confirmed) {
            return
        }

        setDeletingId(userId)
        const { error } = await deleteUser({ token, userId })
        setDeletingId("")

        if (error) {
            notification("Error!", error, "error")
            return
        }

        notification("Sukses!", "User berhasil dihapus.", "success")
        loadData()
    }

    useEffect(() => {
        loadData()
    }, [loadData])

    return (
        <div className="rounded-lg border">
            <Table className="[--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Users</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Dibuat Pada</TableHead>
                        <TableHead>Diperbarui Pada</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userData.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.role_name}</TableCell>
                            <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => route.push(`/users/${item.id}/edit`)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        disabled={deletingId === item.id}
                                    >
                                        {deletingId === item.id ? "Menghapus..." : "Hapus"}
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
