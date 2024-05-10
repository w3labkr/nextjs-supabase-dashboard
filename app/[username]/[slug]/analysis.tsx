'use client'

import * as React from 'react'
import { usePost } from './post-provider'
import { createClient } from '@/supabase/client'

const Analysis = () => {
  const { post } = usePost()

  const setViewCount = async (pid: number) => {
    const supabase = createClient()
    const result = await supabase.rpc('set_view_count', { pid })
  }

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewCount(post?.id)
    }
  }, [])

  return null
}

export { Analysis }
