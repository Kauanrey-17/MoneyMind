"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Settings, User, CreditCard, Bell, Lock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BillingPlaceholder } from "@/components/billing-placeholder"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ConfiguracoesPage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      setUser(user)

      const { data } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()

      if (data) setFullName(data.full_name || "")
    }

    loadUser()
  }, [])

  async function handleSaveProfile() {
    if (!user) return

    await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
      })

    alert("Perfil atualizado com sucesso")
  }

  async function handleChangePassword() {
    if (!newPassword) return

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Senha alterada com sucesso")
      setNewPassword("")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Configuracoes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie sua conta e preferencias
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* PERFIL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <User className="size-4" />
                Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome"
              />

              <Input
                value={user?.email || ""}
                disabled
              />

              <Button onClick={handleSaveProfile}>
                Salvar Alteracoes
              </Button>
            </CardContent>
          </Card>

          {/* SEGURANCA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Lock className="size-4" />
                Seguranca
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Input
                type="password"
                placeholder="Nova senha"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button onClick={handleChangePassword}>
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}