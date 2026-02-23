import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { FinanceProvider } from '@/lib/finance-context'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import './globals.css'

const _inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: 'MoneyMind AI - Controle Financeiro Inteligente',
  description: 'Gerencie suas financas pessoais com inteligencia artificial. Controle receitas, gastos, investimentos e metas financeiras.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${_inter.variable} ${_geistMono.variable} font-sans antialiased`}>
        <FinanceProvider>
          <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 p-4 lg:p-6">
                {children}
              </main>
            </div>
          </div>
        </FinanceProvider>
        <Analytics />
      </body>
    </html>
  )
}
