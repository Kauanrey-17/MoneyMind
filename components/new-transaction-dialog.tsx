"use client"

import { useState, useEffect } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useFinance } from "@/context/finance-context"

import type {
  TransactionType,
  TransactionCategory,
} from "@/types/financial"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: TransactionType
}

export function NewTransactionDialog({
  open,
  onOpenChange,
  defaultType = "saida",
}: Props) {

  const { addTransaction } = useFinance()

  const [loading, setLoading] = useState(false)

  const [type, setType] =
    useState<TransactionType>(defaultType)

  const [category, setCategory] =
    useState<TransactionCategory>("variavel")

  const [amount, setAmount] = useState("")

  const [description, setDescription] = useState("")

  const [date, setDate] = useState("")

  const [error, setError] = useState<string | null>(null)

  // Inicializa data ao abrir
  useEffect(() => {
    if (open) {
      setDate(
        new Date().toISOString().split("T")[0]
      )
      setType(defaultType)
    }
  }, [open, defaultType])

  function resetForm() {
    setAmount("")
    setDescription("")
    setCategory("variavel")
    setError(null)
  }

  function validate() {

    if (!description.trim()) {
      return "Descrição obrigatória"
    }

    if (!amount) {
      return "Valor obrigatório"
    }

    const numericAmount = Number(amount)

    if (isNaN(numericAmount) || numericAmount <= 0) {
      return "Valor inválido"
    }

    if (!date) {
      return "Data obrigatória"
    }

    return null
  }

  async function handleSubmit() {

    const validationError = validate()

    if (validationError) {
      setError(validationError)
      return
    }

    try {

      setLoading(true)
      setError(null)

      await addTransaction({
        type,
        category,
        amount: Number(amount),
        description: description.trim(),
        date,
      })

      resetForm()
      onOpenChange(false)

    } catch (err) {

      console.error(err)
      setError("Erro ao adicionar transação")

    } finally {

      setLoading(false)

    }

  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="bg-card border-border">

        <DialogHeader>

          <DialogTitle>
            Nova Transação
          </DialogTitle>

          <DialogDescription>
            Adicione uma nova receita ou gasto.
          </DialogDescription>

        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">

          {/* TYPE */}
          <Field label="Tipo">

            <Select
              value={type}
              onValueChange={(v) =>
                setType(v as TransactionType)
              }
            >

              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="entrada">
                  Receita
                </SelectItem>

                <SelectItem value="saida">
                  Gasto
                </SelectItem>

              </SelectContent>

            </Select>

          </Field>

          {/* CATEGORY */}
          <Field label="Categoria">

            <Select
              value={category}
              onValueChange={(v) =>
                setCategory(
                  v as TransactionCategory
                )
              }
            >

              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="fixo">
                  Fixo
                </SelectItem>

                <SelectItem value="variavel">
                  Variável
                </SelectItem>

                <SelectItem value="emergencia">
                  Emergência
                </SelectItem>

                <SelectItem value="investimento">
                  Investimento
                </SelectItem>

                <SelectItem value="meta">
                  Meta
                </SelectItem>

              </SelectContent>

            </Select>

          </Field>

          {/* AMOUNT */}
          <Field label="Valor">

            <Input
              type="number"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

          </Field>

          {/* DESCRIPTION */}
          <Field label="Descrição">

            <Input
              placeholder="Ex: Supermercado"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

          </Field>

          {/* DATE */}
          <Field label="Data">

            <Input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

          </Field>

          {/* ERROR */}
          {error && (

            <div className="text-sm text-red-500">
              {error}
            </div>

          )}

        </div>

        <DialogFooter>

          <Button
            variant="outline"
            onClick={() =>
              onOpenChange(false)
            }
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >

            {loading
              ? "Adicionando..."
              : "Adicionar"}

          </Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  )
}

/* COMPONENT AUXILIAR */
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {

  return (
    <div className="flex flex-col gap-2">

      <label className="text-sm font-medium">
        {label}
      </label>

      {children}

    </div>
  )
}