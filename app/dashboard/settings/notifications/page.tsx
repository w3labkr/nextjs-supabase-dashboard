import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { NotificationsForm } from './notifications-form'

export default function NotificationsPage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="NotificationsSection.title" translate="yes" />
        <Description text="NotificationsSection.description" translate="yes" />
        <Separator />
        <NotificationsForm />
      </div>
    </main>
  )
}
