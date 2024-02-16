import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

export default function EditMediaPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-0.5">
        <Title text="Edit Media" translate="yes" />
        <Description text="" translate="yes" />
      </div>
      <Separator className="my-6" />
      <div>...</div>
    </main>
  )
}
