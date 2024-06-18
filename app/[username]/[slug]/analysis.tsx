'use client'

import * as React from 'react'
import { usePost } from './post-provider'
import { createClient } from '@/supabase/client'

const Analysis = () => {
  const { post } = usePost()

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const setPostViews = async () => {
        const supabase = createClient()
        await supabase.rpc('set_post_views', { postid: post?.id })
      }
      setPostViews()
    }
  }, [])

  return null
}

export { Analysis }
