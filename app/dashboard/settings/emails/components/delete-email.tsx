'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { type EmailsAPI } from '@/types/api'
import { type Email } from '@/types/database'

interface DeleteEmailProps {
  item: Email
}

const DeleteEmail = ({ item }: DeleteEmailProps) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onClick = async () => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')
      if (!item) throw new Error('Require is not defined.')

      const result = await fetcher<EmailsAPI>(
        `/api/v1/email?userId=${user?.id}`,
        {
          method: 'DELETE',
          body: JSON.stringify({
            data: { email: item?.email },
          }),
        }
      )

      if (result?.error) throw new Error(result?.error?.message)

      mutate(`/api/v1/email/list?userId=${user?.id}`)

      toast.success(t('deleted_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (item?.email === user?.email) return null

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="h-auto p-1.5 text-destructive hover:bg-destructive hover:text-white"
          disabled={isSubmitting}
        >
          <LucideIcon name="Trash" className="size-4 min-w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('are_you_sure_you_want_to_remove_this_email_from_your_account')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              'once_deleted_this_email_address_will_no_longer_be_associated_with_your_account'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>
            {t('continue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteEmail }
