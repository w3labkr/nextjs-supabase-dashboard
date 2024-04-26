'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useEmailsAPI } from '@/hooks/api'
import { EmailsAPI } from '@/types/api'

const FormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
})

type FormValues = z.infer<typeof FormSchema>

export function AddEmailAddress() {
  const { t } = useTranslation()

  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)
  const { mutate } = useSWRConfig()

  const defaultValues: Partial<FormValues> = {
    email: '',
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    if (emails?.find((value) => value?.email === formValues?.email)) {
      toast(t('FormMessage.email_has_already_been_added'))
      return false
    }

    try {
      setIsSubmitting(true)

      if (!user?.id) throw new Error('Require is not defined.')

      const fetchUrl = `/api/v1/email/list?uid=${user?.id}`
      const result = await fetcher<EmailsAPI>(fetchUrl, {
        method: 'PUT',
        body: JSON.stringify(formValues),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      const sentUrl = `/api/v1/email/verify?uid=${user?.id}`
      const sent = await fetcher(sentUrl, {
        method: 'POST',
        body: JSON.stringify(formValues),
      })

      if (sent?.error) throw new Error(sent?.error?.message)

      mutate(sentUrl)

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
          <Button disabled={isSubmitting}>{t('FormSubmit.add')}</Button>
        </form>
      </Form>
    </div>
  )
}
