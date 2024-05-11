'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { usePaging } from '@/components/paging/paging-provider'

import { useSWRConfig } from 'swr'
import { fetcher, setQueryString, getPostPath } from '@/lib/utils'
import { PostAPI } from '@/types/api'
import { Post } from '@/types/database'

interface RestoreButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post
}

const RestoreButton = (props: RestoreButtonProps) => {
  const { post, ...rest } = props

  const { t } = useTranslation()
  const { page, perPage, postStatus } = usePaging()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      const userId = post?.user_id

      if (!userId) throw new Error('Require is not defined.')

      const formData = { user_id: userId, status: 'draft', deleted_at: null }

      const fetchUrl = `/api/v1/post?id=${post?.id}`
      const fetchOptions = { revalidatePaths: getPostPath(post) }
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ formData, options: fetchOptions }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      const query = setQueryString({ userId, page, perPage, postStatus })

      mutate(fetchUrl)
      mutate(`/api/v1/post/list?${query}`)
      mutate(`/api/v1/post/count?userId=${userId}`)

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
      {t('PostList.RestoreButton')}
    </button>
  )
}

export { RestoreButton, type RestoreButtonProps }
