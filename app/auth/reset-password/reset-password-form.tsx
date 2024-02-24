'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
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

import { UpdateUser } from '@/types/supabase'
import { fetcher } from '@/lib/fetch'

const formSchema = z
  .object({
    newPassword: z.string().trim().min(6).max(72),
    confirmNewPassword: z.string().trim().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'FormMessage.invalid_confirm_password' },
  })

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  newPassword: '',
  confirmNewPassword: '',
}

export function ResetPasswordForm() {
  const router = useRouter()
  const { t } = useTranslation(['translation', 'zod'])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.append('password', values.newPassword)

    const { error } = await fetcher<UpdateUser>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: formData,
    })

    if (error) {
      switch (error?.i18n) {
        case 'new_password_should_be_different_from_the_old_password':
          form.setError('newPassword', {
            message: t(`FormMessage.${error?.i18n}`),
          })
          break
        default:
          toast.error(error?.message)
          break
      }
      return false
    }

    toast.success(t('FormMessage.your_password_has_been_successfully_changed'))

    form.reset()
    router.replace('/auth/signin')
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
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FormLabel.new_password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('FormLabel.new_password')}
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
              <FormLabel>{t('FormLabel.confirm_new_password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  placeholder={t('FormLabel.confirm_new_password')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          isSubmitting={form?.formState?.isSubmitting}
          className="w-full"
          text="ResetPasswordForm.submit"
          translate="yes"
        />
      </form>
    </Form>
  )
}
