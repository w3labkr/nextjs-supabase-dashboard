import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
// import { Description } from '@/components/description'

import { PostList } from './post-list'
import { AddPostButton } from './add-post-button'

export default function PostsPage() {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      <div className="space-y-4">
        <div className="flex justify-between">
          <Title text="PostsPage.title" translate="yes" />
          <AddPostButton />
        </div>
        <Separator />
        {/* <Description text="PostsPage.description" translate="yes" /> */}
        <PostList />
      </div>
    </main>
  )
}
