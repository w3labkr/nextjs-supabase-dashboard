import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'

import { NotificationsForm } from './notifications-form'

export default function NotificationsPage() {
  return (
    <main className="flex-1 p-10 pb-16">
      <div className="space-y-16">
        <div className="space-y-4">
          <Title text="Notifications" translate="yes" />
          <Separator />
          <NotificationsForm />
        </div>
      </div>
    </main>
  )
}
