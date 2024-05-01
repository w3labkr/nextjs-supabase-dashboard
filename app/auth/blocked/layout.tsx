import * as React from 'react'
import { redirect } from 'next/navigation'
import { getUser } from '@/queries/async'

export default async function BlockedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getUser()

  if (!user) redirect('/auth/signin')
  if (!user?.user?.is_ban) redirect('/dashboard')

  return <>{children}</>
}
