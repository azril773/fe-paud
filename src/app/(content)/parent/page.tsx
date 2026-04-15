"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import ParentTable from "./_components/parent-table"


export default function ParentPage() {
  const router = useRouter()

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Data Orang Tua</h1>
        <Button
          className="bg-emerald-600 text-white hover:bg-emerald-700"
          onClick={() => router.push("/parent/create")}
        >
          Create Parent
        </Button>
      </div>

      <ParentTable />
    </div>
  )
}
