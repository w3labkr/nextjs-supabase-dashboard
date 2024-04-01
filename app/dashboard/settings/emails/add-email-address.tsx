'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { SubmitButton } from '@/components/submit-button'

import useSWRMutation from 'swr/mutation'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useEmails } from '@/hooks/sync/use-emails'

const FormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
})

type FormValues = z.infer<typeof FormSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
}

async function sendRequest(url: string, { arg }: { arg: FormValues }) {
  return await fetcher(url, {
    method: 'PUT',
    body: JSON.stringify(arg),
  })
}

export function AddEmailAddress() {
  const { t } = useTranslation()

  const { user } = useAuth()
  const { emails } = useEmails(user?.id ?? null)
  const { trigger } = useSWRMutation(
    user?.id ? `/api/v1/emails/${user?.id}` : null,
    sendRequest
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      if (emails?.find((values) => values.email === formValues?.email)) {
        throw new Error(t('FormMessage.email_has_already_been_added'))
      }

      await trigger(formValues)

      const sent = await fetcher(`/api/v1/email/verify/${user?.id}`, {
        method: 'POST',
        body: JSON.stringify(formValues),
      })
      if (sent?.error) throw new Error(sent?.error?.message)

      form.reset()
      toast.success(t('FormMessage.added_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm font-semibold">
          {t('AddEmailAddress.title')}
        </span>
        {/* <p className="text-xs">{t('AddEmailAddress.description')}</p> */}
      </div>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex w-full max-w-sm space-x-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>{t('FormLabel.email')}</FormLabel> */}
                <FormControl className="w-[180px]">
                  <Input
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    placeholder="name@example.com"
                    {...field}
                  />
                </FormControl>
                {/* <FormDescription></FormDescription> */}
                <FormMessage className="font-normal" />
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={isSubmitting}
            text="FormSubmit.add"
            translate="yes"
          />
        </form>
      </Form>
    </div>
  )
}
