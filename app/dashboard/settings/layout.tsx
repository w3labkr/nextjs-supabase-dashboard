import * as React from 'react'

import { AppBarProvider } from '@/context/app-bar-provider'
import { MiniDrawer } from '@/components/dashboard/mini-drawer'
import { AppBar } from '@/components/dashboard/app-bar'
import { PersistentDrawer } from '@/components/dashboard/persistent-drawer'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { settingsConfig } from '@/config/dashboard'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="body-overflow-hidden flex h-screen w-screen min-w-[768px]">
      <AppBarProvider value={{ height: 'h-[50px]' }}>
        <MiniDrawer />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={25} className="max-w-64 !overflow-auto">
            <PersistentDrawer
              title="Settings"
              drawerItems={settingsConfig.drawerItems}
              className="w-full border-none lg:max-w-full"
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
