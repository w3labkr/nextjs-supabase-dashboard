import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { ChangeUsernameForm } from './change-username-form'
import { DeleteAccountDialog } from './delete-account-form'

export default function AccountPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <div className="space-y-4">
          <Title text="change_username" translate="yes" />
          <Separator />
          <ChangeUsernameForm />
        </div>
        <div className="space-y-4">
          <Title
            text="delete_account"
            translate="yes"
            className="text-destructive"
          />
          <Separator />
          <Description
            text="deleting_your_account_cannot_be_reversed"
            translate="yes"
          />
          <DeleteAccountDialog />
        </div>
      </div>
    </main>
  )
}
