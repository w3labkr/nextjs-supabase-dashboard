import * as React from 'react'
import { redirect } from 'next/navigation'

import { authenticate } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'

export default async function BlockedLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  const { user: session } = await authenticate()
  const { user } = await getUserAPI(session?.id ?? null)

  if (!session) redirect('/auth/signin')
  if (!user) redirect('/auth/signin')
  if (!user?.is_ban) redirect('/dashboard')

  return <>{children}</>
}
