import * as React from 'react'
import { redirect } from 'next/navigation'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'
import { ChangeUsernameForm } from './change-username-form'
import { DeleteUserForm } from './delete-user-form'

import { getUserAPI } from '@/queries/server/users'

export default async function AccountPage() {
  const { user } = await getUserAPI()

  if (!user) redirect('/auth/signin')

  return (
    <main className="flex-1 space-y-16 overflow-auto p-8 pb-36">
      <div className="space-y-4">
        <Title translate="yes">username</Title>
        <Separator />
        <Description translate="yes"></Description>
        <ChangeUsernameForm />
      </div>
      <div className="space-y-4">
        <Title className="text-destructive" translate="yes">
          delete_account
        </Title>
        <Separator />
        <Description translate="yes">
          if_you_delete_your_account_your_posts_and_other_related_information_will_be_permanently_deleted_and_cannot_be_recovered
        </Description>
        <DeleteUserForm user={user} />
      </div>
    </main>
  )
}
