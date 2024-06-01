'use client'

import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'

import { getMeta } from '@/lib/utils'
import { Post } from '@/types/database'

interface ViewCountProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}

const ViewCount = (props: ViewCountProps) => {
  const { post, ...rest } = props

  return (
    <div className="flex items-center" {...rest}>
      <LucideIcon name="Eye" className="mr-2 size-5 min-w-5" />
      {getMeta(post?.meta, 'view_count', '0')?.toLocaleString()}
    </div>
  )
}

export { ViewCount, type ViewCountProps }
