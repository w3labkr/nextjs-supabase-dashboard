'use client'

import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'
import { getMeta } from '@/lib/utils'
import { Post } from '@/types/database'

interface ViewCountProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const ViewCount = ({ post, ...props }: ViewCountProps) => {
  const view_count = getMeta(post?.meta, 'view_count', '0')

  return (
    <div className="flex items-center" {...props}>
      <LucideIcon name="Eye" className="mr-2 size-5 min-w-5" />
      {view_count?.toLocaleString()}
    </div>
  )
}

export { ViewCount, type ViewCountProps }
