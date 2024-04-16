import * as React from 'react'
import { notFound } from 'next/navigation'

import { getProfile } from '@/hooks/async/auth'

export default async function ProfileLayout({
  children,
  params: { username },
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  const { profile } = await getProfile(username)

  if (!profile) notFound()

  return <>{children}</>
}
