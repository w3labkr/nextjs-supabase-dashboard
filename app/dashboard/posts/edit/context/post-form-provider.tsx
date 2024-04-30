'use client'

import * as React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { FormValues } from '../post-form'
import { Post } from '@/types/database'

export interface PostFormContextProps {
  form: UseFormReturn<FormValues>
  post: Post | null
}

export const PostFormContext = React.createContext<
  PostFormContextProps | undefined
>(undefined)

export function PostFormProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: PostFormContextProps
}) {
  const { form, post } = value
  const memoValue = React.useMemo(() => ({ form, post }), [form, post])

  return (
    <PostFormContext.Provider value={memoValue}>
      {children}
    </PostFormContext.Provider>
  )
}

export function usePostForm() {
  const context = React.useContext<PostFormContextProps | undefined>(
    PostFormContext
  )

  if (context === undefined) {
    throw new Error('usePostForm must be used within PostFormProvider')
  }

  return context
}
