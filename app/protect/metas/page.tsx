"use client"

import { useState } from "react"
import { useFinance } from "@/context/finance-context"

export default function MetasPage() {
  const { goals, addGoal, removeGoal } = useFinance()

  const [title, setTitle] = useState("")
  const [target, setTarget] = useState("")
  const [deadline, setDeadline] = useState("")
  const [category, setCategory] = useState("geral")

  const handleAddGoal = () => {
    if (!title || !target || !deadline) return

    addGoal({
      title,
      target_amount: parseFloat(target),
      current_amount: 0,
      deadline,
      category,
    })

    setTitle("")
    setTarget("")
    setDeadline("")
    setCategory("geral")
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Metas Financeiras</h1>

      <div className="space-y-4 bg-zinc-900 p-4 rounded-xl">
        <input
          placeholder="Título da meta"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800"
        />

        <input
          type="number"
          placeholder="Valor alvo"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800"
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800"
        />

        <button
          onClick={handleAddGoal}
          className="bg-emerald-600 px-4 py-2 rounded"
        >
          Adicionar Meta
        </button>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-zinc-900 p-4 rounded-xl flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{goal.title}</h2>
              <p>Meta: R$ {goal.target_amount}</p>
              <p>Atual: R$ {goal.current_amount}</p>
              <p>Prazo: {goal.deadline}</p>
            </div>

            <button
              onClick={() => removeGoal(goal.id)}
              className="text-red-500"
            >
              Remover
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}