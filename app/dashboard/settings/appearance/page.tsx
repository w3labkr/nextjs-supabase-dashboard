import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { AppearanceForm } from './appearance-form'

export default function AppearancePage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Appearance</h2>
        <p className="text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day
          and night themes.
        </p>
      </div>
      <Separator className="my-6" />
      <AppearanceForm />
    </main>
  )
}
