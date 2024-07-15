import * as React from 'react'
import { redirect } from 'next/navigation'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { LatestPosts, PostRank } from '@/app/dashboard/dashboard'
import { AppBar } from '@/app/dashboard/components/app-bar'
import { AppPanel } from '@/app/dashboard/components/app-panel'

import { getUserAPI } from '@/queries/server/users'

export default async function DashboardPage() {
  const { user } = await getUserAPI()

  if (!user) redirect('/auth/signin')

  return (
    <div className="h-screen w-screen overflow-hidden">
      <AppBar className="sticky left-0 top-0 z-10" />
      <AppPanel>
        <div className="flex flex-1 flex-col">
          <main className="flex-1 space-y-16 overflow-auto p-8 pb-36">
            <div className="space-y-4">
              <Title translate="yes">dashboard</Title>
              <Separator />
              <Description translate="yes"></Description>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <LatestPosts user={user} />
                <PostRank user={user} />
              </div>
            </div>
          </main>
        </div>
      </AppPanel>
    </div>
  )
}
