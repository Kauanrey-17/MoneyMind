"use client"

import { Check, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mes",
    description: "Para comecar a organizar suas financas.",
    features: [
      "Dashboard basico",
      "Controle de receitas e gastos",
      "3 metas financeiras",
      "Graficos simples",
    ],
    current: true,
  },
  {
    name: "Pro",
    price: "R$ 19,90",
    period: "/mes",
    description: "Para quem quer maximizar seus resultados.",
    features: [
      "Tudo do plano Free",
      "Insights com IA ilimitados",
      "Metas ilimitadas",
      "Exportar relatorios",
      "Suporte prioritario",
      "Graficos avancados",
    ],
    current: false,
    highlighted: true,
  },
]

export function BillingPlaceholder() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={cn(
            "border-border bg-card relative",
            plan.highlighted && "border-primary/50 ring-1 ring-primary/20"
          )}
        >
          {plan.highlighted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-primary text-primary-foreground">
                <Sparkles className="size-3 mr-1" />
                Recomendado
              </Badge>
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-card-foreground">
                {plan.name}
              </CardTitle>
              {plan.current && (
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  Atual
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-bold text-card-foreground">
                {plan.price}
              </span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2.5 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="size-4 text-primary shrink-0" />
                  <span className="text-sm text-card-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className={cn(
                "w-full",
                plan.current
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              disabled={plan.current}
            >
              {plan.current ? "Plano Atual" : "Fazer Upgrade"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
