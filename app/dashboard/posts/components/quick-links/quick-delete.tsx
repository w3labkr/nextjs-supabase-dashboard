'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { usePaging } from '@/components/paging'

import { useSWRConfig } from 'swr'
import {
  fetcher,
  setQueryString,
  getPostPath,
  getAuthorPath,
  getAuthorFavoritesPath,
} from '@/lib/utils'
import { PostAPI } from '@/types/api'
import { Post } from '@/types/database'

interface QuickDeleteProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post
}

const QuickDelete = ({ post, ...props }: QuickDeleteProps) => {
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const paging = usePaging()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsSubmitting(true)

      const revalidatePaths = [
        getPostPath(post),
        getAuthorPath(post),
        getAuthorFavoritesPath(post),
      ]

      const deleted = await fetcher<PostAPI>(`/api/v1/post?id=${post?.id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          data: { user_id: post?.user_id },
          options: { revalidatePaths },
        }),
      })

      if (deleted?.error) throw new Error(deleted?.error?.message)

      const countSearchParams = setQueryString({
        userId: post?.user_id,
        postType: paging?.postType,
        q: paging?.q,
      })

      const listSearchParams = setQueryString({
        userId: post?.user_id,
        page: paging?.page,
        perPage: paging?.perPage,
        postType: paging?.postType,
        status: paging?.status,
        q: paging?.q,
      })

      mutate(`/api/v1/post?id=${post?.id}`)
      mutate(`/api/v1/post/count?${countSearchParams}`)
      mutate(`/api/v1/post/list?${listSearchParams}`)

      toast.success(t('FormMessage.deleted_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      className="text-xs text-destructive hover:underline"
      onClick={onClick}
      disabled={isSubmitting}
      {...props}
    >
      {t('QuickLinks.delete')}
    </button>
  )
}

export { QuickDelete, type QuickDeleteProps }
