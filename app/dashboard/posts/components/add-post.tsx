'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { LucideIcon, type LucideIconName } from '@/lib/lucide-icon'
import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { PostAPI } from '@/types/api'

interface AddPostProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  startIconName?: LucideIconName
  endIconName?: LucideIconName
  text?: string
  ns?: string
}

const AddPost = ({
  children,
  startIconName,
  endIconName,
  translate,
  text,
  ns,
  ...props
}: AddPostProps) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAuth()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')

      const { data: post, error } = await fetcher<PostAPI>(
        `/api/v1/post?userId=${user?.id}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            data: { title: 'Untitled Post', user_id: user?.id },
          }),
        }
      )

      if (error) throw new Error(error?.message)

      router.push(`/dashboard/posts/edit?id=${post?.id}`)
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
        <LucideIcon name={startIconName} className="mr-2 size-4 min-w-4" />
      ) : null}
      {text && translate === 'yes' ? t(text, { ns }) : text}
      {children && typeof children === 'string' && translate === 'yes'
        ? t(children, { ns })
        : children}
      {endIconName ? (
        <LucideIcon name={endIconName} className="ml-2 size-4 min-w-4" />
      ) : null}
    </Button>
  )
}

export { AddPost, type AddPostProps }
