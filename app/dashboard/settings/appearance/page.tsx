import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { ChangeThemeForm } from './change-theme-form'
import { ChangeLanguageForm } from './change-language-form'

export default function AppearancePage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <Title text="ChangeThemeSection.title" translate="yes" />
        <Separator />
        <Description text="ChangeThemeSection.description" translate="yes" />
        <ChangeThemeForm />
      </div>
      <div className="space-y-4">
        <Title text="ChangeLanguageSection.title" translate="yes" />
        <Separator />
        <Description text="ChangeLanguageSection.description" translate="yes" />
        <ChangeLanguageForm />
      </div>
    </main>
  )
}
