'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'next/navigation'

import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'
import { LucideIcon, type LucideIconName } from '@/lib/lucide-icon'

import { useSWRConfig } from 'swr'
import { fetcher, setQueryString, generateRecentPosts, cn } from '@/lib/utils'
import { useUserAPI } from '@/queries/client/users'
import { PostAPI } from '@/types/api'

interface AddDummyPostProps
  extends ButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  startIconName?: LucideIconName
  startIconClassName?: string
  endIconName?: LucideIconName
  endIconClassName?: string
  text?: string
  ns?: string
}

const AddDummyPost = ({
  children,
  startIconName,
  startIconClassName,
  endIconName,
  endIconClassName,
  text,
  ns,
  translate,
  ...props
}: AddDummyPostProps) => {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { user } = useUserAPI()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')

      const posts = generateRecentPosts(user?.id, 1)

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i]

        const username = user?.username
        const slug = post?.slug
        const revalidatePaths = username && slug ? `/${username}/${slug}` : null

        const { error } = await fetcher<PostAPI>(
          `/api/v1/post?userId=${user?.id}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              data: post,
              options: { revalidatePaths },
            }),
          }
        )

        if (error) throw new Error(error?.message)

        const countSearchParams = setQueryString({
          userId: user?.id,
          postType: (searchParams.get('postType') as string) ?? 'post',
          q: searchParams.get('q') as string,
        })

        const listSearchParams = setQueryString({
          userId: user?.id,
          page: +((searchParams.get('page') as string) ?? '1'),
          perPage: +((searchParams.get('perPage') as string) ?? '10'),
          postType: (searchParams.get('postType') as string) ?? 'post',
          status: searchParams.get('status') as string,
          q: searchParams.get('q') as string,
          orderBy: (searchParams.get('orderBy') as string) ?? 'id',
          order: (searchParams.get('order') as string) ?? 'desc',
        })

        mutate(`/api/v1/post?userId=${user?.id}`)
        mutate(`/api/v1/post/count?${countSearchParams}`)
        mutate(`/api/v1/post/list?${listSearchParams}`)
      }
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
    <Button type="button" onClick={onClick} disabled={isSubmitting} {...props}>
      {startIconName ? (
        <LucideIcon
          name={startIconName}
          className={cn('mr-2 size-4 min-w-4', startIconClassName)}
        />
      ) : null}
      {text && translate === 'yes' ? t(text, { ns }) : text}
      {children && typeof children === 'string' && translate === 'yes'
        ? t(children, { ns })
        : children}
      {endIconName ? (
        <LucideIcon
          name={endIconName}
          className={cn('ml-2 size-4 min-w-4', endIconClassName)}
        />
      ) : null}
    </Button>
  )
}

export { AddDummyPost, type AddDummyPostProps }
