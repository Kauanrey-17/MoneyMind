export type User = {
  id: string
  email: string
  name: string
  avatar_url?: string
  plan: "free" | "pro"
  created_at: string
}

export type AuthState = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}
