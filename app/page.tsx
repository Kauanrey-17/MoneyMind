import { redirect } from "next/navigation"

/**
 * Rota raiz (/)
 * 
 * Delega toda a lógica de autenticação ao middleware:
 * - Usuário logado   → acessa /protect/dashboard (com layout completo)
 * - Usuário deslogado → redirecionado para /auth/login pelo middleware
 */
export default function HomePage() {
  redirect("/protect/dashboard")
}