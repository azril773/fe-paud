"use client"
import { useRouter } from "next/navigation"
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { createParent } from "@/src/app/_api/parent";
import { ErroField } from "@/src/types/common";
import { notification } from "@/src/utils/toast";

export default function CreateParentPage() {
    const router = useRouter();
    const { token } = useAuth();

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pageError, setPageError] = useState<string>("");
    const [error, setError] = useState<ErroField>({});

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

    const handleCreate = async () => {
        setIsLoading(true)
        setPageError("")

        const { error } = await createParent({
            token,
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

        notification("Sukses!", "Orang tua berhasil dibuat.", "success")
        router.push("/parent")
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Buat Orang Tua</h1>
            </div>
            <div className="max-w-full rounded-lg border bg-white p-6 shadow-sm">
                {pageError ? (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {pageError}
                    </div>
                ) : null}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Nama</label>
                        <Input
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                handleCheckError("name")
                            }}
                            disabled={isLoading}
                            placeholder="Masukkan nama orang tua"
                        />
                        {error.name ? (
                            <p className="mt-1 text-sm text-red-600">{error.name}</p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Email</label>
                        <Input
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                handleCheckError("email")
                            }}
                            disabled={isLoading}
                            placeholder="Masukkan email orang tua"
                        />
                        {error.email ? (
                            <p className="mt-1 text-sm text-red-600">{error.email}</p>
                        ) : null}
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Password</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                handleCheckError("password")
                            }}
                            disabled={isLoading}
                            placeholder="Masukkan password untuk login"
                        />
                        {error.password ? (
                            <p className="mt-1 text-sm text-red-600">{error.password}</p>
                        ) : null}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/parent")}
                            disabled={isLoading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCreate}
                            disabled={isLoading}
                            className="bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            {isLoading ? "Menyimpan..." : "Buat Orang Tua"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>

    )
}