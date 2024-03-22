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

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { useEmails } from '@/hooks/api/use-emails'
import { User } from '@supabase/supabase-js'

const FormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
})

type FormValues = z.infer<typeof FormSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
}

export function AddEmailAddress({ user }: { user: User | null }) {
  const { t } = useTranslation()

  const fetchEmails = useEmails(user?.id ?? null)
  const { data: emails } = fetchEmails

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  })

  const { mutate } = useSWRConfig()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      if (emails?.find((values) => values.email === formValues?.email)) {
        throw new Error(t('FormMessage.email_has_already_been_added'))
      }

      if (!user?.id) throw new Error('Something went wrong.')

      const inserted = await fetcher(`/api/v1/email/${user?.id}`, {
        method: 'PUT',
        body: JSON.stringify(formValues),
      })
      if (inserted?.error) throw new Error(inserted?.error?.message)

      const sent = await fetcher(`/api/v1/email/verify/${user?.id}`, {
        method: 'POST',
        body: JSON.stringify(formValues),
      })
      if (sent?.error) throw new Error(sent?.error?.message)

      mutate(`/api/v1/emails/${user?.id}`)
      form.reset()
      toast.success(t('FormMessage.email_has_been_added_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (fetchEmails?.isLoading) return null

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
