import * as React from 'react'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { AppBarProvider } from '@/components/app-bar/app-bar-provider'
import { AppBar } from '@/components/app-bar'
import { MiniNavigation } from '@/app/dashboard/components/mini-navigation'
import { Navigation } from '@/app/dashboard/components/navigation'

import { dashboardConfig, adminConfig } from '@/config/dashboard'
import { getUser } from '@/queries/server/users'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, role } = await getUser()

  const isAdmin = role === 'admin' || role === 'superadmin'

  if (!isAdmin) return <div>Unauthorized</div>

  return (
    <div className="body-overflow-hidden flex h-screen w-screen">
      <AppBarProvider>
        <MiniNavigation
          nav={dashboardConfig?.nav}
          user_role={user?.user?.role}
        />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25} className="max-w-64 !overflow-auto">
            <Navigation
              className="w-full border-none lg:max-w-full"
              nav={adminConfig?.nav}
              user_role={user?.user?.role}
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
