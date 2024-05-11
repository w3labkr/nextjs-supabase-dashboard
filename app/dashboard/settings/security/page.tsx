import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { ChangePasswordForm } from './change-password-form'
import { getUser } from '@/queries/server/users'

export default async function SecurityPage() {
  const { user } = await getUser()

  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="ChangePasswordSection.title" translate="yes" />
        <Separator />
        <Description text="ChangePasswordSection.description" translate="yes" />
        <ChangePasswordForm user={user} />
      </div>
    </main>
  )
}
