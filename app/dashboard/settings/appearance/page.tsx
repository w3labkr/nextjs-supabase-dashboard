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
        <Title text="AppearancePage.title1" translate="yes" />
        <Separator />
        <Description text="AppearancePage.description1" translate="yes" />
        <ChangeThemeForm />
      </div>
      <div className="space-y-4">
        <Title text="AppearancePage.title2" translate="yes" />
        <Separator />
        <Description text="AppearancePage.description2" translate="yes" />
        <ChangeLanguageForm />
      </div>
    </main>
  )
}
