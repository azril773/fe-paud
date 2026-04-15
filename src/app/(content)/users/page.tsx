"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import UserTable from "./_components/users-table";

export default function UsersPage() {
  const router = useRouter()

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Users</h1>
        <Button
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => router.push("/users/create")}
        >
          Create Users
        </Button>
      </div>

      <UserTable />
    </div>
  )
}
