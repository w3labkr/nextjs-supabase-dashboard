'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'

import { EmailListItemContext } from './email-list-item-provider'

import useSWRMutation from 'swr/mutation'
import { fetcher } from '@/lib/utils'
import { User } from '@supabase/supabase-js'

interface SendRequestArg {
  user_id: string
  email: string
}

async function sendRequest(url: string, { arg }: { arg: SendRequestArg }) {
  return await fetcher(url, {
    method: 'DELETE',
    body: JSON.stringify(arg),
  })
}

export function DeleteEmailAddress({ user }: { user: User }) {
  const state = React.useContext(EmailListItemContext)
  const { t } = useTranslation()

  const requestUrl = user?.id ? `/api/v1/emails/${user?.id}` : null
  const { trigger } = useSWRMutation(requestUrl, sendRequest)

  const handleClick = async () => {
    try {
      const response = await trigger({
        user_id: user?.id,
        email: state?.email,
      })
      if (response?.error) throw new Error(response?.error?.message)

      toast.success(t('FormMessage.email_has_been_successfully_deleted'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    }
  }

  if (state?.isPrimary) return null

  return (
    <button
      type="button"
      className="rounded-md border p-1.5 text-red-700 hover:bg-red-700 hover:text-white"
      onClick={handleClick}
    >
      <LucideIcon name="Trash" className="size-4 min-w-4" />
    </button>
  )
}
