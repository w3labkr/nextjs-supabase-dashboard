import * as React from 'react'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <ProfileForm />
      </div>
    </main>
  )
}
