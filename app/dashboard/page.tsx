import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { AppBarProvider } from '@/components/app-bar/app-bar-provider'
import { AppBar } from '@/components/app-bar'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { MiniNavigation } from '@/app/dashboard/components/mini-navigation'
import { DashboardForm } from './dashboard/dashboard-form'

import { dashboardConfig } from '@/config/dashboard'
import { getUser } from '@/queries/server/users'

export default async function DashboardPage() {
  const { user } = await getUser()

  return (
    <div className="body-overflow-hidden flex h-screen w-screen">
      <AppBarProvider>
        <MiniNavigation
          nav={dashboardConfig?.nav}
          user_role={user?.user?.role}
        />
        <div className="flex flex-1 flex-col">
          <AppBar />
          <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
            <div className="space-y-4">
              <Title text="DashboardPage.title" translate="yes" />
              <Separator />
              <Description text="DashboardPage.description" translate="yes" />
              <DashboardForm />
            </div>
          </main>
        </div>
      </AppBarProvider>
    </div>
  )
}
