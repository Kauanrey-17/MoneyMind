"use client"

import { Shield, TrendingUp, Calendar, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useFinance } from "@/lib/finance-context"
import { formatCurrency } from "@/lib/format"
import { ReserveLineChart } from "@/components/charts"

export default function ReservaPage() {
  const { summary } = useFinance()

  const monthlyExpenses = summary.gastos
  const idealReserve = monthlyExpenses * 6
  const currentReserve = summary.reserva
  const percent = Math.min((currentReserve / idealReserve) * 100, 100)
  const monthsCovered = currentReserve / monthlyExpenses

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
          Reserva de Emergencia
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe sua seguranca financeira
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-violet-400/10">
                <Shield className="size-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Reserva Atual</p>
                <p className="text-xl font-bold text-card-foreground">{formatCurrency(currentReserve)}</p>
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
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Meta Ideal (6 meses)</p>
                <p className="text-xl font-bold text-card-foreground">{formatCurrency(idealReserve)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-sky-400/10">
                <Calendar className="size-5 text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Meses Cobertos</p>
                <p className="text-xl font-bold text-card-foreground">{monthsCovered.toFixed(1)} meses</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-card-foreground">
            Progresso da Reserva
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {formatCurrency(currentReserve)} de {formatCurrency(idealReserve)}
              </span>
              <span className="text-sm font-bold text-primary">{percent.toFixed(0)}%</span>
            </div>
            <Progress value={percent} className="h-4 bg-secondary" />
            <div className="rounded-xl bg-secondary/50 p-4 flex items-start gap-3">
              <Info className="size-4 text-sky-400 mt-0.5 shrink-0" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-card-foreground">
                  {percent >= 100
                    ? "Parabens! Sua reserva de emergencia esta completa!"
                    : `Faltam ${formatCurrency(idealReserve - currentReserve)} para atingir sua meta de 6 meses de gastos.`}
                </span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Especialistas recomendam manter entre 3 a 6 meses de gastos mensais como reserva de emergencia.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ReserveLineChart />
    </div>
  )
}
