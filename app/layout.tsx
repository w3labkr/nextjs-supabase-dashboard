import * as React from 'react'
import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { Analytics } from '@/components/analytics'

import { lng } from '@/i18next.config'
import { I18nProvider } from '@/context/i18n-provider'
import { AuthProvider } from '@/context/auth-provider'

import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/context/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { siteConfig } from '@/config/site'

import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={lng} suppressHydrationWarning>
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        <AuthProvider>
          <I18nProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div id="__next">{children}</div>
              <Toaster richColors closeButton />
              <TailwindIndicator />
              <Analytics />
            </ThemeProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
