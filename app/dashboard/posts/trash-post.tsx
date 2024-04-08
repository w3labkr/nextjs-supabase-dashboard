'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { cn, fetcher } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { PostListContext } from './post-list-provider'

import { useSWRConfig } from 'swr'
import { Post } from '@/types/database'
import { PostAPI } from '@/types/api'

interface FormValues {
  user_id: string
  status: string
  deleted_at: string
}

export function TrashPost({ post }: { post: Post }) {
  const { t } = useTranslation()
  const state = React.useContext(PostListContext)

  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      const { page, perPage } = state
      const { id, user_id } = post

      if (!page) throw new Error('Require is not defined.')
      if (!perPage) throw new Error('Require is not defined.')
      if (!user_id) throw new Error('Require is not defined.')

      const formValues: FormValues = {
        user_id,
        status: 'trash',
        deleted_at: new Date().toISOString(),
      }
      const result = await fetcher<PostAPI>(`/api/v1/post/${id}`, {
        method: 'POST',
        body: JSON.stringify(formValues),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(`/api/v1/posts/${user_id}?page=${page}&perPage=${perPage}`)

      toast.success(t('FormMessage.deleted_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      variant="ghost"
      className="h-auto p-0 text-xs font-normal text-red-700 hover:underline"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      Trash
    </Button>
  )
}
