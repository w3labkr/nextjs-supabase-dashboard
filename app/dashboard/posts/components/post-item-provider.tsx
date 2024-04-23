'use client'

import * as React from 'react'
import { Post } from '@/types/database'

export interface PostItemContextProps {
  post: Post | null
}

export const PostItemContext = React.createContext<
  PostItemContextProps | undefined
>(undefined)

export function PostItemProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: PostItemContextProps
}) {
  const { post } = value
  const memoValue = React.useMemo(() => ({ post }), [post])

  return (
    <PostItemContext.Provider value={memoValue}>
      {children}
    </PostItemContext.Provider>
  )
}

export function usePostItem() {
  const context = React.useContext<PostItemContextProps | undefined>(
    PostItemContext
  )

  if (context === undefined) {
    throw new Error('usePostItem must be used within PostItemProvider')
  }

  return context
}
