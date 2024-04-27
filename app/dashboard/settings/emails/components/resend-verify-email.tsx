'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { useEmailItem } from '../context/email-item-provider'

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

export function ResendVerifyEmail() {
  const { t } = useTranslation()
  const { email, isVerified } = useEmailItem()

  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      const uid = user?.id

      if (!uid) throw new Error('Require is not defined.')
      if (!email) throw new Error('Require is not defined.')

      const fetchUrl = `/api/v1/email/verify?uid=${uid}`
      const result = await fetcher(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ formData: { email } }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.email_has_been_successfully_sent'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isVerified) return null

  return (
    <button
      type="button"
      className="text-xs font-semibold text-blue-700 underline-offset-2 hover:underline"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {t('ResendVerificationButton.label')}
    </button>
  )
}
