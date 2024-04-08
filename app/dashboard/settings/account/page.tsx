import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { ChangeUsernameForm } from './change-username-form'
import { DeleteUserForm } from './delete-user-form'

export default function AccountPage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="AccountPage.title1" translate="yes" />
        <Separator />
        <Description text="AccountPage.description1" translate="yes" />
        <ChangeUsernameForm />
      </div>
      <div className="space-y-4">
        <Title
          text="AccountPage.title2"
          className="text-destructive"
          translate="yes"
        />
        <Separator />
        <Description text="AccountPage.description2" translate="yes" />
        <DeleteUserForm />
      </div>
    </main>
  )
}
