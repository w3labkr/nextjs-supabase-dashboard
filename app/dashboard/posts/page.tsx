import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { AddPostButton } from './components/add-post-button'
import { PostList } from './post-list'

export default function PostListPage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <div className="flex justify-between">
          <Title text="PostListPage.title" translate="yes" />
          <AddPostButton
            variant="default"
            text="PostListPage.AddPostButton"
            translate="yes"
            startIconName="Plus"
          />
        </div>
        <Separator />
        <PostList />
      </div>
    </main>
  )
}
