'use client'

import * as React from 'react'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { EmailListItem } from './email-list-item'
import { AddEmailAddress } from './add-email-address'
import { PrimaryEmailAddress } from './primary-email-address'

import { useAuth } from '@/hooks/use-auth'
import { useEmails } from '@/hooks/sync/use-emails'

export function EmailList() {
  const { user } = useAuth()
  const { emails } = useEmails(user?.id ?? null)

  if (!emails) return <div>Loading...</div>

  return (
    <div className="space-y-4">
      <Title text="ChangeEmailForm.title" translate="yes" />
      <Separator />
      <Description text="ChangeEmailForm.description" translate="yes" />
      <div className="flex flex-col gap-2">
        {emails?.map((item) => <EmailListItem key={item?.id} item={item} />)}
      </div>
      <AddEmailAddress />
      <Separator />
      <PrimaryEmailAddress />
    </div>
  )
}
