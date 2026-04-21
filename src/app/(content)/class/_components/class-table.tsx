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
import { deleteClass, searchClasses } from "@/src/app/_api/class"
import { Class } from "@/src/types/common"
import { getAccessToken } from "@/src/utils/auth-token"
import { notification } from "@/utils/toast"

type ClassTableProps = {
  search?: string
  currentPage: number
}

export default function ClassTable({ search, currentPage: initialPage }: ClassTableProps) {
  const router = useRouter()
  const [classData, setClassData] = useState<Class[]>([])
  const [deletingId, setDeletingId] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(initialPage || 1)
  const [totalPages, setTotalPages] = useState(0)
  const perPage = 10

  const loadData = useEffectEvent(async (page: number) => {
    const token = getAccessToken()
    if (!token) {
      return
    }

    const classResult = await searchClasses({ token, page, perPage, search })

    if (classResult.error) {
      notification("Error!", classResult.error, "error")
      return
    }

    setClassData(classResult.data)
    setTotalPages(classResult.totalPages)

    if (classResult.totalPages > 0 && page > classResult.totalPages) {
      setCurrentPage(classResult.totalPages)
    }
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  useEffect(() => {
    loadData(currentPage)
  }, [currentPage, search])

  const handleDelete = (classId: string) => async () => {
    const token = getAccessToken()
    if (!token) {
      notification("Error!", "Anda harus login terlebih dahulu.", "error")
      return
    }

    const confirmed = window.confirm("Yakin ingin menghapus kelas ini?")
    if (!confirmed) {
      return
    }

    setDeletingId(classId)
    const { error } = await deleteClass({ token, classId })
    setDeletingId("")

    if (error) {
      notification("Error!", error, "error")
      return
    }

    notification("Sukses!", "Kelas berhasil dihapus.", "success")
    if (classData.length === 1 && currentPage > 1) {
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
              <TableHead className="text-[0.9rem] text-gray-600">Nama Kelas</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">Level</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">Tahun Ajaran</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">Guru</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">Dibuat Pada</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">Diperbarui Pada</TableHead>
              <TableHead className="pr-10 text-center text-[0.9rem] text-gray-600">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classData.length > 0 ? (
              classData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="pl-10 text-gray-800">{(currentPage - 1) * perPage + index + 1}</TableCell>
                  <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                  <TableCell className="text-gray-700">{item.level}</TableCell>
                  <TableCell className="text-gray-700">{item.academic_year}</TableCell>
                  <TableCell className="text-gray-700">{item.teacher_name || "-"}</TableCell>
                  <TableCell className="text-gray-700">{new Date(item.created_at).toLocaleString()}</TableCell>
                  <TableCell className="text-gray-700">{new Date(item.updated_at).toLocaleString()}</TableCell>
                  <TableCell className="pr-10">
                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => router.push(`/class/${item.id}/edit`)}
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
                <TableCell colSpan={8} className="py-10 text-center text-sm text-slate-500">
                  Tidak ada data kelas untuk ditampilkan.
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
