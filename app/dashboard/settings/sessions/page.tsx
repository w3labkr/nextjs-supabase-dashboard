import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { SessionsForm } from './sessions-form'

export default function SessionsPage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="SessionsForm.title" translate="yes" />
        <Separator />
        <Description text="SessionsForm.description" translate="yes" />
        <SessionsForm />
      </div>
    </main>
  )
}
