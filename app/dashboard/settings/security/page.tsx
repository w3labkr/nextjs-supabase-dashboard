import * as React from 'react'
import { ChangePasswordForm } from './change-password-form'

export default async function SecurityPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <ChangePasswordForm />
      </div>
    </main>
  )
}
