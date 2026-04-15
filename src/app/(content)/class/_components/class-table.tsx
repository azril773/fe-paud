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
import { deleteClass, searchClasses } from "@/src/app/_api/class"
import { searchTeachers } from "@/src/app/_api/teacher"
import { Class, Teacher } from "@/src/types/common"
import { getAccessToken } from "@/src/utils/auth-token"
import { notification } from "@/utils/toast"

export default function ClassTable() {
  const router = useRouter()
  const [classData, setClassData] = useState<Class[]>([])
  const [teacherMap, setTeacherMap] = useState<Record<string, string>>({})
  const [deletingId, setDeletingId] = useState<string>("")

  const loadData = useEffectEvent(async () => {
    const token = getAccessToken()
    if (!token) {
      return
    }

    const [classResult, teacherResult] = await Promise.all([
      searchClasses({ token }),
      searchTeachers({ token }),
    ])

    if (classResult.error) {
      notification("Error!", classResult.error, "error")
      return
    }
    if (teacherResult.error) {
      notification("Error!", teacherResult.error, "error")
      return
    }

    const nextTeacherMap: Record<string, string> = {}
    teacherResult.data.forEach((teacher: Teacher) => {
      nextTeacherMap[teacher.id] = teacher.name
    })

    setTeacherMap(nextTeacherMap)
    setClassData(classResult.data)
  })

  useEffect(() => {
    loadData()
  }, [])

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
    loadData()
  }

  return (
    <div className="rounded-lg border">
      <Table className="[--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Kelas</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Tahun Ajaran</TableHead>
            <TableHead>Guru</TableHead>
            <TableHead>Dibuat Pada</TableHead>
            <TableHead>Diperbarui Pada</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classData.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.level}</TableCell>
              <TableCell>{item.academic_year}</TableCell>
              <TableCell>{teacherMap[item.teacher_id] || "-"}</TableCell>
              <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(item.updated_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/class/${item.id}/edit`)}
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
