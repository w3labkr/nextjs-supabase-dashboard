'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Email } from '@/types/database'

export function ResendVerifyEmail({ item }: { item: Email }) {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { t } = useTranslation()
  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')
      if (!item) throw new Error('Require is not defined.')

      const fetchUrl = `/api/v1/email/verify?uid=${user?.id}`
      const result = await fetcher(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ formData: { email: item?.email } }),
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

  if (item?.email_confirmed_at) return null

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
