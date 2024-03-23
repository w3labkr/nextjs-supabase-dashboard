import * as React from 'react'

import { NotificationsForm } from './notifications-form'

export default async function NotificationsPage() {
  return (
    <main className="flex-1 p-10 pb-16">
      <div className="space-y-16">
        <NotificationsForm />
      </div>
    </main>
  )
}
