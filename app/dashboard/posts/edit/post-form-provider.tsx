'use client'

import * as React from 'react'

import { UseFormReturn } from 'react-hook-form'
import { FormValues } from './post-form'
import { Post } from '@/types/database'

interface PostFormContextProps {
  form: UseFormReturn<FormValues>
  post: Post | null
}

const PostFormContext = React.createContext<PostFormContextProps | undefined>(
  undefined
)

function PostFormProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: PostFormContextProps
}) {
  const memoValue = React.useMemo(() => value, [value])

  return (
    <PostFormContext.Provider value={memoValue}>
      {children}
    </PostFormContext.Provider>
  )
}

function usePostForm() {
  const context = React.useContext<PostFormContextProps | undefined>(
    PostFormContext
  )

  if (context === undefined) {
    throw new Error('usePostForm must be used within PostFormProvider')
  }

  return context
}

export { PostFormProvider, usePostForm }
