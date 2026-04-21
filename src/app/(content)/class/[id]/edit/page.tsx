"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
    <div className="space-y-4">
      <div className="max-w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-sm">
        <div className="border-b border-slate-200/70 p-5">
          <h1 className="text-xl font-semibold text-slate-700">Edit Kelas</h1>
        </div>

        <div className="p-6">
        {pageError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {pageError}
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-gray-600">Guru</Label>
            <Select
              value={teacherId}
              onValueChange={(value) => {
                setTeacherId(value)
                handleCheckError("teacher_id")
              }}
            >
              <SelectTrigger disabled={isLoading || isLoadingInitial || isLoadingTeacher}>
                <SelectValue placeholder="Pilih guru" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error.teacher_id ? <p className="text-xs text-red-600">{error.teacher_id}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600">Nama Kelas</Label>
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
            <Label className="text-gray-600">Level</Label>
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
            <Label className="text-gray-600">Tahun Ajaran</Label>
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
              className="bg-sky-500 text-white hover:bg-sky-600"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
