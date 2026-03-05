"use client";

import { useAuth } from "@/context/auth-context";
import { DashboardCards } from "@/components/dashboard-cards";
import {
  MonthlyEvolutionChart,
  CategoryPieChart,
  ReserveLineChart,
} from "@/components/charts";
import { TransactionTable } from "@/components/transaction-table";
import { GoalProgress } from "@/components/goal-progress";
import { AIInsights } from "@/components/ai-insights";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  // Só bloqueia no loading de AUTH — o finance carrega em background
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" />
          Carregando dashboard...
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Bem-vindo de volta, {user.email}
        </p>
      </div>

      {/* CARDS */}
      <DashboardCards />

      {/* CHARTS */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyEvolutionChart />
        <CategoryPieChart />
      </section>

      {/* RESERVA + IA */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReserveLineChart />
        </div>
        <AIInsights />
      </section>

      {/* TRANSAÇÕES + METAS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">
                Transações Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionTable limit={6} />
            </CardContent>
          </Card>
        </div>
        <GoalProgress />
      </section>

    </div>
  );
}