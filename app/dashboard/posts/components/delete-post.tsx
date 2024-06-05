'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { usePaging } from '@/components/paging'

import { useSWRConfig } from 'swr'
import { fetcher, setQueryString, getPostPath } from '@/lib/utils'
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

      const userId = post?.user_id

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const deleted = await fetcher<PostAPI>(fetchUrl, {
        method: 'DELETE',
        body: JSON.stringify({
          data: { user_id: userId },
          options: { revalidatePaths: getPostPath(post) },
        }),
      })

      if (deleted?.error) throw new Error(deleted?.error?.message)

      const query = setQueryString({
        userId,
        page: paging?.page,
        perPage: paging?.perPage,
        postType: paging?.postType,
        status: paging?.status,
      })

      mutate(fetchUrl)
      mutate(`/api/v1/post/list?${query}`)
      mutate(`/api/v1/post/count?userId=${userId}`)

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
