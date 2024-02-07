import * as React from 'react'

import { AppBar } from '@/components/dashboard/app-bar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      <AppBar />
      {children}
    </div>
  )
}
