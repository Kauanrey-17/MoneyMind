"use client"

import { useState } from "react"
import { Plus, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionTable } from "@/components/transaction-table"
import { NewTransactionDialog } from "@/components/new-transaction-dialog"
import { useFinance } from "@/lib/finance-context"
import { formatCurrency } from "@/lib/format"

export default function ReceitasPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { transactions, summary } = useFinance()

  const receitas = transactions.filter((t) => t.type === "entrada")
  const totalReceitas = receitas.reduce((acc, t) => acc + t.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
            Receitas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie todas as suas fontes de renda
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Nova Receita
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-emerald-400/10">
                <TrendingUp className="size-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total do Mes</p>
                <p className="text-xl font-bold text-card-foreground">{formatCurrency(totalReceitas)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-sky-400/10">
                <TrendingUp className="size-5 text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Receita Fixa</p>
                <p className="text-xl font-bold text-card-foreground">
                  {formatCurrency(receitas.filter((t) => t.category === "fixo").reduce((a, t) => a + t.amount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-amber-400/10">
                <TrendingUp className="size-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Receita Variavel</p>
                <p className="text-xl font-bold text-card-foreground">
                  {formatCurrency(receitas.filter((t) => t.category === "variavel").reduce((a, t) => a + t.amount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-card-foreground">
            Todas as Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable filterType="entrada" />
        </CardContent>
      </Card>

      <NewTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType="entrada" />
    </div>
  )
}
