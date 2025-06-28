import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Estimativa de Custo Residencial",
  description: "Aplicação para estimativa de custos de construção residencial usando ONNX",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={inter.className}>
        <AuthProvider>
          <div className="max-w-md mx-auto bg-white min-h-screen">{children}</div>
        </AuthProvider>
      </body>
    </html>
  )
}
