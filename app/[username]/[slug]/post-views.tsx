'use client'

import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'
import { getMeta } from '@/lib/utils'
import { usePostAPI } from '@/queries/client/posts'

interface PostViewsProps extends React.HTMLAttributes<HTMLDivElement> {
  id: number
}

const PostViews = ({ id, ...props }: PostViewsProps) => {
  const { post } = usePostAPI(id ?? null)
  const views = getMeta(post?.meta, 'views', '0')

  return (
    <div className="flex items-center" {...props}>
      <LucideIcon name="Eye" className="mr-2 size-5 min-w-5" />
      {views?.toLocaleString()}
    </div>
  )
}

export { PostViews, type PostViewsProps }
