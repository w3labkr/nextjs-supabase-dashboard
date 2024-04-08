import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { DashboardForm } from './dashboard-form'

export default function DashboardPage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="DashboardPage.title" translate="yes" />
        <Separator />
        <Description text="DashboardPage.description" translate="yes" />
        <DashboardForm />
      </div>
    </main>
  )
}
