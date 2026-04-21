"use client"

import { useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { useAuth } from "@/hooks/use-auth"
import { createClass } from "@/src/app/_api/class"
import { searchTeachers } from "@/src/app/_api/teacher"
import { ErroField, Teacher } from "@/src/types/common"
import { notification } from "@/src/utils/toast"

export default function CreateClassPage() {
  const router = useRouter()
  const { token } = useAuth()

  const [teacherId, setTeacherId] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [level, setLevel] = useState<string>("")
  const [academicYear, setAcademicYear] = useState<string>("")
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
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

    setPageError("")
    setTeachers(data)
  })

  useEffect(() => {
    loadTeachers()
  }, [token])

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

  const handleCreate = async () => {
    setIsLoading(true)
    setPageError("")

    const { error } = await createClass({
      token,
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

    notification("Sukses!", "Kelas berhasil dibuat.", "success")
    router.push("/class")
  }

  return (
    <div className="space-y-4">
      <div className="max-w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-sm">
        <div className="border-b border-slate-200/70 p-5">
          <h1 className="text-xl font-semibold text-slate-700">Buat Kelas</h1>
        </div>

        <div className="p-6">
        {pageError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {pageError}
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="space-y-2">

            <SearchableSelect
              label="Guru"
              items={teachers.map((teacher) => ({ id: teacher.id, name: teacher.name }))}
              value={teacherId}
              onChange={(value) => {
                setTeacherId(value)
                handleCheckError("teacher_id")
              }}
              placeholder="Pilih guru"
              disabled={isLoading || isLoadingTeacher}
            />
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
              placeholder="Contoh: 2025/2026"
            />
            {error.academic_year ? <p className="text-xs text-red-600">{error.academic_year}</p> : null}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/class")}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isLoading || isLoadingTeacher}
              className="bg-sky-500 text-white hover:bg-sky-600"
            >
              {isLoading ? "Menyimpan..." : "Buat Kelas"}
            </Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
