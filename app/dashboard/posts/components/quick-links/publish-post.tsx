'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { usePaging } from '@/components/paging'

import { useSWRConfig } from 'swr'
import {
  fetcher,
  setUrn,
  setQueryString,
  getPostPath,
  getAuthorPath,
  getAuthorFavoritesPath,
} from '@/lib/utils'
import { PostAPI } from '@/types/api'
import { Post } from '@/types/database'

interface TrashPostProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post
}

const PublishPost = (props: TrashPostProps) => {
  const { post, ...rest } = props
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const paging = usePaging()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      const now = new Date().toISOString()
      const revalidatePaths = [
        getPostPath(post),
        getAuthorPath(post),
        getAuthorFavoritesPath(post),
      ]

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const updated = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          data: post?.date
            ? { status: 'publish', user_id: post?.user_id }
            : { status: 'publish', user_id: post?.user_id, date: now },
          options: { revalidatePaths },
        }),
      })

      if (updated?.error) throw new Error(updated?.error?.message)

      const qsCounter = setQueryString({
        userId: post?.user_id,
        postType: paging?.postType,
        q: paging?.q,
      })

      const qsList = setQueryString({
        userId: post?.user_id,
        page: paging?.page,
        perPage: paging?.perPage,
        postType: paging?.postType,
        status: paging?.status,
        q: paging?.q,
      })

      mutate(fetchUrl)
      mutate(setUrn('/api/v1/post/count', qsCounter))
      mutate(setUrn('/api/v1/post/list', qsList))

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      className="text-xs text-blue-700 hover:underline"
      onClick={handleClick}
      disabled={isSubmitting}
      {...rest}
    >
      {t('PostList.PublishPost')}
    </button>
  )
}

export { PublishPost, type TrashPostProps }
