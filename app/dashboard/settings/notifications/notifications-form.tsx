'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { cn, fetcher } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

import { useSWRConfig } from 'swr'
import { useAuth } from '@/hooks/use-auth'
import { useNotificationAPI } from '@/hooks/api'
import { NotificationAPI } from '@/types/api'

const FormSchema = z.object({
  marketing_emails: z.boolean(),
  security_emails: z.boolean().refine((val) => val === true),
})

type FormValues = z.infer<typeof FormSchema>

export function NotificationsForm() {
  const { t } = useTranslation()

  const { user } = useAuth()
  const { notification } = useNotificationAPI(user?.id ?? null)
  const { mutate } = useSWRConfig()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      marketing_emails: notification?.marketing_emails ?? false,
      security_emails: true,
    },
  })

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    if (formValues?.marketing_emails === notification?.marketing_emails) {
      toast(t('FormMessage.nothing_has_changed'))
      return false
    }

    try {
      setIsSubmitting(true)

      if (!user?.id) throw new Error('Require is not defined.')

      const fetchUrl = `/api/v1/notification?uid=${user?.id}`
      const result = await fetcher<NotificationAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify(formValues),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="marketing_emails"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {t('NotificationsForm.marketing_emails.label')}
                </FormLabel>
                <FormDescription>
                  {t('NotificationsForm.marketing_emails.description')}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="security_emails"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {t('NotificationsForm.security_emails.label')}
                </FormLabel>
                <FormDescription>
                  {t('NotificationsForm.security_emails.description')}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button disabled={isSubmitting}>
          {t('FormSubmit.update_notifications')}
        </Button>
      </form>
    </Form>
  )
}
