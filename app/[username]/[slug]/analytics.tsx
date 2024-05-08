'use client'

import * as React from 'react'
import { setPostView } from '@/queries/sync'
import { usePost } from './post-provider'

const Analytics = () => {
  const { post } = usePost()

  React.useEffect(() => {
    if (post) {
      const views = async () => {
        await setPostView(post?.id)
      }
      views()
    }
  }, [post])

  return null
}

export { Analytics }
