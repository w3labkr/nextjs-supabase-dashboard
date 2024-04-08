'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { cn, fetcher } from '@/lib/utils'
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
import { EmailItemContext } from './email-item-provider'

import useSWRMutation from 'swr/mutation'
import { useAuth } from '@/hooks/use-auth'

type FormValues = { email: string }

async function sendRequest(url: string, { arg }: { arg: FormValues }) {
  return await fetcher(url, {
    method: 'DELETE',
    body: JSON.stringify(arg),
  })
}

export function DeleteEmailAddress() {
  const state = React.useContext(EmailItemContext)
  const { t } = useTranslation()

  const { user } = useAuth()
  const { trigger } = useSWRMutation(
    user?.id ? `/api/v1/emails/${user?.id}` : null,
    sendRequest
  )

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      if (!state?.email) throw new Error('Require is not defined.')

      const formValues: FormValues = { email: state?.email }
      const result = await trigger(formValues)

      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.deleted_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (state?.isPrimary) return null

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="h-auto p-1.5 text-red-700 hover:bg-red-700 hover:text-white"
        >
          <LucideIcon name="Trash" className="size-4 min-w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('DeleteEmailAddress.AlertDialogTitle')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('DeleteEmailAddress.AlertDialogDescription')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {t('DeleteEmailAddress.AlertDialogCancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            {t('DeleteEmailAddress.AlertDialogAction')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
