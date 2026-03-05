"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Target,
  Shield,
  Settings,
} from "lucide-react"

import type { LucideIcon } from "lucide-react"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/receitas",
    label: "Receitas",
    icon: TrendingUp,
  },
  {
    href: "/gastos",
    label: "Gastos",
    icon: TrendingDown,
  },
  {
    href: "/investimentos",
    label: "Investimentos",
    icon: PiggyBank,
  },
  {
    href: "/metas",
    label: "Metas",
    icon: Target,
  },
  {
    href: "/reserva",
    label: "Reserva",
    icon: Shield,
  },
  {
    href: "/configuracoes",
    label: "Configurações",
    icon: Settings,
  },
]

export function MobileNav() {
  const pathname = usePathname()

  function isActiveRoute(item: NavItem) {
    if (item.exact) {
      return pathname === item.href
    }

    return pathname.startsWith(item.href)
  }

  return (
    <nav
      className="flex flex-col gap-1 px-3 py-4"
      role="navigation"
      aria-label="Menu principal"
    >
      {navItems.map((item) => {
        const isActive = isActiveRoute(item)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",

              isActive
                ? "bg-sidebar-primary/10 text-sidebar-primary"
                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >

            {/* Active indicator */}
            <span
              className={cn(
                "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary transition-all duration-200",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
              )}
            />

            {/* Icon */}
            <item.icon
              className={cn(
                "size-5 transition-colors duration-200",

                isActive
                  ? "text-sidebar-primary"
                  : "text-muted-foreground group-hover:text-sidebar-foreground"
              )}
            />

            {/* Label */}
            <span>{item.label}</span>

          </Link>
        )
      })}
    </nav>
  )
}