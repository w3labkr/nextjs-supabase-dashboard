import * as React from 'react'
import { redirect } from 'next/navigation'

import { getUserAPI } from '@/queries/server/users'

export default async function BlockedLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  const { user } = await getUserAPI()

  if (!user) redirect('/auth/signin')
  if (!user?.is_ban) redirect('/dashboard')

  return <>{children}</>
}
