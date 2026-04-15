"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { getClassById, updateClass } from "@/src/app/_api/class"
import { searchTeachers } from "@/src/app/_api/teacher"
import { ErroField, Teacher } from "@/src/types/common"
import { notification } from "@/src/utils/toast"

export default function EditClassPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { token } = useAuth()

  const [teacherId, setTeacherId] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [level, setLevel] = useState<string>("")
  const [academicYear, setAcademicYear] = useState<string>("")
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(false)
  const [isLoadingTeacher, setIsLoadingTeacher] = useState<boolean>(false)
  const [pageError, setPageError] = useState<string>("")
  const [error, setError] = useState<ErroField>({})

  const loadTeachers = useEffectEvent(async () => {
    if (!token) {
      return
    }

    setIsLoadingTeacher(true)
    const { data, error } = await searchTeachers({ token })
    setIsLoadingTeacher(false)

    if (error) {
      setPageError(error)
      return
    }

    setTeachers(data)
  })

  const loadClass = useEffectEvent(async () => {
    if (!token || !params.id) {
      return
    }

    setIsLoadingInitial(true)
    const { data, error } = await getClassById({ token, classId: params.id })
    setIsLoadingInitial(false)

    if (error || !data) {
      notification("Error!", error || "Kelas tidak ditemukan.", "error")
      router.push("/class")
      return
    }

    setTeacherId(data.teacher_id || "")
    setName(data.name || "")
    setLevel(data.level || "")
    setAcademicYear(data.academic_year || "")
  })

  useEffect(() => {
    loadTeachers()
    loadClass()
  }, [token, params.id])

  if (!token) {
    return (
      <div className="p-6">
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Anda harus login terlebih dahulu</p>
          </div>
        </div>
      </div>
    )
  }

  const handleCheckError = (field: string) => {
    if (error[field]) {
      setError((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const handleUpdate = async () => {
    if (!params.id) {
      notification("Error!", "ID kelas tidak valid.", "error")
      return
    }

    setIsLoading(true)
    setPageError("")

    const { error } = await updateClass({
      token,
      classId: params.id,
      teacherId,
      name,
      level,
      academicYear,
    })

    setIsLoading(false)

    if (error) {
      setPageError(error)
      notification("Error!", error, "error")
      return
    }

    notification("Sukses!", "Kelas berhasil diupdate.", "success")
    router.push("/class")
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Kelas</h1>
      </div>

      <div className="max-w-full rounded-lg border bg-white p-6 shadow-sm">
        {pageError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {pageError}
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Guru</label>
            <select
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              value={teacherId}
              onChange={(e) => {
                setTeacherId(e.target.value)
                handleCheckError("teacher_id")
              }}
              disabled={isLoading || isLoadingInitial || isLoadingTeacher}
            >
              <option value="">Pilih guru</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
            {error.teacher_id ? <p className="text-xs text-red-600">{error.teacher_id}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nama Kelas</label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                handleCheckError("name")
              }}
              disabled={isLoading || isLoadingInitial}
              placeholder="Contoh: Kelas A"
            />
            {error.name ? <p className="text-xs text-red-600">{error.name}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Level</label>
            <Input
              value={level}
              onChange={(e) => {
                setLevel(e.target.value)
                handleCheckError("level")
              }}
              disabled={isLoading || isLoadingInitial}
              placeholder="Contoh: TK A"
            />
            {error.level ? <p className="text-xs text-red-600">{error.level}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tahun Ajaran</label>
            <Input
              value={academicYear}
              onChange={(e) => {
                setAcademicYear(e.target.value)
                handleCheckError("academic_year")
              }}
              disabled={isLoading || isLoadingInitial}
              placeholder="Contoh: 2025/2026"
            />
            {error.academic_year ? <p className="text-xs text-red-600">{error.academic_year}</p> : null}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/class")}
              disabled={isLoading || isLoadingInitial}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleUpdate}
              disabled={isLoading || isLoadingInitial || isLoadingTeacher}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
