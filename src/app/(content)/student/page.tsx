"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import StudentTable from "./_components/student-table"

export default function StudentPage() {
  const router = useRouter()

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Siswa</h1>
        <Button
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => router.push("/student/create")}
        >
          Create Student
        </Button>
      </div>

      <StudentTable />
    </div>
  )
}
