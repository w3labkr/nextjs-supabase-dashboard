import * as React from 'react'
import { redirect } from 'next/navigation'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { ChangePasswordForm } from './change-password-form'
import { Manage2FAForm } from './manage-2fa-form'

import { getUserAPI } from '@/queries/server/users'

export default async function SecurityPage() {
  const { user } = await getUserAPI()

  if (!user) redirect('/auth/signin')

  return (
    <main className="flex-1 space-y-16 overflow-auto p-8 pb-36">
      <div className="space-y-4">
        <Title translate="yes">password</Title>
        <Separator />
        <Description translate="yes">
          strengthen_your_account_by_keeping_your_password_strong
        </Description>
        <ChangePasswordForm user={user} />
      </div>
      <div className="space-y-4">
        <Title translate="yes">two_factor_authentication</Title>
        <Separator />
        <Description translate="yes">
          two_factor_authentication_is_a_method_of_adding_additional_security_to_your_account
        </Description>
        <Manage2FAForm user={user} />
      </div>
    </main>
  )
}
