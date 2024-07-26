'use client'

import * as React from 'react'

import { createClient } from '@/supabase/client'
import { LucideIcon } from '@/lib/lucide-icon'
import { getMetaValue } from '@/lib/utils'
import { type Post } from '@/types/database'

interface PostViewsProps extends React.HTMLAttributes<HTMLDivElement> {
  post?: Post
}

const PostViews = ({ post, ...props }: PostViewsProps) => {
  const views = getMetaValue(post?.meta, 'views', '0')
  const setPostViews = React.useCallback(async (postid: number) => {
    const supabase = createClient()
    const result = await supabase.rpc('set_post_views', { postid })
    // console.log(result)
  }, [])

  React.useEffect(() => {
    if (typeof window !== 'undefined' && post?.id) {
      setPostViews(post?.id)
    }
  }, [post?.id, setPostViews])

  return (
    <div className="flex items-center" {...props}>
      <LucideIcon name="Eye" className="mr-2 size-5 min-w-5" />
      {+views?.toLocaleString()}
    </div>
  )
}

export { PostViews, type PostViewsProps }
