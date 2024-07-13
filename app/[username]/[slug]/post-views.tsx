'use client'

import * as React from 'react'
import { createClient } from '@/supabase/client'

import { LucideIcon } from '@/lib/lucide-icon'
import { getMeta } from '@/lib/utils'
import { usePostAPI } from '@/queries/client/posts'

interface PostViewsProps extends React.HTMLAttributes<HTMLDivElement> {
  postId: number
}

const PostViews = ({ postId, ...props }: PostViewsProps) => {
  const { post } = usePostAPI(postId ?? null)
  const views = getMeta(post?.meta, 'views', '0')
  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    if (mounted) {
      const setPostViews = async () => {
        const supabase = createClient()
        const { error } = await supabase.rpc('set_post_views', {
          postid: postId,
        })
        if (error) console.error(error)
      }
      setPostViews()
    }
  }, [mounted])

  return (
    <div className="flex items-center" {...props}>
      <LucideIcon name="Eye" className="mr-2 size-5 min-w-5" />
      {views?.toLocaleString()}
    </div>
  )
}

export { PostViews, type PostViewsProps }
