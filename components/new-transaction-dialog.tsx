"use client"

import { useState } from "react"
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
import { useFinance } from "@/lib/finance-context"
import type { TransactionType, TransactionCategory } from "@/types/financial"

type NewTransactionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: TransactionType
}

export function NewTransactionDialog({ open, onOpenChange, defaultType }: NewTransactionDialogProps) {
  const { addTransaction } = useFinance()
  const [type, setType] = useState<TransactionType>(defaultType || "saida")
  const [category, setCategory] = useState<TransactionCategory>("variavel")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const handleSubmit = () => {
    if (!amount || !description) return
    addTransaction({
      type,
      category,
      amount: parseFloat(amount),
      date,
      description,
    })
    setAmount("")
    setDescription("")
    setCategory("variavel")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Nova Transacao</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Adicione uma nova receita ou gasto ao seu controle financeiro.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-card-foreground">Tipo</label>
            <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
              <SelectTrigger className="bg-secondary border-border text-secondary-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Receita</SelectItem>
                <SelectItem value="saida">Gasto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-card-foreground">Categoria</label>
            <Select value={category} onValueChange={(v) => setCategory(v as TransactionCategory)}>
              <SelectTrigger className="bg-secondary border-border text-secondary-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixo">Fixo</SelectItem>
                <SelectItem value="variavel">Variavel</SelectItem>
                <SelectItem value="emergencia">Emergencia</SelectItem>
                <SelectItem value="investimento">Investimento</SelectItem>
                <SelectItem value="meta">Meta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-card-foreground">Valor (R$)</label>
            <Input
              type="number"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-secondary border-border text-secondary-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-card-foreground">Descricao</label>
            <Input
              placeholder="Ex: Supermercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-border text-secondary-foreground"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-card-foreground">Data</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-secondary border-border text-secondary-foreground"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border text-muted-foreground hover:text-card-foreground">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
