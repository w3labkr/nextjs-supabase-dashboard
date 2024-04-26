import * as React from 'react'
import { notFound } from 'next/navigation'

import { fetcher } from '@/lib/utils'
import { ProfileAPI } from '@/types/api'

export default async function PublicProfileLayout({
  children,
  params: { username },
}: {
  children: React.ReactNode
  params: { username: string }
}) {
  const fetchUrl = `/api/v1/profile?username=${username}`
  const { data: profile } = await fetcher<ProfileAPI>(fetchUrl)

  if (!profile) notFound()

  return <>{children}</>
}
