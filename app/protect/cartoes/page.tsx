"use client"
 
import { useState, useMemo } from "react"
import { Plus, CreditCard, Trash2, Eye, EyeOff, Calendar, TrendingDown, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useFinance } from "@/context/finance-context"
import { formatCurrency } from "@/lib/format"
import { cn } from "@/lib/utils"
 
const CARD_COLORS = [
  { label: "Roxo", value: "#6366f1" },
  { label: "Verde", value: "#10b981" },
  { label: "Azul", value: "#3b82f6" },
  { label: "Rosa", value: "#ec4899" },
  { label: "Laranja", value: "#f97316" },
  { label: "Cinza", value: "#6b7280" },
]
 
const BRANDS = [
  { label: "Visa", value: "visa" },
  { label: "Mastercard", value: "mastercard" },
  { label: "Elo", value: "elo" },
  { label: "Amex", value: "amex" },
  { label: "Hipercard", value: "hipercard" },
]
 
function CardVisual({ card, showDigits }: { card: any; showDigits: boolean }) {
  return (
    <div
      className="relative w-full aspect-[1.6/1] rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-xl"
      style={{ background: `linear-gradient(135deg, ${card.color}, ${card.color}99)` }}
    >
      <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" />
      <div className="absolute -right-4 -bottom-8 size-40 rounded-full bg-white/10" />
 
      <div className="flex items-center justify-between relative z-10">
        <span className="text-white/90 font-semibold text-sm">{card.name}</span>
        <CreditCard className="size-6 text-white/80" />
      </div>
 
      <div className="relative z-10">
        <p className="text-white/60 text-xs mb-1">Número</p>
        <p className="text-white font-mono text-lg tracking-widest">
          {showDigits ? `•••• •••• •••• ${card.last_digits}` : "•••• •••• •••• ••••"}
        </p>
      </div>
 
      <div className="flex items-end justify-between relative z-10">
        <div>
          <p className="text-white/60 text-xs">Vencimento</p>
          <p className="text-white text-sm font-medium">Dia {card.due_day}</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-xs">Limite</p>
          <p className="text-white text-sm font-medium">{formatCurrency(card.limit_amount)}</p>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-xs uppercase font-bold">{card.brand}</p>
        </div>
      </div>
    </div>
  )
}
 
function InstallmentCalc() {
  const [amount, setAmount] = useState("")
  const [installments, setInstallments] = useState("12")
  const [rate, setRate] = useState("2.99")
 
  const monthly = useMemo(() => {
    const a = parseFloat(amount) || 0
    const n = parseInt(installments) || 1
    const r = parseFloat(rate) / 100
 
    if (r === 0) return a / n
 
    // Fórmula de juros compostos
    return (a * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  }, [amount, installments, rate])
 
  const total = monthly * parseInt(installments || "1")
  const interest = total - (parseFloat(amount) || 0)
 
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <TrendingDown className="size-4 text-primary" />
          Calculadora de Parcelamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Valor da compra</label>
            <Input
              type="number"
              placeholder="1000"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Parcelas</label>
            <Select value={installments} onValueChange={setInstallments}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6,7,8,9,10,11,12,18,24,36,48].map(n => (
                  <SelectItem key={n} value={String(n)}>{n}x</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground">Juros ao mês (%)</label>
            <Input
              type="number"
              step="0.01"
              placeholder="2.99"
              value={rate}
              onChange={e => setRate(e.target.value)}
            />
          </div>
        </div>
 
        {parseFloat(amount) > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Por mês</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(monthly)}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total pago</p>
              <p className="text-lg font-bold">{formatCurrency(total)}</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Juros totais</p>
              <p className={cn("text-lg font-bold", interest > 0 ? "text-rose-400" : "text-emerald-400")}>
                {formatCurrency(interest)}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
 
export default function CartoesPage() {
  const { cards = [], addCard, removeCard, transactions = [] } = useFinance() as any
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showDigits, setShowDigits] = useState<Record<string, boolean>>({})
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"cards" | "calc">("cards")
 
  const [form, setForm] = useState({
    name: "", last_digits: "", brand: "visa",
    limit_amount: "", due_day: "10", color: "#6366f1",
  })
 
  function handleChange(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }
 
  async function handleAdd() {
    if (!form.name || !form.last_digits || !form.limit_amount) return
    setLoading(true)
    await addCard({
      name: form.name,
      last_digits: form.last_digits,
      brand: form.brand,
      limit_amount: parseFloat(form.limit_amount),
      due_day: parseInt(form.due_day),
      color: form.color,
      current_bill: 0,
    })
    setForm({ name: "", last_digits: "", brand: "visa", limit_amount: "", due_day: "10", color: "#6366f1" })
    setLoading(false)
    setDialogOpen(false)
  }
 
  // Calcula fatura de cada cartão baseado nas transações
  const cardBills = useMemo(() => {
    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
 
    return cards.map((card: any) => {
      const cardTx = transactions.filter((t: any) => t.card_id === card.id)
 
      const currentBill = cardTx
        .filter((t: any) => {
          const d = new Date(t.date)
          const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
          return m === currentMonth && t.type === "saida"
        })
        .reduce((a: number, t: any) => a + t.amount, 0)
 
      // Histórico dos últimos 6 meses
      const history = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        const label = d.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
        const amount = cardTx
          .filter((t: any) => {
            const td = new Date(t.date)
            const tm = `${td.getFullYear()}-${String(td.getMonth() + 1).padStart(2, "0")}`
            return tm === m && t.type === "saida"
          })
          .reduce((a: number, t: any) => a + t.amount, 0)
        return { month: label, amount }
      }).reverse()
 
      return { ...card, currentBill, history }
    })
  }, [cards, transactions])
 
  const totalLimit = cards.reduce((a: number, c: any) => a + c.limit_amount, 0)
  const totalBill = cardBills.reduce((a: number, c: any) => a + c.currentBill, 0)
  const selectedCardData = cardBills.find((c: any) => c.id === selectedCard)
 
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cartões</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie seus cartões e faturas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === "calc" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(activeTab === "calc" ? "cards" : "calc")}
          >
            <TrendingDown className="size-4" />
            Calcular parcelas
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            Novo Cartão
          </Button>
        </div>
      </div>
 
      {/* CALCULADORA */}
      {activeTab === "calc" && <InstallmentCalc />}
 
      {/* RESUMO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total de Cartões</p>
            <p className="text-2xl font-bold">{cards.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Limite Total</p>
            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalLimit)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Fatura Atual</p>
            <p className="text-2xl font-bold text-rose-400">{formatCurrency(totalBill)}</p>
          </CardContent>
        </Card>
      </div>
 
      {/* LISTA DE CARTÕES */}
      {cards.length === 0 ? (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-3 text-center">
            <CreditCard className="size-10 text-muted-foreground" />
            <p className="text-muted-foreground">Nenhum cartão cadastrado ainda</p>
            <Button onClick={() => setDialogOpen(true)} size="sm">
              <Plus className="size-4" />
              Adicionar primeiro cartão
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CARTÕES */}
          <div className="flex flex-col gap-6">
            {cardBills.map((card: any) => (
              <div
                key={card.id}
                className={cn(
                  "flex flex-col gap-3 p-4 rounded-2xl border transition-all cursor-pointer",
                  selectedCard === card.id
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
                onClick={() => setSelectedCard(selectedCard === card.id ? null : card.id)}
              >
                <CardVisual card={card} showDigits={showDigits[card.id] || false} />
 
                <div className="flex items-center justify-between px-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Fatura atual</p>
                    <p className="text-sm font-semibold text-rose-400">
                      {formatCurrency(card.currentBill)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Disponível</p>
                    <p className="text-sm font-semibold text-emerald-400">
                      {formatCurrency(card.limit_amount - card.currentBill)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Vence dia</p>
                    <p className="text-sm font-semibold">{card.due_day}</p>
                  </div>
                </div>
 
                {/* BARRA DE USO */}
                <div className="w-full bg-secondary rounded-full h-1.5">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      (card.currentBill / card.limit_amount) > 0.8
                        ? "bg-rose-400"
                        : (card.currentBill / card.limit_amount) > 0.5
                        ? "bg-amber-400"
                        : "bg-primary"
                    )}
                    style={{ width: `${Math.min((card.currentBill / card.limit_amount) * 100, 100)}%` }}
                  />
                </div>
 
                <div className="flex gap-2">
                  <Button
                    variant="outline" size="sm" className="flex-1 gap-2"
                    onClick={e => { e.stopPropagation(); setShowDigits(prev => ({ ...prev, [card.id]: !prev[card.id] })) }}
                  >
                    {showDigits[card.id] ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    {showDigits[card.id] ? "Ocultar" : "Ver número"}
                  </Button>
                  <Button
                    variant="outline" size="sm" className="text-rose-500 hover:text-rose-500"
                    onClick={e => { e.stopPropagation(); removeCard(card.id) }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
 
          {/* DETALHE DO CARTÃO SELECIONADO */}
          <div className="flex flex-col gap-4">
            {selectedCardData ? (
              <>
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      Histórico de Faturas — {selectedCardData.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-3">
                      {selectedCardData.history.map((h: any, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-12">{h.month}</span>
                          <div className="flex-1 bg-secondary rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-primary transition-all"
                              style={{
                                width: `${selectedCardData.limit_amount > 0
                                  ? Math.min((h.amount / selectedCardData.limit_amount) * 100, 100)
                                  : 0}%`
                              }}
                            />
                          </div>
                          <span className={cn(
                            "text-xs font-medium w-24 text-right",
                            h.amount > 0 ? "text-rose-400" : "text-muted-foreground"
                          )}>
                            {h.amount > 0 ? formatCurrency(h.amount) : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
 
                {/* TRANSAÇÕES DO CARTÃO */}
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">
                      Transações deste mês
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {transactions.filter((t: any) => t.card_id === selectedCardData.id).length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Nenhuma transação associada a este cartão
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {transactions
                          .filter((t: any) => t.card_id === selectedCardData.id)
                          .slice(0, 8)
                          .map((t: any) => (
                            <div key={t.id} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                              <div>
                                <p className="text-sm font-medium">{t.description}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(t.date).toLocaleDateString("pt-BR")}
                                  {t.installment_total > 1 && (
                                    <Badge variant="outline" className="ml-2 text-[10px] py-0">
                                      {t.installment_current}/{t.installment_total}x
                                    </Badge>
                                  )}
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-rose-400">
                                -{formatCurrency(t.amount)}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
                  <CreditCard className="size-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Clique em um cartão para ver o histórico de faturas
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
 
      {/* DIALOG NOVO CARTÃO */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Novo Cartão</DialogTitle>
          </DialogHeader>
 
          <div className="flex flex-col gap-4 py-2">
            <CardVisual
              card={{ ...form, limit_amount: parseFloat(form.limit_amount) || 0, due_day: parseInt(form.due_day) || 10 }}
              showDigits={true}
            />
 
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Nome do cartão</label>
                <Input placeholder="Ex: Nubank" value={form.name} onChange={e => handleChange("name", e.target.value)} />
              </div>
 
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Últimos 4 dígitos</label>
                <Input placeholder="1234" maxLength={4} value={form.last_digits} onChange={e => handleChange("last_digits", e.target.value)} />
              </div>
 
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Bandeira</label>
                <Select value={form.brand} onValueChange={v => handleChange("brand", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {BRANDS.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
 
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Limite (R$)</label>
                <Input type="number" placeholder="5000" value={form.limit_amount} onChange={e => handleChange("limit_amount", e.target.value)} />
              </div>
 
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">Dia do vencimento</label>
                <Input type="number" min={1} max={31} placeholder="10" value={form.due_day} onChange={e => handleChange("due_day", e.target.value)} />
              </div>
 
              <div className="col-span-2 flex flex-col gap-2">
                <label className="text-xs font-medium text-muted-foreground">Cor do cartão</label>
                <div className="flex gap-2">
                  {CARD_COLORS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => handleChange("color", c.value)}
                      className={cn(
                        "size-7 rounded-full border-2 transition-all",
                        form.color === c.value ? "border-white scale-110" : "border-transparent"
                      )}
                      style={{ background: c.value }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
 
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={loading}>
              {loading ? "Adicionando..." : "Adicionar Cartão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}