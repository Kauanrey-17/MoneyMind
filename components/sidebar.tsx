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

import type { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

const navItems: NavItem[] = [
  { href: "/protect/dashboard",     label: "Dashboard",     icon: LayoutDashboard, exact: true },
  { href: "/protect/receitas",      label: "Receitas",      icon: TrendingUp },
  { href: "/protect/gastos",        label: "Gastos",        icon: TrendingDown },
  { href: "/protect/investimentos", label: "Investimentos", icon: PiggyBank },
  { href: "/protect/metas",         label: "Metas",         icon: Target },
  { href: "/protect/reserva",       label: "Reserva",       icon: Shield },
  { href: "/protect/configuracoes", label: "Configurações", icon: Settings },
]

// ✅ Leitura segura do localStorage (não quebra no Opera/SSR)
function safeGetStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // silencioso — Opera pode bloquear
  }
}

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // ✅ Só lê localStorage após montar no cliente
  useEffect(() => {
    const saved = safeGetStorage("sidebar:collapsed")
    if (saved !== null) setCollapsed(saved === "true")
    setMounted(true)
  }, [])

  function toggleSidebar() {
    const newState = !collapsed
    setCollapsed(newState)
    safeSetStorage("sidebar:collapsed", String(newState))
  }

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 h-screen sticky top-0",
        mounted && collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-3 h-16 border-b border-sidebar-border">
        <Link
          href="/protect/dashboard"
          className={cn(
            "flex items-center gap-2 transition-all",
            mounted && collapsed && "justify-center w-full"
          )}
        >
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary shrink-0">
            <Brain className="size-4 text-primary-foreground" />
          </div>

          {(!mounted || !collapsed) && (
            <span className="font-semibold text-sidebar-foreground text-lg tracking-tight">
              MoneyMind
            </span>
          )}
        </Link>

        {(!mounted || !collapsed) && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            aria-label="Recolher sidebar"
            className="text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className="size-4" />
          </Button>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 py-4 px-2 flex flex-col gap-1" role="navigation">
        {navItems.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-sidebar-primary/10 text-sidebar-primary"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
                mounted && collapsed && "justify-center"
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary transition-all",
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                )}
              />
              <item.icon
                className={cn(
                  "size-5 shrink-0",
                  active
                    ? "text-sidebar-primary"
                    : "text-muted-foreground group-hover:text-sidebar-foreground"
                )}
              />
              {(!mounted || !collapsed) && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-sidebar-border p-3">
        {(!mounted || !collapsed) ? (
          <div className="rounded-xl bg-sidebar-accent/50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="size-4 text-primary" />
              <span className="text-xs font-semibold text-sidebar-foreground">
                Plano Free
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Upgrade para o Pro e desbloqueie recursos avançados.
            </p>
            <Button size="sm" className="w-full text-xs">
              Upgrade Pro
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            aria-label="Expandir sidebar"
            className="w-full text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </aside>
  )
}