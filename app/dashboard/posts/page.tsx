import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { AddDummyPost } from './components/add-dummy-post'
import { AddPost } from './components/add-post'
import { PostList } from './post-list'

export default function PostListPage() {
  return (
    <main className="flex-1 space-y-4 overflow-auto p-8 pb-36">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Title translate="yes">post_list</Title>
          <Description translate="yes">create_and_manage_posts</Description>
        </div>
        <div className="flex space-x-2 align-bottom">
          <AddDummyPost
            variant="default"
            startIconName="CopyPlus"
            translate="yes"
          >
            dummy_post
          </AddDummyPost>
          <AddPost variant="outline" startIconName="Plus" translate="yes">
            new_post
          </AddPost>
        </div>
      </div>
      <Separator />
      <PostList />
    </main>
  )
}
