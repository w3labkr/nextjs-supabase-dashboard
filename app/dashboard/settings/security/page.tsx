import * as React from 'react'

import { ChangePasswordForm } from './change-password-form'
import { authenticate } from '@/lib/supabase/auth'

export default async function SecurityPage() {
  const { isAuthenticated, user } = await authenticate()

  if (!isAuthenticated) return null

  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <ChangePasswordForm user={user} />
      </div>
    </main>
  )
}
