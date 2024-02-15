import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { NotificationsForm } from './notifications-form'

export default function NotificationsPage() {
  return (
    <main className="flex-1 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground"></p>
      </div>
      <Separator className="my-6" />
      <NotificationsForm />
    </main>
  )
}
