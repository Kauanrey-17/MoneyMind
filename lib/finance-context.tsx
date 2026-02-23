"use client"

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Transaction, Goal, Investment } from "@/types/financial"
import {
  mockTransactions,
  mockGoals,
  mockInvestments,
  currentMonthSummary,
  mockMonthlyData,
  mockCategoryBreakdown,
} from "@/lib/mock-data"

type FinanceContextType = {
  transactions: Transaction[]
  goals: Goal[]
  investments: Investment[]
  summary: typeof currentMonthSummary
  monthlyData: typeof mockMonthlyData
  categoryBreakdown: typeof mockCategoryBreakdown
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  addTransaction: (transaction: Omit<Transaction, "id" | "user_id">) => void
  removeTransaction: (id: string) => void
  addGoal: (goal: Omit<Goal, "id" | "user_id">) => void
  removeGoal: (id: string) => void
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [goals, setGoals] = useState<Goal[]>(mockGoals)
  const [investments] = useState<Investment[]>(mockInvestments)
  const [selectedMonth, setSelectedMonth] = useState("Fevereiro 2026")

  const addTransaction = useCallback(
    (transaction: Omit<Transaction, "id" | "user_id">) => {
      const newTransaction: Transaction = {
        ...transaction,
        id: crypto.randomUUID(),
        user_id: "user-1",
      }
      setTransactions((prev) => [newTransaction, ...prev])
    },
    []
  )

  const removeTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addGoal = useCallback((goal: Omit<Goal, "id" | "user_id">) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      user_id: "user-1",
    }
    setGoals((prev) => [...prev, newGoal])
  }, [])

  const removeGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }, [])

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        goals,
        investments,
        summary: currentMonthSummary,
        monthlyData: mockMonthlyData,
        categoryBreakdown: mockCategoryBreakdown,
        selectedMonth,
        setSelectedMonth,
        addTransaction,
        removeTransaction,
        addGoal,
        removeGoal,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error("useFinance must be used within a FinanceProvider")
  }
  return context
}
