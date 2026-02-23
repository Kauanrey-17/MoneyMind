export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

export function calculatePercentChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function formatDate(dateString: string): string {
  // Parse the date string manually to avoid timezone/hydration mismatches
  const parts = dateString.split("-")
  if (parts.length === 3) {
    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }
  return dateString
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    fixo: "Fixo",
    variavel: "Variavel",
    emergencia: "Emergencia",
    investimento: "Investimento",
    meta: "Meta",
  }
  return labels[category] || category
}

export function getTypeLabel(type: string): string {
  return type === "entrada" ? "Receita" : "Gasto"
}

export function getInvestmentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    renda_fixa: "Renda Fixa",
    renda_variavel: "Renda Variavel",
    cripto: "Criptomoeda",
    fundo: "Fundo",
  }
  return labels[type] || type
}
