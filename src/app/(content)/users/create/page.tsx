"use client"

import { useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { useAuth } from "@/hooks/use-auth"
import { type Role, searchRoles } from "@/src/app/_api/role"
import { createUser } from "@/src/app/_api/user"
import { ErroField } from "@/src/types/common"
import { getAccessToken } from "@/src/utils/auth-token"
import { notification } from "@/src/utils/toast"

const ADMIN_DINAS_ROLE = "admin_dinas"

export default function CreateUserPage() {
    const router = useRouter()
    const { token } = useAuth()

    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [roleId, setRoleId] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [roles, setRoles] = useState<Role[]>([])
    const [pageError, setPageError] = useState<string>("")
    const [error, setError] = useState<ErroField>({})
    const selectedRole = useMemo(() => roles.find((item) => item.id === roleId), [roles, roleId])



    const loadRoles = useEffectEvent(async () => {
        const token = getAccessToken()
        if (!token) {
            return
        }
        const { data, error } = await searchRoles({ token })
        if (error) {
            setPageError(error)
            return
        }
        setPageError("")
        const filteredRoles = data.filter((role) => role.name !== ADMIN_DINAS_ROLE)
        setRoles(filteredRoles)

    })

    useEffect(() => {
        loadRoles()
    }, [])

    if (!token) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <p className="text-gray-600">Anda harus login terlebih dahulu</p>
                    </div>
                </div>
            </div>
        );
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
        const { error } = await createUser({ token, name, email, password, roleId })
        setIsLoading(false)
        if (error) {
            notification("Error!", error, "error")
            return
        }

        notification("Sukses!", "User berhasil dibuat.", "success")
        router.push("/users")
    }

    return (
        <div className="space-y-4">
            <div className="max-w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-sm">
                <div className="border-b border-slate-200/70 p-5">
                    <h1 className="text-xl font-semibold text-slate-700">Buat User</h1>
                </div>

                <div className="p-6">
                {pageError ? (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {pageError}
                    </div>
                ) : null}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-gray-600">Nama</Label>
                        <Input
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                handleCheckError("name")
                            }}
                            placeholder="Masukkan nama"
                            disabled={isLoading}
                        />
                        {error.name ? <p className="text-xs text-red-600">{error.name}</p> : null}
                    </div>
                     <div className="space-y-2">

                        <SearchableSelect
                            label="Role"
                            placeholder="pilih role"
                            items={roles}
                            onChange={setRoleId}
                            value={roleId}
                            disabled={isLoading}
                        />
                        {error.role ? <p className="text-xs text-red-600">{error.role}</p> : null}
                        {selectedRole && (
                            <p className="text-xs text-slate-500">Role terpilih: {selectedRole.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-600">Email</Label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                handleCheckError("email")
                            }}
                            placeholder="Masukkan email"
                            disabled={isLoading}
                        />
                        {error.email ? <p className="text-xs text-red-600">{error.email}</p> : null}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-600">Password</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                handleCheckError("password")
                            }}
                            placeholder="Masukkan password"
                            disabled={isLoading}
                        />
                        {error.password ? <p className="text-xs text-red-600">{error.password}</p> : null}
                    </div>

                   

                    <div className="flex gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.push("/users")} disabled={isLoading}>
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCreate}
                            disabled={isLoading}
                            className="bg-sky-500 text-white hover:bg-sky-600"
                        >
                            {isLoading ? "Menyimpan..." : "Buat User"}
                        </Button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    )
}
