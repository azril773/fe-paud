import {
  AcademicCapIcon,
  Cog6ToothIcon,
  Square3Stack3DIcon,
} from "@heroicons/react/16/solid"

import { Route } from "@/types/common"

export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || "sipintar.com:3002"
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://sipintar.com:8080"
export const HTTP_SECURE = process.env.NEXT_PUBLIC_HTTP_SECURE
  ? process.env.NEXT_PUBLIC_HTTP_SECURE === "true"
  : false
export const ACTIVE = "active"
export const SUSPENDED = "suspended"
export const PENDING = "pending"
export const CANCELLED = "cancelled"

export const UNAUTHORIZED_CODE = 401

export const routes: Route[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <AcademicCapIcon />,
  },
  {
    href: "/setting",
    label: "Setting",
    icon: <Cog6ToothIcon />,
  },
  {
    href: "/class",
    label: "Kelas",
    icon: <Square3Stack3DIcon />,
  },
  {
    href: "/parent",
    label: "Orang Tua",
    icon: <AcademicCapIcon />,
  },
  {
    href: "/student",
    label: "Siswa",
    icon: <Square3Stack3DIcon />,
  },
  {
    href: "/teacher",
    label: "Guru",
    icon: <AcademicCapIcon />,
  },
  {
    href: "/users",
    label: "Pengguna",
    icon: <Square3Stack3DIcon />,
  },
]

