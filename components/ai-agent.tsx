"use client"
 
import { useState } from "react"
import { Brain, X, Sparkles, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
 
export function AIAgent() {
  const [open, setOpen] = useState(false)
 
  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground rounded-full shadow-lg transition-all duration-300 hover:scale-105 px-4 py-3",
          open && "opacity-0 pointer-events-none scale-90"
        )}
      >
        <Brain className="size-5" />
        <span className="text-sm font-semibold">Assistente IA</span>
      </button>
 
      {/* PAINEL */}
      <div className={cn(
        "fixed bottom-6 right-6 z-50 w-[360px] bg-card border border-border rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden",
        open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}>
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary">
              <Brain className="size-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">Assistente MoneyMind</p>
              <p className="text-xs text-muted-foreground">Em breve</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition">
            <X className="size-4" />
          </button>
        </div>
 
        {/* CONTEÚDO */}
        <div className="p-6 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10">
            <Sparkles className="size-8 text-primary" />
          </div>
 
          <div>
            <h3 className="font-semibold text-base mb-1">IA Financeira Personalizada</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Em breve você poderá conversar com uma IA que analisa seus dados financeiros em tempo real e dá conselhos personalizados.
            </p>
          </div>
 
          <div className="w-full flex flex-col gap-2 text-left">
            {[
              "Análise dos seus gastos",
              "Dicas de economia personalizadas",
              "Alertas de orçamento",
              "Projeções financeiras",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="size-1.5 rounded-full bg-primary shrink-0" />
                {feature}
              </div>
            ))}
          </div>
 
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary rounded-lg px-3 py-2 w-full">
            <Lock className="size-3 shrink-0" />
            <span>Requer configuração da API da Anthropic</span>
          </div>
        </div>
      </div>
    </>
  )
}