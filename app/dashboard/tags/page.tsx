import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { TagList } from './tag-list'

export default function TagsPage() {
  return (
    <main className="flex-1 space-y-4 overflow-auto p-8 pb-36">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Title translate="yes">tag_list</Title>
          <Description translate="yes">create_and_manage_tags</Description>
        </div>
      </div>
      <Separator />
      <TagList />
    </main>
  )
}
