import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

export function EditPostForm() {
  return (
    <div className="space-y-4">
      <Title text="EditPostForm.title" translate="yes" />
      <Separator />
      <Description text="EditPostForm.description" translate="yes" />
      ...
    </div>
  )
}
