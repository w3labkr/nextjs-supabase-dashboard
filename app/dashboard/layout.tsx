import * as React from 'react'
import { redirect } from 'next/navigation'
import { authState } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { signedIn } = await authState()

  if (!signedIn) {
    redirect('/auth/signin')
  }

  return <React.Fragment>{children}</React.Fragment>
}
