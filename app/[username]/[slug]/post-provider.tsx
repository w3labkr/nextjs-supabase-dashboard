'use client'

import * as React from 'react'
import { Post } from '@/types/database'

interface PostContextProps {
  post: Post
}

const PostContext = React.createContext<PostContextProps | undefined>(undefined)

function PostProvider({
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

function usePost() {
  const context = React.useContext<PostContextProps | undefined>(PostContext)

  if (context === undefined) {
    throw new Error('usePost must be used within PostProvider')
  }

  return context
}

export { PostProvider, usePost }
