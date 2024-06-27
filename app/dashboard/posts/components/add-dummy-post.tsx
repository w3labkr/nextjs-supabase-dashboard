'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

import { useSWRConfig } from 'swr'
import {
  fetcher,
  setQueryString,
  generateRecentPosts,
  getPostPath,
  getProfilePath,
  getFavoritesPath,
} from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { PostAPI } from '@/types/api'
import { useSearchParams } from 'next/navigation'
import { useUserAPI } from '@/queries/client/users'
import { Post } from '@/types/database'

interface AddDummyPostProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  startIconName?: LucideIconName
  endIconName?: LucideIconName
  text?: string
  ns?: string
}

const AddDummyPost = ({
  children,
  startIconName,
  endIconName,
  translate,
  text,
  ns,
  ...props
}: AddDummyPostProps) => {
  const searchParams = useSearchParams()
  const { t } = useTranslation()
  const { session } = useAuth()
  const { user } = useUserAPI(session?.user?.id ?? null)
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')

      const posts = generateRecentPosts(user?.id, 1)

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i]

        const { error } = await fetcher<PostAPI>(
          `/api/v1/post?userId=${user?.id}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              data: post,
              options: {
                revalidatePaths: getPostPath(post, {
                  username: user?.username,
                }),
              },
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
        <LucideIcon name={startIconName} size={16} className="mr-2" />
      ) : null}
      {text && translate === 'yes' ? t(text, { ns }) : text}
      {children && typeof children === 'string' && translate === 'yes'
        ? t(children, { ns })
        : children}
      {endIconName ? (
        <LucideIcon name={endIconName} size={16} className="ml-2" />
      ) : null}
    </Button>
  )
}

export { AddDummyPost, type AddDummyPostProps }
