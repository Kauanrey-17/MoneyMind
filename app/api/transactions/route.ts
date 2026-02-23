import { NextResponse } from "next/server"
import type { Transaction } from "@/types/financial"

// Placeholder API route - ready for Supabase integration
// Replace mock data with actual database queries when connecting Supabase

const mockTransactions: Transaction[] = [
  {
    id: "1",
    user_id: "user-1",
    type: "entrada",
    category: "fixo",
    amount: 8500,
    date: "2026-02-01",
    description: "Salario",
  },
]

export async function GET() {
  // TODO: Replace with Supabase query
  // const { data, error } = await supabase
  //   .from('transactions')
  //   .select('*')
  //   .eq('user_id', userId)
  //   .order('date', { ascending: false })

  return NextResponse.json({ data: mockTransactions })
}

export async function POST(request: Request) {
  const body = await request.json()

  // TODO: Replace with Supabase insert
  // const { data, error } = await supabase
  //   .from('transactions')
  //   .insert({ ...body, user_id: userId })
  //   .select()
  //   .single()

  const newTransaction: Transaction = {
    id: crypto.randomUUID(),
    user_id: "user-1",
    ...body,
  }

  return NextResponse.json({ data: newTransaction }, { status: 201 })
}
