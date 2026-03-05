"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/format"
import { useMemo } from "react"

const CHART_COLORS = [
  "#34d399",
  "#818cf8",
  "#fbbf24",
  "#f472b6",
  "#38bdf8",
  "#a78bfa",
  "#fb923c",
]

/* ===============================
   TOOLTIP
================================= */

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: any[]
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      {label && (
        <p className="text-xs font-medium text-popover-foreground mb-1">
          {label}
        </p>
      )}
      {payload.map((entry, index) => (
        <p key={index} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

/* ===============================
   MONTHLY EVOLUTION
================================= */

export function MonthlyEvolutionChart() {
  const { transactions } = useFinance()

  const monthlyData = useMemo(() => {
    const grouped: Record<
      string,
      { receitas: number; gastos: number; reserva: number }
    > = {}

    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleDateString("pt-BR", {
        month: "short",
      })

      if (!grouped[month]) {
        grouped[month] = { receitas: 0, gastos: 0, reserva: 0 }
      }

      if (t.type === "entrada") {
        grouped[month].receitas += t.amount
      } else {
        grouped[month].gastos += t.amount
      }

      grouped[month].reserva =
        grouped[month].receitas - grouped[month].gastos
    })

    return Object.entries(grouped).map(([month, values]) => ({
      month,
      ...values,
    }))
  }, [transactions])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-card-foreground">
          Evolução Mensal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="receitas" fill="#34d399" />
              <Bar dataKey="gastos" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

/* ===============================
   CATEGORY PIE
================================= */

export function CategoryPieChart() {
  const { transactions } = useFinance()

  const categoryBreakdown = useMemo(() => {
    const grouped: Record<string, number> = {}

    transactions
      .filter((t) => t.type === "saida")
      .forEach((t) => {
        grouped[t.category] = (grouped[t.category] || 0) + t.amount
      })

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value,
    }))
  }, [transactions])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-card-foreground">
          Distribuição de Gastos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

/* ===============================
   RESERVE LINE
================================= */

export function ReserveLineChart() {
  const { transactions } = useFinance()

  const monthlyData = useMemo(() => {
    const grouped: Record<string, number> = {}

    transactions.forEach((t) => {
      const month = new Date(t.date).toLocaleDateString("pt-BR", {
        month: "short",
      })

      if (!grouped[month]) grouped[month] = 0

      if (t.type === "entrada") {
        grouped[month] += t.amount
      } else {
        grouped[month] -= t.amount
      }
    })

    return Object.entries(grouped).map(([month, reserva]) => ({
      month,
      reserva,
    }))
  }, [transactions])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-card-foreground">
          Crescimento da Reserva
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="reserva"
                stroke="#818cf8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}