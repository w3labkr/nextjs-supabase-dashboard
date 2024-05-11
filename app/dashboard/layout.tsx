import * as React from 'react'
import { redirect } from 'next/navigation'
import { getUser } from '@/queries/server/users'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getUser()

  // if (user?.user?.deleted_at) redirect('/auth/deactivated')
  if (user?.user?.is_ban) redirect('/auth/blocked')

  return <>{children}</>
}
