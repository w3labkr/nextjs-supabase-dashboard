import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { ChangePasswordForm } from './change-password-form'

export default function SecurityPage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="SecurityPage.title" translate="yes" />
        <Separator />
        <Description text="SecurityPage.description" translate="yes" />
        <ChangePasswordForm />
      </div>
    </main>
  )
}
