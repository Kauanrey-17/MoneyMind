import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
 
export async function POST(req: Request) {
  try {
    const { itemId } = await req.json()
 
    const supabase = createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
 
    if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
 
    // 1. Autentica com Pluggy
    const authResponse = await fetch("https://api.pluggy.ai/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: process.env.PLUGGY_CLIENT_ID,
        clientSecret: process.env.PLUGGY_CLIENT_SECRET,
      }),
    })
 
    const { apiKey } = await authResponse.json()
 
    // 2. Busca contas do item conectado
    const accountsResponse = await fetch(`https://api.pluggy.ai/accounts?itemId=${itemId}`, {
      headers: { "X-API-KEY": apiKey },
    })
 
    const { results: accounts } = await accountsResponse.json()
 
    let imported = 0
 
    for (const account of accounts) {
      // 3. Busca transações de cada conta (últimos 90 dias)
      const since = new Date()
      since.setDate(since.getDate() - 90)
 
      const txResponse = await fetch(
        `https://api.pluggy.ai/transactions?accountId=${account.id}&from=${since.toISOString().split("T")[0]}&pageSize=100`,
        { headers: { "X-API-KEY": apiKey } }
      )
 
      const { results: transactions } = await txResponse.json()
 
      for (const tx of transactions) {
        // Verifica se já existe (evita duplicatas)
        const { data: existing } = await supabase
          .from("transactions")
          .select("id")
          .eq("user_id", user.id)
          .eq("pluggy_id", tx.id)
          .maybeSingle()
 
        if (existing) continue
 
        // Mapeia categoria da Pluggy para as nossas
        const category = mapCategory(tx.category)
        const type = tx.amount > 0 ? "entrada" : "saida"
 
        await supabase.from("transactions").insert({
          user_id: user.id,
          type,
          category,
          amount: Math.abs(tx.amount),
          description: tx.description || tx.merchant?.name || "Transação importada",
          date: tx.date.split("T")[0],
          pluggy_id: tx.id,
        })
 
        imported++
      }
    }
 
    // Salva o item conectado
    await supabase.from("pluggy_connections").upsert({
      user_id: user.id,
      item_id: itemId,
      last_sync: new Date().toISOString(),
    })
 
    return NextResponse.json({ imported, accounts: accounts.length })
  } catch (error) {
    console.error("[Pluggy Sync] Erro:", error)
    return NextResponse.json({ error: "Erro ao sincronizar" }, { status: 500 })
  }
}
 
function mapCategory(pluggyCategory: string): string {
  const map: Record<string, string> = {
    "FOOD_AND_BEVERAGE": "variavel",
    "TRANSPORT": "variavel",
    "HOUSING": "fixo",
    "HEALTH_AND_BEAUTY": "variavel",
    "ENTERTAINMENT": "variavel",
    "EDUCATION": "fixo",
    "FINANCIAL": "investimento",
    "INCOME": "fixo",
    "TRANSFER": "variavel",
  }
  return map[pluggyCategory] || "variavel"
}