import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

import { ChangeThemeForm } from './change-theme-form'
import { ChangeLanguageForm } from './change-language-form'

export default function AppearancePage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <ChangeTheme />
      <ChangeLanguage />
    </main>
  )
}

function ChangeTheme() {
  return (
    <div className="space-y-4">
      <Title text="ChangeTheme.title" translate="yes" />
      <Separator />
      <Description text="ChangeTheme.description" translate="yes" />
      <ChangeThemeForm />
    </div>
  )
}

function ChangeLanguage() {
  return (
    <div className="space-y-4">
      <Title text="ChangeLanguage.title" translate="yes" />
      <Separator />
      <Description text="ChangeLanguage.description" translate="yes" />
      <ChangeLanguageForm />
    </div>
  )
}
