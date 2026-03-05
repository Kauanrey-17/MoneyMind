"use client"

import { useState, useMemo } from "react"
import { Plus, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionTable } from "@/components/transaction-table"
import { NewTransactionDialog } from "@/components/new-transaction-dialog"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/format"

export default function ReceitasPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { transactions, selectedMonth } = useFinance()

  // 🔥 filtra por entrada + mês selecionado
  const receitas = useMemo(() => {
    return transactions.filter(
      (t) =>
        t.type === "entrada" &&
        new Date(t.date).toLocaleString("pt-BR", { month: "long", year: "numeric" }) === selectedMonth.toLowerCase()
    )
  }, [transactions, selectedMonth])

  const totalReceitas = useMemo(
    () => receitas.reduce((acc, t) => acc + t.amount, 0),
    [receitas]
  )

  const receitaFixa = useMemo(
    () =>
      receitas
        .filter((t) => t.category === "fixo")
        .reduce((a, t) => a + t.amount, 0),
    [receitas]
  )

  const receitaVariavel = useMemo(
    () =>
      receitas
        .filter((t) => t.category === "variavel")
        .reduce((a, t) => a + t.amount, 0),
    [receitas]
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Receitas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie todas as suas fontes de renda
          </p>
        </div>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="size-4 mr-2" />
          Nova Receita
        </Button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-emerald-400/10">
                <TrendingUp className="size-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Total do Mês
                </p>
                <p className="text-xl font-bold">
                  {formatCurrency(totalReceitas)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-sky-400/10">
                <TrendingUp className="size-5 text-sky-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Receita Fixa
                </p>
                <p className="text-xl font-bold">
                  {formatCurrency(receitaFixa)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-xl bg-amber-400/10">
                <TrendingUp className="size-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Receita Variável
                </p>
                <p className="text-xl font-bold">
                  {formatCurrency(receitaVariavel)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Todas as Receitas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionTable filterType="entrada" />
        </CardContent>
      </Card>

      <NewTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultType="entrada"
      />
    </div>
  )
}