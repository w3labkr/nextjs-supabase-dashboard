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

const ResendVerifyEmail = (props: ResendVerifyEmailProps) => {
  const { item } = props

  const { t } = useTranslation()
  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')
      if (!item) throw new Error('Require is not defined.')

      const formData = { email: item?.email }

      const fetchUrl = `/api/v1/email/verify?userId=${user?.id}`
      const result = await fetcher(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({ formData }),
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
      className="text-xs font-semibold text-blue-700 hover:underline"
      onClick={handleClick}
      disabled={isSubmitting}
    >
      {t('ResendVerificationButton.label')}
    </button>
  )
}

export { ResendVerifyEmail }
