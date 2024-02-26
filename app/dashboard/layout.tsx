import * as React from 'react'
import { redirect } from 'next/navigation'
import { authenticate } from '@/lib/supabase/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuth } = await authenticate()

  if (!isAuth) {
    redirect('/auth/signin')
  }

  return <React.Fragment>{children}</React.Fragment>
}
