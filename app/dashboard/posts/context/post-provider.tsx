'use client'

import * as React from 'react'
import { Post } from '@/types/database'

export interface PostContextProps {
  post: Post
}

export const PostContext = React.createContext<PostContextProps | undefined>(
  undefined
)

export function PostProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: PostContextProps
}) {
  const memoValue = React.useMemo(() => value, [value])

  return (
    <PostContext.Provider value={memoValue}>{children}</PostContext.Provider>
  )
}

export function usePost() {
  const context = React.useContext<PostContextProps | undefined>(PostContext)

  if (context === undefined) {
    throw new Error('usePost must be used within PostProvider')
  }

  return context
}
