"use client"

import { useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useState } from "react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { deleteTeacher, searchTeachers } from "@/src/app/_api/teacher"
import { Teacher } from "@/src/types/common"
import { getAccessToken } from "@/src/utils/auth-token"
import { notification } from "@/utils/toast"

export default function TeacherTable() {
    const router = useRouter()
    const [teacherData, setTeacherData] = useState<Teacher[]>([])
    const [deletingId, setDeletingId] = useState<string>("");

    const loadData = useEffectEvent(async () => {
        const token = getAccessToken()
        if (!token) {
            return
        }

        const { data, error } = await searchTeachers({ token })
        if (error) {
            notification("Error!", error, "error")
            return
        }
        console.log(data);

        setTeacherData(data)
    })

    useEffect(() => {
        loadData()
    }, [])

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
        loadData()
    }

    return (
        <div className="rounded-lg border">
            <Table className="[--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Guru</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>No. Telepon</TableHead>
                        <TableHead>Dibuat Pada</TableHead>
                        <TableHead>Diperbarui Pada</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {teacherData.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.phone || "-"}</TableCell>
                            <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <button
                                    onClick={() => router.push(`/teacher/${item.id}/edit`)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete(item.id)}
                                    className="text-red-500 hover:text-red-700 ml-2"
                                    disabled={deletingId === item.id}
                                >
                                    {deletingId === item.id ? "Menghapus..." : "Hapus"}
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
