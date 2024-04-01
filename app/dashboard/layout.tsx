import * as React from 'react'
import { AppearanceProvider } from '@/context/appearance-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppearanceProvider>{children}</AppearanceProvider>
}
