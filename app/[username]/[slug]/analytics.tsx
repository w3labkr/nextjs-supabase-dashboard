'use client'

import * as React from 'react'
import { Post } from '@/types/database'
import { setPostViews } from '@/queries/sync'

const Analytics = ({ post }: { post: Post }) => {
  React.useEffect(() => {
    const views = async () => {
      const result = await setPostViews(post?.id)
    }
    views()
  }, [])

  return null
}

export { Analytics }
