'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { fetcher, qs } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import { usePaging } from '@/components/paging/paging-provider'
import { usePostItem } from './post-item-provider'
import { useSWRConfig } from 'swr'

export function DeletePostButton() {
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

      const formValues = { user_id }
      const result = await fetcher(`/api/v1/post/${id}`, {
        method: 'DELETE',
        body: JSON.stringify(formValues),
      })

      if (result?.error) throw new Error(result?.error?.message)

      const queryString = qs({ page, perPage, status })

      mutate(`/api/v1/posts/${user_id}?${queryString}`)
      mutate(`/api/v1/posts/${user_id}/count`)

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
      {t('PostList.DeletePostButton')}
    </Button>
  )
}
