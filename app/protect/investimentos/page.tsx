"use client"

import { useState } from "react"
import { useFinance } from "@/context/finance-context"

export default function InvestimentosPage() {
  const { investments, addInvestment, removeInvestment } = useFinance()

  const [name, setName] = useState("")
  const [type, setType] = useState<"renda_fixa" | "renda_variavel" | "cripto" | "fundo">("renda_fixa")
  const [amount, setAmount] = useState("")
  const [returnRate, setReturnRate] = useState("")

  const handleAddInvestment = () => {
    if (!name || !amount || !returnRate) return

    addInvestment({
      name,
      type,
      amount: parseFloat(amount),
      return_rate: parseFloat(returnRate),
      date: new Date().toISOString(),
    })

    setName("")
    setAmount("")
    setReturnRate("")
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Investimentos</h1>

      <div className="space-y-4 bg-zinc-900 p-4 rounded-xl">
        <input
          placeholder="Nome do investimento"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800"
        />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value as any)
          }
          className="w-full p-2 rounded bg-zinc-800"
        >
          <option value="renda_fixa">Renda Fixa</option>
          <option value="renda_variavel">Renda Variável</option>
          <option value="cripto">Cripto</option>
          <option value="fundo">Fundo</option>
        </select>

        <input
          type="number"
          placeholder="Valor investido"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800"
        />

        <input
          type="number"
          placeholder="Taxa de retorno (%)"
          value={returnRate}
          onChange={(e) => setReturnRate(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800"
        />

        <button
          onClick={handleAddInvestment}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Adicionar Investimento
        </button>
      </div>

      <div className="space-y-3">
        {investments.map((investment) => (
          <div
            key={investment.id}
            className="bg-zinc-900 p-4 rounded-xl flex justify-between"
          >
            <div>
              <h2 className="font-semibold">{investment.name}</h2>
              <p>Tipo: {investment.type}</p>
              <p>Valor: R$ {investment.amount}</p>
              <p>Retorno: {investment.return_rate}%</p>
            </div>

            <button
              onClick={() => removeInvestment(investment.id)}
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