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
import { searchClasses } from "@/src/app/_api/class"
import { searchParents } from "@/src/app/_api/parent"
import { deleteStudent, searchStudents } from "@/src/app/_api/student"
import { Class, Parent, Student } from "@/src/types/common"
import { getAccessToken } from "@/src/utils/auth-token"
import { notification } from "@/utils/toast"

export default function StudentTable() {
  const router = useRouter()
  const [studentData, setStudentData] = useState<Student[]>([])
  const [parentMap, setParentMap] = useState<Record<string, string>>({})
  const [classMap, setClassMap] = useState<Record<string, string>>({})
  const [deletingId, setDeletingId] = useState<string>("")

  const loadData = useEffectEvent(async () => {
    const token = getAccessToken()
    if (!token) {
      return
    }

    const [studentResult, parentResult, classResult] = await Promise.all([
      searchStudents({ token }),
      searchParents({ token }),
      searchClasses({ token }),
    ])

    if (studentResult.error) {
      notification("Error!", studentResult.error, "error")
      return
    }
    if (parentResult.error) {
      notification("Error!", parentResult.error, "error")
      return
    }
    if (classResult.error) {
      notification("Error!", classResult.error, "error")
      return
    }

    const nextParentMap: Record<string, string> = {}
    parentResult.data.forEach((parent: Parent) => {
      nextParentMap[parent.id] = parent.name
    })

    const nextClassMap: Record<string, string> = {}
    classResult.data.forEach((classItem: Class) => {
      nextClassMap[classItem.id] = classItem.name
    })

    setParentMap(nextParentMap)
    setClassMap(nextClassMap)
    setStudentData(studentResult.data)
  })

  useEffect(() => {
    loadData()
  }, [])

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
    loadData()
  }

  return (
    <div className="rounded-lg border">
      <Table className="[--gutter:--spacing(6)] lg:[--gutter:--spacing(10)]">
        <TableHeader>
          <TableRow>
            <TableHead>No</TableHead>
            <TableHead>Nama Siswa</TableHead>
            <TableHead>NISN</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Tanggal Lahir</TableHead>
            <TableHead>Orang Tua</TableHead>
            <TableHead>Kelas</TableHead>
            <TableHead>Foto</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {studentData.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.nisn}</TableCell>
              <TableCell>{item.gender === "male" ? "Laki-laki" : "Perempuan"}</TableCell>
              <TableCell>{new Date(item.birth_date).toLocaleDateString()}</TableCell>
              <TableCell>{parentMap[item.parent_id] || "-"}</TableCell>
              <TableCell>{classMap[item.class_id] || "-"}</TableCell>
              <TableCell>
                {item.photo ? (
                  <img src={item.photo} alt={item.name} className="h-10 w-10 rounded object-cover" />
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push(`/student/${item.id}/edit`)}
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
