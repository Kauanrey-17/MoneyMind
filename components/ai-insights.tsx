"use client"

import { Brain, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

type InsightType = "warning" | "success" | "info"

type Insight = {
  icon: LucideIcon
  title: string
  message: string
  type: InsightType
}

const insights: Insight[] = [
  {
    icon: AlertTriangle,
    title: "Gastos com lazer acima da média",
    message:
      "Você está gastando 35% da sua renda com lazer e alimentação fora. Considere reduzir para 20%.",
    type: "warning",
  },
  {
    icon: TrendingUp,
    title: "Reserva em crescimento",
    message:
      "Se continuar no ritmo atual, sua reserva atingirá R$ 40.000 em 5 meses. Excelente progresso!",
    type: "success",
  },
  {
    icon: Lightbulb,
    title: "Oportunidade de investimento",
    message:
      "Você tem R$ 3.600 de saldo disponível. Considere alocar pelo menos 50% em investimentos.",
    type: "info",
  },
]

export function AIInsights() {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
          <Brain className="size-4 text-primary" />
          Insights da IA
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className={cn(
                "flex items-start gap-3 rounded-xl p-3 border transition-colors",
                insight.type === "warning" && "bg-amber-500/5 border-amber-500/20",
                insight.type === "success" && "bg-emerald-500/5 border-emerald-500/20",
                insight.type === "info" && "bg-sky-500/5 border-sky-500/20"
              )}
            >
              <insight.icon
                aria-hidden="true"
                className={cn(
                  "size-4 mt-0.5 shrink-0",
                  insight.type === "warning" && "text-amber-400",
                  insight.type === "success" && "text-emerald-400",
                  insight.type === "info" && "text-sky-400"
                )}
              />

              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-card-foreground">
                  {insight.title}
                </span>

                <span className="text-xs text-muted-foreground leading-relaxed">
                  {insight.message}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}