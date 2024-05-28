import * as React from 'react'
import { redirect } from 'next/navigation'

import { getAuth } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = await getAuth()
  const { user } = await getUserAPI(session?.user?.id ?? null)

  if (!session) redirect('/auth/signin')
  if (!user) redirect('/auth/signin')
  if (user?.is_ban) redirect('/auth/blocked')
  // if (user?.deleted_at) redirect('/auth/deactivated')

  return <>{children}</>
}
