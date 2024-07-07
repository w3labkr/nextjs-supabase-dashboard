import * as React from 'react'
import type { Metadata, Viewport } from 'next'
import { cookies } from 'next/headers'
import { Inter as FontSans } from 'next/font/google'

import { AppProvider } from '@/context/app-provider'
import { I18nProvider } from '@/context/i18n-provider'
import { ThemeProvider } from '@/context/theme-provider'

import { Toaster } from '@/components/ui/sonner'
import { Analytics } from '@/components/analytics'
import { TailwindIndicator } from '@/components/tailwind-indicator'

import { cn } from '@/lib/utils'
import { siteConfig } from '@/config/site'
import { defaultLng } from '@/i18next.config'

import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  title: siteConfig.title,
  description: siteConfig.description,
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children?: React.ReactNode
}>) {
  const language = cookies().get('language')?.value ?? defaultLng
  const theme = cookies().get('theme')?.value ?? 'system'

  return (
    <html lang={language} suppressHydrationWarning>
      <body className={cn('font-sans antialiased', fontSans.variable)}>
        <AppProvider>
          <I18nProvider value={{ language }}>
            <ThemeProvider value={{ defaultTheme: theme }}>
              <div id="__next">{children}</div>
              <Toaster richColors closeButton />
              <TailwindIndicator />
              <Analytics />
            </ThemeProvider>
          </I18nProvider>
        </AppProvider>
      </body>
    </html>
  )
}
