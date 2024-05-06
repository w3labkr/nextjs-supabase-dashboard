'use client'

import * as React from 'react'
import { setPostViews } from '@/queries/sync'
import { usePost } from './post-provider'

const Analytics = () => {
  const { post } = usePost()

  React.useEffect(() => {
    if (post) {
      const views = async () => {
        await setPostViews(post?.id)
      }
      views()
    }
  }, [post])

  return null
}

export { Analytics }
