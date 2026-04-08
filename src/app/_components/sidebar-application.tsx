"use client"

import { Bell, Search } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"

import SidebarLayout from "./sidebar-layout"

export default function SidebarApplication({
  children,
}: {
  children: React.ReactNode
}) {
  const { decoded } = useAuth()
  const pathname = usePathname()
  return (
    <SidebarProvider>
      <SidebarLayout />
      <main className="flex w-full flex-col bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-slate-600 dark:text-slate-400" />
              <div className="">
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                  {decoded?.paud_name || "Paud"}
                </h1>
                <Breadcrumb>
                  <BreadcrumbList>
                    {pathname
                      .split("/")
                      .slice(1)
                      .map((item, index) => (
                        <div key={index}>
                          <BreadcrumbItem
                            key={index}
                            className="text-xs text-slate-500 dark:text-slate-400"
                          >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </BreadcrumbItem>
                          {index < pathname.split("/").length - 2 && (
                            <BreadcrumbSeparator />
                          )}
                        </div>
                      ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari..."
                    className="rounded-lg border border-slate-200 bg-slate-50 py-2 pr-4 pl-10 text-sm text-slate-900 placeholder-slate-500 transition-all focus:border-blue-400 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-400"
                  />
                </div>
              </div>
              <button className="relative rounded-lg p-2 text-slate-600 transition-all hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
          </div>
        </div>
        <div className="m-3 flex-1 overflow-auto rounded-lg p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
