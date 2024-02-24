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
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/submit-button'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { AuthPostgrestApi } from '@/types/api'
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
    params: { i18n: 'FormMessage.invalid_confirm_password' },
  })

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

export function ChangePasswordForm() {
  const { t } = useTranslation(['translation', 'zod'])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormValues) {
    const formData = new FormData()
    formData.append('oldPassword', values.oldPassword)
    formData.append('newPassword', values.newPassword)

    const { error } = await fetcher<AuthPostgrestApi>(
      '/api/v1/security/change-password',
      {
        method: 'POST',
        body: formData,
      }
    )

    if (error) {
      switch (error?.i18n) {
        case 'invalid_old_password':
        case 'new_password_should_be_different_from_the_old_password':
          form.setError('oldPassword', {
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
  }

  return (
    <div className="space-y-4">
      <Title text="ChangePasswordForm.title" translate="yes" />
      <Separator />
      <Description text="ChangePasswordForm.description" translate="yes" />
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem className="max-w-80">
                <FormLabel>{t('FormLabel.old_password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    autoCorrect="off"
                    placeholder={t('FormLabel.old_password')}
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
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={form?.formState?.isSubmitting}
            text="ChangePasswordForm.submit"
            translate="yes"
          />
        </form>
      </Form>
    </div>
  )
}
