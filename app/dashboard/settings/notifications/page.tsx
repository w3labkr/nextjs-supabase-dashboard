import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { NotificationsForm } from './notifications-form'

export default function NotificationsPage() {
  return (
    <main className="flex-1 p-10 pb-16">
      <div className="space-y-0.5">
        <Title text="Notifications" translate="yes" />
        <Description text="" translate="yes" />
      </div>
      <Separator className="my-6" />
      <NotificationsForm />
    </main>
  )
}
