'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { EmailProvider, useEmail } from './context/email-provider'
import { DeleteEmailAddress } from './components/delete-email-address'
import { ResendVerifyEmail } from './components/resend-verify-email'

import { Email } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { useEmailsAPI } from '@/queries/sync'

export function EmailList() {
  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)

  if (!emails) return <div>Loading...</div>

  return (
    <div className="flex flex-col gap-2">
      {emails?.map((item) => <EmailItem key={item?.id} item={item} />)}
    </div>
  )
}

function EmailItem({ item }: { item: Email }) {
  const { t } = useTranslation()
  const { user } = useAuth()

  const value = React.useMemo(() => {
    return {
      isVerified: !!item?.email_confirmed_at,
      isPrimary: item?.email === user?.email,
      email: item?.email,
      email_confirmed_at: item?.email_confirmed_at,
    }
  }, [item, user?.email])

  return (
    <EmailProvider value={value}>
      <div className="space-y-2 rounded-lg border p-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <div className="text-sm font-semibold">
              <span>{item?.email}</span>
              {value?.isPrimary ? (
                <>
                  <span>{' - '}</span>
                  <span className="text-green-700">{t('EmailItem.title')}</span>
                </>
              ) : null}
            </div>
            <div className="ml-auto">
              {!value?.isPrimary ? <DeleteEmailAddress /> : null}
            </div>
          </div>
          {value?.isPrimary ? (
            <div className="text-xs">{t('EmailItem.description')}</div>
          ) : null}
        </div>
        <ul className="list-outside list-disc space-y-2 pl-5">
          <VisibleInEmails />
          <ReceivesNotifications />
          <UnverifiedEmails />
          <NotVisibleInEmails />
        </ul>
      </div>
    </EmailProvider>
  )
}

function VisibleInEmails() {
  const { t } = useTranslation()
  const { isVerified } = useEmail()

  if (!isVerified) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('VisibleInEmails.title')}</span>
      <p>{t('VisibleInEmails.description')}</p>
    </li>
  )
}

function ReceivesNotifications() {
  const { t } = useTranslation()
  const { isVerified, isPrimary } = useEmail()

  if (!isVerified) return null
  if (!isPrimary) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('ReceivesNotifications.title')}</span>
      <p>{t('ReceivesNotifications.description')}</p>
    </li>
  )
}

function UnverifiedEmails() {
  const { t } = useTranslation()
  const { isVerified } = useEmail()

  if (isVerified) return null

  return (
    <li className="text-xs text-muted-foreground">
      <div>
        <span className="font-semibold text-amber-700">
          {t('UnverifiedEmails.title')}
        </span>
        &nbsp;&nbsp;
        <ResendVerifyEmail />
      </div>
      <p>{t('UnverifiedEmails.description')}</p>
    </li>
  )
}

function NotVisibleInEmails() {
  const { t } = useTranslation()
  const { isVerified } = useEmail()

  if (isVerified) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('NotVisibleInEmails.title')}</span>
      <p>{t('NotVisibleInEmails.description')}</p>
    </li>
  )
}
