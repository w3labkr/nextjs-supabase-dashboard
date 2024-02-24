import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

export function SessionsForm() {
  return (
    <div className="space-y-4">
      <Title text="SessionsForm.title" translate="yes" />
      <Separator />
      <Description text="SessionsForm.description" translate="yes" />
      ...
    </div>
  )
}
