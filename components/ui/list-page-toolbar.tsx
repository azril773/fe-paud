"use client"

import { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ListPageToolbarProps = {
  title: string
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  createLabel: string
  onCreateClick: () => void
  extraFilters?: ReactNode
}

export function ListPageToolbar({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari data...",
  createLabel,
  onCreateClick,
  extraFilters,
}: ListPageToolbarProps) {
  return (
    <div className=" p-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="text-xl font-semibold nonito text-gray-600">{title}</h1>

      <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:items-center">
        <Input
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className="w-full sm:min-w-64"
        />

        {extraFilters}

        <Button
          className="bg-sky-500 border border-sky-50 text-white hover:bg-sky-600"
          onClick={onCreateClick}
        >
          {createLabel}
        </Button>
      </div>
    </div>
  )
}
