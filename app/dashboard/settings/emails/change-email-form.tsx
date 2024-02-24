import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

export function ChangeEmailForm() {
  return (
    <div className="space-y-4">
      <Title text="ChangeEmailForm.title" translate="yes" />
      <Separator />
      <Description text="ChangeEmailForm.description" translate="yes" />
      ...
    </div>
  )
}
