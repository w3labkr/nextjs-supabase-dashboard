import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { AppearanceForm } from './appearance-form'

export default function AppearancePage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-0.5">
        <Title text="Appearance" translate="yes" />
        <Description text="" translate="yes" />
      </div>
      <Separator className="my-6" />
      <AppearanceForm />
    </main>
  )
}
