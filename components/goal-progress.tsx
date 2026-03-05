"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/format"

export function GoalProgress() {
  const { goals } = useFinance()

  const topGoals = goals.slice(0, 3)

  if (!topGoals.length) {
    return (
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Progresso das Metas
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            Nenhuma meta cadastrada
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Progresso das Metas
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-5">
          {topGoals.map((goal) => {
            const target = goal.target_amount || 0
            const current = goal.current_amount || 0

            const percent =
              target > 0
                ? Math.min((current / target) * 100, 100)
                : 0

            const remaining = Math.max(target - current, 0)

            const isCompleted = percent >= 100

            return (
              <div key={goal.id} className="flex flex-col gap-2">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {goal.title}
                  </span>

                  <span
                    className={`text-xs font-semibold ${
                      isCompleted
                        ? "text-green-500"
                        : "text-primary"
                    }`}
                  >
                    {isCompleted ? "Concluído" : `${percent.toFixed(0)}%`}
                  </span>
                </div>

                {/* Progress bar */}
                <Progress
                  value={percent}
                  className="h-2"
                  aria-label={`Progresso da meta ${goal.title}`}
                />

                {/* Values */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">

                  <span>
                    {formatCurrency(current)} de{" "}
                    {formatCurrency(target)}
                  </span>

                  {!isCompleted && (
                    <span>
                      Faltam {formatCurrency(remaining)}
                    </span>
                  )}

                </div>

              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}