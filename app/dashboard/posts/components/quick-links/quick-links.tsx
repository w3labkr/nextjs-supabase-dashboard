'use client'

import * as React from 'react'

import { EditPost } from './edit-post'
import { ViewPost } from './view-post'
import { TrashPost } from './trash-post'
import { RestorePost } from './restore-post'
import { DeletePost } from './delete-post'
import { PublishPost } from './publish-post'

import { Post } from '@/types/database'

interface QuickLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const QuickLinks = (props: QuickLinksProps) => {
  const { post, ...rest } = props

  switch (post?.status) {
    case 'publish':
      return (
        <div className="flex items-center space-x-1" {...rest}>
          <EditPost post={post} />
          <span>|</span>
          <TrashPost post={post} />
          <span>|</span>
          <ViewPost post={post} />
        </div>
      )
    case 'private':
      return (
        <div className="flex items-center space-x-1" {...rest}>
          <EditPost post={post} />
          <span>|</span>
          <TrashPost post={post} />
          <span>|</span>
          <ViewPost post={post} />
        </div>
      )
    case 'future':
      return (
        <div className="flex items-center space-x-1" {...rest}>
          <EditPost post={post} />
          <span>|</span>
          <TrashPost post={post} />
        </div>
      )
    case 'draft':
      return (
        <div className="flex items-center space-x-1" {...rest}>
          <EditPost post={post} />
          <span>|</span>
          <PublishPost post={post} />
          <span>|</span>
          <TrashPost post={post} />
        </div>
      )
    case 'trash':
      return (
        <div className="flex items-center space-x-1" {...rest}>
          <RestorePost post={post} />
          <span>|</span>
          <DeletePost post={post} />
        </div>
      )
    case 'pending':
      return (
        <div className="flex items-center space-x-1" {...rest}>
          <EditPost post={post} />
          <span>|</span>
          <TrashPost post={post} />
        </div>
      )
  }
}

export { QuickLinks, type QuickLinksProps }
