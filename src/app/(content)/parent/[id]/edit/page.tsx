"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { getParentById, updateParent } from "@/src/app/_api/parent"
import { ErroField } from "@/src/types/common"
import { notification } from "@/src/utils/toast"

export default function EditParentPage() {
    const router = useRouter()
    const params = useParams<{ id: string }>()
    const { token } = useAuth()

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(false)
    const [pageError, setPageError] = useState<string>("")
    const [error, setError] = useState<ErroField>({})

    const loadParent = useEffectEvent(async () => {
        if (!token || !params.id) {
            return
        }

        setIsLoadingInitial(true)
        const { data, error } = await getParentById({ token, parentId: params.id })
        setIsLoadingInitial(false)

        if (error || !data) {
            notification("Error!", error || "Orang tua tidak ditemukan.", "error")
            router.push("/parent")
            return
        }

        setName(data.name || "")
        setEmail(data.email || "")
    })

    useEffect(() => {
        loadParent()
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
            notification("Error!", "ID orang tua tidak valid.", "error")
            return
        }

        setIsLoading(true)
        setPageError("")

        const { error } = await updateParent({
            token,
            parentId: params.id,
            name,
            email,
            password,
        })

        setIsLoading(false)

        if (error) {
            setPageError(error)
            notification("Error!", error, "error")
            return
        }

        notification("Sukses!", "Orang tua berhasil diupdate.", "success")
        router.push("/parent")
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Edit Orang Tua</h1>
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
                            placeholder="Masukkan nama orang tua"
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
                            placeholder="Masukkan email orang tua"
                        />
                        {error.email ? <p className="text-xs text-red-600">{error.email}</p> : null}
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
                            onClick={() => router.push("/parent")}
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