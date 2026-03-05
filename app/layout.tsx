import { AuthProvider } from "@/context/auth-context"
import { FinanceProvider } from "@/context/finance-context"
import { Toaster } from "sonner"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body>

        <AuthProvider>
          <FinanceProvider>

            {children}

            <Toaster richColors />

          </FinanceProvider>
        </AuthProvider>

      </body>
    </html>
  )
}