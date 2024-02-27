import * as React from 'react'
import type { Metadata } from 'next'
import { Inter as FontSans } from 'next/font/google'
import { Analytics } from '@/components/analytics'

import { lng } from '@/i18next.config'
import { AppProvider } from '@/context/app-provider'

import { cn } from '@/lib/utils'
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
        <AppProvider>
          <div id="__next">{children}</div>
          <Toaster richColors closeButton />
          <TailwindIndicator />
          <Analytics />
        </AppProvider>
      </body>
    </html>
  )
}
