'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Skeleton } from '@/components/ui/skeleton'
import { DeleteEmail } from './components/delete-email'
import { ResendVerifyEmail } from './components/resend-verify-email'

import { Email } from '@/types/database'
import { useAuth } from '@/hooks/use-auth'
import { useEmailsAPI } from '@/queries/client/emails'

const EmailList = () => {
  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)

  if (!emails) return <Skeleton className="h-36 w-full" />

  return (
    <div className="flex flex-col gap-2">
      {emails?.map((item) => <EmailItem key={item?.id} item={item} />)}
    </div>
  )
}

interface EmailItemProps {
  item: Email
}

const EmailItem = ({ item }: EmailItemProps) => {
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
                <span className="text-green-700 dark:text-white">
                  {t('primary_email')}
                </span>
              </>
            ) : null}
          </div>
          <div className="ml-auto">
            {item?.email !== user?.email ? <DeleteEmail item={item} /> : null}
          </div>
        </div>
        {item?.email === user?.email ? (
          <div className="text-xs">
            {t(
              'this_email_will_be_used_for_account_related_notifications_and_may_also_be_used_to_reset_your_password'
            )}
          </div>
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

const VisibleInEmails = ({ item }: EmailItemProps) => {
  const { t } = useTranslation()

  if (!item?.email_confirmed_at) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('visible_in_emails')}</span>
      <p>{t('this_email_may_be_used_as_your_profile_and_author_address')}</p>
    </li>
  )
}

const ReceivesNotifications = ({ item }: EmailItemProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()

  if (!item?.email_confirmed_at) return null
  if (item?.email !== user?.email) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('receives_notifications')}</span>
      <p>{t('this_email_address_is_the_default_used_for_notifications')}</p>
    </li>
  )
}

const UnverifiedEmails = ({ item }: EmailItemProps) => {
  const { t } = useTranslation()

  if (item?.email_confirmed_at) return null

  return (
    <li className="text-xs text-muted-foreground">
      <div>
        <span className="font-semibold text-amber-700 dark:text-white">
          {t('unverified')}
        </span>
        &nbsp;&nbsp;
        <ResendVerifyEmail item={item} />
      </div>
      <p>
        {t(
          'unverified_email_addresses_cannot_receive_notifications_and_cannot_be_used_to_reset_your_password'
        )}
      </p>
    </li>
  )
}

const NotVisibleInEmails = ({ item }: EmailItemProps) => {
  const { t } = useTranslation()

  if (item?.email_confirmed_at) return null

  return (
    <li className="text-xs text-muted-foreground">
      <span>{t('not_visible_in_emails')}</span>
      <p>{t('this_email_cannot_be_used_as_your_profile_or_author_address')}</p>
    </li>
  )
}

export { EmailList }
