import { NextResponse } from "next/server"
 
export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json()
 
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: `Você é um assistente financeiro pessoal do app MoneyMind.
Ajude o usuário a entender e melhorar suas finanças com base nos dados abaixo.
 
${context}
 
REGRAS:
- Responda sempre em português brasileiro
- Seja direto, amigável e use emojis com moderação  
- Baseie respostas nos dados reais do usuário
- Dê conselhos práticos e personalizados
- Respostas curtas (máximo 3 parágrafos)
- Se perguntarem algo fora de finanças, redirecione gentilmente`,
        messages: messages
          .filter((m: any) => m.role !== "system")
          .map((m: any) => ({
            role: m.role,
            content: m.content,
          })),
      }),
    })
 
    if (!response.ok) {
      const err = await response.json()
      console.error("[AI Agent] Erro API:", err)
      return NextResponse.json(
        { message: "Serviço de IA temporariamente indisponível. Tente novamente." },
        { status: 500 }
      )
    }
 
    const data = await response.json()
    const message = data.content?.[0]?.text || "Não consegui processar sua pergunta."
 
    return NextResponse.json({ message })
  } catch (error) {
    console.error("[AI Agent] Erro:", error)
    return NextResponse.json(
      { message: "Erro ao conectar com a IA. Tente novamente." },
      { status: 500 }
    )
  }
}