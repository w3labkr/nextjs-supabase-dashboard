import * as React from 'react'

import { ChangeUsernameForm } from './change-username-form'
import { DeleteAccountForm } from './delete-account-form'

export default function AccountPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <ChangeUsernameForm />
        <DeleteAccountForm />
      </div>
    </main>
  )
}
