"use client"

import { useState } from "react"
import { Plus, Target, Calendar, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useFinance } from "@/lib/finance-context"
import { formatCurrency, formatDate } from "@/lib/format"

export default function MetasPage() {
  const { goals, addGoal, removeGoal } = useFinance()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [target, setTarget] = useState("")
  const [deadline, setDeadline] = useState("")
  const [category, setCategory] = useState("")

  const handleAddGoal = () => {
    if (!title || !target || !deadline) return
    addGoal({
      title,
      target_amount: parseFloat(target),
      current_amount: 0,
      deadline,
      category: category || "geral",
    })
    setTitle("")
    setTarget("")
    setDeadline("")
    setCategory("")
    setDialogOpen(false)
  }

  const totalTarget = goals.reduce((a, g) => a + g.target_amount, 0)
  const totalCurrent = goals.reduce((a, g) => a + g.current_amount, 0)
  const overallPercent = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
            Metas Financeiras
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Defina e acompanhe seus objetivos financeiros
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Nova Meta
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10">
                <Target className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total em Metas</p>
                <p className="text-xl font-bold text-card-foreground">{formatCurrency(totalTarget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-emerald-400/10">
                <Target className="size-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Ja Acumulado</p>
                <p className="text-xl font-bold text-card-foreground">{formatCurrency(totalCurrent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-sky-400/10">
                <Target className="size-5 text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Progresso Geral</p>
                <p className="text-xl font-bold text-card-foreground">{overallPercent.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const percent = Math.min(
            (goal.current_amount / goal.target_amount) * 100,
            100
          )
          const remaining = goal.target_amount - goal.current_amount
          return (
            <Card key={goal.id} className="border-border bg-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-bold text-card-foreground">
                    {goal.title}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeGoal(goal.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                    <span className="sr-only">Remover meta</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {percent.toFixed(0)}%
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3.5" />
                      <span>Prazo: {formatDate(goal.deadline)}</span>
                    </div>
                  </div>
                  <Progress value={percent} className="h-3 bg-secondary" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-card-foreground font-medium">
                      {formatCurrency(goal.current_amount)}
                    </span>
                    <span className="text-muted-foreground">
                      de {formatCurrency(goal.target_amount)}
                    </span>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-3">
                    <span className="text-xs text-muted-foreground">
                      Faltam{" "}
                      <span className="font-semibold text-card-foreground">
                        {formatCurrency(remaining)}
                      </span>{" "}
                      para atingir sua meta
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Nova Meta Financeira</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Defina um novo objetivo financeiro para acompanhar.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-card-foreground">Titulo</label>
              <Input
                placeholder="Ex: Viagem Europa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-secondary border-border text-secondary-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-card-foreground">Valor Alvo (R$)</label>
              <Input
                type="number"
                placeholder="25000"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="bg-secondary border-border text-secondary-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-card-foreground">Prazo</label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-secondary border-border text-secondary-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-card-foreground">Categoria</label>
              <Input
                placeholder="Ex: viagem, tecnologia, educacao"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-secondary border-border text-secondary-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-border text-muted-foreground hover:text-card-foreground">
              Cancelar
            </Button>
            <Button onClick={handleAddGoal} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Criar Meta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
