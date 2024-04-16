import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { ChangeUsernameForm } from './change-username-form'
import { DeleteUserForm } from './delete-user-form'

export default function AccountPage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <ChangeUsername />
      <DeleteUser />
    </main>
  )
}

function ChangeUsername() {
  return (
    <div className="space-y-4">
      <Title text="ChangeUsername.title" translate="yes" />
      <Separator />
      <Description text="ChangeUsername.description" translate="yes" />
      <ChangeUsernameForm />
    </div>
  )
}

function DeleteUser() {
  return (
    <div className="space-y-4">
      <Title
        text="DeleteUser.title"
        className="text-destructive"
        translate="yes"
      />
      <Separator />
      <Description text="DeleteUser.description" translate="yes" />
      <DeleteUserForm />
    </div>
  )
}
