import * as React from 'react'

import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { Separator } from '@/components/ui/separator'

export default function AdminPage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-8 pb-36">
      <div className="space-y-4">
        <Title translate="yes">admin</Title>
        <Separator />
        <Description translate="yes"></Description>
        <span>...</span>
      </div>
    </main>
  )
}
