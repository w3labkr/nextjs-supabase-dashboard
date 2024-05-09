'use client'

import * as React from 'react'
import { setViewCount } from '@/queries/sync'
import { usePost } from './post-provider'

const Analysis = () => {
  const { post } = usePost()

  React.useEffect(() => {
    if (typeof window !== 'undefined' && post) {
      const viewCount = async () => {
        await setViewCount(post?.id)
      }
      viewCount()
    }
  }, [post])
}

export { Analysis }
