'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { useTranslation } from 'react-i18next'
import { i18nKey } from '@/utils/string'

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

import { createClient } from '@/lib/supabase/client'

const formSchema = z
  .object({
    newPassword: z.string().trim().min(6).max(72),
    confirmNewPassword: z.string().trim().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  newPassword: '',
  confirmNewPassword: '',
}

export function ResetPasswordForm() {
  const router = useRouter()
  const { t } = useTranslation(['translation', 'zod', 'zod-custom'])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormValues) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.updateUser({
      password: values.newPassword,
    })

    if (error) {
      const message = i18nKey(error?.message)

      switch (message) {
        case 'new_password_should_be_different_from_the_old_password':
          form.setError('newPassword', { message: t(message) })
          break
        case 'auth_session_missing':
        case 'failed_to_fetch':
          toast.error(t(message))
          break
        default:
          toast.error(error?.message)
          break
      }

      return false
    }

    toast.success(t('your_password_has_been_successfully_changed'))

    if (data?.user) {
      const { error } = await supabase.auth.signOut()
      if (error) {
        toast.error(error?.message)
        return false
      }
    }

    form.reset()

    router.push('/auth/signin')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('new_password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('new_password')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('confirm_new_password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('confirm_new_password')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          isSubmitting={form?.formState?.isSubmitting}
          text="change_password"
          translate="yes"
          className="w-full"
        />
      </form>
    </Form>
  )
}
