import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { EmailList } from './email-list'
import { AddEmailAddress } from './add-email-address'
import { PrimaryEmailAddress } from './primary-email-address'

export default function EmailsPage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="EmailsPage.title" translate="yes" />
        <Separator />
        <Description text="EmailsPage.description" translate="yes" />
        <EmailList />
        <AddEmailAddress />
        <Separator />
        <PrimaryEmailAddress />
      </div>
    </main>
  )
}
