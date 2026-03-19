"use client"
 
import { useState } from "react"
import { Building2, RefreshCw, CheckCircle, AlertCircle, Loader2, Plug, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFinance } from "@/context/finance-context"
import { cn } from "@/lib/utils"
 
// Import dinâmico para evitar SSR
import dynamic from "next/dynamic"
const PluggyConnect = dynamic(
  () => import("react-pluggy-connect").then(mod => mod.PluggyConnect),
  { ssr: false }
)
 
type Connection = {
  item_id: string
  bank_name: string
  last_sync: string
}
 
export function BankConnect() {
  const { reload, cards = [] } = useFinance() as any
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState<string | null>(null)
  const [connectToken, setConnectToken] = useState<string | null>(null)
  const [widgetOpen, setWidgetOpen] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
 
  async function handleConnect() {
    setLoading(true)
    setMessage(null)
 
    try {
      const res = await fetch("/api/pluggy/auth", { method: "POST" })
      const data = await res.json()
 
      if (data.error || !data.accessToken) {
        setMessage({ type: "error", text: "Erro ao conectar com Pluggy. Verifique suas credenciais no .env.local" })
        setLoading(false)
        return
      }
 
      setConnectToken(data.accessToken)
      setWidgetOpen(true)
      setLoading(false)
    } catch (err) {
      console.error("[BankConnect]", err)
      setMessage({ type: "error", text: "Erro inesperado. Tente novamente." })
      setLoading(false)
    }
  }
 
  async function handleSuccess(itemData: any) {
    setWidgetOpen(false)
    setConnectToken(null)
    const bankName = itemData?.item?.connector?.name || "Banco conectado"
    await syncItem(itemData.item.id, bankName)
  }
 
  async function syncItem(itemId: string, bankName: string) {
    setSyncing(itemId)
    setMessage(null)
 
    try {
      const res = await fetch("/api/pluggy/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      })
 
      const { imported, accounts, error } = await res.json()
 
      if (error) {
        setMessage({ type: "error", text: error })
      } else {
        setMessage({
          type: "success",
          text: `✅ ${imported} transações importadas de ${accounts} conta(s)!`
        })
        setConnections(prev => {
          const exists = prev.find(c => c.item_id === itemId)
          if (exists) {
            return prev.map(c => c.item_id === itemId
              ? { ...c, last_sync: new Date().toISOString() }
              : c
            )
          }
          return [...prev, { item_id: itemId, bank_name: bankName, last_sync: new Date().toISOString() }]
        })
        await reload()
      }
    } catch {
      setMessage({ type: "error", text: "Erro ao sincronizar transações." })
    } finally {
      setSyncing(null)
    }
  }
 
  return (
    <>
      {/* WIDGET PLUGGY */}
      {widgetOpen && connectToken && (
        <PluggyConnect
          connectToken={connectToken}
          includeSandbox={true}
          onSuccess={handleSuccess}
          onError={(error: any) => {
            console.error("[Pluggy]", error)
            setMessage({ type: "error", text: "Erro ao conectar o banco." })
            setWidgetOpen(false)
          }}
          onClose={() => {
            setWidgetOpen(false)
            setConnectToken(null)
          }}
        />
      )}
 
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Building2 className="size-4 text-primary" />
            Bancos Conectados
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
 
          {/* MENSAGEM */}
          {message && (
            <div className={cn(
              "flex items-center gap-2 text-sm rounded-lg px-3 py-2",
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            )}>
              {message.type === "success"
                ? <CheckCircle className="size-4 shrink-0" />
                : <AlertCircle className="size-4 shrink-0" />
              }
              {message.text}
            </div>
          )}
 
          {/* CONEXÕES ATIVAS */}
          {connections.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Conexões ativas
              </p>
              {connections.map((conn) => (
                <div key={conn.item_id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl border border-border">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{conn.bank_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Sync: {new Date(conn.last_sync).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"
                      onClick={() => syncItem(conn.item_id, conn.bank_name)}
                      disabled={!!syncing}
                    >
                      {syncing === conn.item_id
                        ? <Loader2 className="size-3.5 animate-spin" />
                        : <RefreshCw className="size-3.5" />
                      }
                    </Button>
                    <Button variant="outline" size="sm"
                      className="text-rose-500 hover:text-rose-500"
                      onClick={() => setConnections(prev => prev.filter(c => c.item_id !== conn.item_id))}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
 
          {/* CARTÕES */}
          {cards.length > 0 && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Seus cartões
              </p>
              <div className="flex flex-wrap gap-2">
                {cards.map((card: any) => (
                  <div key={card.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs"
                    style={{ borderColor: card.color + "60" }}
                  >
                    <div className="size-2 rounded-full" style={{ background: card.color }} />
                    {card.name} •••• {card.last_digits}
                  </div>
                ))}
              </div>
            </div>
          )}
 
          {/* BOTÃO */}
          <Button onClick={handleConnect} disabled={loading || widgetOpen} className="w-full gap-2"
            variant={connections.length > 0 ? "outline" : "default"}
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : <Plug className="size-4" />}
            {loading ? "Carregando..." : "Conectar novo banco"}
          </Button>
 
          <p className="text-xs text-muted-foreground text-center">
            🔒 Conexão segura via Open Finance Brasil • Powered by Pluggy
          </p>
        </CardContent>
      </Card>
    </>
  )
}