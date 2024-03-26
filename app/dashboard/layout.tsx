import * as React from 'react'
import { AppearanceProvider } from '@/context/appearance-provider'
import { authenticate } from '@/lib/supabase/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await authenticate()

  return <AppearanceProvider user={user}>{children}</AppearanceProvider>
}
