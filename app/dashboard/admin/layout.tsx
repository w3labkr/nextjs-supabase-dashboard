import * as React from 'react'

import { AppBarProvider } from '@/components/app-bar/app-bar-provider'
import { AppBar } from '@/components/app-bar'
import { MiniNavigation } from '@/components/dashboard/mini-navigation'
import { Navigation } from '@/components/dashboard/navigation'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { dashboardConfig, adminConfig } from '@/config/dashboard'

import { getUser } from '@/hooks/async/user'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getUser()

  if (!user?.user_role?.isAdmin) return <div>Unauthorized</div>

  return (
    <div className="body-overflow-hidden flex h-screen w-screen min-w-[768px]">
      <AppBarProvider>
        <MiniNavigation nav={dashboardConfig?.nav} />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25} className="max-w-64 !overflow-auto">
            <Navigation
              className="w-full border-none lg:max-w-full"
              nav={adminConfig?.nav}
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
