import * as React from 'react'
import { redirect } from 'next/navigation'

import { AppBar } from '@/app/dashboard/components/app-bar'
import { AppPanel } from '@/app/dashboard/components/app-panel'

import { getUserAPI } from '@/queries/server/users'

export default async function AdminLayout({
  children,
}: {
  children?: React.ReactNode
}) {
  const { user } = await getUserAPI()
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  if (!user) redirect('/auth/signin')
  if (!isAdmin) return <div>Unauthorized</div>

  return (
    <div className="h-screen w-screen overflow-hidden">
      <AppBar className="sticky left-0 top-0 z-10" />
      <AppPanel>
        <div className="flex flex-1 flex-col">{children}</div>
      </AppPanel>
    </div>
  )
}
