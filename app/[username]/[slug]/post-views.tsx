'use client'

import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'
import { getMeta } from '@/lib/utils'
import { PostMeta } from '@/types/database'

interface PostViewsProps extends React.HTMLAttributes<HTMLDivElement> {
  meta?: PostMeta[]
}

const PostViews = ({ meta, ...props }: PostViewsProps) => {
  const views = getMeta(meta, 'views', '0')

  return (
    <div className="flex items-center" {...props}>
      <LucideIcon name="Eye" className="mr-2 size-5 min-w-5" />
      {views?.toLocaleString()}
    </div>
  )
}

export { PostViews, type PostViewsProps }
