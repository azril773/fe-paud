"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit User</h1>
          <p className="mt-1 text-sm text-slate-600">Ubah data user melalui form berikut.</p>
        </div>
      </div>

      {pageError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {pageError}
        </div>
      ) : null}

      <div className="max-w-full rounded-lg border bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nama</label>
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
            <label className="text-sm font-medium">Email</label>
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
            <label className="text-sm font-medium">Role</label>
            <select
              className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-slate-400"
              value={roleId}
              onChange={(e) => {
                setRoleId(e.target.value)
                handleCheckError("role")
              }}
              disabled={isLoading || isLoadingInitial}
            >
              <option value="">Pilih role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {error.role ? <p className="text-xs text-red-600">{error.role}</p> : null}
            {selectedRole ? (
              <p className="text-xs text-slate-500">Role terpilih: {selectedRole.name}</p>
            ) : null}
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
              placeholder="Kosongkan jika tidak ingin ubah password"
              disabled={isLoading || isLoadingInitial}
            />
            <p className="text-xs text-slate-500">
              Kosongkan password jika tidak ingin mengubah password lama.
            </p>
            {error.password ? <p className="text-xs text-red-600">{error.password}</p> : null}
          </div>

          <div className="flex gap-3 border-t border-slate-200 pt-6">
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
