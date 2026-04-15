"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import ClassTable from "./_components/class-table"

export default function ClassPage() {
  const router = useRouter()

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Kelas</h1>
        <Button
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => router.push("/class/create")}
        >
          Create Class
        </Button>
      </div>

      <ClassTable />
    </div>
  )
}
