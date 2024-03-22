import * as React from 'react'
import { authenticate } from '@/lib/supabase/auth'

import { EmailList } from './email-list'

export default async function EmailsPage() {
  const { isAuthenticated, user } = await authenticate()

  if (!isAuthenticated) return null

  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <EmailList user={user} />
      </div>
    </main>
  )
}
