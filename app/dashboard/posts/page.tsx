import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { AddButton } from './components/add-button'
import { PostList } from './post-list'

export default function PostListPage() {
  return (
    <main className="flex-1 space-y-4 overflow-auto p-10 pb-16">
      <div className="flex justify-between">
        <Title text="PostListPage.title" translate="yes" />
        <AddButton
          variant="default"
          text="PostListPage.AddButton"
          translate="yes"
          startIconName="Plus"
        />
      </div>
      <Separator />
      <PostList />
    </main>
  )
}
