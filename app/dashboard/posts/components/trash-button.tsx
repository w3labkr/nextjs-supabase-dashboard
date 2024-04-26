'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'

import { usePaging } from '@/components/paging/paging-provider'
import { usePostItem } from '../context/post-item-provider'

import { useSWRConfig } from 'swr'
import { fetcher, setSearchParams } from '@/lib/utils'
import { PostAPI } from '@/types/api'

export function TrashButton() {
  const { t } = useTranslation()
  const { post } = usePostItem()
  const { page, perPage, status } = usePaging()

  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      const id = post?.id
      const user_id = post?.user_id

      if (!id) throw new Error('Require is not defined.')
      if (!user_id) throw new Error('Require is not defined.')

      const fetchUrl = `/api/v1/post?id=${id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          user_id,
          status: 'trash',
          deleted_at: new Date().toISOString(),
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)
      mutate(
        '/api/v1/post/list?' +
          setSearchParams({ uid: user_id, page, perPage, status })
      )
      mutate(`/api/v1/post/count?uid=${user_id}`)

      toast.success(t('FormMessage.deleted_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      className="text-xs text-red-700 hover:underline"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {t('PostList.TrashButton')}
    </button>
  )
}
