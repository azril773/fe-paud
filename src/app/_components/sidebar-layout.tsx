"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { routes } from "@/src/constants/common"
import {
  AcademicCapIcon,
  Square3Stack3DIcon,
  Cog6ToothIcon,
} from "@heroicons/react/16/solid"
import { User2, LogOut } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

export default function SidebarLayout() {
  const { token, decoded } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const isActive = (href: string) => pathname.startsWith(href)
  return (
    <Sidebar className="border-none bg-linear-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
      <SidebarHeader className="pt-5">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center">
            <Image src={"/logo.png"} alt="Logo" width={60} height={60} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              SiPintar
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paud Platform
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="my-3" />
      <SidebarContent className="px-0 py-2">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem className="space-y-2">
            {routes.map((route) => (
              <SidebarMenuButton
                onClick={() => router.push(route.href)}
                key={route.href}
                className={`group relative mx-2 cursor-pointer rounded-lg transition-all duration-200 ${
                  isActive(route.href)
                    ? "group relative mx-2 rounded-lg bg-amber-100 text-amber-600 transition-all duration-200 dark:bg-amber-950/40 dark:text-amber-400"
                    : "text-slate-700 hover:bg-blue-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
                }`}
              >
                {route.icon}
                <span className="font-medium">{route.label}</span>
              </SidebarMenuButton>
            ))}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-slate-200 dark:border-slate-800">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem >
            <SidebarMenuButton className="rounded-lg text-slate-700 transition-all p-3 duration-200 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-purple-400 to-pink-400">
                <User2 size={16} className="text-white" />
              </div>
              <div className="ml-2 flex-1 text-left">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {decoded?.username || "Unknown User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {"admin@sipintar.id"}
                </p>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
