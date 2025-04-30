import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import BottomNav from "@/components/bottom-nav"
import { LanguageProvider } from "@/context/language-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Luke Barnabas Ministry",
  description: "Spreading the word of God through sermons and bible studies",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background pb-16`}>
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <main className="container mx-auto px-4 py-6 md:py-8">{children}</main>
            <BottomNav />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
