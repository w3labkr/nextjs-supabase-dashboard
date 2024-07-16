'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { usePaging } from '@/components/paging'

import { useSWRConfig } from 'swr'
import { fetcher, relativeUrl, setQueryString } from '@/lib/utils'
import { PostAPI } from '@/types/api'
import { Tag } from '@/types/database'

interface QuickDeleteProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tag: Tag
}

const QuickDelete = ({ tag, ...props }: QuickDeleteProps) => {
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const paging = usePaging()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsSubmitting(true)

      const revalidatePaths = tag?.permalink
        ? relativeUrl(tag?.permalink)
        : null

      const { error } = await fetcher<PostAPI>(`/api/v1/tag?id=${tag?.id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          data: { user_id: tag?.user_id },
          options: { revalidatePaths },
        }),
      })

      if (error) throw new Error(error?.message)

      const listSearchParams = setQueryString({
        userId: tag?.user_id,
        q: paging?.q,
        orderBy: paging?.orderBy,
        order: paging?.order,
        perPage: paging?.perPage,
        page: paging?.page,
      })

      mutate(`/api/v1/tag?id=${tag?.id}`)
      mutate(`/api/v1/tag/list?${listSearchParams}`)

      toast.success(t('deleted_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      className="text-xs text-destructive hover:underline dark:text-white"
      onClick={onClick}
      disabled={isSubmitting}
      {...props}
    >
      {t('delete')}
    </button>
  )
}

export { QuickDelete, type QuickDeleteProps }
