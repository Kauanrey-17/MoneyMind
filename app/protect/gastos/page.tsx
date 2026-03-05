"use client"

import { useState, useMemo } from "react"
import { Plus, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TransactionTable } from "@/components/transaction-table"
import { NewTransactionDialog } from "@/components/new-transaction-dialog"
import { CategoryPieChart } from "@/components/charts"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/format"

export default function GastosPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { transactions, loading } = useFinance()

  const gastos = useMemo(
    () => transactions.filter((t) => t.type === "saida"),
    [transactions]
  )

  const totalGastos = useMemo(
    () => gastos.reduce((acc, t) => acc + t.amount, 0),
    [gastos]
  )

  const fixos = useMemo(
    () =>
      gastos
        .filter((t) => t.category === "fixo")
        .reduce((a, t) => a + t.amount, 0),
    [gastos]
  )

  const variaveis = useMemo(
    () =>
      gastos
        .filter((t) => t.category === "variavel")
        .reduce((a, t) => a + t.amount, 0),
    [gastos]
  )

  if (loading) {
    return <div className="p-6">Carregando gastos...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Gastos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe e controle seus gastos mensais
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="size-4" />
          Novo Gasto
        </Button>
      </div>

      {gastos.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Você ainda não possui gastos cadastrados.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground uppercase">
                  Total de Gastos
                </p>
                <p className="text-xl font-bold">
                  {formatCurrency(totalGastos)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground uppercase">
                  Gastos Fixos
                </p>
                <p className="text-xl font-bold">
                  {formatCurrency(fixos)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground uppercase">
                  Gastos Variáveis
                </p>
                <p className="text-xl font-bold">
                  {formatCurrency(variaveis)}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">
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
        </>
      )}

      <NewTransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultType="saida"
      />
    </div>
  )
}