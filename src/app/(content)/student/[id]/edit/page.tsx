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
import { searchClasses } from "@/src/app/_api/class"
import { searchParents } from "@/src/app/_api/parent"
import { getStudentById, updateStudent } from "@/src/app/_api/student"
import { Class, ErroField, Parent } from "@/src/types/common"
import { notification } from "@/src/utils/toast"

export default function EditStudentPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
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

    const [parentResult, classResult] = await Promise.all([
      searchParents({ token }),
      searchClasses({ token }),
    ])

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

  const loadStudent = useEffectEvent(async () => {
    if (!token || !params.id) {
      return
    }

    setIsLoadingInitial(true)
    const { data, error } = await getStudentById({ token, studentId: params.id })
    setIsLoadingInitial(false)

    if (error || !data) {
      notification("Error!", error || "Siswa tidak ditemukan.", "error")
      router.push("/student")
      return
    }

    setParentId(data.parent_id || "")
    setClassId(data.class_id || "")
    setName(data.name || "")
    setGender(data.gender || "")
    setBirthDate(data.birth_date ? data.birth_date.slice(0, 10) : "")
    setNisn(data.nisn || "")
    setPreviewPhoto(data.photo || "")
  })

  useEffect(() => {
    loadOptions()
    loadStudent()
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
      notification("Error!", "ID siswa tidak valid.", "error")
      return
    }

    setIsLoading(true)
    setPageError("")

    const { error } = await updateStudent({
      token,
      studentId: params.id,
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

    notification("Sukses!", "Siswa berhasil diupdate.", "success")
    router.push("/student")
  }

  return (
    <div className="space-y-4">
      <div className="max-w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-sm">
        <div className="border-b border-slate-200/70 p-5">
          <h1 className="text-xl font-semibold text-slate-700">Edit Siswa</h1>
        </div>

        <div className="p-6">
        {pageError ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {pageError}
          </div>
        ) : null}

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-2 md:col-span-6">
            <Label className="text-gray-600">Orang Tua</Label>
            <Select
              value={parentId}
              onValueChange={(value) => {
                setParentId(value)
                handleCheckError("parent_id")
              }}
            >
              <SelectTrigger disabled={isLoading || isLoadingInitial}>
                <SelectValue placeholder="Pilih orang tua" />
              </SelectTrigger>
              <SelectContent>
                {parents.map((parent) => (
                  <SelectItem key={parent.id} value={parent.id}>
                    {parent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 space-y-2 md:col-span-6">
            <Label className="text-gray-600">Kelas</Label>
            <Select
              value={classId}
              onValueChange={(value) => {
                setClassId(value)
                handleCheckError("class_id")
              }}
            >
              <SelectTrigger disabled={isLoading || isLoadingInitial}>
                <SelectValue placeholder="Pilih kelas" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 space-y-2 md:col-span-6">
            <Label className="text-gray-600">Nama</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                handleCheckError("name")
              }}
              disabled={isLoading || isLoadingInitial}
              placeholder="Masukkan nama siswa"
            />
          </div>

          <div className="col-span-12 space-y-2 md:col-span-6">
            <Label className="text-gray-600">NISN</Label>
            <Input
              value={nisn}
              onChange={(e) => {
                setNisn(e.target.value)
                handleCheckError("nisn")
              }}
              disabled={isLoading || isLoadingInitial}
              placeholder="Masukkan NISN"
            />
          </div>

          <div className="col-span-12 space-y-2 md:col-span-6">
            <Label className="text-gray-600">Gender</Label>
            <Select
              value={gender}
              onValueChange={(value) => {
                setGender(value)
                handleCheckError("gender")
              }}
            >
              <SelectTrigger disabled={isLoading || isLoadingInitial}>
                <SelectValue placeholder="Pilih gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Laki-laki</SelectItem>
                <SelectItem value="female">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-12 space-y-2 md:col-span-6">
            <Label className="text-gray-600">Tanggal Lahir</Label>
            <Input
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value)
                handleCheckError("birth_date")
              }}
              disabled={isLoading || isLoadingInitial}
            />
          </div>

          <div className="col-span-12 space-y-2">
            <Label className="text-gray-600">Foto</Label>
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
                }
              }}
              disabled={isLoading || isLoadingInitial}
            />
            {previewPhoto ? (
              <img src={previewPhoto} alt="Preview" className="h-20 w-20 rounded object-cover" />
            ) : null}
          </div>

          <div className="col-span-12 flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/student")}
              disabled={isLoading || isLoadingInitial}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleUpdate}
              disabled={isLoading || isLoadingInitial}
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
