import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from '@/components/Navbar'
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ['latin'], variable: "--font-sans" })

export const metadata: Metadata = {
  title: 'CarbonSpy.ai',
  description: 'Automated Carbon Footprint Estimator for Brands',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="container mx-auto max-w-6xl px-4 py-8">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
