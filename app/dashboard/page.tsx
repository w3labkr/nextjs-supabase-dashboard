import * as React from 'react'
import { redirect } from 'next/navigation'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { AppBar, AppBarProvider } from './components/app-bar'
import { MiniNavigation } from './components/mini-navigation'
import { WidgetLatestPosts, WidgetPostViews } from '@/components/widgets'

import { dashboardConfig } from '@/config/dashboard'
import { getAuth } from '@/queries/server/auth'
import { getUserAPI } from '@/queries/server/users'

export default async function DashboardPage() {
  const { session } = await getAuth()
  const { user } = await getUserAPI(session?.user?.id ?? null)

  if (!session) redirect('/auth/signin')
  if (!user) redirect('/auth/signin')

  return (
    <div className="body-overflow-hidden flex h-screen w-screen">
      <AppBarProvider>
        <MiniNavigation nav={dashboardConfig?.nav} userrole={user?.role} />
        <div className="flex flex-1 flex-col">
          <AppBar />
          <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
            <div className="space-y-4">
              <Title translate="yes">dashboard</Title>
              <Separator />
              <Description translate="yes"></Description>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <WidgetLatestPosts />
                <WidgetPostViews />
              </div>
            </div>
          </main>
        </div>
      </AppBarProvider>
    </div>
  )
}
