"use client"

import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Shield,
  Target,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { useFinance } from "@/context/finance-context"
import {
  formatCurrency,
  formatPercent,
  calculatePercentChange,
} from "@/lib/format"

import { cn } from "@/lib/utils"
import { useMemo } from "react"

type CardInfo = {
  title: string
  value: number
  previous: number
  icon: React.ElementType
  accentClass: string
  iconBgClass: string
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`
}

export function DashboardCards() {
  const { transactions, investments, goals } = useFinance()
  // ✅ Removido o `loading` — cards mostram dados assim que chegam

  const summary = useMemo(() => {
    const now = new Date()
    const currentMonthKey = getMonthKey(now)
    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevMonthKey = getMonthKey(prevMonth)

    let receitasAtual = 0, receitasAnterior = 0
    let gastosAtual = 0, gastosAnterior = 0

    for (const t of transactions) {
      const key = getMonthKey(new Date(t.date))
      if (t.type === "entrada") {
        if (key === currentMonthKey) receitasAtual += t.amount
        if (key === prevMonthKey) receitasAnterior += t.amount
      } else {
        if (key === currentMonthKey) gastosAtual += t.amount
        if (key === prevMonthKey) gastosAnterior += t.amount
      }
    }

    const saldoAtual = receitasAtual - gastosAtual
    const saldoAnterior = receitasAnterior - gastosAnterior
    const investidoAtual = investments.reduce((acc: number, inv: any) => acc + inv.amount, 0)
    const metasTotal = goals.reduce((acc: number, goal: any) => acc + goal.target_amount, 0)
    const reservaAtual = saldoAtual - investidoAtual

    return {
      receitasAtual, receitasAnterior,
      gastosAtual, gastosAnterior,
      saldoAtual, saldoAnterior,
      investidoAtual, investidoAnterior: 0,
      reservaAtual, reservaAnterior: 0,
      metasTotal,
    }
  }, [transactions, investments, goals])

  const cards: CardInfo[] = [
    { title: "Receitas",     value: summary.receitasAtual,  previous: summary.receitasAnterior,  icon: TrendingUp, accentClass: "text-emerald-400", iconBgClass: "bg-emerald-400/10" },
    { title: "Gastos",       value: summary.gastosAtual,    previous: summary.gastosAnterior,    icon: TrendingDown, accentClass: "text-rose-400",    iconBgClass: "bg-rose-400/10" },
    { title: "Saldo",        value: summary.saldoAtual,     previous: summary.saldoAnterior,     icon: Wallet,     accentClass: "text-sky-400",     iconBgClass: "bg-sky-400/10" },
    { title: "Investido",    value: summary.investidoAtual, previous: summary.investidoAnterior, icon: PiggyBank,  accentClass: "text-amber-400",   iconBgClass: "bg-amber-400/10" },
    { title: "Reserva",      value: summary.reservaAtual,   previous: summary.reservaAnterior,   icon: Shield,     accentClass: "text-violet-400",  iconBgClass: "bg-violet-400/10" },
    { title: "Metas",        value: summary.metasTotal,     previous: summary.metasTotal * 0.9,  icon: Target,     accentClass: "text-primary",     iconBgClass: "bg-primary/10" },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const change = calculatePercentChange(card.value, card.previous)
        const isPositive = change >= 0

        return (
          <Card
            key={card.title}
            className="border-border bg-card hover:bg-card/80 transition-all hover:scale-[1.01]"
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(card.value)}
                  </p>
                </div>

                <div className={cn("flex items-center justify-center size-10 rounded-xl", card.iconBgClass)}>
                  <card.icon className={cn("size-5", card.accentClass)} />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1">
                {isPositive
                  ? <TrendingUp className="size-3.5 text-emerald-400" />
                  : <TrendingDown className="size-3.5 text-rose-400" />
                }
                <span className={cn("text-xs font-medium", isPositive ? "text-emerald-400" : "text-rose-400")}>
                  {formatPercent(change)}
                </span>
                <span className="text-xs text-muted-foreground">vs mês anterior</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}