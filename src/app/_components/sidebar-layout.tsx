"use client"

import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/16/solid"
import { ChevronDownIcon, FolderOpen, Users } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { routes } from "@/src/constants/common"
import { notification } from "@/src/utils/toast"

import { logout } from "../_api/auth"

const USER_MANAGEMENT_HREFS = ["/users"]
const MASTER_DATA_HREFS = ["/class", "/parent", "/student", "/teacher"]

const COLLAPSIBLE_MENU_SECTIONS = [
  {
    key: "user-management",
    label: "Manajemen Pengguna",
    icon: Users,
    iconClassName: "h-12 w-12",
    chevronClassName: "h-6 w-6",
    hrefs: USER_MANAGEMENT_HREFS,
  },
  {
    key: "master-data",
    label: "Master Data",
    icon: FolderOpen,
    iconClassName: "h-4 w-4",
    chevronClassName: "h-4 w-4",
    hrefs: MASTER_DATA_HREFS,
  },
]

const MENU_BUTTON_CLASSNAME =
  "cursor-pointer font-light data-[active=true]:bg-sky-100 data-[active=true]:text-sky-600 hover:bg-blue-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 dark:data-[active=true]:bg-sky-950/40 dark:data-[active=true]:text-sky-400"

const MENU_SUB_BUTTON_CLASSNAME =
  "cursor-pointer font-light data-[active=true]:bg-sky-100 data-[active=true]:text-sky-600 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 dark:data-[active=true]:bg-sky-950/40 dark:data-[active=true]:text-sky-400"


export default function SidebarLayout() {
  const router = useRouter()
  const pathname = usePathname()
  const { decoded } = useAuth()
  const displayName = decoded?.username || "Akun Saya"
  const displayRole = decoded?.role_name || "Pengguna"
  const displayInitial =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0]?.toUpperCase())
      .join("") || "US"
  const isActive = (href: string) => pathname.startsWith(href)
  const dashboardRoute = routes.find((route) => route.href === "/dashboard")
  const settingRoute = routes.find((route) => route.href === "/setting")

  const menuSections = COLLAPSIBLE_MENU_SECTIONS.map((section) => {
    const sectionRoutes = routes.filter((route) => section.hrefs.includes(route.href))
    return {
      ...section,
      routes: sectionRoutes,
      isActive: sectionRoutes.some((route) => isActive(route.href)),
    }
  })

  const handleLogout = async () => {
    const {error} = await logout()
    if (error.length > 0) {
      notification("Gagal Logout", error, "error")
      return
    }
    notification("Sukses!", "Anda berhasil logout.", "success")
    router.replace(`${process.env.NEXT_PUBLIC_HTTP_SECURE === "true" ? "https" : "http"}://${process.env.NEXT_PUBLIC_DOMAIN}/login`)
  }
  return (
    <Sidebar variant="inset" className="border-none">
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
      <SidebarContent className="px-0 py-1">
        {dashboardRoute && (
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem key={dashboardRoute.href}>
                  <SidebarMenuButton
                    isActive={isActive(dashboardRoute.href)}
                    onClick={() => router.push(dashboardRoute.href)}
                    className={MENU_BUTTON_CLASSNAME}
                  >
                    {dashboardRoute.icon}
                    <span>{dashboardRoute.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
       

        <SidebarGroup className="p-0 pt-1">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuSections.map((section) => {
                const SectionIcon = section.icon

                return (
                  <SidebarMenuItem key={section.key}>
                    <Collapsible
                      defaultOpen={section.isActive}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={section.isActive}
                          className={MENU_BUTTON_CLASSNAME}
                        >
                          <SectionIcon className={section.iconClassName} />
                          <span>{section.label}</span>
                          <ChevronDownIcon
                            className={`ml-auto ${section.chevronClassName} transition-transform group-data-[state=open]/collapsible:rotate-180`}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub className="gap-1">
                          {section.routes.map((route) => (
                            <SidebarMenuSubItem key={route.href}>
                              <SidebarMenuSubButton
                                isActive={isActive(route.href)}
                                onClick={() => router.push(route.href)}
                                className={MENU_SUB_BUTTON_CLASSNAME}
                              >
                                <span>{route.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
         {
          settingRoute && (
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  <SidebarMenuItem key={settingRoute.href}>
                    <SidebarMenuButton
                      isActive={isActive(settingRoute.href)}  
                      onClick={() => router.push(settingRoute.href)}
                      className={MENU_BUTTON_CLASSNAME}
                    >
                      {settingRoute.icon}
                      <span>{settingRoute.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        }

      </SidebarContent>
      <SidebarFooter className="border-t px-2 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-10 rounded-sm px-3 hover:bg-gray-100">
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-linear-to-br from-blue-400 to-purple-400 text-xs font-bold text-white">
                    {displayInitial}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold">{displayName}</span>
                    <span className="text-xs">{displayRole}</span>
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
      <SidebarRail />
    </Sidebar>
  )
}
