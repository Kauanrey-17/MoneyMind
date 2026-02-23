"use client"

import { DashboardCards } from "@/components/dashboard-cards"
import { MonthlyEvolutionChart, CategoryPieChart, ReserveLineChart } from "@/components/charts"
import { TransactionTable } from "@/components/transaction-table"
import { GoalProgress } from "@/components/goal-progress"
import { AIInsights } from "@/components/ai-insights"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visao geral das suas financas
        </p>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyEvolutionChart />
        <CategoryPieChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReserveLineChart />
        </div>
        <AIInsights />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-card-foreground">
                Transacoes Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTable limit={6} />
            </CardContent>
          </Card>
        </div>
        <GoalProgress />
      </div>
    </div>
  )
}
