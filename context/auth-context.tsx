"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";

const supabase = createSupabaseBrowserClient();

type AuthContextType = {
  user: any;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) await ensureUserExists(currentUser);
      setLoading(false);
    }

    loadSession();

    // ✅ CORRIGIDO: tipo Session | null em vez de { user: null }
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_: any, session: Session | null) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) await ensureUserExists(currentUser);
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function ensureUserExists(user: any) {
    const { data } = await supabase
      .from("users")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!data) {
      await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split("@")[0] || "Usuário",
      });
    }
  }

  async function signUp(name: string, email: string, password: string) {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      setLoading(false);
      if (error.message.includes("rate limit")) {
        return { error: { message: "Muitas tentativas. Aguarde 1 minuto e tente novamente." } };
      }
      return { error };
    }

    if (data.user) {
      await ensureUserExists(data.user);
      setUser(data.user);
    }

    setLoading(false);
    return { data };
  }

  async function signIn(email: string, password: string) {
    setLoading(true);
    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.data.user) setUser(result.data.user);
    setLoading(false);
    return result;
  }

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);