'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Email } from '@/types/database'

interface ResendVerifyEmailProps {
  item: Email
}

const ResendVerifyEmail = ({ item }: ResendVerifyEmailProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')
      if (!item) throw new Error('Require is not defined.')

      const result = await fetcher(`/api/v1/email/verify?userId=${user?.id}`, {
        method: 'POST',
        body: JSON.stringify({
          data: { email: item?.email },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(`/api/v1/email/verify?userId=${user?.id}`)

      toast.success(t('email_has_been_successfully_sent'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (item?.email_confirmed_at) return null

  return (
    <button
      type="button"
      className="text-xs font-semibold text-blue-700 hover:underline"
      onClick={onClick}
      disabled={isSubmitting}
    >
      {t('resend_verification_email')}
    </button>
  )
}

export { ResendVerifyEmail }
