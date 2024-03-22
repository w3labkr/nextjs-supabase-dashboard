'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import { EmailListItemContext } from './email-list-item-provider'

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { User } from '@supabase/supabase-js'

export function DeleteEmailAddress({ user }: { user: User | null }) {
  const state = React.useContext(EmailListItemContext)
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()

  const handleClick = async () => {
    try {
      if (!user?.id) throw new Error('Something went wrong.')

      const deleted = await fetcher(`/api/v1/email/${user?.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ email: state?.email }),
      })
      if (deleted?.error) throw new Error(deleted?.error?.message)

      mutate(`/api/v1/emails/${user?.id}`)
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
