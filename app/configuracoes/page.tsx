"use client"

import { Settings, User, CreditCard, Bell, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BillingPlaceholder } from "@/components/billing-placeholder"

export default function ConfiguracoesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
          Configuracoes
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie sua conta e preferencias
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <User className="size-4 text-primary" />
                Perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-card-foreground">Nome</label>
                  <Input
                    defaultValue="Usuario MoneyMind"
                    className="bg-secondary border-border text-secondary-foreground"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-card-foreground">Email</label>
                  <Input
                    defaultValue="usuario@moneymind.ai"
                    className="bg-secondary border-border text-secondary-foreground"
                  />
                </div>
                <Button className="w-fit bg-primary text-primary-foreground hover:bg-primary/90">
                  Salvar Alteracoes
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <Lock className="size-4 text-primary" />
                Seguranca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-card-foreground">Senha Atual</label>
                  <Input
                    type="password"
                    placeholder="********"
                    className="bg-secondary border-border text-secondary-foreground"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-card-foreground">Nova Senha</label>
                  <Input
                    type="password"
                    placeholder="********"
                    className="bg-secondary border-border text-secondary-foreground"
                  />
                </div>
                <Button className="w-fit bg-primary text-primary-foreground hover:bg-primary/90">
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <Bell className="size-4 text-primary" />
                Notificacoes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Alertas de gastos acima da media", enabled: true },
                  { label: "Lembrete de metas financeiras", enabled: true },
                  { label: "Relatorio semanal por email", enabled: false },
                  { label: "Insights da IA", enabled: true },
                ].map((notification) => (
                  <div
                    key={notification.label}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3"
                  >
                    <span className="text-sm text-card-foreground">{notification.label}</span>
                    <Badge
                      variant="outline"
                      className={
                        notification.enabled
                          ? "text-xs border-emerald-400/30 text-emerald-400"
                          : "text-xs border-border text-muted-foreground"
                      }
                    >
                      {notification.enabled ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <CreditCard className="size-4 text-primary" />
                Plano Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-card-foreground">Free</span>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    Ativo
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Voce esta usando o plano gratuito. Faca upgrade para o Pro e desbloqueie insights com IA, metas ilimitadas e muito mais.
                </p>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Upgrade para Pro
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
                <Settings className="size-4 text-primary" />
                Integracao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Em breve voce podera conectar sua conta bancaria para importar transacoes automaticamente.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-border text-muted-foreground hover:text-card-foreground"
                  disabled
                >
                  Em Breve
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-foreground tracking-tight mb-4 text-balance">
          Planos e Assinatura
        </h2>
        <BillingPlaceholder />
      </div>
    </div>
  )
}
