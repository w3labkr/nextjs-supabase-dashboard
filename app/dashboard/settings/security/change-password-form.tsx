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

import { fetcher } from '@/lib/fetch'

const formSchema = z
  .object({
    // If the password is larger than 72 chars, it will be truncated to the first 72 chars.
    oldPassword: z.string().trim().min(6).max(72),
    newPassword: z.string().trim().min(6).max(72),
    confirmNewPassword: z.string().trim().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

export function ChangePasswordForm() {
  const { t } = useTranslation(['translation', 'zod', 'zod-custom'])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.append('oldPassword', values.oldPassword)
    formData.append('newPassword', values.newPassword)

    const { error } = await fetcher('/api/v1/account/change-password', {
      method: 'POST',
      body: formData,
    })

    if (error) {
      switch (error?.i18n) {
        case 'invalid_old_password':
        case 'new_password_should_be_different_from_the_old_password':
          form.setError('oldPassword', { message: t(error?.i18n) })
          break
        default:
          toast.error(error?.message)
          break
      }
      return false
    }

    toast.success(t('your_password_has_been_successfully_changed'))

    form.reset()
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem className="max-w-80">
              <FormLabel>{t('old_password')}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect="off"
                  placeholder={t('old_password')}
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="max-w-80">
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
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem className="max-w-80">
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
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Your password must be at least 6 characters long and must be
            different from your previous password.
          </p>
          <SubmitButton
            isSubmitting={form?.formState?.isSubmitting}
            text="update_password"
            translate="yes"
          />
        </div>
      </form>
    </Form>
  )
}
