'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
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
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import useSWRMutation from 'swr/mutation'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useNotification } from '@/hooks/sync/use-notifications'

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
  const { notification } = useNotification(user?.id ?? null)
  const { trigger } = useSWRMutation(
    user?.id ? `/api/v1/notification/${user?.id}` : null,
    sendRequest
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      marketing_emails: notification?.marketing,
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
      await trigger(formValues)
      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Title text="NotificationsForm.title" translate="yes" />
      <Description text="NotificationsForm.description" translate="yes" />
      <Separator />
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
            text="NotificationsForm.submit"
            translate="yes"
          />
        </form>
      </Form>
    </div>
  )
}
