import * as React from 'react'

import { AppBarProvider } from '@/components/app-bar/app-bar-provider'
import { MiniDrawer } from '@/components/mini-drawer'
import { AppBar } from '@/components/app-bar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="body-overflow-hidden flex h-screen w-screen min-w-[768px]">
      <AppBarProvider value={{ height: 'h-[50px]' }}>
        <MiniDrawer />
        <div className="flex flex-1 flex-col">
          <AppBar />
          {children}
        </div>
      </AppBarProvider>
    </div>
  )
}
