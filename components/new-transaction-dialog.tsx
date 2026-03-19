"use client"
 
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFinance } from "@/context/finance-context"
import type { TransactionType, TransactionCategory } from "@/types/financial"
 
type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: TransactionType
}
 
export function NewTransactionDialog({ open, onOpenChange, defaultType = "saida" }: Props) {
  const { addTransaction, cards = [] } = useFinance() as any
 
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState<TransactionType>(defaultType)
  const [category, setCategory] = useState<TransactionCategory>("variavel")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [cardId, setCardId] = useState("none")
  const [installments, setInstallments] = useState("1")
  const [error, setError] = useState<string | null>(null)
 
  useEffect(() => {
    if (open) {
      setDate(new Date().toISOString().split("T")[0])
      setType(defaultType)
      setCardId("none")
      setInstallments("1")
    }
  }, [open, defaultType])
 
  function resetForm() {
    setAmount(""); setDescription(""); setCategory("variavel")
    setCardId("none"); setInstallments("1"); setError(null)
  }
 
  function validate() {
    if (!description.trim()) return "Descrição obrigatória"
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return "Valor inválido"
    if (!date) return "Data obrigatória"
    return null
  }
 
  async function handleSubmit() {
    const err = validate()
    if (err) { setError(err); return }
 
    try {
      setLoading(true)
      setError(null)
 
      const totalInstallments = parseInt(installments) || 1
      const installmentAmount = Number(amount) / totalInstallments
 
      if (totalInstallments > 1) {
        // Cria uma transação por parcela em meses futuros
        for (let i = 0; i < totalInstallments; i++) {
          const installmentDate = new Date(date)
          installmentDate.setMonth(installmentDate.getMonth() + i)
 
          await addTransaction({
            type, category,
            amount: installmentAmount,
            description: `${description.trim()} (${i + 1}/${totalInstallments})`,
            date: installmentDate.toISOString().split("T")[0],
            card_id: cardId === "none" ? null : cardId,
            installment_current: i + 1,
            installment_total: totalInstallments,
          })
        }
      } else {
        await addTransaction({
          type, category,
          amount: Number(amount),
          description: description.trim(),
          date,
          card_id: cardId === "none" ? null : cardId,
          installment_current: 1,
          installment_total: 1,
        })
      }
 
      resetForm()
      onOpenChange(false)
    } catch (err) {
      setError("Erro ao adicionar transação")
    } finally {
      setLoading(false)
    }
  }
 
  const installmentValue = Number(amount) / (parseInt(installments) || 1)
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>Adicione uma nova receita ou gasto.</DialogDescription>
        </DialogHeader>
 
        <div className="flex flex-col gap-4 py-2">
 
          <Field label="Tipo">
            <Select value={type} onValueChange={v => setType(v as TransactionType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Receita</SelectItem>
                <SelectItem value="saida">Gasto</SelectItem>
              </SelectContent>
            </Select>
          </Field>
 
          <Field label="Categoria">
            <Select value={category} onValueChange={v => setCategory(v as TransactionCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="fixo">Fixo</SelectItem>
                <SelectItem value="variavel">Variável</SelectItem>
                <SelectItem value="emergencia">Emergência</SelectItem>
                <SelectItem value="investimento">Investimento</SelectItem>
                <SelectItem value="meta">Meta</SelectItem>
              </SelectContent>
            </Select>
          </Field>
 
          <Field label="Valor (R$)">
            <Input type="number" inputMode="decimal" placeholder="0,00"
              value={amount} onChange={e => setAmount(e.target.value)} />
          </Field>
 
          <Field label="Descrição">
            <Input placeholder="Ex: Supermercado"
              value={description} onChange={e => setDescription(e.target.value)} />
          </Field>
 
          <Field label="Data">
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </Field>
 
          {/* CARTÃO */}
          {type === "saida" && cards.length > 0 && (
            <Field label="Cartão (opcional)">
              <Select value={cardId} onValueChange={setCardId}>
                <SelectTrigger><SelectValue placeholder="Nenhum cartão" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sem cartão</SelectItem>
                  {cards.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} •••• {c.last_digits}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
 
          {/* PARCELAMENTO */}
          {type === "saida" && (
            <Field label="Parcelas">
              <Select value={installments} onValueChange={setInstallments}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,18,24].map(n => (
                    <SelectItem key={n} value={String(n)}>
                      {n === 1 ? "À vista" : `${n}x ${Number(amount) > 0 ? `de ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(installmentValue)}` : ""}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {parseInt(installments) > 1 && Number(amount) > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {installments}x de {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(installmentValue)} — Total: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(amount))}
                </p>
              )}
            </Field>
          )}
 
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
 
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adicionando..." : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
 
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}