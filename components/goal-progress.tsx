"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useFinance } from "@/lib/finance-context"
import { formatCurrency } from "@/lib/format"

export function GoalProgress() {
  const { goals } = useFinance()

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-card-foreground">
          Progresso das Metas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          {goals.slice(0, 3).map((goal) => {
            const percent = Math.min(
              (goal.current_amount / goal.target_amount) * 100,
              100
            )
            const remaining = goal.target_amount - goal.current_amount
            return (
              <div key={goal.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-card-foreground">
                    {goal.title}
                  </span>
                  <span className="text-xs font-semibold text-primary">
                    {percent.toFixed(0)}%
                  </span>
                </div>
                <Progress value={percent} className="h-2 bg-secondary" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(goal.current_amount)} de{" "}
                    {formatCurrency(goal.target_amount)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Faltam {formatCurrency(remaining)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
