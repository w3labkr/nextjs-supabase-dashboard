'use client'

import * as React from 'react'
import { Post } from '@/types/database'

interface PostFormContextProps {
  post: Post | null
}

const PostFormContext = React.createContext<PostFormContextProps | undefined>({
  post: null,
})

const PostFormProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: PostFormContextProps
}) => {
  const memoValue = React.useMemo(() => value, [value])

  return (
    <PostFormContext.Provider value={memoValue}>
      {children}
    </PostFormContext.Provider>
  )
}

const usePostForm = () => {
  const context = React.useContext<PostFormContextProps | undefined>(
    PostFormContext
  )

  if (context === undefined) {
    throw new Error('usePostForm must be used within PostFormProvider')
  }

  return context
}

export { PostFormProvider, usePostForm }
