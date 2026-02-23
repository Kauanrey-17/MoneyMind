"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFinance } from "@/lib/finance-context"
import { formatCurrency, formatDate, getCategoryLabel } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/types/financial"

type TransactionTableProps = {
  filterType?: "entrada" | "saida"
  limit?: number
}

export function TransactionTable({ filterType, limit }: TransactionTableProps) {
  const { transactions, removeTransaction } = useFinance()

  let filtered: Transaction[] = filterType
    ? transactions.filter((t) => t.type === filterType)
    : transactions

  if (limit) {
    filtered = filtered.slice(0, limit)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Descricao
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
              Categoria
            </th>
            <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
              Data
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Valor
            </th>
            <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider w-[60px]">
              <span className="sr-only">Acoes</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
            >
              <td className="py-3 px-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-card-foreground">
                    {transaction.description}
                  </span>
                  <span className="text-xs text-muted-foreground sm:hidden">
                    {getCategoryLabel(transaction.category)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 hidden sm:table-cell">
                <Badge
                  variant="outline"
                  className="text-xs border-border text-muted-foreground"
                >
                  {getCategoryLabel(transaction.category)}
                </Badge>
              </td>
              <td className="py-3 px-4 hidden md:table-cell">
                <span className="text-sm text-muted-foreground">
                  {formatDate(transaction.date)}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    transaction.type === "entrada"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  )}
                >
                  {transaction.type === "entrada" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeTransaction(transaction.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                  <span className="sr-only">Remover transacao</span>
                </Button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                Nenhuma transacao encontrada.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
