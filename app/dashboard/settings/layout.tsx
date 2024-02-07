import * as React from 'react'

import { AppBar } from '@/components/dashboard/app-bar'
import {
  PersistentDrawer,
  drawerItemProps,
} from '@/components/dashboard/persistent-drawer'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

const drawerItems: drawerItemProps[] = [
  { id: 1, title: 'Profile', href: '/dashboard/settings/profile' },
  { id: 2, title: 'Account', href: '/dashboard/settings/account' },
  { id: 3, title: 'Appearance', href: '/dashboard/settings/appearance' },
  { id: 4, title: 'Notifications', href: '/dashboard/settings/notifications' },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={25} className="max-w-64 !overflow-auto">
        <PersistentDrawer
          title="Settings"
          drawerItems={drawerItems}
          className="w-full border-none lg:max-w-full"
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75} className="relative !overflow-auto">
        <AppBar className="sticky left-0 top-0 z-10" />
        <div className="flex flex-1 flex-col">{children}</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
