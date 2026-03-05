"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2, Brain } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signInWithGoogle } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin() {
    if (!email || !password) {
      setError("Preencha email e senha")
      return
    }
    setLoading(true)
    setError("")

    const { error } = await signIn(email, password)

    if (error) {
      setError("Email ou senha incorretos")
      setLoading(false)
      return
    }

    router.replace("/protect/dashboard")
    router.refresh()
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    setError("")
    try {
      await signInWithGoogle()
    } catch {
      setError("Erro ao entrar com Google. Tente novamente.")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">

        {/* LOGO */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-primary">
            <Brain className="size-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">MoneyMind</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Entre na sua conta para continuar
            </p>
          </div>
        </div>

        {/* CARD */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-5 shadow-lg">

          {/* ERRO */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 text-center">
              {error}
            </div>
          )}

          {/* GOOGLE */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 border border-border rounded-xl py-2.5 px-4 text-sm font-medium hover:bg-muted transition disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <svg className="size-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? "Conectando..." : "Continuar com Google"}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* FORM */}
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full border border-border rounded-xl px-4 py-2.5 bg-background text-sm outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-medium">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full border border-border rounded-xl px-4 py-2.5 bg-background text-sm outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || googleLoading}
              className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>

          {/* SIGNUP LINK */}
          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link
              href="/auth/signup"
              className="text-primary font-semibold hover:underline"
            >
              Criar conta grátis
            </Link>
          </p>

        </div>

      </div>
    </div>
  )
}