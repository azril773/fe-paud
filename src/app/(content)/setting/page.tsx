"use client"

import { Building2, Camera, Globe2, Save, ShieldCheck } from "lucide-react"
import { useEffect, useEffectEvent, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCurrentPaud, updatePaud } from "@/src/app/_api/paud"
import { ErroField } from "@/src/types/common"
import { getAccessToken } from "@/src/utils/auth-token"
import { notification } from "@/src/utils/toast"

export default function SettingPage() {
    const [paudName, setPaudName] = useState<string>("")
    const [subdomain, setSubdomain] = useState<string>("")
    const [status, setStatus] = useState<string>("active")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isFetchingProfile, setIsFetchingProfile] = useState<boolean>(true)
    const [pageError, setPageError] = useState<string>("")
    const [error, setError] = useState<ErroField>({})

    const loadCurrentPaud = useEffectEvent(async (showNotification = true) => {
        const token = getAccessToken()
        if (!token) {
            setPageError("Sesi login tidak valid. Silakan login ulang.")
            if (showNotification) {
                notification("Error!", "Sesi login tidak valid. Silakan login ulang.", "error")
            }
            return
        }
        
        setIsFetchingProfile(true)
        const { data, error } = await getCurrentPaud({ token })
        setIsFetchingProfile(false)

        if (error) {
            setPageError(error)
            if (showNotification) {
                notification("Error!", error, "error")
            }
            return
        }

        if (data) {
            setPaudName(data.name)
            setSubdomain(data.subdomain)
            setStatus(data.status || "active")
            setPageError("")
        } else {
            setPageError("Gagal memuat data PAUD.")
            if (showNotification) {
                notification("Error!", "Gagal memuat data PAUD.", "error")
            }
        }
    })

    useEffect(() => {
        void loadCurrentPaud()
    }, [])

    const handleCheckError = (field: string) => {
        if (error[field]) {
            setError((prev) => {
                const next = { ...prev }
                delete next[field]
                return next
            })
        }
    }

    const handleReset = () => {
        void loadCurrentPaud(false)
        setError({})
    }

    const initials = useMemo(() => {
        const sourceName = paudName || ""
        return sourceName
            .split(" ")
            .filter(Boolean)
            .map((word: string) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
    }, [paudName])

    const handleUpdate = async () => {

        const token = getAccessToken()
        if (!token) {
            setPageError("Sesi login tidak valid. Silakan login ulang.")
            notification("Error!", "Sesi login tidak valid. Silakan login ulang.", "error")
            return
        }

        const trimmedPaudName = paudName.trim()
        const trimmedSubdomain = subdomain.trim()
        const nextError: ErroField = {}

        if (!trimmedPaudName) {
            nextError.paud_name = "Nama PAUD wajib diisi"
        }

        if (!trimmedSubdomain) {
            nextError.subdomain = "Subdomain wajib diisi"
        } else if (!/^[a-z0-9-]+$/.test(trimmedSubdomain)) {
            nextError.subdomain = "Subdomain hanya boleh huruf kecil, angka, dan tanda minus"
        }

        if (Object.keys(nextError).length > 0) {
            setError(nextError)
            return
        }

        setError({})
        setPageError("")
        setIsLoading(true)

        const { error } = await updatePaud({ token, name: trimmedPaudName, subdomain: trimmedSubdomain })

        setIsLoading(false)

        if (error) {
            setPageError(error)
            notification("Error!", error, "error")
            return
        }

        notification("Sukses!", "Berhasil memperbarui setting PAUD", "success")
    }

    return (
        <div className="space-y-3">
            <Card className="group relative overflow-hidden border-slate-200/80 bg-linear-to-br from-white via-emerald-50/45 to-white shadow-sm">
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-200/40 blur-2xl" />
                <CardHeader className="relative pb-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <CardTitle className="text-xl font-semibold tracking-tight text-slate-900">Setting PAUD</CardTitle>
                            <CardDescription className="mt-2 text-slate-600">
                                Kelola informasi PAUD seperti nama, subdomain, logo, dan status. Ini masih UI dulu, handler backend bisa disambung nanti.
                            </CardDescription>
                        </div>
                        <div className="hidden rounded-xl bg-emerald-100 p-2.5 text-emerald-700 ring-1 ring-emerald-200 sm:block">
                            <Building2 className="h-5 w-5" />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
                <Card className="relative overflow-hidden border-slate-200/75 bg-linear-to-br from-white via-slate-50/60 to-white shadow-sm xl:col-span-1">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-200/40 blur-2xl" />
                    <CardHeader className="relative">
                        <CardTitle className="text-base text-slate-900">Logo PAUD</CardTitle>
                        <CardDescription className="text-slate-600">
                            Upload logo untuk identitas lembaga pada dashboard dan dokumen.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="relative space-y-4">
                        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-100 text-slate-500">
                            {initials ? (
                                <span className="text-3xl font-semibold tracking-tight text-slate-700">
                                    {initials}
                                </span>
                            ) : (
                                <Building2 className="h-12 w-12" />
                            )}
                        </div>

                        <Button type="button" variant="outline" className="w-full">
                            <Camera className="mr-2 h-4 w-4" />
                            Pilih Logo
                        </Button>

                        <p className="text-center text-xs text-slate-500">Format PNG/JPG, maksimal 2MB</p>
                    </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-slate-200/75 bg-white/90 shadow-sm xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base text-slate-900">Informasi PAUD</CardTitle>
                        <CardDescription className="text-slate-600">
                            Data pada form ini merepresentasikan entity PAUD.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {pageError ? (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {pageError}
                            </div>
                        ) : null}

                        <div className="space-y-5">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="paud_name">Nama PAUD</Label>
                                    <Input
                                        id="paud_name"
                                        placeholder="Masukkan nama PAUD"
                                        value={paudName}
                                        onChange={(e) => {
                                            setPaudName(e.target.value)
                                            handleCheckError("paud_name")
                                        }}
                                        disabled={isLoading}
                                    />
                                    {error.paud_name ? <p className="text-xs text-red-600">{error.paud_name}</p> : null}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="subdomain">Subdomain</Label>
                                    <div className="relative">
                                        <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="subdomain"
                                            className="pl-9"
                                            placeholder="contoh: paud-melati"
                                            value={subdomain}
                                            onChange={(e) => {
                                                setSubdomain(e.target.value)
                                                handleCheckError("subdomain")
                                            }}
                                            disabled={isLoading}
                                        />
                                    </div>
                                    {error.subdomain ? <p className="text-xs text-red-600">{error.subdomain}</p> : null}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="status">Status</Label>
                                    <div className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
                                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                        <span>{isFetchingProfile ? "Memuat..." : status}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Referensi status: active, suspended, pending, cancelled.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 pt-4">
                                <Button type="button" variant="outline" onClick={handleReset} disabled={isLoading}>
                                    Reset
                                </Button>
                                <Button type="button" onClick={handleUpdate} className="bg-emerald-600 text-white hover:bg-emerald-700" disabled={isLoading}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isLoading ? "Menyimpan..." : "Simpan Setting PAUD"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}