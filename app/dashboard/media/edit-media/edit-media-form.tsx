import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

export function EditMediaForm() {
  return (
    <div className="space-y-4">
      <Title text="EditMediaForm.title" translate="yes" />
      <Separator />
      <Description text="EditMediaForm.description" translate="yes" />
      ...
    </div>
  )
}
