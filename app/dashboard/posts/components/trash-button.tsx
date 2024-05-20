'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { usePaging } from '@/components/paging/paging-provider'

import { useSWRConfig } from 'swr'
import { fetcher, setQueryString, getPostPath } from '@/lib/utils'
import { PostAPI } from '@/types/api'
import { Post } from '@/types/database'

interface TrashButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post
}

const TrashButton = (props: TrashButtonProps) => {
  const { post, ...rest } = props

  const { t } = useTranslation()
  const { page, perPage, status } = usePaging()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      const userId = post?.user_id

      if (!userId) throw new Error('Require is not defined.')

      const fetchData = {
        user_id: userId,
        status: 'trash',
        deleted_at: new Date().toISOString(),
      }

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const fetchOptions = { revalidatePaths: getPostPath(post) }
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ data: fetchData, options: fetchOptions }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      const query = setQueryString({ userId, page, perPage, status })

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
      className="text-xs text-red-500 hover:underline"
      onClick={handleClick}
      disabled={isSubmitting}
      {...rest}
    >
      {t('PostList.TrashButton')}
    </button>
  )
}

export { TrashButton, type TrashButtonProps }
