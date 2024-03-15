'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Separator } from '@/components/ui/separator'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { User } from '@supabase/supabase-js'
import { useEmails, Email } from '@/hooks/api/use-emails'

import {
  EmailListItemContext,
  EmailListItemProvider,
} from './email-list-item-provider'
import { DeleteEmailButton } from './delete-email-button'
import { ResendVerificationButton } from './resend-verification-button'

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
    </div>
  )
}

function EmailListItem({ item, user }: { item: Email; user: User }) {
  const state = React.useMemo(
    () => ({
      isVerified: !!item?.email_confirmed_at,
      isPrimary: item?.email === user?.email,
    }),
    [item, user]
  )
  const { t } = useTranslation()

  return (
    <EmailListItemProvider value={state}>
      <div className="space-y-2 rounded-lg border p-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="text-sm font-semibold">
              <span>{item?.email}</span>
              {state?.isPrimary ? (
                <>
                  <span>{' - '}</span>
                  <span className="text-green-700">
                    {t('EmailListItem.title')}
                  </span>
                </>
              ) : null}
            </div>
            <div className="ml-auto">
              <DeleteEmailButton />
            </div>
          </div>
          {state?.isPrimary ? (
            <div className="text-xs">{t('EmailListItem.description')}</div>
          ) : null}
        </div>
        <ul className="list-outside list-disc space-y-2 pl-5">
          <VisibleInEmails />
          <ReceivesNotifications />
          <UnverifiedEmails />
          <NotVisibleInEmails />
        </ul>
      </div>
    </EmailListItemProvider>
  )
}

function VisibleInEmails() {
  const state = React.useContext(EmailListItemContext)
  const { t } = useTranslation()

  if (!state?.isVerified) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('VisibleInEmails.title')}</span>
      <p>{t('VisibleInEmails.description')}</p>
    </li>
  )
}

function ReceivesNotifications() {
  const state = React.useContext(EmailListItemContext)
  const { t } = useTranslation()

  if (!state?.isVerified) return null
  if (!state?.isPrimary) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('ReceivesNotifications.title')}</span>
      <p>{t('ReceivesNotifications.description')}</p>
    </li>
  )
}

function UnverifiedEmails() {
  const state = React.useContext(EmailListItemContext)
  const { t } = useTranslation()

  if (state?.isVerified) return null

  return (
    <li className="text-xs text-muted-foreground">
      <div>
        <span className="font-semibold text-amber-700">
          {t('UnverifiedEmails.title')}
        </span>
        &nbsp;&nbsp;
        <ResendVerificationButton />
      </div>
      <p>{t('UnverifiedEmails.description')}</p>
    </li>
  )
}

function NotVisibleInEmails() {
  const state = React.useContext(EmailListItemContext)
  const { t } = useTranslation()

  if (state?.isVerified) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('NotVisibleInEmails.title')}</span>
      <p>{t('NotVisibleInEmails.description')}</p>
    </li>
  )
}
