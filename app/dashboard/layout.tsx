import * as React from 'react'
import { redirect } from 'next/navigation'

import { authenticate } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'

import { DemoSiteWarningNotification } from './components/demo-site-warning-notification'

export default async function DashboardLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  const { authenticated } = await authenticate()
  const { user } = await getUserAPI()

  if (!authenticated) redirect('/auth/signin')
  if (!user) redirect('/auth/signin')
  if (user?.is_ban) redirect('/auth/blocked')
  // if (user?.deleted_at) redirect('/auth/deactivated')

  return (
    <>
      {process.env.NODE_ENV === 'production' ? (
        <DemoSiteWarningNotification />
      ) : null}
      {children}
    </>
  )
}
