import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'

import { AddDummyPost } from './components/add-dummy-post'
import { AddPost } from './components/add-post'
import { PostList } from './post-list'

export default function PostListPage() {
  return (
    <main className="flex-1 space-y-4 overflow-auto p-10 pb-16">
      <div className="flex justify-between">
        <Title text="PostListPage.title" translate="yes" />
        <div className="space-x-2">
          <AddDummyPost
            variant="outline"
            text="PostListPage.AddDummyPost"
            translate="yes"
            startIconName="Plus"
          />
          <AddPost
            variant="default"
            text="PostListPage.AddPost"
            translate="yes"
            startIconName="Plus"
          />
        </div>
      </div>
      <Separator />
      <PostList />
    </main>
  )
}
