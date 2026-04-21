"use client"

import { Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { PaginationControls } from "@/components/ui/pagination-controls"
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

type UserTableProps = {
    search?: string
    currentPage: number
}

export default function UserTable({ search, currentPage: initialPage }: UserTableProps) {
    const route = useRouter()
    const [userData, setUserData] = useState<User[]>([])
    const [deletingId, setDeletingId] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<number>(initialPage || 1)
    const [totalPages, setTotalPages] = useState<number>(0)
    const perPage = 5

    const loadData = useEffectEvent(async (page: number) => {
        const token = getAccessToken()
        if (!token) {
            return
        }

        const { data, totalPages: nextTotalPages, error } = await searchUsers({
            token,
            page,
            perPage,
            search,
        })
        if (error) {
            notification("Error!", error, "error")
            return
        }

        setUserData(data)
        setTotalPages(nextTotalPages)

        if (nextTotalPages > 0 && page > nextTotalPages) {
            setCurrentPage(nextTotalPages)
        }
    })

    const handleDelete = (userId: string) => async () => {
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
		if (userData.length === 1 && currentPage > 1) {
			setCurrentPage((prev) => prev - 1)
			return
		}

		loadData(currentPage)
    }

    useEffect(() => {
        setCurrentPage(1)
    }, [search])

    useEffect(() => {
        loadData(currentPage)
    }, [currentPage, search])

    return (
        <div className="space-y-3">
            <div className="w-full overflow-hidden rounded-sm border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/70">
            <Table className="[--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-10 text-[0.9rem] text-gray-600">No</TableHead>
                        <TableHead className="text-[0.9rem] text-gray-600">Nama Users</TableHead>
                        <TableHead className="text-[0.9rem] text-gray-600">Email</TableHead>
                        <TableHead className="text-[0.9rem] text-gray-600">Role</TableHead>
                        <TableHead className="text-[0.9rem] text-gray-600">Dibuat Pada</TableHead>
                        <TableHead className="text-[0.9rem] text-gray-600">Diperbarui Pada</TableHead>
                        <TableHead className="pr-10 text-center text-[0.9rem] text-gray-600">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {userData.length > 0 ? (
                        userData.map((item, index) => (
                            <TableRow key={item.id}>
                                <TableCell className="pl-10 text-gray-800">{(currentPage - 1) * perPage + index + 1}</TableCell>
                                <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                                <TableCell className="text-gray-700">{item.email}</TableCell>
                                <TableCell className="text-gray-700">
                                    <span className="inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
                                        {item.role_name}
                                    </span>
                                </TableCell>
                                <TableCell className="text-gray-700">{new Date(item.created_at).toLocaleString()}</TableCell>
                                <TableCell className="text-gray-700">{new Date(item.updated_at).toLocaleString()}</TableCell>
                                <TableCell className="pr-10">
                                    <div className="flex items-center justify-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                            onClick={() => route.push(`/users/${item.id}/edit`)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="gap-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                            onClick={handleDelete(item.id)}
                                            disabled={deletingId === item.id}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-500">
                                Tidak ada data users untuk ditampilkan.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}
