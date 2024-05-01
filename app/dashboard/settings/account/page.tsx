import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { ChangeUsernameForm } from './change-username-form'
import { DeleteUserForm } from './delete-user-form'
import { getUser } from '@/queries/async'

export default async function AccountPage() {
  const { user } = await getUser()

  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="ChangeUsernameSection.title" translate="yes" />
        <Separator />
        <Description text="ChangeUsernameSection.description" translate="yes" />
        <ChangeUsernameForm />
      </div>
      <div className="space-y-4">
        <Title
          text="DeleteUserSection.title"
          className="text-destructive"
          translate="yes"
        />
        <Separator />
        <Description text="DeleteUserSection.description" translate="yes" />
        <DeleteUserForm user={user} />
      </div>
    </main>
  )
}
