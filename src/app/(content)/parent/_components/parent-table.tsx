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
import { deleteParent, searchParents } from "@/src/app/_api/parent"
import { Parent } from "@/src/types/common"
import { getAccessToken } from "@/src/utils/auth-token"
import { notification } from "@/utils/toast"


export default function ParentTable() {
    const router = useRouter()
    const [parentData, setParentData] = useState<Parent[]>([])
    const [deletingId, setDeletingId] = useState<string>("")

    const loadData = useEffectEvent(async () => {
        const token = getAccessToken()
        if (!token) {
            return
        }

        const { data, error } = await searchParents({ token })
        if (error) {
            notification("Error!", error, "error")
            return
        }

        setParentData(data)
    })

    const handleDelete = (parentId: string) => async () => {
        const token = getAccessToken()
        if (!token) {
            notification("Error!", "Anda harus login terlebih dahulu.", "error")
            return
        }

        const confirmed = window.confirm("Yakin ingin menghapus orang tua ini?")
        if (!confirmed) {
            return
        }

        setDeletingId(parentId)
        const { error } = await deleteParent({ token, parentId })
        setDeletingId("")

        if (error) {
            notification("Error!", error, "error")
            return
        }

        notification("Sukses!", "Orang tua berhasil dihapus.", "success")
        loadData()
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <div className="rounded-lg border">
            <Table className="[--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
                <TableHeader>
                    <TableRow>
                        <TableHead>No</TableHead>
                        <TableHead>Nama Orang Tua</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Dibuat Pada</TableHead>
                        <TableHead>Diperbarui Pada</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {parentData.map((item, index) => (
                        <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => router.push(`/parent/${item.id}/edit`)}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={handleDelete(item.id)}
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