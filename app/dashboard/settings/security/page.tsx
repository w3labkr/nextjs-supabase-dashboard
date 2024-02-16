import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

export default function SecurityPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-0.5">
        <Title text="Security" translate />
        <Description text="" translate />
      </div>
      <Separator className="my-6" />
      ...
    </main>
  )
}
