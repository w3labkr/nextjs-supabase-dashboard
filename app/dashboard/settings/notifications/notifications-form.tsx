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
import { SubmitButton } from '@/components/submit-button'

import useSWRMutation from 'swr/mutation'
import { useAuth } from '@/hooks/use-auth'
import { useNotificationAPI } from '@/hooks/api'

const FormSchema = z.object({
  marketing_emails: z.boolean(),
  security_emails: z.boolean().refine((val) => val === true),
})

type FormValues = z.infer<typeof FormSchema>

async function sendRequest(url: string, { arg }: { arg: FormValues }) {
  return await fetcher(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  })
}

export function NotificationsForm() {
  const { t } = useTranslation()

  const { user } = useAuth()
  const { notification } = useNotificationAPI(user?.id ?? null)
  const { trigger } = useSWRMutation(
    user?.id ? `/api/v1/notification/${user?.id}` : null,
    sendRequest
  )

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

      if (notification?.marketing_emails == null) {
        throw new Error('Require is not defined.')
      }

      const result = await trigger(formValues)
      if (result?.error) throw new Error(result?.error?.message)

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
        <SubmitButton
          isSubmitting={isSubmitting}
          text="FormSubmit.update_notifications"
          translate="yes"
        />
      </form>
    </Form>
  )
}
