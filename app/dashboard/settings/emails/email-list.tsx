'use client'

import * as React from 'react'

import { EmailItem } from './email-item'

import { useAuth } from '@/hooks/use-auth'
import { useEmails } from '@/hooks/sync/use-emails'

export function EmailList() {
  const { user } = useAuth()
  const { emails } = useEmails(user?.id ?? null)

  if (!emails) return <div>Loading...</div>

  return (
    <div className="flex flex-col gap-2">
      {emails?.map((item) => <EmailItem key={item?.id} item={item} />)}
    </div>
  )
}
