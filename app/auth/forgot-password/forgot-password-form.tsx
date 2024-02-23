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

import { ResetPasswordForEmail } from '@/types/supabase'
import { fetcher } from '@/lib/fetch'

const formSchema = z.object({
  email: z.string().email(),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
}

export function ForgotPasswordForm() {
  const { t } = useTranslation(['translation', 'zod', 'zod-custom'])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.append('email', values.email)

    const { data, error } = await fetcher<ResetPasswordForEmail>(
      '/api/v1/auth/forgot-password',
      {
        method: 'POST',
        body: formData,
      }
    )

    if (error) {
      toast.error(error?.message)
      return false
    }

    toast.success(t('the_email_has_been_sent_successfully'))

    form.reset()
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('email')}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  placeholder="name@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />
        <SubmitButton
          isSubmitting={form?.formState?.isSubmitting}
          text="reset_my_password"
          translate="yes"
          className="w-full"
        />
      </form>
    </Form>
  )
}
