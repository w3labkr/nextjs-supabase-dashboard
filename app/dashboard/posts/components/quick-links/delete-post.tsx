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

interface DeletePostProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post
}

const DeletePost = (props: DeletePostProps) => {
  const { post, ...rest } = props
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const paging = usePaging()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      const revalidatePaths = [
        getPostPath(post),
        getAuthorPath(post),
        getAuthorFavoritesPath(post),
      ]

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const deleted = await fetcher<PostAPI>(fetchUrl, {
        method: 'DELETE',
        body: JSON.stringify({
          data: { user_id: post?.user_id },
          options: { revalidatePaths },
        }),
      })

      if (deleted?.error) throw new Error(deleted?.error?.message)

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
      onClick={handleClick}
      disabled={isSubmitting}
      {...rest}
    >
      {t('PostList.DeletePost')}
    </button>
  )
}

export { DeletePost, type DeletePostProps }
