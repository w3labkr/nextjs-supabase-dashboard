import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'

import { ProfileForm } from './profile-form'

export default function ProfilePage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <div className="space-y-4">
          <Title text="Profile" translate="yes" />
          <Separator />
          <ProfileForm />
        </div>
      </div>
    </main>
  )
}
