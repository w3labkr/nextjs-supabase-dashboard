import * as React from 'react'

import { ProfileForm } from './profile-form'

import { authenticate } from '@/lib/supabase/auth'

export default async function ProfilePage() {
  const { user } = await authenticate()

  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <ProfileForm user={user} />
      </div>
    </main>
  )
}
