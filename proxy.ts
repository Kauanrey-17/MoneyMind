import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
 
export async function proxy(request: NextRequest) {
  let response = NextResponse.next()
 
  const pathname = request.nextUrl.pathname
 
  /* ===============================
     ARQUIVOS ESTÁTICOS — sai rápido
  =============================== */
  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
 
  if (isStatic) return response
 
  /* ===============================
     ROTAS PÚBLICAS
  =============================== */
  const publicRoutes = ["/auth/login", "/auth/signup", "/auth/callback"]
  const isPublicRoute = publicRoutes.includes(pathname)
  const isProtectedRoute = pathname.startsWith("/protect")
 
  /* ===============================
     TENTA PEGAR SESSÃO
  =============================== */
  let user = null
 
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value
          },
          set(name: string, value: string, options) {
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options) {
            response.cookies.set({ name, value: "", ...options })
          },
        },
      }
    )
 
    const { data: { session } } = await supabase.auth.getSession()
    user = session?.user ?? null
 
  } catch (err) {
    console.warn("[proxy] fetch falhou, ignorando auth check:", err)
    return response
  }
 
  /* ===============================
     PROTEGER ROTAS /protect
  =============================== */
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
 
  /* ===============================
     BLOQUEAR LOGIN SE JÁ LOGADO
  =============================== */
  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL("/protect/dashboard", request.url))
  }
 
  return response
}
 
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
} 