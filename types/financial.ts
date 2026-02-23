export type TransactionType = "entrada" | "saida"

export type TransactionCategory =
  | "fixo"
  | "variavel"
  | "emergencia"
  | "investimento"
  | "meta"

export type Transaction = {
  id: string
  user_id: string
  type: TransactionType
  category: TransactionCategory
  amount: number
  date: string
  description: string
}

export type Goal = {
  id: string
  user_id: string
  title: string
  target_amount: number
  current_amount: number
  deadline: string
  category: string
}

export type Investment = {
  id: string
  user_id: string
  name: string
  type: "renda_fixa" | "renda_variavel" | "cripto" | "fundo"
  amount: number
  return_rate: number
  date: string
}

export type MonthlyData = {
  month: string
  receitas: number
  gastos: number
  investimentos: number
  reserva: number
}

export type CategoryBreakdown = {
  name: string
  value: number
  color: string
}

export type UserPlan = "free" | "pro"

export type UserProfile = {
  id: string
  name: string
  email: string
  avatar_url?: string
  plan: UserPlan
  created_at: string
}
