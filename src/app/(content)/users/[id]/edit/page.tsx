"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useMemo, useState } from "react"

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
import { type Role, searchRoles } from "@/src/app/_api/role"
import { getUserById, updateUser } from "@/src/app/_api/user"
import { ErroField } from "@/src/types/common"
import { notification } from "@/utils/toast"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { token, decoded } = useAuth()

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [roleId, setRoleId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [pageError, setPageError] = useState("")
  const [error, setError] = useState<ErroField>({})

  const selectedRole = useMemo(
    () => roles.find((item) => item.id === roleId),
    [roles, roleId],
  )
  const isAdminDinas = selectedRole?.name === "admin_dinas"

  const loadRoles = useEffectEvent(async () => {
    if (!token) {
      return
    }

    const { data, error } = await searchRoles({ token })
    if (error) {
      setPageError(error)
      return
    }

    setPageError("")
    setRoles(data)
  })

  const loadUser = useEffectEvent(async () => {
    if (!token || !params.id) {
      return
    }

    setIsLoadingInitial(true)
    const { data, error } = await getUserById({ token, userId: params.id })
    setIsLoadingInitial(false)

    if (error || !data) {
      notification("Error!", error || "User tidak ditemukan.", "error")
      router.push("/users")
      return
    }

    setName(data.name || "")
    setEmail(data.email || "")
    setRoleId(data.role_id || "")
  })

  useEffect(() => {
    loadRoles()
    loadUser()
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
      notification("Error!", "ID user tidak valid.", "error")
      return
    }

    setIsLoading(true)
    const { error } = await updateUser({
      token,
      userId: params.id,
      name,
      email,
      password,
      roleId,
      paudId: isAdminDinas ? null : decoded?.paud_id ?? null,
    })
    setIsLoading(false)

    if (error) {
      notification("Error!", error, "error")
      return
    }

    notification("Sukses!", "User berhasil diupdate.", "success")
    router.push("/users")
  }

  return (
    <div className="space-y-4">
      <div className="max-w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-sm">
        <div className="border-b border-slate-200/70 p-5">
          <h1 className="text-xl font-semibold text-slate-700">Edit User</h1>
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
              disabled={isLoading || isLoadingInitial}
            />
            {error.name ? <p className="text-xs text-red-600">{error.name}</p> : null}
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
              disabled={isLoading || isLoadingInitial}
            />
            {error.email ? <p className="text-xs text-red-600">{error.email}</p> : null}
          </div>

          <div className="space-y-2">
            <Label className="text-gray-600">Role</Label>
            <Select
              value={roleId}
              onValueChange={(value) => {
                setRoleId(value)
                handleCheckError("role")
              }}
            >
              <SelectTrigger disabled={isLoading || isLoadingInitial}>
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error.role ? <p className="text-xs text-red-600">{error.role}</p> : null}
            {selectedRole ? (
              <p className="text-xs text-slate-500">Role terpilih: {selectedRole.name}</p>
            ) : null}
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
              placeholder="Kosongkan jika tidak ingin ubah password"
              disabled={isLoading || isLoadingInitial}
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
              onClick={() => router.push("/users")}
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
