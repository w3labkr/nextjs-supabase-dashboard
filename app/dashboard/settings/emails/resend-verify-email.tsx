'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn, fetcher } from '@/lib/utils'
import { toast } from 'sonner'
import { SubmitButton } from '@/components/submit-button'
import { useEmailItem } from './email-item-provider'

import { useAuth } from '@/hooks/use-auth'
import { VerifyTokenPayload } from '@/types/token'

type FormValues = VerifyTokenPayload

export function ResendVerifyEmail() {
  const { t } = useTranslation()
  const { email, isVerified } = useEmailItem()

  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      if (!email) throw new Error('Require is not defined.')
      if (!user?.id) throw new Error('Require is not defined.')

      const formValues: FormValues = {
        email,
        user_id: user?.id,
      }
      const result = await fetcher(`/api/v1/email/verify/${user?.id}`, {
        method: 'POST',
        body: JSON.stringify(formValues),
      })
      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.email_has_been_successfully_sent'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isVerified) return null

  return (
    <SubmitButton
      isSubmitting={isSubmitting}
      type="button"
      variant="link"
      className="h-auto p-0 text-xs font-semibold text-blue-700"
      onClick={handleClick}
      text="ResendVerificationButton.label"
      translate="yes"
    />
  )
}
