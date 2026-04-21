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
import { deleteStudent, searchStudents } from "@/src/app/_api/student"
import { Student } from "@/src/types/common"
import { getAccessToken } from "@/src/utils/auth-token"
import { notification } from "@/utils/toast"

type StudentWithDetails = Student & {
  parent_name: string
  class_name: string
}

type StudentTableProps = {
  search?: string
  currentPage: number
}

export default function StudentTable({ search, currentPage: initialPage }: StudentTableProps) {
  const router = useRouter()
  const [studentData, setStudentData] = useState<StudentWithDetails[]>([])
  const [currentPage, setCurrentPage] = useState<number>(initialPage || 1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [deletingId, setDeletingId] = useState<string>("")
  const perPage = 10

  const formatBirthDate = (value: string) => {
    const date = new Date(value)

    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const loadData = useEffectEvent(async (page: number) => {
    const token = getAccessToken()
    if (!token) {
      return
    }

    const { data, totalPages: nextTotalPages, error } = await searchStudents({
      token,
      page,
      perPage,
      search,
    })

    if (error) {
      notification("Error!", error, "error")
      return
    }

    setStudentData(data)
    setTotalPages(nextTotalPages)

    if (nextTotalPages > 0 && page > nextTotalPages) {
      setCurrentPage(nextTotalPages)
    }
  })

  const handleDelete = (studentId: string) => async () => {
    const token = getAccessToken()
    if (!token) {
      notification("Error!", "Anda harus login terlebih dahulu.", "error")
      return
    }

    const confirmed = window.confirm("Yakin ingin menghapus siswa ini?")
    if (!confirmed) {
      return
    }

    setDeletingId(studentId)
    const { error } = await deleteStudent({ token, studentId })
    setDeletingId("")

    if (error) {
      notification("Error!", error, "error")
      return
    }

    notification("Sukses!", "Siswa berhasil dihapus.", "success")

    if (studentData.length === 1 && currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
      return
    }

    loadData(currentPage)
  }

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
      return
    }

    loadData(1)
  }, [search, currentPage])

  useEffect(() => {
    loadData(currentPage)
  }, [currentPage])

  return (
    <div className="space-y-3">
      <div className="w-full overflow-hidden rounded-sm border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900/70">
        <Table className="[--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-10 text-[0.9rem] text-gray-600">No</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">Nama Siswa</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">NISN</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">Gender</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">Tanggal Lahir</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">Orang Tua</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">Kelas</TableHead>
              <TableHead className="text-[0.9rem] text-gray-600">Foto</TableHead>
              <TableHead className="pr-10 text-[0.9rem] text-gray-600 text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studentData.length > 0 ? (
              studentData.map((item, index) => (
                <TableRow key={item.id} >
                  <TableCell className="pl-10 text-gray-800">
                    {(currentPage - 1) * perPage + index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{item.name}</TableCell>
                  <TableCell className="text-gray-700">{item.nisn}</TableCell>
                  <TableCell className="text-gray-700">
                    <span
                      className={
                        item.gender === "male"
                          ? "inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 ring-1 ring-sky-100"
                          : "inline-flex rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-100"
                      }
                    >
                      {item.gender === "male" ? "Laki-laki" : "Perempuan"}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700">{formatBirthDate(item.birth_date)}</TableCell>
                  <TableCell className="text-gray-700">{item.parent_name || "-"}</TableCell>
                  <TableCell className="text-gray-700">{item.class_name || "-"}</TableCell>
                  <TableCell>
                    {item.photo ? (
                      <img
                        src={item.photo}
                        alt={item.name}
                        className="h-12 w-12 rounded-xl border border-slate-200 object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs font-semibold text-slate-400">
                        -
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="pr-10">
                    <div className="flex items-center ">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        onClick={() => router.push(`/student/${item.id}/edit`)}
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
                <TableCell colSpan={9} className="py-10 text-center text-sm text-slate-500">
                  Tidak ada data siswa untuk ditampilkan.
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
