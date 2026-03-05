"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useFinance } from "@/context/finance-context"

import {
  formatCurrency,
  formatDate,
  getCategoryLabel,
} from "@/lib/format"

import { cn } from "@/lib/utils"

import type { Transaction } from "@/types/financial"

import { useMemo, useState } from "react"

type Props = {
  filterType?: "entrada" | "saida"
  limit?: number
}

export function TransactionTable({
  filterType,
  limit,
}: Props) {

  const { transactions, removeTransaction } =
    useFinance()

  const [removingId, setRemovingId] =
    useState<string | null>(null)

  const filtered = useMemo(() => {

    let result: Transaction[] =
      filterType
        ? transactions.filter(
            t => t.type === filterType
          )
        : transactions

    // ordenar por data mais recente
    result = result.sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )

    if (limit) {
      result = result.slice(0, limit)
    }

    return result

  }, [transactions, filterType, limit])

  async function handleRemove(id: string) {

    const confirmDelete =
      confirm("Remover esta transação?")

    if (!confirmDelete) return

    try {

      setRemovingId(id)

      await removeTransaction(id)

    } catch (error) {

      console.error(error)

    } finally {

      setRemovingId(null)

    }

  }

  if (!filtered.length) {

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">

        <div className="text-sm text-muted-foreground">

          Nenhuma transação encontrada

        </div>

      </div>
    )

  }

  return (
    <div className="overflow-x-auto">

      <table className="w-full">

        <thead>

          <tr className="border-b border-border">

            <Th>Descrição</Th>

            <Th className="hidden sm:table-cell">
              Categoria
            </Th>

            <Th className="hidden md:table-cell">
              Data
            </Th>

            <Th align="right">
              Valor
            </Th>

            <Th align="right">
              <span className="sr-only">
                Ações
              </span>
            </Th>

          </tr>

        </thead>

        <tbody>

          {filtered.map(transaction => {

            const isRemoving =
              removingId === transaction.id

            return (

              <tr
                key={transaction.id}
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
              >

                {/* DESCRIPTION */}
                <td className="py-3 px-4">

                  <div className="flex flex-col">

                    <span className="text-sm font-medium">

                      {transaction.description}

                    </span>

                    <span className="text-xs text-muted-foreground sm:hidden">

                      {getCategoryLabel(
                        transaction.category
                      )}

                    </span>

                  </div>

                </td>

                {/* CATEGORY */}
                <td className="py-3 px-4 hidden sm:table-cell">

                  <Badge variant="outline">

                    {getCategoryLabel(
                      transaction.category
                    )}

                  </Badge>

                </td>

                {/* DATE */}
                <td className="py-3 px-4 hidden md:table-cell">

                  <span className="text-sm text-muted-foreground">

                    {formatDate(transaction.date)}

                  </span>

                </td>

                {/* AMOUNT */}
                <td className="py-3 px-4 text-right">

                  <span
                    className={cn(
                      "text-sm font-semibold",

                      transaction.type === "entrada"
                        ? "text-emerald-500"
                        : "text-rose-500"
                    )}
                  >

                    {transaction.type === "entrada"
                      ? "+"
                      : "-"}

                    {formatCurrency(
                      transaction.amount
                    )}

                  </span>

                </td>

                {/* ACTION */}
                <td className="py-3 px-4 text-right">

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={isRemoving}
                    onClick={() =>
                      handleRemove(
                        transaction.id
                      )
                    }
                  >

                    <Trash2 className="size-4" />

                  </Button>

                </td>

              </tr>

            )

          })}

        </tbody>

      </table>

    </div>
  )

}

function Th({
  children,
  align,
  className,
}: {
  children: React.ReactNode
  align?: "left" | "right"
  className?: string
}) {

  return (
    <th
      className={cn(
        "py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider",

        align === "right"
          ? "text-right"
          : "text-left",

        className
      )}
    >
      {children}
    </th>
  )

}