import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {

  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },

        set(name: string, value: string, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },

        remove(name: string, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    }
  )

  // usuário atual
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  /* ===============================
     ROTAS PUBLICAS (CORRIGIDO)
  =============================== */

  const publicRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/callback",
  ]

  const isPublicRoute =
    publicRoutes.includes(pathname)

  /* ===============================
     PERMITIR ARQUIVOS INTERNOS
  =============================== */

  const isStatic =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")

  if (isStatic) {
    return response
  }

  /* ===============================
     PROTEGER ROTAS /protect
  =============================== */

  const isProtectedRoute =
    pathname.startsWith("/protect")

  if (!user && isProtectedRoute) {

    return NextResponse.redirect(
      new URL("/auth/login", request.url)
    )

  }

  /* ===============================
     BLOQUEAR LOGIN SE JA LOGADO
  =============================== */

  if (user && isPublicRoute) {

    return NextResponse.redirect(
      new URL("/protect/dashboard", request.url)
    )

  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}