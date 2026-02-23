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
  Brain,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/receitas", label: "Receitas", icon: TrendingUp },
  { href: "/gastos", label: "Gastos", icon: TrendingDown },
  { href: "/investimentos", label: "Investimentos", icon: PiggyBank },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/reserva", label: "Reserva", icon: Shield },
  { href: "/configuracoes", label: "Configuracoes", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 h-screen sticky top-0",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b border-sidebar-border">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary">
              <Brain className="size-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-foreground text-lg tracking-tight">
              MoneyMind
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary mx-auto">
            <Brain className="size-4 text-primary-foreground" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "hidden"
          )}
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">Collapse sidebar</span>
        </Button>
      </div>

      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
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
              <item.icon className={cn("size-5 shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        {!collapsed && (
          <div className="rounded-xl bg-sidebar-accent/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="size-4 text-primary" />
              <span className="text-xs font-semibold text-sidebar-foreground">
                Plano Free
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">
              Upgrade para o Pro e desbloqueie insights com IA.
            </p>
            <Button size="sm" className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90">
              Upgrade Pro
            </Button>
          </div>
        )}
        {collapsed && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(false)}
            className="w-full text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Expand sidebar</span>
          </Button>
        )}
      </div>
    </aside>
  )
}
