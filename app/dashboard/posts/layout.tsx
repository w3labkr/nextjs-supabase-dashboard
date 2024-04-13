import * as React from 'react'

import { AppBarProvider } from '@/components/app-bar/app-bar-provider'
import { MiniNavigation } from '@/components/dashboard/mini-navigation'
import { AppBar } from '@/components/app-bar'
import { dashboardConfig } from '@/config/dashboard'

import { getUser } from '@/hooks/async/auth'

export default async function PostsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getUser()

  return (
    <div className="body-overflow-hidden flex h-screen w-screen min-w-[768px]">
      <AppBarProvider>
        <MiniNavigation
          nav={dashboardConfig?.nav}
          user_role={user?.user?.role}
        />
        <div className="flex flex-1 flex-col">
          <AppBar />
          {children}
        </div>
      </AppBarProvider>
    </div>
  )
}
