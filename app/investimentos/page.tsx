"use client"

import { PiggyBank, TrendingUp, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useFinance } from "@/lib/finance-context"
import { formatCurrency, getInvestmentTypeLabel } from "@/lib/format"
import { cn } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function InvestimentosPage() {
  const { investments } = useFinance()

  const totalInvested = investments.reduce((acc, inv) => acc + inv.amount, 0)
  const avgReturn =
    investments.reduce((acc, inv) => acc + inv.return_rate, 0) / investments.length

  const typeData = investments.reduce(
    (acc, inv) => {
      const existing = acc.find((a) => a.type === getInvestmentTypeLabel(inv.type))
      if (existing) {
        existing.amount += inv.amount
      } else {
        acc.push({ type: getInvestmentTypeLabel(inv.type), amount: inv.amount })
      }
      return acc
    },
    [] as { type: string; amount: number }[]
  )

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
          Investimentos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe sua carteira de investimentos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-amber-400/10">
                <PiggyBank className="size-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Investido</p>
                <p className="text-xl font-bold text-card-foreground">{formatCurrency(totalInvested)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-emerald-400/10">
                <TrendingUp className="size-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Rentabilidade Media</p>
                <p className="text-xl font-bold text-emerald-400">{avgReturn.toFixed(1)}% a.a.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-sky-400/10">
                <BarChart3 className="size-5 text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Ativos</p>
                <p className="text-xl font-bold text-card-foreground">{investments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Carteira de Investimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {investments.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-card-foreground">
                        {inv.name}
                      </span>
                      <Badge
                        variant="outline"
                        className="w-fit text-xs border-border text-muted-foreground"
                      >
                        {getInvestmentTypeLabel(inv.type)}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-bold text-card-foreground">
                        {formatCurrency(inv.amount)}
                      </span>
                      <span
                        className={cn(
                          "text-xs font-medium",
                          inv.return_rate >= 0 ? "text-emerald-400" : "text-rose-400"
                        )}
                      >
                        +{inv.return_rate}% a.a.
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-card-foreground">
              Alocacao por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.025 260)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="type" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.[0]) return null
                      return (
                        <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
                          <p className="text-xs text-popover-foreground">{formatCurrency(payload[0].value as number)}</p>
                        </div>
                      )
                    }}
                  />
                  <Bar dataKey="amount" fill="#34d399" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
