import * as React from 'react'
import { redirect } from 'next/navigation'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { AppBar, AppBarProvider } from '../components/app-bar'
import { MiniNavigation } from '../components/mini-navigation'
import { Navigation } from '../components/navigation'

import { dashboardConfig, adminConfig } from '@/config/dashboard'
import { getAuth } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = await getAuth()
  const { user } = await getUserAPI(session?.user?.id ?? null)
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  if (!session) redirect('/auth/signin')
  if (!user) redirect('/auth/signin')
  if (!isAdmin) return <div>Unauthorized</div>

  return (
    <div className="body-overflow-hidden flex h-screen w-screen">
      <AppBarProvider>
        <MiniNavigation nav={dashboardConfig?.nav} user_role={user?.role} />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25} className="max-w-64 !overflow-auto">
            <Navigation
              className="w-full border-none lg:max-w-full"
              nav={adminConfig?.nav}
              user_role={user?.role}
              title="admin"
              translate="yes"
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={75} className="relative !overflow-auto">
            <AppBar className="sticky left-0 top-0 z-10" />
            <div className="flex flex-1 flex-col">{children}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </AppBarProvider>
    </div>
  )
}
