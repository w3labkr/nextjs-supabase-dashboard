'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn, fetcher } from '@/lib/utils'
import { toast } from 'sonner'
import { SubmitButton } from '@/components/submit-button'
import {
  EmailListItemContext,
  EmailListItemContextProps,
} from './email-list-item-provider'

import { useAuth } from '@/hooks/use-auth'
import { VerifyTokenPayload } from '@/types/token'

type FormValues = VerifyTokenPayload

export function ResendVerifyEmail() {
  const state = React.useContext(EmailListItemContext)
  const { t } = useTranslation()

  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async (values: EmailListItemContextProps) => {
    try {
      setIsSubmitting(true)

      if (!values?.email) throw new Error('Require is not defined.')
      if (!user?.id) throw new Error('Require is not defined.')

      const formValues: FormValues = {
        email: values?.email,
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

  if (state?.isVerified) return null

  return (
    <SubmitButton
      isSubmitting={isSubmitting}
      type="button"
      variant="link"
      className="h-auto p-0 text-xs font-semibold text-blue-700"
      onClick={() => handleClick(state)}
      text="ResendVerificationButton.label"
      translate="yes"
    />
  )
}
