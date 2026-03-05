import { supabase } from "./supabase/server"

export async function getCurrentUser() {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  return session?.user ?? null
}