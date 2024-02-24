import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

export function DashboardForm() {
  return (
    <div className="space-y-4">
      <Title text="DashboardForm.title" translate="yes" />
      <Separator />
      <Description text="DashboardForm.description" translate="yes" />
      ...
    </div>
  )
}
