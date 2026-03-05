"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function SignupPage() {

  const router = useRouter()

  const {
    signUp,
    signInWithGoogle
  } = useAuth()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSignup() {

    if (loading) return

    setMessage("")

    // validação básica
    if (!name || !email || !password) {
      setMessage("Preencha todos os campos")
      return
    }

    if (password.length < 6) {
      setMessage("Senha deve ter no mínimo 6 caracteres")
      return
    }

    try {

      setLoading(true)

      const { error } =
        await signUp(
          name.trim(),
          email.trim(),
          password
        )

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      setMessage("Conta criada com sucesso!")

      // aguarda criação completa da sessão
      setTimeout(() => {

        router.replace("/dashboard")
        router.refresh()

      }, 1200)

    } catch (err: any) {

      setMessage("Erro inesperado")

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="flex min-h-screen items-center justify-center">

      <div className="w-full max-w-md space-y-4 border p-6 rounded-xl">

        <h1 className="text-xl font-bold">
          Criar Conta
        </h1>

        {message && (
          <p className={`text-sm ${
            message.includes("sucesso")
              ? "text-green-500"
              : "text-red-500"
          }`}>
            {message}
          </p>
        )}

        <input
          placeholder="Nome"
          value={name}
          onChange={(e)=>
            setName(e.target.value)
          }
          disabled={loading}
          className="w-full border p-2 rounded"
        />

        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
          disabled={loading}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e)=>
            setPassword(e.target.value)
          }
          disabled={loading}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="
            w-full
            bg-primary
            text-white
            p-2
            rounded
            disabled:opacity-50
          "
        >

          {loading
            ? "Criando..."
            : "Criar Conta"}

        </button>

        {/* GOOGLE */}

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="
            w-full
            border
            p-2
            rounded
            disabled:opacity-50
          "
        >
          Entrar com Google
        </button>

      </div>

    </div>

  )

}