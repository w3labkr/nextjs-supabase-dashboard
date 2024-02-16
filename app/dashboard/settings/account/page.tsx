import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { AccountForm } from './account-form'

export default function AccountPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-0.5">
        <Title text="Account" translate />
        <Description text="" translate />
      </div>
      <Separator className="my-6" />
      <AccountForm />
    </main>
  )
}
