'use client'

import * as React from 'react'

export interface PostListContextProps {
  page: number | null
  perPage: number | null
}

export const PostListContext = React.createContext<PostListContextProps>({
  page: null,
  perPage: null,
})

export function PostListProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: PostListContextProps
}) {
  return (
    <PostListContext.Provider value={value}>
      {children}
    </PostListContext.Provider>
  )
}
