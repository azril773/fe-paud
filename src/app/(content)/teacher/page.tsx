"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import TeacherTable from "./_components/teacher-table"

export default function TeacherPage() {
  const router = useRouter()

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Guru</h1>
        <Button
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => router.push("/teacher/create")}
        >
          Create Teacher
        </Button>
      </div>

      <TeacherTable />
    </div>
  )
}
