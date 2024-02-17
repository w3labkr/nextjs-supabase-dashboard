import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'

import { ChangePasswordForm } from './change-password-form'

export default function SecurityPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <div className="space-y-4">
          <Title text="Change Password" translate="yes" />
          <Separator />
          <ChangePasswordForm />
        </div>
      </div>
    </main>
  )
}
