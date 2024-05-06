'use client'

import * as React from 'react'
import { Post } from '@/types/database'
import { setPostViews } from '@/queries/sync'

const Analytics = ({ post }: { post: Post }) => {
  React.useEffect(() => {
    if (post) {
      const views = async () => {
        await setPostViews(post?.id)
      }
      views()
    }
  }, [post])
}

export { Analytics }
