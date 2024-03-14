import * as React from 'react'

import { authenticate } from '@/lib/supabase/auth'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const { authenticated, user } = await authenticate()
  if (!user) return null

  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <ProfileForm user={user} />
      </div>
    </main>
  )
}
