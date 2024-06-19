'use client'

import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'
import { getMeta } from '@/lib/utils'
import { usePostAPI } from '@/queries/client/posts'

interface PostViewsProps extends React.HTMLAttributes<HTMLDivElement> {
  postId: number
}

const PostViews = ({ postId, ...props }: PostViewsProps) => {
  const { post } = usePostAPI(postId ?? null)
  const views = getMeta(post?.meta, 'views', '0')

  return (
    <div className="flex items-center" {...props}>
      <LucideIcon name="Eye" size={20} className="mr-2" />
      {views?.toLocaleString()}
    </div>
  )
}

export { PostViews, type PostViewsProps }
