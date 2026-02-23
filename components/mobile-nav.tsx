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

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/receitas", label: "Receitas", icon: TrendingUp },
  { href: "/gastos", label: "Gastos", icon: TrendingDown },
  { href: "/investimentos", label: "Investimentos", icon: PiggyBank },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/reserva", label: "Reserva", icon: Shield },
  { href: "/configuracoes", label: "Configuracoes", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-primary/10 text-sidebar-primary"
                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <item.icon className={cn("size-5", isActive && "text-sidebar-primary")} />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
