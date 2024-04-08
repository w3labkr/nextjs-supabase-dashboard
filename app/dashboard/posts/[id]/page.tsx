import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { PostEditor } from './post-editor'

export default function PostPage({
  params: { id },
}: {
  params: { id: string }
}) {
  return (
    <main className="flex-1 space-y-16 overflow-auto p-10 pb-16">
      {/* <Title text="NewPost.title" translate="yes" /> */}
      {/* <Separator /> */}
      {/* <Description text="NewPost.description" translate="yes" /> */}
      <PostEditor id={id} />
    </main>
  )
}
