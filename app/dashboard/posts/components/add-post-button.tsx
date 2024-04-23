'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

interface AddPostButtonProps extends ButtonProps {
  text?: string
  startIconName?: LucideIconName
  endIconName?: LucideIconName
}

export function AddPostButton({
  children,
  text,
  translate,
  startIconName,
  endIconName,
  ...props
}: AddPostButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { user } = useAuth()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async function () {
    try {
      setIsSubmitting(true)

      if (!user?.id) throw new Error('Require is not defined.')

      const formValues = { user_id: user?.id, title: 'Untitled Post' }
      const result = await fetcher(`/api/v1/post`, {
        method: 'PUT',
        body: JSON.stringify(formValues),
      })

      if (result?.error) throw new Error(result?.error?.message)

      router.push(`/dashboard/posts/edit?id=${result?.data?.id}`)
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
    <Button onClick={handleClick} disabled={isSubmitting} {...props}>
      {startIconName && (
        <LucideIcon name={startIconName} className="mr-2 size-4" />
      )}
      {text && translate === 'yes' ? t(text) : text}
      {children}
      {endIconName && <LucideIcon name={endIconName} className="ml-2 size-4" />}
    </Button>
  )
}
