import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

export function NewPostForm() {
  return (
    <div className="space-y-4">
      <Title text="NewPostForm.title" translate="yes" />
      <Separator />
      <Description text="NewPostForm.description" translate="yes" />
      ...
    </div>
  )
}
