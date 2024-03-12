import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { LanguageSwitcher } from '@/components/language-switcher'

export function ChangeLanguageForm() {
  return (
    <div className="space-y-4">
      <Title text="ChangeLanguageForm.title" translate="yes" />
      <Separator />
      <Description text="ChangeLanguageForm.description" translate="yes" />
      <LanguageSwitcher />
    </div>
  )
}
