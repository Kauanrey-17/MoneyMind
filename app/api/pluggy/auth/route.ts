import { NextResponse } from "next/server"
 
// Gera um connect token para o widget da Pluggy
export async function POST() {
  try {
    // 1. Autentica com a Pluggy
    const authResponse = await fetch("https://api.pluggy.ai/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: process.env.PLUGGY_CLIENT_ID,
        clientSecret: process.env.PLUGGY_CLIENT_SECRET,
      }),
    })
 
    if (!authResponse.ok) {
      const err = await authResponse.json()
      console.error("[Pluggy Auth]", err)
      return NextResponse.json({ error: "Erro ao autenticar com Pluggy" }, { status: 500 })
    }
 
    const { apiKey } = await authResponse.json()
 
    // 2. Gera connect token para o widget
    const tokenResponse = await fetch("https://api.pluggy.ai/connect_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({}),
    })
 
    if (!tokenResponse.ok) {
      return NextResponse.json({ error: "Erro ao gerar connect token" }, { status: 500 })
    }
 
    const { accessToken } = await tokenResponse.json()
 
    return NextResponse.json({ accessToken })
  } catch (error) {
    console.error("[Pluggy Auth] Erro:", error)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}