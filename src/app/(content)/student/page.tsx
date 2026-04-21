"use client"

import { Mars, Users, Venus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useEffectEvent, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ListPageToolbar } from "@/components/ui/list-page-toolbar"
import { getStudentStats } from "@/src/app/_api/student"
import { getAccessToken } from "@/src/utils/auth-token"

import StudentTable from "./_components/student-table"

type StudentStats = {
  total_students: number
  male_students: number
  female_students: number
}
export default function StudentPage() {
  const router = useRouter()
  const [searchInput, setSearchInput] = useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = useState<string>("")
  const [studentStats, setStudentStats] = useState<StudentStats>({
    total_students: 0,
    male_students: 0,
    female_students: 0,
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 400)
    return () => {
      clearTimeout(handler)
    }
  }, [searchInput])

const loadStats = useEffectEvent(async () => {
    const token = getAccessToken()
    if (!token) {
      return
    }
    const { data, error } = await getStudentStats({ token })
    if (error) {
      console.log(error)
      return
    }
    if (data) {
      setStudentStats(data)
    }

  })

  useEffect(() => {
    loadStats()
  }, [])

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="group relative overflow-hidden border-slate-200/80 bg-linear-to-br from-white via-sky-50/40 to-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-200/40 blur-2xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Siswa</CardTitle>
            <div className="rounded-lg bg-sky-100 p-2 text-sky-700 ring-1 ring-sky-200">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-2xl font-bold tracking-tight text-slate-900">{studentStats.total_students}</p>
            <p className="mt-1 text-xs text-slate-500">Jumlah seluruh data siswa</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-rose-200/70 bg-linear-to-br from-white via-rose-50/40 to-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-rose-200/40 blur-2xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Perempuan</CardTitle>
            <div className="rounded-lg bg-rose-100 p-2 text-rose-700 ring-1 ring-rose-200">
              <Venus className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-2xl font-bold tracking-tight text-rose-700">{studentStats.female_students}</p>
            <p className="mt-1 text-xs text-slate-500">Total siswa berjenis kelamin perempuan</p>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border-blue-200/70 bg-linear-to-br from-white via-blue-50/40 to-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
          <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-200/40 blur-2xl" />
          <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Laki-laki</CardTitle>
            <div className="rounded-lg bg-blue-100 p-2 text-blue-700 ring-1 ring-blue-200">
              <Mars className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <p className="text-2xl font-bold tracking-tight text-blue-700">{studentStats.male_students}</p>
            <p className="mt-1 text-xs text-slate-500">Total siswa berjenis kelamin laki-laki</p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-sm">
      <ListPageToolbar
        title="Data Siswa"
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Cari nama, NISN, atau nama orang tua..."
        createLabel="Create Student"
        onCreateClick={() => router.push("/student/create")}
      />

      <StudentTable search={debouncedSearch} currentPage={1} />
      </div>
    </div>
  )
}
