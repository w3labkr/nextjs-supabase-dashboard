import * as React from 'react'

import { Title } from '@/components/title'
import { AddTag } from '../components/add-tag'
import { BackLink } from './components/back-link'
import { TagForm } from './tag-form'

export default function PostEditPage({
  searchParams: { id },
}: {
  searchParams: { id: string }
}) {
  return (
    <main className="flex-1 space-y-4 overflow-auto p-8 pb-36">
      <div className="flex items-center space-x-2">
        <BackLink />
        <Title translate="yes">edit_tag</Title>
        <AddTag variant="secondary" translate="yes">
          add_tag
        </AddTag>
      </div>
      <TagForm id={+id} />
    </main>
  )
}
