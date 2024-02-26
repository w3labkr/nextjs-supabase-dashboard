'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

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
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'

import { createClient } from '@/lib/supabase/client'

const formSchema = z.object({
  email: z.string().email(),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
}

export function ForgotPasswordForm() {
  const { t } = useTranslation()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo:
            process.env.NEXT_PUBLIC_SITE_URL +
            '/api/v1/auth/confirm?next=/auth/reset-password',
        }
      )

      if (error) throw new Error(error?.message)

      toast.success(t('FormMessage.the_email_has_been_sent_successfully'))

      form.reset()
    } catch (e: unknown) {
      const error = e as Error
      toast.error(error?.message)
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FormLabel.email')}</FormLabel>
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
          isSubmitting={isSubmitting}
          text="ForgotPasswordForm.submit"
          translate="yes"
          className="w-full"
        />
      </form>
    </Form>
  )
}
