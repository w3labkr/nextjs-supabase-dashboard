'use client'

import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { User } from '@supabase/supabase-js'
import { useEmails } from '@/hooks/api/use-emails'

import { EmailListItem } from './email-list-item'
import { AddEmailAddress } from './add-email-address'
import { PrimaryEmailAddress } from './primary-email-address'

export function EmailList({ user }: { user: User }) {
  const fetchEmails = useEmails(user?.id ?? null)
  const { data: emails } = fetchEmails

  if (fetchEmails?.isLoading) return null

  return (
    <div className="space-y-4">
      <Title text="ChangeEmailForm.title" translate="yes" />
      <Separator />
      <Description text="ChangeEmailForm.description" translate="yes" />
      <div className="flex flex-col gap-2">
        {emails?.map((item) => (
          <EmailListItem key={item?.id} item={item} user={user} />
        ))}
      </div>
      <AddEmailAddress user={user} />
      <Separator />
      <PrimaryEmailAddress user={user} />
    </div>
  )
}
