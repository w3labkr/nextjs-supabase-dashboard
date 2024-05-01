import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { ProfileForm } from './profile-form'

export default function ProfilePage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="ProfileSection.title" translate="yes" />
        <Separator />
        <Description text="ProfileSection.description" translate="yes" />
        <ProfileForm />
      </div>
    </main>
  )
}
