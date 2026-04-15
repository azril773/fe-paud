"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { getTeacherById, updateTeacher } from "@/src/app/_api/teacher"
import { ErroField } from "@/src/types/common"
import { notification } from "@/src/utils/toast"

export default function EditTeacherPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const { token } = useAuth()

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [phone, setPhone] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(false)
    const [pageError, setPageError] = useState<string>("")
    const [error, setError] = useState<ErroField>({})

    const loadTeacher = useEffectEvent(async () => {
        if (!token || !params.id) {
            return
        }

        setIsLoadingInitial(true)
        const { data, error } = await getTeacherById({ token, teacherId: params.id })
        setIsLoadingInitial(false)

        if (error || !data) {
            notification("Error!", error || "Guru tidak ditemukan.", "error")
            router.push("/teacher")
            return
        }

        setName(data.name || "")
        setEmail(data.email || "")
        setPhone(data.phone || "")
    })

    useEffect(() => {
        loadTeacher()
    }, [token, params.id])

    if (!token) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-screen">
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
            notification("Error!", "ID guru tidak valid.", "error")
            return
        }

        setIsLoading(true)
        setPageError("")

        const { error } = await updateTeacher({
            token,
            teacherId: params.id,
            name,
            email,
            phone,
            password,
        })

        setIsLoading(false)

        if (error) {
            setPageError(error)
            notification("Error!", error, "error")
            return
        }

        notification("Sukses!", "Guru berhasil diupdate.", "success")
        router.push("/teacher")
    }

    return (
        <div className="">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Edit Guru</h1>
            </div>

            <div className="max-w-full rounded-lg border bg-white p-6 shadow-sm">
                {pageError ? (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {pageError}
                    </div>
                ) : null}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nama</label>
                        <Input
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                handleCheckError("name")
                            }}
                            disabled={isLoading || isLoadingInitial}
                            placeholder="Masukkan nama guru"
                        />
                        {error.name ? <p className="text-xs text-red-600">{error.name}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                handleCheckError("email")
                            }}
                            disabled={isLoading || isLoadingInitial}
                            placeholder="Masukkan email guru"
                        />
                        {error.email ? <p className="text-xs text-red-600">{error.email}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">No. Telepon</label>
                        <Input
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value)
                                handleCheckError("phone")
                            }}
                            disabled={isLoading || isLoadingInitial}
                            placeholder="Masukkan nomor telepon guru"
                        />
                        {error.phone ? <p className="text-xs text-red-600">{error.phone}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                handleCheckError("password")
                            }}
                            disabled={isLoading || isLoadingInitial}
                            placeholder="Kosongkan jika tidak ingin ubah password"
                        />
                        <p className="text-xs text-slate-500">
                            Kosongkan password jika tidak ingin mengubah password lama.
                        </p>
                        {error.password ? <p className="text-xs text-red-600">{error.password}</p> : null}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/teacher")}
                            disabled={isLoading || isLoadingInitial}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpdate}
                            disabled={isLoading || isLoadingInitial}
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
