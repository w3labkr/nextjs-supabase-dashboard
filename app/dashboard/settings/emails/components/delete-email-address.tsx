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
import { useEmail } from '../context/email-provider'

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { EmailsAPI } from '@/types/api'

export function DeleteEmailAddress() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { mutate } = useSWRConfig()
  const { email, isPrimary } = useEmail()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const handleClick = async () => {
    try {
      setIsSubmitting(true)

      const uid = user?.id

      if (!uid) throw new Error('Require is not defined.')
      if (!email) throw new Error('Require is not defined.')

      const result = await fetcher<EmailsAPI>(`/api/v1/email?uid=${uid}`, {
        method: 'DELETE',
        body: JSON.stringify({ formData: { email } }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(`/api/v1/email/list?uid=${uid}`)

      toast.success(t('FormMessage.deleted_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isPrimary) return null

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="h-auto p-1.5 text-red-700 hover:bg-red-700 hover:text-white"
          disabled={isSubmitting}
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
