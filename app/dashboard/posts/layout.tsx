import * as React from 'react'
import { redirect } from 'next/navigation'

import { AppBar, AppBarProvider } from '../components/app-bar'
import { MiniNavigation } from '../components/mini-navigation'

import { dashboardConfig } from '@/config/dashboard'
import { getAuth } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'

export default async function PostListLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = await getAuth()
  const { user } = await getUserAPI(session?.user?.id ?? null)

  if (!session) redirect('/auth/signin')
  if (!user) redirect('/auth/signin')

  return (
    <div className="body-overflow-hidden flex h-screen w-screen">
      <AppBarProvider>
        <MiniNavigation nav={dashboardConfig?.nav} user_role={user?.role} />
        <div className="flex flex-1 flex-col">
          <AppBar />
          {children}
        </div>
      </AppBarProvider>
    </div>
  )
}
