'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

import { LucideIcon, LucideIconName } from '@/lib/lucide-icon'
import { toast } from 'sonner'
import { Button, ButtonProps } from '@/components/ui/button'

import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

interface AddButtonProps
  extends ButtonProps,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  startIconName?: LucideIconName
  endIconName?: LucideIconName
}

const AddButton = (props: AddButtonProps) => {
  const { children, text, translate, startIconName, endIconName, ...rest } =
    props

  const { user } = useAuth()
  const { t } = useTranslation()
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')

      const fetchUrl = `/api/v1/post?userId=${user?.id}`
      const result = await fetcher(fetchUrl, {
        method: 'PUT',
        body: JSON.stringify({
          data: { title: 'Untitled Post' },
        }),
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

export { AddButton, type AddButtonProps }
