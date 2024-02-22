import * as React from 'react'
import { redirect } from 'next/navigation'
import { isAuthenticate } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = await isAuthenticate()

  if (!isAuthenticated) {
    redirect('/auth/signin')
  }

  return <React.Fragment>{children}</React.Fragment>
}
