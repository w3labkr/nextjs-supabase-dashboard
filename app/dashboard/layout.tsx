import * as React from 'react'

import { AppBarProvider } from '@/context/app-bar-provider'
import { MiniDrawer } from '@/components/dashboard/mini-drawer'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <AppBarProvider value={{ height: 'h-[50px]' }}>
        <MiniDrawer />
        {children}
      </AppBarProvider>
    </div>
  )
}
