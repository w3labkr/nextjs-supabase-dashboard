'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

import { useSWRConfig } from 'swr'
import { fetcher, generateRecentPosts, setQueryString } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { PostAPI } from '@/types/api'
import { useSearchParams } from 'next/navigation'

interface AddDummyPostProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  startIconName?: LucideIconName
  endIconName?: LucideIconName
}

const AddDummyPost = (props: AddDummyPostProps) => {
  const { children, text, translate, startIconName, endIconName, ...rest } =
    props

  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')

      const userId = user?.id

      const fetchUrl = `/api/v1/post?userId=${userId}`
      const { error } = await fetcher<PostAPI>(fetchUrl, {
        method: 'PUT',
        body: JSON.stringify({
          data: generateRecentPosts(userId, 1),
        }),
      })

      if (error) throw new Error(error?.message)

      const query = setQueryString({
        userId,
        page: +((searchParams.get('page') as string) ?? '1'),
        perPage: +((searchParams.get('perPage') as string) ?? '10'),
        postType: (searchParams.get('postType') as string) ?? 'post',
        status: searchParams.get('status') as string,
      })

      mutate(fetchUrl)
      mutate(`/api/v1/post/list?${query}`)
      mutate(`/api/v1/post/count?userId=${userId}`)
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Payment Required')) {
        toast.error(t('402.statusText', { ns: 'httpstatuscode' }))
      } else {
        toast.error((e as Error)?.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      {...rest}
    >
      {startIconName && (
        <LucideIcon name={startIconName} className="mr-2 size-4" />
      )}
      {text && translate === 'yes' ? t(text) : text}
      {children}
      {endIconName && <LucideIcon name={endIconName} className="ml-2 size-4" />}
    </Button>
  )
}

export { AddDummyPost, type AddDummyPostProps }
