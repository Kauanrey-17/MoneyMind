"use client"
 
import { Building2, ShieldCheck, Zap, RefreshCw, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BankConnect } from "@/components/bank-connect"
import Link from "next/link"
 
const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Seguro e criptografado",
    description: "Conexão via Open Finance Brasil. Nunca armazenamos sua senha bancária.",
  },
  {
    icon: Zap,
    title: "Importação automática",
    description: "Transações importadas automaticamente dos últimos 90 dias.",
  },
  {
    icon: RefreshCw,
    title: "Sincronização manual",
    description: "Sincronize quando quiser para trazer as transações mais recentes.",
  },
]
 
const BANKS = [
  "Nubank", "Itaú", "Bradesco", "Banco do Brasil",
  "Caixa", "Santander", "Inter", "C6 Bank",
  "BTG", "XP", "Sicoob", "Sicredi",
]
 
export default function BancosPage() {
  return (
    <div className="flex flex-col gap-6">
 
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bancos Conectados</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Conecte seus bancos e importe transações automaticamente
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/protect/cartoes">
            <CreditCard className="size-4" />
            Ver Cartões
          </Link>
        </Button>
      </div>
 
      {/* FEATURES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <Card key={f.title} className="border-border bg-card">
            <CardContent className="pt-6 flex flex-col gap-2">
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10">
                <f.icon className="size-5 text-primary" />
              </div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {f.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
 
      {/* CONEXÃO COM BANCOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BankConnect />
 
        {/* BANCOS SUPORTADOS */}
        <Card className="border-border bg-card">
          <CardContent className="pt-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <p className="text-sm font-semibold">Bancos suportados</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {BANKS.map((bank) => (
                <span
                  key={bank}
                  className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full"
                >
                  {bank}
                </span>
              ))}
            </div>
            <div className="mt-2 p-3 bg-primary/5 border border-primary/20 rounded-xl">
              <p className="text-xs text-muted-foreground leading-relaxed">
                💡 <strong className="text-foreground">Dica:</strong> Após conectar seu banco, 
                as transações importadas aparecerão automaticamente no Dashboard e 
                poderão ser associadas aos seus cartões.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
 
    </div>
  )
}