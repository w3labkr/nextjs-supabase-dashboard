'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { DeleteEmailAddress } from './components/delete-email-address'
import { ResendVerifyEmail } from './components/resend-verify-email'

import { useAuth } from '@/hooks/use-auth'
import { useEmailsAPI } from '@/queries/sync'
import { Email } from '@/types/database'

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

  return (
    <div className="space-y-2 rounded-lg border p-4">
      <div className="flex flex-col">
        <div className="flex items-center">
          <div className="text-sm font-semibold">
            <span>{item?.email}</span>
            {item?.email === user?.email ? (
              <>
                <span>{' - '}</span>
                <span className="text-green-700">{t('EmailItem.title')}</span>
              </>
            ) : null}
          </div>
          <div className="ml-auto">
            {item?.email !== user?.email ? (
              <DeleteEmailAddress item={item} />
            ) : null}
          </div>
        </div>
        {item?.email === user?.email ? (
          <div className="text-xs">{t('EmailItem.description')}</div>
        ) : null}
      </div>
      <ul className="list-outside list-disc space-y-2 pl-5">
        <VisibleInEmails item={item} />
        <ReceivesNotifications item={item} />
        <UnverifiedEmails item={item} />
        <NotVisibleInEmails item={item} />
      </ul>
    </div>
  )
}

function VisibleInEmails({ item }: { item: Email }) {
  const { t } = useTranslation()

  if (!item?.email_confirmed_at) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('VisibleInEmails.title')}</span>
      <p>{t('VisibleInEmails.description')}</p>
    </li>
  )
}

function ReceivesNotifications({ item }: { item: Email }) {
  const { t } = useTranslation()
  const { user } = useAuth()

  if (!item?.email_confirmed_at) return null
  if (item?.email !== user?.email) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('ReceivesNotifications.title')}</span>
      <p>{t('ReceivesNotifications.description')}</p>
    </li>
  )
}

function UnverifiedEmails({ item }: { item: Email }) {
  const { t } = useTranslation()

  if (item?.email_confirmed_at) return null

  return (
    <li className="text-xs text-muted-foreground">
      <div>
        <span className="font-semibold text-amber-700">
          {t('UnverifiedEmails.title')}
        </span>
        &nbsp;&nbsp;
        <ResendVerifyEmail item={item} />
      </div>
      <p>{t('UnverifiedEmails.description')}</p>
    </li>
  )
}

function NotVisibleInEmails({ item }: { item: Email }) {
  const { t } = useTranslation()

  if (item?.email_confirmed_at) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('NotVisibleInEmails.title')}</span>
      <p>{t('NotVisibleInEmails.description')}</p>
    </li>
  )
}
