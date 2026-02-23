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
import { useFinance } from "@/lib/finance-context"
import { formatCurrency } from "@/lib/format"

const CHART_COLORS = [
  "#34d399",
  "#818cf8",
  "#fbbf24",
  "#f472b6",
  "#38bdf8",
  "#a78bfa",
  "#fb923c",
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-popover-foreground mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-xs" style={{ color: entry.color }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

export function MonthlyEvolutionChart() {
  const { monthlyData } = useFinance()

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-card-foreground">
          Evolucao Mensal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.025 260)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
              <Bar dataKey="receitas" name="Receitas" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="gastos" name="Gastos" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function CategoryPieChart() {
  const { categoryBreakdown } = useFinance()

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-card-foreground">
          Distribuicao de Gastos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {categoryBreakdown.map((_, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null
                  return (
                    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
                      <p className="text-xs font-medium text-popover-foreground">
                        {payload[0].name}: {formatCurrency(payload[0].value as number)}
                      </p>
                    </div>
                  )
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                formatter={(value: string) => <span className="text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function ReserveLineChart() {
  const { monthlyData } = useFinance()

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
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.025 260)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "oklch(0.6 0.02 260)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="reserva"
                name="Reserva"
                stroke="#818cf8"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#818cf8", stroke: "oklch(0.17 0.02 260)", strokeWidth: 2 }}
                activeDot={{ r: 6, fill: "#818cf8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
