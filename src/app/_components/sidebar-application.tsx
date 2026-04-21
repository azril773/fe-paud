"use client"

import { Bell, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"

import SidebarLayout from "./sidebar-layout"

export default function SidebarApplication({
  children,
}: {
  children: React.ReactNode
}) {
  const { decoded } = useAuth()
  return (
    <SidebarProvider>
      <SidebarLayout />
      <SidebarInset className="flex w-full flex-col bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 ">
        <div className="sticky top-0 z-40   backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-600 dark:text-slate-400" />
              <div className="">
                <h2 className="text-md  font-bold text-gray-800 sm:text-lg dark:text-white">
                  {decoded?.paud_name || "Paud"}
                </h2>
               
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Cari..."
                    className="w-55 rounded-lg border-slate-200 bg-slate-50 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
            </div>
          </div>
        </div>
        <div className="m-3 flex-1 overflow-auto rounded-lg p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
