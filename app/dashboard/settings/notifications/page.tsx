import * as React from 'react'
import { authenticate } from '@/lib/supabase/auth'

import { NotificationsForm } from './notifications-form'

export default async function NotificationsPage() {
  const { isAuthenticated, user } = await authenticate()

  if (!isAuthenticated) return null

  return (
    <main className="flex-1 p-10 pb-16">
      <div className="space-y-16">
        <NotificationsForm />
      </div>
    </main>
  )
}
