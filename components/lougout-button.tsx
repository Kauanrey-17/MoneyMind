"use client"

import { useAuth } from "@/context/auth-context"

export function LogoutButton() {

  const { signOut } = useAuth()

  return (
    <button onClick={signOut}>
      Logout
    </button>
  )
}