"use client";
 
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
 
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useAuth } from "./auth-context";
import { Transaction, Investment, Goal } from "@/types/financial";
 
type Reserva = {
  id: string
  user_id: string
  name: string
  amount: number
  target_amount: number
  date: string
}
 
type Card = {
  id: string
  user_id: string
  name: string
  last_digits: string
  brand: string
  limit_amount: number
  current_bill: number
  due_day: number
  color: string
}
 
type FinanceContextType = {
  transactions: Transaction[];
  investments: Investment[];
  goals: Goal[];
  reserva: Reserva[];
  cards: Card[];
  loading: boolean;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  addTransaction: (data: Partial<Transaction>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
  addInvestment: (data: Partial<Investment>) => Promise<void>;
  removeInvestment: (id: string) => Promise<void>;
  addGoal: (data: Partial<Goal>) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  addReserva: (data: Partial<Reserva>) => Promise<void>;
  removeReserva: (id: string) => Promise<void>;
  addCard: (data: Partial<Card>) => Promise<void>;
  removeCard: (id: string) => Promise<void>;
  reload: () => Promise<void>;
};
 
const FinanceContext = createContext({} as FinanceContextType);
 
export function FinanceProvider({ children }: { children: ReactNode }) {
  const supabase = createSupabaseBrowserClient();
  const { user, loading: authLoading } = useAuth();
 
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [reserva, setReserva] = useState<Reserva[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
 
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  });
 
  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    reload();
    const timeout = setTimeout(() => setLoading(false), 8000);
    return () => clearTimeout(timeout);
  }, [user, authLoading]);
 
  async function reload() {
    if (!user) return;
    setLoading(true);
    try {
      const [transactionsRes, investmentsRes, goalsRes, reservaRes, cardsRes] =
        await Promise.all([
          supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
          supabase.from("investments").select("*").eq("user_id", user.id),
          supabase.from("goals").select("*").eq("user_id", user.id),
          supabase.from("reserva").select("*").eq("user_id", user.id),
          supabase.from("cards").select("*").eq("user_id", user.id),
        ]);
 
      setTransactions(transactionsRes.data || []);
      setInvestments(investmentsRes.data || []);
      setGoals(goalsRes.data || []);
      setReserva(reservaRes.data || []);
      setCards(cardsRes.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  }
 
  async function addTransaction(data: Partial<Transaction>) {
    if (!user) return;
    const { data: newItem } = await supabase.from("transactions").insert({ ...data, user_id: user.id }).select().single();
    if (newItem) setTransactions((prev) => [newItem, ...prev]);
  }
 
  async function removeTransaction(id: string) {
    await supabase.from("transactions").delete().eq("id", id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }
 
  async function addInvestment(data: Partial<Investment>) {
    if (!user) return;
    const { data: newItem } = await supabase.from("investments").insert({ ...data, user_id: user.id }).select().single();
    if (newItem) setInvestments((prev) => [newItem, ...prev]);
  }
 
  async function removeInvestment(id: string) {
    await supabase.from("investments").delete().eq("id", id);
    setInvestments((prev) => prev.filter((i) => i.id !== id));
  }
 
  async function addGoal(data: Partial<Goal>) {
    if (!user) return;
    const { data: newItem } = await supabase.from("goals").insert({ ...data, user_id: user.id }).select().single();
    if (newItem) setGoals((prev) => [newItem, ...prev]);
  }
 
  async function removeGoal(id: string) {
    await supabase.from("goals").delete().eq("id", id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }
 
  async function addReserva(data: Partial<Reserva>) {
    if (!user) return;
    const { data: newItem } = await supabase.from("reserva").insert({ ...data, user_id: user.id }).select().single();
    if (newItem) setReserva((prev) => [newItem, ...prev]);
  }
 
  async function removeReserva(id: string) {
    await supabase.from("reserva").delete().eq("id", id);
    setReserva((prev) => prev.filter((r) => r.id !== id));
  }
 
  async function addCard(data: Partial<Card>) {
    if (!user) return;
    const { data: newItem } = await supabase.from("cards").insert({ ...data, user_id: user.id }).select().single();
    if (newItem) setCards((prev) => [newItem, ...prev]);
  }
 
  async function removeCard(id: string) {
    await supabase.from("cards").delete().eq("id", id);
    setCards((prev) => prev.filter((c) => c.id !== id));
  }
 
  return (
    <FinanceContext.Provider
      value={{
        transactions, investments, goals, reserva, cards,
        loading, selectedMonth, setSelectedMonth,
        addTransaction, removeTransaction,
        addInvestment, removeInvestment,
        addGoal, removeGoal,
        addReserva, removeReserva,
        addCard, removeCard,
        reload,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}
 
export function useFinance() {
  return useContext(FinanceContext);
}