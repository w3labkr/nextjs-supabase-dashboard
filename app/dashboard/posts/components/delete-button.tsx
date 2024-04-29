'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { usePaging } from '@/components/paging/paging-provider'
import { usePost } from '../context/post-provider'

import { useSWRConfig } from 'swr'
import { fetcher, setQueryString } from '@/lib/utils'
import { PostAPI } from '@/types/api'

export function DeleteButton() {
  const { t } = useTranslation()
  const { post } = usePost()
  const { page, perPage, status } = usePaging()

  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      const id = post?.id
      const uid = post?.user_id
      const username = post?.profile?.username
      const slug = post?.slug

      if (!id) throw new Error('Require is not defined.')
      if (!uid) throw new Error('Require is not defined.')
      if (!username) throw new Error('Require is not defined.')

      const fetchUrl = `/api/v1/post?id=${id}`
      const result = await fetcher<PostAPI>(fetchUrl, {
        method: 'DELETE',
        body: JSON.stringify({
          formData: { user_id: uid },
          options: { revalidatePath: slug ? `/${username}/${slug}` : null },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      const query = setQueryString({ uid, page, perPage, status })

      mutate(fetchUrl)
      mutate(`/api/v1/post/list?${query}`)
      mutate(`/api/v1/post/count?uid=${uid}`)

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
      {t('PostList.DeleteButton')}
    </button>
  )
}
