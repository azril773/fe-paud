"use client"

import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/16/solid"
import { ChevronDownIcon } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { DOMAIN, HTTP_SECURE, routes } from "@/src/constants/common"
import { notification } from "@/src/utils/toast"

import { logout } from "../_api/auth"


export default function SidebarLayout() {
  const router = useRouter()
  const pathname = usePathname()
  const isActive = (href: string) => pathname.startsWith(href)

  const handleLogout = async () => {
    const { error } = await logout()
    if (error.length > 0) {
      notification("Error!", error, "error")
      return
    }
    window.location.href = (HTTP_SECURE ? "https://" : "http://") + DOMAIN + "/login"
  }
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
      <SidebarFooter className="border-t px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-10 rounded-lg px-3 hover:bg-gray-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-400 to-purple-400 text-xs font-bold text-white">
                    OR
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold">Orang Tua</span>
                    <span className="text-xs">Akun Saya</span>
                  </div>
                  <ChevronDownIcon className="ml-auto h-4 w-4 text-gray-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuItem>
                  <span>Profil Saya</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Pengaturan Akun</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Bantuan</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:bg-red-50 focus:text-red-600"
                  onClick={handleLogout}
                >
                  <ArrowRightEndOnRectangleIcon className="mr-2 h-4 w-4" />
                  <span>Keluar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
