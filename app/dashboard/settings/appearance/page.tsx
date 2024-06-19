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
        <Title translate="yes">theme</Title>
        <Separator />
        <Description translate="yes">
          select_the_theme_for_the_dashboard
        </Description>
        <ChangeThemeForm />
      </div>
      <div className="space-y-4">
        <Title translate="yes">language</Title>
        <Separator />
        <Description translate="yes">
          select_the_language_for_the_dashboard
        </Description>
        <ChangeLanguageForm />
      </div>
    </main>
  )
}
