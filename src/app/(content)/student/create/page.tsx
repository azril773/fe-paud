"use client"

import { useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { searchClasses } from "@/src/app/_api/class"
import { searchParents } from "@/src/app/_api/parent"
import { createStudent } from "@/src/app/_api/student"
import { Class, ErroField, Parent } from "@/src/types/common"
import { notification } from "@/src/utils/toast"

export default function CreateStudentPage() {
  const router = useRouter()
  const { token } = useAuth()

  const [parentId, setParentId] = useState<string>("")
  const [classId, setClassId] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [gender, setGender] = useState<string>("")
  const [birthDate, setBirthDate] = useState<string>("")
  const [nisn, setNisn] = useState<string>("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [previewPhoto, setPreviewPhoto] = useState<string>("")

  const [parents, setParents] = useState<Parent[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(false)
  const [pageError, setPageError] = useState<string>("")
  const [error, setError] = useState<ErroField>({})

  const loadOptions = useEffectEvent(async () => {
    if (!token) {
      return
    }

    setIsLoadingInitial(true)
    const [parentResult, classResult] = await Promise.all([
      searchParents({ token }),
      searchClasses({ token }),
    ])
    setIsLoadingInitial(false)

    if (parentResult.error) {
      setPageError(parentResult.error)
      return
    }
    if (classResult.error) {
      setPageError(classResult.error)
      return
    }

    setParents(parentResult.data)
    setClasses(classResult.data)
  })

  useEffect(() => {
    loadOptions()
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

    const { error } = await createStudent({
      token,
      parentId,
      classId,
      name,
      gender,
      birthDate,
      nisn,
      photo,
    })

    setIsLoading(false)

    if (error) {
      setPageError(error)
      notification("Error!", error, "error")
      return
    }

    notification("Sukses!", "Siswa berhasil dibuat.", "success")
    router.push("/student")
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Buat Siswa</h1>
      </div>

      <div className="max-w-full rounded-lg border bg-white p-6 shadow-sm">
        {pageError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {pageError}
          </div>
        ) : null}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Orang Tua</label>
            <select
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              value={parentId}
              onChange={(e) => {
                setParentId(e.target.value)
                handleCheckError("parent_id")
              }}
              disabled={isLoading || isLoadingInitial}
            >
              <option value="">Pilih orang tua</option>
              {parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Kelas</label>
            <select
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              value={classId}
              onChange={(e) => {
                setClassId(e.target.value)
                handleCheckError("class_id")
              }}
              disabled={isLoading || isLoadingInitial}
            >
              <option value="">Pilih kelas</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Nama</label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                handleCheckError("name")
              }}
              disabled={isLoading}
              placeholder="Masukkan nama siswa"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <select
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value)
                handleCheckError("gender")
              }}
              disabled={isLoading}
            >
              <option value="">Pilih gender</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tanggal Lahir</label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value)
                handleCheckError("birth_date")
              }}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">NISN</label>
            <Input
              value={nisn}
              onChange={(e) => {
                setNisn(e.target.value)
                handleCheckError("nisn")
              }}
              disabled={isLoading}
              placeholder="Masukkan NISN"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Foto</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setPhoto(file)
                handleCheckError("photo")
                if (file) {
                  const reader = new FileReader()
                  reader.onloadend = () => setPreviewPhoto(reader.result as string)
                  reader.readAsDataURL(file)
                } else {
                  setPreviewPhoto("")
                }
              }}
              disabled={isLoading}
            />
            {previewPhoto ? (
              <img src={previewPhoto} alt="Preview" className="h-20 w-20 rounded object-cover" />
            ) : null}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/student")}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleCreate}
              disabled={isLoading || isLoadingInitial}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isLoading ? "Menyimpan..." : "Buat Siswa"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
