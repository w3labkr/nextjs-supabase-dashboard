import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'

export default function EditPostPage() {
  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <div className="space-y-4">
          <Title text="edit_post" translate="yes" />
          <Separator />
          ...
        </div>
      </div>
    </main>
  )
}
