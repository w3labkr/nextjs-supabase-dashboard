import * as React from 'react'

import { Title } from '@/components/title'
import { AddPostButton } from '../components/add-post-button'
import { PostForm } from './post-form'

export default function PostEditPage({
  searchParams: { id },
}: {
  searchParams: { id: string }
}) {
  return (
    <main className="flex-1 space-y-4 overflow-auto p-10 pb-16">
      <div className="flex space-x-2">
        <Title text="PostEditPage.title" translate="yes" />
        <AddPostButton
          variant="secondary"
          size="sm"
          text="PostEditPage.AddPostButton"
          translate="yes"
        />
      </div>
      <PostForm id={id} />
    </main>
  )
}
