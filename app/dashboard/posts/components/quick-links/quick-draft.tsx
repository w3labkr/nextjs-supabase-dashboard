'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { usePaging } from '@/components/paging'

import { useSWRConfig } from 'swr'
import { fetcher, relativeUrl, setQueryString } from '@/lib/utils'
import { type PostAPI } from '@/types/api'
import { type Post } from '@/types/database'

interface QuickDraftProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  post: Post
}

const QuickDraft = ({ post, ...props }: QuickDraftProps) => {
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const paging = usePaging()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsSubmitting(true)

      const revalidatePaths = post?.permalink
        ? relativeUrl(post?.permalink)
        : null

      const { error } = await fetcher<PostAPI>(`/api/v1/post?id=${post?.id}`, {
        method: 'POST',
        body: JSON.stringify({
          data: { status: 'draft', user_id: post?.user_id },
          options: { revalidatePaths },
        }),
      })

      if (error) throw new Error(error?.message)

      const countSearchParams = setQueryString({
        userId: post?.user_id,
        postType: paging?.postType,
        q: paging?.q,
      })

      const listSearchParams = setQueryString({
        userId: post?.user_id,
        postType: paging?.postType,
        status: paging?.status,
        q: paging?.q,
        orderBy: paging?.orderBy,
        order: paging?.order,
        perPage: paging?.perPage,
        page: paging?.page,
      })

      mutate(`/api/v1/post?id=${post?.id}`)
      mutate(`/api/v1/post/count?${countSearchParams}`)
      mutate(`/api/v1/post/list?${listSearchParams}`)

      toast.success(t('changed_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      className="text-xs text-blue-700 hover:underline dark:text-white"
      onClick={onClick}
      disabled={isSubmitting}
      {...props}
    >
      {t('draft')}
    </button>
  )
}

export { QuickDraft, type QuickDraftProps }
