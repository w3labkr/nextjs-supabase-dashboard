import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { ProfileForm } from './profile-form'

export default function ProfilePage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground"></p>
      </div>
      <Separator className="my-6" />
      <ProfileForm />
    </main>
  )
}
