"use client"

import { useState } from "react"
import { Plus, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionTable } from "@/components/transaction-table"
import { NewTransactionDialog } from "@/components/new-transaction-dialog"
import { CategoryPieChart } from "@/components/charts"
import { useFinance } from "@/lib/finance-context"
import { formatCurrency } from "@/lib/format"

export default function GastosPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { transactions } = useFinance()

  const gastos = transactions.filter((t) => t.type === "saida")
  const totalGastos = gastos.reduce((acc, t) => acc + t.amount, 0)
  const fixos = gastos.filter((t) => t.category === "fixo").reduce((a, t) => a + t.amount, 0)
  const variaveis = gastos.filter((t) => t.category === "variavel").reduce((a, t) => a + t.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
            Gastos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe e controle seus gastos mensais
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          Novo Gasto
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-rose-400/10">
                <TrendingDown className="size-5 text-rose-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total de Gastos</p>
                <p className="text-xl font-bold text-card-foreground">{formatCurrency(totalGastos)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-violet-400/10">
                <TrendingDown className="size-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Gastos Fixos</p>
                <p className="text-xl font-bold text-card-foreground">{formatCurrency(fixos)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-amber-400/10">
                <TrendingDown className="size-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Gastos Variaveis</p>
                <p className="text-xl font-bold text-card-foreground">{formatCurrency(variaveis)}</p>
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
                Todos os Gastos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTable filterType="saida" />
            </CardContent>
          </Card>
        </div>
        <CategoryPieChart />
      </div>

      <NewTransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} defaultType="saida" />
    </div>
  )
}
