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
import { deleteTeacher, searchAdminTeachers } from "@/src/app/_api/teacher"
import { Teacher } from "@/src/types/common"
import { getAccessToken } from "@/src/utils/auth-token"
import { notification } from "@/utils/toast"

type TeacherTableProps = {
    search?: string
    currentPage: number
}

export default function TeacherTable({ search, currentPage: initialPage }: TeacherTableProps) {
    const router = useRouter()
    const [teacherData, setTeacherData] = useState<Teacher[]>([])
    const [deletingId, setDeletingId] = useState<string>("")
    const [currentPage, setCurrentPage] = useState<number>(initialPage || 1)
    const [totalPages, setTotalPages] = useState(0)
    const perPage = 10

    const loadData = useEffectEvent(async (page: number) => {
        const token = getAccessToken()
        if (!token) {
            return
        }

        const { data, totalPages: nextTotalPages, error } = await searchAdminTeachers({ token, page, perPage, search })
        if (error) {
            notification("Error!", error, "error")
            return
        }

        setTeacherData(data)
        setTotalPages(nextTotalPages)

        if (nextTotalPages > 0 && page > nextTotalPages) {
            setCurrentPage(nextTotalPages)
        }
    })

    useEffect(() => {
        setCurrentPage(1)
    }, [search])

    useEffect(() => {
        loadData(currentPage)
    }, [currentPage, search])

    const handleDelete = (teacherId: string) => async () => {
        const token = getAccessToken()
        if (!token) {
            notification("Error!", "Anda harus login terlebih dahulu.", "error")
            return
        }

        const confirmed = window.confirm("Yakin ingin menghapus guru ini?")
        if (!confirmed) {
            return
        }

        setDeletingId(teacherId)
        const { error } = await deleteTeacher({ token, teacherId })
        setDeletingId("")

        if (error) {
            notification("Error!", error, "error")
            return
        }

        notification("Sukses!", "Guru berhasil dihapus.", "success")
        if (teacherData.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1)
            return
        }

        loadData(currentPage)
    }

    return (
        <div className="space-y-3">
            <div className="w-full overflow-hidden rounded-sm border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/70">
                <Table className="[--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-10 text-[0.9rem] text-gray-600">No</TableHead>
                            <TableHead className="text-[0.9rem] text-gray-600">Nama Guru</TableHead>
                            <TableHead className="text-[0.9rem] text-gray-600">Email</TableHead>
                            <TableHead className="text-[0.9rem] text-gray-600">No. Telepon</TableHead>
                            <TableHead className="text-[0.9rem] text-gray-600">Dibuat Pada</TableHead>
                            <TableHead className="text-[0.9rem] text-gray-600">Diperbarui Pada</TableHead>
                            <TableHead className="pr-10 text-center text-[0.9rem] text-gray-600">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {teacherData.length > 0 ? (
                            teacherData.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell className="pl-10 text-gray-800">{(currentPage - 1) * perPage + index + 1}</TableCell>
                                    <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                                    <TableCell className="text-gray-700">{item.email}</TableCell>
                                    <TableCell className="text-gray-700">{item.phone || "-"}</TableCell>
                                    <TableCell className="text-gray-700">{new Date(item.created_at).toLocaleString()}</TableCell>
                                    <TableCell className="text-gray-700">{new Date(item.updated_at).toLocaleString()}</TableCell>
                                    <TableCell className="pr-10">
                                        <div className="flex items-center justify-center">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                onClick={() => router.push(`/teacher/${item.id}/edit`)}
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
                                    Tidak ada data guru untuk ditampilkan.
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
