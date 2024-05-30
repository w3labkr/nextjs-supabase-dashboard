import * as React from 'react'

import { Title } from '@/components/title'
import { AddButton } from '../components/add-button'

import { BackLink } from './components/back-link'
import { PostForm } from './post-form'

export default function PostEditPage({
  searchParams: { id },
}: {
  searchParams: { id: string }
}) {
  return (
    <main className="flex-1 space-y-4 overflow-auto p-10 pb-16">
      <div className="flex items-center space-x-2">
        <BackLink />
        <Title text="PostEditPage.title" translate="yes" />
        <AddButton
          variant="secondary"
          size="sm"
          text="PostEditPage.AddButton"
          translate="yes"
        />
      </div>
      <PostForm id={+id} />
    </main>
  )
}
